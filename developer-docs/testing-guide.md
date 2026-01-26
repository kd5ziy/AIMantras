# Testing Guide

This guide explains how to validate new components in the AI Mantras framework. Testing ensures your contributions work correctly and integrate well with existing components.

## Overview

AI Mantras uses multiple validation approaches:

| Component Type | Testing Method |
|----------------|----------------|
| Personas | Manual validation + scenario testing |
| Patterns | Structure verification + application testing |
| Skills | Functional validation + integration testing |
| MCP Server | Automated tests (`npm test`) |

## Testing Philosophy

AI Mantras components are primarily prompts and documentation. Traditional unit testing doesn't fully apply. Instead, we use:

1. **Structure verification** - Does it follow the template?
2. **Consistency checking** - Does it integrate with existing components?
3. **Scenario testing** - Does it work in realistic situations?
4. **Principle alignment** - Does it embody guiding principles?

## Testing Personas

### 1. Structure Verification

Check that all required sections are present:

- [ ] Purpose (1-2 sentences)
- [ ] Domain Expertise (4-6 bullet points)
- [ ] Style & Tone (1-2 sentences)
- [ ] Rules & Constraints (4-6 rules)
- [ ] Recommended Patterns (3-4 patterns with usage notes)
- [ ] Available Skills (primary and secondary)
- [ ] Example Invocations (at least 2)
- [ ] Output Expectations (4-5 points)
- [ ] Failure Modes to Avoid (3-5 items)

### 2. Consistency Checking

Verify integration with existing components:

- [ ] Referenced patterns exist in `Prompt-AI-Mantras/patterns/`
- [ ] Referenced skills exist in `Prompt-AI-Mantras/skills/`
- [ ] Category placement is correct (orchestration/domain/evaluation)
- [ ] File naming follows convention: `Name-Role.md`

### 3. Scenario Testing

Test the persona with a realistic task:

```
Task: [Description matching persona's domain]
Persona: [Your new persona]
Patterns: [Recommended patterns from persona]

Expected behavior:
- Uses domain expertise appropriately
- Follows stated rules and constraints
- Produces output matching expectations
- Avoids documented failure modes
```

**Example scenario test for a financial persona:**
```
Task: Analyze whether to invest $10,000 in index funds vs. individual stocks
Persona: Clara
Patterns: rule-based reasoning + chain-of-thought

Expected:
- States uncertainty and risk ranges upfront
- Compares at least two scenarios
- Cites assumptions behind recommendations
- Ends with action checklist
```

### 4. Principle Alignment

Verify the persona embodies guiding principles without announcing them:

- [ ] **Wisdom**: Encourages deep, contextual thinking
- [ ] **Justice**: Treats stakeholders fairly, avoids partisan positions
- [ ] **Courage**: Provides honest perspective, warns about risks
- [ ] **Temperance**: Avoids extremes, respects uncertainty
- [ ] **Internalized**: Principles shape behavior without explicit mention

## Testing Patterns

### 1. Structure Verification

Check required sections:

- [ ] Purpose (what and why)
- [ ] When to Use (scenarios)
- [ ] Structure/Template (clear stages)
- [ ] Examples (at least 2, different domains)
- [ ] Combination Guidance (how to use with other patterns)
- [ ] Failure Modes (common mistakes)

### 2. Template Testability

Verify the template can be followed:

- [ ] Stages are clearly labeled
- [ ] Each stage has distinct purpose
- [ ] Stages flow logically
- [ ] Template applies across multiple domains

### 3. Application Testing

Apply the pattern to a real task:

```
Task: [Task description]
Pattern: [Your new pattern]

Step through each stage:
- Stage 1: [Can you complete this stage?]
- Stage 2: [Does it follow logically?]
- Stage 3: [Is the output useful?]
...

Verify:
- All stages are necessary
- No stages are missing
- Output is higher quality than without the pattern
```

### 4. Integration Testing

Test with existing personas:

- [ ] Works with at least 2 different personas
- [ ] Complements (doesn't duplicate) existing patterns
- [ ] Combination guidance is accurate

## Testing Skills

### 1. Structure Verification

Check required sections:

- [ ] Purpose
- [ ] When to Use
- [ ] Inputs Required
- [ ] Outputs Produced
- [ ] Invocation format
- [ ] Constraints
- [ ] Example Usage
- [ ] Recommended Personas
- [ ] Related Skills

### 2. Functional Validation

Verify the skill description is actionable:

- [ ] Inputs are clearly specified
- [ ] Outputs are well-defined
- [ ] Invocation format is followable
- [ ] Constraints are realistic
- [ ] Example shows concrete usage

### 3. Integration Testing

Test with assigned personas:

```
Persona: [Recommended persona]
Skill: [Your new skill]
Task: [Task requiring this skill]

Verify:
- Persona can invoke the skill using documented format
- Skill produces expected outputs
- Constraints are respected
```

## Testing MCP Server Changes

### Automated Tests

Run the full test suite:

```bash
cd ai-mantras-mcp
npm run build
npm test
```

Expected output:
```
Running content tests...
  ✓ should load principles
  ✓ should load all personas
  ...

Running tool tests...
  ✓ assess_complexity - simple request
  ✓ get_persona - by exact name
  ...

All tests passed: 59/59
```

### Adding New Tests

For new tools, add tests to `test-tools.js`:

```javascript
describe('your_tool_name', () => {
  it('should handle valid input', async () => {
    const result = await callTool('your_tool_name', {
      param: 'value',
    });
    assert(result.includes('expected'));
  });

  it('should handle edge case', async () => {
    // Test edge cases
  });

  it('should fail gracefully', async () => {
    try {
      await callTool('your_tool_name', { invalid: 'input' });
      assert.fail('Should have thrown');
    } catch (e) {
      assert(e.message.includes('expected error'));
    }
  });
});
```

### Manual MCP Testing

Test tools interactively:

```bash
# Start the server
npm run build && node dist/index.js

# In another terminal, use a MCP client or test script
node test-manual.js
```

## Integration Testing

### Full Workflow Validation

Test that new components work in the complete AI Mantras workflow:

```
1. Triage (assess_complexity)
   - Does your component affect complexity assessment?

2. Planning (orchestration personas)
   - Can orchestrators reference your component?

3. Execution (domain personas)
   - Can domain personas use your component effectively?

4. Evaluation (evaluation personas)
   - Can evaluators assess work using your component?
```

### Cross-Component Testing

Verify your component works with related components:

| If you added... | Test with... |
|-----------------|--------------|
| New persona | Its recommended patterns and skills |
| New pattern | Personas that should use it |
| New skill | Personas in the affinity matrix |
| New tool | Resources it depends on |

## Common Issues and Solutions

### Issue: Pattern Stages Are Unclear

**Symptom:** Testers can't figure out what to do at a stage
**Solution:** Add more specific guidance and examples for each stage

### Issue: Persona Rules Conflict

**Symptom:** Following one rule violates another
**Solution:** Revise rules to be mutually consistent

### Issue: Skill Inputs Are Ambiguous

**Symptom:** Different personas interpret inputs differently
**Solution:** Add explicit descriptions and examples for each input

### Issue: MCP Tests Fail

**Symptom:** `npm test` reports failures
**Solution:** Check that:
- TypeScript compiles (`npm run build`)
- Content files exist at expected paths
- Manifest includes new components

## Pre-Submission Checklist

Before submitting any contribution:

- [ ] All structure requirements met
- [ ] Consistency with existing components verified
- [ ] At least one realistic scenario tested
- [ ] Guiding principles alignment checked
- [ ] For MCP changes: `npm test` passes
- [ ] Related files updated (manifest, indexes)
- [ ] Documentation is clear and complete

## Quick Reference

### Test Commands

```bash
# MCP server tests
cd ai-mantras-mcp
npm run build
npm test

# Run specific test
npm test -- --grep "tool_name"
```

### Key Files to Check

| Component | Files to Verify |
|-----------|-----------------|
| Persona | Pattern files, skill files, manifest |
| Pattern | Manifest, persona references |
| Skill | Toolset.md, manifest, persona skills sections |
| MCP Tool | tests, README, index.ts |

### Validation Questions

1. Does it follow the template?
2. Does it integrate with existing components?
3. Does it work in realistic scenarios?
4. Does it embody guiding principles?
5. Do all tests pass?
