/**
 * Agent Store - In-memory storage for spawned agents
 */

import { v4 as uuidv4 } from 'uuid';
import { SpawnedAgent, AgentStatus, LLMProvider } from '../types/agent.js';
import { loadAgentConfig } from './config.js';

class InMemoryAgentStore {
  private agents: Map<string, SpawnedAgent> = new Map();
  private runningCount = 0;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Periodic cleanup of old completed agents (every 5 minutes)
    this.cleanupInterval = setInterval(() => {
      this.cleanup(30 * 60 * 1000); // Remove agents older than 30 minutes
    }, 5 * 60 * 1000);
  }

  /**
   * Add a new agent to the store
   */
  add(agent: SpawnedAgent): void {
    this.agents.set(agent.id, agent);
  }

  /**
   * Get an agent by ID
   */
  get(id: string): SpawnedAgent | undefined {
    return this.agents.get(id);
  }

  /**
   * Update an agent's properties
   */
  update(id: string, updates: Partial<SpawnedAgent>): void {
    const agent = this.agents.get(id);
    if (agent) {
      // Track running count changes
      if (updates.status === 'running' && agent.status !== 'running') {
        this.runningCount++;
      } else if (updates.status && updates.status !== 'running' && agent.status === 'running') {
        this.runningCount--;
      }

      Object.assign(agent, updates);
    }
  }

  /**
   * List agents with optional filter
   */
  list(filter?: { status?: AgentStatus | 'all' }): SpawnedAgent[] {
    const agents = Array.from(this.agents.values());
    if (filter?.status && filter.status !== 'all') {
      return agents
        .filter(a => a.status === filter.status)
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    }
    return agents.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  /**
   * Clean up old completed/failed agents
   */
  cleanup(olderThanMs: number): number {
    const cutoff = Date.now() - olderThanMs;
    let removed = 0;

    for (const [id, agent] of this.agents) {
      if (
        agent.status === 'completed' ||
        agent.status === 'failed' ||
        agent.status === 'timeout'
      ) {
        if (agent.completed_at && agent.completed_at.getTime() < cutoff) {
          this.agents.delete(id);
          removed++;
        }
      }
    }

    return removed;
  }

  /**
   * Check if we can spawn another async agent
   */
  canSpawnAsync(): boolean {
    const config = loadAgentConfig();
    return this.runningCount < config.maxConcurrentAgents;
  }

  /**
   * Get current running count
   */
  getRunningCount(): number {
    return this.runningCount;
  }

  /**
   * Get total agent count
   */
  getTotalCount(): number {
    return this.agents.size;
  }

  /**
   * Clear all agents (useful for testing)
   */
  clear(): void {
    this.agents.clear();
    this.runningCount = 0;
  }

  /**
   * Stop cleanup interval
   */
  dispose(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Singleton instance
let storeInstance: InMemoryAgentStore | null = null;

/**
 * Get the agent store singleton
 */
export function getAgentStore(): InMemoryAgentStore {
  if (!storeInstance) {
    storeInstance = new InMemoryAgentStore();
  }
  return storeInstance;
}

/**
 * Generate a unique agent ID
 */
export function generateAgentId(): string {
  return `agent_${uuidv4().slice(0, 8)}`;
}

/**
 * Create a new agent record
 */
export function createAgent(params: {
  persona: string;
  task: string;
  inputs?: Record<string, unknown>;
  success_criteria?: string;
  patterns?: string[];
  provider: LLMProvider;
  model: string;
}): SpawnedAgent {
  return {
    id: generateAgentId(),
    persona: params.persona,
    task: params.task,
    inputs: params.inputs,
    success_criteria: params.success_criteria,
    patterns: params.patterns,
    provider: params.provider,
    model: params.model,
    status: 'pending',
    created_at: new Date(),
  };
}
