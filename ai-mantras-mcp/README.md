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

| Tool | Description |
|------|-------------|
| `assess_complexity` | Triage a request into Simple/Moderate/Complex tier |
| `get_persona` | Load a persona by name or domain match |
| `get_pattern` | Load a thinking pattern by name |
| `get_skill` | Load a skill by name, task match, or category |
| `get_workflow` | Get workflow steps for a complexity tier |
| `create_handoff` | Generate handoff template between personas |
| `list_available` | List all available personas, patterns, and skills |

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
