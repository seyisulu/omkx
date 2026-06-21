#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(__dirname, '..');

// ─── Help ────────────────────────────────────────────────────────────────

function showHelp() {
  const help = `
╔══════════════════════════════════════════════════════════╗
║                    omkx v${getVersion()}                        ║
║         Multi-Agent Orchestration for Kiro               ║
╚══════════════════════════════════════════════════════════╝

Usage: omkx <command> [options]

Commands:
  install       Install omkx agents and configuration
  status        Show installation status
  list          List installed agents
  plans         List execution plans
  help          Show this help

Installation:
  npx omkx@latest install     Install to current directory
  omkx install --force        Force reinstall
  omkx install --dir <path>   Install to specific directory

Examples:
  omkx install                Install omkx in current directory
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
    const pkg = JSON.parse(readFileSync(resolve(PKG_ROOT, 'package.json'), 'utf8'));
    return pkg.version;
  } catch {
    return '0.1.0';
  }
}

// ─── Install ──────────────────────────────────────────────────────────────

const MANIFEST = {
  agents: [
    'prometheus.json',
    'atlas.json',
    'sisyphus.json',
    'ghost-explorer.json',
    'ghost-metis.json',
    'ghost-momus.json',
    'ghost-oracle.json',
    'ghost-librarian.json',
    'ghost-junior.json',
    'ghost-looker.json',
  ],
  prompts: [
    'prometheus.md',
    'atlas.md',
    'sisyphus.md',
    'ghost-explorer.md',
    'ghost-metis.md',
    'ghost-momus.md',
    'ghost-oracle.md',
    'ghost-librarian.md',
    'ghost-junior.md',
    'ghost-looker.md',
  ],
  hooks: [
    'agent-spawn.sh',
    'pre-tool-use.sh',
    'prometheus-read-guard.sh',
    'prometheus-write-guard.sh',
  ],
  steering: [
    'product.md',
    'conventions.md',
    'plan-format.md',
    'architecture.md',
  ],
  skills: [
    'git-operations',
    'code-review',
    'frontend-ux',
    'debugging',
    'programming',
  ],
  settings: [
    'mcp.json',
  ],
};

function install(targetDir, force = false) {
  const kiroDir = resolve(targetDir, '.kiro');

  // Check if already installed
  const manifestMarker = resolve(kiroDir, 'agents', 'prometheus.json');
  if (existsSync(manifestMarker) && !force) {
    console.log('✅ omkx is already installed.');
    console.log('   Use --force to reinstall.');
    return;
  }

  console.log(`📦 Installing omkx to ${targetDir}...\n`);

  // Copy .kiro directory
  copyDir(resolve(PKG_ROOT, '.kiro'), kiroDir);

  // Make hooks executable
  const hooksDir = resolve(kiroDir, 'hooks');
  try {
    execSync(`chmod +x ${hooksDir}/*.sh`, { stdio: 'pipe' });
  } catch {
    // Ignore if no hooks dir
  }

  // Create empty dirs with gitkeep
  ensureDir(resolve(kiroDir, 'plans'));
  ensureDir(resolve(kiroDir, 'notepads'));
  touchIfMissing(resolve(kiroDir, 'plans', '.gitkeep'));
  touchIfMissing(resolve(kiroDir, 'notepads', '.gitkeep'));

  console.log('');
  console.log('✅ omkx installed successfully!');
  console.log('');
  console.log('📂 Installed structure:');
  console.log(`   .kiro/agents/       → ${MANIFEST.agents.length} agents`);
  console.log(`   .kiro/prompts/      → ${MANIFEST.prompts.length} prompts`);
  console.log(`   .kiro/hooks/        → ${MANIFEST.hooks.length} hooks`);
  console.log(`   .kiro/skills/       → ${MANIFEST.skills.length} skills`);
  console.log(`   .kiro/steering/omkx/ → ${MANIFEST.steering.length} steering files`);
  console.log(`   .kiro/settings/     → ${MANIFEST.settings.length} settings`);
  console.log(`   .kiro/plans/        → Execution plans`);
  console.log(`   .kiro/notepads/     → Agent notepads`);
  console.log('');
  console.log('⌨️  Keyboard Shortcuts in Kiro:');
  console.log('   ctrl+p → Prometheus (Planner)');
  console.log('   ctrl+a → Atlas (Plan Executor)');
  console.log('   ctrl+e → Sisyphus (Direct Executor)');
  console.log('');
  console.log('📖 Read .kiro/steering/omkx/product.md for full documentation.');
}

// ─── Status ───────────────────────────────────────────────────────────────

function status(targetDir) {
  const kiroDir = resolve(targetDir, '.kiro');
  const manifestMarker = resolve(kiroDir, 'agents', 'prometheus.json');

  console.log('🔍 omkx Status\n');

  if (!existsSync(manifestMarker)) {
    console.log('❌ omkx is NOT installed.');
    console.log('   Run: npx omkx install');
    return;
  }

  console.log('✅ omkx is installed.\n');

  // Count agents
  const agentsDir = resolve(kiroDir, 'agents');
  let agentCount = 0;
  if (existsSync(agentsDir)) {
    agentCount = MANIFEST.agents.filter(a => existsSync(resolve(agentsDir, a))).length;
  }
  console.log(`   Agents: ${agentCount}/${MANIFEST.agents.length}`);

  // Count prompts
  const promptsDir = resolve(kiroDir, 'prompts');
  let promptCount = 0;
  if (existsSync(promptsDir)) {
    promptCount = MANIFEST.prompts.filter(p => existsSync(resolve(promptsDir, p))).length;
  }
  console.log(`   Prompts: ${promptCount}/${MANIFEST.prompts.length}`);

  // Count plans
  const plansDir = resolve(kiroDir, 'plans');
  let planCount = 0;
  if (existsSync(plansDir)) {
    try {
      planCount = execSync(`ls -1 ${plansDir}/*.md 2>/dev/null | wc -l`, { stdio: 'pipe' }).toString().trim();
    } catch { planCount = 0; }
  }
  console.log(`   Plans: ${planCount}`);

  // Count notepads
  const notepadsDir = resolve(kiroDir, 'notepads');
  let notepadCount = 0;
  if (existsSync(notepadsDir)) {
    try {
      notepadCount = execSync(`ls -1d ${notepadsDir}/*/ 2>/dev/null | wc -l`, { stdio: 'pipe' }).toString().trim();
    } catch { notepadCount = 0; }
  }
  console.log(`   Notepads: ${notepadCount}`);
}

// ─── List ──────────────────────────────────────────────────────────────────

function list(targetDir) {
  const kiroDir = resolve(targetDir, '.kiro');
  const agentsDir = resolve(kiroDir, 'agents');

  console.log('🤖 omkx Agents\n');

  if (!existsSync(agentsDir)) {
    console.log('❌ No agents found. Run: npx omkx install');
    return;
  }

  console.log('Main Agents:');
  const mainAgents = ['prometheus', 'atlas', 'sisyphus'];
  const shortcuts = { prometheus: 'ctrl+p', atlas: 'ctrl+a', sisyphus: 'ctrl+e' };
  const descriptions = {
    prometheus: 'Planner — creates execution plans',
    atlas: 'Plan Executor — orchestrates plan execution',
    sisyphus: 'Direct Executor — handles ad-hoc tasks',
  };

  for (const name of mainAgents) {
    const file = resolve(agentsDir, `${name}.json`);
    const installed = existsSync(file) ? '✅' : '❌';
    console.log(`  ${installed} ${name.padEnd(16)} ${shortcuts[name].padEnd(8)} ${descriptions[name]}`);
  }

  console.log('\nSubagents:');
  const subAgents = [
    { name: 'ghost-oracle', desc: 'Strategic technical advisor' },
    { name: 'ghost-metis', desc: 'Pre-planning analyst' },
    { name: 'ghost-momus', desc: 'Plan validator' },
    { name: 'ghost-librarian', desc: 'Research specialist' },
    { name: 'ghost-explorer', desc: 'Codebase explorer' },
    { name: 'ghost-junior', desc: 'Implementation specialist' },
    { name: 'ghost-looker', desc: 'Media analyst' },
  ];

  for (const agent of subAgents) {
    const file = resolve(agentsDir, `${agent.name}.json`);
    const installed = existsSync(file) ? '✅' : '❌';
    console.log(`  ${installed} ${agent.name.padEnd(20)} ${agent.desc}`);
  }
}

// ─── Plans ─────────────────────────────────────────────────────────────────

function plans(targetDir) {
  const plansDir = resolve(targetDir, '.kiro', 'plans');

  console.log('📐 Execution Plans\n');

  if (!existsSync(plansDir)) {
    console.log('No plans directory found. Create plans with Prometheus (ctrl+p).');
    return;
  }

  try {
    const output = execSync(`ls -1t ${plansDir}/*.md 2>/dev/null`, { stdio: 'pipe' }).toString().trim();
    if (!output) {
      console.log('No plans found. Create plans with Prometheus (ctrl+p).');
      return;
    }
    const planFiles = output.split('\n');
    for (const plan of planFiles) {
      const name = plan.split('/').pop();
      // Try to extract title from first line
      try {
        const firstLine = execSync(`head -1 "${plan}"`, { stdio: 'pipe' }).toString().trim();
        const title = firstLine.replace(/^#\s*(Plan:\s*)?/, '');
        console.log(`  📄 ${name}`);
        console.log(`     ${title}`);
      } catch {
        console.log(`  📄 ${name}`);
      }
      console.log('');
    }
  } catch {
    console.log('No plans found.');
  }
}

// ─── Utilities ─────────────────────────────────────────────────────────────

import { cpSync, mkdirSync, writeFileSync } from 'fs';

function copyDir(src, dest) {
  cpSync(src, dest, { recursive: true });
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function touchIfMissing(file) {
  if (!existsSync(file)) {
    writeFileSync(file, '');
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  let targetDir = process.cwd();
  let force = false;

  // Parse flags
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--dir' && args[i + 1]) {
      targetDir = resolve(args[++i]);
    } else if (args[i] === '--force') {
      force = true;
    }
  }

  switch (command) {
    case 'install':
      install(targetDir, force);
      break;
    case 'status':
      status(targetDir);
      break;
    case 'list':
      list(targetDir);
      break;
    case 'plans':
      plans(targetDir);
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      console.log(`Unknown command: ${command}`);
      console.log('Run "omkx help" for usage information.');
      process.exit(1);
  }
}

main();
