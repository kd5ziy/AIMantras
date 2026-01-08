/**
 * Prompts Index - Registers and handles MCP prompts
 *
 * Prompts provide structured templates for using the AI Mantras framework:
 * - mantras: Main auto-triage prompt
 * - mantras-simple: Direct answer mode
 * - mantras-moderate: Structured reasoning mode
 * - mantras-complex: Full orchestration mode
 */

import { Prompt, PromptMessage } from '@modelcontextprotocol/sdk/types.js';
import {
  loadPrinciples,
  loadBootstrapper,
  loadPersona,
  loadPattern,
  loadManifest,
} from '../utils/content-loader.js';
import { matchDomainToPersona, suggestPersonasForRequest } from '../utils/persona-matcher.js';

/**
 * Register all prompts
 */
export function registerPrompts(): Prompt[] {
  return [
    {
      name: 'mantras',
      description: 'Process a request using the AI Mantras framework with automatic complexity triage',
      arguments: [
        {
          name: 'request',
          description: 'The user request to process',
          required: true,
        },
      ],
    },
    {
      name: 'mantras-simple',
      description: 'Process a simple request with a single domain persona (direct answer)',
      arguments: [
        {
          name: 'request',
          description: 'The user request to process',
          required: true,
        },
        {
          name: 'domain',
          description: 'Domain hint (finance, infrastructure, philosophy, medical)',
          required: false,
        },
      ],
    },
    {
      name: 'mantras-moderate',
      description: 'Process a moderate complexity request with persona + patterns + self-review',
      arguments: [
        {
          name: 'request',
          description: 'The user request to process',
          required: true,
        },
        {
          name: 'domain',
          description: 'Domain hint (finance, infrastructure, philosophy, medical)',
          required: false,
        },
        {
          name: 'patterns',
          description: 'Comma-separated pattern names to use (default: chain-of-thought, recursive-self-eval)',
          required: false,
        },
      ],
    },
    {
      name: 'mantras-complex',
      description: 'Process a complex request using full AI Mantras orchestration workflow',
      arguments: [
        {
          name: 'request',
          description: 'The user request to process',
          required: true,
        },
      ],
    },
  ];
}

/**
 * Handle prompt get requests
 */
export function handlePromptGet(
  promptName: string,
  args: Record<string, string>
): { messages: PromptMessage[] } {
  switch (promptName) {
    case 'mantras':
      return generateMantrasPrompt(args);
    case 'mantras-simple':
      return generateSimplePrompt(args);
    case 'mantras-moderate':
      return generateModeratePrompt(args);
    case 'mantras-complex':
      return generateComplexPrompt(args);
    default:
      return {
        messages: [
          {
            role: 'user',
            content: { type: 'text', text: `Unknown prompt: ${promptName}` },
          },
        ],
      };
  }
}

/**
 * Main mantras prompt with auto-triage
 */
function generateMantrasPrompt(args: Record<string, string>): { messages: PromptMessage[] } {
  const request = args.request || '';
  const principles = loadPrinciples();

  // Simple triage logic (the assess_complexity tool has the full version)
  const requestLower = request.toLowerCase();
  const isComplex =
    requestLower.includes('career') ||
    requestLower.includes('retirement') ||
    requestLower.includes('business') ||
    requestLower.includes('life') ||
    requestLower.includes('family') ||
    (requestLower.includes('financial') && requestLower.includes('situation'));

  const isModerate =
    requestLower.includes('help me') ||
    requestLower.includes('analyze') ||
    requestLower.includes('design') ||
    requestLower.includes('should i') ||
    requestLower.includes('recommend');

  if (isComplex) {
    return generateComplexPrompt(args);
  } else if (isModerate) {
    return generateModeratePrompt(args);
  } else {
    return generateSimplePrompt(args);
  }
}

/**
 * Simple tier prompt
 */
function generateSimplePrompt(args: Record<string, string>): { messages: PromptMessage[] } {
  const request = args.request || '';
  const domain = args.domain || '';
  const principles = loadPrinciples();

  // Find matching persona
  let personaContent = '';
  let personaName = 'appropriate domain expert';

  if (domain) {
    const matched = matchDomainToPersona(domain);
    if (matched) {
      personaContent = loadPersona(matched.name);
      personaName = matched.name;
    }
  } else {
    const suggested = suggestPersonasForRequest(request);
    if (suggested.length > 0) {
      personaContent = loadPersona(suggested[0].name);
      personaName = suggested[0].name;
    }
  }

  const systemPrompt = `You are operating in the AI Mantras framework at the SIMPLE tier.

## Guiding Principles (internalize these - do not announce them)
${principles}

## Your Persona: ${personaName}
${personaContent || 'You are a knowledgeable domain expert. Answer clearly and directly.'}

## Instructions
- This is a SIMPLE tier request: single question, factual, bounded scope
- Answer directly in your persona's voice
- Apply the guiding principles naturally without mentioning them
- No orchestration, no QA, no evaluation needed
- Be concise and helpful`;

  return {
    messages: [
      {
        role: 'user',
        content: { type: 'text', text: systemPrompt },
      },
      {
        role: 'user',
        content: { type: 'text', text: `User Request: ${request}` },
      },
    ],
  };
}

/**
 * Moderate tier prompt
 */
function generateModeratePrompt(args: Record<string, string>): { messages: PromptMessage[] } {
  const request = args.request || '';
  const domain = args.domain || '';
  const patternsArg = args.patterns || 'chain-of-thought,recursive-self-eval';
  const principles = loadPrinciples();

  // Find matching persona
  let personaContent = '';
  let personaName = 'appropriate domain expert';

  if (domain) {
    const matched = matchDomainToPersona(domain);
    if (matched) {
      personaContent = loadPersona(matched.name);
      personaName = matched.name;
    }
  } else {
    const suggested = suggestPersonasForRequest(request);
    if (suggested.length > 0) {
      personaContent = loadPersona(suggested[0].name);
      personaName = suggested[0].name;
    }
  }

  // Load patterns
  const patternNames = patternsArg.split(',').map(p => p.trim());
  let patternsContent = '';
  for (const patternName of patternNames) {
    try {
      const content = loadPattern(patternName);
      patternsContent += `\n### Pattern: ${patternName}\n${content}\n`;
    } catch {
      // Pattern not found, skip
    }
  }

  const systemPrompt = `You are operating in the AI Mantras framework at the MODERATE tier.

## Guiding Principles (internalize these - do not announce them)
${principles}

## Your Persona: ${personaName}
${personaContent || 'You are a knowledgeable domain expert with structured reasoning capabilities.'}

## Thinking Patterns to Apply
${patternsContent || 'Use structured reasoning with clear steps and self-review.'}

## Instructions
- This is a MODERATE tier request: requires structured reasoning and self-review
- Apply the assigned thinking patterns
- Document your reasoning process
- Perform a brief self-review before delivering your answer
- Note any assumptions or limitations
- Format your response with clear structure

## Response Format
1. **Understanding**: Brief restatement of the task
2. **Analysis**: Structured reasoning following the patterns
3. **Self-Review**: Quick check for errors or gaps
4. **Response**: Your final answer with caveats noted`;

  return {
    messages: [
      {
        role: 'user',
        content: { type: 'text', text: systemPrompt },
      },
      {
        role: 'user',
        content: { type: 'text', text: `User Request: ${request}` },
      },
    ],
  };
}

/**
 * Complex tier prompt
 */
function generateComplexPrompt(args: Record<string, string>): { messages: PromptMessage[] } {
  const request = args.request || '';
  const principles = loadPrinciples();
  const bootstrapper = loadBootstrapper();

  const systemPrompt = `You are operating in the AI Mantras framework at the COMPLEX tier.

## Guiding Principles (MANDATORY - internalize fully)
${principles}

## Full Operational Manual
${bootstrapper}

## Instructions
- This is a COMPLEX tier request: multi-domain, high stakes, or ambiguous
- Follow the TWO-PHASE WORKFLOW:

  **Phase 1: Plan → Evaluate → Approve**
  1. As Bernstein (Orchestrator), understand the request
  2. Route to Hopper (Project Planner) for detailed planning
  3. Create a plan with success criteria
  4. Present plan for approval before execution

  **Phase 2: Execute → QA → Evaluate**
  1. Execute using appropriate domain personas
  2. Ada (QA) reviews combined output
  3. Evaluators assess against criteria
  4. Present final result for human approval

- SEPARATION OF POWERS:
  - Orchestration: Plans and coordinates, does NOT generate final content
  - Domain: Executes specialized work, does NOT self-evaluate
  - Evaluation: Scores and approves, does NOT generate content

- Use explicit HANDOFF templates when transitioning between personas
- Defer to human authority at key checkpoints

## Begin
Start by acknowledging the complexity of this request and outlining your orchestration approach.`;

  return {
    messages: [
      {
        role: 'user',
        content: { type: 'text', text: systemPrompt },
      },
      {
        role: 'user',
        content: { type: 'text', text: `User Request: ${request}` },
      },
    ],
  };
}
