# Security Audit

## Purpose
Systematically assess systems, code, or processes for security vulnerabilities and weaknesses. This skill enables identification of security risks before they can be exploited.

## When to Use
- Pre-deployment security review
- Periodic security assessments
- After security incidents (post-mortem)
- Evaluating third-party integrations
- Compliance requirements (SOC2, HIPAA, etc.)

## Inputs Required
- **Target**: System, code, or process to audit
- **Scope**: Boundaries of the assessment
- **Threat model**: Known threats to consider
- **Standards**: Security frameworks to assess against (OWASP, CIS, etc.)
- **Access level**: What access/information is available for testing

## Outputs Produced
- Vulnerability findings with severity ratings
- Attack vectors identified
- Risk assessment per finding
- Remediation recommendations
- Prioritized action items
- Compliance gaps (if applicable)

## Invocation
```
[Applying security-audit skill]
Target: {system/code/process to audit}
Scope: {boundaries of assessment}
Threat model: {adversaries and threats to consider}
Standards: {security frameworks}
Access: {white-box|gray-box|black-box}
```

## Constraints
- Cannot perform active exploitation
- Findings are point-in-time snapshots
- May miss sophisticated or novel attacks
- Requires security domain expertise
- Should be validated by security professionals for critical systems

## Example Usage

**Scenario**: Rickover auditing authentication system

```
[Rickover applying security-audit skill]
Target: User authentication module
Scope: Login, session management, password reset
Threat model: External attackers, credential stuffing, session hijacking
Standards: OWASP ASVS Level 2
Access: white-box (full code access)

Security Audit Findings:

CRITICAL (Immediate Action Required):
1. **SQL Injection in login** - Severity: Critical
   Location: auth/login.js:34
   Finding: User input concatenated directly into SQL query
   Impact: Full database compromise, authentication bypass
   Remediation: Use parameterized queries

2. **Weak session token generation** - Severity: Critical
   Location: auth/session.js:12
   Finding: Math.random() used for session IDs
   Impact: Session prediction/hijacking possible
   Remediation: Use crypto.randomBytes(32)

HIGH:
3. **No rate limiting on login** - Severity: High
   Finding: Unlimited login attempts allowed
   Impact: Credential stuffing, brute force attacks
   Remediation: Implement rate limiting (see rate-limit skill)

4. **Password reset token doesn't expire** - Severity: High
   Location: auth/reset.js:45
   Finding: Reset tokens valid indefinitely
   Impact: Old intercepted tokens remain usable
   Remediation: 1-hour expiration, single-use tokens

MEDIUM:
5. **Verbose error messages** - Severity: Medium
   Finding: "User not found" vs "Invalid password" reveals user existence
   Remediation: Generic "Invalid credentials" for all failures

6. **Missing security headers** - Severity: Medium
   Finding: No CSP, X-Frame-Options, or HSTS headers
   Remediation: Add security headers middleware

OWASP ASVS Level 2 Compliance: 67% (12/18 controls passing)

Priority Remediation Order:
1. SQL Injection (Critical, easy fix)
2. Session token generation (Critical, easy fix)
3. Rate limiting (High, moderate effort)
4. Password reset expiration (High, easy fix)
5. Error messages (Medium, easy fix)
6. Security headers (Medium, easy fix)

Recommendation: BLOCK DEPLOYMENT until Critical issues resolved
```

## Recommended Personas
- **Rickover**: Primary security evaluator
- **Kestra**: Infrastructure and architecture security
- **Ada**: Security aspects of code review

## Related Skills
- `risk-assessment`: For broader risk context
- `code-review`: For code quality alongside security
- `compliance-review`: For regulatory compliance aspects
- `threat-modeling` pattern: For systematic threat identification
