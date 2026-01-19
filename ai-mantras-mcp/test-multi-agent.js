#!/usr/bin/env node

/**
 * Test script for AI Mantras MCP Server Multi-Agent Tools
 *
 * Tests agent store, config, prompt builder, and tool handlers.
 * Does NOT make actual LLM API calls.
 */

// Enable multi-agent mode for tests
process.env.MANTRAS_MULTI_AGENT_ENABLED = 'true';

import { getAgentStore, createAgent, generateAgentId } from './dist/utils/agent-store.js';
import { loadAgentConfig, isProviderConfigured, getDefaultModel, clearConfigCache, isMultiAgentEnabled } from './dist/utils/config.js';
import { buildSystemPrompt, buildUserMessage, estimateTokens } from './dist/utils/prompt-builder.js';
import { handleListAgents } from './dist/tools/list-agents.js';
import { handleGetAgentResult } from './dist/tools/get-agent-result.js';
import { handleSpawnAgent } from './dist/tools/spawn-agent.js';
import { registerTools } from './dist/tools/index.js';

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

console.log('\n=== AI Mantras Multi-Agent Tool Tests ===\n');

// --- Agent Store Tests ---
console.log('--- agent-store ---');

await test('Generate unique agent IDs', async () => {
  const id1 = generateAgentId();
  const id2 = generateAgentId();
  assert(id1.startsWith('agent_'), 'ID should start with agent_');
  assert(id1 !== id2, 'IDs should be unique');
  assert(id1.length > 10, 'ID should have reasonable length');
});

await test('Create agent record', async () => {
  const agent = createAgent({
    persona: 'Clara-Financial-Analyst',
    task: 'Analyze portfolio',
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
  });
  assert(agent.id.startsWith('agent_'), 'Should have valid ID');
  assert(agent.persona === 'Clara-Financial-Analyst', 'Should have persona');
  assert(agent.task === 'Analyze portfolio', 'Should have task');
  assert(agent.status === 'pending', 'Should start as pending');
  assert(agent.created_at instanceof Date, 'Should have creation date');
});

await test('Agent store add and get', async () => {
  const store = getAgentStore();
  store.clear();

  const agent = createAgent({
    persona: 'Kestra-Systems-Architect',
    task: 'Design infrastructure',
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
  });

  store.add(agent);
  const retrieved = store.get(agent.id);

  assert(retrieved !== undefined, 'Should retrieve agent');
  assert(retrieved.id === agent.id, 'Should match ID');
  assert(retrieved.persona === 'Kestra-Systems-Architect', 'Should match persona');
});

await test('Agent store update', async () => {
  const store = getAgentStore();
  store.clear();

  const agent = createAgent({
    persona: 'Ada-QA-Reviewer',
    task: 'Review code',
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
  });

  store.add(agent);
  store.update(agent.id, { status: 'running', started_at: new Date() });

  const updated = store.get(agent.id);
  assert(updated.status === 'running', 'Status should be updated');
  assert(updated.started_at instanceof Date, 'Should have started_at');
});

await test('Agent store list with filter', async () => {
  const store = getAgentStore();
  store.clear();

  // Add agents with different statuses
  const agent1 = createAgent({ persona: 'Clara-Financial-Analyst', task: 'Task 1', provider: 'anthropic', model: 'test' });
  const agent2 = createAgent({ persona: 'Kestra-Systems-Architect', task: 'Task 2', provider: 'anthropic', model: 'test' });
  const agent3 = createAgent({ persona: 'Ada-QA-Reviewer', task: 'Task 3', provider: 'anthropic', model: 'test' });

  store.add(agent1);
  store.add(agent2);
  store.add(agent3);

  store.update(agent1.id, { status: 'completed', completed_at: new Date(), result: 'Done' });
  store.update(agent2.id, { status: 'running', started_at: new Date() });

  const all = store.list({ status: 'all' });
  assert(all.length === 3, 'Should list all agents');

  const completed = store.list({ status: 'completed' });
  assert(completed.length === 1, 'Should filter completed');

  const running = store.list({ status: 'running' });
  assert(running.length === 1, 'Should filter running');
});

await test('Agent store running count', async () => {
  const store = getAgentStore();
  store.clear();

  assert(store.getRunningCount() === 0, 'Should start with 0 running');

  const agent = createAgent({ persona: 'Clara-Financial-Analyst', task: 'Test', provider: 'anthropic', model: 'test' });
  store.add(agent);
  store.update(agent.id, { status: 'running' });

  assert(store.getRunningCount() === 1, 'Should have 1 running');

  store.update(agent.id, { status: 'completed' });
  assert(store.getRunningCount() === 0, 'Should have 0 running after completion');
});

// --- Config Tests ---
console.log('\n--- config ---');

await test('Multi-agent mode is enabled via env var', async () => {
  clearConfigCache();
  const enabled = isMultiAgentEnabled();
  assert(enabled === true, 'Should be enabled when MANTRAS_MULTI_AGENT_ENABLED=true');
});

await test('Multi-agent tools are registered when enabled', async () => {
  clearConfigCache();
  const tools = registerTools();
  const toolNames = tools.map(t => t.name);

  assert(toolNames.includes('spawn_agent'), 'Should include spawn_agent');
  assert(toolNames.includes('get_agent_result'), 'Should include get_agent_result');
  assert(toolNames.includes('list_agents'), 'Should include list_agents');
});

await test('Load agent config', async () => {
  clearConfigCache();
  const config = loadAgentConfig();

  assert(config.multiAgentEnabled === true, 'Should have multiAgentEnabled');
  assert(config.defaultProvider === 'anthropic' || config.defaultProvider === 'openai', 'Should have valid provider');
  assert(typeof config.maxConcurrentAgents === 'number', 'Should have max concurrent');
  assert(config.maxConcurrentAgents > 0, 'Max concurrent should be positive');
  assert(typeof config.defaultTimeoutMs === 'number', 'Should have timeout');
});

await test('Get default model for provider', async () => {
  const anthropicModel = getDefaultModel('anthropic');
  const openaiModel = getDefaultModel('openai');

  assert(anthropicModel.includes('claude'), 'Anthropic model should contain claude');
  assert(openaiModel.includes('gpt'), 'OpenAI model should contain gpt');
});

await test('Check provider configuration', async () => {
  // These may be true or false depending on env, just verify they return boolean
  const anthropicConfigured = isProviderConfigured('anthropic');
  const openaiConfigured = isProviderConfigured('openai');

  assert(typeof anthropicConfigured === 'boolean', 'Should return boolean');
  assert(typeof openaiConfigured === 'boolean', 'Should return boolean');
});

// --- Prompt Builder Tests ---
console.log('\n--- prompt-builder ---');

await test('Build system prompt with persona', async () => {
  const prompt = buildSystemPrompt({
    persona: 'Clara-Financial-Analyst',
    task: 'Analyze investment',
  });

  assert(prompt.includes('Clara'), 'Should include persona name');
  assert(prompt.includes('Context Isolation'), 'Should include isolation notice');
  assert(prompt.includes('Guiding Principles') || prompt.includes('Persona'), 'Should have structure');
});

await test('Build system prompt with patterns', async () => {
  const prompt = buildSystemPrompt({
    persona: 'Kestra-Systems-Architect',
    task: 'Design system',
    patterns: ['chain-of-thought'],
  });

  assert(prompt.includes('Thinking Patterns'), 'Should include patterns section');
  assert(prompt.includes('chain-of-thought'), 'Should include pattern name');
});

await test('Build user message with inputs', async () => {
  const message = buildUserMessage({
    persona: 'Clara-Financial-Analyst',
    task: 'Analyze this portfolio',
    inputs: {
      portfolio: [{ ticker: 'AAPL', shares: 100 }],
      risk_tolerance: 'moderate',
    },
    successCriteria: 'Provide allocation recommendation',
  });

  assert(message.includes('Analyze this portfolio'), 'Should include task');
  assert(message.includes('Inputs'), 'Should have inputs section');
  assert(message.includes('portfolio'), 'Should include input key');
  assert(message.includes('Success Criteria'), 'Should have success criteria');
});

await test('Estimate token count', async () => {
  const short = estimateTokens('Hello world');
  const long = estimateTokens('This is a longer string that should have more tokens than the short one');

  assert(short > 0, 'Should estimate positive tokens');
  assert(long > short, 'Longer text should have more tokens');
});

// --- list_agents Handler Tests ---
console.log('\n--- list_agents ---');

await test('List agents with empty store', async () => {
  const store = getAgentStore();
  store.clear();

  const result = await handleListAgents({});
  assert(result.includes('No agents found'), 'Should indicate empty');
  assert(result.includes('spawn_agent'), 'Should suggest spawn_agent');
});

await test('List agents with agents present', async () => {
  const store = getAgentStore();
  store.clear();

  const agent = createAgent({
    persona: 'Clara-Financial-Analyst',
    task: 'Test task for listing',
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
  });
  store.add(agent);
  store.update(agent.id, { status: 'completed', completed_at: new Date(), result: 'Done', usage: { input_tokens: 100, output_tokens: 50 } });

  const result = await handleListAgents({});
  assert(result.includes('Clara-Financial-Analyst'), 'Should list persona');
  assert(result.includes('completed'), 'Should show status');
  assert(result.includes('Total:'), 'Should show total count');
});

await test('List agents with status filter', async () => {
  const store = getAgentStore();
  store.clear();

  const agent1 = createAgent({ persona: 'Clara-Financial-Analyst', task: 'Task 1', provider: 'anthropic', model: 'test' });
  const agent2 = createAgent({ persona: 'Kestra-Systems-Architect', task: 'Task 2', provider: 'anthropic', model: 'test' });

  store.add(agent1);
  store.add(agent2);
  store.update(agent1.id, { status: 'completed', completed_at: new Date() });

  const completedResult = await handleListAgents({ status: 'completed' });
  assert(completedResult.includes('Clara'), 'Should include completed agent');
  assert(completedResult.includes('**Filter:** completed'), 'Should show filter');
});

// --- get_agent_result Handler Tests ---
console.log('\n--- get_agent_result ---');

await test('Get result for missing agent', async () => {
  const store = getAgentStore();
  store.clear();

  try {
    await handleGetAgentResult({ agent_id: 'agent_nonexistent' });
    throw new Error('Should have thrown');
  } catch (e) {
    assert(e.message.includes('not found'), 'Should indicate not found');
  }
});

await test('Get result for completed agent', async () => {
  const store = getAgentStore();
  store.clear();

  const agent = createAgent({
    persona: 'Ada-QA-Reviewer',
    task: 'Review this code',
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
  });
  store.add(agent);
  store.update(agent.id, {
    status: 'completed',
    started_at: new Date(Date.now() - 5000),
    completed_at: new Date(),
    result: 'Code looks good. No issues found.',
    usage: { input_tokens: 200, output_tokens: 100 },
  });

  const result = await handleGetAgentResult({ agent_id: agent.id });
  assert(result.includes('COMPLETED'), 'Should show completed status');
  assert(result.includes('Ada-QA-Reviewer'), 'Should show persona');
  assert(result.includes('Code looks good'), 'Should include result');
  assert(result.includes('Tokens:'), 'Should show token usage');
});

await test('Get result for failed agent', async () => {
  const store = getAgentStore();
  store.clear();

  const agent = createAgent({
    persona: 'Kestra-Systems-Architect',
    task: 'Design something',
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
  });
  store.add(agent);
  store.update(agent.id, {
    status: 'failed',
    completed_at: new Date(),
    error: 'API rate limit exceeded',
  });

  const result = await handleGetAgentResult({ agent_id: agent.id });
  assert(result.includes('FAILED'), 'Should show failed status');
  assert(result.includes('Error'), 'Should have error section');
  assert(result.includes('rate limit'), 'Should include error message');
});

await test('Get result requires agent_id', async () => {
  try {
    await handleGetAgentResult({});
    throw new Error('Should have thrown');
  } catch (e) {
    assert(e.message.includes('required'), 'Should require agent_id');
  }
});

// --- spawn_agent Handler Tests (Validation Only) ---
console.log('\n--- spawn_agent (validation) ---');

await test('Spawn agent rejects invalid persona', async () => {
  try {
    await handleSpawnAgent({
      persona: 'NonExistent-Persona',
      task: 'Do something',
    });
    throw new Error('Should have thrown');
  } catch (e) {
    assert(e.message.includes('not found'), 'Should indicate persona not found');
    assert(e.message.includes('Available personas'), 'Should list available personas');
  }
});

await test('Spawn agent validates persona exists', async () => {
  // This test will fail at the API call stage (no key), but validates persona check passes
  try {
    await handleSpawnAgent({
      persona: 'Clara-Financial-Analyst',
      task: 'Analyze something',
    });
    // If we get here without API key, it means persona validation passed
    throw new Error('Should have thrown (no API key)');
  } catch (e) {
    // Either "not configured" (no API key) or actual success then error
    // Both mean persona validation passed
    const validationPassed = !e.message.includes('Persona not found');
    assert(validationPassed, 'Persona validation should pass for valid persona');
  }
});

// Cleanup
const store = getAgentStore();
store.clear();

// Summary
console.log('\n=== Multi-Agent Test Results ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total:  ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}
