/**
 * Get Agent Result Tool - Retrieve results from a spawned agent
 *
 * Used to poll for completion of async agents or retrieve results
 * from previously completed agents.
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { getAgentStore } from '../utils/agent-store.js';

export const getAgentResultTool: Tool = {
  name: 'get_agent_result',
  description: `Retrieve the status and result of a spawned agent.

Use this to:
- Poll for completion of async agents
- Retrieve results from completed agents
- Check why an agent failed

Returns status, result (if completed), error (if failed), and usage stats.`,
  inputSchema: {
    type: 'object',
    properties: {
      agent_id: {
        type: 'string',
        description: 'The agent ID returned from spawn_agent (e.g., "agent_abc12345")',
      },
    },
    required: ['agent_id'],
  },
};

export async function handleGetAgentResult(args: Record<string, unknown>): Promise<string> {
  const agentId = args.agent_id as string;

  if (!agentId) {
    throw new Error('agent_id is required');
  }

  const store = getAgentStore();
  const agent = store.get(agentId);

  if (!agent) {
    throw new Error(
      `Agent not found: ${agentId}\n\n` +
      `The agent may have been cleaned up (agents are removed 30 minutes after completion).\n` +
      `Use list_agents to see available agents.`
    );
  }

  // Format response based on status
  const lines: string[] = [
    `# Agent Status: ${agent.status.toUpperCase()}`,
    '',
    `**Agent ID:** ${agent.id}`,
    `**Persona:** ${agent.persona}`,
    `**Provider:** ${agent.provider}`,
    `**Model:** ${agent.model}`,
    `**Created:** ${agent.created_at.toISOString()}`,
  ];

  if (agent.started_at) {
    lines.push(`**Started:** ${agent.started_at.toISOString()}`);
  }

  if (agent.completed_at) {
    lines.push(`**Completed:** ${agent.completed_at.toISOString()}`);
    const duration = agent.completed_at.getTime() - (agent.started_at?.getTime() || agent.created_at.getTime());
    lines.push(`**Duration:** ${(duration / 1000).toFixed(1)}s`);
  }

  lines.push('');
  lines.push(`**Task:** ${agent.task.length > 200 ? agent.task.substring(0, 200) + '...' : agent.task}`);

  if (agent.success_criteria) {
    lines.push(`**Success Criteria:** ${agent.success_criteria}`);
  }

  if (agent.patterns && agent.patterns.length > 0) {
    lines.push(`**Patterns:** ${agent.patterns.join(', ')}`);
  }

  // Status-specific content
  switch (agent.status) {
    case 'pending':
      lines.push('');
      lines.push('*Agent is queued and waiting to start.*');
      break;

    case 'running':
      lines.push('');
      lines.push('*Agent is currently executing. Check again shortly.*');
      break;

    case 'completed':
      if (agent.usage) {
        lines.push('');
        lines.push(`**Tokens:** ${agent.usage.input_tokens} in / ${agent.usage.output_tokens} out`);
      }
      lines.push('');
      lines.push('---');
      lines.push('');
      lines.push('## Result');
      lines.push('');
      lines.push(agent.result || '*No result content*');
      break;

    case 'failed':
      lines.push('');
      lines.push('---');
      lines.push('');
      lines.push('## Error');
      lines.push('');
      lines.push(`\`\`\`\n${agent.error || 'Unknown error'}\n\`\`\``);
      lines.push('');
      lines.push('**Suggestions:**');
      lines.push('- Check that the API key is valid');
      lines.push('- Verify the model name is correct');
      lines.push('- Try again with a simpler task');
      break;

    case 'timeout':
      lines.push('');
      lines.push('---');
      lines.push('');
      lines.push('## Timeout');
      lines.push('');
      lines.push('The agent did not complete within the allowed time.');
      lines.push('');
      lines.push('**Suggestions:**');
      lines.push('- Increase timeout_ms when spawning');
      lines.push('- Break the task into smaller parts');
      lines.push('- Use a faster model');
      break;
  }

  return lines.join('\n');
}
