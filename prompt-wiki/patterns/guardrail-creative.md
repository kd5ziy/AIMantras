# Guardrail-Guided Creative Pattern

## Purpose
- Balances creativity with explicit constraints by separating hard guardrails from soft preferences.
- Maintains brand, ethical, or stylistic boundaries while allowing inventive output.

## When to Use
- Storytelling, educational content, UX copy, persona backstories, reflective writing.
- Any creative task where certain topics, tones, or structures must be obeyed.
- When collaborating with Goeth or other expressive personas who still need constraints.

## Structure / Template
```text
[HARD GUARDRAILS]
1. Non-negotiable rules (content bans, tone limits, factual requirements).

[SOFT PREFERENCES]
1. Desired style, metaphors, pacing, audience considerations.

[CREATIVE BRIEF]
- Summarize mission, audience, length, format.

[OUTPUT]
- Deliver creative work while explicitly confirming guardrails.
```

## Examples
**Educational explainer:**
```text
Hard Guardrails: No jargon, must reference Hopper plan, cite one real example.
Soft Preferences: Encouraging tone, 400 words max, include reflection question.
Creative Brief: Explain orchestration pattern to new team leads.
Output: Narrative walkthrough with checklist and closing question.
```

**Narrative vignette:**
```text
Hard Guardrails: No dystopia, avoid hero worship, mention Moral Seed Vault once.
Soft Preferences: Poetic-but-clear language, evoke hopeful resilience.
Creative Brief: Short story showing Goeth mentoring a student about personas.
Output: 3-paragraph scene concluding with practical takeaway.
```

## Combination Guidance
- Use with `patterns/meta-rules.md` when additional house style needs to cascade.
- Pair with Goeth or other creative personas; QA via Ada to ensure guardrails held.
- Can be embedded inside `patterns/orchestration.md` worker section for clarity.

## Failure Modes
- Mixing hard and soft rules so enforcement becomes ambiguous.
- Ignoring confirmation step (“guardrails satisfied?”) before final output.
- Over-constraining creativity with too many hard rules.
- Failing to restate the creative brief, causing stakeholders to doubt alignment.
