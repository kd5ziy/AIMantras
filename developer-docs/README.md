# Developer Documentation

Welcome to the AI Mantras developer documentation. This folder contains guides for contributors who want to extend the framework.

## Documentation Index

| Guide | Purpose | Audience |
|-------|---------|----------|
| [Creating Personas](creating-personas.md) | Step-by-step guide to creating new personas | Primary - start here |
| [Creating Patterns](creating-patterns.md) | How to create new reasoning patterns | Pattern developers |
| [Creating Skills](creating-skills.md) | How to add new actionable skills | Skill developers |
| [AI Collaborative Development](ai-collaborative-development.md) | Philosophy of building AI Mantras with AI | All contributors |
| [Extending the MCP Server](extending-mcp-server.md) | Technical guide for MCP modifications | Server developers |
| [Testing Guide](testing-guide.md) | How to validate new components | All contributors |

## Recommended Reading Order

**For new contributors:**
1. [AI Collaborative Development](ai-collaborative-development.md) - Understand our philosophy
2. [Creating Personas](creating-personas.md) - Most common contribution type
3. [Testing Guide](testing-guide.md) - How to validate your work

**For MCP server contributors:**
1. [Extending the MCP Server](extending-mcp-server.md)
2. [Testing Guide](testing-guide.md)

## Related Resources

These files provide additional context:

| File | Location | Purpose |
|------|----------|---------|
| Development Quickstart | `development/agents.md` | Current project state, session history |
| Project Plan | `development/project-plan.md` | Architecture and strategy |
| Guiding Principles | `Prompt-AI-Mantras/principles/guiding-principles.md` | Ethical foundation |
| Skills Index | `Prompt-AI-Mantras/skills/toolset.md` | All available skills |

## Quick Reference

### File Naming Conventions

- Personas: `Name-Role.md` (e.g., `Clara-Financial-Analyst.md`)
- Patterns: `pattern-name.md` (e.g., `chain-of-thought.md`)
- Skills: `skill-name.md` (e.g., `web-search.md`)

### Folder Structure

```
Prompt-AI-Mantras/
├── personas/
│   ├── orchestration/    # Planning & coordination
│   ├── domain/           # Subject matter experts
│   └── evaluation/       # Review & assessment
├── patterns/             # Reasoning structures
├── principles/           # Guiding values
└── skills/
    ├── research/         # Information gathering
    ├── analysis/         # Analytical work
    ├── creation/         # Content generation
    ├── evaluation/       # Assessment
    ├── orchestration/    # Workflow coordination
    └── utility/          # Framework navigation
```

## Getting Help

- Check existing files in each category for examples
- Read the guiding principles to understand the framework's values
- Ask questions via GitHub Issues or pull request comments
