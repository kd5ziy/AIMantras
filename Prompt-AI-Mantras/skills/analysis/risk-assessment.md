# Risk Assessment

## Purpose
Systematically identify, analyze, and prioritize risks associated with decisions, plans, or systems. This skill enables proactive risk management and informed decision-making.

## When to Use
- Evaluating a proposed plan or decision
- Assessing system vulnerabilities
- Planning mitigation strategies
- Comparing options with different risk profiles
- Pre-mortem analysis ("what could go wrong?")

## Inputs Required
- **Subject**: What is being assessed (plan, system, decision)
- **Context**: Environment, constraints, stakeholders
- **Risk appetite**: Conservative, moderate, aggressive
- **Time horizon**: Short-term vs. long-term risks
- **Focus areas**: Technical, financial, operational, reputational, etc.

## Outputs Produced
- Risk register (identified risks with metadata)
- Impact and likelihood assessments
- Risk matrix visualization
- Prioritized risk list
- Mitigation recommendations
- Residual risk summary

## Invocation
```
[Applying risk-assessment skill]
Subject: {what to assess}
Context: {environment and constraints}
Risk appetite: {conservative|moderate|aggressive}
Horizon: {short-term|long-term|both}
Focus: {risk categories to emphasize}
```

## Constraints
- Cannot predict black swan events
- Assessments are probabilistic, not certain
- Requires honest input about constraints
- May miss risks outside defined scope
- Should be updated as conditions change

## Example Usage

**Scenario**: Clara assessing investment portfolio rebalancing plan

```
[Clara applying risk-assessment skill]
Subject: Shifting 30% from bonds to equities
Context: Retirement portfolio, 15-year horizon, moderate income needs
Risk appetite: moderate
Horizon: both
Focus: market, inflation, liquidity

Risk Register:

| Risk | Impact | Likelihood | Score | Mitigation |
|------|--------|------------|-------|------------|
| Market downturn reduces equity value | High | Medium | 6 | Dollar-cost average over 6 months |
| Inflation erodes bond returns (current state) | Medium | High | 6 | Supports the rebalancing rationale |
| Liquidity need during down market | High | Low | 3 | Maintain 6-month cash reserve |
| Sequence-of-returns risk near retirement | High | Medium | 6 | Glide path back to bonds starting year 10 |

Overall Assessment: MODERATE RISK
The rebalancing addresses inflation risk but introduces sequence risk.
Recommend: Proceed with phased approach and defined glide path.
```

## Recommended Personas
- **Clara**: Financial and investment risks
- **Kestra**: Technical and infrastructure risks
- **Watson**: Medical and health risks
- **Rickover**: Safety-critical system risks
- **Lovell**: Crisis and operational risks
- **Franklin**: Complex multi-domain risk interactions

## Related Skills
- `security-audit`: For security-specific risk analysis
- `comparative-analysis`: For comparing risk profiles across options
- `threat-modeling`: Pattern for systematic threat identification
