# Pattern Library Audit — 2026-08-26

Review of the 9 existing patterns against agentic practice that has matured
since the library was written (tool-use loops, reflection/evaluator-optimizer,
routing, graph/DAG workflows, parallel fan-out/fan-in).

## Coverage of existing patterns

| Pattern | Layer | Covers | Agent-era gap |
|---|---|---|---|
| planning-phase | 1 | Upfront alignment before execution | None — still the right entry step |
| orchestration | 1 | Linear Planner → Worker → QA pipeline | No branching, routing, or parallelism |
| recursive-self-eval | 1 | Critique-and-refine of one's own output | Framed as single-pass review, not a bounded loop |
| meta-rules | 1 | House-style/behavioral guardrails | None |
| chain-of-thought | 2 | Staged reasoning | None — orthogonal to agent loops |
| rule-based-reasoning | 2 | Explicit rule enforcement | None |
| guardrail-creative | 2 | Constrained creativity | None |
| criterion-based-evaluation | 3 | Judging against predefined criteria | Not wired into iteration (judge once vs. judge-per-iteration) |
| threat-modeling | 3 | Adversarial risk analysis | None |

## Gaps identified → patterns added

1. **Looping** — nothing described iterative plan → act → observe → refine
   cycles with explicit exit criteria and budgets (the core shape of tool-using
   agents and evaluator-optimizer refinement).
   → Added **`Prompt-AI-Mantras/patterns/agentic-loop.md`** (Layer 2, thinking
   primitive). Composes with recursive-self-eval (as the critique step) and
   criterion-based-evaluation (as the exit test).

2. **Graph workflows** — orchestration only modeled a fixed linear pipeline;
   no conditional routing, fan-out/fan-in parallelism, or join/synthesis nodes.
   → Added **`Prompt-AI-Mantras/patterns/graph-orchestration.md`** (Layer 1,
   foundational; generalizes orchestration.md, which now cross-references it).

## Candidates considered, not added (proposals for later)

- **Router** — classify a request, dispatch to one specialist persona. Partially
  covered today by Bernstein's role + `AIMantra.md` triage; a dedicated pattern
  would formalize it for runtimes. Revisit when Mantras Engine needs it.
- **Reflection (standalone)** — kept as the evaluator-optimizer variant inside
  agentic-loop rather than a separate file; splitting it out would duplicate
  recursive-self-eval.
- **Memory/context-compaction** — how long-running agents summarize and carry
  state. Real gap, but belongs with runtime concerns (Mantras Engine) more than
  prompt patterns. Revisit.

## Modernizing touch-ups applied

- `patterns/orchestration.md` — cross-reference to graph-orchestration for
  branching/parallel workflows.
- Bernstein-Orchestrator — recommended patterns extended (graph-orchestration,
  agentic-loop); Ada-QA-Reviewer unchanged (criterion-based-evaluation already
  fits her role; agentic-loop is applied by workers, not the reviewer).
