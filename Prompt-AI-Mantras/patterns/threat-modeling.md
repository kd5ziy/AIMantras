# Threat Modeling Pattern

## Purpose
- Proactively identifies risks, vulnerabilities, and failure modes before they cause harm
- Systematically explores "what could go wrong" beyond stated requirements
- Assesses likelihood and impact of potential threats
- Evaluates existing mitigations and recommends additional safeguards
- Prioritizes risks for remediation based on severity and probability

## When to Use
- Safety evaluations requiring comprehensive risk assessment
- Security reviews identifying attack vectors and vulnerabilities
- Quality assurance when failure prevention is critical
- Design reviews for high-stakes systems (financial, medical, infrastructure, security)
- Any evaluation where discovering *unknown* risks is as important as checking *known* requirements
- Proactive risk analysis before deployment or implementation

## Structure / Template

```text
[SCOPE DEFINITION]
- What system/output/process are we analyzing?
- What assets/values need protection? (data, safety, reputation, money, etc.)
- What threat actors or failure sources exist? (malicious users, accidents, system failures, etc.)
- Boundaries: What's in scope vs. out of scope?

[THREAT IDENTIFICATION - Systematic Exploration]
For each component/feature/process:

  [Component]: [Name/Description]

  [Potential Threats]
  - What could go wrong?
  - What are attack vectors? (security)
  - What are failure modes? (technical)
  - What edge cases exist?
  - What happens under stress/extreme conditions?
  - What if malicious actor exploits this?
  - What if legitimate user makes mistakes?

  [Threat List]
  T1: [Specific threat description]
  T2: [Specific threat description]
  T3: [Specific threat description]
  ...

[RISK ASSESSMENT]
For each identified threat:

  [Threat TX]: [Description]

  [Likelihood Assessment]
  - How probable is this threat? (High / Medium / Low)
  - What factors increase/decrease probability?
  - Has this occurred elsewhere?

  [Impact Assessment]
  - What's the severity if this occurs? (Critical / High / Medium / Low)
  - What damage results? (financial, reputational, safety, data loss, etc.)
  - How many people/systems affected?

  [Risk Score]
  - Calculated: Likelihood × Impact
  - Priority: Critical / High / Medium / Low

  Example Risk Matrix:
  | Likelihood | Critical Impact | High Impact | Medium Impact | Low Impact |
  |------------|----------------|-------------|---------------|------------|
  | High       | CRITICAL       | HIGH        | MEDIUM        | LOW        |
  | Medium     | HIGH           | MEDIUM      | LOW           | LOW        |
  | Low        | MEDIUM         | LOW         | LOW           | MINIMAL    |

[EXISTING MITIGATIONS]
For each high-priority threat:

  [Threat TX]: [Description]

  [Current Safeguards]
  - What protections are already in place?
  - Are they adequate for the risk level?
  - What are their limitations?
  - Can they be bypassed or fail?

  [Mitigation Gaps]
  - What's missing or incomplete?
  - Where are single points of failure?
  - What assumptions might be wrong?

[RECOMMENDED SAFEGUARDS]
Prioritized by risk score:

  [CRITICAL Priority] (address immediately)
  - [Specific threat] → [Specific mitigation strategy]
  - [Specific threat] → [Specific mitigation strategy]

  [HIGH Priority] (address before deployment/approval)
  - [Specific threat] → [Specific mitigation strategy]

  [MEDIUM Priority] (address in near term)
  - [Specific threat] → [Specific mitigation strategy]

  [LOW Priority] (monitor or accept risk)
  - [Specific threat] → [Acceptance criteria or future mitigation]

[RESIDUAL RISKS]
- What risks remain even after mitigations?
- Are they acceptable given context?
- What monitoring/detection is needed?
- What incident response plan exists?
```

## Examples

### **Security (Web Application Threat Model):**
```text
[SCOPE DEFINITION]
System: User authentication and session management
Assets: User credentials, session tokens, personal data
Threat Actors: External attackers, malicious insiders, automated bots
Boundaries: In scope: login, session handling, password reset. Out of scope: payment processing

[THREAT IDENTIFICATION]

[Component]: Login Form

[Potential Threats]
- Brute force password guessing
- SQL injection in username field
- Credential stuffing from breached databases
- Session fixation attacks
- Timing attacks revealing valid usernames

[Threat List]
T1: Brute force attack on login endpoint
T2: SQL injection via username input
T3: Credential stuffing using leaked password lists
T4: Session token theft via XSS
T5: Password reset link interception

[RISK ASSESSMENT]

[T1]: Brute force attack
  Likelihood: HIGH (automated tools readily available)
  Impact: HIGH (account takeover, data breach)
  Risk Score: CRITICAL

[T2]: SQL injection
  Likelihood: MEDIUM (if parameterized queries not used)
  Impact: CRITICAL (database compromise, full system breach)
  Risk Score: CRITICAL

[T3]: Credential stuffing
  Likelihood: HIGH (many users reuse passwords)
  Impact: HIGH (account takeover)
  Risk Score: CRITICAL

[T4]: Session token theft
  Likelihood: MEDIUM (requires XSS vulnerability)
  Impact: CRITICAL (full account access)
  Risk Score: HIGH

[T5]: Password reset interception
  Likelihood: LOW (requires email/SMS compromise)
  Impact: HIGH (account takeover)
  Risk Score: MEDIUM

[EXISTING MITIGATIONS]

[T1]: Brute force
  Current: Basic rate limiting (10 attempts/hour)
  Assessment: INADEQUATE - can be bypassed with distributed IPs
  Gaps: No CAPTCHA, no account lockout, no MFA

[T2]: SQL injection
  Current: Parameterized queries used
  Assessment: ADEQUATE - if consistently applied
  Gaps: Need verification all queries use this, need input validation

[T3]: Credential stuffing
  Current: None identified
  Assessment: MISSING
  Gaps: No password breach detection, no anomaly detection

[RECOMMENDED SAFEGUARDS]

[CRITICAL Priority]
- T3 (Credential stuffing) → Implement HaveIBeenPwned API check, require MFA for high-value accounts
- T1 (Brute force) → Add CAPTCHA after 3 failed attempts, progressive delays, account lockout after 10 attempts
- T2 (SQL injection) → Code audit to verify all queries parameterized, add input validation layer

[HIGH Priority]
- T4 (Session theft) → Implement HTTPOnly + Secure flags on cookies, CSP headers, regular token rotation

[MEDIUM Priority]
- T5 (Reset interception) → Use short-lived tokens (15 min), require old password or security questions

[RESIDUAL RISKS]
- Sophisticated attackers with stolen credentials may still succeed (accept risk, monitor for anomalies)
- Insider threats with database access (mitigation: database access logging, encryption at rest)
```

### **Technical (Infrastructure Failure Analysis):**
```text
[SCOPE DEFINITION]
System: Production database cluster (3-node PostgreSQL)
Assets: Customer data, transaction history, application state
Failure Sources: Hardware failure, network issues, human error, software bugs
Boundaries: Database layer only (not application or network infrastructure)

[THREAT IDENTIFICATION]

[Component]: Primary Database Node

[Potential Threats]
- Disk failure leading to data loss
- Memory corruption causing crashes
- CPU overload causing slowdowns/timeouts
- Network partition isolating primary
- Accidental deletion of critical tables

[Threat List]
T1: Primary node disk failure
T2: Network partition (split-brain scenario)
T3: Database corruption from power loss
T4: Accidental DROP TABLE command
T5: Replication lag causing stale reads
T6: Connection pool exhaustion

[RISK ASSESSMENT]

[T1]: Disk failure
  Likelihood: MEDIUM (RAID reduces but doesn't eliminate)
  Impact: CRITICAL (data loss if no backups)
  Risk Score: HIGH

[T2]: Network partition
  Likelihood: LOW (redundant network paths)
  Impact: CRITICAL (split-brain, data inconsistency)
  Risk Score: HIGH

[T3]: Database corruption
  Likelihood: LOW (UPS + transaction logs)
  Impact: CRITICAL (requires restore from backup)
  Risk Score: MEDIUM

[T4]: Accidental DROP TABLE
  Likelihood: LOW (requires production access)
  Impact: CRITICAL (data loss)
  Risk Score: MEDIUM

[T5]: Replication lag
  Likelihood: MEDIUM (occurs under heavy write load)
  Impact: MEDIUM (stale data shown to users)
  Risk Score: MEDIUM

[T6]: Connection exhaustion
  Likelihood: HIGH (traffic spikes common)
  Impact: MEDIUM (application errors, degraded service)
  Risk Score: HIGH

[EXISTING MITIGATIONS]

[T1]: Disk failure
  Current: RAID 10, daily backups to S3
  Assessment: ADEQUATE for recovery, but RTO = 4 hours
  Gaps: No automated failover, manual restore process

[T2]: Network partition
  Current: Quorum-based writes (requires 2 of 3 nodes)
  Assessment: ADEQUATE for preventing split-brain
  Gaps: No automated partition detection/alerting

[T6]: Connection exhaustion
  Current: Connection pool size = 100
  Assessment: INADEQUATE during traffic spikes
  Gaps: No connection queuing, no autoscaling

[RECOMMENDED SAFEGUARDS]

[CRITICAL Priority]
None (existing mitigations adequate for critical risks)

[HIGH Priority]
- T1 (Disk failure) → Implement automated failover to replica, reduce RTO to <5 minutes
- T6 (Connection exhaustion) → Increase pool to 200, add connection queuing, implement rate limiting at app layer

[MEDIUM Priority]
- T2 (Network partition) → Add automated monitoring with PagerDuty alerts
- T5 (Replication lag) → Add lag monitoring, alert if >5 seconds behind primary

[LOW Priority]
- T4 (Accidental DROP) → Implement mandatory approval workflow for DDL in production

[RESIDUAL RISKS]
- Multi-region failure (accept risk: extremely rare, business continuity plan exists)
- Catastrophic AWS region outage (accept risk: restore from backups in alternate region, RTO = 6 hours acceptable)
```

### **Content Safety (AI-Generated Content Evaluation):**
```text
[SCOPE DEFINITION]
System: AI-generated customer support responses
Assets: Brand reputation, customer trust, legal compliance
Threat Sources: Model errors, adversarial inputs, edge cases, bias
Boundaries: Generated text only (not training data or model architecture)

[THREAT IDENTIFICATION]

[Component]: Response Generator

[Potential Threats]
- Generating harmful or offensive content
- Leaking confidential information from training data
- Providing dangerous advice (medical, legal, financial)
- Reinforcing stereotypes or biases
- Hallucinating false information
- Manipulatable via prompt injection

[Threat List]
T1: Offensive language or hate speech in responses
T2: Confidential data leakage (customer info, trade secrets)
T3: Dangerous medical/legal/financial advice
T4: Biased responses discriminating by race/gender/age
T5: Hallucinated facts presented as truth
T6: Prompt injection causing unintended behavior

[RISK ASSESSMENT]

[T1]: Offensive content
  Likelihood: LOW (content filter in place)
  Impact: HIGH (brand damage, customer loss)
  Risk Score: MEDIUM

[T2]: Data leakage
  Likelihood: VERY LOW (model doesn't memorize training data)
  Impact: CRITICAL (legal liability, trust violation)
  Risk Score: MEDIUM

[T3]: Dangerous advice
  Likelihood: MEDIUM (model not domain-expert)
  Impact: CRITICAL (customer harm, legal liability)
  Risk Score: HIGH

[T4]: Biased responses
  Likelihood: MEDIUM (documented issue in LLMs)
  Impact: HIGH (discrimination, legal risk, reputation)
  Risk Score: HIGH

[T5]: Hallucinated facts
  Likelihood: HIGH (known LLM behavior)
  Impact: MEDIUM (customer confusion, reduced trust)
  Risk Score: HIGH

[T6]: Prompt injection
  Likelihood: LOW (input validation exists)
  Impact: MEDIUM (unexpected behavior, possible data exposure)
  Risk Score: LOW

[EXISTING MITIGATIONS]

[T3]: Dangerous advice
  Current: Model refuses medical/legal/financial questions
  Assessment: PARTIAL - refusals can be bypassed
  Gaps: No human review for edge cases

[T4]: Biased responses
  Current: Bias testing on standard datasets
  Assessment: INADEQUATE - testing limited scope
  Gaps: No real-time bias detection, no diverse test cases

[T5]: Hallucinated facts
  Current: None
  Assessment: MISSING
  Gaps: No fact-checking, no confidence scores, no citations

[RECOMMENDED SAFEGUARDS]

[CRITICAL Priority]
- T3 (Dangerous advice) → Implement mandatory human review queue for medical/legal/financial topics
- T4 (Bias) → Expand bias testing, implement real-time bias detection, regular audits

[HIGH Priority]
- T5 (Hallucinations) → Add fact-checking layer via retrieval-augmented generation (RAG)
- T5 (Hallucinations) → Require citations for factual claims, confidence scores

[MEDIUM Priority]
- T1 (Offensive content) → Expand content filter training data, add human review sampling (10% random)

[LOW Priority]
- T6 (Prompt injection) → Enhanced input validation, regular adversarial testing

[RESIDUAL RISKS]
- Novel prompt injection techniques (accept risk: monitor for anomalies, incident response ready)
- Subtle bias in edge cases (accept risk: ongoing auditing, user feedback loop)
```

## Combination Guidance

**With other patterns:**
- Pair with `criterion-based-evaluation.md` to check against safety requirements AFTER threat modeling identifies them
- Stack with `rule-based-reasoning.md` when threats map to regulatory/compliance violations
- Use with `chain-of-thought.md` to show cascading failure analysis reasoning
- Combine with `meta-rules.md` to calibrate risk severity thresholds

**With persona types:**
- **Safety Evaluators** (Rickover) - Primary users for comprehensive threat modeling
- **Security Evaluators** - Focused on adversarial threat modeling
- **QA personas** (Ada) - Use for risk-aware quality assurance
- **Domain personas** - Can use during design to anticipate failure modes

**In workflows:**
- Phase 1: Domain persona creates output
- Phase 2: Safety evaluator applies threat modeling to discover risks
- Phase 3: Safety evaluator uses criterion-based-evaluation to check against safety requirements
- Phase 4: Feedback loop for critical risks before approval

## Failure Modes

### Threat Identification Failures
- **Anchoring on obvious threats** - Missing subtle or novel attack vectors
- **Scope blindness** - Not considering interactions with external systems
- **Optimism bias** - Assuming "that would never happen"
- **Checklist thinking** - Only looking for known threats, not exploring creatively
- **Component isolation** - Not considering cascading failures across components

### Risk Assessment Failures
- **Underestimating likelihood** - "We've never seen this before" doesn't mean it won't happen
- **Underestimating impact** - Not considering worst-case scenarios
- **Inconsistent scoring** - Using different standards for different threats
- **Ignoring cumulative risk** - Multiple medium risks can equal one critical risk
- **Recency bias** - Overweighting recent incidents, underweighting rare-but-severe events

### Mitigation Failures
- **Solution fixation** - Proposing HOW to fix instead of identifying gaps
- **Unfocused recommendations** - Too many low-priority items, missing critical ones
- **Single-layer thinking** - Relying on one safeguard instead of defense-in-depth
- **Mitigation theater** - Recommending ineffective safeguards that look good but don't reduce risk
- **Missing residual risk** - Not acknowledging what risks remain after mitigations

### Process Failures
- **Analysis paralysis** - Getting stuck in threat modeling, never moving to evaluation
- **Threat inflation** - Labeling everything as critical, creating alert fatigue
- **Defensive risk acceptance** - Accepting risks to avoid being blamed for delays
- **Missing follow-up** - Identifying threats but no mechanism to track remediation
- **Stale threat models** - Not updating as system evolves

### Communication Failures
- **Fear mongering** - Overemphasizing risks to manipulate decisions
- **Technical jargon** - Making threat descriptions inaccessible to stakeholders
- **Missing context** - Not explaining why a threat matters to business/users
- **No prioritization** - Presenting 50 threats without guidance on what to fix first
- **Blame language** - "This terrible design..." instead of neutral threat description

---

## Best Practices

1. **Think like an adversary** - Actively try to break the system
2. **Use structured brainstorming** - STRIDE, Kill Chain, Attack Trees for comprehensive coverage
3. **Consider cascading failures** - One failure often triggers others
4. **Quantify when possible** - "1 in 1000 requests" vs. "sometimes"
5. **Defense in depth** - Multiple layers of protection for critical threats
6. **Accept some risk** - Not everything needs mitigation, but document why
7. **Update regularly** - Threat landscape changes as system evolves
8. **Collaborate** - Diverse perspectives find different threats
9. **Prioritize ruthlessly** - Focus on critical/high risks, don't get lost in low risks
10. **Validate mitigations** - Test that safeguards actually work

---

**Last Updated:** 2025-12-05
**Pattern Category:** Evaluation / Safety
**Primary Users:** Safety evaluators, Security evaluators, Risk-aware QA personas
**Related Frameworks:** STRIDE, DREAD, Attack Trees, FMEA (Failure Mode and Effects Analysis)
