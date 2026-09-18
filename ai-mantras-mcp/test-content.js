#!/usr/bin/env node

/**
 * Test script for AI Mantras MCP Server
 * Tests content loading and tool logic
 */

import {
  loadPrinciples,
  loadBootstrapper,
  loadEntryPoint,
  loadManifest,
  loadPersona,
  loadPattern,
  loadSkill,
  getAllPersonas,
  getAllPatterns,
} from './dist/utils/content-loader.js';

import { matchDomainToPersona, suggestPersonasForRequest } from './dist/utils/persona-matcher.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('\n=== AI Mantras MCP Server Tests ===\n');

// Content Loading Tests
console.log('--- Content Loading ---');

test('Load guiding principles', () => {
  const content = loadPrinciples();
  assert(content.includes('Noble Intelligence'), 'Should contain Noble Intelligence');
  assert(content.includes('Wisdom'), 'Should contain Wisdom');
  assert(content.length > 1000, 'Should have substantial content');
});

test('Load bootstrapper', () => {
  const content = loadBootstrapper();
  assert(content.includes('Orchestration'), 'Should contain Orchestration');
  assert(content.includes('Domain'), 'Should contain Domain');
  assert(content.includes('Evaluation'), 'Should contain Evaluation');
});

test('Load entry point (AIMantra.md)', () => {
  const content = loadEntryPoint();
  assert(content.includes('SIMPLE'), 'Should contain SIMPLE tier');
  assert(content.includes('MODERATE'), 'Should contain MODERATE tier');
  assert(content.includes('COMPLEX'), 'Should contain COMPLEX tier');
});

test('Load manifest', () => {
  const manifest = loadManifest();
  assert(manifest.metadata.name === 'AI Mantras', 'Should have correct name');
  assert(manifest.personas.orchestration.members.length > 0, 'Should have orchestration personas');
  assert(manifest.personas.domain.members.length > 0, 'Should have domain personas');
  assert(manifest.personas.evaluation.members.length > 0, 'Should have evaluation personas');
});

// Persona Loading Tests
console.log('\n--- Persona Loading ---');

test('Load Kestra persona by exact name', () => {
  const content = loadPersona('Kestra-Systems-Architect');
  assert(content.includes('Systems'), 'Should contain Systems');
  assert(content.includes('infrastructure') || content.includes('Infrastructure'), 'Should mention infrastructure');
});

test('Load Clara persona by exact name', () => {
  const content = loadPersona('Clara-Financial-Analyst');
  assert(content.includes('Financial') || content.includes('valuation') || content.includes('portfolio'),
    'Should mention Financial, valuation, or portfolio');
});

test('Load all personas without errors', () => {
  const allPersonas = getAllPersonas();
  let count = 0;
  for (const { category, personas } of allPersonas) {
    for (const persona of personas) {
      loadPersona(persona.name);
      count++;
    }
  }
  assert(count >= 10, `Should load at least 10 personas, got ${count}`);
});

// Pattern Loading Tests
console.log('\n--- Pattern Loading ---');

test('Load chain-of-thought pattern', () => {
  const content = loadPattern('chain-of-thought');
  assert(content.length > 100, 'Should have substantial content');
});

test('Load planning-phase pattern', () => {
  const content = loadPattern('planning-phase');
  assert(content.length > 100, 'Should have substantial content');
});

test('Load all patterns without errors', () => {
  const allPatterns = getAllPatterns();
  let count = 0;
  for (const { layer, patterns } of allPatterns) {
    for (const pattern of patterns) {
      loadPattern(pattern.name);
      count++;
    }
  }
  assert(count >= 7, `Should load at least 7 patterns, got ${count}`);
});

test('Load agentic-loop pattern', () => {
  const content = loadPattern('agentic-loop');
  assert(content.length > 100, 'Should have substantial content');
});

test('Load graph-orchestration pattern', () => {
  const content = loadPattern('graph-orchestration');
  assert(content.length > 100, 'Should have substantial content');
});

// Skill Loading Tests
console.log('\n--- Skill Loading ---');

test('Load persona-creation skill', () => {
  const content = loadSkill('persona-creation');
  assert(content.length > 100, 'Should have substantial content');
  assert(content.includes('human approval'), 'Should include the human approval gate');
});

// Persona Matcher Tests
console.log('\n--- Persona Matching ---');

test('Match finance domain to Clara', () => {
  const matched = matchDomainToPersona('finance investment portfolio');
  assert(matched !== null, 'Should find a match');
  assert(matched.name.includes('Clara') || matched.name.includes('Financial'),
    `Should match Clara, got ${matched?.name}`);
});

test('Match infrastructure domain to Kestra', () => {
  const matched = matchDomainToPersona('proxmox homelab server');
  assert(matched !== null, 'Should find a match');
  assert(matched.name.includes('Kestra') || matched.name.includes('Systems'),
    `Should match Kestra, got ${matched?.name}`);
});

test('Match philosophy domain to Goeth', () => {
  const matched = matchDomainToPersona('ethics philosophy meaning');
  assert(matched !== null, 'Should find a match');
  assert(matched.name.includes('Goeth') || matched.name.includes('Philosophical'),
    `Should match Goeth, got ${matched?.name}`);
});

test('Suggest personas for financial request', () => {
  const suggestions = suggestPersonasForRequest('Help me analyze my investment portfolio');
  assert(suggestions.length > 0, 'Should have suggestions');
  assert(suggestions[0].name.includes('Clara') || suggestions[0].name.includes('Financial'),
    `Top suggestion should be Clara, got ${suggestions[0]?.name}`);
});

test('Suggest personas for infrastructure request', () => {
  const suggestions = suggestPersonasForRequest('Design a backup strategy for ZFS');
  assert(suggestions.length > 0, 'Should have suggestions');
  assert(suggestions[0].name.includes('Kestra') || suggestions[0].name.includes('Systems'),
    `Top suggestion should be Kestra, got ${suggestions[0]?.name}`);
});

// Summary
console.log('\n=== Test Results ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total:  ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
