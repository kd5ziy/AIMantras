# Project Plan for Personas & Patterns Prompt Wiki

This document is the **comprehensive strategic and operational plan** for building a structured, reusable, agent-friendly **Prompt Wiki**. It contains:

* Folder layout
* Standards for file creation
* Build sequencing
* Persona and pattern architecture
* Quality assurance strategy
* CLI/agent compatibility plan
* Future extensibility roadmap

This file serves as the **root planning artifact** for the entire project.

---

# 1. Project Purpose

The goal of this repository is to create a scalable system of:

* **Personas** (specialized roles)
* **Prompt Patterns** (thinking structures)
* **Orchestration Flows** (planner → worker(s) → QA)
* **Project Recipes** (applied examples for MarketSeer, homelab, DevOps, etc.)

This system aims to:

* Standardize and optimize all interactions with AI (LLMs, CLI agents, orchestrated assistants)
* Provide reproducible prompt modules
* Allow multi-agent orchestration
* Enable consistent high-quality outputs
* Serve as a long-term knowledge and capability amplifier

The structure is intentionally similar to:

* design systems
* software architecture libraries
* DevOps pipelines

This ensures clarity, modularity, and ease of automation.

---

# 2. Target Folder Structure

```
Prompt-AI-Mantras/
│
├── README.md
│
├── personas/
│   ├── clara.md
│   ├── kestra.md
│   ├── goeth.md
│   ├── pm.md
│   ├── qa-reviewer.md
│   └── one.md
│
├── patterns/
│   ├── chain-of-thought.md
│   ├── rule-based-reasoning.md
│   ├── guardrail-creative.md
│   ├── recursive-self-eval.md
│   ├── orchestration.md
│   ├── planning-phase.md
│   └── meta-rules.md
│
└── projects/
    ├── marketseer/
    ├── homelab/
    └── devops/
```

This structure is:

* easy for agents to traverse
* modular for long-term scaling
* predictable for scripting
* compatible with future static site generation (MkDocs)

---

# 3. File Standards & Conventions

## 3.1 Persona File Template

Every persona file will include:

```
# [Persona Name]

## Purpose
Why this persona exists.

## Domain Expertise
List of knowledge areas.

## Style & Tone
Voice, attitudes, demeanor.

## Rules & Constraints
Explicit rules that constrain behavior.

## Recommended Patterns
Which prompt patterns pair best with this persona.

## Example Invocations
Copy/paste examples for CLI or agents.

## Output Expectations
Formatting, structure, consistency requirements.

## Failure Modes to Avoid
Common pitfalls and behaviors to avoid.
```

---

## 3.2 Pattern File Template

```
# [Pattern Name]

## Purpose
Why this pattern exists.

## When to Use
Ideal use cases.

## Structure / Template
The copy/paste pattern.

## Examples
One technical, one creative.

## Combination Guidance
Which personas and patterns work well with it.

## Failure Modes
What to avoid.
```

---

# 4. Build Sequencing

The repository will be constructed in **layers** for clarity, reusability, and dependency correctness.

---

## Layer 1 — Foundational Patterns (Build First)

These patterns define how all other personas think and interact.

1. **patterns/planning-phase.md**
2. **patterns/orchestration.md**
3. **patterns/recursive-self-eval.md**
4. **patterns/meta-rules.md**

### Why these first?

* They define the core architecture of the entire system
* Personas rely on them for structure
* They enable agent orchestration

---

## Layer 2 — Thinking Primitives (Build Second)

These are the fundamental reasoning mechanisms.

5. **patterns/chain-of-thought.md**
6. **patterns/rule-based-reasoning.md**
7. **patterns/guardrail-creative.md**

These will be referenced heavily by all personas.

---

## Layer 3 — Core Personas (Build Third)

Start with the control-plane personas:

8. **personas/pm.md** – Planner & Decomposer
9. **personas/qa-reviewer.md** – Critical Scrutinizer

These are essential for orchestrated workflows.

Next, domain personas:

10. **personas/kestra.md** – Infra Architect
11. **personas/clara.md** – MarketSeer Analyst
12. **personas/goeth.md** – Philosopher
13. **personas/one.md** – Deep General Reasoner

---

## Layer 4 — Project-Specific Recipes (Build Last)

In `projects/` create domain applications of personas + patterns:

* MarketSeer prompt recipes
* Homelab orchestration examples
* DevOps planning templates
* Task lists, architectures, upgrade guides

These will evolve continuously.

---

# 5. Orchestration Workflow Strategy

The default pipeline for any complex task is:

## Step 1 — Planning Phase

Handled by the **PM Persona** using `planning-phase.md`.

* Define the problem
* Identify constraints
* Choose appropriate patterns
* Select personas to involve
* Define success criteria and output format

## Step 2 — Execution Phase

Handled by **worker personas**, e.g.:

* Clara → financial analysis
* Kestra → architecture
* Goeth → philosophy / meaning
* One → deep reasoning

Use appropriate patterns:

* chain-of-thought
* rule-based reasoning
* guardrails

## Step 3 — QA Phase

Handled by **QA Reviewer Persona** using:

* recursive self-evaluation
* rule alignment checks
* output clarity checks

QA outputs:

* issues list
* suggested improvements
* optional "approved final version"

This ensures predictable quality and eliminates LLM drift.

---

# 6. CLI & Agent Compatibility Strategy

To support CLI-based agents:

* Every file uses deterministic headings
* No chain-of-thought or reasoning leakage inside definitions
* Persona and pattern files are atomic (one concept each)
* Example invocations provided for each persona/pattern
* Format avoids overly poetic or ambiguous descriptors
* All rules and structures are machine-parsable
* Updates should default to additive changes, not destructive edits

Agents should:

* load personas into memory
* load patterns into memory
* orchestrate prompts using the framework
* follow the PM → Worker → QA pipeline
* preserve original formatting when editing files

---

# 7. Documentation & Repo Hygiene Strategy

## A consistent writing style across all files:

* Clear, instructional
* No rambling or narrative fluff
* All sections labeled
* Each persona/pattern fits on one screen if possible

## Versioning

* Use semantic version tags for major changes
* Avoid overwriting persona behavior radically without version notes

## README.md

Should explain:

* Purpose of repo
* How to use personas
* How to use patterns
* Suggested workflows
* How agents can integrate

---

# 8. Extensibility Strategy

The system is designed to scale indefinitely. Future additions may include:

### New Personas

* Documentation Writer
* Code Reviewer
* Tutor/Educator
* Security Auditor
* AI Research Explainer

### New Patterns

* Decision matrices
* Diagnostic trees
* Comparison tables
* Troubleshooting flows

### New Project Areas

* More MarketSeer components
* Solar/hardware projects
* Multi-cloud orchestrations
* Long-form reasoning templates

### Static Site Generation

Eventually, use MkDocs + Material to:

* turn the wiki into a browsable website
* auto-generate navigation and search
* publish via GitHub Pages

---

# 9. Next Steps

The next operational step is:

> Begin **Layer 1**: Foundational Patterns (planning-phase, orchestration, recursive-self-eval, meta-rules)

Once the foundational patterns are created, personas can reference them cleanly.

After that, we proceed persona-by-persona through Layer 3.

---

This project plan governs the entire development of your Personas & Patterns Prompt Wiki. Future revisions should be made collaboratively and reviewed using the QA Persona.
