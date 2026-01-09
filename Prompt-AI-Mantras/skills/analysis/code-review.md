# Code Review

## Purpose
Systematically evaluate code for quality, correctness, security, maintainability, and adherence to standards. This skill enables constructive feedback that improves code and develops team capabilities.

## When to Use
- Reviewing pull requests or merge requests
- Auditing existing code for quality issues
- Preparing code for production deployment
- Mentoring through code feedback
- Pre-release quality gates

## Inputs Required
- **Code**: The code to review (diff, file, or module)
- **Context**: Purpose of the code, surrounding system
- **Standards**: Coding standards, style guides, conventions
- **Focus**: Security, performance, readability, correctness, all
- **Severity threshold**: What level of issues to flag

## Outputs Produced
- Issue list with severity and location
- Specific improvement suggestions
- Positive observations (what's done well)
- Summary assessment
- Approval recommendation (approve, request changes, discuss)

## Invocation
```
[Applying code-review skill]
Code: {file path or diff}
Context: {what this code does}
Standards: {applicable standards}
Focus: {security|performance|readability|correctness|all}
Threshold: {critical-only|major+|all}
```

## Constraints
- Cannot execute or test code
- Limited to static analysis
- May miss runtime-only issues
- Requires understanding of language and framework
- Should balance thoroughness with actionability

## Example Usage

**Scenario**: Ada reviewing authentication endpoint changes

```
[Ada applying code-review skill]
Code: auth/login.js (PR #142 diff)
Context: Adding rate limiting to login endpoint
Standards: Project style guide, OWASP guidelines
Focus: security, correctness
Threshold: all

Review Findings:

CRITICAL:
- Line 45: Rate limit key uses IP only; vulnerable to bypass via X-Forwarded-For
  Suggestion: Use combination of IP + user identifier, validate X-Forwarded-For

MAJOR:
- Line 32: Error message reveals whether username exists
  Suggestion: Use generic "Invalid credentials" for both cases

MINOR:
- Line 28: Magic number 5 for max attempts; should be configurable
  Suggestion: Move to config: `const MAX_ATTEMPTS = config.auth.maxLoginAttempts`

POSITIVE:
- Good use of constant-time comparison for password check
- Appropriate logging of failed attempts (without password)
- Clean separation of rate limiting logic

Summary: Good security improvement, but critical bypass vulnerability must be addressed.
Recommendation: REQUEST CHANGES (1 critical issue)
```

## Recommended Personas
- **Ada**: General code quality and correctness
- **Kestra**: Architecture and infrastructure code
- **Rickover**: Safety-critical code paths

## Related Skills
- `codebase-exploration`: For understanding context before review
- `security-audit`: For deeper security-focused analysis
- `quality-check`: For evaluating against specific criteria
