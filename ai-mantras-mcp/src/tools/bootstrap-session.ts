/**
 * Bootstrap Session Tool - Single tool to initialize an AI Mantras session
 *
 * Replaces multiple tool calls (assess_complexity + get_workflow + get_persona(s) + get_pattern(s))
 * with a single call that returns everything needed to begin working.
 *
 * KEY DESIGN: The AI calling this tool assesses complexity, not regex patterns.
 * The tool description provides criteria; the AI's judgment is trusted.
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import {
  loadPrinciples,
  loadPersona,
  loadPattern,
  loadManifest,
} from '../utils/content-loader.js';
import { suggestPersonasForRequest } from '../utils/persona-matcher.js';

export const bootstrapSessionTool: Tool = {
  name: 'bootstrap_session',
  description: `Initialize an AI Mantras session with a single call. Returns guiding principles, workflow, personas, and patterns - everything needed to begin working.

**Before calling, assess the request complexity:**

SIMPLE - Use when:
- Single factual question ("What is X?", "How does Y work?")
- Bounded scope, clear answer exists
- Low stakes, no major decisions
- Example: "What is a VLAN?" or "Explain Docker containers"

MODERATE - Use when:
- Multi-step analysis or structured reasoning needed
- Stays within a single domain
- Some ambiguity but manageable
- Example: "Help me design a backup strategy" or "Analyze this code for improvements"

COMPLEX - Use when:
- Multi-domain (finance + career, health + family, tech + business)
- High stakes (major life decisions, significant money, safety)
- Ambiguous requirements needing clarification
- Requires planning phase before execution
- Example: "Should I leave my job to start a company?" or "Help me monetize my product"

**Assess the tier yourself, then pass it to this tool.** Your judgment is more accurate than automated detection.`,
  inputSchema: {
    type: 'object',
    properties: {
      request: {
        type: 'string',
        description: 'The user request to bootstrap a session for',
      },
      tier: {
        type: 'string',
        enum: ['simple', 'moderate', 'complex'],
        description: 'The complexity tier YOU assessed for this request (see tool description for criteria)',
      },
      include_principles: {
        type: 'boolean',
        description: 'Include guiding principles in response (default: true)',
        default: true,
      },
    },
    required: ['request', 'tier'],
  },
};

interface BootstrapResult {
  tier: 'simple' | 'moderate' | 'complex';
  workflow: string;
  principles?: string;
  personas: {
    name: string;
    purpose: string;
    content: string;
  }[];
  patterns: {
    name: string;
    purpose: string;
    content: string;
  }[];
  instructions: string;
}

/**
 * Get personas appropriate for the tier
 * Uses domain matching from request + tier-based defaults
 */
function getPersonasForTier(
  tier: 'simple' | 'moderate' | 'complex',
  request: string
): string[] {
  // Get domain-matched personas from the request
  const domainMatched = suggestPersonasForRequest(request);

  if (tier === 'simple') {
    // Simple: just one domain persona
    if (domainMatched.length > 0) {
      return [domainMatched[0].name];
    }
    return ['Franklin-Deep-Reasoner'];
  }

  if (tier === 'moderate') {
    // Moderate: 1-2 domain personas
    if (domainMatched.length > 0) {
      return domainMatched.slice(0, 2).map(p => p.name);
    }
    return ['Franklin-Deep-Reasoner'];
  }

  // Complex: planning + domain + evaluation personas
  const personas: string[] = ['Hopper-Project-Planner'];

  // Add domain personas (up to 2)
  if (domainMatched.length > 0) {
    const domainPersonas = domainMatched
      .filter(p => !p.name.includes('Hopper') && !p.name.includes('Ada'))
      .slice(0, 2)
      .map(p => p.name);
    personas.push(...domainPersonas);
  } else {
    personas.push('Franklin-Deep-Reasoner');
  }

  // Always add QA for complex
  personas.push('Ada-QA-Reviewer');

  return personas;
}

/**
 * Get patterns appropriate for the tier
 */
function getPatternsForTier(tier: 'simple' | 'moderate' | 'complex'): string[] {
  if (tier === 'simple') {
    return []; // No patterns needed for simple
  }

  if (tier === 'moderate') {
    return ['chain-of-thought', 'recursive-self-eval'];
  }

  // Complex
  return ['planning-phase', 'chain-of-thought', 'criterion-based-evaluation'];
}

/**
 * Get workflow description for the tier
 */
function getWorkflowDescription(tier: 'simple' | 'moderate' | 'complex'): string {
  if (tier === 'simple') {
    return `## Simple Tier Workflow

**Flow:** Principles → Persona → Direct answer

**Instructions:**
1. Internalize the guiding principles (do not announce them)
2. Adopt the persona's voice and expertise
3. Answer directly and concisely
4. No orchestration, QA, or evaluation phases needed`;
  }

  if (tier === 'moderate') {
    return `## Moderate Tier Workflow

**Flow:** Principles → Persona → Patterns → Self-review → Answer

**Instructions:**
1. Internalize the guiding principles
2. Adopt the persona(s) voice and expertise
3. Apply the patterns for structured reasoning
4. Use chain-of-thought with labeled stages
5. Perform brief self-review before delivery
6. Note key assumptions and limitations`;
  }

  // Complex
  return `## Complex Tier Workflow

**Flow:** Principles → Planning → Execution → QA → Evaluation → Human Approval

**Two-Phase Process:**

### Phase 1: Plan
1. **Hopper (Planner)**: Frame the problem, gather constraints, decompose work
2. Create detailed plan with success criteria
3. Present plan for approval before execution

### Phase 2: Execute
1. **Domain Persona(s)**: Execute assigned portions using patterns
2. **Ada (QA)**: Review output for correctness, safety, clarity
3. Assess against success criteria
4. Present for human approval

**Separation of Powers:**
- Planners plan, workers execute, evaluators evaluate
- No persona evaluates their own work
- Human approval at key checkpoints`;
}

/**
 * Generate instructions for how to proceed
 */
function generateInstructions(
  tier: 'simple' | 'moderate' | 'complex',
  personaNames: string[]
): string {
  const personaList = personaNames.map(p => `- ${p}`).join('\n');

  if (tier === 'simple') {
    return `
## How to Proceed

You are now operating as: ${personaNames[0]}

1. The guiding principles are internalized - embody them naturally without announcing
2. Answer in your persona's voice with appropriate expertise
3. Be concise and direct
4. No need for complex structure or evaluation`;
  }

  if (tier === 'moderate') {
    return `
## How to Proceed

Active personas:
${personaList}

1. Apply the loaded patterns to structure your reasoning
2. Use chain-of-thought with labeled stages: [Assumptions], [Analysis], [Synthesis], [Risks]
3. Perform self-review before delivering final answer
4. Acknowledge key assumptions and limitations`;
  }

  // Complex
  return `
## How to Proceed

Active personas:
${personaList}

**Start with Phase 1 (Planning):**
1. As Hopper, frame the problem with: Mission, Inputs, Constraints, Risks
2. Propose which personas handle which parts
3. Define success criteria
4. Present plan for human approval before executing

**After approval, Phase 2 (Execution):**
1. Execute using domain personas
2. Apply patterns for structured reasoning
3. Ada reviews for quality and alignment
4. Present final output for human approval`;
}

/**
 * Main handler - trusts AI's tier assessment
 */
export async function handleBootstrapSession(
  args: Record<string, unknown>
): Promise<string> {
  const request = args.request as string;
  if (!request) {
    throw new Error('Request is required');
  }

  const tier = args.tier as 'simple' | 'moderate' | 'complex';
  if (!tier || !['simple', 'moderate', 'complex'].includes(tier)) {
    throw new Error('Valid tier (simple, moderate, complex) is required. Please assess the request complexity using the criteria in the tool description.');
  }

  const includePrinciples = args.include_principles !== false;

  // Get manifest for metadata lookups
  const manifest = loadManifest();

  // Get personas and patterns for this tier
  const personaNames = getPersonasForTier(tier, request);
  const patternNames = getPatternsForTier(tier);

  // Load persona content
  const personas: { name: string; purpose: string; content: string }[] = [];
  for (const personaName of personaNames) {
    try {
      const content = loadPersona(personaName);

      // Find purpose from manifest
      let purpose = '';
      const categories = ['orchestration', 'domain', 'evaluation'] as const;
      for (const category of categories) {
        const found = manifest.personas[category].members.find(
          p => p.name === personaName || p.name.toLowerCase() === personaName.toLowerCase()
        );
        if (found) {
          purpose = found.purpose;
          break;
        }
      }

      personas.push({ name: personaName, purpose, content });
    } catch (e) {
      console.error(`Failed to load persona ${personaName}:`, e);
    }
  }

  // Load pattern content
  const patterns: { name: string; purpose: string; content: string }[] = [];
  for (const patternName of patternNames) {
    try {
      const content = loadPattern(patternName);

      // Find purpose from manifest
      let purpose = '';
      const layers = ['layer1_foundational', 'layer2_thinking_primitives', 'layer3_evaluation'] as const;
      for (const layer of layers) {
        const found = manifest.patterns[layer].members.find(
          p => p.name === patternName ||
               p.name.toLowerCase() === patternName.toLowerCase() ||
               p.name.replace(/-/g, '_') === patternName.replace(/-/g, '_')
        );
        if (found) {
          purpose = found.purpose;
          break;
        }
      }

      patterns.push({ name: patternName, purpose, content });
    } catch (e) {
      console.error(`Failed to load pattern ${patternName}:`, e);
    }
  }

  // Build result
  const result: BootstrapResult = {
    tier,
    workflow: getWorkflowDescription(tier),
    personas,
    patterns,
    instructions: generateInstructions(tier, personaNames),
  };

  if (includePrinciples) {
    result.principles = loadPrinciples();
  }

  return formatBootstrapResponse(result, request);
}

/**
 * Format the response as structured markdown
 */
function formatBootstrapResponse(result: BootstrapResult, originalRequest: string): string {
  let response = `# AI Mantras Session Bootstrap

## Session Configuration

**Original Request:** ${originalRequest}

**Complexity Tier:** ${result.tier.toUpperCase()}

*Tier assessed by AI based on: scope, stakes, domain complexity, and ambiguity.*

---

${result.workflow}

---

${result.instructions}

---
`;

  // Add principles if included
  if (result.principles) {
    response += `
## Guiding Principles (Internalize - Do Not Announce)

${result.principles}

---
`;
  }

  // Add personas
  response += `
## Loaded Personas

`;
  for (const persona of result.personas) {
    response += `### ${persona.name}
**Purpose:** ${persona.purpose}

${persona.content}

---
`;
  }

  // Add patterns if any
  if (result.patterns.length > 0) {
    response += `
## Loaded Patterns

`;
    for (const pattern of result.patterns) {
      response += `### ${pattern.name}
**Purpose:** ${pattern.purpose}

${pattern.content}

---
`;
    }
  }

  response += `
---

**Session bootstrap complete.** You now have everything needed to address the request. Proceed according to the workflow instructions above.
`;

  return response;
}
