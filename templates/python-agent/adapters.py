"""LLM provider adapters for the AI Mantras agent template.

The agent core talks to a single `LLMAdapter` protocol. Each provider is a
small adapter class; adding a provider means implementing one method. SDKs
are imported lazily so the template runs (in mock/dry-run mode) with zero
dependencies installed.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, field
from typing import Protocol


@dataclass
class Message:
    """One turn of conversation. role is 'user', 'assistant', or 'tool'."""

    role: str
    content: str
    # For role='tool': the id of the tool call this message answers.
    tool_call_id: str | None = None


@dataclass
class ToolSpec:
    """Provider-neutral tool definition (JSON Schema parameters)."""

    name: str
    description: str
    parameters: dict


@dataclass
class ToolCall:
    """A tool invocation requested by the model."""

    id: str
    name: str
    arguments: dict


@dataclass
class AdapterResponse:
    """What every adapter returns from complete()."""

    text: str
    tool_calls: list[ToolCall] = field(default_factory=list)
    stop_reason: str = "end_turn"


class LLMAdapter(Protocol):
    """The one interface the agent core depends on."""

    def complete(
        self,
        system: str,
        messages: list[Message],
        tools: list[ToolSpec] | None = None,
    ) -> AdapterResponse: ...


class MockAdapter:
    """No-network adapter. Powers --dry-run and lets you test the loop
    without any SDK or API key installed."""

    def complete(self, system, messages, tools=None):
        last = messages[-1].content if messages else "(no input)"
        summary = (
            f"[mock] system prompt: {len(system)} chars; "
            f"{len(messages)} message(s); "
            f"tools: {[t.name for t in tools] if tools else 'none'}.\n"
            f"[mock] echoing last input: {last}"
        )
        return AdapterResponse(text=summary)


class AnthropicAdapter:
    """Adapter for the Anthropic API (Claude models)."""

    DEFAULT_MODEL = "claude-sonnet-5"

    def __init__(self, model: str | None = None, max_tokens: int = 4096):
        try:
            import anthropic
        except ImportError as exc:
            raise SystemExit(
                "The 'anthropic' package is not installed. "
                'Run: pip install -e ".[anthropic]"'
            ) from exc
        if not os.environ.get("ANTHROPIC_API_KEY"):
            raise SystemExit("Set the ANTHROPIC_API_KEY environment variable.")
        self.client = anthropic.Anthropic()
        self.model = model or self.DEFAULT_MODEL
        self.max_tokens = max_tokens

    def complete(self, system, messages, tools=None):
        api_messages = []
        for m in messages:
            if m.role == "tool":
                api_messages.append(
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "tool_result",
                                "tool_use_id": m.tool_call_id,
                                "content": m.content,
                            }
                        ],
                    }
                )
            else:
                api_messages.append({"role": m.role, "content": m.content})

        kwargs = {}
        if tools:
            kwargs["tools"] = [
                {
                    "name": t.name,
                    "description": t.description,
                    "input_schema": t.parameters,
                }
                for t in tools
            ]

        response = self.client.messages.create(
            model=self.model,
            max_tokens=self.max_tokens,
            system=system,
            messages=api_messages,
            **kwargs,
        )

        text_parts = []
        tool_calls = []
        for block in response.content:
            if block.type == "text":
                text_parts.append(block.text)
            elif block.type == "tool_use":
                tool_calls.append(
                    ToolCall(id=block.id, name=block.name, arguments=dict(block.input))
                )
        return AdapterResponse(
            text="\n".join(text_parts),
            tool_calls=tool_calls,
            stop_reason=response.stop_reason or "end_turn",
        )


class OpenAIAdapter:
    """Adapter for the OpenAI API (or any OpenAI-compatible endpoint)."""

    DEFAULT_MODEL = "gpt-4o"

    def __init__(self, model: str | None = None, max_tokens: int = 4096):
        try:
            import openai
        except ImportError as exc:
            raise SystemExit(
                "The 'openai' package is not installed. "
                'Run: pip install -e ".[openai]"'
            ) from exc
        if not os.environ.get("OPENAI_API_KEY"):
            raise SystemExit("Set the OPENAI_API_KEY environment variable.")
        self.client = openai.OpenAI()
        self.model = model or self.DEFAULT_MODEL
        self.max_tokens = max_tokens

    def complete(self, system, messages, tools=None):
        api_messages = [{"role": "system", "content": system}]
        for m in messages:
            if m.role == "tool":
                api_messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": m.tool_call_id,
                        "content": m.content,
                    }
                )
            else:
                api_messages.append({"role": m.role, "content": m.content})

        kwargs = {}
        if tools:
            kwargs["tools"] = [
                {
                    "type": "function",
                    "function": {
                        "name": t.name,
                        "description": t.description,
                        "parameters": t.parameters,
                    },
                }
                for t in tools
            ]

        response = self.client.chat.completions.create(
            model=self.model,
            max_tokens=self.max_tokens,
            messages=api_messages,
            **kwargs,
        )

        choice = response.choices[0]
        tool_calls = []
        if choice.message.tool_calls:
            for tc in choice.message.tool_calls:
                tool_calls.append(
                    ToolCall(
                        id=tc.id,
                        name=tc.function.name,
                        arguments=json.loads(tc.function.arguments or "{}"),
                    )
                )
        return AdapterResponse(
            text=choice.message.content or "",
            tool_calls=tool_calls,
            stop_reason=choice.finish_reason or "end_turn",
        )


ADAPTERS = {
    "anthropic": AnthropicAdapter,
    "openai": OpenAIAdapter,
    "mock": MockAdapter,
}


def get_adapter(provider: str, model: str | None = None) -> LLMAdapter:
    """Build an adapter by provider name ('anthropic', 'openai', 'mock')."""
    if provider not in ADAPTERS:
        raise SystemExit(
            f"Unknown provider '{provider}'. Choose from: {', '.join(ADAPTERS)}"
        )
    cls = ADAPTERS[provider]
    return cls() if provider == "mock" else cls(model=model)
