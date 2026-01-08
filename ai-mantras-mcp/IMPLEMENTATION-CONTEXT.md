# AI Mantras MCP Server - Implementation Context

**Date:** 2026-01-07
**Branch:** master
**Status:** Complete - Ready for testing and npm publishing

---

## Overview

This document captures the implementation context for converting the AI Mantras prompt framework into an MCP (Model Context Protocol) server.

## Decision: MCP vs RAG

**Chosen:** MCP

**Reasoning:**
- AI Mantras is fundamentally procedural and structured, not just a knowledge base
- The gatekeeper pattern maps naturally to an MCP tool
- MCP preserves workflow orchestration logic (two-phase workflow, separation of powers)
- Dynamic resource loading works better with explicit file requests vs fuzzy semantic search
- Native Claude Code integration via `.mcp.json`

## Architecture

```
ai-mantras-mcp/
├── package.json                 # npm package config
├── tsconfig.json                # TypeScript config
├── .gitignore                   # Ignores node_modules, dist, content
├── README.md                    # User documentation
├── IMPLEMENTATION-CONTEXT.md    # This file
├── scripts/
│   └── copy-content.js          # Build-time content bundler
├── content/                     # Bundled content (git-ignored, created by build)
├── dist/                        # Compiled TypeScript (git-ignored)
├── test-content.js              # Content loading tests
├── test-tools.js                # Tool handler tests
└── src/
    ├── index.ts                 # Server entry point
    ├── tools/
    │   ├── index.ts             # Tool registration and routing
    │   ├── assess-complexity.ts # Gatekeeper/triage tool
    │   ├── get-persona.ts       # Load persona by name/domain
    │   ├── get-pattern.ts       # Load pattern by name
    │   ├── get-workflow.ts      # Get workflow for tier
    │   ├── create-handoff.ts    # Generate handoff template
    │   └── list-available.ts    # List all personas/patterns
    ├── resources/
    │   └── index.ts             # Resource registration and handling
    ├── prompts/
    │   └── index.ts             # Prompt registration and generation
    └── utils/
        ├── content-loader.ts    # Markdown file loading utilities
        └── persona-matcher.ts   # Domain → persona matching
```

## Key Design Decisions

### 1. Build-Time Content Bundling
- Content is copied from parent repo into `content/` during `npm run build`
- Published npm package includes bundled content
- Users get zero-config experience - just install and use
- Power users can override with `MANTRAS_CONTENT_PATH` env variable

### 2. Tools Exposed (6 total)

| Tool | Purpose |
|------|---------|
| `assess_complexity` | Triage requests into Simple/Moderate/Complex |
| `get_persona` | Load persona by exact name or domain match |
| `get_pattern` | Load thinking pattern by name |
| `get_workflow` | Get workflow steps for complexity tier |
| `create_handoff` | Generate handoff template between personas |
| `list_available` | List all available personas and patterns |

### 3. Resources Exposed

| URI | Content |
|-----|---------|
| `mantras://principles` | guiding-principles.md |
| `mantras://bootstrapper` | Agent-bootstrapper.md |
| `mantras://entry-point` | AIMantra.md |
| `mantras://manifest` | ai-mantras-manifest.yaml |
| `mantras://persona/{category}/{name}` | Individual persona files |
| `mantras://pattern/{layer}/{name}` | Individual pattern files |

### 4. Prompts Exposed (4 total)

| Prompt | Purpose |
|--------|---------|
| `mantras` | Auto-triage and process request |
| `mantras-simple` | Direct answer with single persona |
| `mantras-moderate` | Structured reasoning + self-review |
| `mantras-complex` | Full orchestration workflow |

### 5. Triage Approach
- Both automatic and manual available
- `/mantras` prompt auto-triages internally
- `assess_complexity` tool also exposed for manual inspection/override

## Test Results

### Content Loading Tests: 15/15 passed
- Guiding principles, bootstrapper, entry point, manifest loading
- All 11 personas load correctly
- All patterns load correctly
- Domain → persona matching works

### Tool Handler Tests: 16/16 passed
- assess_complexity correctly classifies requests
- get_persona loads by name and domain
- get_pattern loads patterns
- get_workflow returns correct workflows
- create_handoff generates templates
- list_available lists all resources

## Changes Made to Parent Repo

Removed all "MarketSeer" references (personal project) and replaced with "Financial":
- `Prompt-AI-Mantras/personas/domain/Clara-Financial-Analyst.md`
- `Prompt-AI-Mantras/principles/guiding-principles.md`
- `personas-and-patterns-context.md`
- `README.md`
- `project-plan.md`
- `Prompt-AI-Mantras/personas/orchestration/Hopper-Project-Planner.md`

## Configuration Files Created

### `.mcp.json` (in parent repo root)
```json
{
  "mcpServers": {
    "ai-mantras": {
      "command": "node",
      "args": ["./ai-mantras-mcp/dist/index.js"],
      "env": {}
    }
  }
}
```

## How to Build

```bash
cd ai-mantras-mcp
npm install
npm run build    # Copies content + compiles TypeScript
```

## How to Test

```bash
node test-content.js   # Test content loading (15 tests)
node test-tools.js     # Test tool handlers (16 tests)
```

## How to Use Locally

1. Build the server: `npm run build`
2. Restart Claude Code to load `.mcp.json`
3. Use tools, resources, or prompts in conversations

## How to Publish to npm

```bash
npm login
npm publish --access public
```

## Usage After npm Publish

Users add to their `.mcp.json`:
```json
{
  "mcpServers": {
    "ai-mantras": {
      "command": "npx",
      "args": ["-y", "@ai-mantras/mcp-server"]
    }
  }
}
```

## Dependencies

- `@modelcontextprotocol/sdk`: ^1.0.0
- `yaml`: ^2.3.4
- `typescript`: ^5.3.0 (dev)
- `tsx`: ^4.7.0 (dev)
- `@types/node`: ^20.10.0 (dev)

## Future Enhancements

1. Add more comprehensive error handling
2. Add caching for frequently accessed content
3. Add WebSocket transport for remote usage
4. Add content validation on startup
5. Add logging/telemetry
6. Create MkDocs site for documentation

---

## Session Summary

This implementation session:
1. Analyzed AI Mantras framework structure
2. Decided MCP over RAG based on framework's procedural nature
3. Designed tool/resource/prompt architecture
4. Implemented full MCP server in TypeScript
5. Created build-time content bundling for npm distribution
6. Wrote comprehensive tests (31 total, all passing)
7. Cleaned up MarketSeer references
8. Created documentation and configuration files
