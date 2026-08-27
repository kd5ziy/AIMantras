# Graph Orchestration Pattern

## Purpose
- Generalizes the linear Planner → Worker → QA pipeline (`patterns/orchestration.md`) into a graph: personas are nodes, handoffs are edges.
- Supports conditional routing (which persona runs next depends on results), parallel fan-out/fan-in, and explicit join nodes that synthesize branch outputs.
- Gives multi-agent workflows a deterministic, auditable shape that an orchestrator (human, LLM, or runtime engine) can execute.

## When to Use
- Work decomposes into branches that can run independently and merge (research + analysis + review).
- The next step depends on an earlier result (route to Blue Team vs Red Team based on findings).
- More than three personas are involved and a linear pipeline would force artificial ordering.
- Handing a workflow to a runtime (e.g., an orchestration engine) that executes persona graphs.

## Structure / Template
```text
[GRAPH]
- Nodes: persona + task + expected output for each.
- Edges: for each node, where its output goes next.
- Conditional edges: condition -> target node (else-branch required).
- Entry node and terminal node(s) declared explicitly.

[NODE SPEC] (one per node)
- Node: <id>
- Persona: <name> (+ pattern to apply)
- Inputs: which nodes' outputs it receives
- Output: deliverable + handoff format (see manifest handoff_template)

[FAN-OUT / FAN-IN]
- Fan-out: one node's output feeds N independent nodes (run in parallel).
- Fan-in (join): a synthesis node that waits for all branches, reconciles
  conflicts, and produces one merged deliverable.

[EXECUTION LOG]
- Record node order actually taken, conditions evaluated, and branch results
  so the run is traceable after the fact.
```

## Examples
**Technical (security assessment):**
```text
Entry: plan (Hopper) -> fan-out:
  n1: Schneier (Blue Team) - defensive review
  n2: Mitnick (Red Team) - attack-surface probe
Join: synth (Bernstein) - merge findings, dedupe, rank
Conditional edge: if critical finding -> n3: Rickover (Safety) deep dive -> QA
Else -> QA: Ada - final report review. Terminal: approved report.
```

**Creative (product launch content):**
```text
Entry: brief (Hopper) -> fan-out:
  n1: Goeth - narrative draft   n2: Clara - pricing one-pager
Join: Bernstein - assemble launch kit, resolve tone conflicts
-> QA: Ada with criterion-based-evaluation. Terminal: launch kit.
```

## Combination Guidance
- Use `patterns/planning-phase.md` at the entry node to define the graph itself before executing it.
- Individual worker nodes often run `patterns/agentic-loop.md` internally; the graph sequences personas, the loop iterates within one.
- Keep `patterns/orchestration.md` for simple three-stage work — a graph is overhead when a pipeline fits.
- Join nodes should apply `patterns/criterion-based-evaluation.md` to decide between conflicting branch outputs.
- Handoffs along edges follow the manifest `handoff_template` and `skills/orchestration/handoff.md`.

## Failure Modes
- Graphs with cycles and no exit condition — loops belong inside a node (agentic-loop), not in the topology.
- Fan-out without a join: parallel branches produce outputs nobody reconciles.
- Conditional edges with no else-branch, stranding the workflow when the condition fails.
- Over-decomposition: ten nodes doing what three personas could, multiplying handoff loss.
- Branch personas silently seeing each other's context, breaking isolation and biasing the join.
