# Code Review Skill

Self-review checklist for omkx-junior and code quality assessment.

## Review Checklist

### Correctness
- [ ] Does the code do what was requested?
- [ ] Are edge cases handled?
- [ ] Are error cases handled properly?
- [ ] Are return values checked?

### Security
- [ ] No hardcoded secrets or credentials
- [ ] Input is validated and sanitized
- [ ] SQL queries use parameterized statements
- [ ] No unsafe eval or exec patterns

### Performance
- [ ] No unnecessary loops or recursion
- [ ] Appropriate data structures used
- [ ] No N+1 query problems
- [ ] Resource cleanup (connections, files, etc.)

### Maintainability
- [ ] Code follows existing patterns
- [ ] Functions are focused (single responsibility)
- [ ] Naming is clear and consistent
- [ ] Complex logic has comments

### Testing
- [ ] Happy path tested
- [ ] Error cases tested
- [ ] Edge cases tested
- [ ] Tests pass

## Red Flags
- Duplicated code (DRY violation)
- Magic numbers without explanation
- Overly complex conditionals
- Functions longer than 50 lines
- Deep nesting (>3 levels)

## Review Output Format
```markdown
## Code Review: {file/path}

### Summary
{1-2 sentence overview}

### Issues Found
- {Severity}: {issue} at {file:line} — {suggestion}

### Passed Checks
- {check}: PASSED

### Recommendation
APPROVED / CHANGES_REQUESTED
```
