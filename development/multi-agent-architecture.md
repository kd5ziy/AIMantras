# AI Mantras: Multi-Agent Architecture Plan

**Created:** 2025-01-14
**Updated:** 2025-01-16
**Status:** Phase 2 Complete (MCP Agent Spawner) - Merged to master
**Branch:** master (was feature/bootstrap-session-tool)

---

## Overview

AI Mantras should support two operational modes:

| Mode | Description | Use Case |
|------|-------------|----------|
| **Single-Agent** | All personas run on one AI model (current) | Simple deployments, low cost, quick setup |
| **Multi-Agent** | Each persona is a separate agent/model | Production systems, parallel work, true isolation |

---

## Why Multi-Agent Mode?

### Problems with Single-Agent Mode

1. **Context Bleeding**
   - When one persona "hands off" to another, prior reasoning may influence the new persona
   - The evaluator has seen the worker's thought process, potentially biasing evaluation
   - Separation of powers is simulated, not enforced

2. **Sequential Bottleneck**
   - All work happens serially
   - Complex tasks with independent subtasks can't parallelize
   - Latency compounds across personas

3. **Model Lock-in**
   - All personas use the same model capabilities
   - Can't use specialized models (e.g., code model for Kestra, reasoning model for Clara)
   - Can't optimize cost (use smaller models for simple personas)

### Benefits of Multi-Agent Mode

1. **True Isolation**
   - Each persona has its own context window
   - No memory of other personas' reasoning
   - Genuine separation of powers

2. **Parallel Execution**
   - Independent work streams run simultaneously
   - Hopper plans while Clara analyzes
   - Multiple domain experts work in parallel

3. **Model Specialization**
   - Use Claude for reasoning, GPT-4 for code, Gemini for research
   - Fine-tuned models per persona (future)
   - Cost optimization by model tier

4. **Scalability**
   - Distribute across infrastructure
   - Handle multiple concurrent sessions
   - Enterprise-grade reliability

---

## Architecture Design

### Mode 1: Single-Agent (Current)

```
┌─────────────────────────────────────────────────────┐
│                   Single AI Model                    │
│                                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐ │
│  │ Hopper  │→ │  Clara  │→ │  Ada    │→ │ Output │ │
│  │(Planner)│  │(Domain) │  │  (QA)   │  │        │ │
│  └─────────┘  └─────────┘  └─────────┘  └────────┘ │
│                                                      │
│  Shared context window - personas are "roles"        │
└─────────────────────────────────────────────────────┘
```

**How it works:**
- MCP server provides persona content
- AI adopts persona via system prompt
- Handoffs are role transitions within same context
- bootstrap_session loads everything at once

### Mode 2: Multi-Agent (Planned)

```
┌─────────────────────────────────────────────────────────────────┐
│                      Orchestration Layer                         │
│                    (Bernstein Orchestrator)                      │
└─────────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │   Agent 1   │     │   Agent 2   │     │   Agent 3   │
    │   Hopper    │     │    Clara    │     │     Ada     │
    │  (Planner)  │     │  (Domain)   │     │    (QA)     │
    │             │     │             │     │             │
    │ Model: opus │     │Model: sonnet│     │Model: sonnet│
    └─────────────┘     └─────────────┘     └─────────────┘
           │                    │                    │
           └────────────────────┼────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Message Queue /   │
                    │   State Manager     │
                    └─────────────────────┘
```

**How it works:**
- Each persona runs as independent agent process
- Orchestrator routes tasks and manages handoffs
- Structured messages pass between agents
- No shared context - true isolation

---

## Technical Implementation

### Phase 1: Foundation (Mode Selection)

Add mode configuration to bootstrap_session:

```typescript
bootstrap_session({
  request: "...",
  tier: "complex",
  mode: "single-agent" | "multi-agent",  // NEW
})
```

For single-agent: behaves as current
For multi-agent: returns orchestration plan instead of loading all personas

### Phase 2: Agent Communication Protocol

Define structured handoff format:

```typescript
interface AgentHandoff {
  from_agent: string;       // "Hopper-Project-Planner"
  to_agent: string;         // "Clara-Financial-Analyst"
  task: string;             // What to do
  context: {
    mission: string;
    constraints: string[];
    inputs: Record<string, any>;
    success_criteria: string[];
  };
  artifacts: {
    name: string;
    content: string;
    type: "plan" | "analysis" | "code" | "review";
  }[];
  metadata: {
    session_id: string;
    sequence: number;
    parent_task?: string;
  };
}
```

Key principle: **Agents receive only what they need to know, not full conversation history.**

### Phase 3: Orchestrator Implementation

The Bernstein Orchestrator becomes a real component:

```typescript
interface OrchestratorConfig {
  agents: {
    name: string;
    persona: string;
    model: string;           // "claude-opus-4", "gpt-4", etc.
    endpoint?: string;       // Custom API endpoint
    system_prompt: string;   // Loaded from persona file
  }[];

  message_queue: "in-memory" | "redis" | "kafka";

  execution: {
    max_parallel: number;
    timeout_ms: number;
    retry_policy: RetryConfig;
  };
}
```

### Phase 4: Multi-Model Support

Allow different models per persona:

```yaml
# ai-mantras-config.yaml
agents:
  Hopper-Project-Planner:
    model: claude-opus-4
    reason: "Complex planning benefits from strongest reasoning"

  Clara-Financial-Analyst:
    model: claude-sonnet-4
    reason: "Good balance of capability and cost"

  Kestra-Systems-Architect:
    model: gpt-4-turbo
    reason: "Strong at technical/infrastructure tasks"

  Ada-QA-Reviewer:
    model: claude-sonnet-4
    reason: "Evaluation doesn't need strongest model"
```

### Phase 5: Parallel Execution

Enable concurrent agent work:

```typescript
// Orchestrator splits independent tasks
const plan = await hopperAgent.plan(request);

// These can run in parallel
const [financialAnalysis, technicalAnalysis] = await Promise.all([
  claraAgent.analyze(plan.financial_task),
  kestraAgent.analyze(plan.technical_task),
]);

// Sequential: QA reviews combined output
const review = await adaAgent.review({
  financial: financialAnalysis,
  technical: technicalAnalysis,
});
```

---

## MCP Server Changes

### New Tools for Multi-Agent Mode

```typescript
// Start a multi-agent session
start_orchestrated_session({
  request: string,
  tier: "complex",
  mode: "multi-agent",
  config?: OrchestratorConfig
})

// Get handoff template for agent communication
create_agent_handoff({
  from: string,
  to: string,
  task: string,
  context: object
})

// Query session state
get_session_state({
  session_id: string
})

// Submit agent output
submit_agent_output({
  session_id: string,
  agent: string,
  output: object
})
```

### Orchestration Endpoints

For multi-agent mode, the MCP server could expose:

```
POST /sessions              - Create orchestrated session
GET  /sessions/:id          - Get session state
POST /sessions/:id/handoff  - Submit handoff to next agent
GET  /sessions/:id/tasks    - Get pending tasks for an agent
POST /sessions/:id/output   - Submit agent output
```

---

## Deployment Options

### Option A: Process-Based Agents

Each agent is a separate process:

```bash
# Start orchestrator
ai-mantras orchestrate --session abc123

# Agents poll for work
ai-mantras agent --persona Hopper --session abc123
ai-mantras agent --persona Clara --session abc123
ai-mantras agent --persona Ada --session abc123
```

### Option B: Container-Based Agents

Each agent runs in a container:

```yaml
# docker-compose.yml
services:
  orchestrator:
    image: ai-mantras/orchestrator
    environment:
      - REDIS_URL=redis://redis:6379

  hopper:
    image: ai-mantras/agent
    environment:
      - PERSONA=Hopper-Project-Planner
      - MODEL=claude-opus-4

  clara:
    image: ai-mantras/agent
    environment:
      - PERSONA=Clara-Financial-Analyst
      - MODEL=claude-sonnet-4
```

### Option C: Serverless Agents

Each agent is a serverless function:

```typescript
// AWS Lambda / Cloudflare Worker
export async function handler(event: AgentHandoff) {
  const persona = loadPersona(process.env.PERSONA);
  const model = getModel(process.env.MODEL);

  const result = await model.complete({
    system: persona.system_prompt,
    messages: [{ role: "user", content: formatTask(event) }]
  });

  return parseOutput(result);
}
```

---

## Context Isolation Guarantees

### What Each Agent Sees

| Agent | Sees | Does NOT See |
|-------|------|--------------|
| Hopper (Planner) | Original request, constraints | Nothing yet |
| Clara (Domain) | Task from Hopper, relevant inputs | Hopper's reasoning process |
| Ada (QA) | Clara's output, success criteria | Clara's intermediate thinking |
| Evaluator | Final output, original criteria | All internal reasoning |

### Handoff Content Rules

1. **Task description** - What to do (required)
2. **Relevant inputs** - Data needed for the task (required)
3. **Success criteria** - How to know it's done (required)
4. **Constraints** - Boundaries and limitations (optional)
5. **NO reasoning traces** - Don't pass "here's how I thought about it"
6. **NO conversation history** - Fresh context for each agent

---

## Migration Path

### Step 1: Dual-Mode Support
- Add `mode` parameter to bootstrap_session
- Single-agent remains default
- Multi-agent returns orchestration plan

### Step 2: Local Multi-Agent
- Implement orchestrator as local process
- Agents communicate via in-memory queue
- Test isolation and handoffs

### Step 3: Distributed Multi-Agent
- Add Redis/queue support
- Enable remote agent execution
- Add monitoring and logging

### Step 4: Multi-Model
- Abstract model selection per agent
- Support OpenAI, Anthropic, local models
- Cost optimization dashboard

---

## Open Questions

1. **State Persistence**
   - How long do sessions live?
   - Where is intermediate state stored?
   - How to resume interrupted sessions?

2. **Error Handling**
   - What happens when an agent fails?
   - Retry policies per agent?
   - Fallback to single-agent mode?

3. **Cost Management**
   - How to track costs across models?
   - Budget limits per session?
   - Model tier selection heuristics?

4. **Human-in-the-Loop**
   - Where do approval checkpoints happen?
   - How does the human interact with multi-agent?
   - UI/UX for monitoring agent work?

5. **Fine-Tuned Models**
   - Can we fine-tune models per persona?
   - What training data would we use?
   - How to maintain consistency?

---

## Success Criteria

Multi-agent mode is successful when:

1. **Isolation verified** - Agents provably don't see each other's reasoning
2. **Parallel speedup** - Complex tasks complete faster than single-agent
3. **Quality maintained** - Output quality matches or exceeds single-agent
4. **Cost reasonable** - Multi-agent cost is predictable and manageable
5. **Developer friendly** - Easy to configure and deploy

---

## Practical Implementation Options

### Option 1: Claude Code Task Tool (Available Now)

Claude Code already supports spawning subagents:

```typescript
// From within Claude Code, spawn background agents
Task({
  subagent_type: "general-purpose",
  prompt: `You are Clara-Financial-Analyst.
           ${claraPersonaContent}

           Task: ${handoff.task}
           Inputs: ${JSON.stringify(handoff.inputs)}
           Success Criteria: ${handoff.success_criteria}`,
  run_in_background: true,
  model: "sonnet"  // Can specify model
})
```

**Pros:**
- Works today, no new infrastructure
- Background execution supported
- Model selection available

**Cons:**
- Limited to Claude Code environment
- Predefined agent types
- Manual orchestration

### Option 2: MCP Server Agent Spawner

Extend MCP server to spawn and manage agents:

```typescript
// New MCP tool: spawn_agent
{
  name: "spawn_agent",
  description: "Spawn an isolated AI Mantras agent",
  inputSchema: {
    properties: {
      persona: { type: "string" },      // "Clara-Financial-Analyst"
      model: { type: "string" },         // "claude-sonnet-4"
      task: { type: "string" },          // What to do
      inputs: { type: "object" },        // Data for the task
      async: { type: "boolean" }         // Return immediately?
    }
  }
}

// New MCP tool: get_agent_result
{
  name: "get_agent_result",
  description: "Get result from spawned agent",
  inputSchema: {
    properties: {
      agent_id: { type: "string" }
    }
  }
}
```

**Implementation:**

```typescript
// In MCP server
async function handleSpawnAgent(args) {
  const { persona, model, task, inputs } = args;

  // Load persona content
  const personaContent = loadPersona(persona);
  const principles = loadPrinciples();

  // Create isolated API call
  const client = new Anthropic();
  const agentId = generateId();

  // Store promise for later retrieval
  agentPromises[agentId] = client.messages.create({
    model: model || "claude-sonnet-4-20250514",
    system: `${principles}\n\n${personaContent}`,
    messages: [{
      role: "user",
      content: formatAgentTask(task, inputs)
    }]
  });

  return { agent_id: agentId, status: "running" };
}
```

### Option 3: Anthropic Agent SDK

Use Anthropic's upcoming agent SDK for native multi-agent:

```typescript
import { Agent, Swarm } from '@anthropic/agent-sdk';

// Define persona agents
const hopper = new Agent({
  name: "Hopper-Project-Planner",
  model: "claude-opus-4",
  system: hopperPersonaContent,
  tools: [planningTools]
});

const clara = new Agent({
  name: "Clara-Financial-Analyst",
  model: "claude-sonnet-4",
  system: claraPersonaContent,
  tools: [analysisTools]
});

// Create orchestrated swarm
const mantrasSwarm = new Swarm({
  orchestrator: bernsteinAgent,
  agents: [hopper, clara, ada],
  handoffProtocol: mantrasHandoff
});

const result = await mantrasSwarm.run(userRequest);
```

### Option 4: External Orchestration Frameworks

Integrate with existing multi-agent frameworks:

**LangGraph:**
```python
from langgraph.graph import StateGraph
from ai_mantras import load_persona

# Define persona nodes
def hopper_node(state):
    persona = load_persona("Hopper-Project-Planner")
    return invoke_agent(persona, state.task)

def clara_node(state):
    persona = load_persona("Clara-Financial-Analyst")
    return invoke_agent(persona, state.task)

# Build graph
graph = StateGraph()
graph.add_node("planner", hopper_node)
graph.add_node("analyst", clara_node)
graph.add_node("qa", ada_node)
graph.add_edge("planner", "analyst")
graph.add_edge("analyst", "qa")
```

**CrewAI:**
```python
from crewai import Agent, Crew, Task
from ai_mantras import load_persona

hopper = Agent(
    role="Project Planner",
    goal="Create detailed execution plans",
    backstory=load_persona("Hopper-Project-Planner"),
    llm="claude-opus-4"
)

clara = Agent(
    role="Financial Analyst",
    backstory=load_persona("Clara-Financial-Analyst"),
    llm="claude-sonnet-4"
)

crew = Crew(
    agents=[hopper, clara, ada],
    tasks=[planning_task, analysis_task, review_task],
    process="sequential"  # or "parallel"
)
```

### Option 5: Simple HTTP Microservices

Each persona as a lightweight HTTP service:

```typescript
// persona-service/clara.ts
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
const persona = loadPersona("Clara-Financial-Analyst");

app.post('/analyze', async (req, res) => {
  const { task, inputs } = req.body;

  const client = new Anthropic();
  const result = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    system: persona,
    messages: [{ role: "user", content: formatTask(task, inputs) }]
  });

  res.json({ output: result.content });
});

app.listen(3001);
```

**Orchestrator calls services:**
```typescript
// orchestrator.ts
const agents = {
  hopper: "http://localhost:3000",
  clara: "http://localhost:3001",
  ada: "http://localhost:3002"
};

async function runMultiAgent(request) {
  // Plan
  const plan = await fetch(`${agents.hopper}/plan`, {
    method: "POST",
    body: JSON.stringify({ task: request })
  }).then(r => r.json());

  // Execute in parallel
  const [financial, technical] = await Promise.all([
    fetch(`${agents.clara}/analyze`, { ... }),
    fetch(`${agents.kestra}/analyze`, { ... })
  ]);

  // QA review
  const review = await fetch(`${agents.ada}/review`, { ... });

  return review;
}
```

---

## Recommended Implementation Path

### Phase 1: Claude Code Native (Now)
Use Task tool with background agents for immediate multi-agent capability:
- Create a "multi-agent orchestrator" prompt
- Spawn persona agents via Task tool
- Collect and synthesize results

### Phase 2: MCP Agent Spawner (Short-term)
Add spawn_agent tool to MCP server:
- Works from any MCP client (Claude Code, custom apps)
- Parallel agent execution
- Result collection and synthesis

### Phase 3: Standalone Orchestrator (Medium-term)
Build dedicated orchestration service:
- HTTP API for starting/monitoring sessions
- Support multiple AI providers
- Queue-based agent communication
- Dashboard for visibility

### Phase 4: Framework Integration (Long-term)
Publish AI Mantras integrations for:
- LangGraph / LangChain
- CrewAI
- AutoGen
- Anthropic Agent SDK (when available)

---

## Next Steps

### Completed (2025-01-16)
- [x] Prototype spawn_agent MCP tool
- [x] Create configuration schema for agent models (env vars)
- [x] Design detailed handoff message format (via prompt-builder.ts)
- [x] Add MANTRAS_MULTI_AGENT_ENABLED toggle for single/multi-agent mode
- [x] Add 24 unit tests for multi-agent tools (59 total)
- [x] Merge to master

### In Progress
- [ ] Test isolation with simple multi-agent flow (tools ready, needs live test)
- [ ] Test Claude Code Task-based multi-agent

### Pending
- [ ] Prototype local orchestrator (Bernstein as real component)
- [ ] Benchmark parallel vs sequential execution
- [ ] Design monitoring/observability layer
- [ ] Evaluate LangGraph/CrewAI integration

---

## References

- Current MCP server: `ai-mantras-mcp/`
- Handoff tool: `src/tools/create-handoff.ts`
- Orchestration pattern: `Prompt-AI-Mantras/patterns/orchestration.md`
- Bernstein persona: `Prompt-AI-Mantras/personas/orchestration/Bernstein.md`
