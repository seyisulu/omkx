# Plan File Format

Every plan created by Prometheus must follow this structure.

## Template

```markdown
# Plan: {Descriptive Title}

**Created:** {YYYY-MM-DD}
**Status:** DRAFT | REVIEWED | IN_PROGRESS | COMPLETE
**Goal:** {One-sentence description of what this plan achieves}

---

## Context

### What We Know
{Summary of research findings — from ghost-explorer, ghost-librarian, and user interview}

### Pre-Analysis Summary
{Key findings from ghost-metis: hidden intentions, risks, ambiguities}

### Constraints
- {Constraint 1}
- {Constraint 2}

---

## Tasks

### Task 1: {Task Name}
**Agent:** {ghost-junior | ghost-explorer | ghost-librarian | ghost-oracle}
**Depends On:** {none | task number}
**Description:** {WHAT to do, not HOW}
**Expected Output:** {files, changes, or results}
**Verification:** {how Atlas will verify this task}

### Task 2: {Task Name}
**Agent:** {subagent}
**Depends On:** {task number}
**Description:** {WHAT to do}
**Expected Output:** {deliverable}
**Verification:** {verification steps}

---

## Acceptance Criteria

- [ ] {Criterion 1 — verifiable condition}
- [ ] {Criterion 2 — verifiable condition}
- [ ] {Criterion 3 — verifiable condition}

---

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| {Risk description} | HIGH/MEDIUM/LOW | {How to handle if it occurs} |

---

## Notes

{Any additional information for Atlas or future reference}
```

## Task Guidelines

### Task Description
- Describe WHAT needs to be done, never HOW
- Be specific enough that ghost-junior can implement without questions
- Include relevant file paths when known

### Agent Assignment
- `ghost-junior`: Code implementation, file creation, command execution
- `ghost-explorer`: Codebase exploration and file discovery
- `ghost-librarian`: Web research and documentation lookup
- `ghost-oracle`: Architectural decisions and design review

### Dependencies
- Most tasks should be independent for parallel execution
- Only add dependencies when output of one task is required by another
- Avoid long dependency chains

### Verification
- Each task must have verifiable success criteria
- Atlas will check these after each task completes
- Be specific: "File exists at path X" not "Task is done"
- Include commands to run when applicable

## Acceptance Criteria
- Must be binary (pass/fail)
- Must be verifiable without interpretation
- Cover the complete plan scope
- Include both functional and non-functional requirements
