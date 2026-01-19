/**
 * Tools Index - Registers and routes all MCP tools
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { assessComplexityTool, handleAssessComplexity } from './assess-complexity.js';
import { getPersonaTool, handleGetPersona } from './get-persona.js';
import { getPatternTool, handleGetPattern } from './get-pattern.js';
import { getSkillTool, handleGetSkill } from './get-skill.js';
import { getWorkflowTool, handleGetWorkflow } from './get-workflow.js';
import { createHandoffTool, handleCreateHandoff } from './create-handoff.js';
import { listAvailableTool, handleListAvailable } from './list-available.js';
import { bootstrapSessionTool, handleBootstrapSession } from './bootstrap-session.js';
import { spawnAgentTool, handleSpawnAgent } from './spawn-agent.js';
import { getAgentResultTool, handleGetAgentResult } from './get-agent-result.js';
import { listAgentsTool, handleListAgents } from './list-agents.js';
import { isMultiAgentEnabled } from '../utils/config.js';

/**
 * Register all tools
 *
 * Multi-agent tools (spawn_agent, get_agent_result, list_agents) are only
 * registered when MANTRAS_MULTI_AGENT_ENABLED=true.
 *
 * Single-agent mode (default): All personas run on one AI model
 * Multi-agent mode: Each persona can spawn as a separate isolated agent
 */
export function registerTools(): Tool[] {
  const coreTools: Tool[] = [
    bootstrapSessionTool,  // Primary tool - use this for most sessions
    assessComplexityTool,
    getPersonaTool,
    getPatternTool,
    getSkillTool,
    getWorkflowTool,
    createHandoffTool,
    listAvailableTool,
  ];

  // Only register multi-agent tools if enabled
  if (isMultiAgentEnabled()) {
    return [
      ...coreTools,
      spawnAgentTool,
      getAgentResultTool,
      listAgentsTool,
    ];
  }

  return coreTools;
}

/**
 * Route tool calls to handlers
 */
export async function handleToolCall(
  toolName: string,
  args: Record<string, unknown>
): Promise<{ content: { type: string; text: string }[]; isError?: boolean }> {
  try {
    let result: string;

    switch (toolName) {
      case 'bootstrap_session':
        result = await handleBootstrapSession(args);
        break;
      case 'assess_complexity':
        result = await handleAssessComplexity(args);
        break;
      case 'get_persona':
        result = await handleGetPersona(args);
        break;
      case 'get_pattern':
        result = await handleGetPattern(args);
        break;
      case 'get_skill':
        result = await handleGetSkill(args);
        break;
      case 'get_workflow':
        result = await handleGetWorkflow(args);
        break;
      case 'create_handoff':
        result = await handleCreateHandoff(args);
        break;
      case 'list_available':
        result = await handleListAvailable(args);
        break;
      case 'spawn_agent':
        result = await handleSpawnAgent(args);
        break;
      case 'get_agent_result':
        result = await handleGetAgentResult(args);
        break;
      case 'list_agents':
        result = await handleListAgents(args);
        break;
      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${toolName}` }],
          isError: true,
        };
    }

    return { content: [{ type: 'text', text: result }] };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
}
