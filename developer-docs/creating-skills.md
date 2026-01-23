# Creating Skills

This guide explains how to create new skills for the AI Mantras framework. Skills are the **WHAT** - actionable capabilities that personas invoke to accomplish specific types of work.

## Overview

Skills bridge personas and real-world actions:

| Component | Role |
|-----------|------|
| Persona | WHO does the work (identity, expertise) |
| Pattern | HOW they think (reasoning structure) |
| Skill | WHAT they can do (capabilities, actions) |

A skill defines:
- What capability it provides
- When to use it
- What inputs it needs
- What outputs it produces
- Which personas commonly use it

## Prerequisites

Before creating a skill:

1. **Review `skills/toolset.md`** - Master index of all skills
2. **Check existing skills** - Review skills in the target category
3. **Understand categories** - Research, Analysis, Creation, Evaluation, Orchestration, Utility
4. **Consider MCP integration** - New skills may need MCP server updates

## Current Skill Categories

| Category | Purpose | Example Skills |
|----------|---------|----------------|
| **Research** | Information gathering | web-search, document-review |
| **Analysis** | Analytical work | data-analysis, code-review |
| **Creation** | Content generation | document-generation, code-generation |
| **Evaluation** | Assessment | quality-check, security-audit |
| **Orchestration** | Workflow coordination | task-decomposition, handoff |
| **Utility** | Framework navigation | help |

## Step-by-Step Creation Process

### Step 1: Identify the Capability Gap

Ask:
- What action are personas unable to take with current skills?
- Which personas would use this skill?
- Is this truly a new capability or a variation of existing skills?

### Step 2: Choose the Category

Place the skill in the category that best matches its primary purpose:

| If the skill... | Category |
|-----------------|----------|
| Gathers information | Research |
| Analyzes or evaluates data | Analysis |
| Creates new content | Creation |
| Validates or assesses quality | Evaluation |
| Coordinates workflow | Orchestration |
| Helps navigate the framework | Utility |

### Step 3: Define Purpose and Scope

Write a clear purpose:
```markdown
## Purpose
[What this skill accomplishes and why it matters]

## When to Use
- [Scenario 1]
- [Scenario 2]
- [Scenario 3]
```

### Step 4: Specify Inputs and Outputs

Be explicit about what the skill needs and produces:

```markdown
## Inputs Required
- **[Input 1]**: [Description]
- **[Input 2]**: [Description]
- **[Input 3]**: [Description]

## Outputs Produced
- [Output 1]
- [Output 2]
- [Output 3]
```

### Step 5: Create Invocation Format

Show how personas reference and use this skill:

```markdown
## Invocation
```
[Applying skill-name skill]
Parameter1: {value}
Parameter2: {value}
Parameter3: {value}
```
```

### Step 6: Document Constraints

List limitations and boundaries:

```markdown
## Constraints
- [Limitation 1]
- [Limitation 2]
- [Limitation 3]
```

### Step 7: Provide Example Usage

Show concrete examples with context:

```markdown
## Example Usage

**Scenario**: [Description of when/why the skill is used]

```
[Persona applying skill-name skill]
[Invocation details]

Results:
- [Result 1]
- [Result 2]
```
```

### Step 8: Map to Personas and Related Skills

```markdown
## Recommended Personas
- **[Persona 1]**: [Why this persona uses this skill]
- **[Persona 2]**: [Why this persona uses this skill]

## Related Skills
- `[skill-1]`: [Relationship/when to use together]
- `[skill-2]`: [Relationship/when to use together]
```

## Template

```markdown
# [Skill Name]

## Purpose
[What this skill accomplishes and why it matters - 1-2 sentences]

## When to Use
- [Scenario 1]
- [Scenario 2]
- [Scenario 3]

## Inputs Required
- **[Input 1]**: [Description]
- **[Input 2]**: [Description]
- **[Input 3]**: [Description]

## Outputs Produced
- [Output 1]
- [Output 2]
- [Output 3]

## Invocation
```
[Applying skill-name skill]
Parameter1: {value}
Parameter2: {value}
```

## Constraints
- [Limitation 1]
- [Limitation 2]
- [Limitation 3]

## Example Usage

**Scenario**: [Context for this example]

```
[Persona applying skill-name skill]
[Invocation with concrete values]

Results:
- [Concrete result 1]
- [Concrete result 2]
```

## Recommended Personas
- **[Persona]**: [Why they use this skill]
- **[Persona]**: [Why they use this skill]

## Related Skills
- `[skill-name]`: [How it relates]
- `[skill-name]`: [How it relates]
```

## Checklist Before Submission

- [ ] Skill addresses a genuine capability gap
- [ ] All template sections are complete
- [ ] At least one concrete example provided
- [ ] Constraints clearly documented
- [ ] Recommended personas identified
- [ ] Related skills mapped
- [ ] File follows naming convention: `skill-name.md` (lowercase, hyphenated)
- [ ] File is in correct category folder

## Files to Update

After creating your skill:

1. **Toolset** - Add to `skills/toolset.md` index table
2. **Manifest** - Add entry to `ai-mantras-manifest.yaml`
3. **Persona files** - Add to relevant personas' "Available Skills" sections
4. **Skill affinity matrix** - Update table in `toolset.md`

## MCP Server Updates

If your skill should be accessible via the MCP server:

1. Add skill metadata to the manifest
2. Ensure the content-loader can find and parse the skill file
3. Test with `get_skill` tool
4. See [Extending the MCP Server](extending-mcp-server.md) for details

## Common Mistakes to Avoid

### 1. Overlapping with Existing Skills
Check `toolset.md` thoroughly. If your skill is 80% similar to an existing skill, consider extending that skill's documentation instead.

### 2. Too Broad
**Wrong:** "Analysis" (covers too much)
**Right:** "Financial-modeling" (specific, focused)

### 3. Too Narrow
**Wrong:** "S&P-500-analysis" (too specific)
**Right:** "Data-analysis" (broadly applicable)

### 4. Missing Constraints
Skills should be honest about limitations. Don't promise capabilities that depend on external factors.

### 5. No Persona Mapping
Skills exist to serve personas. Always identify which personas would use the skill.

## Examples to Study

| Skill | Notable For |
|-------|-------------|
| `research/web-search.md` | Clear invocation format, good constraints |
| `analysis/risk-assessment.md` | Strong persona mapping |
| `orchestration/handoff.md` | Integration with workflow |
| `evaluation/quality-check.md` | Evaluation methodology |
