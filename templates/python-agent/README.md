# Python Agent Template

Turn any AI Mantras persona into a runnable, standalone agent. This is a
**reference template** — small, readable, provider-neutral — meant to be
copied and adapted, not installed as a runtime.

## Turn a persona into an agent in 3 steps

1. **Copy this directory** anywhere and pick a persona from
   `Prompt-AI-Mantras/personas/` (or write your own following
   `developer-docs/creating-personas.md`).

2. **Install a provider SDK** (or skip this for dry-run/mock mode):

   ```bash
   pip install -e ".[anthropic]"   # or ".[openai]"
   export ANTHROPIC_API_KEY=...    # or OPENAI_API_KEY
   ```

3. **Run it:**

   ```bash
   # No dependencies or API key needed — prints the assembled system prompt:
   python agent.py --persona ../../Prompt-AI-Mantras/personas/orchestration/Bernstein-Orchestrator.md --dry-run

   # Live chat with the persona:
   python agent.py \
     --persona ../../Prompt-AI-Mantras/personas/domain/Kestra-Systems-Architect.md \
     --patterns ../../Prompt-AI-Mantras/patterns/chain-of-thought.md \
     --principles ../../Prompt-AI-Mantras/principles/guiding-principles.md \
     --provider anthropic
   ```

## Architecture

```
persona .md ──► persona.py (loader + prompt builder)
                     │  system prompt =
                     │  Principles ─ Persona ─ Patterns ─ Context Notice
                     ▼
              agent.py (chat loop + tool dispatch)
                     │
                     ▼
              adapters.py (LLMAdapter protocol)
              ├── AnthropicAdapter
              ├── OpenAIAdapter
              └── MockAdapter (--dry-run, no deps)
```

- **`persona.py`** assembles the system prompt in the same section order as
  the MCP server's prompt builder (`ai-mantras-mcp/src/utils/prompt-builder.ts`),
  so an agent built here behaves like one spawned through `spawn_agent`.
- **`agent.py`** is a minimal REPL with a tool-use loop and one example tool
  (`read_file`, sandboxed to the working directory) showing the full
  request → tool call → result cycle. Replace `TOOLS` and `dispatch_tool()`
  with your own capabilities — this is where a persona's *skills* become
  real tools.
- **`adapters.py`** defines the `LLMAdapter` protocol. The agent core only
  depends on `complete(system, messages, tools) -> AdapterResponse`.

## Adding a provider

Implement one class with a `complete()` method, add it to the `ADAPTERS`
dict in `adapters.py`, and it's selectable via `--provider`. SDK imports are
lazy, so unused providers cost nothing.

## Scope and boundaries

This template deliberately excludes multi-agent spawning, queues, and
persistence. For real orchestration (multiple personas, handoffs, routing),
see:

- **Mantras Engine** — the runtime orchestration engine for AI Mantras
- `development/multi-agent-architecture.md` — the multi-agent design doc
- `Prompt-AI-Mantras/patterns/graph-orchestration.md` and
  `patterns/agentic-loop.md` — the reasoning patterns behind agent runtimes
- `standalone/potts/` — an example of the *other* packaging style: a
  framework-free persona distribution for an existing agent host (opencode)
  rather than a self-hosted Python agent
