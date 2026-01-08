#!/usr/bin/env node

/**
 * AI Mantras MCP Server
 *
 * Exposes the AI Mantras prompt framework as MCP tools, resources, and prompts.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { registerTools, handleToolCall } from './tools/index.js';
import { registerResources, handleResourceRead } from './resources/index.js';
import { registerPrompts, handlePromptGet } from './prompts/index.js';
import { getContentPath } from './utils/content-loader.js';

// Create server instance
const server = new Server(
  {
    name: 'ai-mantras-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: registerTools() };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  return handleToolCall(request.params.name, request.params.arguments || {});
});

// Resource handlers
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return registerResources();
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  return handleResourceRead(request.params.uri);
});

// Prompt handlers
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return { prompts: registerPrompts() };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  return handlePromptGet(request.params.name, request.params.arguments || {});
});

// Main entry point
async function main() {
  console.error('AI Mantras MCP Server starting...');
  console.error(`Content path: ${getContentPath()}`);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('AI Mantras MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
