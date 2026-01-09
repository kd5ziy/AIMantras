# AI Mantras

A cognitive framework for AI collaboration that treats prompting as organizational design.

## The Four Pillars

AI Mantras is built on four complementary pillars:

| Pillar | Question | Purpose |
|--------|----------|---------|
| **Personas** | WHO | Specialized identities with expertise, style, and constraints |
| **Patterns** | HOW | Reusable reasoning structures and thinking templates |
| **Principles** | WHY | Guiding values that shape behavior (internalized, not announced) |
| **Skills** | WHAT | Actionable capabilities personas can invoke |

Together, these enable consistent, high-quality AI collaboration across complex multi-step tasks.

## Repository Layout
```
Prompt-AI-Mantras/
├── personas/              # WHO - 11 specialized personas
│   ├── orchestration/     # Plan & coordinate (Bernstein, Hopper, Lovell)
│   ├── domain/            # Execute work (Clara, Kestra, Watson, Goeth, Franklin)
│   └── evaluation/        # Review & approve (Ada, Drucker, Rickover)
├── patterns/              # HOW - 9 reasoning patterns
│   ├── Layer 1            # Foundational (planning, orchestration, self-eval, meta-rules)
│   ├── Layer 2            # Thinking (chain-of-thought, rule-based, guardrail-creative)
│   └── Layer 3            # Evaluation (criterion-based, threat-modeling)
├── principles/            # WHY - Guiding values (wisdom, justice, courage, temperance)
├── skills/                # WHAT - 24 actionable capabilities
│   ├── research/          # Information gathering
│   ├── analysis/          # Analytical capabilities
│   ├── creation/          # Content generation
│   ├── evaluation/        # Assessment capabilities
│   ├── orchestration/     # Workflow coordination
│   └── utility/           # Framework navigation (help)
└── projects/              # Applied recipes (per domain/project)
```

## How to Use Personas
1. Read `personas-and-patterns-context.md` + `project-plan.md` for shared context.
2. Pick a persona whose name-purpose file matches your need (e.g., `Clara-Financial-Analyst`).
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

## Quick Start

1. **Entry Point**: Start with `AIMantra.md` - it triages your request to the right complexity tier
2. **Simple tasks**: One persona answers directly
3. **Moderate tasks**: Structured reasoning with patterns and self-review
4. **Complex tasks**: Full orchestration (Bernstein → Hopper → Workers → Ada → Evaluators)

## Key Concepts

### Separation of Powers
- **Orchestrators** plan but don't execute or evaluate
- **Domain personas** execute but don't self-evaluate
- **Evaluators** assess but don't generate content
- **Humans** retain final authority

### Two-Phase Workflow
1. **Plan → Evaluate → Approve** (before work begins)
2. **Execute → QA → Evaluate** (before delivery)

## Next Steps
- Multi-agent architecture (personas as separate agents)
- MCP server integration for skills
- Project-specific playbooks under `projects/`

## Support This Project

AI Mantras is free and open source under the [MIT License](LICENSE).

If this project helps you, consider:
- Giving it a star on GitHub
- [Sponsoring on GitHub](https://github.com/sponsors/kd5ziy)
- Sharing it with others who might benefit

**Need help implementing AI Mantras for your team?** I'm available for consulting and custom development. [Contact me](mailto:your.email@example.com).

## License

MIT License - see [LICENSE](LICENSE) for details.
