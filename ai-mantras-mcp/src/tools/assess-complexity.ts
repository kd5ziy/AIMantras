/**
 * Assess Complexity Tool - Implements the gatekeeper pattern from AIMantra.md
 * Triages requests into Simple, Moderate, or Complex tiers
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { suggestPersonasForRequest } from '../utils/persona-matcher.js';
import { loadManifest, PersonaInfo } from '../utils/content-loader.js';

export const assessComplexityTool: Tool = {
  name: 'assess_complexity',
  description: 'Triage a user request into Simple, Moderate, or Complex tier based on AI Mantras framework criteria. Returns the recommended tier, reasoning, and suggested personas/patterns.',
  inputSchema: {
    type: 'object',
    properties: {
      request: {
        type: 'string',
        description: 'The user request to analyze for complexity',
      },
    },
    required: ['request'],
  },
};

interface ComplexityResult {
  tier: 'simple' | 'moderate' | 'complex';
  reasoning: string;
  signals: string[];
  recommended_personas: string[];
  recommended_patterns: string[];
  workflow: string;
}

// Complexity signal patterns
const SIMPLE_SIGNALS = [
  /^what (is|are|was|were)/i,
  /^how does/i,
  /^explain/i,
  /^define/i,
  /^describe/i,
  /^what's the difference/i,
  /^compare .+ (and|vs|versus)/i,
];

const MODERATE_SIGNALS = [
  /^help me/i,
  /^analyze/i,
  /^design a (simple|basic)/i,
  /^create a plan/i,
  /^evaluate/i,
  /^recommend/i,
  /^should i/i,
  /^how (can|should) i/i,
  /^what would be the best/i,
];

const COMPLEX_SIGNALS = [
  /multi.?(domain|disciplin)/i,
  /high.?stakes?/i,
  /life.?changing/i,
  /career/i,
  /retirement/i,
  /leave (my )?job/i,
  /start a (company|business)/i,
  /major (decision|life)/i,
  /financial situation/i,
  /family obligations/i,
  /health (and|or) (finance|career)/i,
  /disaster recovery/i,
  /business continuity/i,
];

// Keywords that suggest higher stakes
const HIGH_STAKES_KEYWORDS = [
  'investment', 'mortgage', 'refinance', 'retirement', 'savings',
  'career', 'job', 'business', 'company', 'startup',
  'health', 'medical', 'diagnosis', 'treatment',
  'legal', 'lawsuit', 'contract',
  'family', 'marriage', 'divorce', 'children',
  'safety', 'security', 'disaster', 'emergency',
];

// Keywords suggesting multi-domain
const MULTI_DOMAIN_KEYWORDS = [
  'and', 'plus', 'with', 'considering', 'given',
  'financial situation', 'risk tolerance', 'family',
  'ethical', 'moral', 'values',
];

export async function handleAssessComplexity(
  args: Record<string, unknown>
): Promise<string> {
  const request = args.request as string;
  if (!request) {
    throw new Error('Request is required');
  }

  const result = assessComplexity(request);
  return JSON.stringify(result, null, 2);
}

function assessComplexity(request: string): ComplexityResult {
  const requestLower = request.toLowerCase();
  const signals: string[] = [];

  // Check for simple signals
  let simpleScore = 0;
  for (const pattern of SIMPLE_SIGNALS) {
    if (pattern.test(request)) {
      simpleScore++;
      signals.push(`Simple signal: matches "${pattern.source}"`);
    }
  }

  // Check for moderate signals
  let moderateScore = 0;
  for (const pattern of MODERATE_SIGNALS) {
    if (pattern.test(request)) {
      moderateScore++;
      signals.push(`Moderate signal: matches "${pattern.source}"`);
    }
  }

  // Check for complex signals
  let complexScore = 0;
  for (const pattern of COMPLEX_SIGNALS) {
    if (pattern.test(request)) {
      complexScore++;
      signals.push(`Complex signal: matches "${pattern.source}"`);
    }
  }

  // Check high stakes keywords
  const highStakesCount = HIGH_STAKES_KEYWORDS.filter(kw =>
    requestLower.includes(kw)
  ).length;
  if (highStakesCount >= 2) {
    complexScore++;
    signals.push(`High stakes: ${highStakesCount} high-stakes keywords found`);
  } else if (highStakesCount === 1) {
    moderateScore++;
    signals.push(`Moderate stakes: 1 high-stakes keyword found`);
  }

  // Check multi-domain indicators
  const multiDomainCount = MULTI_DOMAIN_KEYWORDS.filter(kw =>
    requestLower.includes(kw)
  ).length;
  if (multiDomainCount >= 2) {
    complexScore++;
    signals.push(`Multi-domain: ${multiDomainCount} multi-domain indicators`);
  }

  // Check request length (longer requests often indicate complexity)
  const wordCount = request.split(/\s+/).length;
  if (wordCount > 50) {
    complexScore++;
    signals.push(`Length: ${wordCount} words (suggests complexity)`);
  } else if (wordCount > 25) {
    moderateScore++;
    signals.push(`Length: ${wordCount} words (moderate)`);
  }

  // Determine tier
  let tier: 'simple' | 'moderate' | 'complex';
  let reasoning: string;

  if (complexScore >= 2 || (complexScore >= 1 && moderateScore >= 2)) {
    tier = 'complex';
    reasoning = 'Multiple complexity indicators detected: multi-domain, high stakes, or ambiguous requirements. Full orchestration recommended.';
  } else if (moderateScore >= 1 || complexScore >= 1) {
    tier = 'moderate';
    reasoning = 'Request requires structured reasoning or multi-step analysis but stays within a single domain. Persona with patterns recommended.';
  } else {
    tier = 'simple';
    reasoning = 'Single question, factual, bounded scope, low stakes. Direct answer from domain expert recommended.';
  }

  // Get recommended personas
  const suggestedPersonas = suggestPersonasForRequest(request);
  const recommendedPersonas = suggestedPersonas.slice(0, tier === 'complex' ? 3 : 1).map(p => p.name);

  // If no personas matched, suggest defaults based on tier
  if (recommendedPersonas.length === 0) {
    if (tier === 'complex') {
      recommendedPersonas.push('Bernstein-Orchestrator', 'Franklin-Deep-Reasoner');
    } else {
      recommendedPersonas.push('Franklin-Deep-Reasoner');
    }
  }

  // Get recommended patterns based on tier
  let recommendedPatterns: string[];
  if (tier === 'simple') {
    recommendedPatterns = [];
  } else if (tier === 'moderate') {
    recommendedPatterns = ['chain-of-thought', 'recursive-self-eval'];
  } else {
    recommendedPatterns = ['planning-phase', 'orchestration', 'chain-of-thought', 'criterion-based-evaluation'];
  }

  // Get workflow description
  let workflow: string;
  if (tier === 'simple') {
    workflow = 'Principles → Persona → Direct answer';
  } else if (tier === 'moderate') {
    workflow = 'Principles → Persona → Patterns → Self-review → Answer';
  } else {
    workflow = 'Principles → Bootstrapper → Bernstein → Hopper → Workers → Ada → Evaluators → Human';
  }

  return {
    tier,
    reasoning,
    signals,
    recommended_personas: recommendedPersonas,
    recommended_patterns: recommendedPatterns,
    workflow,
  };
}
