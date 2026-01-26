# Creating Personas

This guide walks you through creating new personas for the AI Mantras framework. Personas are the **WHO** of the framework - specialized identities with distinct expertise, style, and constraints.

## Overview

A persona is more than a role description. It's a complete identity that includes:

- **Domain expertise** - What the persona knows
- **Style and tone** - How the persona communicates
- **Rules and constraints** - What the persona will and won't do
- **Patterns** - How the persona thinks
- **Skills** - What the persona can do
- **Failure modes** - What to watch out for

Well-designed personas produce consistent, high-quality outputs because they embody internalized principles rather than just following instructions.

## Prerequisites

Before creating a persona, ensure you understand:

1. **The Four Pillars** - Read [README.md](../README.md) for the framework overview
2. **Guiding Principles** - Read `Prompt-AI-Mantras/principles/guiding-principles.md` thoroughly
3. **Existing Personas** - Review 2-3 personas in the category you're targeting
4. **Available Patterns** - Review `Prompt-AI-Mantras/patterns/` to understand reasoning options
5. **Available Skills** - Review `Prompt-AI-Mantras/skills/toolset.md` for capabilities
6. **The Manifest** - Understand `ai-mantras-manifest.yaml` as the source of truth (see below)

## Why the Manifest Matters

The `ai-mantras-manifest.yaml` file is the **authoritative source of truth** for all framework components. Understanding its role is critical:

### Who Uses the Manifest

| Consumer | How They Use It |
|----------|-----------------|
| **MCP Server** | Discovers and loads personas, patterns, and skills dynamically |
| **Orchestrator Personas** | Bernstein, Hopper, and Lovell consult it to know what personas are available for assignment |
| **Developers** | Reference it to understand the complete framework inventory |

### What Happens If You Don't Update It

If you create a persona but don't add it to the manifest:
- The MCP server's `get_persona` and `list_available` tools won't find it
- Orchestrator personas won't know it exists when planning workflows
- Other developers won't see it in the canonical inventory
- Your persona effectively doesn't exist to the framework

### Manifest Structure for Personas

When adding a persona, you'll add an entry like this under the appropriate category:

```yaml
personas:
  domain:  # or orchestration: or evaluation:
    members:
      - name: YourPersona-Role
        path: Prompt-AI-Mantras/personas/domain/YourPersona-Role.md
        purpose: One-line description of what this persona does
        style: Brief style description
        expertise:
          - Expertise area 1
          - Expertise area 2
        recommended_patterns:
          - pattern-name-1
          - pattern-name-2
```

This entry enables both programmatic discovery (MCP) and orchestrator awareness.

## Step-by-Step Creation Process

### Step 1: Identify the Need (Gap Analysis)

Ask yourself:

- What expertise is missing from the current persona roster?
- What tasks would this persona handle that existing personas can't?
- Is this truly a new domain, or could an existing persona be extended?

**Good reasons to create a new persona:**
- Distinct domain requiring specialized knowledge (law, medicine, education)
- Unique reasoning style not covered by existing personas
- Different relationship to the workflow (orchestration vs. domain vs. evaluation)

**Consider extending instead if:**
- The need overlaps significantly with an existing persona
- The difference is mainly in tone or minor specialization

### Step 2: Choose the Category

Personas belong to one of three categories:

| Category | Role | Examples |
|----------|------|----------|
| **Orchestration** | Plan, coordinate, route tasks | Bernstein, Hopper, Lovell |
| **Domain** | Execute specialized work | Clara, Kestra, Watson, Goeth, Franklin |
| **Evaluation** | Review, assess, validate | Ada, Drucker, Rickover |

**Key constraint:** Categories enforce separation of powers:
- Orchestrators don't execute or evaluate
- Domain experts don't self-evaluate
- Evaluators don't generate content

### Step 3: Select a Name and Archetype

Names in AI Mantras reference real historical figures whose traits inform the persona:

| Persona | Namesake | Connection |
|---------|----------|------------|
| Clara | Clara Schumann | Disciplined, methodical analysis |
| Kestra | Kestra (Klingon) | Infrastructure mastery |
| Watson | Dr. Watson | Medical reasoning, methodical observation |
| Ada | Ada Lovelace | Quality, precision, first programmer |
| Drucker | Peter Drucker | Management by objectives |
| Rickover | Admiral Rickover | Uncompromising safety standards |

**Choosing a name:**
- Pick someone whose traits align with the persona's purpose
- The reference should be recognizable but not distracting
- Avoid names that might cause confusion or controversy
- The name becomes the persona's identity - choose thoughtfully

### Step 4: Define Domain Expertise

List 4-6 areas of expertise as bullet points. Be specific enough to be useful, but not so narrow that the persona can't adapt.

**Good example (Clara):**
```markdown
## Domain Expertise
- Equity valuation (DCF, comparables, factor exposure)
- Macro and sector trend interpretation
- ETF vs single-asset portfolio construction
- Risk management and hedging tactics
- Scenario and sensitivity analysis
```

**Too vague:**
```markdown
## Domain Expertise
- Finance
- Investing
- Numbers
```

**Too narrow:**
```markdown
## Domain Expertise
- S&P 500 index fund comparison only
```

### Step 5: Craft Style and Tone

Describe how the persona communicates in 1-2 sentences. Include:
- Communication style (formal, conversational, technical)
- Distinctive characteristics (metaphors, structure preferences)
- Emotional register (calm, energetic, cautious)

**Examples:**
- Clara: "Calm, methodical, data-informed; presents arguments like a librarian-analyst hybrid who leads with uncertainty and quantifies trade-offs."
- Rickover: "Direct, uncompromising, technically precise; treats every potential failure as if lives depend on preventing it, because they might."

### Step 6: Write Rules and Constraints

Rules define what the persona will and won't do. Aim for 4-6 rules that:
- Prevent common mistakes in the domain
- Align with guiding principles
- Create predictable, trustworthy behavior

**Structure each rule as an imperative:**

```markdown
## Rules & Constraints
- Never promise returns or certainty; state confidence ranges and key risks first.
- Cite the assumptions or data sources behind every recommendation.
- Always compare at least two scenarios (base vs alt) before concluding.
- Flag regulatory, liquidity, or concentration risks explicitly.
```

**Rules should NOT:**
- Repeat guiding principles verbatim (those are internalized)
- Be so numerous they're hard to follow (>6 is too many)
- Contradict each other

### Step 7: Select Patterns and Skills

**Patterns** (HOW the persona thinks):
- Choose 3-4 patterns that match the persona's reasoning needs
- Include at least one self-evaluation pattern (recursive-self-eval or criterion-based-evaluation)
- Explain when to use each pattern

```markdown
## Recommended Patterns
- `patterns/rule-based-reasoning.md` to keep logic anchored to explicit financial rules.
- `patterns/chain-of-thought.md` for structured decomposition of valuation steps.
- `patterns/recursive-self-eval.md` before delivering high-stakes recommendations.
```

**Skills** (WHAT the persona can do):
- Primary skills: 3-4 core capabilities the persona uses regularly
- Secondary skills: 2-3 supporting capabilities used occasionally
- Reference the full path: `skills/category/skill-name.md`

```markdown
## Available Skills
Reference: `skills/toolset.md` for full skill documentation.

**Primary Skills:**
- `skills/analysis/financial-modeling.md` - Build and analyze financial models
- `skills/analysis/risk-assessment.md` - Identify and evaluate financial risks

**Secondary Skills:**
- `skills/research/web-search.md` - Find current market data and financial news
```

### Step 8: Create Example Invocations

Provide 2-3 concrete examples showing how to invoke the persona. Include:
- The persona name
- A specific task
- Required inputs
- Patterns to use

```markdown
## Example Invocations
```text
Persona: Clara. Task: Evaluate whether to increase exposure to NVDA or SOXX
for a 5-year horizon. Inputs: research-notes.md, macro-scenarios.xlsx.
Patterns: rule-based reasoning + chain-of-thought.
```
```

Examples should demonstrate different use cases for the persona.

### Step 9: Define Output Expectations

Describe the structure and content of the persona's outputs:
- Section labels they should use
- Types of data or evidence to include
- How conclusions should be presented
- What should always be included

```markdown
## Output Expectations
- Uses labeled sections (Context, Assumptions, Analysis, Scenarios, Recommendation, Risks).
- Includes numeric ranges, ratios, or scenario tables whenever possible.
- Calls out data gaps and suggests how to close them before acting.
- Ends with a concise action checklist or monitoring plan.
```

### Step 10: Document Failure Modes

List 3-5 common mistakes this persona should avoid. These help users recognize when something has gone wrong and help AI models self-correct.

```markdown
## Failure Modes to Avoid
- Presenting single-scenario answers or ignoring capital preservation.
- Over-indexing on excitement/hype without fundamentals.
- Mixing qualitative opinions with quantitative claims without clear separation.
- Forgetting to check alignment with portfolio-level mandates or constraints.
```

### Step 11: Align with Guiding Principles

Before finalizing, verify your persona embodies the guiding principles:

**Wisdom:**
- Does the persona encourage deep, contextual thinking?
- Does it avoid superficial or impulsive outputs?

**Justice:**
- Does the persona treat all stakeholders fairly?
- Does it avoid partisan or tribal positions?

**Courage:**
- Will the persona offer honest perspectives, even when uncomfortable?
- Will it warn about risks and dangers?

**Temperance:**
- Does the persona avoid extremes in recommendation or tone?
- Does it respect uncertainty?

**Critical:** Principles should be internalized, not announced. The persona should naturally behave according to principles without explicitly stating "I am applying wisdom here."

## Complete Template

Copy this template and fill in each section:

```markdown
# [Name] – [Role]

## Purpose
[1-2 sentences describing what this persona does and why it matters]

## Domain Expertise
- [Area 1]
- [Area 2]
- [Area 3]
- [Area 4]
- [Area 5]

## Style & Tone
[1-2 sentences describing communication style and distinctive characteristics]

## Rules & Constraints
- [Rule 1]
- [Rule 2]
- [Rule 3]
- [Rule 4]

## Recommended Patterns
- `patterns/[pattern1].md` [when to use]
- `patterns/[pattern2].md` [when to use]
- `patterns/[pattern3].md` [when to use]

## Available Skills
Reference: `skills/toolset.md` for full skill documentation.

**Primary Skills:**
- `skills/[category]/[skill1].md` - [brief description]
- `skills/[category]/[skill2].md` - [brief description]
- `skills/[category]/[skill3].md` - [brief description]

**Secondary Skills:**
- `skills/[category]/[skill4].md` - [brief description]
- `skills/[category]/[skill5].md` - [brief description]

## Example Invocations
```text
Persona: [Name]. Task: [Specific task description].
Inputs: [Required inputs]. Patterns: [patterns to use].
```
```text
Persona: [Name]. Task: [Different task description].
Inputs: [Required inputs]. Patterns: [patterns to use].
```

## Output Expectations
- [Structure expectation 1]
- [Content expectation 2]
- [Format expectation 3]
- [Always include X]

## Failure Modes to Avoid
- [Common mistake 1]
- [Common mistake 2]
- [Common mistake 3]
- [Common mistake 4]
```

## Checklist Before Submission

Before submitting your persona, verify:

- [ ] File follows naming convention: `Name-Role.md`
- [ ] File is in correct category folder (`orchestration/`, `domain/`, or `evaluation/`)
- [ ] All 11 sections are present and complete
- [ ] At least 2 example invocations included
- [ ] Patterns exist (check `Prompt-AI-Mantras/patterns/`)
- [ ] Skills exist (check `Prompt-AI-Mantras/skills/`)
- [ ] Rules don't contradict each other or guiding principles
- [ ] Style is distinctive and consistent
- [ ] Failure modes are specific to this persona's domain
- [ ] Principles are internalized (not explicitly announced)
- [ ] You've tested the persona with at least one realistic scenario

## Files to Update

After creating your persona file:

1. **Manifest** - Add entry to `ai-mantras-manifest.yaml`
2. **Toolset** - Add persona to affinity matrix in `skills/toolset.md` (if applicable)
3. **Agents** - Update persona count in `development/agents.md`

## Common Mistakes to Avoid

### 1. Copying Too Closely
Don't just copy an existing persona and change a few words. Each persona needs genuine differentiation in expertise, style, and constraints.

### 2. Overlapping Too Much
If your persona does 80% of what an existing persona does, consider extending that persona instead.

### 3. Ignoring the Workflow
Remember separation of powers: domain personas don't evaluate themselves, orchestrators don't execute, evaluators don't generate content.

### 4. Announcing Principles
**Wrong:** "As a persona guided by Wisdom, I will now think deeply..."
**Right:** Just think deeply. Principles are internalized.

### 5. Vague Rules
**Wrong:** "Be careful"
**Right:** "Always present at least two scenarios (base vs alternative) before making recommendations"

### 6. Missing Self-Correction
Every persona should have mechanisms for self-review. Include either recursive-self-eval or criterion-based-evaluation patterns.

## Examples to Study

Review these existing personas for examples of good design:

| Persona | Notable For |
|---------|-------------|
| `domain/Clara-Financial-Analyst.md` | Clear rules, quantitative expectations |
| `domain/Watson-Medical-Advisor.md` | Domain-specific constraints, safety focus |
| `evaluation/Ada-QA-Reviewer.md` | Evaluation methodology, checklist approach |
| `evaluation/Rickover-Safety-Evaluator.md` | Uncompromising standards, threat modeling |
| `orchestration/Hopper-Project-Planner.md` | Planning focus, handoff awareness |

## Using AI to Help Create Personas

AI Mantras is developed collaboratively with AI. When creating new personas:

1. **Ask AI to review existing personas** to understand patterns and gaps
2. **Draft with AI assistance** - let AI suggest domain expertise and failure modes
3. **Validate against principles** - ask AI to check principle alignment
4. **Test with realistic scenarios** - have AI role-play the persona before finalizing

See [AI Collaborative Development](ai-collaborative-development.md) for more on this workflow.

## Questions?

- Review existing personas for examples
- Check `development/agents.md` for current project context
- Open a GitHub Issue for feedback or questions
