/**
 * LLM Client - Multi-provider client for spawning agents
 *
 * Supports Anthropic (Claude) and OpenAI (GPT) models with a unified interface.
 */

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { LLMProvider, AgentCallOptions, AgentCallResult } from '../types/agent.js';
import { getApiKey } from './config.js';

// Singleton client instances
let anthropicClient: Anthropic | null = null;
let openaiClient: OpenAI | null = null;

/**
 * Get or create Anthropic client
 */
function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: getApiKey('anthropic'),
    });
  }
  return anthropicClient;
}

/**
 * Get or create OpenAI client
 */
function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: getApiKey('openai'),
    });
  }
  return openaiClient;
}

/**
 * Call Anthropic Claude API
 */
async function callAnthropic(options: AgentCallOptions): Promise<AgentCallResult> {
  const client = getAnthropicClient();

  const abortController = new AbortController();
  let timeoutId: NodeJS.Timeout | undefined;

  if (options.timeoutMs) {
    timeoutId = setTimeout(() => abortController.abort(), options.timeoutMs);
  }

  try {
    const response = await client.messages.create(
      {
        model: options.model,
        max_tokens: options.maxTokens,
        system: options.systemPrompt,
        messages: [
          {
            role: 'user',
            content: options.userMessage,
          },
        ],
      },
      {
        signal: abortController.signal,
      }
    );

    // Extract text content
    const textContent = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    return {
      content: textContent,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
      stopReason: response.stop_reason || 'unknown',
    };
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Call OpenAI GPT API
 */
async function callOpenAI(options: AgentCallOptions): Promise<AgentCallResult> {
  const client = getOpenAIClient();

  const abortController = new AbortController();
  let timeoutId: NodeJS.Timeout | undefined;

  if (options.timeoutMs) {
    timeoutId = setTimeout(() => abortController.abort(), options.timeoutMs);
  }

  try {
    const response = await client.chat.completions.create(
      {
        model: options.model,
        max_tokens: options.maxTokens,
        messages: [
          {
            role: 'system',
            content: options.systemPrompt,
          },
          {
            role: 'user',
            content: options.userMessage,
          },
        ],
      },
      {
        signal: abortController.signal,
      }
    );

    const choice = response.choices[0];
    const content = choice?.message?.content || '';

    return {
      content,
      usage: {
        input_tokens: response.usage?.prompt_tokens || 0,
        output_tokens: response.usage?.completion_tokens || 0,
      },
      stopReason: choice?.finish_reason || 'unknown',
    };
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Call an LLM agent with the specified provider
 */
export async function callAgent(options: AgentCallOptions): Promise<AgentCallResult> {
  if (options.provider === 'anthropic') {
    return callAnthropic(options);
  }

  if (options.provider === 'openai') {
    return callOpenAI(options);
  }

  throw new Error(`Unknown provider: ${options.provider}`);
}

/**
 * Clear cached clients (useful for testing)
 */
export function clearClients(): void {
  anthropicClient = null;
  openaiClient = null;
}
