#!/bin/bash
# omkx — Install Script
# Installs omkx multi-agent orchestration into the current Kiro project
# Usage: bash install.sh [--force] [--global] [--dir <path>]

set -e

FORCE=false
GLOBAL=false
TARGET_DIR="$(pwd)"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=true; shift ;;
    --global) GLOBAL=true; shift ;;
    --dir) TARGET_DIR="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# --global installs to ~/.kiro so agents are available in all projects
if [ "$GLOBAL" = true ]; then
  TARGET_DIR="$HOME"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIRO_DIR="$TARGET_DIR/.kiro"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║              omkx — Multi-Agent Orchestration            ║"
echo "║                    for Kiro IDE                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check if already installed
if [ -f "$KIRO_DIR/agents/prometheus.json" ] && [ "$FORCE" != true ]; then
  echo "✅ omkx is already installed in $TARGET_DIR"
  echo "   Use --force to reinstall."
  exit 0
fi

if [ "$FORCE" = true ]; then
  echo "🔄 Force reinstalling omkx..."
  rm -rf "$KIRO_DIR/agents" "$KIRO_DIR/prompts" "$KIRO_DIR/hooks" \
         "$KIRO_DIR/skills" "$KIRO_DIR/steering/omkx" "$KIRO_DIR/settings/mcp.json"
fi

echo "📦 Installing omkx to $TARGET_DIR..."
echo ""

# Create directory structure
mkdir -p "$KIRO_DIR/agents"
mkdir -p "$KIRO_DIR/prompts"
mkdir -p "$KIRO_DIR/hooks"
mkdir -p "$KIRO_DIR/skills"
mkdir -p "$KIRO_DIR/steering/omkx"
mkdir -p "$KIRO_DIR/settings"
mkdir -p "$KIRO_DIR/plans"
mkdir -p "$KIRO_DIR/notepads"

# Copy agent configs
echo "📋 Copying agent configurations..."
cp "$SCRIPT_DIR/.kiro/agents/"*.json "$KIRO_DIR/agents/"
echo "   ✅ 10 agent configs installed"

# Copy prompt files
echo "📝 Copying agent prompts..."
cp "$SCRIPT_DIR/.kiro/prompts/"*.md "$KIRO_DIR/prompts/"
echo "   ✅ 10 prompt files installed"

# Copy hooks and make executable
echo "🪝 Copying hooks..."
cp "$SCRIPT_DIR/.kiro/hooks/"*.sh "$KIRO_DIR/hooks/"
chmod +x "$KIRO_DIR/hooks/"*.sh
echo "   ✅ 4 hooks installed (executable)"

# Copy skills
echo "🎯 Copying skills..."
for skill in git-operations code-review frontend-ux debugging programming ultrawork; do
  if [ -d "$SCRIPT_DIR/.kiro/skills/$skill" ]; then
    mkdir -p "$KIRO_DIR/skills/$skill"
    cp "$SCRIPT_DIR/.kiro/skills/$skill/SKILL.md" "$KIRO_DIR/skills/$skill/SKILL.md"
  fi
done
echo "   ✅ 6 skills installed"

# Copy steering files
echo "🧭 Copying steering files..."
cp "$SCRIPT_DIR/.kiro/steering/omkx/"*.md "$KIRO_DIR/steering/omkx/"
echo "   ✅ 4 steering files installed"

# Copy settings
echo "⚙️  Copying settings..."
cp "$SCRIPT_DIR/.kiro/settings/mcp.json" "$KIRO_DIR/settings/mcp.json"
echo "   ✅ MCP settings installed"

# Create gitkeep files
touch "$KIRO_DIR/plans/.gitkeep"
touch "$KIRO_DIR/notepads/.gitkeep"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ omkx installed successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📂 Installed structure:"
echo "   .kiro/agents/       → 10 agents"
echo "   .kiro/prompts/      → 10 prompt files"
echo "   .kiro/hooks/        → 4 lifecycle hooks"
echo "   .kiro/skills/       → 6 shared skills"
echo "   .kiro/steering/omkx/ → 4 steering documents"
echo "   .kiro/settings/     → MCP configuration"
echo "   .kiro/plans/        → Execution plans directory"
echo "   .kiro/notepads/     → Agent notepad directories"
echo ""
echo "⌨️  Keyboard Shortcuts (in Kiro IDE):"
echo "   ctrl+p  →  Prometheus (Planner)"
echo "   ctrl+a  →  Atlas (Plan Executor)"
echo "   ctrl+e  →  Sisyphus (Direct Executor)"
echo ""
echo "📖 Read .kiro/steering/omkx/product.md for full documentation."
echo "🌐 GitHub: https://github.com/seyisulu/omkx"
echo ""
