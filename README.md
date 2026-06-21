# omkx — Multi-Agent Orchestration for Kiro

> omkx brings battle-tested multi-agent workflows to the Kiro IDE, adapted from [oh-my-openagent](https://github.com/seyisulu/oh-my-openagent).

**10 specialized agents. Plan-first development. Verified execution.**

---

## Architecture

omkx provides a three-tier agent system where main agents orchestrate work and specialist subagents do the heavy lifting.

### Main Agents

| Agent | Shortcut | Role |
|-------|----------|------|
| **Prometheus** | `ctrl+p` | The Planner — gathers info, interviews users, writes structured execution plans |
| **Atlas** | `ctrl+a` | The Plan Executor — reads plans from disk, delegates to subagents, verifies everything |
| **Sisyphus** | `ctrl+e` | The Direct Executor — handles ad-hoc tasks by delegating to specialist subagents |

### Subagents

| Agent | Role |
|-------|------|
| **ghost-oracle** | Strategic technical advisor — architecture, debugging, self-review (read-only) |
| **ghost-metis** | Pre-planning analyst — finds hidden intentions, risks, ambiguities |
| **ghost-momus** | Plan validator — reviews plans for blocking issues |
| **ghost-librarian** | Research specialist — web search, documentation, library evaluation |
| **ghost-explorer** | Codebase explorer — finds files, maps structure, identifies patterns |
| **ghost-junior** | Implementation specialist — writes code, creates files, verifies results |
| **ghost-looker** | Media analyst — analyzes images, PDFs, diagrams |

---

## Quick Start

```bash
npx omkx@latest install
```

This installs all agents, prompts, hooks, skills, and configuration into your Kiro project's `.kiro/` directory.

---

## Installation

### Option 1: npx (Recommended)

```bash
npx omkx@latest install
```

### Option 2: Using the install script

```bash
curl -fsSL https://raw.githubusercontent.com/seyisulu/omkx/main/install.sh | bash
```

### Option 3: Local development

```bash
git clone https://github.com/seyisulu/omkx.git
cd omkx
bash install.sh
```

---

## Usage

### Prometheus — Planning (`ctrl+p`)

When you have a complex task, start with Prometheus:

1. Press `ctrl+p` to activate Prometheus
2. Describe what you want to accomplish
3. Prometheus will:
   - Analyze your request (via ghost-metis)
   - Research the codebase (via ghost-explorer)
   - Research external resources (via ghost-librarian)
   - Interview you for clarifications
   - Generate a structured plan in `.kiro/plans/`
4. Review the plan, then switch to Atlas (`ctrl+a`)

### Atlas — Plan Execution (`ctrl+a`)

When you have a plan ready:

1. Press `ctrl+a` to activate Atlas
2. Atlas automatically discovers plans in `.kiro/plans/`
3. Select the plan to execute
4. Atlas delegates each task to the appropriate subagent
5. Every task output is verified
6. Failed tasks are retried or escalated to ghost-oracle
7. Atlas reports completion with verification results

### Sisyphus — Direct Tasks (`ctrl+e`)

For quick, ad-hoc tasks that don't need a plan:

1. Press `ctrl+e` to activate Sisyphus
2. Give a direct instruction
3. Sisyphus triages: trivial tasks done directly, complex tasks delegated
4. Results reported immediately

---

## Plan File Format

Plans are markdown files in `.kiro/plans/`:

```markdown
# Plan: Add User Authentication

**Created:** 2026-06-21
**Status:** DRAFT
**Goal:** Add email/password authentication with session management

## Context
{Research findings and pre-analysis summary}

## Tasks

### Task 1: Set up auth database schema
**Agent:** ghost-junior
**Depends On:** none
**Description:** Create users table with email, password_hash, and session fields
**Verification:** Table exists with correct schema

### Task 2: Implement auth middleware
**Agent:** ghost-junior
**Depends On:** Task 1
**Description:** Create login, register, and session validation middleware
**Verification:** Middleware protects routes and validates sessions

## Acceptance Criteria
- [ ] Users can register with email and password
- [ ] Users can log in and receive a session
- [ ] Protected routes reject unauthenticated requests
- [ ] Passwords are hashed, never stored in plaintext

## Risks & Mitigations
| Risk | Severity | Mitigation |
|------|----------|------------|
| Session hijacking | HIGH | Use httpOnly, secure cookies with short expiry |
```

---

## Delegation Format

All main agents delegate using this 6-section format:

```
## TASK: {short name}
**Agent:** {subagent name}

### Context
{What the subagent needs to know}

### Objective
{Clear, specific goal}

### Boundaries
{Scope limits — what NOT to do}

### Output
{Expected deliverable format and location}

### Success Criteria
{Verifiable completion conditions}

### Notes
{Additional guidance}
```

---

## Configuration

### Steering Files (`.kiro/steering/omkx/`)

| File | Purpose |
|------|---------|
| `product.md` | System overview and agent descriptions |
| `conventions.md` | Naming, file, and delegation conventions |
| `plan-format.md` | Plan template and task guidelines |
| `architecture.md` | Agent flows, notepad system, write restrictions |

### Settings (`.kiro/settings/`)

| File | Purpose |
|------|---------|
| `mcp.json` | MCP server configuration for web research tools |

### Hooks (`.kiro/hooks/`)

Shell scripts that enforce agent behavior:
- `agent-spawn.sh` — Injects git status and plan context on agent activation
- `pre-tool-use.sh` — Prevents destruction of `.kiro/` files
- `prometheus-read-guard.sh` — Ensures Prometheus delegates exploration
- `prometheus-write-guard.sh` — Restricts Prometheus to plan/notepad writes only

---

## Customization

### Agent Behavior

Modify prompt files in `.kiro/prompts/` to customize agent behavior. Each `.md` file defines the agent's identity, workflow, and constraints.

### Agent Configuration

Modify JSON files in `.kiro/agents/` to adjust:
- Available tools and tool settings
- Write path restrictions
- Subagent access permissions
- Keyboard shortcuts
- Hook configurations

### Skills

Extend or modify skills in `.kiro/skills/`. Each skill directory contains a `SKILL.md` file used by agents for domain-specific guidance.

### Steering Documents

Update files in `.kiro/steering/omkx/` to change project conventions, plan formats, and architecture rules.

---

## File Structure

```
.kiro/
├── agents/               # Agent JSON configurations (10 files)
│   ├── prometheus.json
│   ├── atlas.json
│   ├── sisyphus.json
│   └── ghost-*.json      # 7 subagent configs
├── prompts/              # Agent behavior prompts (10 markdown files)
├── hooks/                # Lifecycle hook scripts (4 shell scripts)
├── skills/               # Shared skill definitions (5 skills)
│   ├── git-operations/SKILL.md
│   ├── code-review/SKILL.md
│   ├── frontend-ux/SKILL.md
│   ├── debugging/SKILL.md
│   └── programming/SKILL.md
├── steering/omkx/        # System configuration (4 markdown files)
├── settings/             # MCP and tool configuration
├── plans/                # Execution plans (created by Prometheus)
└── notepads/             # Agent context notepads
```

---

## Troubleshooting

### Agents not appearing in Kiro

1. Verify omkx is installed: `npx omkx status`
2. Ensure `.kiro/agents/` contains JSON files
3. Restart Kiro IDE
4. Reinstall: `npx omkx install --force`

### Plans not executing

1. Check plan exists in `.kiro/plans/`
2. Verify plan format follows `.kiro/steering/omkx/plan-format.md`
3. Use Prometheus (`ctrl+p`) to regenerate the plan
4. Check notepad files in `.kiro/notepads/{plan-name}/` for error context

### Subagent delegation failures

1. Verify subagent configs exist in `.kiro/agents/`
2. Check allowed tools in subagent JSON config
3. Review hook scripts in `.kiro/hooks/` for permission issues
4. Read `.kiro/steering/omkx/architecture.md` for delegation flows

### Web research not working

1. Check `.kiro/settings/mcp.json` for web-research server configuration
2. Ensure MCP tools are available in your environment
3. Verify network connectivity

---

## Commands

```bash
omkx install            # Install omkx agents and configuration
omkx install --force    # Force reinstall
omkx install --dir <path> # Install to specific directory
omkx status             # Show installation status
omkx list               # List all installed agents
omkx plans              # List execution plans
omkx help               # Show help
```

---

## Credits

omkx is based on:

- **[oh-my-openagent](https://github.com/seyisulu/oh-my-openagent)** — The original TypeScript multi-agent system developed by seyisulu. Agent personalities, workflows, and delegation patterns are adapted from this project.
- **[oh-my-kiro](https://github.com/seyisulu/oh-my-kiro)** — The Kiro IDE agent format and conventions that omkx follows.

### Agent Name Origins

| Agent | Origin |
|-------|--------|
| Prometheus | Titan who brought fire (foresight) to humanity |
| Atlas | Titan who bears the heavens (the entire workflow) |
| Sisyphus | King who pushes the boulder (relentless execution) |
| Oracle | Prophetic advisor (strategic guidance) |
| Metis | Titaness of wisdom and deep thought |
| Momus | God of criticism and satire |
| Librarian | Keeper of knowledge |
| Explorer | Discovers uncharted territory |
| Junior | The apprentice who does the work |
| Looker | The observer who sees what others miss |

---

## License

MIT © [seyisulu](https://github.com/seyisulu)

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

**omkx** — Plan. Delegate. Verify. Execute.
