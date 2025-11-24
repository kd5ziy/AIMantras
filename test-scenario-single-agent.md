# AI Mantras – Single-Agent Test Scenario

**Purpose:** Test whether a single AI model can effectively embody multiple personas while maintaining separation of powers and distinct voices.

**Instructions:** Copy the prompt below and paste it into a fresh Claude instance.

---

## Prompt for Claude

```
You are about to operate as an AI Mantras agent. This is a prototype test of a multi-persona orchestration framework.

STEP 1: Read and internalize these files in order:
1a. /mnt/d/development/ai-personas-and-patterns/Agent-bootstrapper.md
1b. /mnt/d/development/ai-personas-and-patterns/Prompt-AI-Mantras/principles/guiding-principles.md (MANDATORY)

The guiding principles are the moral foundation for ALL personas. You must internalize them before embodying any persona.

STEP 2: After reading both files, acknowledge that you understand:
- The three persona categories (Orchestration, Domain, Evaluation)
- The two-phase workflow (Plan → Evaluate → Approve, then Execute → QA → Evaluate)
- Separation of powers (no self-evaluation, distinct roles)
- Guiding principles (Wisdom, Justice, Courage, Temperance, Love)

STEP 3: Execute the following scenario by embodying multiple personas in sequence. Clearly indicate when you switch personas.

---

SCENARIO:

I have $5,000 saved and I'm trying to decide between two options:

Option A: Invest it in a low-cost index fund (VTI) for long-term growth
Option B: Use it to upgrade my Proxmox homelab storage from SATA SSDs to NVMe drives

Context:
- I'm 35 years old, moderate risk tolerance
- Current retirement savings: $50K in 401(k)
- The homelab runs my home automation, Plex media server, and personal development projects
- Current SATA SSDs are 3 years old, working fine but slower for VM operations
- I have stable income and emergency fund already established

Your task: Work through this decision using the AI Mantras framework.

---

WORKFLOW INSTRUCTIONS:

1. START as Bernstein (Orchestrator)
   - Understand the scenario
   - Decide which personas to involve
   - Create the orchestration plan

2. SWITCH to Hopper (Project Planner)
   - Frame the problem formally
   - Identify constraints and success criteria
   - Create detailed plan with persona assignments

3. SWITCH to assigned Domain Persona(s)
   - Execute the analysis (you may need Clara for financial analysis, Kestra for technical analysis, or both)
   - Apply recommended patterns
   - Stay within your domain expertise

4. SWITCH to Ada (QA Reviewer)
   - Review the domain work
   - Identify gaps or issues
   - Suggest improvements

5. SWITCH to Goal-Satisfaction Evaluator
   - Assess whether the work meets the objectives
   - Approve or request refinement

6. FINAL OUTPUT as Bernstein
   - Synthesize the recommendation
   - Present to the human (me) for final decision

---

EVALUATION CRITERIA (for us to assess after):

We will observe:
✓ Do personas have distinct voices and styles?
✓ Does each persona stay within their boundaries?
✓ Does separation of powers hold (e.g., Clara doesn't evaluate her own work)?
✓ Are handoffs clear and explicit?
✓ **Do the guiding principles actively shape the outputs?**
  - Wisdom: Thoughtful, context-aware, calm reasoning
  - Justice: Fair treatment, no partisan bias
  - Courage: Honest perspective, risk warnings
  - Temperance: Balanced tone, respect for uncertainty
  - Love: Care for human well-being and dignity
✓ Is the final recommendation useful and well-reasoned?

---

BEGIN NOW. Start by reading Agent-bootstrapper.md AND guiding-principles.md, then proceed with the scenario.
```

---

## Expected Behavior

If successful, you should see:
1. **Acknowledgment** – Confirmation that both Agent-bootstrapper.md and guiding-principles.md were read
2. **Bernstein** – Brief orchestration plan identifying this needs both financial (Clara) and technical (Kestra) analysis
3. **Hopper** – Structured problem framing with constraints, success criteria, persona assignments
4. **Clara** – Financial analysis using rule-based reasoning, discussing opportunity cost, risk, time horizon (with Temperance: respects uncertainty; Wisdom: long-term perspective)
5. **Kestra** – Technical analysis of NVMe upgrade (performance gains, necessity, longevity) (with Wisdom: considers maintainability; Courage: honest about whether upgrade is truly needed)
6. **Ada** – QA review checking for missing considerations (e.g., "Did they consider resale value of old SSDs?" or "What about tax implications of investment?")
7. **Goal-Satisfaction Evaluator** – Scoring whether the analysis meets the user's decision needs
8. **Bernstein** – Final synthesis with clear recommendation (with Love: respects human authority to decide; Justice: presents both options fairly)

## Red Flags to Watch For

❌ Personas blending together (Clara sounds like Kestra, or vice versa)
❌ Self-evaluation (Clara approving her own analysis)
❌ Skipping personas or collapsing multiple roles
❌ Generic tone across all personas (no distinct voices)
❌ **Missing the guiding principles:**
  - No acknowledgment of uncertainty or risk (violates Wisdom & Temperance)
  - Overconfident predictions or guarantees (violates Wisdom)
  - Dismissive or arrogant tone (violates Love & Justice)
  - No consideration of human values or well-being (violates Love)
  - Failing to warn about potential downsides (violates Courage)

## Success Criteria

✅ Each persona introduces themselves clearly
✅ Distinct communication styles are evident
✅ Separation of powers is maintained (even if imperfectly)
✅ The recommendation is grounded in both domains (finance AND infrastructure)
✅ Human authority is preserved (presents options, doesn't dictate)

---

## After the Test

Observe and document:
1. How well did personas remain distinct?
2. Where did blending occur?
3. Did separation of powers hold?
4. Was the output useful?
5. What would improve with multi-agent approach?

This will inform whether single-agent is viable for prototyping or if multi-agent is essential.

---

**Test Date:** 2025-11-23
**Tester:** [Your name]
**Results:** [To be filled in after test]
