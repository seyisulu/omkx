# Contributing to omkx

Thank you for your interest in contributing to omkx! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Issues

When reporting issues, please include:
- A clear description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Node.js version, Kiro version)

### Suggesting Enhancements

For feature requests, please describe:
- The problem the feature solves
- How you envision it working
- Any alternatives you've considered
- How it fits within the omkx architecture

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add or update tests as needed
5. Ensure the install script works: `bash install.sh`
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style (formatting, etc.)
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks

### Agent Guidelines

When contributing new agents or modifying existing ones:

1. **Agent Config (`.kiro/agents/{name}.json`)**:
   - Follow the existing JSON schema
   - Set appropriate tool restrictions
   - Configure keyboard shortcuts for main agents
   - Add descriptive welcome messages

2. **Agent Prompt (`.kiro/prompts/{name}.md`)**:
   - Include: Identity, What You ARE/ARE NOT, Workflow, MUST DO/MUST NOT DO
   - Use the delegation format for agents that delegate
   - Write clear, specific instructions

3. **Steering Files**:
   - Update `product.md` for new agents
   - Update `architecture.md` for new flows
   - Update `conventions.md` for new patterns

### Skill Guidelines

Skills should be focused and practical:

1. Create `SKILL.md` in `.kiro/skills/{skill-name}/`
2. Include clear guidance, not abstract principles
3. Provide concrete checklists and templates
4. Reference skill in relevant agent prompts

### Testing

Before submitting:
1. Run `bash install.sh` to verify installation
2. Check that all agent configs are valid JSON
3. Verify all prompt files are referenced correctly
4. Test agent keyboard shortcuts in Kiro

### Code of Conduct

- Be respectful and constructive
- Focus on the technical merits of contributions
- Help others learn and improve

## Project Structure

```
omkx/
├── .kiro/
│   ├── agents/          # JSON agent configurations
│   ├── prompts/         # Markdown prompt files
│   ├── hooks/           # Shell hook scripts
│   ├── skills/          # Shared skill definitions
│   ├── steering/omkx/   # System configuration docs
│   └── settings/        # MCP and tool settings
├── bin/
│   └── cli.mjs          # CLI tool
├── install.sh           # Installation script
└── package.json         # npm package config
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
