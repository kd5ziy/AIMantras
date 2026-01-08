/**
 * Get Persona Tool - Load a persona by name or domain match
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { loadPersona, loadManifest, PersonaInfo } from '../utils/content-loader.js';
import { matchDomainToPersona } from '../utils/persona-matcher.js';

export const getPersonaTool: Tool = {
  name: 'get_persona',
  description: 'Load an AI Mantras persona by exact name or find the best match for a domain. Returns the full persona definition with expertise, style, and recommended patterns.',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Exact persona name (e.g., "Kestra-Systems-Architect", "Clara-Financial-Analyst")',
      },
      domain: {
        type: 'string',
        description: 'Domain to match (e.g., "finance", "infrastructure", "philosophy", "medical")',
      },
    },
  },
};

export async function handleGetPersona(
  args: Record<string, unknown>
): Promise<string> {
  const name = args.name as string | undefined;
  const domain = args.domain as string | undefined;

  if (!name && !domain) {
    throw new Error('Either name or domain must be provided');
  }

  let personaName: string;
  let matchInfo = '';

  if (name) {
    // Direct name lookup
    personaName = name;
  } else {
    // Domain matching
    const matched = matchDomainToPersona(domain!);
    if (!matched) {
      throw new Error(`No persona found matching domain: ${domain}`);
    }
    personaName = matched.name;
    matchInfo = `\n\n---\n**Matched persona "${personaName}" for domain "${domain}"**\nPurpose: ${matched.purpose}\nStyle: ${matched.style}`;
  }

  // Load the persona content
  const content = loadPersona(personaName);

  // Get metadata from manifest
  const manifest = loadManifest();
  let personaInfo: PersonaInfo | undefined;
  const categories = ['orchestration', 'domain', 'evaluation'] as const;
  for (const category of categories) {
    personaInfo = manifest.personas[category].members.find(
      p => p.name === personaName || p.name.toLowerCase() === personaName.toLowerCase()
    );
    if (personaInfo) break;
  }

  // Build response with metadata header
  let response = '';
  if (personaInfo) {
    response += `# Persona: ${personaInfo.name}\n\n`;
    response += `**Purpose:** ${personaInfo.purpose}\n`;
    response += `**Style:** ${personaInfo.style}\n`;
    if (personaInfo.expertise) {
      response += `**Expertise:** ${personaInfo.expertise.join(', ')}\n`;
    }
    if (personaInfo.recommended_patterns) {
      response += `**Recommended Patterns:** ${personaInfo.recommended_patterns.join(', ')}\n`;
    }
    response += '\n---\n\n';
  }

  response += content;
  response += matchInfo;

  return response;
}
