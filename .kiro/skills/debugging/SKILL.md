# Debugging Skill

Systematic debugging methodology for the omkx agent system.

## Debugging Process

### 1. Reproduce
- Can you reproduce the issue consistently?
- What are the exact steps?
- What environment/state is required?

### 2. Isolate
- Narrow down to the specific component/file
- What changed recently? (git log, git diff)
- Is it a regression or new issue?

### 3. Hypothesize
- What could cause this behavior?
- List possible root causes
- Prioritize by likelihood

### 4. Test
- Add logging/breakpoints at key points
- Test each hypothesis systematically
- One change at a time

### 5. Fix
- Apply the minimal fix
- Verify the fix resolves the issue
- Check for side effects

### 6. Prevent
- Add tests for the fixed scenario
- Document the root cause
- Consider if similar issues exist elsewhere

## Common Debugging Commands

```bash
# Check recent changes
git log --oneline -10
git diff HEAD~1

# Find error patterns in logs
grep -r "Error" . --include="*.log"
grep -r "Exception" . --include="*.log"

# Check file existence and permissions
ls -la path/to/file
stat path/to/file

# Check process/port issues
lsof -i :PORT
ps aux | grep PROCESS_NAME

# Check environment
env | sort
node --version
npm --version
```

## Error Analysis Template
```markdown
## Debugging Report: {issue}

### Symptom
{What is observed}

### Reproduction
{Steps to reproduce}

### Root Cause
{What caused the issue}

### Fix Applied
{What was changed}

### Verification
{How the fix was confirmed}

### Prevention
{What prevents recurrence}
```
