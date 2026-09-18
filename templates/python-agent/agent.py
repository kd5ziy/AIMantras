#!/usr/bin/env python3
"""AI Mantras agent template — turn any persona .md into a runnable agent.

Usage:
    # Inspect the assembled prompt without any SDK or API key:
    python agent.py --persona ../../Prompt-AI-Mantras/personas/orchestration/Bernstein-Orchestrator.md --dry-run

    # Chat with the persona via Anthropic (pip install -e ".[anthropic]"):
    python agent.py --persona path/to/Persona.md --provider anthropic

    # Add thinking patterns and principles:
    python agent.py --persona path/to/Persona.md \
        --patterns ../../Prompt-AI-Mantras/patterns/agentic-loop.md \
        --principles ../../Prompt-AI-Mantras/principles/guiding-principles.md

This is a reference template, not a runtime: one persona, one chat loop, one
example tool. For multi-agent orchestration, see the Mantras Engine project.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from adapters import Message, ToolSpec, get_adapter
from persona import build_system_prompt, load_persona

# --- Example tool -----------------------------------------------------------
# One tool is included to show the full request -> tool call -> result loop.
# Replace or extend TOOLS and dispatch_tool() with your own capabilities.

TOOLS = [
    ToolSpec(
        name="read_file",
        description="Read a UTF-8 text file from the current working directory tree.",
        parameters={
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "Relative path to the file to read.",
                }
            },
            "required": ["path"],
        },
    )
]

MAX_TOOL_RESULT_CHARS = 20_000


def dispatch_tool(name: str, arguments: dict) -> str:
    if name == "read_file":
        root = Path.cwd().resolve()
        target = (root / arguments["path"]).resolve()
        if not target.is_relative_to(root):
            return "Error: path escapes the working directory."
        if not target.is_file():
            return f"Error: no such file: {arguments['path']}"
        return target.read_text(encoding="utf-8", errors="replace")[
            :MAX_TOOL_RESULT_CHARS
        ]
    return f"Error: unknown tool '{name}'"


# --- Agent loop -------------------------------------------------------------

MAX_TOOL_ROUNDS = 10


def run_turn(adapter, system: str, history: list[Message]) -> str:
    """One user turn: call the model, satisfy tool calls, return final text."""
    for _ in range(MAX_TOOL_ROUNDS):
        response = adapter.complete(system, history, tools=TOOLS)
        if not response.tool_calls:
            history.append(Message(role="assistant", content=response.text))
            return response.text
        history.append(
            Message(
                role="assistant",
                content=response.text
                or json.dumps(
                    [{"tool": c.name, "args": c.arguments} for c in response.tool_calls]
                ),
            )
        )
        for call in response.tool_calls:
            print(f"  [tool] {call.name}({json.dumps(call.arguments)})")
            result = dispatch_tool(call.name, call.arguments)
            history.append(
                Message(role="tool", content=result, tool_call_id=call.id)
            )
    return "(stopped: tool-call round limit reached)"


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Run an AI Mantras persona as a standalone agent."
    )
    parser.add_argument("--persona", required=True, help="Path to a persona .md file")
    parser.add_argument(
        "--patterns",
        action="append",
        default=[],
        help="Path to a pattern .md file (repeatable)",
    )
    parser.add_argument("--principles", help="Path to guiding-principles.md")
    parser.add_argument(
        "--provider",
        choices=["anthropic", "openai", "mock"],
        default="mock",
        help="LLM provider (default: mock)",
    )
    parser.add_argument("--model", help="Model override for the chosen provider")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the assembled system prompt and exit (no API calls)",
    )
    args = parser.parse_args()

    persona = load_persona(args.persona)
    system = build_system_prompt(
        persona, patterns=args.patterns, principles=args.principles
    )

    if args.dry_run:
        print(system)
        print(
            f"\n[dry-run] persona: {persona.name}"
            + (f" ({persona.role})" if persona.role else "")
            + f" | system prompt: {len(system)} chars | tools: "
            + ", ".join(t.name for t in TOOLS)
        )
        return

    adapter = get_adapter("mock" if args.dry_run else args.provider, model=args.model)
    label = persona.name or "agent"
    print(f"Chatting with {label}. Ctrl-D or 'exit' to quit.\n")

    history: list[Message] = []
    while True:
        try:
            user_input = input("you> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if not user_input or user_input.lower() in {"exit", "quit"}:
            break
        history.append(Message(role="user", content=user_input))
        reply = run_turn(adapter, system, history)
        print(f"\n{label}> {reply}\n")


if __name__ == "__main__":
    main()
