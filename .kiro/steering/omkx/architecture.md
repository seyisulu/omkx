# omkx — Architecture & Agent Flows

## System Architecture

omkx uses a **single entry point** model. The user talks to Sisyphus, who triages and delegates to the right agent — planner, executor, or specialist — as needed. No agent switching required.

```
┌─────────────────────────────────────────────────────────┐
│                      USER INTERFACE                      │
│              (Kiro IDE — ctrl+e for Sisyphus)            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
                ┌──────────────┐
                │  OMKX-SISYPHUS│
                │ Single Entry │
                │   Point      │
                └──────┬───────┘
                       │ triage
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
┌──────────┐    ┌──────────┐    ┌──────────────────────────┐
│OMKX-PROM │    │OMKX-ATLAS│    │  SPECIALIST SUBAGENTS    │
│ Planner  │    │Executor  │    │                          │
│(on demand)│   │(on demand)│   │ omkx-explorer  omkx-jr │
└────┬─────┘    └────┬─────┘    │ omkx-librarian omkx-   │
     │               │          │   oracle  omkx-metis    │
     ▼               ▼          │ omkx-momus  omkx-looker│
  .kiro/plans/   Task loop     └──────────────────────────┘
```

**Sisyphus can also be invoked directly** (ctrl+e) for ad-hoc tasks. Prometheus (ctrl+p) and Atlas (ctrl+a) remain available as direct shortcuts for users who prefer manual control.

## Agent Roles & Delegation Flows

### Prometheus (Planning Flow)
```
User Request
  │
  ▼
Pre-Analysis ──► omkx-metis (analyze intentions, risks, ambiguities)
  │
  ▼
Research ──► omkx-explorer (explore codebase)
  │      ──► omkx-librarian (research docs/web)
  │
  ▼
Interview ──► User (clarify ambiguities)
  │
  ▼
Plan Generation ──► .kiro/plans/{name}.md
  │
  ▼
Validation ──► omkx-momus (review for blockers)
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
Parallel Delegation ──► Task 1 ──► omkx-junior ──► Verify
  │                  ──► Task 2 ──► omkx-junior ──► Verify
  │                  ──► Task 3 ──► omkx-explorer ──► Verify
  │
  ▼
Oracle Escalation (on failure) ──► omkx-oracle ──► Re-delegate
  │
  ▼
Final Verification ──► All acceptance criteria met?
  │
  ▼
Report ──► User
```

### Sisyphus (Single Entry Point)
```
User Request
  │
  ▼
Triage
  │
  ├── Trivial ──► Do it yourself
  │
  ├── Needs a plan? ──► Delegate to OMKX-PROMETHEUS (planning)
  │                      └── User reviews plan
  │                          └── Delegate to OMKX-ATLAS (execution)
  │
  ├── Has a plan? ──► Delegate to OMKX-ATLAS (plan execution)
  │
  ├── Direct implementation? ──► omkx-junior (implement)
  │
  ├── Research? ──► omkx-librarian (research)
  │
  ├── Explore? ──► omkx-explorer (explore)
  │
  └── Stuck? ──► omkx-oracle (debugging advice)
  │
  ▼
Report ──► User
```

## Notepad System

Notepads provide context persistence across agent invocations:

```
.kiro/notepads/{plan-name}/
├── pre-analysis.md      # omkx-metis: hidden intentions, risks
├── exploration.md       # omkx-explorer: codebase findings
├── research.md          # omkx-librarian: web/doc findings
├── plan-review.md       # omkx-momus: validation results
├── oracle-advice.md     # omkx-oracle: recommendations
├── verification.md      # Atlas: per-task verification
└── implementation.md    # omkx-junior: implementation notes
```

### Notepad Protocol
1. Prometheus creates the notepad directory when generating a plan
2. Each agent writes findings to their designated file
3. Atlas reads all notepads for context before executing tasks
4. omkx-junior reads notepads for implementation context
5. Notepads are persistent — they survive agent session restarts

## Write Restrictions

The write restriction system prevents agents from modifying files outside their authority:

| Agent | Write Zones |
|-------|-------------|
| Prometheus | `.kiro/plans/**`, `.kiro/notepads/**` |
| Atlas | `.kiro/plans/**`, `.kiro/notepads/**` |
| Sisyphus | Unrestricted |
| omkx-explorer | `.kiro/notepads/**` |
| omkx-metis | `.kiro/notepads/**` |
| omkx-momus | `.kiro/notepads/**` |
| omkx-oracle | `.kiro/notepads/**` |
| omkx-librarian | `.kiro/notepads/**` |
| omkx-junior | Unrestricted |
| omkx-looker | No write access |

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
