# AI Mantras – Agents Quickstart

This file captures the current coordination context so any new AI agent can resume work quickly.

## Claude Code Session

**Session Name:** `AIMantrasDev`

To resume development:
```bash
claude --resume AIMantrasDev
```

## Repository
- Path: `/mnt/d/development/ai-personas-and-patterns`
- Project Name: **AI Mantras** (formerly Personas & Patterns Prompt Wiki)
- Primary references: `development/` folder for planning docs, `Prompt-AI-Mantras/` for framework content
- Entry point: `AIMantra.md` (triage and routing)
- Setup guide: `HowToUse.md`

## Architecture Map

```
ai-personas-and-patterns/
│
├─── Root Files (User-Facing)
│    ├── README.md              ← Project overview, Four Pillars
│    ├── HowToUse.md            ← Setup instructions
│    ├── AIMantra.md            ← Entry point for triage
│    ├── Agent-bootstrapper.md  ← Runtime manual for AI
│    └── ai-mantras-manifest.yaml ← Structured index
│
├─── Prompt-AI-Mantras/         ← FRAMEWORK CONTENT (Source of Truth)
│    ├── personas/              ← WHO (11 personas)
│    │   ├── orchestration/     │
│    │   ├── domain/            ├── Adding personas? Update manifest
│    │   └── evaluation/        │
│    │
│    ├── patterns/              ← HOW (9 patterns)
│    │   └── *.md               │
│    │
│    ├── principles/            ← WHY (guiding values)
│    │   └── guiding-principles.md
│    │
│    └── skills/                ← WHAT (24 skills)
│        ├── toolset.md         ← Master index
│        ├── research/          │
│        ├── analysis/          │
│        ├── creation/          ├── Adding skills? Update:
│        ├── evaluation/        │   1. toolset.md
│        ├── orchestration/     │   2. manifest
│        └── utility/           │   3. MCP server (see below)
│
├─── ai-mantras-mcp/            ← MCP SERVER (Must sync with framework)
│    ├── src/
│    │   ├── tools/             ← get_persona, get_pattern, get_skill, etc.
│    │   ├── resources/         ← mantras:// URI handlers
│    │   └── utils/
│    │       └── content-loader.ts ← Loads from manifest
│    ├── content/               ← Bundled copy (built from Prompt-AI-Mantras/)
│    └── package.json           ← Version: 1.3.0
│
├─── developer-docs/            ← CONTRIBUTOR GUIDES
│    ├── README.md              ← Documentation index
│    ├── creating-personas.md   ← How to create personas
│    ├── creating-patterns.md   ← How to create patterns
│    ├── creating-skills.md     ← How to create skills
│    ├── ai-collaborative-development.md ← Development philosophy
│    ├── extending-mcp-server.md ← MCP technical guide
│    └── testing-guide.md       ← Validation guide
│
└─── development/               ← DEVELOPMENT DOCS
     ├── agents.md              ← This file
     ├── project-plan.md        ← Architecture & strategy
     └── persona-backlog.md     ← Future personas
```

### Component Dependencies

| When you add... | You must also update... |
|-----------------|-------------------------|
| New Persona | `ai-mantras-manifest.yaml`, persona's skills reference |
| New Pattern | `ai-mantras-manifest.yaml` |
| New Skill | `toolset.md`, `ai-mantras-manifest.yaml`, **MCP server** (`content-loader.ts`, `get-skill.ts`, tests) |
| New Pillar/Category | `ai-mantras-manifest.yaml`, `README.md`, `project-plan.md`, **MCP server** (new tool + resources) |

### MCP Server Sync Checklist

When modifying framework content that affects MCP:

1. **Add to manifest** - `ai-mantras-manifest.yaml` is the source of truth
2. **Update content-loader.ts** - Add interfaces and loading functions
3. **Create/update tool** - `src/tools/get-*.ts` for new resource types
4. **Register in index** - `src/tools/index.ts` and `src/resources/index.ts`
5. **Update list-available** - Include new items in listings
6. **Add tests** - `test-tools.js` and/or `test-content.js`
7. **Update README** - `ai-mantras-mcp/README.md` with new tools/resources
8. **Bump version** - `package.json` (minor for features, patch for fixes)
9. **Build & test** - `npm run build && npm test`

## Latest State

### Multi-Agent Architecture (NEW - 2025-01-16) ✅
- **Operating Modes:**
  - Single-agent mode (default): All personas run on one AI model
  - Multi-agent mode (`MANTRAS_MULTI_AGENT_ENABLED=true`): Each persona spawns as isolated agent
- **spawn_agent tool:** Spawn isolated agents with persona, Anthropic/OpenAI support, sync/async modes
- **get_agent_result tool:** Retrieve status and results from spawned agents
- **list_agents tool:** List all agents with status filtering and usage stats
- **Supporting infrastructure:**
  - `types/agent.ts` - Type definitions for agents
  - `utils/config.ts` - Environment-based configuration (API keys, toggle, limits)
  - `utils/agent-store.ts` - In-memory agent storage with cleanup
  - `utils/llm-client.ts` - Multi-provider LLM client (Anthropic + OpenAI)
  - `utils/prompt-builder.ts` - Context-isolated prompt construction
- **Tests:** 24 tests for multi-agent tools (59 total tests)
- **Documentation:** README, HowToUse updated with multi-agent setup and environment variables

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

### Skills Complete (NEW - 2025-01-09)
- **Research:** web-search, codebase-exploration, document-review, literature-review
- **Analysis:** data-analysis, code-review, financial-modeling, risk-assessment, comparative-analysis
- **Creation:** document-generation, code-generation, diagram-creation, plan-drafting, report-writing
- **Evaluation:** quality-check, security-audit, compliance-review, fact-verification
- **Orchestration:** task-decomposition, handoff, summarization, progress-tracking, constraint-gathering
- **Utility:** help
- **Index:** `Prompt-AI-Mantras/skills/toolset.md`
- **Location:** `Prompt-AI-Mantras/skills/`

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

### Phase 2: Multi-Agent Architecture (IN PROGRESS - 2025-01-16)
1. **MCP Multi-Agent Tools:** ✅ COMPLETE
   - ✅ `spawn_agent` - Spawn isolated agents with persona
   - ✅ `get_agent_result` - Retrieve agent results
   - ✅ `list_agents` - List and monitor agents
   - ✅ Multi-provider support (Anthropic + OpenAI)
   - ✅ Async/sync execution modes
   - ✅ Context isolation via prompt builder
   - ✅ 22 unit tests
2. **Evaluation Personas:**
   - ✅ Drucker (Goal-Satisfaction Evaluator) - COMPLETE
   - ✅ Rickover (Safety Evaluator) - COMPLETE
   - ⏳ Clarity Evaluator - PENDING
   - ⏳ Efficiency Evaluator - PENDING
   - ⏳ Evaluator-Orchestrator - PENDING
3. **Domain Personas (Backlog):**
   - ✅ Watson (Doctor/Medical Advisor) - COMPLETE
   - Judge, Lawyer, Scholar, Mathematician, Politician, CEO (see `persona-backlog.md`)
4. **Orchestration Personas (Backlog):** Director, Mediator, Overseer

### Phase 3: Production & Commercial (Future)
1. **Multi-Agent Orchestrator:** Build dedicated orchestration service with queue support
2. **Projects:** Populate `projects/` with applied orchestration examples
3. **Commercial Path:** Microsoft Founders Hub application, patent strategy
4. **Framework Integrations:** LangGraph, CrewAI, Anthropic Agent SDK

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

### Session 2025-01-16: Multi-Agent Architecture Implementation
**Accomplishments:**
- **Implemented MCP Multi-Agent Tools** (branch: `feature/bootstrap-session-tool`)
  - `spawn_agent` - Spawns isolated agents with specific personas
    - Supports Anthropic (Claude) and OpenAI (GPT) providers
    - Sync mode (wait for result) and async mode (return immediately)
    - Context isolation: agents only see persona, task, and inputs
    - Configurable model, timeout, max_tokens
  - `get_agent_result` - Retrieves status and results from spawned agents
    - Shows status (pending/running/completed/failed/timeout)
    - Displays result content, token usage, duration
  - `list_agents` - Lists all spawned agents with filtering
    - Filter by status, shows usage statistics
    - Table display with status icons
- **Created Supporting Infrastructure:**
  - `types/agent.ts` - Type definitions (SpawnedAgent, AgentStatus, etc.)
  - `utils/config.ts` - Environment config (API keys, defaults, limits)
  - `utils/agent-store.ts` - In-memory store with auto-cleanup
  - `utils/llm-client.ts` - Multi-provider client with timeout support
  - `utils/prompt-builder.ts` - Builds isolated prompts with principles/patterns
- **Added 22 Unit Tests** for multi-agent tools (57 total tests now)
- **Updated README.md** with multi-agent tool documentation and env vars
- **Created multi-agent-architecture.md** planning document

**Key Design Decisions:**
- Context isolation: Each agent gets fresh prompt with only persona + task + inputs
- No conversation history shared between agents (true separation of powers)
- Support both providers to enable model specialization per persona
- In-memory store with 30-minute cleanup (sufficient for session-based use)

**Environment Variables Added:**
| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `OPENAI_API_KEY` | OpenAI API key |
| `MANTRAS_DEFAULT_PROVIDER` | Default: anthropic |
| `MANTRAS_DEFAULT_MODEL` | Auto-selected per provider |
| `MANTRAS_MAX_CONCURRENT_AGENTS` | Default: 5 |
| `MANTRAS_AGENT_TIMEOUT_MS` | Default: 120000 |

**MCP Server State (v1.3.0):**
| Tool | Description |
|------|-------------|
| `bootstrap_session` | Initialize session with resources |
| `assess_complexity` | Triage into Simple/Moderate/Complex |
| `get_persona` | Load persona by name or domain |
| `get_pattern` | Load pattern by name |
| `get_skill` | Load skill by name, task, or category |
| `get_workflow` | Get workflow for complexity tier |
| `create_handoff` | Generate handoff template |
| `list_available` | List all resources |
| `spawn_agent` | **NEW** - Spawn isolated agent |
| `get_agent_result` | **NEW** - Get agent result |
| `list_agents` | **NEW** - List spawned agents |

**Branch:** `feature/bootstrap-session-tool` (pending commit)

**Next Steps:**
- Commit all changes to branch
- Test live with actual API key
- Merge to master
- Consider npm publishing

---

### Session 2025-01-09: Skills Framework & Project Organization
**Accomplishments:**
- **Created Skills Framework** - New capability layer for personas (Fourth Pillar)
  - `skills/toolset.md` - Master index of all skills
  - 24 skills across 6 categories (research, analysis, creation, evaluation, orchestration, utility)
  - 12 fully implemented skill files with consistent template
  - Each persona updated with "Available Skills" section (primary + secondary)
- **Updated Manifest** - `ai-mantras-manifest.yaml` v0.3.0 with full skills section
- **Created Help Utility** - `skills/utility/help.md` for framework discovery
- **Project Reorganization:**
  - Created `development/` folder for planning/development docs
  - Moved: agents.md, project-plan.md, persona-backlog.md, personas-and-patterns-context.md
  - Renamed TLDR.md → about.md
- **Documentation Overhaul:**
  - README.md: Added Four Pillars explanation, Quick Start section, Contributing guidelines
  - Created `HowToUse.md`: Setup instructions for MCP server, Claude command, and manual loading (any AI)
  - Updated all file references across the project

**The Four Pillars (now documented):**
| Pillar | Question | Purpose |
|--------|----------|---------|
| Personas | WHO | Specialized identities with expertise, style, and constraints |
| Patterns | HOW | Reusable reasoning structures and thinking templates |
| Principles | WHY | Guiding values that shape behavior |
| Skills | WHAT | Actionable capabilities personas can invoke |

**Key Insights:**
- Skills complete the framework architecture
- Framework now supports three integration methods: MCP server, Claude command, manual loading
- Project structure is cleaner with user-facing files at root, development docs in `development/`

**Branch:** `feature/skills-integration` (merged to master)

---

### Session 2025-01-10: MCP Server Skills Integration
**Accomplishments:**
- **Added skills support to MCP server** (branch: `feature/mcp-skills-integration`)
  - New `get_skill` tool - load skills by name, task matching, or category filter
  - New resources: `mantras://toolset`, `mantras://skill/{category}/{name}`
  - Updated `list_available` to include skills in output and summary
  - Added 4 skill tests to test suite (now 35 total tests passing)
- **Updated content-loader.ts:**
  - Added `SkillInfo` interface
  - Added `loadSkill()`, `getAllSkills()`, `loadToolset()` functions
- **Updated MCP documentation:**
  - README.md: Added skills to feature list, tools table, resources table, available skills section
  - Bumped version to 1.1.0

**MCP Server Now Supports Full Four Pillars:**
| Pillar | Tool | Resource Pattern |
|--------|------|------------------|
| Personas | `get_persona` | `mantras://persona/{category}/{name}` |
| Patterns | `get_pattern` | `mantras://pattern/{layer}/{name}` |
| Principles | (resource only) | `mantras://principles` |
| Skills | `get_skill` | `mantras://skill/{category}/{name}` |

**Key Files Modified:**
- `ai-mantras-mcp/src/utils/content-loader.ts` - skill loading functions
- `ai-mantras-mcp/src/tools/get-skill.ts` - NEW tool
- `ai-mantras-mcp/src/tools/index.ts` - registered get_skill
- `ai-mantras-mcp/src/tools/list-available.ts` - skills in listings
- `ai-mantras-mcp/src/resources/index.ts` - skill resources
- `ai-mantras-mcp/test-tools.js` - skill tests
- `ai-mantras-mcp/README.md` - documentation
- `ai-mantras-mcp/package.json` - version 1.1.0

**Branch:** `feature/mcp-skills-integration` (merged to master)

---

### Session 2025-01-11: MCP Skills Completion & Documentation
**Accomplishments:**
- **Completed MCP Skills Integration** - Merged `feature/mcp-skills-integration` to master
  - MCP server v1.1.0 now fully supports all Four Pillars
  - 35 tests passing (15 content + 20 tools including 4 new skill tests)
- **Consolidated Planning Documents:**
  - Merged `AI-Mantras-Updated-plan.md` into `project-plan.md`
  - Removed redundant file, updated all references
  - Single comprehensive plan now covers goals, architecture, workflows, IP strategy
- **Added Architecture Map to agents.md:**
  - Visual diagram of repository structure
  - Component dependency table (what to update when adding personas/patterns/skills)
  - MCP Server Sync Checklist (9-step process for framework changes)
- **Added Logo to README:**
  - Created `logos/` folder with 3 logo options
  - Added AIMantras-ChatBubble.jpeg centered at top of README
- **Branch Management:**
  - Created and merged `feature/mcp-skills-integration`
  - Created and merged `feature/architecture-map`
  - Both pushed to GitLab and GitHub before merge

**Current MCP Server State (v1.1.0):**
| Tool | Description |
|------|-------------|
| `assess_complexity` | Triage into Simple/Moderate/Complex |
| `get_persona` | Load persona by name or domain |
| `get_pattern` | Load pattern by name |
| `get_skill` | Load skill by name, task, or category |
| `get_workflow` | Get workflow for complexity tier |
| `create_handoff` | Generate handoff template |
| `list_available` | List all personas, patterns, and skills |

**Next Session:**
- Implement multi-agent architecture (personas as separate agents)
- Create remaining placeholder skill files
- Consider publishing MCP server to npm
- Continue persona voice differentiation work

---

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
1. Read `development/agents.md` (this file) for current state and recent session notes
2. Read `development/project-plan.md` for architecture and strategy overview
3. Review `Prompt-AI-Mantras/principles/guiding-principles.md` for philosophical foundation
4. Check `Prompt-AI-Mantras/skills/toolset.md` for available skills
5. Inspect `Prompt-AI-Mantras/personas/` (orchestration, domain, evaluation folders) for available personas
6. Check "Active Focus" above and confirm with user which priority to tackle
7. Use orchestration pattern and two-phase evaluation workflow before executing

**Key Files (updated locations):**
- Development docs: `development/` folder
- Framework content: `Prompt-AI-Mantras/` folder
- Entry point: `AIMantra.md`
- Setup guide: `HowToUse.md`
- About/overview: `about.md`
