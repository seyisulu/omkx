# omkx — Naming & File Conventions

## Steering Directory
All omkx steering files live under `.kiro/steering/omkx/`. The directory name `omkx` distinguishes it from other Kiro configurations.

## Plan Files
- Location: `.kiro/plans/`
- Naming: `{YYYY-MM-DD}-{short-description}.md`
- Examples: `2026-06-21-add-auth.md`, `2026-06-21-refactor-api.md`
- Format: See `plan-format.md` for the full template

## Notepad System
- Location: `.kiro/notepads/{plan-name}/`
- Each plan gets its own notepad directory
- Notepad files persist intermediate agent findings:
  - `pre-analysis.md` — ghost-metis analysis
  - `exploration.md` — ghost-explorer findings
  - `research.md` — ghost-librarian research
  - `plan-review.md` — ghost-momus review
  - `oracle-advice.md` — ghost-oracle consultations
  - `verification.md` — Atlas verification notes
  - `implementation.md` — ghost-junior implementation notes

## Agent Names
- Main agents: `prometheus`, `atlas`, `sisyphus` (lowercase, no prefix)
- Subagents: `ghost-` prefix (e.g., `ghost-junior`, `ghost-oracle`)
- Agent config files: `{name}.json` in `.kiro/agents/`
- Agent prompt files: `{name}.md` in `.kiro/prompts/`

## Delegation Format
All delegations from main agents to subagents use the 6-section format:
1. Task (name + target agent)
2. Context (what the subagent needs to know)
3. Objective (specific goal)
4. Boundaries (scope limits)
5. Output (expected deliverable)
6. Success Criteria (verification)

## File References
- Agent configs reference prompts via `file://../prompts/{name}.md`
- Agents reference steering via `file://.kiro/steering/omkx/**/*.md`
- Agents reference skills via `skill://.kiro/skills/**/SKILL.md`

## Write Restrictions
- Prometheus: `.kiro/plans/**` and `.kiro/notepads/**` only
- Atlas: `.kiro/plans/**` and `.kiro/notepads/**` only
- Sisyphus: unrestricted (full user trust)
- ghost-explorer: `.kiro/notepads/**` only
- ghost-metis: `.kiro/notepads/**` only
- ghost-momus: `.kiro/notepads/**` only
- ghost-oracle: `.kiro/notepads/**` only
- ghost-librarian: `.kiro/notepads/**` only
- ghost-junior: unrestricted (full filesystem)
- ghost-looker: no write access

## Keyboard Shortcuts
- `ctrl+p` — Prometheus (Planner)
- `ctrl+a` — Atlas (Plan Executor)
- `ctrl+e` — Sisyphus (Direct Executor)

## Shell Access
- All subagents: auto-allow readonly shell commands
- ghost-junior: full shell access (not auto-allowed)
- ghost-looker: no shell access
