/**
 * Prompt Builder - Constructs system prompts for spawned agents
 *
 * Builds isolated agent prompts with:
 * - Guiding principles (internalized)
 * - Persona definition
 * - Requested thinking patterns
 * - Context isolation notice
 */

import { loadPrinciples, loadPersona, loadPattern } from './content-loader.js';

export interface PromptBuildOptions {
  persona: string;
  task: string;
  inputs?: Record<string, unknown>;
  successCriteria?: string;
  patterns?: string[];
}

/**
 * Build the system prompt for a spawned agent
 */
export function buildSystemPrompt(options: PromptBuildOptions): string {
  const sections: string[] = [];

  // 1. Guiding Principles (to internalize)
  try {
    const principles = loadPrinciples();
    sections.push(`## Guiding Principles (Internalize These)\n\n${principles}`);
  } catch {
    // Principles are optional - continue without them
  }

  // 2. Persona Definition
  const personaContent = loadPersona(options.persona);
  sections.push(`## Your Persona: ${options.persona}\n\n${personaContent}`);

  // 3. Thinking Patterns (if requested)
  if (options.patterns && options.patterns.length > 0) {
    const patternSections: string[] = [];
    for (const patternName of options.patterns) {
      try {
        const patternContent = loadPattern(patternName);
        patternSections.push(`### ${patternName}\n\n${patternContent}`);
      } catch {
        // Skip invalid patterns with a note
        patternSections.push(`### ${patternName}\n\n*Pattern not found*`);
      }
    }
    if (patternSections.length > 0) {
      sections.push(`## Thinking Patterns to Apply\n\n${patternSections.join('\n\n')}`);
    }
  }

  // 4. Context Isolation Notice
  sections.push(`## Important: Context Isolation

You are an isolated agent spawned for a specific task. You have access ONLY to:
- This task description and any provided inputs
- Your persona definition and thinking patterns above
- Your own reasoning and knowledge

You do NOT have access to:
- Any prior conversation history
- Other agents' reasoning or outputs
- External tools or file systems
- Information not explicitly provided in this prompt

Focus entirely on your assigned task using only the context provided.`);

  return sections.join('\n\n---\n\n');
}

/**
 * Build the user message for a spawned agent
 */
export function buildUserMessage(options: PromptBuildOptions): string {
  const sections: string[] = [];

  // 1. Task Description
  sections.push(`## Task\n\n${options.task}`);

  // 2. Inputs (if provided)
  if (options.inputs && Object.keys(options.inputs).length > 0) {
    const inputsFormatted = formatInputs(options.inputs);
    sections.push(`## Inputs\n\n${inputsFormatted}`);
  }

  // 3. Success Criteria (if provided)
  if (options.successCriteria) {
    sections.push(`## Success Criteria\n\n${options.successCriteria}`);
  }

  // 4. Response Instructions
  sections.push(`## Response Format

Provide your analysis and response directly. Structure your output clearly with:
1. Your reasoning process (following any specified thinking patterns)
2. Your findings or recommendations
3. A concise summary of key points

Be thorough but focused. Your response will be used by the orchestrating system.`);

  return sections.join('\n\n');
}

/**
 * Format inputs object for inclusion in prompt
 */
function formatInputs(inputs: Record<string, unknown>, indent = 0): string {
  const lines: string[] = [];
  const prefix = '  '.repeat(indent);

  for (const [key, value] of Object.entries(inputs)) {
    if (value === null || value === undefined) {
      lines.push(`${prefix}- **${key}**: (not provided)`);
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      lines.push(`${prefix}- **${key}**:`);
      lines.push(formatInputs(value as Record<string, unknown>, indent + 1));
    } else if (Array.isArray(value)) {
      lines.push(`${prefix}- **${key}**:`);
      for (const item of value) {
        if (typeof item === 'object') {
          lines.push(`${prefix}  - ${JSON.stringify(item)}`);
        } else {
          lines.push(`${prefix}  - ${item}`);
        }
      }
    } else if (typeof value === 'string' && value.includes('\n')) {
      lines.push(`${prefix}- **${key}**:\n${prefix}  \`\`\`\n${value.split('\n').map(l => `${prefix}  ${l}`).join('\n')}\n${prefix}  \`\`\``);
    } else {
      lines.push(`${prefix}- **${key}**: ${value}`);
    }
  }

  return lines.join('\n');
}

/**
 * Estimate token count for a string (rough approximation)
 * Uses ~4 characters per token as a rough estimate
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
