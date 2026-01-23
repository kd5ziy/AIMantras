# Contributing to AI Mantras

Thank you for your interest in contributing to AI Mantras. This framework is built collaboratively with AI and human contributors working together. Your contributions help expand the cognitive toolkit available for AI collaboration.

## Quick Links

| Guide | Purpose |
|-------|---------|
| [Developer Documentation](developer-docs/README.md) | Full documentation index |
| [Creating Personas](developer-docs/creating-personas.md) | Step-by-step persona creation |
| [Creating Patterns](developer-docs/creating-patterns.md) | How to add reasoning patterns |
| [Creating Skills](developer-docs/creating-skills.md) | How to add actionable skills |
| [Extending MCP Server](developer-docs/extending-mcp-server.md) | Technical MCP modifications |
| [Testing Guide](developer-docs/testing-guide.md) | Validating your contributions |
| [AI Collaborative Development](developer-docs/ai-collaborative-development.md) | Our development philosophy |

## Getting Started

1. **Read the philosophy** - Start with [AI Collaborative Development](developer-docs/ai-collaborative-development.md) to understand how we build AI Mantras with AI
2. **Review existing components** - Study 2-3 examples in the category you want to contribute to
3. **Choose your contribution** - See "What We're Looking For" below
4. **Follow the guide** - Use the appropriate guide from the table above

## Branch Naming

Create a branch for your contribution:

```bash
git checkout -b <type>/<description>
```

| Type | When to Use | Example |
|------|-------------|---------|
| `feature/` | New personas, patterns, or skills | `feature/new-persona-judge` |
| `fix/` | Bug fixes or corrections | `fix/clara-typo` |
| `docs/` | Documentation improvements | `docs/improve-readme` |
| `refactor/` | Code restructuring | `refactor/mcp-tools` |

## What We're Looking For

### High Priority

- **New personas** - Domain experts, orchestrators, or evaluators that fill gaps
- **New patterns** - Reasoning structures that complement existing ones
- **New skills** - Capabilities that expand what personas can do
- **MCP improvements** - Tools, resources, or performance enhancements

### Always Welcome

- **Bug fixes** - Corrections to existing content
- **Documentation** - Clarity and completeness improvements
- **Examples** - Real-world usage examples in `projects/`
- **Testing** - Validation scenarios and test coverage

## Pull Request Process

1. **Create your branch** using the naming convention above
2. **Make your changes** following the appropriate guide
3. **Update related files** (manifest, indexes, etc.)
4. **Test your changes** using the [Testing Guide](developer-docs/testing-guide.md)
5. **Push and create PR** with a clear description

```bash
git push origin feature/your-feature-name
```

### PR Description Template

```markdown
## Summary
[Brief description of what this PR adds/changes]

## Type
- [ ] New persona
- [ ] New pattern
- [ ] New skill
- [ ] MCP enhancement
- [ ] Bug fix
- [ ] Documentation

## Checklist
- [ ] Followed the relevant creation guide
- [ ] Updated manifest (if applicable)
- [ ] Updated index files (if applicable)
- [ ] Tested changes
- [ ] All existing tests pass

## Related Issues
[Link any related issues]
```

## Code of Conduct

We maintain a respectful, collaborative environment:

- **Be constructive** - Feedback should help improve contributions
- **Be inclusive** - Welcome contributors of all backgrounds
- **Be patient** - Not everyone has the same context or experience
- **Be honest** - If something doesn't work, say so kindly

The guiding principles in `Prompt-AI-Mantras/principles/guiding-principles.md` apply to our community interactions as well as to the framework itself.

## Questions?

- **GitHub Issues** - For bugs, feature requests, or questions
- **Pull Request Comments** - For contribution-specific discussions
- **Email** - [kd5ziy@gmail.com](mailto:kd5ziy@gmail.com) for other inquiries

## License

By contributing, you agree that your contributions will be licensed under the [Mozilla Public License 2.0](LICENSE).
