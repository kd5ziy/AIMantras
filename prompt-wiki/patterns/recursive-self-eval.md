# Recursive Self-Evaluation

## Purpose
- Forces deliberate reflection to catch mistakes before delivery.
- Provides a deterministic structure for QA or self-review loops.

## When to Use
- High-impact tasks where errors are costly (infra, finance, legal, security).
- Complex reasoning chains that benefit from a sanity check.
- Anytime a solo worker persona must self-QA before hand-off.

## Structure / Template
```text
[INITIAL ANSWER]
- Produce the best solution using assigned persona + patterns.

[CRITIQUE]
- Switch to QA Reviewer mindset.
- List issues, risks, and opportunities for clarity.
- Reference the plan/meta-rules while critiquing.

[REFINED ANSWER]
- Incorporate fixes from CRITIQUE.
- Flag residual risks or open questions if any remain.
```

## Examples
**Technical (security baseline):**
```text
[INITIAL ANSWER]
Provide Ubuntu hardening steps.
[CRITIQUE]
Check for coverage gaps (SSH, kernel, logging). Note missing CIS alignment.
[REFINED ANSWER]
Add explicit sysctl values, MFA guidance, log shipping plan.
```

**Creative (curriculum module):**
```text
[INITIAL ANSWER]
Draft a 45-minute lesson on prompt personas for high schoolers.
[CRITIQUE]
Evaluate pacing, accessibility, and activity diversity. Highlight jargon.
[REFINED ANSWER]
Rewrite with age-appropriate analogies, add interactive worksheet, clarify goals.
```

## Combination Guidance
- Often run by the QA Reviewer persona, but workers can self-invoke before hand-off.
- Stack with `patterns/meta-rules.md` to enforce style and tone during refinement.
- Pair with `patterns/orchestration.md` so QA outputs drop into the [QA] section cleanly.

## Failure Modes
- Treating the critique as a summary instead of a critical audit.
- Copy/pasting the initial answer without substantive changes.
- Skipping references to original constraints, causing regressions.
- Allowing the refined answer to introduce new unresolved issues.
