import { execFileSync, spawnSync } from 'node:child_process';
import { appendFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const agentScripts = new Set([
  'build:agent:instructions',
  'validate:agent-instructions',
  'test:agent-instruction-limits',
  'test:pr-write-guard',
]);

export function isAgentMarkdown(path) {
  return (
    /(^|\/)(AGENTS|CLAUDE)\.md$/.test(path) ||
    /^(\.agents\/|\.claude\/rules\/|\.github\/instructions\/).*\.md$/.test(
      path
    ) ||
    path === 'PLATFORM_REFERENCE.md'
  );
}

export function isAgentFile(path) {
  return (
    isAgentMarkdown(path) ||
    /^(\.agents\/|\.claude\/|\.codex\/)/.test(path) ||
    /^helper-scripts\/(build-agent-instructions|validate-agent-instructions|agent-instruction-limits)\.js$/.test(
      path
    ) ||
    path === 'helper-scripts/__tests__/agent-instruction-limits.test.mjs' ||
    path === 'scripts/pr-write-guard.mjs' ||
    path === 'scripts/__tests__/pr-write-guard.test.mjs' ||
    path === '.github/workflows/pr-agent-instructions.yml'
  );
}

export function agentPackageChange(before, after) {
  const strip = (value) => {
    const copy = structuredClone(value);
    for (const name of agentScripts) delete copy.scripts?.[name];
    return copy;
  };
  return JSON.stringify(strip(before)) === JSON.stringify(strip(after));
}

export function needsSiteBuild(files, packageOnlyAgents = false) {
  return files.some(
    (path) =>
      !isAgentFile(path) && !(path === 'package.json' && packageOnlyAgents)
  );
}

function main() {
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });
  const base = process.env.BASE_SHA;
  const head = process.env.HEAD_SHA;
  if (
    !/^[a-f0-9]{40}$/.test(base ?? '') ||
    !/^[a-f0-9]{40}$/.test(head ?? '')
  ) {
    throw new Error('BASE_SHA and HEAD_SHA must be full commit hashes');
  }
  const files = git(
    'diff',
    '--name-only',
    '--no-renames',
    '-z',
    `${base}...${head}`
  )
    .split('\0')
    .filter(Boolean);
  let packageOnlyAgents = false;
  if (files.includes('package.json')) {
    packageOnlyAgents = agentPackageChange(
      JSON.parse(git('show', `${base}:package.json`)),
      JSON.parse(git('show', `${head}:package.json`))
    );
  }
  if (process.argv.includes('--links')) {
    const links = files.filter(
      (path) => isAgentMarkdown(path) && existsSync(path)
    );
    if (!links.length) {
      console.log('No changed agent Markdown files to link-check.');
      return;
    }
    const result = spawnSync(
      'lychee',
      [
        '--no-progress',
        '--exclude',
        '^https://github\\.com/influxdata/docs-tooling(?:/|$)',
        '--',
        ...links,
      ],
      { stdio: 'inherit' }
    );
    if (result.error) throw result.error;
    process.exitCode = result.status ?? 1;
    return;
  }
  const site = needsSiteBuild(files, packageOnlyAgents);
  console.log(
    site
      ? 'Site checks required.'
      : 'Agent-only changes: no site build required.'
  );
  if (!site && process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      'Agent-only changes: site build and rendered-artifact checks skipped.\n'
    );
  }
  if (process.env.GITHUB_OUTPUT)
    appendFileSync(process.env.GITHUB_OUTPUT, `site=${site}\n`);
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main();
