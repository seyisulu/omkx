# Programming Skill

General programming patterns and best practices for implementation.

## Language-Agnostic Principles

### Code Quality
- Write readable code first, optimize later
- Follow the principle of least surprise
- Don't repeat yourself (DRY)
- Keep it simple (KISS)
- You aren't gonna need it (YAGNI)

### Function Design
- Single responsibility per function
- Functions should do one thing well
- Name functions with verbs (getUser, saveFile, parseInput)
- Limit function parameters (3-4 max, use objects for more)
- Return early to reduce nesting

### Error Handling
- Fail fast and explicitly
- Handle errors at the appropriate level
- Provide meaningful error messages
- Never swallow errors silently
- Use try/catch for expected failures, not flow control

### Data Handling
- Validate data at system boundaries
- Use immutable patterns where practical
- Avoid null/undefined where possible (use Optional/Maybe)
- Sanitize user input before processing

### Testing
- Write tests before or alongside code
- Test happy path, error cases, and edge cases
- Tests should be deterministic and isolated
- Use descriptive test names

### Documentation
- Document WHY, not WHAT (code shows what)
- Keep documentation close to code
- Update docs when behavior changes
- Use types for self-documenting code where possible

## Common Anti-Patterns
- God objects/functions (too many responsibilities)
- Premature optimization
- Magic numbers and strings
- Commented-out code (use version control)
- Catching and ignoring exceptions
- Boolean trap parameters (use options objects)
- Deep inheritance hierarchies (prefer composition)
