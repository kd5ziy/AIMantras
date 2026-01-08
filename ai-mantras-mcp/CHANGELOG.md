# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-08

### Added

- Initial release of AI Mantras MCP server
- **Tools**
  - `assess_complexity` - Triage requests into Simple/Moderate/Complex tiers
  - `get_persona` - Load personas by name or domain matching
  - `get_pattern` - Load thinking patterns by name
  - `get_workflow` - Get workflow steps for complexity tiers
  - `create_handoff` - Generate structured handoff templates between personas
  - `list_available` - List all available personas and patterns
- **Resources** - URI-based access to framework content
  - `mantras://principles` - Guiding principles
  - `mantras://bootstrapper` - Agent bootstrapper
  - `mantras://entry-point` - Main AIMantra.md
  - `mantras://manifest` - Framework manifest (YAML)
  - `mantras://persona/{category}/{name}` - Individual personas
  - `mantras://pattern/{layer}/{name}` - Individual patterns
- **Prompts**
  - `mantras` - Auto-triage and process at appropriate tier
  - `mantras-simple` - Direct answer mode
  - `mantras-moderate` - Structured reasoning with self-review
  - `mantras-complex` - Full orchestration mode
- **Personas** (11 total)
  - Orchestration: Bernstein, Hopper, Lovell
  - Domain: Clara, Kestra, Goeth, Franklin, Watson
  - Evaluation: Ada, Drucker, Rickover
- **Patterns** (9 total)
  - Layer 1: planning-phase, orchestration, recursive-self-eval, meta-rules
  - Layer 2: chain-of-thought, rule-based-reasoning, guardrail-creative
  - Layer 3: criterion-based-evaluation, threat-modeling
- Domain-to-persona matching with 100+ keywords
- Content caching for performance
- Full TypeScript implementation with strict mode
- Test suite with 31 passing tests
