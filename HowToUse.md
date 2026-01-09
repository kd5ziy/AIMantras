# How to Use AI Mantras

This guide covers three ways to use AI Mantras, from full integration to simple manual loading.

---

## Option 1: MCP Server (Claude Code - Full Integration)

The MCP (Model Context Protocol) server provides the deepest integration with Claude Code, exposing AI Mantras as native tools.

### What You Get
- `assess_complexity` - Automatically triage requests
- `get_persona` - Load personas by name or domain
- `get_pattern` - Load thinking patterns
- `get_workflow` - Get orchestration workflows
- `create_handoff` - Generate handoff templates
- `list_available` - Discover all personas and patterns

### Installation

#### From npm (Recommended)
```bash
npm install -g @ai-mantras/mcp-server
```

Add to your Claude Code MCP configuration (`~/.claude/mcp.json` or project `.mcp.json`):
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

#### From Source
```bash
git clone https://github.com/kd5ziy/AIMantras.git
cd AIMantras/ai-mantras-mcp
npm install
npm run build
```

Add to your MCP configuration:
```json
{
  "mcpServers": {
    "ai-mantras": {
      "command": "node",
      "args": ["/path/to/AIMantras/ai-mantras-mcp/dist/index.js"]
    }
  }
}
```

### Usage
Once configured, Claude Code automatically has access to AI Mantras tools. You can:
- Ask questions and let the framework triage automatically
- Request specific personas: "Use Clara to analyze this investment"
- Apply patterns: "Use chain-of-thought to work through this problem"

---

## Option 2: Claude Command (Claude Code - Simple)

A lightweight `/Mantras` command that loads the framework on demand.

### Installation

1. Copy the command file to your Claude commands folder:
```bash
# Global (works from any directory)
cp claude/commands/Mantras.md ~/.claude/commands/

# Or project-level (works only in this project)
mkdir -p .claude/commands
cp claude/commands/Mantras.md .claude/commands/
```

2. Edit the copied file to set the correct path to your AI Mantras installation:
```markdown
# In ~/.claude/commands/Mantras.md, update line 23:
1. Read `AIMantra.md` from the AI Mantras project root
   (If using globally, update this to the absolute path: `/your/path/to/AIMantras/AIMantra.md`)
```

3. Restart Claude Code or start a new session

### Usage
```
/Mantras Help me design a backup strategy for my homelab

/Mantras Analyze whether I should invest in NVDA or SOXX

/Mantras Review this code for security issues
```

The framework automatically:
1. Triages your request (Simple, Moderate, or Complex)
2. Loads the appropriate personas and patterns
3. Processes your request using the framework

---

## Option 3: Any AI Model (Manual Loading)

Works with any AI model: ChatGPT, Gemini, Claude (web), local LLMs, or any other.

### Setup

1. **Download the repository**
```bash
git clone https://github.com/kd5ziy/AIMantras.git
```

Or download as ZIP from GitHub and extract.

2. **Give your AI access to the files**

Depending on your AI interface:
- **File upload**: Upload the entire `Prompt-AI-Mantras/` folder and `AIMantra.md`
- **Copy/paste**: Copy file contents into the conversation
- **Local LLM**: Point to the directory in your context

### Usage

#### Method A: Full Context Load
For AI models with large context windows, load everything upfront:

```
I'm going to give you the AI Mantras framework. Please read and internalize these files:

1. First, read AIMantra.md - this is your entry point and triage guide
2. Read Prompt-AI-Mantras/principles/guiding-principles.md - internalize these values
3. You now have access to personas in Prompt-AI-Mantras/personas/
4. You have access to patterns in Prompt-AI-Mantras/patterns/
5. You have access to skills in Prompt-AI-Mantras/skills/

Follow the AIMantra.md instructions to triage my requests and load only what you need.

My request: [YOUR REQUEST HERE]
```

#### Method B: Guided Loading (Smaller Context)
For AI models with limited context, load incrementally:

**Step 1**: Load the entry point
```
Read this file and follow its instructions:
[Paste contents of AIMantra.md]

My request: [YOUR REQUEST HERE]
```

**Step 2**: The AI will tell you what else to load based on your request complexity. Provide files as requested.

#### Method C: Direct Persona Invocation
If you know which persona you need:

```
You are Clara, a Financial Analyst. Read and embody this persona:
[Paste contents of Prompt-AI-Mantras/personas/domain/Clara-Financial-Analyst.md]

Also read and internalize these guiding principles:
[Paste contents of Prompt-AI-Mantras/principles/guiding-principles.md]

Use these patterns for your analysis:
[Paste contents of relevant patterns]

My request: Analyze whether I should increase my position in tech ETFs given current market conditions.
```

### Tips for Manual Loading

1. **Always load principles first** - They shape all persona behavior
2. **Load the full persona file** - Don't summarize; the details matter
3. **Include recommended patterns** - Each persona lists which patterns work best
4. **Reference skills as needed** - Skills define what capabilities are available
5. **Use the manifest** - `ai-mantras-manifest.yaml` lists everything available

---

## Choosing the Right Method

| Situation | Recommended Method |
|-----------|-------------------|
| Daily Claude Code user | MCP Server |
| Occasional Claude Code user | Claude Command |
| Using ChatGPT, Gemini, or web Claude | Manual Loading |
| Using local LLMs (Ollama, LM Studio) | Manual Loading |
| Testing or evaluating the framework | Manual Loading |
| Contributing to development | MCP Server (for testing) |

---

## Troubleshooting

### MCP Server Issues
- **Server not found**: Ensure the path in `mcp.json` is correct
- **Tools not appearing**: Restart Claude Code after configuration changes
- **Permission errors**: Check file permissions on the server script

### Claude Command Issues
- **Command not found**: Ensure the file is in `~/.claude/commands/` or `.claude/commands/`
- **Path errors**: Update the absolute path to `AIMantra.md` in the command file
- **Framework not loading**: Check that all referenced files exist

### Manual Loading Issues
- **AI ignores instructions**: Load `guiding-principles.md` first; be explicit about following the framework
- **Context too large**: Use Method B (guided loading) or load only the specific persona you need
- **Inconsistent behavior**: Ensure you're loading complete files, not summaries

---

## Next Steps

Once you're set up:
1. Try a simple request to see how triage works
2. Experiment with different personas for different domains
3. Check `Prompt-AI-Mantras/skills/toolset.md` to see available capabilities
4. Read `development/agents.md` if you want to contribute

---

## Getting Help

- **Framework questions**: Use the `help` skill or read `skills/utility/help.md`
- **Bug reports**: [GitHub Issues](https://github.com/kd5ziy/AIMantras/issues)
- **Contributions**: See [Contributing](README.md#contributing) in the README
