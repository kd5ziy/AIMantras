/**
 * Persona Matcher - Maps domains and keywords to appropriate personas
 */

import { loadManifest, PersonaInfo } from './content-loader.js';

// Domain keywords mapped to persona names
const DOMAIN_MAPPINGS: Record<string, string[]> = {
  // Clara - Financial Analyst
  'Clara-Financial-Analyst': [
    'finance', 'financial', 'money', 'investment', 'investing', 'stock', 'stocks',
    'portfolio', 'etf', 'bond', 'bonds', 'retirement', 'mortgage', 'refinance',
    'budget', 'budgeting', 'savings', 'debt', 'loan', 'tax', 'taxes', 'wealth',
    'dcf', 'valuation', 'equity', 'risk', 'hedge', 'hedging', 'market', 'trading'
  ],

  // Kestra - Systems Architect
  'Kestra-Systems-Architect': [
    'infrastructure', 'infra', 'homelab', 'server', 'servers', 'proxmox', 'vm',
    'virtual', 'virtualization', 'container', 'docker', 'kubernetes', 'k8s',
    'network', 'networking', 'vlan', 'vpn', 'firewall', 'router', 'switch',
    'storage', 'zfs', 'ceph', 'nas', 'backup', 'restore', 'raid', 'ssd', 'nvme',
    'cicd', 'devops', 'terraform', 'ansible', 'iac', 'monitoring', 'observability',
    'disaster', 'recovery', 'capacity', 'performance', 'linux', 'opnsense', 'unifi'
  ],

  // Goeth - Philosophical Synthesizer
  'Goeth-Philosophical-Synthesizer': [
    'philosophy', 'philosophical', 'ethics', 'ethical', 'moral', 'morality',
    'meaning', 'purpose', 'values', 'value', 'wisdom', 'reflection', 'reflective',
    'existential', 'metaphysics', 'epistemology', 'narrative', 'synthesis',
    'framework', 'worldview', 'belief', 'beliefs', 'thinking', 'thought'
  ],

  // Franklin - Deep Reasoner
  'Franklin-Deep-Reasoner': [
    'complex', 'complicated', 'multi-domain', 'cross-domain', 'integration',
    'synthesis', 'reasoning', 'reason', 'analysis', 'deep', 'thorough',
    'comprehensive', 'systems', 'systemic', 'holistic', 'tradeoff', 'tradeoffs',
    'decision', 'life', 'career', 'major', 'important', 'critical'
  ],

  // Watson - Medical Advisor
  'Watson-Medical-Advisor': [
    'medical', 'medicine', 'health', 'healthcare', 'doctor', 'diagnosis',
    'symptom', 'symptoms', 'treatment', 'therapy', 'medication', 'drug', 'drugs',
    'disease', 'illness', 'condition', 'clinical', 'patient', 'wellness',
    'mental', 'psychological', 'psychiatric', 'nutrition', 'diet', 'exercise'
  ],

  // Bernstein - Orchestrator
  'Bernstein-Orchestrator': [
    'orchestrate', 'orchestration', 'coordinate', 'coordination', 'workflow',
    'multi-step', 'multistep', 'plan', 'planning', 'strategy', 'strategic'
  ],

  // Hopper - Project Planner
  'Hopper-Project-Planner': [
    'project', 'plan', 'planning', 'breakdown', 'decompose', 'task', 'tasks',
    'milestone', 'timeline', 'schedule', 'scope', 'requirement', 'requirements'
  ],

  // Lovell - Crisis Planner
  'Lovell-Crisis-Planner': [
    'crisis', 'emergency', 'urgent', 'critical', 'disaster', 'incident',
    'response', 'recovery', 'contingency', 'risk', 'threat', 'immediate'
  ],

  // Ada - QA Reviewer
  'Ada-QA-Reviewer': [
    'review', 'qa', 'quality', 'check', 'verify', 'audit', 'assess',
    'evaluate', 'critique', 'feedback', 'improve', 'improvement'
  ],

  // Drucker - Goal Satisfaction Evaluator
  'Drucker-Goal-Satisfaction-Evaluator': [
    'goal', 'goals', 'objective', 'objectives', 'measure', 'metric', 'metrics',
    'kpi', 'success', 'criteria', 'achievement', 'outcome', 'outcomes'
  ],

  // Rickover - Safety Evaluator
  'Rickover-Safety-Evaluator': [
    'safety', 'safe', 'security', 'secure', 'vulnerability', 'threat',
    'risk', 'compliance', 'regulation', 'audit', 'owasp', 'nist', 'hipaa', 'gdpr'
  ]
};

/**
 * Match a domain query to the best persona
 */
export function matchDomainToPersona(domain: string): PersonaInfo | null {
  const manifest = loadManifest();
  const domainLower = domain.toLowerCase();

  // Check each persona's keywords
  let bestMatch: { persona: PersonaInfo; score: number } | null = null;

  for (const [personaName, keywords] of Object.entries(DOMAIN_MAPPINGS)) {
    const matchCount = keywords.filter(kw => domainLower.includes(kw)).length;
    if (matchCount > 0 && (!bestMatch || matchCount > bestMatch.score)) {
      // Find the persona info from manifest
      const categories = ['orchestration', 'domain', 'evaluation'] as const;
      for (const category of categories) {
        const found = manifest.personas[category].members.find(p => p.name === personaName);
        if (found) {
          bestMatch = { persona: found, score: matchCount };
          break;
        }
      }
    }
  }

  return bestMatch?.persona || null;
}

/**
 * Get personas that might be relevant for a request
 */
export function suggestPersonasForRequest(request: string): PersonaInfo[] {
  const manifest = loadManifest();
  const requestLower = request.toLowerCase();
  const suggestions: { persona: PersonaInfo; score: number }[] = [];

  for (const [personaName, keywords] of Object.entries(DOMAIN_MAPPINGS)) {
    const matchCount = keywords.filter(kw => requestLower.includes(kw)).length;
    if (matchCount > 0) {
      // Find the persona info from manifest
      const categories = ['orchestration', 'domain', 'evaluation'] as const;
      for (const category of categories) {
        const found = manifest.personas[category].members.find(p => p.name === personaName);
        if (found) {
          suggestions.push({ persona: found, score: matchCount });
          break;
        }
      }
    }
  }

  // Sort by score descending and return unique personas
  return suggestions
    .sort((a, b) => b.score - a.score)
    .map(s => s.persona);
}

/**
 * Get all domain keywords for a persona
 */
export function getPersonaKeywords(personaName: string): string[] {
  return DOMAIN_MAPPINGS[personaName] || [];
}
