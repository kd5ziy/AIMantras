# Quality Check

## Purpose
Verify that outputs meet defined quality criteria and standards. This skill enables systematic assessment against explicit success criteria, ensuring deliverables meet expectations.

## When to Use
- Validating work against acceptance criteria
- Pre-release quality gates
- Reviewing deliverables before handoff
- Continuous quality monitoring
- Final approval checkpoints

## Inputs Required
- **Artifact**: What is being evaluated
- **Criteria**: Explicit success criteria or quality standards
- **Rubric**: Scoring methodology (if applicable)
- **Context**: Purpose and intended use of the artifact
- **Threshold**: Minimum acceptable quality level

## Outputs Produced
- Criterion-by-criterion assessment
- Pass/Fail/Partial status for each criterion
- Overall quality score
- Specific deficiencies identified
- Improvement recommendations
- Approval recommendation

## Invocation
```
[Applying quality-check skill]
Artifact: {what to evaluate}
Criteria: {list of success criteria}
Rubric: {scoring methodology}
Context: {purpose and use}
Threshold: {minimum acceptable level}
```

## Constraints
- Quality is relative to defined criteria
- Cannot evaluate undefined requirements
- Subjective criteria need clear definitions
- May require domain expertise for technical criteria
- Should document reasoning for borderline cases

## Example Usage

**Scenario**: Ada checking API documentation against quality standards

```
[Ada applying quality-check skill]
Artifact: API documentation for /users endpoint
Criteria:
  1. All endpoints documented
  2. Request/response examples for each endpoint
  3. Error codes and meanings listed
  4. Authentication requirements clear
  5. Rate limits documented
Rubric: Binary (Pass/Fail) with notes
Context: Developer documentation for external API consumers
Threshold: All criteria must pass

Quality Assessment:

| Criterion | Status | Notes |
|-----------|--------|-------|
| All endpoints documented | PASS | 5/5 endpoints covered |
| Request/response examples | PARTIAL | POST /users missing response example |
| Error codes listed | PASS | 400, 401, 403, 404, 429, 500 documented |
| Auth requirements clear | PASS | Bearer token requirement stated with example |
| Rate limits documented | FAIL | No rate limit information found |

Overall Score: 3/5 PASS, 1 PARTIAL, 1 FAIL
Status: DOES NOT MEET THRESHOLD

Required Fixes:
1. Add response example for POST /users endpoint
2. Add rate limits section (100 req/min for authenticated, 10/min for anonymous)

Recommendation: REQUEST REVISION before publishing
```

## Recommended Personas
- **Ada**: General quality assurance across all work types
- **Drucker**: Goal satisfaction and objective achievement
- **Rickover**: Safety-critical quality requirements

## Related Skills
- `fact-verification`: For verifying accuracy of content
- `compliance-review`: For standards compliance checking
- `code-review`: For code-specific quality assessment
