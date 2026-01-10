/**
 * Resources Index - Registers and handles MCP resources
 *
 * Resources expose the AI Mantras content as readable URIs:
 * - mantras://principles - Guiding principles
 * - mantras://bootstrapper - Agent bootstrapper
 * - mantras://manifest - YAML manifest
 * - mantras://entry-point - AIMantra.md
 * - mantras://toolset - Skills toolset index
 * - mantras://persona/{category}/{name} - Individual personas
 * - mantras://pattern/{layer}/{name} - Individual patterns
 * - mantras://skill/{category}/{name} - Individual skills
 */

import { Resource, ResourceTemplate } from '@modelcontextprotocol/sdk/types.js';
import {
  loadPrinciples,
  loadBootstrapper,
  loadEntryPoint,
  loadManifest,
  loadPersona,
  loadPattern,
  loadSkill,
  loadToolset,
  readContentFile,
  getAllPersonas,
  getAllPatterns,
  getAllSkills,
} from '../utils/content-loader.js';

/**
 * Register all resources and templates
 */
export function registerResources(): {
  resources: Resource[];
  resourceTemplates?: ResourceTemplate[];
} {
  // Static resources
  const resources: Resource[] = [
    {
      uri: 'mantras://principles',
      name: 'Guiding Principles',
      description: 'The moral and philosophical foundation that governs all personas',
      mimeType: 'text/markdown',
    },
    {
      uri: 'mantras://bootstrapper',
      name: 'Agent Bootstrapper',
      description: 'Full operational manual for AI agents operating in the AI Mantras framework',
      mimeType: 'text/markdown',
    },
    {
      uri: 'mantras://entry-point',
      name: 'Entry Point (AIMantra.md)',
      description: 'Lightweight decision gate that triages requests - the gatekeeper pattern',
      mimeType: 'text/markdown',
    },
    {
      uri: 'mantras://manifest',
      name: 'Framework Manifest',
      description: 'Structured YAML index of all personas, patterns, workflows, and skills',
      mimeType: 'application/yaml',
    },
    {
      uri: 'mantras://toolset',
      name: 'Skills Toolset',
      description: 'Master index of all available skills that personas can invoke',
      mimeType: 'text/markdown',
    },
  ];

  // Add individual persona resources
  const allPersonas = getAllPersonas();
  for (const { category, personas } of allPersonas) {
    for (const persona of personas) {
      resources.push({
        uri: `mantras://persona/${category}/${persona.name}`,
        name: persona.name,
        description: persona.purpose,
        mimeType: 'text/markdown',
      });
    }
  }

  // Add individual pattern resources
  const allPatterns = getAllPatterns();
  for (const { layer, patterns } of allPatterns) {
    for (const pattern of patterns) {
      resources.push({
        uri: `mantras://pattern/${layer}/${pattern.name}`,
        name: pattern.name,
        description: pattern.purpose,
        mimeType: 'text/markdown',
      });
    }
  }

  // Add individual skill resources
  const allSkills = getAllSkills();
  for (const { category, skills } of allSkills) {
    for (const skill of skills) {
      resources.push({
        uri: `mantras://skill/${category}/${skill.name}`,
        name: skill.name,
        description: skill.purpose,
        mimeType: 'text/markdown',
      });
    }
  }

  return { resources };
}

/**
 * Handle resource read requests
 */
export function handleResourceRead(uri: string): {
  contents: { uri: string; mimeType: string; text: string }[];
} {
  let content: string;
  let mimeType = 'text/markdown';

  try {
    if (uri === 'mantras://principles') {
      content = loadPrinciples();
    } else if (uri === 'mantras://bootstrapper') {
      content = loadBootstrapper();
    } else if (uri === 'mantras://entry-point') {
      content = loadEntryPoint();
    } else if (uri === 'mantras://manifest') {
      content = readContentFile('ai-mantras-manifest.yaml');
      mimeType = 'application/yaml';
    } else if (uri.startsWith('mantras://persona/')) {
      // Parse: mantras://persona/{category}/{name}
      const parts = uri.replace('mantras://persona/', '').split('/');
      if (parts.length >= 2) {
        const personaName = parts[parts.length - 1];
        content = loadPersona(personaName);
      } else {
        throw new Error(`Invalid persona URI: ${uri}`);
      }
    } else if (uri.startsWith('mantras://pattern/')) {
      // Parse: mantras://pattern/{layer}/{name}
      const parts = uri.replace('mantras://pattern/', '').split('/');
      if (parts.length >= 2) {
        const patternName = parts[parts.length - 1];
        content = loadPattern(patternName);
      } else {
        throw new Error(`Invalid pattern URI: ${uri}`);
      }
    } else if (uri === 'mantras://toolset') {
      content = loadToolset();
    } else if (uri.startsWith('mantras://skill/')) {
      // Parse: mantras://skill/{category}/{name}
      const parts = uri.replace('mantras://skill/', '').split('/');
      if (parts.length >= 2) {
        const skillName = parts[parts.length - 1];
        content = loadSkill(skillName);
      } else {
        throw new Error(`Invalid skill URI: ${uri}`);
      }
    } else {
      throw new Error(`Unknown resource URI: ${uri}`);
    }

    return {
      contents: [{ uri, mimeType, text: content }],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: `Error reading resource: ${errorMessage}`,
        },
      ],
    };
  }
}
