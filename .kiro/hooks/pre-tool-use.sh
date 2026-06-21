#!/bin/bash
# omkx — Pre-Tool-Use Hook
# Prevents destruction of .kiro directory and plan files
# Blocks: rm on .kiro, deletion of plan files, mv of .kiro

TOOL="$1"
ARGS="$2"

# Block any attempt to remove .kiro directory
if echo "$ARGS" | grep -qE '(rm\s+.*\.kiro|rmdir\s+.*\.kiro|rm\s+-rf\s+.*\.kiro)'; then
    echo "🚫 BLOCKED: Cannot delete .kiro directory or its contents"
    echo "   omkx requires .kiro/ for plan and notepad persistence."
    exit 1
fi

# Block deletion of plan files
if echo "$ARGS" | grep -qE '(rm\s+.*\.kiro/plans/|rm\s+.*plans/.*\.md)'; then
    echo "🚫 BLOCKED: Cannot delete plan files"
    echo "   Plans should be archived, not deleted. Move them to .kiro/plans/archive/ if needed."
    exit 1
fi

# Block moving .kiro directory
if echo "$ARGS" | grep -qE '(mv\s+.*\.kiro)'; then
    echo "🚫 BLOCKED: Cannot move .kiro directory"
    exit 1
fi

# Allow everything else
exit 0
