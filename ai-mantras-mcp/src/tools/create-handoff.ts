/**
 * Create Handoff Tool - Generate structured handoff templates between personas
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const createHandoffTool: Tool = {
  name: 'create_handoff',
  description: 'Generate a structured handoff template for passing work between AI Mantras personas. Ensures clear communication of task, inputs, patterns, and success criteria.',
  inputSchema: {
    type: 'object',
    properties: {
      from_persona: {
        type: 'string',
        description: 'Name of the persona handing off (e.g., "Hopper-Project-Planner")',
      },
      to_persona: {
        type: 'string',
        description: 'Name of the persona receiving (e.g., "Clara-Financial-Analyst")',
      },
      task: {
        type: 'string',
        description: 'Clear description of what the receiving persona should do',
      },
      inputs: {
        type: 'string',
        description: 'What information/context is being provided',
      },
      patterns: {
        type: 'array',
        items: { type: 'string' },
        description: 'Which patterns the receiving persona should use',
      },
      success_criteria: {
        type: 'string',
        description: 'How to know the task was completed successfully',
      },
      constraints: {
        type: 'string',
        description: 'Any limitations or boundaries to respect',
      },
    },
    required: ['from_persona', 'to_persona', 'task'],
  },
};

export async function handleCreateHandoff(
  args: Record<string, unknown>
): Promise<string> {
  const fromPersona = args.from_persona as string;
  const toPersona = args.to_persona as string;
  const task = args.task as string;
  const inputs = args.inputs as string || 'See context above';
  const patterns = args.patterns as string[] || [];
  const successCriteria = args.success_criteria as string || 'Task completed to satisfaction';
  const constraints = args.constraints as string || 'None specified';

  if (!fromPersona || !toPersona || !task) {
    throw new Error('from_persona, to_persona, and task are required');
  }

  const handoff = `---
HANDOFF TO: ${toPersona}
FROM: ${fromPersona}
TASK: ${task}
INPUTS: ${inputs}
PATTERNS: ${patterns.length > 0 ? patterns.join(', ') : 'Use persona defaults'}
SUCCESS CRITERIA: ${successCriteria}
CONSTRAINTS: ${constraints}
---`;

  return handoff;
}
