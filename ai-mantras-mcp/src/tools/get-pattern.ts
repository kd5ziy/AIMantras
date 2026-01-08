/**
 * Get Pattern Tool - Load a thinking pattern by name
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { loadPattern, loadManifest, PatternInfo } from '../utils/content-loader.js';

export const getPatternTool: Tool = {
  name: 'get_pattern',
  description: 'Load an AI Mantras thinking pattern by name. Returns the full pattern definition with usage guidelines.',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Pattern name (e.g., "chain-of-thought", "rule-based-reasoning", "planning-phase", "recursive-self-eval")',
      },
    },
    required: ['name'],
  },
};

export async function handleGetPattern(
  args: Record<string, unknown>
): Promise<string> {
  const name = args.name as string;
  if (!name) {
    throw new Error('Pattern name is required');
  }

  // Load the pattern content
  const content = loadPattern(name);

  // Get metadata from manifest
  const manifest = loadManifest();
  let patternInfo: PatternInfo | undefined;
  const layers = ['layer1_foundational', 'layer2_thinking_primitives', 'layer3_evaluation'] as const;
  for (const layer of layers) {
    patternInfo = manifest.patterns[layer].members.find(
      p => p.name === name ||
           p.name.toLowerCase() === name.toLowerCase() ||
           p.name.replace(/-/g, '_') === name.replace(/-/g, '_')
    );
    if (patternInfo) break;
  }

  // Build response with metadata header
  let response = '';
  if (patternInfo) {
    response += `# Pattern: ${patternInfo.name}\n\n`;
    response += `**Purpose:** ${patternInfo.purpose}\n`;
    if (patternInfo.when_to_use && patternInfo.when_to_use.length > 0) {
      response += `**When to Use:**\n`;
      for (const use of patternInfo.when_to_use) {
        response += `- ${use}\n`;
      }
    }
    response += '\n---\n\n';
  }

  response += content;

  return response;
}
