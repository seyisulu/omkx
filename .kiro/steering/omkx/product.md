# omkx — Multi-Agent Orchestration for Kiro

## What is omkx?

omkx is a multi-agent orchestration system for the Kiro IDE. It brings the battle-tested agent architecture from [oh-my-openagent](https://github.com/seyisulu/oh-my-openagent) (a TypeScript-based multi-agent system) into Kiro's native agent format.

## Agent System

omkx provides 10 specialized agents organized into three tiers:

### Main Agents (User-Facing)
| Agent | Shortcut | Role |
|-------|----------|------|
| **Prometheus** | `ctrl+p` | The Planner — gathers info, interviews users, writes structured execution plans |
| **Atlas** | `ctrl+a` | The Plan Executor — reads plans, delegates to subagents, verifies everything |
| **Sisyphus** | `ctrl+e` | The Direct Executor — handles ad-hoc user requests by delegating to specialists |

### Subagents (Internal Specialists)
| Agent | Role |
|-------|------|
| **omkx-oracle** | Strategic technical advisor — architecture, debugging, self-review |
| **omkx-metis** | Pre-planning analyst — finds hidden intentions, risks, ambiguities |
| **omkx-momus** | Plan validator — reviews plans for blocking issues |
| **omkx-librarian** | Research specialist — web search, documentation, library evaluation |
| **omkx-explorer** | Codebase explorer — finds files, maps structure, identifies patterns |
| **omkx-junior** | Implementation specialist — writes code, creates files, verifies results |
| **omkx-looker** | Media analyst — analyzes images, PDFs, diagrams |

## Core Philosophy

1. **Plan-First Development**: Prometheus creates detailed plans. Atlas executes them. Never skip planning.
2. **Delegation, Not DIY**: Main agents delegate everything to specialists. They never write code themselves.
3. **Verification Over Trust**: Atlas verifies every subagent output. Subagents can and do make mistakes.
4. **Plan as Sole Handoff**: The plan file on disk is the single source of truth between agents.
5. **Parallel by Default**: Independent tasks are executed in parallel for speed.
6. **Notepad System**: Intermediate findings are stored in `.kiro/notepads/{plan-name}/` for context persistence.

## File System

```
.kiro/
├── agents/          # Agent JSON configurations
├── prompts/         # Agent behavior prompts (markdown)
├── hooks/           # Shell hooks for agent lifecycle
├── skills/          # Shared skill definitions
├── steering/omkx/   # System configuration and conventions
├── settings/        # MCP and tool settings
├── plans/           # Execution plans (created by Prometheus)
└── notepads/        # Intermediate agent findings and context
```

## Workflow

```
User → Prometheus (creates plan) → Atlas (executes plan) → Done
                                  ↑
User → Sisyphus (ad-hoc tasks, no plan needed)
```

## Based On

omkx converts the agent personalities and workflows from oh-my-openagent into Kiro's native JSON agent format, following the conventions established by oh-my-kiro.

## Version

0.1.0 — Initial release with 10 agents
