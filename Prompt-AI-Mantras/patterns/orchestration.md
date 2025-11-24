# Orchestration Pattern

## Purpose
- Coordinates planner, worker(s), and QA personas in a predictable pipeline.
- Ensures hand-offs, assumptions, and outputs stay synchronized.

## When to Use
- Any task requiring more than one persona or phase.
- Projects where traceability across planning, execution, and QA is important.
- Situations where CLI agents need deterministic sections for parsing.

## Structure / Template
```text
[PLANNER]
- Persona: PM (or project lead).
- Summarize mission, inputs, constraints, selected personas/patterns.
- Provide execution checklist for workers.

[WORKER]
- Persona: specify (e.g., Kestra, Clara, Goeth).
- Follow assigned pattern(s) and report reasoning + deliverables.
- Note uncertainties or blockers for QA.

[QA]
- Persona: QA Reviewer (optionally assisted by One for deep reasoning).
- Audit deliverables against plan + meta-rules.
- List issues, fixes, and supply an “Approved Output” if satisfied.
```

## Examples
**Technical (CI/CD deployment):**
```text
[PLANNER]
Persona: PM. Mission: roll out blue/green for service API. Inputs: design doc, staging logs. Constraints: zero downtime, revert <5m.
[WORKER]
Persona: Kestra using Rule-Based Reasoning. Provide architecture changes, deployment steps, validation tests.
[QA]
Persona: QA Reviewer with Recursive Self-Eval. Validate risk coverage, highlight missing alerts, approve final runbook.
```

**Creative (marketing narrative):**
```text
[PLANNER]
Persona: PM. Mission: craft product narrative for AI prompt wiki launch. Inputs: value prop bullets. Constraints: 500 words, calm tone.
[WORKER]
Persona: Goeth with Guardrail Creative. Deliver narrative + call-to-action options.
[QA]
Persona: QA Reviewer with Meta-Rules. Check clarity, style alignment, remove hype.
```

## Combination Guidance
- Start with `patterns/planning-phase.md` to feed the planner section.
- Workers typically use specialized patterns (chain-of-thought, guardrail, etc.).
- QA often layers `patterns/recursive-self-eval.md` for stronger critique.

## Failure Modes
- Missing explicit persona assignments, leading to AI default behavior.
- Blurry transitions where workers redo planning or QA rewrites everything.
- Planner omits constraints so workers drift off brief.
- QA skips issue tracking, making approvals unverifiable.
