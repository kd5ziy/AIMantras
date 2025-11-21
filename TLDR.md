# TL;DR — Personas & Patterns Prompt Wiki

- **What:** Modular library of personas (who), patterns (how), and orchestration playbooks so AI work feels like a well-run team.
- **Why:** Reuse structured prompts, keep Planner → Worker → QA flows consistent, and let specialized personas tackle what they do best.
- **Where:** All content lives under `prompt-wiki/` with `personas/`, `patterns/`, and `projects/` folders plus repo-wide context files.
- **How to start:**
  1. Read `prompt-wiki/README.md` (usage) + `agents.md` (current state) if you’re jumping in midstream.
  2. Use Bernstein (orchestration) to interpret your request, then Hopper/Lovell for planning, domain personas (Clara, Kestra, Goeth, Franklin, etc.) for execution, Ada for QA.
  3. Apply patterns as instructed in each persona file (planning-phase, orchestration, chain-of-thought, rule-based, guardrail, recursive-self-eval, meta-rules).
- **Current priorities:** Design new personas (Judge, Lawyer, etc.) with rich inspirations; later, add project recipes showing orchestration in action.
- **Key rule:** Be additive and explicit—document why personas/patterns were chosen so future humans/agents can pick up the baton instantly.
