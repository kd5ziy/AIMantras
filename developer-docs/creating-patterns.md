# Creating Patterns

This guide explains how to create new reasoning patterns for the AI Mantras framework. Patterns are the **HOW** - reusable thinking structures that personas invoke to approach problems systematically.

## Overview

Patterns formalize reasoning approaches that humans already use:

| Pattern Type | Human Equivalent | Example |
|-------------|-----------------|---------|
| Layer 1 (Foundational) | "How do I organize this?" | planning-phase, orchestration |
| Layer 2 (Thinking) | "How do I reason through this?" | chain-of-thought, rule-based |
| Layer 3 (Evaluation) | "How do I check this?" | criterion-based-evaluation |

A good pattern:
- Provides clear structure that can be followed consistently
- Applies across multiple domains and personas
- Complements (not duplicates) existing patterns
- Has well-defined inputs and outputs

## Prerequisites

Before creating a pattern:

1. **Review existing patterns** - All 11 patterns in `Prompt-AI-Mantras/patterns/`
2. **Understand the layers** - Foundation (L1), Thinking (L2), Evaluation (L3)
3. **Check persona needs** - What reasoning gap are personas experiencing?
4. **Read guiding principles** - Patterns must align with framework values

## Current Pattern Inventory

| Layer | Pattern | Purpose |
|-------|---------|---------|
| L1 | planning-phase | Structure task planning |
| L1 | orchestration | Coordinate multi-persona workflows |
| L1 | recursive-self-eval | Self-review and correction |
| L1 | meta-rules | Define behavioral constraints |
| L2 | chain-of-thought | Staged, transparent reasoning |
| L2 | rule-based-reasoning | Logic anchored to explicit rules |
| L2 | guardrail-creative | Creative work within boundaries |
| L3 | criterion-based-evaluation | Evaluate against success criteria |
| L3 | threat-modeling | Proactive risk and failure discovery |

## Step-by-Step Creation Process

### Step 1: Identify the Gap

Ask:
- What reasoning approach is missing?
- Which personas need this pattern?
- Why can't existing patterns handle this need?

**Good reasons to create a new pattern:**
- A distinct reasoning style not covered by existing patterns
- Multiple personas would benefit from the same structure
- Current patterns don't adequately address a common task type

**Consider extending existing patterns if:**
- The need is a minor variation on an existing pattern
- Only one persona would use it (might be a rule, not a pattern)

### Step 2: Determine the Layer

| Layer | When to Use |
|-------|-------------|
| **Layer 1 (Foundational)** | Workflow organization, coordination, self-management |
| **Layer 2 (Thinking)** | Domain reasoning, problem-solving approaches |
| **Layer 3 (Evaluation)** | Assessment, validation, quality checking |

### Step 3: Define Purpose and Scope

Write a clear purpose statement:
- What does this pattern accomplish?
- When should personas use it?
- What problems does it solve?

```markdown
## Purpose
- [What the pattern accomplishes]
- [How it helps personas]

## When to Use
- [Scenario 1]
- [Scenario 2]
- [Scenario 3]
```

### Step 4: Create the Structure/Template

This is the core of the pattern - a template personas follow:

```markdown
## Structure / Template
```text
[STAGE 1: Name]
Description of what happens in this stage.

[STAGE 2: Name]
Description of what happens in this stage.

[STAGE 3: Name]
Description of what happens in this stage.
```
```

Design principles:
- Use clear stage names
- Each stage should have a distinct purpose
- Stages should flow logically
- The template should work across domains

### Step 5: Provide Examples

Include 2-3 examples showing the pattern in different contexts:

```markdown
## Examples
**[Domain 1] example:**
```text
[Stage 1 content]
[Stage 2 content]
...
```

**[Domain 2] example:**
```text
[Stage 1 content]
[Stage 2 content]
...
```
```

### Step 6: Add Combination Guidance

Explain how this pattern works with other patterns:

```markdown
## Combination Guidance
- Pair with `patterns/[pattern].md` when [situation].
- Use before `patterns/[pattern].md` to [benefit].
- Combine with `patterns/[pattern].md` for [use case].
```

### Step 7: Document Failure Modes

List common mistakes when using this pattern:

```markdown
## Failure Modes
- [Mistake 1 and why it's problematic]
- [Mistake 2 and why it's problematic]
- [Mistake 3 and why it's problematic]
```

## Template

```markdown
# [Pattern Name] Pattern

## Purpose
- [Primary purpose]
- [Secondary benefit]

## When to Use
- [Scenario 1]
- [Scenario 2]
- [Scenario 3]

## Structure / Template
```text
[STAGE 1: Name]
[Description of stage 1]

[STAGE 2: Name]
[Description of stage 2]

[STAGE 3: Name]
[Description of stage 3]

[STAGE 4: Name]
[Description of stage 4]
```

## Examples
**[Domain] example:**
```text
[Example content following the template]
```

**[Different domain] example:**
```text
[Example content following the template]
```

## Combination Guidance
- Pair with `patterns/[pattern].md` [when/why].
- Use with `patterns/[pattern].md` [when/why].

## Failure Modes
- [Failure mode 1]
- [Failure mode 2]
- [Failure mode 3]
```

## Checklist Before Submission

- [ ] Pattern addresses a genuine gap (not duplicate of existing)
- [ ] Purpose is clearly defined
- [ ] Structure/template is complete and followable
- [ ] At least 2 examples from different domains
- [ ] Combination guidance references existing patterns
- [ ] Failure modes are specific and actionable
- [ ] Pattern aligns with guiding principles
- [ ] File name follows convention: `pattern-name.md` (lowercase, hyphenated)

## Files to Update

After creating your pattern:

1. **Manifest** - Add entry to `ai-mantras-manifest.yaml`
2. **Agents** - Update pattern count in `development/agents.md`
3. **Personas** - Consider which personas should reference this pattern

## Common Mistakes to Avoid

### 1. Too Specific
**Wrong:** A pattern that only applies to financial DCF analysis
**Right:** A pattern that applies to any multi-stage analytical problem

### 2. Too Vague
**Wrong:** "Think carefully about the problem"
**Right:** Clear stages with specific guidance for each

### 3. Duplicating Existing Patterns
Before creating, ask: "Could I achieve this by combining existing patterns?"

### 4. Ignoring Integration
Patterns should work with other patterns. Document combination guidance.

### 5. No Examples
Examples make patterns concrete. Always include at least 2 from different domains.

## Examples to Study

| Pattern | Notable For |
|---------|-------------|
| `chain-of-thought.md` | Clear 5-stage structure, good examples |
| `threat-modeling.md` | Domain-specific but broadly applicable |
| `recursive-self-eval.md` | Self-referential structure |
| `criterion-based-evaluation.md` | Evaluation methodology |
