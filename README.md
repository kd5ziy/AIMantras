# Personas & Patterns Prompt Wiki

## Purpose
A modular library of personas (who), patterns (how), and orchestration workflows (team hand-offs) so humans and agents can prompt consistently. Use it to plan, execute, and QA complex tasks with reusable building blocks.

## Repository Layout
```
prompt-wiki/
├── README.md              # This file
├── personas/              # Persona definitions (one file per persona)
├── patterns/              # Prompt patterns/playbooks
└── projects/              # Applied recipes (per domain/project)
```

## How to Use Personas
1. Read `personas-and-patterns-context.md` + `project-plan.md` for shared context.
2. Pick a persona whose name-purpose file matches your need (e.g., `Clara-MarketSeer-Analyst`).
3. Follow its sections: Purpose, Domain Expertise, Style, Rules, Recommended Patterns, Example Invocations, Output Expectations, Failure Modes.
4. Cite the persona explicitly in prompts (`Persona: Hopper …`).

## How to Use Patterns
1. Load relevant pattern files under `patterns/` (e.g., `planning-phase`, `orchestration`, `recursive-self-eval`, `meta-rules`).
2. Embed the pattern template verbatim when composing prompts so agents follow the structure.
3. Combine multiple patterns as instructed in each persona’s “Recommended Patterns” section.

## Default Workflow (Planner → Worker → QA)
1. **Planner (Hopper + Planning Phase Pattern)**
   - Restate mission, inputs, constraints, risks, acceptance criteria.
   - Select personas/patterns for each phase and emit ready-to-run orchestration prompt.
2. **Worker(s) (Clara, Kestra, Goeth, Franklin, etc.)**
   - Execute domain-specific work using assigned patterns (chain-of-thought, rule-based, guardrail, meta-rules).
   - Call out assumptions, data gaps, and blockers for QA.
3. **QA (Ada + Recursive Self-Eval + Meta-Rules)**
   - Audit outputs against plan, rules, and guardrails.
   - Produce issues list, recommendations, and refined/approved version.

## Meta-Rules & Style
- Declare meta preferences via `patterns/meta-rules.md` to control tone, caution, evidence, and prohibited behaviors.
- Apply them in both worker and QA stages for consistent voice.

## Extending the Wiki
- Add new personas or patterns by duplicating existing templates and keeping files atomic.
- Append new project recipes under `projects/` to show real-world orchestration examples.
- Default to additive edits; avoid destructive rewrites unless coordinated.

## Next Steps
- Populate the remaining pattern layers (chain-of-thought, rule-based reasoning, guardrail creative).
- Add project-specific playbooks under `projects/` folders once personas/patterns stabilize.
