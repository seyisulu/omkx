#!/bin/bash
# omkx — Prometheus Read Guard
# Ensures Prometheus only reads files, never modifies them outside allowed paths
# Adapted from oh-my-kiro's phantom-read-guard.sh

FILE="$1"

# Allow reading .kiro files (plans, notepads, prompts, steering, skills)
if echo "$FILE" | grep -q '^\.kiro/'; then
    exit 0
fi

# Allow reading any project file (Prometheus needs to understand the codebase)
# But log a reminder that exploration should be delegated to omkx-explorer
if [ -f "$FILE" ]; then
    echo "📖 Prometheus reading: $FILE"
    echo "   💡 Remember: delegate codebase exploration to omkx-explorer"
    exit 0
fi

exit 0
