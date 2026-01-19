/**
 * List Agents Tool - List spawned agents with optional filtering
 *
 * Shows all agents tracked in the current session with their status,
 * persona, and basic timing information.
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { AgentStatus } from '../types/agent.js';
import { getAgentStore } from '../utils/agent-store.js';

export const listAgentsTool: Tool = {
  name: 'list_agents',
  description: `List all spawned agents in the current session.

Filter by status to see:
- pending: Queued, not yet started
- running: Currently executing
- completed: Finished successfully
- failed: Encountered an error
- timeout: Exceeded time limit
- all: Show all agents (default)

Returns a summary table with agent IDs, personas, status, and timing.`,
  inputSchema: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['pending', 'running', 'completed', 'failed', 'timeout', 'all'],
        description: 'Filter by agent status. Default: all',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of agents to return. Default: 20',
      },
    },
  },
};

export async function handleListAgents(args: Record<string, unknown>): Promise<string> {
  const status = (args.status as AgentStatus | 'all') || 'all';
  const limit = (args.limit as number) || 20;

  const store = getAgentStore();
  let agents = store.list({ status });

  // Apply limit
  if (agents.length > limit) {
    agents = agents.slice(0, limit);
  }

  const totalCount = store.getTotalCount();
  const runningCount = store.getRunningCount();

  // Build response
  const lines: string[] = [
    '# Spawned Agents',
    '',
    `**Total:** ${totalCount} | **Running:** ${runningCount} | **Showing:** ${agents.length}`,
  ];

  if (status !== 'all') {
    lines.push(`**Filter:** ${status}`);
  }

  if (agents.length === 0) {
    lines.push('');
    lines.push('*No agents found.*');
    lines.push('');
    lines.push('Use `spawn_agent` to create a new agent.');
    return lines.join('\n');
  }

  lines.push('');
  lines.push('| ID | Persona | Status | Provider | Duration | Task |');
  lines.push('|---|---|---|---|---|---|');

  for (const agent of agents) {
    const taskPreview = agent.task.length > 30
      ? agent.task.substring(0, 30).replace(/\|/g, '\\|') + '...'
      : agent.task.replace(/\|/g, '\\|');

    let duration = '-';
    if (agent.status === 'running' && agent.started_at) {
      const elapsed = Date.now() - agent.started_at.getTime();
      duration = `${(elapsed / 1000).toFixed(0)}s...`;
    } else if (agent.completed_at && agent.started_at) {
      const elapsed = agent.completed_at.getTime() - agent.started_at.getTime();
      duration = `${(elapsed / 1000).toFixed(1)}s`;
    }

    const statusIcon = getStatusIcon(agent.status);

    lines.push(
      `| \`${agent.id}\` | ${agent.persona} | ${statusIcon} ${agent.status} | ${agent.provider} | ${duration} | ${taskPreview} |`
    );
  }

  // Add usage summary for completed agents
  const completedAgents = agents.filter(a => a.status === 'completed' && a.usage);
  if (completedAgents.length > 0) {
    const totalInput = completedAgents.reduce((sum, a) => sum + (a.usage?.input_tokens || 0), 0);
    const totalOutput = completedAgents.reduce((sum, a) => sum + (a.usage?.output_tokens || 0), 0);

    lines.push('');
    lines.push(`**Token Usage (completed):** ${totalInput.toLocaleString()} in / ${totalOutput.toLocaleString()} out`);
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('**Commands:**');
  lines.push('- `get_agent_result({ agent_id: "..." })` - Get full result');
  lines.push('- `spawn_agent({ persona: "...", task: "..." })` - Create new agent');

  return lines.join('\n');
}

/**
 * Get status icon for display
 */
function getStatusIcon(status: AgentStatus): string {
  switch (status) {
    case 'pending':
      return '⏳';
    case 'running':
      return '🔄';
    case 'completed':
      return '✅';
    case 'failed':
      return '❌';
    case 'timeout':
      return '⏰';
    default:
      return '❓';
  }
}
