# AI Mantras Project Plan

This document is the **comprehensive strategic and operational plan** for AI Mantras. It contains:

* Project goals and vision
* System architecture
* Folder layout and file standards
* Build sequencing
* Workflow and governance
* CLI/agent/MCP compatibility
* Extensibility and commercial roadmap

---

# 1. Project Goals

## Goal 1 — Vision & Capability

Create a powerful, multi-agent cognitive framework built on:

* **Personas** (WHO) - Specialized identities with expertise, style, and constraints
* **Patterns** (HOW) - Reusable reasoning structures and thinking templates
* **Principles** (WHY) - Guiding values that shape behavior
* **Skills** (WHAT) - Actionable capabilities personas can invoke
* Symbiotic human-AI collaboration

## Goal 2 — Sustainability & IP

Ensure the system can be:

* Monetizable
* Protectable (architecture/process patenting)
* Extensible into commercial products
* Supported long-term as a proprietary core

## Goal 3 — Human-AI Symbiosis

Build AI Mantras so humans are structurally integrated into the workflow:

* Human plan approval
* Human input on rubrics/criteria
* Human review of evaluator decisions
* Human authority on high-stakes domains
* Human-guided moral, emotional, and creative direction

Humans remain essential, not optional.

---

# 2. System Architecture

## 2.1 The Four Pillars

| Pillar | Question | Purpose |
|--------|----------|---------|
| Personas | WHO | Specialized identities with expertise, style, and constraints |
| Patterns | HOW | Reusable reasoning structures and thinking templates |
| Principles | WHY | Guiding values that shape behavior |
| Skills | WHAT | Actionable capabilities personas can invoke |

## 2.2 Persona Categories

### Orchestration Personas (Executive Function)
* **Bernstein** — Orchestrator (coordinates multi-persona workflows)
* **Hopper** — Project Planner (frames problems, decomposes work)
* **Lovell** — Crisis Planner (high-stakes, time-sensitive planning)
* Future: Director, Mediator, Overseer

### Domain Personas (Subject-Matter Experts)
* **Clara** — Financial Analyst
* **Kestra** — Systems Architect
* **Goeth** — Philosophical Synthesizer
* **Franklin** — Deep Reasoner
* **Watson** — Medical Advisor
* Future: Judge, Lawyer, Scholar, Mathematician, Politician, CEO

### Evaluation Personas (Supervisory / Governance)
* **Ada** — QA Reviewer (micro-quality)
* **Drucker** — Goal-Satisfaction Evaluator
* **Rickover** — Safety Evaluator
* Future: Clarity Evaluator, Efficiency Evaluator, Evaluator-Orchestrator

## 2.3 Pattern Layers

* **Layer 1 (Foundational):** planning-phase, orchestration, recursive-self-eval, meta-rules
* **Layer 2 (Thinking Primitives):** chain-of-thought, rule-based-reasoning, guardrail-creative
* **Layer 3 (Evaluation):** criterion-based-evaluation, threat-modeling

## 2.4 Skill Categories

* **Research:** web-search, codebase-exploration, document-review, literature-review
* **Analysis:** data-analysis, code-review, financial-modeling, risk-assessment, comparative-analysis
* **Creation:** document-generation, code-generation, diagram-creation, plan-drafting, report-writing
* **Evaluation:** quality-check, security-audit, compliance-review, fact-verification
* **Orchestration:** task-decomposition, handoff, summarization, progress-tracking, constraint-gathering
* **Utility:** help

---

# 3. Folder Structure

```
ai-personas-and-patterns/
│
├── README.md                    # Main readme with Four Pillars
├── about.md                     # Quick reference overview
├── HowToUse.md                  # Setup guide (MCP, Claude command, manual)
├── AIMantra.md                  # Entry point - triage and routing
├── Agent-bootstrapper.md        # Operational manual for AI agents
├── ai-mantras-manifest.yaml     # Structured index for agents
│
├── development/                 # Development & planning docs
│   ├── agents.md                # Development quickstart
│   ├── project-plan.md          # This file
│   └── persona-backlog.md       # Future persona roadmap
│
├── Prompt-AI-Mantras/           # Framework content
│   ├── personas/                # WHO - 11 specialized personas
│   │   ├── orchestration/       # Bernstein, Hopper, Lovell
│   │   ├── domain/              # Clara, Kestra, Watson, Goeth, Franklin
│   │   └── evaluation/          # Ada, Drucker, Rickover
│   │
│   ├── patterns/                # HOW - 11 reasoning patterns
│   │   ├── (Layer 1)            # planning-phase, orchestration, recursive-self-eval, meta-rules
│   │   ├── (Layer 2)            # chain-of-thought, rule-based-reasoning, guardrail-creative
│   │   └── (Layer 3)            # criterion-based-evaluation, threat-modeling
│   │
│   ├── principles/              # WHY - Guiding values
│   │   └── guiding-principles.md
│   │
│   ├── skills/                  # WHAT - 25 actionable capabilities
│   │   ├── toolset.md           # Master index
│   │   ├── research/
│   │   ├── analysis/
│   │   ├── creation/
│   │   ├── evaluation/
│   │   ├── orchestration/
│   │   └── utility/
│   │
│   └── projects/                # Applied recipes (per domain)
│
├── ai-mantras-mcp/              # MCP server implementation
│   ├── src/                     # TypeScript source
│   └── content/                 # Bundled framework content
│
└── website/                     # Documentation website (aimantras.org)
    ├── src/
    │   ├── content/docs/        # MDX documentation pages
    │   ├── components/          # Astro components
    │   ├── pages/               # Custom pages (landing)
    │   └── styles/              # Custom CSS
    ├── Dockerfile               # Multi-stage Docker build
    ├── docker-compose.yml       # Container orchestration
    └── DOCKER-DEPLOY.md         # Deployment guide
```

---

# 4. File Standards

## 4.1 Persona File Template

```markdown
# [Persona Name]

## Purpose
Why this persona exists.

## Domain Expertise
List of knowledge areas.

## Style & Tone
Voice, attitudes, demeanor.

## Rules & Constraints
Explicit rules that constrain behavior.

## Available Skills
Primary and secondary skills from the toolset.

## Recommended Patterns
Which prompt patterns pair best with this persona.

## Example Invocations
Copy/paste examples for CLI or agents.

## Output Expectations
Formatting, structure, consistency requirements.

## Failure Modes to Avoid
Common pitfalls and behaviors to avoid.
```

## 4.2 Pattern File Template

```markdown
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

## 4.3 Skill File Template

```markdown
# [Skill Name]

## Purpose
What capability this skill provides.

## When to Use
Scenarios where this skill applies.

## Inputs
What information is needed.

## Process
Step-by-step execution.

## Outputs
What the skill produces.

## Quality Criteria
How to verify successful execution.
```

---

# 5. Build Sequencing

## Layer 1 — Foundational Patterns (Build First)

These patterns define how all other personas think and interact.

1. `planning-phase.md`
2. `orchestration.md`
3. `recursive-self-eval.md`
4. `meta-rules.md`

## Layer 2 — Thinking Primitives (Build Second)

Fundamental reasoning mechanisms referenced by all personas.

5. `chain-of-thought.md`
6. `rule-based-reasoning.md`
7. `guardrail-creative.md`

## Layer 3 — Core Personas (Build Third)

Control-plane personas first:
8. PM/Planner persona
9. QA Reviewer persona

Then domain personas, then evaluation personas.

## Layer 4 — Project Recipes (Build Last)

Domain applications in `projects/`:
* Finance prompt recipes
* Homelab orchestration examples
* DevOps planning templates

---

# 6. Workflow & Governance

## 6.1 Two-Phase Evaluation Cycle

### Phase 1 — Plan → Evaluate → Approve

1. Work-Orchestrator (Bernstein + Hopper) drafts:
   * Goal & constraints
   * Workflow (personas + patterns)
   * Success criteria

2. Evaluation-Orchestrator + Evaluator Team:
   * Assess plan
   * Approve or request revisions

No work proceeds without approval.

### Phase 2 — Execute → QA → Evaluate

1. Domain Personas produce the work.
2. Ada performs QA.
3. Evaluation-Orchestrator + Evaluators:
   * Score the work using success criteria
   * Approve or request refinement

**Human approval** bookends both major phases.

## 6.2 Separation of Powers

To ensure safety, quality, and clarity:

* Domain personas **never** evaluate their own output
* Orchestrators **do not** score their own plans
* Evaluators **do not** generate content
* Humans remain the ultimate approving authority

This is core to AI Mantras governance philosophy.

## 6.3 Default Pipeline

1. **Planning Phase** — PM Persona using `planning-phase.md`
   * Define the problem
   * Identify constraints
   * Choose patterns and personas
   * Define success criteria

2. **Execution Phase** — Worker personas with appropriate patterns
   * chain-of-thought
   * rule-based reasoning
   * guardrails

3. **QA Phase** — QA Reviewer using:
   * recursive self-evaluation
   * rule alignment checks
   * output clarity checks

---

# 7. Memory & Context Architecture

AI Mantras supports **separate contexts per persona**:

* Separate message histories
* Separate persona specs
* Persona-specific RAG indexes
* Persona-specific evaluation logs

Implementation options:
* One LLM endpoint (logical separation)
* Separate LLM sessions per persona
* Multiple local model instances (physical separation)

Benefits:
* Prevents cross-contamination
* Makes reasoning more reliable
* Enables persona specialization over time

## RAG Architecture Progression

1. **Stage 1 — Local RAG** (FAISS or ChromaDB): Per-persona indexes
2. **Stage 2 — Shared Orchestrator Index**: Workflows, patterns, persona files
3. **Stage 3 — Evaluation RAG**: Scores, rubrics, workflow histories
4. **Stage 4 — Graph RAG** (Advanced): Full knowledge graph linking personas, workflows, tasks, performance history

---

# 8. Integration Methods

## 8.1 MCP Server (Recommended)

The MCP server exposes AI Mantras as callable tools:

**Core Tools:**
| Tool | Description |
|------|-------------|
| `bootstrap_session` | Initialize session with appropriate resources |
| `assess_complexity` | Triage into Simple/Moderate/Complex |
| `get_persona` | Load persona by name or domain |
| `get_pattern` | Load pattern by name |
| `get_skill` | Load skill by name, task, or category |
| `get_workflow` | Get workflow for complexity tier |
| `create_handoff` | Generate handoff template |
| `list_available` | List all resources |

**Multi-Agent Tools (v1.3.0):**
| Tool | Description |
|------|-------------|
| `spawn_agent` | Spawn isolated agent with persona (Anthropic/OpenAI) |
| `get_agent_result` | Retrieve status and result from spawned agent |
| `list_agents` | List all spawned agents with status filtering |

**Resources:**
* `mantras://principles` — Guiding principles
* `mantras://bootstrapper` — Agent bootstrapper
* `mantras://toolset` — Skills master index
* `mantras://persona/{category}/{name}` — Individual personas
* `mantras://pattern/{layer}/{name}` — Individual patterns
* `mantras://skill/{category}/{name}` — Individual skills

## 8.2 Claude Command

Copy `AIMantra.md` to `~/.claude/commands/Mantras.md` for `/Mantras` command.

## 8.3 Manual Loading

For any AI system, load files in order:
1. `Agent-bootstrapper.md`
2. `guiding-principles.md`
3. Required personas and patterns

---

# 9. CLI & Agent Compatibility

To support CLI-based agents:

* Every file uses deterministic headings
* No reasoning leakage inside definitions
* Persona and pattern files are atomic (one concept each)
* Example invocations provided
* All rules and structures are machine-parsable
* Updates default to additive changes

Agents should:
* Load personas into memory
* Load patterns into memory
* Orchestrate prompts using the framework
* Follow the PM → Worker → QA pipeline
* Preserve original formatting when editing files

---

# 10. Extensibility & Future

## New Personas (Backlog)

* **Domain:** Judge, Lawyer, Scholar, Mathematician, Politician, CEO
* **Orchestration:** Director, Mediator, Overseer
* **Evaluation:** Clarity Evaluator, Efficiency Evaluator, Evaluator-Orchestrator

## New Patterns

* Decision matrices
* Diagnostic trees
* Comparison tables
* Troubleshooting flows

## Website & Documentation (Completed 2026-02-15)

**Live at:** https://aimantras.org

Built with Astro + Starlight documentation theme:
* Modern, fast static site
* Built-in search (Pagefind)
* Auto-generated navigation from content structure
* Dark/light theme support

**Deployment Infrastructure:**
* Docker container (nginx:alpine) for self-hosting
* Cloudflare Tunnel for secure public access
* Hosted on local LXC container
* CI/CD ready (can also deploy via GitHub Pages)

**Key Files:**
* `website/` — Astro Starlight source
* `website/Dockerfile` — Multi-stage build
* `website/docker-compose.yml` — Container orchestration
* `website/DOCKER-DEPLOY.md` — Deployment guide

## Multi-Agent Architecture

**Phase 1 Complete:** MCP server now supports spawning isolated agents via `spawn_agent` tool.
- Each agent runs in complete context isolation
- Multi-provider support (Anthropic Claude, OpenAI GPT)
- Sync and async execution modes
- See `development/multi-agent-architecture.md` for full design

**Phase 2 Planned:** Dedicated orchestration service with queue-based agent communication.

---

# 11. Commercial & IP Strategy

## Patentable Elements

* Multi-branch agent system with work, orchestration, evaluation, and human branches
* Two-phase "Plan Approval → Execution Approval" workflow
* Persona separation with enforced role boundaries
* Evaluator-Orchestrator coordinating evaluator teams
* Systematic generation of success criteria and rubrics
* Per-persona context + memory + RAG stores
* Workflow optimization using evaluator scoring history
* Persona training pipeline (spec → drills → synthetic training → agent instance)

## Startup Support Path

**Microsoft Founders Hub** (first application):
* No LLC required
* No MVP or revenue required
* Offers Azure credits
* Free GitHub Copilot
* AI-first project support

Plan:
1. Prepare application package
2. Submit to Microsoft Founders Hub
3. Build prototype using credits
4. Form LLC afterward for larger programs (Google, AWS, NVIDIA, AMD)

---

# 12. Next Steps

## Completed (as of 2026-02-15)
- [x] Merge MCP skills branch to master (v1.1.0)
- [x] Implement multi-agent architecture - MCP tools (v1.3.0)
  - `spawn_agent`, `get_agent_result`, `list_agents` tools
  - Multi-provider support (Anthropic Claude + OpenAI GPT)
  - Context isolation via prompt builder
  - `MANTRAS_MULTI_AGENT_ENABLED` toggle for single vs multi-agent mode
  - 59 unit tests (15 content + 20 tools + 24 multi-agent)
- [x] Merge feature/bootstrap-session-tool branch to master
- [x] Update documentation (README, HowToUse, MCP README)
- [x] Build documentation website with Astro Starlight
  - Landing page with Four Pillars overview
  - Full documentation for personas, patterns, skills, principles
  - Getting started guides (MCP, Claude Command, Manual)
- [x] Deploy website infrastructure
  - Docker container with nginx
  - Cloudflare Tunnel for public access
  - Live at https://aimantras.org

## Immediate
- [ ] Test multi-agent tools with live API keys
- [ ] Publish MCP server to npm (`@ai-mantras/mcp-server`)
- [ ] Continue persona voice differentiation
- [ ] Create remaining placeholder skill files
- [ ] Merge feature/website branch to master

## Short-term
- [ ] Build orchestrator component (Bernstein as real service)
- [ ] Build evaluation persona workflows and rubrics
- [ ] Populate `projects/` with applied examples
- [ ] Add remaining evaluation personas (Clarity, Efficiency, Evaluator-Orchestrator)
- [ ] Set up GitHub Actions for website auto-deploy on push

## Long-term
- [ ] Draft Microsoft Founders Hub application
- [ ] Explore patent outline
- [ ] Design Human Governance Layer
- [ ] Establish persona memories and RAG indexes
- [ ] Framework integrations (LangGraph, CrewAI, Anthropic Agent SDK)

---

This project plan governs the entire development of AI Mantras. Future revisions should be made collaboratively and reviewed using the QA Persona.
