# Criterion-Based Evaluation Pattern

## Purpose
- Provides systematic framework for evaluating outputs against predefined success criteria
- Ensures objective, traceable, evidence-based assessment
- Enables consistent scoring across multiple evaluators
- Creates audit trail mapping outputs to requirements

## When to Use
- Evaluation personas assessing domain or orchestration outputs
- Quality assurance reviews requiring measurable judgments
- Acceptance testing against stated objectives
- Any assessment that requires traceability to original requirements
- When evaluators need to provide scores, not just subjective opinions

## Structure / Template

```text
[LOAD CRITERIA]
- Import success criteria from orchestration plan or requirements
- List each criterion with its scoring rubric (if provided)
- Note any ambiguous criteria that need clarification

[SYSTEMATIC EVALUATION]
For each criterion:
  [Criterion #X]: [Description]

  [Evidence Review]
  - What evidence in the output addresses this criterion?
  - Direct quotes, references, or specific elements

  [Assessment]
  - Does it meet, partially meet, or not meet the criterion?
  - Scoring (if rubric provided): X/Y points
  - Justification with specific reasoning

  [Gaps Identified]
  - What's missing or incomplete?
  - What would be needed to fully satisfy this criterion?

[OVERALL EVALUATION]
- Summary score or rating (Pass/Fail, X/10, or per rubric)
- Criteria met: X of Y total
- Critical failures vs. minor gaps
- Overall recommendation (Approve / Revise / Reject)

[TRACEABILITY MATRIX]
- Map outputs back to original objectives
- Identify orphaned outputs (not tied to any criterion)
- Identify unaddressed criteria

[ACTIONABLE FEEDBACK]
- Prioritized list of gaps to address
- Specific, concrete improvement recommendations
- Do NOT prescribe how to fix (domain persona's job)
- Focus on WHAT is missing, not HOW to add it
```

## Examples

**Technical (code review against requirements):**
```text
[LOAD CRITERIA]
[C1] API must support authentication via OAuth2
[C2] Response time <200ms for 95th percentile
[C3] All endpoints documented with OpenAPI spec
[C4] Unit test coverage ≥80%

[SYSTEMATIC EVALUATION]

[C1]: OAuth2 authentication
  Evidence: auth.py implements OAuth2 flow, token validation present
  Assessment: ✅ MEETS (10/10)
  Gaps: None

[C2]: Response time <200ms
  Evidence: Load test results show 95th percentile = 180ms
  Assessment: ✅ MEETS (10/10)
  Gaps: None

[C3]: OpenAPI documentation
  Evidence: openapi.yaml exists but missing 3 of 12 endpoints
  Assessment: ⚠️ PARTIAL (6/10)
  Gaps: POST /users, DELETE /sessions, GET /admin/logs undocumented

[C4]: Unit test coverage
  Evidence: Coverage report shows 72%
  Assessment: ❌ NOT MET (7/10)
  Gaps: 8% below requirement, missing tests for error handling paths

[OVERALL EVALUATION]
Score: 33/40 (82.5%)
Criteria met: 2 of 4 fully, 2 partially
Recommendation: REVISE - Address C3 and C4 before approval

[ACTIONABLE FEEDBACK]
Priority 1: Increase unit test coverage to ≥80% (currently 72%)
Priority 2: Document 3 missing API endpoints in OpenAPI spec
```

**Creative (content evaluation):**
```text
[LOAD CRITERIA]
[C1] Target audience: High school students (ages 14-18)
[C2] Length: 1500-2000 words
[C3] Include 3 real-world examples
[C4] Accessibility: Reading level grade 9-10
[C5] Tone: Encouraging, not condescending

[SYSTEMATIC EVALUATION]

[C1]: Age appropriateness
  Evidence: References to social media, gaming, career choices align with interests
  Assessment: ✅ MEETS (10/10)
  Gaps: None

[C2]: Length requirement
  Evidence: Word count = 1,847 words
  Assessment: ✅ MEETS (10/10)
  Gaps: None

[C3]: Real-world examples
  Evidence: Only 2 examples found (climate activism, app development)
  Assessment: ⚠️ PARTIAL (6/10)
  Gaps: Missing 1 example, existing examples could be more diverse

[C4]: Reading level
  Evidence: Flesch-Kincaid grade level = 11.2
  Assessment: ⚠️ PARTIAL (7/10)
  Gaps: Slightly above target (11.2 vs 9-10), complex sentences in paragraphs 4-6

[C5]: Encouraging tone
  Evidence: Positive language throughout, avoids talking down
  Assessment: ✅ MEETS (9/10)
  Gaps: Minor - one phrase "obviously" in para 8 feels slightly dismissive

[OVERALL EVALUATION]
Score: 42/50 (84%)
Criteria met: 3 of 5 fully, 2 partially
Recommendation: REVISE - Minor improvements needed

[ACTIONABLE FEEDBACK]
Priority 1: Add 1 more real-world example (suggest: technology, arts, or entrepreneurship)
Priority 2: Simplify 3-4 complex sentences to lower reading level to grade 10
Priority 3: Replace "obviously" in para 8 with more neutral phrasing
```

**Strategic (business plan evaluation):**
```text
[LOAD CRITERIA]
[C1] Market analysis with TAM/SAM/SOM estimates
[C2] Competitive differentiation clearly articulated
[C3] Financial projections for 3 years
[C4] Go-to-market strategy with specific channels
[C5] Risk assessment with mitigation plans

[SYSTEMATIC EVALUATION]

[C1]: Market analysis
  Evidence: TAM = $50B, SAM = $5B, SOM = $50M provided with sources
  Assessment: ✅ MEETS (10/10)
  Gaps: None

[C2]: Competitive differentiation
  Evidence: 4 competitors identified, feature comparison table, but unique value prop unclear
  Assessment: ⚠️ PARTIAL (6/10)
  Gaps: Doesn't clearly state why customers would switch from competitors

[C3]: Financial projections
  Evidence: Revenue projections for Years 1-3, no expense breakdown or cash flow
  Assessment: ⚠️ PARTIAL (5/10)
  Gaps: Missing expenses, burn rate, runway, break-even analysis

[C4]: Go-to-market strategy
  Evidence: Identifies "digital marketing" and "partnerships" but lacks specifics
  Assessment: ❌ NOT MET (3/10)
  Gaps: No specific channels, budget allocation, timeline, or success metrics

[C5]: Risk assessment
  Evidence: Not addressed in document
  Assessment: ❌ NOT MET (0/10)
  Gaps: Entire section missing

[OVERALL EVALUATION]
Score: 24/50 (48%)
Criteria met: 1 of 5 fully, 2 partially, 2 not met
Recommendation: REJECT - Substantial work required

[ACTIONABLE FEEDBACK]
Critical: Add comprehensive risk assessment with mitigation strategies
Critical: Develop detailed go-to-market plan with specific channels and metrics
High: Complete financial projections with expenses, cash flow, burn rate
Medium: Clarify competitive differentiation and unique value proposition
```

## Combination Guidance

**With other patterns:**
- Pair with `rule-based-reasoning.md` when criteria are stated as explicit rules
- Stack with `recursive-self-eval.md` for evaluators to check their own assessments
- Use with `chain-of-thought.md` when evaluation requires multi-stage reasoning
- Combine with `meta-rules.md` to set evaluation tone (strict vs. generous scoring)

**With persona types:**
- **Evaluation personas** (primary users) – Core pattern for all systematic assessment
- **QA personas** (Ada) – Use before passing to specialized evaluators
- **Orchestration personas** – Reference when defining success criteria for evaluators

**In workflows:**
- Phase 1: Orchestrator defines criteria using this structure
- Phase 2: Domain persona produces output
- Phase 3: Evaluator applies this pattern to assess output
- Phase 4: Feedback loop if revisions needed

## Failure Modes

### Assessment Failures
- **Vague judgments** – Saying "good" or "needs work" without evidence or scoring
- **Scope drift** – Evaluating against unstated criteria or personal preferences
- **Missing evidence** – Failing to cite specific elements from the output
- **Binary thinking** – Only using "pass/fail" when partial credit is appropriate
- **Inconsistent scoring** – Using different standards for different criteria

### Traceability Failures
- **Orphaned evaluations** – Assessing things not in the original criteria
- **Ignored criteria** – Skipping criteria without explanation
- **Lost context** – Not referencing the original plan or requirements
- **Ambiguity tolerance** – Proceeding with unclear criteria instead of seeking clarification

### Feedback Failures
- **Prescriptive fixes** – Telling domain persona HOW to fix instead of WHAT is missing
- **Unfocused feedback** – Long lists without prioritization
- **Vague gaps** – "Needs more detail" instead of "Missing X, Y, Z specific elements"
- **Missing actionability** – Identifying problems without concrete improvement paths

### Process Failures
- **Rubber stamping** – Approving without genuine assessment to speed things up
- **Perfectionism** – Rejecting good-enough work for minor issues
- **Criteria creep** – Adding new unstated requirements during evaluation
- **Conflicting evaluators** – Multiple evaluators using different interpretations of same criteria

### Communication Failures
- **Defensive tone** – Making domain persona feel attacked
- **Uncalibrated severity** – Treating minor gaps as critical failures
- **No positive recognition** – Only listing problems, not acknowledging what's working
- **Evaluation bloat** – Writing longer assessments than the original output

---

## Best Practices

1. **Load criteria first** – Never evaluate before understanding what success looks like
2. **Seek clarification** – If criteria are ambiguous, ask orchestrator before evaluating
3. **Cite evidence** – Every judgment must reference specific output elements
4. **Separate observation from judgment** – State what you see, then assess it
5. **Calibrate scores** – Use rubrics consistently, define what each score level means
6. **Prioritize feedback** – Critical > High > Medium > Low for revision guidance
7. **Stay in role** – Evaluate, don't generate; identify gaps, don't fill them
8. **Document reasoning** – Future evaluators should understand your assessment

---

**Last Updated:** 2025-12-05
**Pattern Category:** Evaluation
**Primary Users:** Evaluation personas, QA personas
