# omkx — Architecture & Agent Flows

## System Architecture

omkx is a three-tier multi-agent orchestration system:

```
┌─────────────────────────────────────────────────────────┐
│                      USER INTERFACE                      │
│         (Kiro IDE — agent selection via shortcuts)       │
└──────────┬──────────────┬──────────────┬────────────────┘
           │ ctrl+p       │ ctrl+a       │ ctrl+e
           ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │PROMETHEUS│   │  ATLAS   │   │SISYPHUS  │
    │ Planner  │   │Executor  │   │ Direct   │
    └────┬─────┘   └────┬─────┘   └────┬─────┘
         │              │              │
         ▼              ▼              ▼
    ┌─────────────────────────────────────────────────────┐
    │               SUBAGENT ORCHESTRATION                 │
    │                                                     │
    │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
    │  │  METIS   │ │ MOMUS    │ │ ORACLE   │            │
    │  │Pre-plan  │ │Validator │ │Advisor   │            │
    │  └──────────┘ └──────────┘ └──────────┘            │
    │                                                     │
    │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
    │  │EXPLORER  │ │LIBRARIAN │ │ JUNIOR   │            │
    │  │Codebase  │ │Research  │ │Implement │            │
    │  └──────────┘ └──────────┘ └──────────┘            │
    │                                                     │
    │  ┌──────────┐                                       │
    │  │ LOOKER   │                                       │
    │  │ Media    │                                       │
    │  └──────────┘                                       │
    └─────────────────────────────────────────────────────┘
```

## Agent Roles & Delegation Flows

### Prometheus (Planning Flow)
```
User Request
  │
  ▼
Pre-Analysis ──► ghost-metis (analyze intentions, risks, ambiguities)
  │
  ▼
Research ──► ghost-explorer (explore codebase)
  │      ──► ghost-librarian (research docs/web)
  │
  ▼
Interview ──► User (clarify ambiguities)
  │
  ▼
Plan Generation ──► .kiro/plans/{name}.md
  │
  ▼
Validation ──► ghost-momus (review for blockers)
  │
  ▼
Final Plan ──► User (handoff to Atlas)
```

### Atlas (Execution Flow)
```
Plan File (.kiro/plans/{name}.md)
  │
  ▼
Parse Tasks ──► Identify dependencies, agent assignments
  │
  ▼
Parallel Delegation ──► Task 1 ──► ghost-junior ──► Verify
  │                  ──► Task 2 ──► ghost-junior ──► Verify
  │                  ──► Task 3 ──► ghost-explorer ──► Verify
  │
  ▼
Oracle Escalation (on failure) ──► ghost-oracle ──► Re-delegate
  │
  ▼
Final Verification ──► All acceptance criteria met?
  │
  ▼
Report ──► User
```

### Sisyphus (Direct Task Flow)
```
User Request
  │
  ▼
Triage
  │
  ├── Trivial ──► Do it yourself
  │
  ├── Complex ──► ghost-junior (implement)
  │
  ├── Research ──► ghost-librarian (research)
  │
  └── Explore ──► ghost-explorer (explore)
  │
  ▼
Oracle Escalation (if stuck) ──► ghost-oracle
  │
  ▼
Report ──► User
```

## Notepad System

Notepads provide context persistence across agent invocations:

```
.kiro/notepads/{plan-name}/
├── pre-analysis.md      # ghost-metis: hidden intentions, risks
├── exploration.md       # ghost-explorer: codebase findings
├── research.md          # ghost-librarian: web/doc findings
├── plan-review.md       # ghost-momus: validation results
├── oracle-advice.md     # ghost-oracle: recommendations
├── verification.md      # Atlas: per-task verification
└── implementation.md    # ghost-junior: implementation notes
```

### Notepad Protocol
1. Prometheus creates the notepad directory when generating a plan
2. Each agent writes findings to their designated file
3. Atlas reads all notepads for context before executing tasks
4. ghost-junior reads notepads for implementation context
5. Notepads are persistent — they survive agent session restarts

## Write Restrictions

The write restriction system prevents agents from modifying files outside their authority:

| Agent | Write Zones |
|-------|-------------|
| Prometheus | `.kiro/plans/**`, `.kiro/notepads/**` |
| Atlas | `.kiro/plans/**`, `.kiro/notepads/**` |
| Sisyphus | Unrestricted |
| ghost-explorer | `.kiro/notepads/**` |
| ghost-metis | `.kiro/notepads/**` |
| ghost-momus | `.kiro/notepads/**` |
| ghost-oracle | `.kiro/notepads/**` |
| ghost-librarian | `.kiro/notepads/**` |
| ghost-junior | Unrestricted |
| ghost-looker | No write access |

## Oracle Consultation Pattern

The Oracle is consulted only in three scenarios:

1. **Architecture Advice**: Before major design decisions
2. **Debugging Escalation**: After 2+ failed implementation attempts
3. **Self-Review**: When agents need their output reviewed

Oracle always provides exactly ONE recommendation per consultation, tagged with an effort estimate (TRIVIAL/SMALL/MEDIUM/LARGE/XLARGE).

## Hook System

Hooks enforce agent behavior at key lifecycle points:

- **agentSpawn**: Injected identity reminder + git status context
- **preToolUse**: Blocks destructive operations on `.kiro/` files
- **userPromptSubmit**: Identity reinforcement for Atlas
- **Prometheus guards**: Special read/write hooks enforcing planner-only behavior
