#!/usr/bin/env node

import {
  readFileSync,
  existsSync,
  cpSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  rmdirSync,
} from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { homedir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(__dirname, "..");

// ─── Help ────────────────────────────────────────────────────────────────

function showHelp() {
  const help = `
╔══════════════════════════════════════════════════════════╗
║                    omkx v${getVersion()}                        ║
║         Multi-Agent Orchestration for Kiro               ║
╚══════════════════════════════════════════════════════════╝

Usage: omkx [command] [options]

Commands:
  (default)     Install omkx agents and configuration
  status        Show installation status
  list          List installed agents
  plans         List execution plans
  help          Show this help

Flags:
  --global      Install/uninstall globally (~/.kiro) instead of locally (./.kiro)
  --update      Update to the latest version (force reinstall)
  --uninstall   Remove omkx from the target directory
  --force       Force reinstall
  --dir <path>  Target directory (default: current directory)

Examples:
  npx omkx@latest             Install in current project
  npx omkx@latest --global    Install globally (all projects)
  npx omkx@latest --update    Update to the latest version
  npx omkx@latest --uninstall Remove omkx
  omkx status                 Check what's installed
  omkx list                   List all agents
  omkx plans                  List plans from .kiro/plans/

Keyboard Shortcuts (in Kiro):
  ctrl+p  →  Prometheus (Planner)
  ctrl+a  →  Atlas (Plan Executor)
  ctrl+e  →  Sisyphus (Direct Executor)

Repository: https://github.com/seyisulu/omkx
`;
  console.log(help);
}

// ─── Version ──────────────────────────────────────────────────────────────

function getVersion() {
  try {
    const pkg = JSON.parse(
      readFileSync(resolve(PKG_ROOT, "package.json"), "utf8"),
    );
    return pkg.version;
  } catch {
    return "0.1.0";
  }
}

// ─── Install ──────────────────────────────────────────────────────────────

const MANIFEST = {
  agents: [
    "prometheus.json",
    "atlas.json",
    "sisyphus.json",
    "omkx-explorer.json",
    "omkx-metis.json",
    "omkx-momus.json",
    "omkx-oracle.json",
    "omkx-librarian.json",
    "omkx-junior.json",
    "omkx-looker.json",
  ],
  prompts: [
    "prometheus.md",
    "atlas.md",
    "sisyphus.md",
    "omkx-explorer.md",
    "omkx-metis.md",
    "omkx-momus.md",
    "omkx-oracle.md",
    "omkx-librarian.md",
    "omkx-junior.md",
    "omkx-looker.md",
  ],
  hooks: [
    "agent-spawn.sh",
    "pre-tool-use.sh",
    "prometheus-read-guard.sh",
    "prometheus-write-guard.sh",
  ],
  steering: [
    "product.md",
    "conventions.md",
    "plan-format.md",
    "architecture.md",
  ],
  skills: [
    "git-operations",
    "code-review",
    "frontend-ux",
    "debugging",
    "programming",
    "ultrawork",
  ],
  settings: ["mcp.json"],
};

function install(targetDir, force = false) {
  const kiroDir = resolve(targetDir, ".kiro");
  const isGlobal = resolve(targetDir) === homedir();
  const scope = isGlobal ? "globally" : "locally";

  // Check if already installed
  const manifestMarker = resolve(kiroDir, "agents", "prometheus.json");
  if (existsSync(manifestMarker) && !force) {
    console.log(`✅ omkx is already installed ${scope} (${kiroDir}).`);
    console.log("   Use --force or --update to reinstall.");
    return;
  }

  console.log(`📦 Installing omkx ${scope} to ${kiroDir}...\n`);

  // Copy .kiro directory
  copyDir(resolve(PKG_ROOT, ".kiro"), kiroDir);

  // Make hooks executable
  const hooksDir = resolve(kiroDir, "hooks");
  try {
    execSync(`chmod +x ${hooksDir}/*.sh`, { stdio: "pipe" });
  } catch {
    // Ignore if no hooks dir
  }

  // Create empty dirs with gitkeep
  ensureDir(resolve(kiroDir, "plans"));
  ensureDir(resolve(kiroDir, "notepads"));
  touchIfMissing(resolve(kiroDir, "plans", ".gitkeep"));
  touchIfMissing(resolve(kiroDir, "notepads", ".gitkeep"));

  console.log("");
  console.log("✅ omkx installed successfully!");
  console.log("");
  console.log("📂 Installed structure:");
  console.log(`   .kiro/agents/       → ${MANIFEST.agents.length} agents`);
  console.log(`   .kiro/prompts/      → ${MANIFEST.prompts.length} prompts`);
  console.log(`   .kiro/hooks/        → ${MANIFEST.hooks.length} hooks`);
  console.log(`   .kiro/skills/       → ${MANIFEST.skills.length} skills`);
  console.log(
    `   .kiro/steering/omkx/ → ${MANIFEST.steering.length} steering files`,
  );
  console.log(`   .kiro/settings/     → ${MANIFEST.settings.length} settings`);
  console.log(`   .kiro/plans/        → Execution plans`);
  console.log(`   .kiro/notepads/     → Agent notepads`);
  console.log("");
  console.log("⌨️  Keyboard Shortcuts in Kiro:");
  console.log("   ctrl+p → Prometheus (Planner)");
  console.log("   ctrl+a → Atlas (Plan Executor)");
  console.log("   ctrl+e → Sisyphus (Direct Executor)");
  console.log("");
  console.log("📖 Read .kiro/steering/omkx/product.md for full documentation.");
}

// ─── Status ───────────────────────────────────────────────────────────────

function status(targetDir) {
  const kiroDir = resolve(targetDir, ".kiro");
  const manifestMarker = resolve(kiroDir, "agents", "prometheus.json");

  console.log("🔍 omkx Status\n");

  if (!existsSync(manifestMarker)) {
    console.log("❌ omkx is NOT installed.");
    console.log("   Run: npx omkx install");
    return;
  }

  console.log("✅ omkx is installed.\n");

  // Count agents
  const agentsDir = resolve(kiroDir, "agents");
  let agentCount = 0;
  if (existsSync(agentsDir)) {
    agentCount = MANIFEST.agents.filter((a) =>
      existsSync(resolve(agentsDir, a)),
    ).length;
  }
  console.log(`   Agents: ${agentCount}/${MANIFEST.agents.length}`);

  // Count prompts
  const promptsDir = resolve(kiroDir, "prompts");
  let promptCount = 0;
  if (existsSync(promptsDir)) {
    promptCount = MANIFEST.prompts.filter((p) =>
      existsSync(resolve(promptsDir, p)),
    ).length;
  }
  console.log(`   Prompts: ${promptCount}/${MANIFEST.prompts.length}`);

  // Count plans
  const plansDir = resolve(kiroDir, "plans");
  let planCount = 0;
  if (existsSync(plansDir)) {
    try {
      planCount = execSync(`ls -1 ${plansDir}/*.md 2>/dev/null | wc -l`, {
        stdio: "pipe",
      })
        .toString()
        .trim();
    } catch {
      planCount = 0;
    }
  }
  console.log(`   Plans: ${planCount}`);

  // Count notepads
  const notepadsDir = resolve(kiroDir, "notepads");
  let notepadCount = 0;
  if (existsSync(notepadsDir)) {
    try {
      notepadCount = execSync(`ls -1d ${notepadsDir}/*/ 2>/dev/null | wc -l`, {
        stdio: "pipe",
      })
        .toString()
        .trim();
    } catch {
      notepadCount = 0;
    }
  }
  console.log(`   Notepads: ${notepadCount}`);
}

// ─── List ──────────────────────────────────────────────────────────────────

function list(targetDir) {
  const kiroDir = resolve(targetDir, ".kiro");
  const agentsDir = resolve(kiroDir, "agents");

  console.log("🤖 omkx Agents\n");

  if (!existsSync(agentsDir)) {
    console.log("❌ No agents found. Run: npx omkx install");
    return;
  }

  console.log("Main Agents:");
  const mainAgents = ["prometheus", "atlas", "sisyphus"];
  const shortcuts = {
    prometheus: "ctrl+p",
    atlas: "ctrl+a",
    sisyphus: "ctrl+e",
  };
  const descriptions = {
    prometheus: "Planner — creates execution plans",
    atlas: "Plan Executor — orchestrates plan execution",
    sisyphus: "Direct Executor — handles ad-hoc tasks",
  };

  for (const name of mainAgents) {
    const file = resolve(agentsDir, `${name}.json`);
    const installed = existsSync(file) ? "✅" : "❌";
    console.log(
      `  ${installed} ${name.padEnd(16)} ${shortcuts[name].padEnd(8)} ${descriptions[name]}`,
    );
  }

  console.log("\nSubagents:");
  const subAgents = [
    { name: "omkx-oracle", desc: "Strategic technical advisor" },
    { name: "omkx-metis", desc: "Pre-planning analyst" },
    { name: "omkx-momus", desc: "Plan validator" },
    { name: "omkx-librarian", desc: "Research specialist" },
    { name: "omkx-explorer", desc: "Codebase explorer" },
    { name: "omkx-junior", desc: "Implementation specialist" },
    { name: "omkx-looker", desc: "Media analyst" },
  ];

  for (const agent of subAgents) {
    const file = resolve(agentsDir, `${agent.name}.json`);
    const installed = existsSync(file) ? "✅" : "❌";
    console.log(`  ${installed} ${agent.name.padEnd(20)} ${agent.desc}`);
  }
}

// ─── Plans ─────────────────────────────────────────────────────────────────

function plans(targetDir) {
  const plansDir = resolve(targetDir, ".kiro", "plans");

  console.log("📐 Execution Plans\n");

  if (!existsSync(plansDir)) {
    console.log(
      "No plans directory found. Create plans with Prometheus (ctrl+p).",
    );
    return;
  }

  try {
    const output = execSync(`ls -1t ${plansDir}/*.md 2>/dev/null`, {
      stdio: "pipe",
    })
      .toString()
      .trim();
    if (!output) {
      console.log("No plans found. Create plans with Prometheus (ctrl+p).");
      return;
    }
    const planFiles = output.split("\n");
    for (const plan of planFiles) {
      const name = plan.split("/").pop();
      // Try to extract title from first line
      try {
        const firstLine = execSync(`head -1 "${plan}"`, { stdio: "pipe" })
          .toString()
          .trim();
        const title = firstLine.replace(/^#\s*(Plan:\s*)?/, "");
        console.log(`  📄 ${name}`);
        console.log(`     ${title}`);
      } catch {
        console.log(`  📄 ${name}`);
      }
      console.log("");
    }
  } catch {
    console.log("No plans found.");
  }
}

// ─── Uninstall ────────────────────────────────────────────────────────────

function uninstall(targetDir) {
  const kiroDir = resolve(targetDir, ".kiro");
  const isGlobal = resolve(targetDir) === homedir();
  const scope = isGlobal ? "global" : "local";
  const manifestMarker = resolve(kiroDir, "agents", "prometheus.json");

  console.log("🗑️  Uninstalling omkx...\n");

  if (!existsSync(manifestMarker)) {
    console.log(`❌ omkx is not installed ${scope} (${kiroDir}).`);
    return;
  }

  // Remove all omkx-managed directories and files
  const targets = [
    "agents",
    "prompts",
    "hooks",
    "skills",
    "settings/mcp.json",
    "steering/omkx",
  ];

  const removed = [];
  for (const t of targets) {
    const path = resolve(kiroDir, t);
    if (existsSync(path)) {
      rmSync(path, { recursive: true, force: true });
      removed.push(t);
    }
  }

  // Clean up now-empty parent dirs (steering/, settings/)
  for (const dir of ["steering", "settings"]) {
    const path = resolve(kiroDir, dir);
    try {
      rmdirSync(path);
      removed.push(`${dir}/`);
    } catch {
      // Not empty or doesn't exist — leave it alone
    }
  }

  // Try to remove .kiro itself if entirely empty.
  // If plans/ or notepads/ still has user content, .kiro is kept.
  let kiroRemoved = false;
  try {
    rmdirSync(kiroDir);
    kiroRemoved = true;
  } catch {
    // User still has plans/notepads — preserve them
  }

  console.log(`✅ omkx removed ${scope} from ${kiroDir}`);
  console.log(`   Removed: ${removed.join(", ")}`);
  if (!kiroRemoved) {
    console.log(`   Kept: ${kiroDir}/plans/, ${kiroDir}/notepads/ (your data)`);
  }
}

// ─── Utilities ─────────────────────────────────────────────────────────────

function copyDir(src, dest) {
  cpSync(src, dest, { recursive: true });
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function touchIfMissing(file) {
  if (!existsSync(file)) {
    writeFileSync(file, "");
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  let targetDir = process.cwd();
  let force = false;
  let global = false;
  let doUpdate = false;
  let doUninstall = false;
  let command = null;

  // Parse all args — flags can appear anywhere.
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--global" || arg === "-g") {
      global = true;
    } else if (arg === "--force" || arg === "-f") {
      force = true;
    } else if (arg === "--update") {
      doUpdate = true;
    } else if (arg === "--uninstall") {
      doUninstall = true;
    } else if (arg === "--dir" && args[i + 1]) {
      targetDir = resolve(args[++i]);
    } else if (arg === "--help" || arg === "-h") {
      showHelp();
      return;
    } else if (!arg.startsWith("-")) {
      // First non-flag arg is the command (install/status/list/plans/help)
      if (!command) command = arg;
    } else {
      console.log(`Unknown option: ${arg}`);
      console.log('Run "omkx help" for usage information.');
      process.exit(1);
    }
  }

  // --global targets the user's home directory (~/.kiro)
  if (global) {
    targetDir = homedir();
  }

  // --uninstall removes omkx from the target directory
  if (doUninstall) {
    uninstall(targetDir);
    return;
  }

  // --update reinstalls with force (useful with npx to pull latest)
  if (doUpdate) {
    install(targetDir, true);
    return;
  }

  // Default command is install (so bare `npx omkx@latest` installs)
  command = command || "install";

  switch (command) {
    case "install":
      install(targetDir, force);
      break;
    case "status":
      status(targetDir);
      break;
    case "list":
      list(targetDir);
      break;
    case "plans":
      plans(targetDir);
      break;
    case "help":
      showHelp();
      break;
    default:
      console.log(`Unknown command: ${command}`);
      console.log('Run "omkx help" for usage information.');
      process.exit(1);
  }
}

main();
