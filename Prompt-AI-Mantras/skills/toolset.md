# AI Mantras Skills Toolset

This document serves as the master index of all skills available to personas within the AI Mantras framework. Skills are capabilities that personas can invoke to accomplish specific types of work.

---

## What Are Skills?

Skills are **actionable capabilities** that complement personas and patterns:

- **Personas** define WHO does the work (identity, expertise, style)
- **Patterns** define HOW they think (reasoning structures)
- **Principles** define WHAT guides their behavior (ethics, values)
- **Skills** define WHAT they can do (tools, capabilities, actions)

During orchestration, the orchestrator selects appropriate skills for each persona based on the task requirements.

---

## Skill Categories

### Research Skills
Information gathering and discovery capabilities.

| Skill | File | Purpose |
|-------|------|---------|
| Web Search | `research/web-search.md` | Find current information from the web |
| Document Review | `research/document-review.md` | Analyze and extract insights from documents |
| Codebase Exploration | `research/codebase-exploration.md` | Navigate and understand code repositories |
| Literature Review | `research/literature-review.md` | Survey academic or technical literature |

### Analysis Skills
Analytical and reasoning capabilities.

| Skill | File | Purpose |
|-------|------|---------|
| Data Analysis | `analysis/data-analysis.md` | Analyze datasets and extract insights |
| Code Review | `analysis/code-review.md` | Review code for quality, bugs, and improvements |
| Financial Modeling | `analysis/financial-modeling.md` | Build and analyze financial models |
| Risk Assessment | `analysis/risk-assessment.md` | Identify and evaluate risks |
| Comparative Analysis | `analysis/comparative-analysis.md` | Compare options systematically |
| **Sharpe Ratio Calculation** | `analysis/sharpe-ratio-calculation.md` | Calculate risk-adjusted returns for securities |
| **Drawdown Analysis** | `analysis/drawdown-analysis.md` | Analyze peak-to-trough declines and recovery patterns |
| **Portfolio Analysis** | `analysis/portfolio-analysis.md` | Comprehensive portfolio evaluation and monitoring |

### Creation Skills
Content and artifact creation capabilities.

| Skill | File | Purpose |
|-------|------|---------|
| Document Generation | `creation/document-generation.md` | Create structured documents |
| Code Generation | `creation/code-generation.md` | Write new code |
| Diagram Creation | `creation/diagram-creation.md` | Create visual diagrams and flowcharts |
| Plan Drafting | `creation/plan-drafting.md` | Create project plans and roadmaps |
| Report Writing | `creation/report-writing.md` | Write analytical reports |

### Evaluation Skills
Review, assessment, and quality assurance capabilities.

| Skill | File | Purpose |
|-------|------|---------|
| Quality Check | `evaluation/quality-check.md` | Verify output quality against criteria |
| Security Audit | `evaluation/security-audit.md` | Assess security posture and vulnerabilities |
| Compliance Review | `evaluation/compliance-review.md` | Check adherence to standards/regulations |
| Fact Verification | `evaluation/fact-verification.md` | Verify claims and assertions |

### Orchestration Skills
Workflow coordination and communication capabilities.

| Skill | File | Purpose |
|-------|------|---------|
| Task Decomposition | `orchestration/task-decomposition.md` | Break complex tasks into subtasks |
| Handoff | `orchestration/handoff.md` | Transfer work between personas |
| Summarization | `orchestration/summarization.md` | Condense information for handoffs |
| Progress Tracking | `orchestration/progress-tracking.md` | Monitor and report task progress |
| Constraint Gathering | `orchestration/constraint-gathering.md` | Elicit requirements and constraints |

### Utility Skills
Framework navigation and meta-capabilities.

| Skill | File | Purpose |
|-------|------|---------|
| Help | `utility/help.md` | Discover and learn about framework components |

---

## Skill File Template

Each skill follows this structure:

```markdown
# [Skill Name]

## Purpose
Why this skill exists and what it accomplishes.

## When to Use
Scenarios where this skill is appropriate.

## Inputs Required
What information or context the skill needs.

## Outputs Produced
What the skill delivers.

## Invocation
How personas reference and use this skill.

## Constraints
Limitations and boundaries of this skill.

## Example Usage
Concrete examples of the skill in action.

## Recommended Personas
Which personas commonly use this skill.

## Related Skills
Other skills that complement this one.
```

---

## How Personas Use Skills

### During Planning Phase
The orchestrator (Bernstein/Hopper) reviews the task and selects skills:

```
For this infrastructure audit task:
- Kestra will use: codebase-exploration, security-audit, risk-assessment
- Patterns: threat-modeling, chain-of-thought
- Deliverable: Security assessment report
```

### During Execution Phase
Domain personas invoke skills as needed:

```
[Kestra applying security-audit skill]
Following security-audit.md protocol:
1. Identify attack surface...
2. Enumerate vulnerabilities...
3. Assess impact and likelihood...
```

### During Evaluation Phase
Evaluators use evaluation skills:

```
[Ada applying quality-check skill]
Reviewing against success criteria using quality-check.md:
- Criterion 1: Coverage - PASS
- Criterion 2: Accuracy - NEEDS REVISION
```

---

## Adding New Skills

1. Identify the capability gap
2. Determine the appropriate category
3. Create the skill file using the template
4. Add to this toolset index
5. Update `ai-mantras-manifest.yaml`
6. Consider which personas should reference it

---

## Skill-Persona Affinity Matrix

| Persona | Primary Skills | Secondary Skills |
|---------|---------------|------------------|
| **Domain Personas** | | |
| Clara (Finance) | financial-modeling, risk-assessment, data-analysis, sharpe-ratio-calculation, drawdown-analysis | comparative-analysis, report-writing, portfolio-analysis |
| Kestra (Systems) | codebase-exploration, security-audit, code-review | diagram-creation, risk-assessment |
| Watson (Medical) | literature-review, fact-verification, risk-assessment | document-review, report-writing |
| Goeth (Philosophy) | comparative-analysis, document-review | summarization, report-writing |
| Franklin (Reasoning) | comparative-analysis, risk-assessment, data-analysis | literature-review, fact-verification |
| **Quantitative Trading Personas** | | |
| Simons (Quant Researcher) | data-analysis, code-generation, risk-assessment, sharpe-ratio-calculation, comparative-analysis | report-writing, literature-review, quality-check, drawdown-analysis |
| Markowitz (Portfolio Manager) | risk-assessment, comparative-analysis, financial-modeling, portfolio-analysis | data-analysis, report-writing, handoff, quality-check |
| Taleb (Risk Manager) | risk-assessment, drawdown-analysis, data-analysis, comparative-analysis | security-audit, report-writing, compliance-review, handoff, portfolio-analysis |
| Thorp (Execution Trader) | data-analysis, risk-assessment, comparative-analysis | report-writing, web-search, handoff, quality-check |
| Nightingale (Data Engineer) | data-analysis, code-generation, web-search, risk-assessment | document-generation, quality-check, handoff, diagram-creation |
| Schapiro (Compliance Officer) | compliance-review, security-audit, risk-assessment, fact-verification | document-generation, report-writing, handoff, literature-review |
| **Evaluation Personas** | | |
| Ada (QA) | quality-check, fact-verification | code-review, compliance-review |
| Drucker (Goals) | quality-check, progress-tracking | comparative-analysis |
| Rickover (Safety) | security-audit, risk-assessment, compliance-review | fact-verification |
| **Orchestration Personas** | | |
| Bernstein (Orchestrator) | task-decomposition, handoff, constraint-gathering | progress-tracking, summarization |
| Hopper (Planner) | task-decomposition, plan-drafting, constraint-gathering | risk-assessment |
| Matsushita (CEO) | plan-drafting, risk-assessment, comparative-analysis | constraint-gathering, report-writing, progress-tracking |
| Schneier (Blue Team) | security-audit, risk-assessment, code-review | compliance-review, codebase-exploration, report-writing |
| Mitnick (Red Team) | security-audit, code-review, risk-assessment | codebase-exploration, fact-verification, report-writing |
| Morris (Black Hat) | security-audit, risk-assessment, code-review | codebase-exploration, fact-verification, report-writing |
| Pennyworth (Assistant) | progress-tracking, task-decomposition, constraint-gathering | plan-drafting, summarization, comparative-analysis |
| LeHand (Assistant) | progress-tracking, summarization, task-decomposition | plan-drafting, constraint-gathering, document-review |
| Lovell (Crisis) | task-decomposition, risk-assessment, progress-tracking | handoff, constraint-gathering |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-09 | Initial skills framework |
