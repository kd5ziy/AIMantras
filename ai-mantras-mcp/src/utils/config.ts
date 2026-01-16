/**
 * Configuration - Load and validate environment configuration for agent spawning
 */

import { LLMProvider } from '../types/agent.js';

export interface AgentConfig {
  anthropicApiKey?: string;
  openaiApiKey?: string;
  defaultProvider: LLMProvider;
  defaultModel: string;
  maxConcurrentAgents: number;
  defaultTimeoutMs: number;
}

const DEFAULT_MODELS: Record<LLMProvider, string> = {
  anthropic: 'claude-sonnet-4-20250514',
  openai: 'gpt-4o',
};

let cachedConfig: AgentConfig | null = null;

/**
 * Load configuration from environment variables
 */
export function loadAgentConfig(): AgentConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  // Determine default provider
  let defaultProvider: LLMProvider = 'anthropic';
  const envProvider = process.env.MANTRAS_DEFAULT_PROVIDER?.toLowerCase();
  if (envProvider === 'openai') {
    defaultProvider = 'openai';
  } else if (envProvider === 'anthropic') {
    defaultProvider = 'anthropic';
  } else if (!anthropicApiKey && openaiApiKey) {
    // Auto-select based on available keys
    defaultProvider = 'openai';
  }

  // Determine default model
  const envModel = process.env.MANTRAS_DEFAULT_MODEL;
  const defaultModel = envModel || DEFAULT_MODELS[defaultProvider];

  cachedConfig = {
    anthropicApiKey,
    openaiApiKey,
    defaultProvider,
    defaultModel,
    maxConcurrentAgents: parseInt(process.env.MANTRAS_MAX_CONCURRENT_AGENTS || '5', 10),
    defaultTimeoutMs: parseInt(process.env.MANTRAS_AGENT_TIMEOUT_MS || '120000', 10),
  };

  return cachedConfig;
}

/**
 * Check if a provider is configured with an API key
 */
export function isProviderConfigured(provider: LLMProvider): boolean {
  const config = loadAgentConfig();
  if (provider === 'anthropic') {
    return !!config.anthropicApiKey;
  }
  if (provider === 'openai') {
    return !!config.openaiApiKey;
  }
  return false;
}

/**
 * Get the API key for a provider
 */
export function getApiKey(provider: LLMProvider): string {
  const config = loadAgentConfig();
  if (provider === 'anthropic') {
    if (!config.anthropicApiKey) {
      throw new Error(
        'ANTHROPIC_API_KEY environment variable is required for Anthropic provider. ' +
        'Please set it to your Anthropic API key.'
      );
    }
    return config.anthropicApiKey;
  }
  if (provider === 'openai') {
    if (!config.openaiApiKey) {
      throw new Error(
        'OPENAI_API_KEY environment variable is required for OpenAI provider. ' +
        'Please set it to your OpenAI API key.'
      );
    }
    return config.openaiApiKey;
  }
  throw new Error(`Unknown provider: ${provider}`);
}

/**
 * Get the default model for a provider
 */
export function getDefaultModel(provider: LLMProvider): string {
  return DEFAULT_MODELS[provider];
}

/**
 * Clear cached config (useful for testing)
 */
export function clearConfigCache(): void {
  cachedConfig = null;
}
