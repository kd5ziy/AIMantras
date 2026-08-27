# Agentic Loop Pattern

## Purpose
- Structures iterative work as explicit plan → act → observe → refine cycles instead of single-pass answers.
- Covers both tool-driven loops (act on the environment, read the result, adjust) and evaluator-optimizer loops (generate, critique against criteria, revise until pass or budget).
- Makes stopping conditions explicit so loops converge instead of running away.

## When to Use
- The task requires acting on an environment and reacting to results (running tests, calling tools, querying data).
- Output quality is measurable and a draft can be improved by critique (writing, code, plans).
- A single response is unlikely to be correct on the first attempt.
- An autonomous or semi-autonomous agent must work toward a goal across multiple steps.

## Structure / Template
```text
[GOAL]
- State the objective and the success criteria that end the loop.
- Set a budget: max iterations N and/or a cost/time limit.

[LOOP] (repeat until success criteria met OR budget exhausted)
1. PLAN    - Decide the single next action toward the goal.
2. ACT     - Execute it (tool call, draft, calculation).
3. OBSERVE - Record the actual result. No assumptions about outcomes.
4. EVALUATE - Compare result to success criteria.
   - Met -> exit loop with result.
   - Not met -> note the gap; feed it into the next PLAN step.

[EXIT]
- Report: final output, iterations used, criteria status.
- If budget exhausted before success: report best attempt + remaining gaps.
```

**Evaluator-optimizer variant:** step 2 generates a full candidate output; step 4 is a structured critique (optionally by a different persona, e.g. Ada); the next iteration revises only the flagged gaps.

## Examples
**Technical (failing test fix):**
```text
[GOAL] All unit tests pass. Budget: 5 iterations.
Iter 1: PLAN run test suite / ACT npm test / OBSERVE 3 failures in parser / EVALUATE not met.
Iter 2: PLAN fix null-input handling / ACT patch parser / OBSERVE 1 failure remains / EVALUATE not met.
Iter 3: PLAN fix date edge case / ACT patch + rerun / OBSERVE 0 failures / EVALUATE met -> exit.
```

**Creative (executive summary, evaluator-optimizer):**
```text
[GOAL] 300-word summary; criteria: covers 3 findings, plain language, no hype. Budget: 3 rounds.
Round 1: draft -> critique: finding 2 missing, jargon in para 2.
Round 2: revise -> critique: all criteria met -> exit with round-2 draft.
```

## Combination Guidance
- Define exit criteria with `patterns/criterion-based-evaluation.md` so EVALUATE is measurable, not vibes.
- Use `patterns/recursive-self-eval.md` as the critique step in the evaluator-optimizer variant.
- Wrap a loop inside `patterns/orchestration.md` or `patterns/graph-orchestration.md` when the worker node needs iteration.
- Start with `patterns/planning-phase.md` when the goal itself is ambiguous — the loop refines execution, not requirements.

## Failure Modes
- No explicit success criteria: the loop drifts or polishes forever.
- No iteration budget: runaway loops burning time and tokens.
- OBSERVE skipped or fabricated: the agent assumes an action worked instead of checking the actual result.
- Critique and revision done in one breath, so the "evaluation" always approves its own work.
- Restarting from scratch each iteration instead of carrying forward what already passed.
