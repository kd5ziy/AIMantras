# Extending the MCP Server

This guide explains how to add tools, resources, and capabilities to the AI Mantras MCP server.

## Overview

The MCP (Model Context Protocol) server exposes AI Mantras components programmatically. It allows AI models to:

- Load personas, patterns, and skills dynamically
- Assess request complexity
- Generate handoffs between personas
- Spawn isolated agents (multi-agent mode)

**Location:** `ai-mantras-mcp/`

## Prerequisites

- Node.js 18+
- TypeScript familiarity
- Understanding of the MCP protocol
- Review of existing tools in `ai-mantras-mcp/src/tools/`

## Architecture

```
ai-mantras-mcp/
├── src/
│   ├── index.ts              # Server entry point
│   ├── tools/                 # Tool implementations
│   │   ├── index.ts          # Tool registry
│   │   ├── get-persona.ts    # Load persona by name/domain
│   │   ├── get-pattern.ts    # Load pattern by name
│   │   ├── get-skill.ts      # Load skill by name/task
│   │   └── ...
│   ├── resources/            # Resource handlers
│   │   └── index.ts          # mantras:// URI handling
│   ├── utils/
│   │   ├── content-loader.ts # Loads from manifest
│   │   ├── config.ts         # Environment configuration
│   │   └── ...
│   └── types/                # Type definitions
├── content/                   # Bundled framework content
├── test-*.js                 # Test files
└── package.json
```

## Adding a New Tool

### Step 1: Create the Tool File

Create `src/tools/your-tool-name.ts`:

```typescript
import { z } from 'zod';

// Define input schema
const YourToolInputSchema = z.object({
  requiredParam: z.string().describe('Description of parameter'),
  optionalParam: z.string().optional().describe('Optional parameter'),
});

type YourToolInput = z.infer<typeof YourToolInputSchema>;

// Tool definition for MCP
export const yourToolDefinition = {
  name: 'your_tool_name',
  description: 'Clear description of what this tool does',
  inputSchema: {
    type: 'object' as const,
    properties: {
      requiredParam: {
        type: 'string',
        description: 'Description of parameter',
      },
      optionalParam: {
        type: 'string',
        description: 'Optional parameter',
      },
    },
    required: ['requiredParam'],
  },
};

// Tool implementation
export async function yourToolHandler(input: YourToolInput): Promise<string> {
  // Validate input
  const parsed = YourToolInputSchema.parse(input);

  // Implementation logic
  const result = await doSomething(parsed.requiredParam);

  // Return formatted result
  return formatResult(result);
}
```

### Step 2: Register the Tool

Add to `src/tools/index.ts`:

```typescript
import { yourToolDefinition, yourToolHandler } from './your-tool-name.js';

// Add to tool definitions array
export const toolDefinitions = [
  // ... existing tools
  yourToolDefinition,
];

// Add to handler switch
export async function handleToolCall(name: string, args: unknown): Promise<string> {
  switch (name) {
    // ... existing cases
    case 'your_tool_name':
      return yourToolHandler(args as YourToolInput);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
```

### Step 3: Add Tests

Add tests to `test-tools.js`:

```javascript
describe('your_tool_name', () => {
  it('should handle valid input', async () => {
    const result = await callTool('your_tool_name', {
      requiredParam: 'test-value',
    });
    assert(result.includes('expected content'));
  });

  it('should handle missing optional param', async () => {
    const result = await callTool('your_tool_name', {
      requiredParam: 'test-value',
    });
    assert(result !== undefined);
  });

  it('should fail on invalid input', async () => {
    try {
      await callTool('your_tool_name', {});
      assert.fail('Should have thrown');
    } catch (e) {
      assert(e.message.includes('required'));
    }
  });
});
```

### Step 4: Update Documentation

Add to `ai-mantras-mcp/README.md`:

```markdown
### your_tool_name

Description of what this tool does.

**Parameters:**
- `requiredParam` (required): What this parameter is for
- `optionalParam` (optional): What this parameter is for

**Returns:** Description of return value

**Example:**
```json
{
  "name": "your_tool_name",
  "arguments": {
    "requiredParam": "example"
  }
}
```
```

## Adding a New Resource

Resources are accessed via `mantras://` URIs.

### Step 1: Define the URI Pattern

Decide on your URI structure:
- `mantras://your-resource` - Single resource
- `mantras://your-resource/{category}/{name}` - Parameterized resource

### Step 2: Update Resource Handler

In `src/resources/index.ts`:

```typescript
export async function handleResource(uri: string): Promise<ResourceContent> {
  const url = new URL(uri);
  const path = url.pathname;

  // Add your resource pattern
  if (path === '/your-resource') {
    return handleYourResource();
  }

  if (path.startsWith('/your-resource/')) {
    const parts = path.split('/').filter(Boolean);
    const category = parts[1];
    const name = parts[2];
    return handleYourParameterizedResource(category, name);
  }

  // ... existing handlers
}

async function handleYourResource(): Promise<ResourceContent> {
  // Implementation
  return {
    uri: 'mantras://your-resource',
    mimeType: 'text/markdown',
    text: content,
  };
}
```

### Step 3: Register the Resource

Add to the resource list in `src/resources/index.ts`:

```typescript
export const resourceDefinitions = [
  // ... existing resources
  {
    uri: 'mantras://your-resource',
    name: 'Your Resource',
    description: 'Description of this resource',
    mimeType: 'text/markdown',
  },
];
```

### Step 4: Add Tests

```javascript
describe('mantras://your-resource', () => {
  it('should return resource content', async () => {
    const result = await readResource('mantras://your-resource');
    assert(result.text.includes('expected content'));
  });
});
```

## Adding Content Loader Functions

When you need to load new types of framework content:

### Step 1: Add Type Definition

In `src/types/` or `src/utils/content-loader.ts`:

```typescript
export interface YourContentInfo {
  name: string;
  category: string;
  description: string;
  content: string;
  // ... other fields
}
```

### Step 2: Add Loader Function

In `src/utils/content-loader.ts`:

```typescript
export async function loadYourContent(name: string): Promise<YourContentInfo | null> {
  const manifest = await loadManifest();

  // Find in manifest
  const entry = manifest.yourSection?.find(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );

  if (!entry) return null;

  // Load content file
  const contentPath = path.join(CONTENT_DIR, entry.path);
  const content = await fs.readFile(contentPath, 'utf-8');

  return {
    name: entry.name,
    category: entry.category,
    description: entry.description,
    content,
  };
}

export async function getAllYourContent(): Promise<YourContentInfo[]> {
  const manifest = await loadManifest();
  return manifest.yourSection || [];
}
```

## Testing Your Changes

### Run All Tests

```bash
cd ai-mantras-mcp
npm run build
npm test
```

### Test Specific Tool

```bash
npm test -- --grep "your_tool_name"
```

### Manual Testing

```bash
# Build and start server
npm run build
node dist/index.js

# In another terminal, use MCP client to test
```

## Checklist Before Submission

- [ ] Tool/resource follows existing patterns
- [ ] Input validation using Zod schemas
- [ ] Error handling for edge cases
- [ ] Tests cover happy path and error cases
- [ ] Documentation updated in README
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] All tests pass (`npm test`)
- [ ] Version bumped in `package.json` (minor for features, patch for fixes)

## Common Patterns

### Loading Content with Fallbacks

```typescript
async function loadWithFallback(name: string): Promise<Content> {
  // Try exact match
  let content = await loadExact(name);
  if (content) return content;

  // Try case-insensitive
  content = await loadCaseInsensitive(name);
  if (content) return content;

  // Return helpful error
  throw new Error(`Content not found: ${name}. Available: ${await listAvailable()}`);
}
```

### Formatting Tool Results

```typescript
function formatResult(data: SomeData): string {
  const sections = [
    `# ${data.name}`,
    '',
    data.description,
    '',
    '## Details',
    formatDetails(data.details),
  ];

  return sections.join('\n');
}
```

### Environment Configuration

```typescript
import { config } from './utils/config.js';

// Use configuration values
const timeout = config.agentTimeoutMs;
const maxConcurrent = config.maxConcurrentAgents;
```

## Current Tools Reference

| Tool | Purpose |
|------|---------|
| `bootstrap_session` | Initialize session with resources |
| `assess_complexity` | Triage into Simple/Moderate/Complex |
| `get_persona` | Load persona by name or domain |
| `get_pattern` | Load pattern by name |
| `get_skill` | Load skill by name, task, or category |
| `get_workflow` | Get workflow for complexity tier |
| `create_handoff` | Generate handoff template |
| `list_available` | List all resources |
| `spawn_agent` | Spawn isolated agent (multi-agent mode) |
| `get_agent_result` | Get agent result |
| `list_agents` | List spawned agents |

## Resources Reference

| URI | Content |
|-----|---------|
| `mantras://principles` | Guiding principles |
| `mantras://toolset` | Skills index |
| `mantras://persona/{category}/{name}` | Persona content |
| `mantras://pattern/{layer}/{name}` | Pattern content |
| `mantras://skill/{category}/{name}` | Skill content |

## Questions?

- Review existing tools in `src/tools/` for examples
- Check `test-tools.js` for testing patterns
- Open a GitHub Issue for questions
