#!/bin/bash
# omkx — Prometheus Write Guard
# Ensures Prometheus only writes to .kiro/plans/ and .kiro/notepads/
# Adapted from oh-my-kiro's phantom-write-guard.sh

FILE="$1"

# Allow writing to .kiro/plans/
if echo "$FILE" | grep -q '^\.kiro/plans/'; then
    exit 0
fi

# Allow writing to .kiro/notepads/
if echo "$FILE" | grep -q '^\.kiro/notepads/'; then
    exit 0
fi

# Block everything else
echo "🚫 BLOCKED: Prometheus can only write to .kiro/plans/ and .kiro/notepads/"
echo "   Attempted to write to: $FILE"
echo "   💡 Prometheus is a PLANNER, not an implementer. Delegate code changes to Atlas/Sisyphus."
exit 1
