# Help – Framework Discovery

## Purpose
Enable users and agents to discover, navigate, and understand AI Mantras framework components. Provides contextual guidance on personas, patterns, skills, principles, and workflows.

## When to Use
- Learning about available personas and their capabilities
- Understanding when to use specific patterns
- Discovering skills appropriate for a task
- Getting quick reference on framework concepts
- Onboarding new users to AI Mantras

## Inputs Required
- **Query type**: What aspect of the framework to explore
  - `personas` - List and describe available personas
  - `patterns` - List and describe available patterns
  - `skills` - List and describe available skills
  - `principles` - Explain guiding principles
  - `workflows` - Describe orchestration workflows
  - `all` - Overview of entire framework
- **Specific item** (optional): Name of specific persona, pattern, or skill for detailed info
- **Use case** (optional): Task description to get recommendations

## Outputs Produced
- Structured information about requested component(s)
- Recommendations based on use case (if provided)
- Cross-references to related components
- Quick-start guidance

## Invocation
```
[Applying help skill]
Query: {component type or specific name}
Use case: {optional task description}
Detail level: {overview|detailed}
```

## Example Usage

### List All Personas
```
[Applying help skill]
Query: personas
Detail level: overview

AI MANTRAS PERSONAS
===================

ORCHESTRATION (Plan & Coordinate)
- Bernstein-Orchestrator: Translates intent into multi-persona strategies
- Hopper-Project-Planner: Frames problems, decomposes work
- Lovell-Crisis-Planner: High-stakes, compressed timeline coordination

DOMAIN (Execute Specialized Work)
- Clara-Financial-Analyst: Risk-aware financial analysis
- Kestra-Systems-Architect: Infrastructure design and DevOps
- Watson-Medical-Advisor: Evidence-based medical guidance
- Goeth-Philosophical-Synthesizer: Ethics and meaning frameworks
- Franklin-Deep-Reasoner: Multi-domain complex reasoning

EVALUATION (Review & Approve)
- Ada-QA-Reviewer: Quality assurance and correctness
- Drucker-Goal-Satisfaction-Evaluator: Measures objective achievement
- Rickover-Safety-Evaluator: Risk and safety assessment

For details on any persona: help persona:[name]
```

### Get Specific Persona Info
```
[Applying help skill]
Query: persona:Clara-Financial-Analyst
Detail level: detailed

CLARA – FINANCIAL ANALYST
=========================

Purpose: Disciplined, risk-aware financial analysis covering valuation,
macro context, and portfolio strategy decisions.

Expertise:
- Equity valuation (DCF, comparables, factor exposure)
- Macro and sector trend interpretation
- ETF vs single-asset portfolio construction
- Risk management and hedging tactics
- Scenario and sensitivity analysis

Style: Calm, methodical, data-informed; leads with uncertainty and
quantifies trade-offs.

Primary Skills:
- financial-modeling, risk-assessment, data-analysis

Recommended Patterns:
- rule-based-reasoning, chain-of-thought, recursive-self-eval

When to Use Clara:
- Investment analysis and portfolio decisions
- Financial modeling and valuation
- Risk assessment for financial decisions
- Scenario analysis and sensitivity testing
```

### Get Recommendations for Task
```
[Applying help skill]
Query: recommend
Use case: "I need to review a pull request for security issues"

RECOMMENDATIONS FOR: Security-focused code review
=================================================

Recommended Persona: Kestra-Systems-Architect
Alternate: Rickover-Safety-Evaluator (for formal safety assessment)

Recommended Skills:
- code-review (primary) – Review for quality and security
- security-audit – Systematic vulnerability assessment
- codebase-exploration – Understand context

Recommended Patterns:
- threat-modeling – Identify security risks
- criterion-based-evaluation – Assess against security standards

Workflow Suggestion:
1. Kestra explores codebase context
2. Kestra applies code-review skill with security focus
3. Rickover applies security-audit for formal assessment
4. Ada performs final QA review

Quick Start:
"Persona: Kestra. Task: Security review of [PR].
Patterns: threat-modeling + code-review skill."
```

### List Available Skills
```
[Applying help skill]
Query: skills
Detail level: overview

AI MANTRAS SKILLS
=================

RESEARCH (Information Gathering)
- web-search: Find current information from the web
- codebase-exploration: Navigate and understand code repositories
- document-review: Analyze and extract insights from documents
- literature-review: Survey academic or technical literature

ANALYSIS (Analytical Capabilities)
- data-analysis: Analyze datasets and extract insights
- code-review: Review code for quality and improvements
- financial-modeling: Build and analyze financial models
- risk-assessment: Identify and evaluate risks
- comparative-analysis: Compare options systematically

CREATION (Content Generation)
- document-generation: Create structured documents
- code-generation: Write new code
- diagram-creation: Create visual diagrams
- plan-drafting: Create project plans
- report-writing: Write analytical reports

EVALUATION (Assessment Capabilities)
- quality-check: Verify output quality against criteria
- security-audit: Assess security vulnerabilities
- compliance-review: Check standards adherence
- fact-verification: Verify claims and assertions

ORCHESTRATION (Coordination)
- task-decomposition: Break complex tasks into subtasks
- handoff: Transfer work between personas
- summarization: Condense information
- progress-tracking: Monitor task progress
- constraint-gathering: Elicit requirements

UTILITY
- help: Framework discovery (this skill)

For skill details: help skill:[name]
```

## Quick Reference Commands

| Query | Description |
|-------|-------------|
| `help personas` | List all personas |
| `help patterns` | List all patterns |
| `help skills` | List all skills |
| `help principles` | Explain guiding principles |
| `help workflows` | Describe orchestration workflows |
| `help persona:[name]` | Details on specific persona |
| `help pattern:[name]` | Details on specific pattern |
| `help skill:[name]` | Details on specific skill |
| `help recommend` + use case | Get recommendations for a task |
| `help all` | Full framework overview |

## Key Framework Concepts

### The Four Pillars
1. **Personas** (WHO) – Specialized identities with expertise and style
2. **Patterns** (HOW) – Reusable reasoning structures
3. **Skills** (WHAT) – Actionable capabilities personas can invoke
4. **Principles** (WHY) – Guiding values (internalized, not announced)

### Separation of Powers
- **Orchestrators** plan but don't execute or evaluate
- **Domain personas** execute but don't self-evaluate
- **Evaluators** assess but don't generate content
- **Humans** retain final authority

### Complexity Tiers
- **Simple**: Single question, one persona, direct answer
- **Moderate**: Structured reasoning, 1-2 patterns, self-review
- **Complex**: Multi-persona, full orchestration workflow

## Recommended Personas
All personas can invoke the help skill for framework navigation.

## Related Skills
- `summarization` - Condense framework information
- All other skills - help provides discovery for them
