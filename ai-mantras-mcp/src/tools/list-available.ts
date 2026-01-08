/**
 * List Available Tool - List all personas and patterns in the framework
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { getAllPersonas, getAllPatterns } from '../utils/content-loader.js';

export const listAvailableTool: Tool = {
  name: 'list_available',
  description: 'List all available personas and patterns in the AI Mantras framework. Useful for discovering what resources are available.',
  inputSchema: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['personas', 'patterns', 'all'],
        description: 'What to list (personas, patterns, or all)',
      },
      category: {
        type: 'string',
        description: 'Filter by category (orchestration, domain, evaluation for personas; layer1, layer2, layer3 for patterns)',
      },
    },
  },
};

export async function handleListAvailable(
  args: Record<string, unknown>
): Promise<string> {
  const type = (args.type as string) || 'all';
  const category = args.category as string | undefined;

  let response = '';

  // List personas
  if (type === 'personas' || type === 'all') {
    response += '# Available Personas\n\n';
    const allPersonas = getAllPersonas();

    for (const { category: cat, personas } of allPersonas) {
      // Skip if filtering by category and this doesn't match
      if (category && !cat.toLowerCase().includes(category.toLowerCase())) {
        continue;
      }

      response += `## ${cat.charAt(0).toUpperCase() + cat.slice(1)} Personas\n\n`;

      for (const persona of personas) {
        response += `### ${persona.name}\n`;
        response += `- **Purpose:** ${persona.purpose}\n`;
        response += `- **Style:** ${persona.style}\n`;
        if (persona.expertise && persona.expertise.length > 0) {
          response += `- **Expertise:** ${persona.expertise.slice(0, 3).join(', ')}${persona.expertise.length > 3 ? '...' : ''}\n`;
        }
        if (persona.recommended_patterns && persona.recommended_patterns.length > 0) {
          response += `- **Patterns:** ${persona.recommended_patterns.join(', ')}\n`;
        }
        response += '\n';
      }
    }
  }

  // List patterns
  if (type === 'patterns' || type === 'all') {
    response += '# Available Patterns\n\n';
    const allPatterns = getAllPatterns();

    for (const { layer, patterns } of allPatterns) {
      // Skip if filtering by category and this doesn't match
      if (category && !layer.toLowerCase().includes(category.toLowerCase())) {
        continue;
      }

      // Format layer name
      const layerName = layer
        .replace('layer1_', 'Layer 1: ')
        .replace('layer2_', 'Layer 2: ')
        .replace('layer3_', 'Layer 3: ')
        .replace(/_/g, ' ')
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      response += `## ${layerName}\n\n`;

      for (const pattern of patterns) {
        response += `### ${pattern.name}\n`;
        response += `- **Purpose:** ${pattern.purpose}\n`;
        if (pattern.when_to_use && pattern.when_to_use.length > 0) {
          response += `- **When to use:**\n`;
          for (const use of pattern.when_to_use.slice(0, 2)) {
            response += `  - ${use}\n`;
          }
        }
        response += '\n';
      }
    }
  }

  // Summary statistics
  if (type === 'all' && !category) {
    const allPersonas = getAllPersonas();
    const allPatterns = getAllPatterns();

    const totalPersonas = allPersonas.reduce((sum, { personas }) => sum + personas.length, 0);
    const totalPatterns = allPatterns.reduce((sum, { patterns }) => sum + patterns.length, 0);

    response += '---\n\n';
    response += `**Summary:** ${totalPersonas} personas, ${totalPatterns} patterns available\n`;
  }

  return response;
}
