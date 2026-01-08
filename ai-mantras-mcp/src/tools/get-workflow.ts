/**
 * Get Workflow Tool - Return workflow steps for a complexity tier
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { loadManifest, getWorkflow, getTierInfo } from '../utils/content-loader.js';

export const getWorkflowTool: Tool = {
  name: 'get_workflow',
  description: 'Get the workflow steps for a complexity tier (simple, moderate, or complex). Returns the step-by-step process and what resources to load.',
  inputSchema: {
    type: 'object',
    properties: {
      tier: {
        type: 'string',
        enum: ['simple', 'moderate', 'complex'],
        description: 'Complexity tier',
      },
    },
    required: ['tier'],
  },
};

export async function handleGetWorkflow(
  args: Record<string, unknown>
): Promise<string> {
  const tier = args.tier as 'simple' | 'moderate' | 'complex';
  if (!tier || !['simple', 'moderate', 'complex'].includes(tier)) {
    throw new Error('Valid tier (simple, moderate, complex) is required');
  }

  const manifest = loadManifest();
  const tierInfo = manifest.complexity_tiers[tier];
  const workflow = manifest.workflows[tier];

  let response = `# ${tier.charAt(0).toUpperCase() + tier.slice(1)} Tier Workflow\n\n`;

  // Tier description
  if (tierInfo) {
    response += `## Description\n${tierInfo.description}\n\n`;
    response += `## Resources to Load\n`;
    for (const item of tierInfo.loads) {
      response += `- ${item}\n`;
    }
    response += '\n';
  }

  // Workflow steps
  if (workflow) {
    response += `## Workflow: ${workflow.name}\n`;
    response += `${workflow.description}\n\n`;
    response += `### Steps\n`;
    for (const step of workflow.flow) {
      response += `${step.step}. **${step.actor}**: ${step.action}\n`;
    }
    response += '\n';
  }

  // Quick reference for each tier
  response += `## Quick Reference\n\n`;

  if (tier === 'simple') {
    response += `**Flow:** Principles → Persona → Direct answer\n\n`;
    response += `**What to do:**\n`;
    response += `1. Load guiding-principles.md (internalize, don't announce)\n`;
    response += `2. Load the appropriate domain persona\n`;
    response += `3. Answer directly in the persona's voice\n`;
    response += `4. No orchestration, no QA, no evaluation needed\n`;
  } else if (tier === 'moderate') {
    response += `**Flow:** Principles → Persona → Patterns → Self-review → Answer\n\n`;
    response += `**What to do:**\n`;
    response += `1. Load guiding-principles.md\n`;
    response += `2. Load the appropriate domain persona\n`;
    response += `3. Load 1-2 recommended patterns (usually chain-of-thought + recursive-self-eval)\n`;
    response += `4. Apply structured reasoning using patterns\n`;
    response += `5. Perform brief self-review before delivery\n`;
    response += `6. Note assumptions and limitations\n`;
  } else {
    response += `**Flow:** Principles → Bootstrapper → Bernstein → Hopper → Workers → Ada → Evaluators → Human\n\n`;
    response += `**What to do:**\n`;
    response += `1. Load full Agent-bootstrapper.md\n`;
    response += `2. Hand off to Bernstein (Orchestrator)\n`;
    response += `3. Follow two-phase workflow:\n`;
    response += `   - Phase 1: Plan → Evaluate → Approve\n`;
    response += `   - Phase 2: Execute → QA → Evaluate\n`;
    response += `4. Full separation of powers applies\n`;
    response += `5. Human approval required at key checkpoints\n`;
  }

  return response;
}
