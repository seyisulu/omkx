# Git Operations Skill

Safe git workflows for the omkx agent system.

## Safe Operations (always allowed)
- `git status` — check current state
- `git diff` — see changes
- `git log` — view history
- `git branch` — list branches
- `git stash` / `git stash pop` — temporarily shelve changes

## Read-Only Operations
- `git remote -v` — check remotes
- `git show` — inspect commits
- `git blame` — trace line history

## Write Operations (verify before executing)
- `git add` — stage files
- `git commit -m "..."` — commit changes
- `git checkout -b <branch>` — create new branch
- `git push` — push to remote
- `git pull` — pull from remote
- `git merge` — merge branches

## Dangerous Operations (require confirmation)
- `git reset --hard` — destructive reset
- `git push --force` — force push
- `git rebase` — rewrite history
- `git clean -fd` — remove untracked files

## Best Practices
1. Always check `git status` before any operation
2. Commit messages should be descriptive and follow conventional commits
3. Create branches for new features
4. Pull before pushing to avoid conflicts
5. Never force push to main/master
