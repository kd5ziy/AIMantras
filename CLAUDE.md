# AI Mantras - Claude Code Project Instructions

## Session

**Development Session Name:** `AIMantrasDev`

To resume this development context:
```bash
claude --resume AIMantrasDev
```

## Project Overview

AI Mantras is a cognitive framework for AI collaboration built on Four Pillars:
- **Personas** (WHO) - 17 specialized identities
- **Patterns** (HOW) - 11 reasoning structures
- **Principles** (WHY) - Guiding values
- **Skills** (WHAT) - 25 actionable capabilities

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

## Adding New Personas Checklist

When creating a new persona, ALL of the following must be updated:

1. **Create persona file** — `Prompt-AI-Mantras/personas/{category}/Name-Role.md`
2. **Update manifest** — `ai-mantras-manifest.yaml` (add member entry + update statistics counts)
3. **Copy to MCP content** — `ai-mantras-mcp/content/Prompt-AI-Mantras/personas/{category}/Name-Role.md`
4. **Sync manifest to MCP** — `ai-mantras-mcp/content/ai-mantras-manifest.yaml`
5. **Update skill affinity matrix** — `Prompt-AI-Mantras/skills/toolset.md`
6. **Update persona backlog** — `development/persona-backlog.md` (move from Planned to Completed)
7. **Update agents.md** — `development/agents.md` (add to persona list)
8. **Update CLAUDE.md** — Persona count in Project Overview
9. **Create website page** — `website/src/content/docs/personas/{category}/name-role.mdx`
10. **Update website index** — `website/src/content/docs/personas/index.mdx` (counts + card link)

Same pattern applies to patterns and skills — see `development/agents.md` Component Dependencies table.

## Git Workflow

- Main branch: `master`
- Feature branches: `feature/description`
- Always run tests before committing
