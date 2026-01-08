/**
 * Tools Index - Registers and routes all MCP tools
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { assessComplexityTool, handleAssessComplexity } from './assess-complexity.js';
import { getPersonaTool, handleGetPersona } from './get-persona.js';
import { getPatternTool, handleGetPattern } from './get-pattern.js';
import { getWorkflowTool, handleGetWorkflow } from './get-workflow.js';
import { createHandoffTool, handleCreateHandoff } from './create-handoff.js';
import { listAvailableTool, handleListAvailable } from './list-available.js';

/**
 * Register all tools
 */
export function registerTools(): Tool[] {
  return [
    assessComplexityTool,
    getPersonaTool,
    getPatternTool,
    getWorkflowTool,
    createHandoffTool,
    listAvailableTool,
  ];
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
      case 'assess_complexity':
        result = await handleAssessComplexity(args);
        break;
      case 'get_persona':
        result = await handleGetPersona(args);
        break;
      case 'get_pattern':
        result = await handleGetPattern(args);
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
