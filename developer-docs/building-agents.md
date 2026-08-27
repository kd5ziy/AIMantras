# Building Agents from Personas

The AI Mantras framework was written as a prompting framework, but its markdown organization maps directly onto agent construction. This guide shows how to turn framework content into running agents, and how the library grows as agents discover gaps.

## The Concept Mapping

| Framework component | Agent role |
|---|---|
| **Persona** (`personas/*.md`) | The agent's identity — loaded verbatim as the system prompt |
| **Patterns** (`patterns/*.md`) | Reasoning strategies appended to the system prompt (or applied by a runtime) |
| **Skills** (`skills/*/*.md`) | Capability contracts — the specification for the agent's tools |
| **Principles** (`principles/guiding-principles.md`) | The alignment layer, prepended so every agent inherits it |
| **Manifest** (`ai-mantras-manifest.yaml`) | The agent registry — what exists, where it lives, when to use it |

A persona file needs **no modification** to become an agent: its Purpose, Rules & Constraints, and Output Expectations sections are already a system prompt.

## Path 1: The Python Agent Template

`templates/python-agent/` is a copyable reference implementation (~500 lines, zero required dependencies):

```bash
cd templates/python-agent

# Inspect the assembled prompt — no SDK or API key needed:
python agent.py --persona ../../Prompt-AI-Mantras/personas/domain/Kestra-Systems-Architect.md --dry-run

# Live agent:
pip install -e ".[anthropic]" && export ANTHROPIC_API_KEY=...
python agent.py \
  --persona ../../Prompt-AI-Mantras/personas/domain/Kestra-Systems-Architect.md \
  --patterns ../../Prompt-AI-Mantras/patterns/agentic-loop.md \
  --principles ../../Prompt-AI-Mantras/principles/guiding-principles.md \
  --provider anthropic
```

It assembles the system prompt in the same section order as the MCP server's `spawn_agent` tool (Principles → Persona → Patterns → context notice), defines a provider-neutral `LLMAdapter` protocol with Anthropic/OpenAI/mock implementations, and runs a minimal tool-use loop with one example tool. Making a persona's *skills* real means replacing that example tool with implementations of the skill files the persona lists — the skill's Inputs Required / Outputs Produced sections are effectively a tool schema.

## Path 2: Framework-Free Distribution

For agent hosts that already have their own runtime (opencode, Claude Code, custom harnesses), package the persona *for the host* instead of running it yourself. `standalone/potts/` is the reference example: the persona converted to the host's agent-file format (YAML frontmatter + persona body), an `AGENTS.md` contract for its working environment, and an install that is just a file copy. No MCP server, no npm, no framework checkout.

## Path 3: Spawn via the MCP Server

With `MANTRAS_MULTI_AGENT_ENABLED=true`, the MCP server's `spawn_agent` tool runs any persona as an isolated one-shot agent (see `development/multi-agent-architecture.md`). This is the right path when a Claude Code session is the orchestrator and needs quick, context-isolated worker calls.

## Orchestrating Agents

Two patterns capture the reasoning structures behind agent runtimes:

- **`patterns/agentic-loop.md`** — how a single agent iterates: plan → act → observe → refine with explicit exit criteria and budgets.
- **`patterns/graph-orchestration.md`** — how multiple persona-agents compose: nodes, conditional routing, fan-out/fan-in, join nodes.

**Boundary note:** this repo intentionally contains no orchestration runtime. The template is one persona, one loop. Multi-agent execution — queues, handoffs, persistence, model routing — is the job of the **Mantras Engine** project, which consumes this framework as a dependency.

## Growing the Library: Machine-Created Personas

The [persona-creation skill](../Prompt-AI-Mantras/skills/creation/persona-creation.md) lets an orchestrator close capability gaps it discovers mid-task:

1. Verify no existing or backlogged persona covers the gap.
2. Draft the persona per [creating-personas.md](creating-personas.md) and register it per the CLAUDE.md checklist.
3. Stage everything on a `feature/persona-<name>` branch.
4. **Stop.** Present the diff; a human decides whether it is pushed and merged.

The approval gate is deliberate: agents propose, humans curate. Over time the persona library grows from real usage gaps rather than speculation.

## Related Reading

- [creating-personas.md](creating-personas.md) — authoring the persona itself
- `development/multi-agent-architecture.md` — the multi-agent design doc
- `development/pattern-audit-2026-08.md` — why agentic-loop and graph-orchestration were added
