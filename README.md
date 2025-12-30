# Personas & Patterns Prompt Wiki

## Purpose
A modular library of personas (who), patterns (how), and orchestration workflows (team hand-offs) so humans and agents can prompt consistently. Use it to plan, execute, and QA complex tasks with reusable building blocks.

## Repository Layout
```
Prompt-AI-Mantras/
├── README.md              # This file
├── personas/              # Persona definitions (one file per persona)
└── patterns/              # Prompt patterns/playbooks
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
- Default to additive edits; avoid destructive rewrites unless coordinated.

## Next Steps
- Populate the remaining pattern layers (chain-of-thought, rule-based reasoning, guardrail creative).

## Support This Project

AI Mantras is free and open source under the [Mozilla Public License 2.0](LICENSE).

If this project helps you, consider:
- Giving it a star on GitHub
- [Sponsoring on GitHub](https://github.com/sponsors/kd5ziy)
- [Buying me a coffee](https://buymeacoffee.com/kd5ziy)
- Sharing it with others who might benefit

**Need help implementing AI Mantras for your team?** I'm available for consulting and custom development. [Contact me](mailto:kd5ziy@gmail.com).

## Collaboration & Attribution

Collaboration on this project is warmly welcomed. We believe in the power of community contributions while maintaining clear attribution for individual work.

When using, referencing, or contributing to this project, please respect:
- **Individual attribution** for contributions - we value and preserve the recognition of each contributor's work
- **The MPL 2.0 license terms** - ensuring the collaborative nature of improvements benefits everyone

### About the MPL 2.0 License

The Mozilla Public License 2.0 is a balanced open-source license that:
- **Allows free use and modification** - you can use this project in your own work, commercial or otherwise
- **Requires sharing improvements** - if you modify MPL-licensed files, you must share those modifications under MPL 2.0
- **Permits proprietary combinations** - you can combine this code with proprietary code in larger projects
- **Preserves attribution** - copyright notices and attributions must be maintained

This license strikes a balance between encouraging open collaboration and respecting the intellectual contributions of individual developers. Files you modify must remain open source, but you can use them alongside your own proprietary code.

For complete details, see the [LICENSE](LICENSE) file or visit [mozilla.org/MPL/2.0](https://mozilla.org/MPL/2.0/).

## License

Mozilla Public License 2.0 - see [LICENSE](LICENSE) for details.
