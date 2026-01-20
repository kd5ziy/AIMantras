# AI Mantras - Claude Code Project Instructions

## Session

**Development Session Name:** `AIMantrasDev`

To resume this development context:
```bash
claude --resume AIMantrasDev
```

## Project Overview

AI Mantras is a cognitive framework for AI collaboration built on Four Pillars:
- **Personas** (WHO) - 11 specialized identities
- **Patterns** (HOW) - 9 reasoning structures
- **Principles** (WHY) - Guiding values
- **Skills** (WHAT) - 24 actionable capabilities

## Key Locations

| Path | Purpose |
|------|---------|
| `development/agents.md` | Development quickstart - read this first |
| `development/project-plan.md` | Strategic and operational plan |
| `Prompt-AI-Mantras/` | Framework content (personas, patterns, skills) |
| `ai-mantras-mcp/` | MCP server implementation (v1.3.0) |

## Current State (2025-01-16)

- **MCP Server:** v1.3.0 with multi-agent support
- **Tests:** 59 passing (15 content + 20 tools + 24 multi-agent)
- **Multi-Agent Mode:** Toggle via `MANTRAS_MULTI_AGENT_ENABLED=true`

## Development Workflow

1. Read `development/agents.md` for current context
2. Check "Recent Sessions" section for latest work
3. Review "Active Focus" for priorities
4. Use the MCP server tools when testing

## MCP Server

```bash
cd ai-mantras-mcp
npm run build    # Build TypeScript
npm test         # Run all tests (59)
```

## Git Workflow

- Main branch: `master`
- Feature branches: `feature/description`
- Always run tests before committing
