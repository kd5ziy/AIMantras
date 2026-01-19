# AI Mantras MCP Server

An MCP (Model Context Protocol) server that exposes the AI Mantras prompt framework as structured tools, resources, and prompts for Claude.

## What is AI Mantras?

AI Mantras is a prompt engineering framework that treats AI collaboration as organizational design. It provides:

- **11 Personas** across orchestration, domain, and evaluation categories
- **9 Thinking Patterns** for structured reasoning
- **24 Skills** - actionable capabilities personas can invoke
- **3 Complexity Tiers** (Simple, Moderate, Complex) with appropriate workflows
- **Separation of Powers** to prevent self-evaluation and ensure quality

## Installation

### For Users (Zero Config)

```bash
# Install globally
npm install -g @ai-mantras/mcp-server

# Or use with npx (no install needed)
```

Add to your Claude Code `.mcp.json`:

```json
{
  "mcpServers": {
    "ai-mantras": {
      "command": "npx",
      "args": ["-y", "@ai-mantras/mcp-server"]
    }
  }
}
```

### For Development

```bash
cd ai-mantras-mcp
npm install
npm run build
```

## Tools

### Core Tools

| Tool | Description |
|------|-------------|
| `bootstrap_session` | Initialize a session with appropriate resources for a request |
| `assess_complexity` | Triage a request into Simple/Moderate/Complex tier |
| `get_persona` | Load a persona by name or domain match |
| `get_pattern` | Load a thinking pattern by name |
| `get_skill` | Load a skill by name, task match, or category |
| `get_workflow` | Get workflow steps for a complexity tier |
| `create_handoff` | Generate handoff template between personas |
| `list_available` | List all available personas, patterns, and skills |

### Multi-Agent Tools

These tools enable true multi-agent execution with context isolation between personas.

> **Note:** These tools only appear when `MANTRAS_MULTI_AGENT_ENABLED=true`

| Tool | Description |
|------|-------------|
| `spawn_agent` | Spawn an isolated AI agent with a specific persona |
| `get_agent_result` | Retrieve status and result from a spawned agent |
| `list_agents` | List all spawned agents with status and usage stats |

#### spawn_agent

Spawns an isolated agent that only sees its persona definition, the task, and any provided inputs. Supports both synchronous (wait for result) and asynchronous (return immediately) modes.

```javascript
spawn_agent({
  persona: "Clara-Financial-Analyst",  // Required: persona name
  task: "Analyze this investment opportunity", // Required: what to do
  inputs: { document: "..." },          // Optional: context data
  success_criteria: "Provide ROI estimate", // Optional: success definition
  patterns: ["chain-of-thought"],       // Optional: thinking patterns
  provider: "anthropic",                // Optional: "anthropic" or "openai"
  model: "claude-sonnet-4-20250514",   // Optional: specific model
  async: false,                         // Optional: async mode
  max_tokens: 4096,                     // Optional: response limit
  timeout_ms: 120000                    // Optional: timeout
})
```

#### get_agent_result

Poll for completion or retrieve results from a spawned agent.

```javascript
get_agent_result({
  agent_id: "agent_abc12345"  // Required: ID from spawn_agent
})
```

#### list_agents

List all spawned agents with optional status filtering.

```javascript
list_agents({
  status: "all",  // Optional: pending|running|completed|failed|timeout|all
  limit: 20       // Optional: max results
})
```

## Resources

| URI | Content |
|-----|---------|
| `mantras://principles` | Guiding principles |
| `mantras://bootstrapper` | Agent bootstrapper |
| `mantras://manifest` | Framework manifest (YAML) |
| `mantras://toolset` | Skills master index |
| `mantras://persona/{category}/{name}` | Individual personas |
| `mantras://pattern/{layer}/{name}` | Individual patterns |
| `mantras://skill/{category}/{name}` | Individual skills |

## Prompts

| Prompt | Description |
|--------|-------------|
| `mantras` | Auto-triage and process request |
| `mantras-simple` | Direct answer with single persona |
| `mantras-moderate` | Structured reasoning + self-review |
| `mantras-complex` | Full orchestration workflow |

## Usage Examples

### Using the main prompt
```
/mantras "What's the best filesystem for a NAS?"
```

### Using tools directly
```
Use the assess_complexity tool to analyze: "Help me design a backup strategy"
```

### Reading resources
```
Read mantras://persona/domain/Kestra-Systems-Architect
```

## Environment Variables

### Operating Modes

AI Mantras supports two operating modes:

| Mode | Description | Use Case |
|------|-------------|----------|
| **Single-Agent** (default) | All personas run on one AI model | Simple setup, no API keys needed, lower cost |
| **Multi-Agent** | Each persona spawns as a separate isolated agent | True context isolation, parallel execution, model specialization |

Set the mode via environment variable:

```bash
MANTRAS_MULTI_AGENT_ENABLED=false  # Single-agent mode (default)
MANTRAS_MULTI_AGENT_ENABLED=true   # Multi-agent mode
```

### Multi-Agent Configuration

When `MANTRAS_MULTI_AGENT_ENABLED=true`, configure these additional settings:

| Variable | Description | Required |
|----------|-------------|----------|
| `MANTRAS_MULTI_AGENT_ENABLED` | Enable multi-agent tools | No (default: false) |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude models | For Anthropic provider |
| `OPENAI_API_KEY` | OpenAI API key for GPT models | For OpenAI provider |
| `MANTRAS_DEFAULT_PROVIDER` | Default provider: `anthropic` or `openai` | No (default: anthropic) |
| `MANTRAS_DEFAULT_MODEL` | Default model name | No (auto-selected) |
| `MANTRAS_MAX_CONCURRENT_AGENTS` | Max parallel async agents | No (default: 5) |
| `MANTRAS_AGENT_TIMEOUT_MS` | Default timeout in ms | No (default: 120000) |

### Example Configurations

**Single-Agent Mode** (default, no extra config needed):
```json
{
  "mcpServers": {
    "ai-mantras": {
      "command": "npx",
      "args": ["-y", "@ai-mantras/mcp-server"]
    }
  }
}
```

**Multi-Agent Mode** (enables spawn_agent, get_agent_result, list_agents):
```json
{
  "mcpServers": {
    "ai-mantras": {
      "command": "npx",
      "args": ["-y", "@ai-mantras/mcp-server"],
      "env": {
        "MANTRAS_MULTI_AGENT_ENABLED": "true",
        "ANTHROPIC_API_KEY": "sk-ant-..."
      }
    }
  }
}
```

## Custom Content

By default, the server uses bundled content. Power users can override with custom content:

```json
{
  "mcpServers": {
    "ai-mantras": {
      "command": "npx",
      "args": ["-y", "@ai-mantras/mcp-server"],
      "env": {
        "MANTRAS_CONTENT_PATH": "/path/to/your/content"
      }
    }
  }
}
```

## Available Personas

### Orchestration
- **Bernstein-Orchestrator** - Coordinates multi-persona workflows
- **Hopper-Project-Planner** - Frames problems and decomposes work
- **Lovell-Crisis-Planner** - Handles high-stakes, time-sensitive planning

### Domain
- **Clara-Financial-Analyst** - Financial analysis and portfolio strategy
- **Kestra-Systems-Architect** - Infrastructure and systems design
- **Goeth-Philosophical-Synthesizer** - Ethics and meaning frameworks
- **Franklin-Deep-Reasoner** - Multi-domain integration
- **Watson-Medical-Advisor** - Evidence-based medical guidance

### Evaluation
- **Ada-QA-Reviewer** - Quality assurance and review
- **Drucker-Goal-Satisfaction-Evaluator** - Objective measurement
- **Rickover-Safety-Evaluator** - Risk and safety assessment

## Available Patterns

### Layer 1: Foundational
- `planning-phase` - Problem definition before execution
- `orchestration` - Multi-persona coordination
- `recursive-self-eval` - Critique and refinement loops
- `meta-rules` - Behavioral guardrails

### Layer 2: Thinking Primitives
- `chain-of-thought` - Labeled reasoning stages
- `rule-based-reasoning` - Explicit rules with traceability
- `guardrail-creative` - Creativity within constraints

### Layer 3: Evaluation
- `criterion-based-evaluation` - Systematic assessment
- `threat-modeling` - Risk identification

## Available Skills

### Research
- `web-search` - Search and synthesize web information
- `codebase-exploration` - Navigate and understand code

### Analysis
- `code-review` - Review code for quality and issues
- `risk-assessment` - Evaluate risks and mitigations

### Creation
- `document-generation` - Create structured documents
- `code-generation` - Generate code from specifications

### Evaluation
- `quality-check` - Verify output quality
- `security-audit` - Assess security posture

### Orchestration
- `task-decomposition` - Break down complex tasks
- `handoff` - Transfer work between personas

### Utility
- `help` - Framework guidance and discovery

## License

MPL-2.0
