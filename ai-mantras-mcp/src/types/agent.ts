/**
 * Agent Types - Type definitions for spawned agents
 */

export type AgentStatus = 'pending' | 'running' | 'completed' | 'failed' | 'timeout';

export type LLMProvider = 'anthropic' | 'openai';

export interface AgentUsage {
  input_tokens: number;
  output_tokens: number;
}

export interface SpawnedAgent {
  id: string;
  persona: string;
  task: string;
  inputs?: Record<string, unknown>;
  success_criteria?: string;
  patterns?: string[];
  provider: LLMProvider;
  model: string;

  status: AgentStatus;
  created_at: Date;
  started_at?: Date;
  completed_at?: Date;

  result?: string;
  error?: string;
  usage?: AgentUsage;
}

export interface AgentCallOptions {
  provider: LLMProvider;
  model: string;
  systemPrompt: string;
  userMessage: string;
  maxTokens: number;
  timeoutMs?: number;
}

export interface AgentCallResult {
  content: string;
  usage: AgentUsage;
  stopReason: string;
}
