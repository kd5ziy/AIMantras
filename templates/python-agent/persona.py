"""Persona loading and system-prompt assembly.

Mirrors the section order used by the AI Mantras MCP server's prompt builder
(ai-mantras-mcp/src/utils/prompt-builder.ts):

    Guiding Principles -> Persona Definition -> Thinking Patterns -> Context Notice

joined with '---' separators. A persona markdown file from
Prompt-AI-Mantras/personas/ needs no modification to be used here.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

SECTION_SEPARATOR = "\n\n---\n\n"

CONTEXT_NOTICE = """## Important: Operating Context

You are a standalone agent embodying the persona defined above. Stay within
the persona's Rules & Constraints and Output Expectations at all times. If a
request falls outside your persona's domain expertise, say so rather than
improvising beyond your role."""


@dataclass
class Persona:
    name: str
    role: str
    content: str
    path: Path


def load_persona(path: str | Path) -> Persona:
    """Read a persona .md file and extract its name/role from the H1 heading.

    Persona headings follow '# Name – Role' (en dash), e.g.
    '# Bernstein – Orchestrator'. Falls back to the filename if no heading.
    """
    path = Path(path)
    content = path.read_text(encoding="utf-8")

    name, role = path.stem, ""
    for line in content.splitlines():
        if line.startswith("# "):
            heading = line[2:].strip()
            for dash in ("–", "—", "-"):
                if dash in heading:
                    name, _, role = (part.strip() for part in heading.partition(dash))
                    break
            else:
                name = heading
            break

    return Persona(name=name, role=role, content=content, path=path)


def build_system_prompt(
    persona: Persona,
    patterns: list[str | Path] | None = None,
    principles: str | Path | None = None,
) -> str:
    """Assemble the full system prompt for the agent.

    patterns: paths to pattern .md files from Prompt-AI-Mantras/patterns/
    principles: path to the guiding principles .md (optional but recommended)
    """
    sections: list[str] = []

    if principles:
        principles_text = Path(principles).read_text(encoding="utf-8")
        sections.append(
            f"## Guiding Principles (Internalize These)\n\n{principles_text}"
        )

    sections.append(f"## Your Persona: {persona.name}\n\n{persona.content}")

    if patterns:
        pattern_sections = []
        for pattern_path in patterns:
            pattern_path = Path(pattern_path)
            pattern_text = pattern_path.read_text(encoding="utf-8")
            pattern_sections.append(f"### {pattern_path.stem}\n\n{pattern_text}")
        sections.append(
            "## Thinking Patterns to Apply\n\n" + "\n\n".join(pattern_sections)
        )

    sections.append(CONTEXT_NOTICE)

    return SECTION_SEPARATOR.join(sections)
