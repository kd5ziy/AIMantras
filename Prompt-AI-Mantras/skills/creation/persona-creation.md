# Persona Creation

## Purpose
Enable an orchestrator to close capability gaps by drafting and registering a new persona when no existing persona covers the expertise a task requires. Created personas are staged on a feature branch and offered to the human for publication, growing the persona library over time while keeping humans in control of what enters it.

## When to Use
- During orchestration, a task needs domain expertise no registered persona provides.
- A recurring class of requests keeps landing on a poorly-fitting persona.
- The persona backlog lists a planned persona that matches the gap (promote it rather than inventing a new one).

Do **not** use this skill for one-off tasks a nearby persona can handle with a pattern adjustment — persona sprawl dilutes the library.

## Inputs Required
- **Capability gap description**: what expertise is missing and why existing personas don't fit.
- **Target category**: orchestration, domain, or evaluation.
- **Reference material**: `developer-docs/creating-personas.md`, the "Design Principles for New Personas" section of `development/persona-backlog.md`, and 1–2 existing personas in the target category as style references.
- **Registration checklist**: the "Adding New Personas Checklist" in `CLAUDE.md`.

## Outputs Produced
- A persona file at `Prompt-AI-Mantras/personas/{category}/Name-Role.md` following the standard section format (`# Name – Role`, Purpose, Domain Expertise, Style & Tone, Rules & Constraints, Recommended Patterns, Available Skills, Example Invocations, Output Expectations, Failure Modes to Avoid).
- All registration edits: manifest member + statistics, skill affinity matrix row, backlog and coordination-doc updates, website page + navigation.
- A local feature branch (`feature/persona-<name>`) with the changes staged, plus a diff summary presented to the human.

## Invocation
1. **Verify the gap.** Check `ai-mantras-manifest.yaml` persona members and `development/persona-backlog.md`. If a planned persona matches, promote that entry instead of inventing a new identity.
2. **Draft the persona** following the template and design principles. Name it after an exemplary real or archetypal figure per library convention; keep expertise bounded and failure modes explicit.
3. **Register it** per the CLAUDE.md checklist: manifest member entry + statistics counts, `skills/toolset.md` affinity matrix row, `development/persona-backlog.md`, `development/agents.md`, CLAUDE.md persona count, website page + sidebar + personas index. (The MCP content copy regenerates via `npm run build` in `ai-mantras-mcp/`.)
4. **Stage on a feature branch.** `git checkout -b feature/persona-<name>`, then stage only the files this persona touched — never `git add -A`.
5. **Stop and hand to the human.** Present a diff summary and the rationale. Only after explicit approval: commit, `git push -u origin feature/persona-<name>`, and optionally open a pull request. If approval is not given, leave the branch local.

## Constraints
- **Never commit or push without explicit human approval** given in the same session. The approval gate is the point of this skill.
- One persona per branch — keeps review and rollback clean.
- Never modify existing personas under this skill; propose changes to them separately.
- Never stage with `git add -A` or `git add .` — explicit paths only.
- The persona must pass the design principles (distinct voice, bounded expertise, explicit constraints) before being offered for publication.

## Example Usage
```text
[Bernstein, mid-orchestration]
Gap detected: task requires contract-law review; no legal persona exists.
Backlog check: "Lawyer" is listed as Planned — promoting it.

Drafted: Prompt-AI-Mantras/personas/domain/Darrow-Legal-Analyst.md
Registered: manifest (+1 domain persona), affinity matrix, backlog (Planned → Completed),
agents.md, CLAUDE.md count, website page + sidebar.
Branch: feature/persona-darrow (7 files staged, nothing pushed)

PROPOSAL FOR HUMAN REVIEW
- New persona: Darrow – Legal Analyst (domain)
- Rationale: recurring contract-review requests with no fitting persona
- Diff: 7 files (1 new persona, 6 registration edits)
Approve push to origin and open a PR? [awaiting human approval]
```

## Recommended Personas
- **Bernstein (Orchestrator)** — primary user; detects gaps while routing work.
- **Hopper (Planner)** — identifies missing expertise during task decomposition.

## Related Skills
- `orchestration/task-decomposition.md` — where capability gaps usually surface.
- `creation/plan-drafting.md` — structuring the registration work.
- `creation/document-generation.md` — the drafting mechanics.
