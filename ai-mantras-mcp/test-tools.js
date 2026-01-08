#!/usr/bin/env node

/**
 * Test script for AI Mantras MCP Server Tools
 */

import { handleAssessComplexity } from './dist/tools/assess-complexity.js';
import { handleGetPersona } from './dist/tools/get-persona.js';
import { handleGetPattern } from './dist/tools/get-pattern.js';
import { handleGetWorkflow } from './dist/tools/get-workflow.js';
import { handleCreateHandoff } from './dist/tools/create-handoff.js';
import { handleListAvailable } from './dist/tools/list-available.js';

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
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

console.log('\n=== AI Mantras MCP Tool Tests ===\n');

// assess_complexity tests
console.log('--- assess_complexity ---');

await test('Simple request is classified as simple', async () => {
  const result = JSON.parse(await handleAssessComplexity({
    request: "What's the difference between ZFS and Ceph?"
  }));
  assert(result.tier === 'simple', `Expected simple, got ${result.tier}`);
});

await test('Moderate request is classified as moderate', async () => {
  const result = JSON.parse(await handleAssessComplexity({
    request: "Help me design a backup strategy for my homelab"
  }));
  assert(result.tier === 'moderate' || result.tier === 'simple',
    `Expected moderate or simple, got ${result.tier}`);
});

await test('Complex request is classified as complex', async () => {
  const result = JSON.parse(await handleAssessComplexity({
    request: "Help me decide whether to leave my job and start a company given my financial situation, family obligations, and career goals"
  }));
  assert(result.tier === 'complex', `Expected complex, got ${result.tier}`);
});

await test('Returns recommended personas', async () => {
  const result = JSON.parse(await handleAssessComplexity({
    request: "Analyze my investment portfolio for risk"
  }));
  assert(result.recommended_personas.length > 0, 'Should have recommended personas');
});

// get_persona tests
console.log('\n--- get_persona ---');

await test('Load persona by exact name', async () => {
  const result = await handleGetPersona({ name: 'Kestra-Systems-Architect' });
  assert(result.includes('Systems'), 'Should contain Systems');
  assert(result.includes('infrastructure') || result.includes('Infrastructure'), 'Should mention infrastructure');
});

await test('Load persona by domain', async () => {
  const result = await handleGetPersona({ domain: 'finance investment' });
  assert(result.includes('Clara') || result.includes('Financial'), 'Should match Clara');
});

await test('Error on missing name and domain', async () => {
  try {
    await handleGetPersona({});
    throw new Error('Should have thrown');
  } catch (e) {
    assert(e.message.includes('must be provided'), 'Should require name or domain');
  }
});

// get_pattern tests
console.log('\n--- get_pattern ---');

await test('Load pattern by name', async () => {
  const result = await handleGetPattern({ name: 'chain-of-thought' });
  assert(result.length > 100, 'Should have substantial content');
});

await test('Error on missing name', async () => {
  try {
    await handleGetPattern({});
    throw new Error('Should have thrown');
  } catch (e) {
    assert(e.message.includes('required'), 'Should require name');
  }
});

// get_workflow tests
console.log('\n--- get_workflow ---');

await test('Get simple workflow', async () => {
  const result = await handleGetWorkflow({ tier: 'simple' });
  assert(result.includes('Simple'), 'Should contain Simple');
  assert(result.includes('Direct answer'), 'Should mention direct answer');
});

await test('Get moderate workflow', async () => {
  const result = await handleGetWorkflow({ tier: 'moderate' });
  assert(result.includes('Moderate'), 'Should contain Moderate');
  assert(result.includes('self-review') || result.includes('Self-review'), 'Should mention self-review');
});

await test('Get complex workflow', async () => {
  const result = await handleGetWorkflow({ tier: 'complex' });
  assert(result.includes('Complex'), 'Should contain Complex');
  assert(result.includes('Bernstein') || result.includes('orchestration'), 'Should mention orchestration');
});

// create_handoff tests
console.log('\n--- create_handoff ---');

await test('Create handoff template', async () => {
  const result = await handleCreateHandoff({
    from_persona: 'Hopper-Project-Planner',
    to_persona: 'Clara-Financial-Analyst',
    task: 'Analyze investment portfolio',
    inputs: 'portfolio.json',
    patterns: ['rule-based-reasoning', 'chain-of-thought'],
    success_criteria: 'Clear recommendation with risk analysis',
    constraints: 'Do not recommend speculative investments'
  });
  assert(result.includes('HANDOFF TO: Clara-Financial-Analyst'), 'Should have target persona');
  assert(result.includes('FROM: Hopper-Project-Planner'), 'Should have source persona');
  assert(result.includes('Analyze investment portfolio'), 'Should have task');
});

// list_available tests
console.log('\n--- list_available ---');

await test('List all personas', async () => {
  const result = await handleListAvailable({ type: 'personas' });
  assert(result.includes('Clara'), 'Should list Clara');
  assert(result.includes('Kestra'), 'Should list Kestra');
  assert(result.includes('Bernstein'), 'Should list Bernstein');
});

await test('List all patterns', async () => {
  const result = await handleListAvailable({ type: 'patterns' });
  assert(result.includes('chain-of-thought'), 'Should list chain-of-thought');
  assert(result.includes('planning-phase'), 'Should list planning-phase');
});

await test('List everything', async () => {
  const result = await handleListAvailable({ type: 'all' });
  assert(result.includes('Personas'), 'Should have Personas section');
  assert(result.includes('Patterns'), 'Should have Patterns section');
  assert(result.includes('Summary'), 'Should have Summary');
});

// Summary
console.log('\n=== Tool Test Results ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total:  ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
