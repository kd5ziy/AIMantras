/**
 * Spawn Agent Tool - Spawn an isolated AI agent with a specific persona
 *
 * Supports both synchronous (wait for result) and asynchronous (return immediately) modes.
 * Multi-provider support: Anthropic Claude and OpenAI GPT models.
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { LLMProvider } from '../types/agent.js';
import { loadAgentConfig, isProviderConfigured, getDefaultModel } from '../utils/config.js';
import { getAgentStore, createAgent } from '../utils/agent-store.js';
import { callAgent } from '../utils/llm-client.js';
import { buildSystemPrompt, buildUserMessage } from '../utils/prompt-builder.js';
import { loadManifest } from '../utils/content-loader.js';

export const spawnAgentTool: Tool = {
  name: 'spawn_agent',
  description: `Spawn an isolated AI agent with a specific persona to perform a task.

The agent runs in complete context isolation - it only sees:
- Its persona definition
- The task and inputs you provide
- Any requested thinking patterns

Use this for:
- Delegating specialized analysis to domain experts
- Getting independent perspectives without context bleeding
- Parallel task execution (with async mode)

**Providers:** anthropic (Claude), openai (GPT)
**Default:** Uses MANTRAS_DEFAULT_PROVIDER env var, or anthropic if not set

Returns the agent's response (sync) or agent_id for polling (async).`,
  inputSchema: {
    type: 'object',
    properties: {
      persona: {
        type: 'string',
        description: 'Name of the persona to use (e.g., "Clara-Financial-Analyst", "Kestra-Systems-Architect"). Use list_available to see options.',
      },
      task: {
        type: 'string',
        description: 'Clear description of what the agent should do',
      },
      inputs: {
        type: 'object',
        description: 'Context data to provide to the agent (e.g., { "document": "...", "question": "..." })',
      },
      success_criteria: {
        type: 'string',
        description: 'How to determine if the task was completed successfully',
      },
      patterns: {
        type: 'array',
        items: { type: 'string' },
        description: 'Thinking patterns for the agent to apply (e.g., ["chain-of-thought", "rule-based-reasoning"])',
      },
      provider: {
        type: 'string',
        enum: ['anthropic', 'openai'],
        description: 'LLM provider to use. Default: anthropic (or MANTRAS_DEFAULT_PROVIDER)',
      },
      model: {
        type: 'string',
        description: 'Specific model to use. Defaults: claude-sonnet-4-20250514 (anthropic), gpt-4o (openai)',
      },
      async: {
        type: 'boolean',
        description: 'If true, return immediately with agent_id. Use get_agent_result to poll for completion.',
      },
      max_tokens: {
        type: 'number',
        description: 'Maximum tokens in response. Default: 4096',
      },
      timeout_ms: {
        type: 'number',
        description: 'Timeout in milliseconds. Default: 120000 (2 minutes)',
      },
    },
    required: ['persona', 'task'],
  },
};

export interface SpawnAgentArgs {
  persona: string;
  task: string;
  inputs?: Record<string, unknown>;
  success_criteria?: string;
  patterns?: string[];
  provider?: LLMProvider;
  model?: string;
  async?: boolean;
  max_tokens?: number;
  timeout_ms?: number;
}

export async function handleSpawnAgent(args: Record<string, unknown>): Promise<string> {
  const typedArgs = args as unknown as SpawnAgentArgs;
  const {
    persona,
    task,
    inputs,
    success_criteria,
    patterns,
    provider: requestedProvider,
    model: requestedModel,
    async: asyncMode = false,
    max_tokens = 4096,
    timeout_ms,
  } = typedArgs;

  // Validate persona exists
  const manifest = loadManifest();
  const allPersonas = [
    ...manifest.personas.orchestration.members,
    ...manifest.personas.domain.members,
    ...manifest.personas.evaluation.members,
  ];
  const personaExists = allPersonas.some(
    p => p.name === persona || p.name.toLowerCase() === persona.toLowerCase()
  );
  if (!personaExists) {
    const available = allPersonas.map(p => p.name).join(', ');
    throw new Error(
      `Persona not found: "${persona}"\n\nAvailable personas: ${available}\n\nUse list_available tool to see all personas with descriptions.`
    );
  }

  // Determine provider and model
  const config = loadAgentConfig();
  const provider = requestedProvider || config.defaultProvider;
  const model = requestedModel || (requestedProvider ? getDefaultModel(requestedProvider) : config.defaultModel);

  // Validate provider is configured
  if (!isProviderConfigured(provider)) {
    const envVar = provider === 'anthropic' ? 'ANTHROPIC_API_KEY' : 'OPENAI_API_KEY';
    throw new Error(
      `${provider} provider is not configured.\n\nPlease set the ${envVar} environment variable.`
    );
  }

  // Build prompts
  const systemPrompt = buildSystemPrompt({
    persona,
    task,
    inputs,
    successCriteria: success_criteria,
    patterns,
  });

  const userMessage = buildUserMessage({
    persona,
    task,
    inputs,
    successCriteria: success_criteria,
    patterns,
  });

  // Create agent record
  const agent = createAgent({
    persona,
    task,
    inputs,
    success_criteria,
    patterns,
    provider,
    model,
  });

  const store = getAgentStore();
  store.add(agent);

  // Async mode: start execution in background and return immediately
  if (asyncMode) {
    // Check concurrency limits
    if (!store.canSpawnAsync()) {
      store.update(agent.id, { status: 'failed', error: 'Max concurrent agents reached' });
      throw new Error(
        `Maximum concurrent agents (${config.maxConcurrentAgents}) reached.\n\n` +
        `Use list_agents to see running agents, or use sync mode (async: false).`
      );
    }

    // Start async execution
    executeAgentAsync(agent.id, {
      provider,
      model,
      systemPrompt,
      userMessage,
      maxTokens: max_tokens,
      timeoutMs: timeout_ms || config.defaultTimeoutMs,
    });

    return formatAsyncResponse(agent.id, persona, task);
  }

  // Sync mode: wait for completion
  store.update(agent.id, { status: 'running', started_at: new Date() });

  try {
    const result = await callAgent({
      provider,
      model,
      systemPrompt,
      userMessage,
      maxTokens: max_tokens,
      timeoutMs: timeout_ms || config.defaultTimeoutMs,
    });

    store.update(agent.id, {
      status: 'completed',
      completed_at: new Date(),
      result: result.content,
      usage: result.usage,
    });

    return formatSyncResponse(agent.id, persona, result.content, result.usage, model);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isTimeout = errorMessage.includes('abort') || errorMessage.includes('timeout');

    store.update(agent.id, {
      status: isTimeout ? 'timeout' : 'failed',
      completed_at: new Date(),
      error: errorMessage,
    });

    if (isTimeout) {
      throw new Error(
        `Agent timed out after ${(timeout_ms || config.defaultTimeoutMs) / 1000} seconds.\n\n` +
        `Options:\n` +
        `- Increase timeout_ms parameter\n` +
        `- Use async mode and poll with get_agent_result\n` +
        `- Simplify the task`
      );
    }

    throw new Error(`Agent execution failed: ${errorMessage}`);
  }
}

/**
 * Execute agent asynchronously (fire and forget)
 */
function executeAgentAsync(
  agentId: string,
  options: {
    provider: LLMProvider;
    model: string;
    systemPrompt: string;
    userMessage: string;
    maxTokens: number;
    timeoutMs: number;
  }
): void {
  const store = getAgentStore();
  store.update(agentId, { status: 'running', started_at: new Date() });

  callAgent(options)
    .then(result => {
      store.update(agentId, {
        status: 'completed',
        completed_at: new Date(),
        result: result.content,
        usage: result.usage,
      });
    })
    .catch(error => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isTimeout = errorMessage.includes('abort') || errorMessage.includes('timeout');

      store.update(agentId, {
        status: isTimeout ? 'timeout' : 'failed',
        completed_at: new Date(),
        error: errorMessage,
      });
    });
}

/**
 * Format response for sync mode
 */
function formatSyncResponse(
  agentId: string,
  persona: string,
  content: string,
  usage: { input_tokens: number; output_tokens: number },
  model: string
): string {
  return `# Agent Response

**Agent ID:** ${agentId}
**Persona:** ${persona}
**Model:** ${model}
**Tokens:** ${usage.input_tokens} in / ${usage.output_tokens} out

---

${content}`;
}

/**
 * Format response for async mode
 */
function formatAsyncResponse(agentId: string, persona: string, task: string): string {
  return `# Agent Spawned (Async)

**Agent ID:** \`${agentId}\`
**Persona:** ${persona}
**Status:** running

The agent is now executing in the background.

To check status and retrieve results:
\`\`\`
get_agent_result({ agent_id: "${agentId}" })
\`\`\`

**Task:** ${task.length > 100 ? task.substring(0, 100) + '...' : task}`;
}
