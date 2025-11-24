# Chain-of-Thought Pattern

## Purpose
- Forces reasoning to unfold in labeled stages so assumptions, decomposition, synthesis, and risks stay explicit.
- Helps downstream personas audit logic and reuse intermediate artifacts.

## When to Use
- Architecture, planning, financial modeling, investigative analysis.
- Anytime problems benefit from multi-stage thinking or branching scenarios.
- When you need transparent reasoning for QA or regulated domains.

## Structure / Template
```text
[STAGE 1: Assumptions]
List known facts, constraints, and data gaps.

[STAGE 2: Decomposition]
Break the problem into components, lenses, or sub-questions.

[STAGE 3: Exploration]
Evaluate options/paths for each component; note trade-offs.

[STAGE 4: Synthesis]
Integrate findings into a coherent recommendation or narrative.

[STAGE 5: Risks & Next Actions]
Flag uncertainties, edge cases, validations, and follow-up steps.
```

## Examples
**Technical (infra upgrade):**
```text
Assumptions: two-node Proxmox, shared ZFS, maintenance window 6h.
Decomposition: networking, storage, VM migration, rollback.
Exploration: compare live-migrate vs. cold-migrate, evaluate bandwidth.
Synthesis: choose cold-migrate with staggered reboot plan.
Risks & Next Actions: network congestion, take pre-upgrade snapshots.
```

**Creative/strategic (market entry):**
```text
Assumptions: launch AI prompt wiki public beta, audience = DevOps + educators.
Decomposition: messaging, channels, onboarding content.
Exploration: evaluate blog, webinars, partner demos.
Synthesis: 3-stage rollout with educator pilot first.
Risks & Next Actions: measure retention, gather testimonials.
```

## Combination Guidance
- Pair with `patterns/planning-phase.md` to turn CoT outputs into plans.
- Works well with `patterns/rule-based-reasoning.md` when each stage must cite rules.
- Use `patterns/recursive-self-eval.md` to critique individual stages before finalizing.

## Failure Modes
- Skipping stages or collapsing reasoning into one block.
- Treating “assumptions” as opinions instead of verifiable facts.
- Ignoring contradictions uncovered during decomposition.
- Producing synthesis that fails to reference exploration evidence.
