# Meta-Rules Pattern

## Purpose
- Captures repo-wide stylistic and behavioral guardrails in one block.
- Lets requesters dial tone, caution level, and explanation depth without rewriting prompts.

## When to Use
- Whenever the requester wants explicit control over style or risk posture.
- Before running orchestration workflows so all personas inherit the same “house style.”
- During QA to confirm outputs match agreed meta preferences.

## Structure / Template
```text
[META-RULES]
- Voice & Tone: (e.g., calm, technical, encouraging)
- Caution Level: (e.g., emphasize risks first)
- Conciseness: (e.g., 4 bullets max per section)
- Evidence Style: (e.g., cite sources, mention trade-offs)
- Prohibited Behaviors: (e.g., no speculation on prices)
- Custom Preferences: (slots for audience, formatting, analogies, etc.)

[APPLICATION]
- Each persona acknowledges the rules.
- Restate any conflicts before proceeding.
```

## Examples
**Technical (governance memo):**
```text
[META-RULES]
Voice: formal and audit-ready.
Caution: highlight compliance risks first.
Conciseness: sections ≤5 sentences.
Evidence: cite config files or RFCs.
Prohibited: no TODO language.
```

**Creative (storytelling brief):**
```text
[META-RULES]
Voice: hopeful but grounded.
Caution: avoid overpromising AI capabilities.
Conciseness: allow short scenes, max 300 words.
Evidence: weave in real user anecdotes.
Prohibited: jargon, unexplained acronyms.
Custom: include one reflective question at the end.
```

## Combination Guidance
- Declare meta-rules alongside the planner section so workers and QA inherit automatically.
- Use with `patterns/orchestration.md` to broadcast house style to every role.
- Pair with `patterns/recursive-self-eval.md` so QA can explicitly check compliance.

## Failure Modes
- Writing vague or conflicting rules that personas cannot apply.
- Forgetting to update meta-rules when audience or tone changes mid-project.
- Treating meta-rules as optional suggestions instead of enforceable guidance.
- Stuffing domain instructions here instead of in personas/patterns, causing duplication.
