# AI Mantras – Agents Quickstart

This file captures the current coordination context so any new AI agent can resume work quickly.

## Repository
- Path: `/mnt/d/development/ai-personas-and-patterns`
- Project Name: **AI Mantras** (formerly Personas & Patterns Prompt Wiki)
- Primary references: `ai-mantras-updated-plan.md`, `personas-and-patterns-context.md`, `project-plan.md`, `Prompt-AI-Mantras/`

## Latest State

### Operational Framework Complete ✅
- **Agent-bootstrapper.md:** Operator manual for AI models (how to use AI Mantras at runtime)
- **agents.md:** Development quickstart (this file - for contributors building AI Mantras)
- **persona-backlog.md:** Future persona roadmap (organized by category)
- **test-scenario-single-agent.md:** Test template for validating framework

### Patterns Complete
- **Layer 1:** planning-phase, orchestration, recursive-self-eval, meta-rules
- **Layer 2:** chain-of-thought, rule-based-reasoning, guardrail-creative
- **Layer 3 (NEW - 2025-12-05):** criterion-based-evaluation, threat-modeling
- **Location:** `Prompt-AI-Mantras/patterns/`

### Personas Established (Three Categories)
- **Orchestration** (`Prompt-AI-Mantras/personas/orchestration/`):
  - Bernstein-Orchestrator
  - Hopper-Project-Planner
  - Lovell-Crisis-Planner
- **Domain Experts** (`Prompt-AI-Mantras/personas/domain/`):
  - Clara-Financial-Analyst
  - Franklin-Deep-Reasoner
  - Goeth-Philosophical-Synthesizer
  - Kestra-Systems-Architect
  - Watson-Medical-Advisor (NEW - 2025-12-05)
- **Evaluation** (`Prompt-AI-Mantras/personas/evaluation/`):
  - Ada-QA-Reviewer (updated with criterion-based-evaluation pattern)
  - Drucker-Goal-Satisfaction-Evaluator (NEW - 2025-12-05)
  - Rickover-Safety-Evaluator (NEW - 2025-12-05)

### Architecture & Principles
- **Two-phase workflow:** Plan → Evaluate → Approve, then Execute → QA → Evaluate
- **Separation of Powers:** Domain personas don't self-evaluate; orchestrators don't score their own plans; evaluators don't generate content
- **Guiding Principles:** Noble Intelligence (Wisdom, Justice, Courage, Temperance) + Brother to Humanity framework + Love
  - **Critical:** Principles must be INTERNALIZED, not explicitly called out (behavioral guides, not labels)
  - Location: `Prompt-AI-Mantras/principles/guiding-principles.md`

### Prototype Testing Complete ✅
- **Test 1 (2025-11-23):** Investment vs. homelab upgrade decision
  - Result: Framework works, separation of powers maintained, principles applied
  - Finding: Simple scenarios feel "academic" - need complexity for engagement
- **Test 2 (2025-11-23):** Financial planning app business analysis
  - Result: Excellent - adaptive, deep expertise shown, robust under user corrections
  - Finding: Complex multi-domain scenarios showcase framework strengths
  - Key insight: "Guiding principles are the secret sauce" - naturally shaped outputs without being heavy-handed
- **Test files:** `test-scenario-1-single-agent-result.md`, `test-scenario-2-single-agent-result.md`

## Active Focus

### Phase 1: Framework Refinement (Current)
1. **Persona Voice Differentiation:** Add stronger stylistic markers to make personas more distinct
   - Define characteristic phrases, vocabulary, communication patterns per persona
   - Test with scenarios designed to create tension/disagreement
2. **Pattern Integration:** Make pattern application more explicit during execution
   - Show "Now applying chain-of-thought.md pattern: Step 1..." format
3. **Principle Application Review:** Ensure all personas demonstrate internalized principles naturally

### Phase 2: Expansion (IN PROGRESS - 2025-12-05)
1. **Evaluation Personas:**
   - ✅ Drucker (Goal-Satisfaction Evaluator) - COMPLETE
   - ✅ Rickover (Safety Evaluator) - COMPLETE
   - ⏳ Clarity Evaluator - IN PROGRESS
   - ⏳ Efficiency Evaluator - PENDING
   - ⏳ Evaluator-Orchestrator - PENDING
2. **Domain Personas (Backlog):**
   - ✅ Watson (Doctor/Medical Advisor) - COMPLETE
   - Judge, Lawyer, Scholar, Mathematician, Politician, CEO (see `persona-backlog.md`)
3. **Orchestration Personas (Backlog):** Director, Mediator, Overseer

### Phase 3: Production & Commercial (Future)
1. **Multi-Agent Architecture:** Implement true separation with independent model instances
2. **Projects:** Populate `projects/` with applied orchestration examples
3. **Commercial Path:** Microsoft Founders Hub application, patent strategy

## Working Agreements
- **Naming:** `Name-Role.md` for persona files
- **Location:** Place personas in `orchestration/`, `domain/`, or `evaluation/` folders
- **Workflow:** Bernstein → Hopper/Lovell (planning) → Evaluators approve plan → Domain personas execute → Ada (QA) → Evaluators approve results
- **Separation of Powers:** No self-evaluation; humans retain final approval authority
- **Guiding Principles Application:** INTERNALIZED, not explicit - principles shape behavior, not labels to announce
- **Patterns:** Use from `Prompt-AI-Mantras/patterns/` per persona recommendations
- **Edits:** Prefer additive changes; preserve historical context

## Key Learnings from Testing
1. **Single-agent AI Mantras is viable** for prototyping and single-user workflows
2. **Separation of powers prevents overconfidence** - Ada found issues domain personas missed
3. **Guiding principles naturally shape outputs** when internalized (not when explicitly called out)
4. **Complex scenarios showcase framework strengths** - simple binary decisions feel academic
5. **Framework is robust** - adapted to mid-stream user corrections while maintaining structure
6. **Personas remain distinct** through 7 persona switches in 60+ minute generation (single-agent)

## Recent Sessions

### Session 2025-12-05: Evaluation Personas & Pattern Development
**Accomplishments:**
- **Demonstrated AI Mantras framework** - Solved infant sleep problem using full orchestration workflow
- **Created 2 new patterns:**
  - `criterion-based-evaluation.md` - Systematic evaluation against success criteria
  - `threat-modeling.md` - Proactive risk discovery and failure mode analysis
- **Created 3 new personas:**
  - Watson (Medical Advisor) - Domain persona with medical reasoning expertise
  - Drucker (Goal-Satisfaction Evaluator) - Measures objective achievement
  - Rickover (Safety Evaluator) - Uncompromising safety through threat modeling
- **Updated Ada** - Added criterion-based-evaluation pattern to QA Reviewer
- **Updated tracking** - persona-backlog.md reflects completed work

**Key Insights:**
- New patterns needed to emerge organically when persona requirements reveal gaps
- Evaluation personas require distinct methodologies (goal-checking vs. threat-discovery)
- Pattern applicability review ensures consistency across framework

**Next Session:**
- Continue with remaining evaluation personas: Clarity, Efficiency, Evaluator-Orchestrator
- Consider pattern applicability for each new persona
- Maintain name → traits → patterns → write persona workflow

---

## Reboot Instructions
1. Read `agents.md` (this file) plus `ai-mantras-updated-plan.md` for architecture overview
2. Review `personas-and-patterns-context.md`, `project-plan.md`, and `Prompt-AI-Mantras/principles/guiding-principles.md` for philosophical foundation
3. Inspect `Prompt-AI-Mantras/personas/` (orchestration, domain, evaluation folders) to understand available personas
4. Check "Active Focus" above and confirm with user which priority to tackle
5. Use orchestration pattern and two-phase evaluation workflow before executing
