#!/bin/bash
# omkx — Agent Spawn Hook
# Injects git status and plan context when any agent spawns

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Context Injection"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Git status
if git rev-parse --git-dir > /dev/null 2>&1; then
    BRANCH=$(git branch --show-current 2>/dev/null)
    echo "🌿 Branch: ${BRANCH:-detached HEAD}"
    echo ""
    
    STATUS=$(git status --short 2>/dev/null | head -20)
    if [ -n "$STATUS" ]; then
        echo "📝 Changed files:"
        echo "$STATUS"
    else
        echo "✅ Working tree clean"
    fi
else
    echo "⚠️  Not a git repository"
fi

# Plan context
echo ""
echo "📐 Plans available:"
if ls .kiro/plans/*.md >/dev/null 2>&1; then
    ls -1t .kiro/plans/*.md 2>/dev/null | while read plan; do
        echo "   📄 $(basename "$plan")"
    done
else
    echo "   (no plans found)"
fi

# Notepad context
echo ""
echo "📝 Notepads available:"
if [ -d ".kiro/notepads" ] && [ "$(ls -A .kiro/notepads/ 2>/dev/null)" ]; then
    ls -1d .kiro/notepads/*/ 2>/dev/null | while read np; do
        echo "   📁 $(basename "$np")"
    done
else
    echo "   (no notepads found)"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
