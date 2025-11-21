# Rule-Based Reasoning Pattern

## Purpose
- Enforces explicit rules `[R#]` that govern reasoning, keeping outputs aligned with policies, regulations, or domain constraints.
- Creates traceability by requiring references to rules when making claims.

## When to Use
- Finance, security, compliance, medical, or legal work with hard guardrails.
- Anytime you need deterministic decision logic or auditability.
- When coordinating multiple personas who must obey the same rule set.

## Structure / Template
```text
[RULES]
[R1] ...
[R2] ...
[R3] ...

[ANALYSIS]
- Reference rules explicitly (e.g., “Per [R2] we must…”).
- Note conflicts between rules and how they are resolved.

[DECISION / OUTPUT]
- Summarize conclusions while citing relevant rules.
- Flag any rule that could not be satisfied and propose mitigations.
```

## Examples
**Financial (portfolio rebalancing):**
```text
[R1] Max single-position = 10%.
[R2] Must maintain ≥30% fixed income.
[R3] New positions require downside stress test.
Analysis: Proposed NVDA increase violates [R1]; alternative is ETF exposure.
Decision: Keep NVDA at 9%, add SOXX per [R2]; run Clara stress test for [R3].
```

**Security (access control):**
```text
[R1] Prod secrets only in HashiCorp Vault.
[R2] MFA required for admin roles.
[R3] All changes logged to SIEM within 5m.
Analysis: New Jenkins pipeline currently stores secrets in repo; violates [R1].
Decision: Block deployment until Vault integration complete; document timeline for [R3] logging tests.
```

## Combination Guidance
- Often paired with Clara, Kestra, Ada personas where compliance and rigor dominate.
- Layer with `patterns/chain-of-thought.md` so each stage cites specific rules.
- Use alongside `patterns/meta-rules.md` when stylistic or tone requirements exist.

## Failure Modes
- Writing vague rules that cannot be operationalized.
- Forgetting to cite rules in analysis, losing traceability.
- Ignoring rule conflicts without proposing resolution.
- Treating the rule list as static even when context changes (must update explicitly).
