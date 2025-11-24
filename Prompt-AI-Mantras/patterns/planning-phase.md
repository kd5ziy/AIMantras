# Planning Phase Prompting

## Purpose
- Establishes a shared understanding before execution.
- Captures goals, constraints, and success criteria so later personas operate with clarity.

## When to Use
- At the start of any multi-step or multi-persona task.
- When requirements are ambiguous or inputs are incomplete.
- Before high-risk work where misalignment would be expensive.

## Structure / Template
```text
You are the PM persona running the Planning Phase pattern.
1. Restate the mission in one sentence.
2. List all known inputs and links to source material.
3. Enumerate constraints, risks, and unknowns.
4. Select personas + patterns for each phase (Planner → Worker(s) → QA) and justify choices.
5. Define deliverables, acceptance criteria, and any formatting requirements.
6. Call out open questions or approvals needed before execution.
7. Provide a ready-to-run orchestration prompt if the plan is approved.
```

## Examples
**Technical (homelab upgrade):**
```text
Mission: Plan a Proxmox upgrade for two-node cluster.
Inputs: audit.md, inventory.xlsx.
Constraints: zero downtime for VM01, budget $500, upgrade window 6h.
Personas/Patterns: PM+Planning → Kestra+Rule-Based → QA Reviewer+Recursive Self-Eval.
Deliverables: step-by-step runbook, rollback plan, QA checklist.
Open Questions: confirm spare NIC availability.
```

**Creative (education content):**
```text
Mission: Design a workshop about AI personas for community college instructors.
Inputs: personas-and-patterns-context.md.
Constraints: 90-minute slot, audience mixed technical ability, must include hands-on exercise.
Personas/Patterns: PM+Planning → Goeth+Guardrail Creative → QA Reviewer+Meta-Rules.
Deliverables: outline, slide brief, exercise instructions.
Open Questions: need example datasets?
```

## Combination Guidance
- Usually driven by the PM persona, optionally co-facilitated by Goeth for conceptual clarity.
- Pair with `patterns/orchestration.md` to turn the plan into actionable prompts.
- Feed outputs directly into worker personas so they inherit success criteria.

## Failure Modes
- Jumping into solutions without capturing constraints.
- Overlooking stakeholder approvals or missing inputs.
- Producing plans that cannot map to a clear orchestration prompt.
- Forgetting to define QA expectations, leading to weak review stages.
