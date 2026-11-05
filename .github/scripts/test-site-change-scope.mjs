import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  agentPackageChange,
  isAgentMarkdown,
  needsSiteBuild,
} from './site-change-scope.mjs';

test('agent instructions and guard implementation do not require a site build', () => {
  const files = [
    'AGENTS.md',
    'content/AGENTS.md',
    'layouts/nested/CLAUDE.md',
    '.agents/skills/review/SKILL.md',
    '.claude/rules/content-review.md',
    '.claude/settings.json',
    '.codex/hooks.json',
    '.github/instructions/content-review.instructions.md',
    '.github/workflows/pr-agent-instructions.yml',
    'scripts/pr-write-guard.mjs',
    'scripts/__tests__/pr-write-guard.test.mjs',
    'helper-scripts/build-agent-instructions.js',
  ];
  assert.equal(needsSiteBuild(files), false);
  for (const file of [
    'content/page.md',
    'layouts/header.html',
    'assets/main.js',
    'data/products.yml',
    'api-docs/spec.yaml',
    'yarn.lock',
    'unknown.txt',
    '.github/scripts/site-change-scope.mjs',
    '.github/workflows/pr-render-check.yml',
  ]) {
    assert.equal(needsSiteBuild([...files, file]), true, file);
  }
});

test('only agent package commands can bypass the build', () => {
  const before = {
    scripts: { 'build:md': 'node build.js' },
    dependencies: { a: '1' },
  };
  const after = structuredClone(before);
  after.scripts['test:pr-write-guard'] = 'node --test guard.test.mjs';
  assert.equal(agentPackageChange(before, after), true);
  assert.equal(
    needsSiteBuild(['package.json', 'content/AGENTS.md'], true),
    false
  );
  assert.equal(needsSiteBuild(['package.json']), true);
  after.dependencies.a = '2';
  assert.equal(agentPackageChange(before, after), false);
  after.dependencies.a = '1';
  after.scripts['build:md'] = 'node other.js';
  assert.equal(agentPackageChange(before, after), false);
});

test('link inputs include source skills and adapters but not product pages', () => {
  for (const path of [
    'AGENTS.md',
    'content/nested/AGENTS.md',
    'CLAUDE.md',
    '.agents/skills/example/references/details.md',
    '.github/instructions/foo.md',
    '.claude/rules/foo.md',
    'PLATFORM_REFERENCE.md',
  ])
    assert.equal(isAgentMarkdown(path), true, path);
  for (const path of [
    'content/page.md',
    '.agents/config.json',
    'scripts/guard.mjs',
  ]) {
    assert.equal(isAgentMarkdown(path), false, path);
  }
});

test('CLI compares complete Git ranges and notices deletions and renamed site files', () => {
  const directory = mkdtempSync(join(tmpdir(), 'site-scope-'));
  const git = (...args) =>
    execFileSync('git', args, { cwd: directory, encoding: 'utf8' }).trim();
  const cli = new URL('./site-change-scope.mjs', import.meta.url);
  const output = join(directory, 'output');
  const run = (base, head) => {
    writeFileSync(output, '');
    execFileSync(process.execPath, [cli.pathname], {
      cwd: directory,
      env: {
        ...process.env,
        BASE_SHA: base,
        HEAD_SHA: head,
        GITHUB_OUTPUT: output,
      },
    });
    return readFileSync(output, 'utf8');
  };
  try {
    git('init', '-q');
    git('config', 'user.email', 'fixture@example.com');
    git('config', 'user.name', 'Fixture');
    mkdirSync(join(directory, 'content'));
    writeFileSync(join(directory, 'content/page.md'), 'Published page');
    writeFileSync(
      join(directory, 'package.json'),
      JSON.stringify({ scripts: {} })
    );
    git('add', '.');
    git('commit', '-qm', 'base');
    const base = git('rev-parse', 'HEAD');
    writeFileSync(join(directory, 'content/AGENTS.md'), 'Instructions');
    writeFileSync(
      join(directory, 'package.json'),
      JSON.stringify({ scripts: { 'test:pr-write-guard': 'node test.js' } })
    );
    git('add', '.');
    git('commit', '-qm', 'agent');
    const agent = git('rev-parse', 'HEAD');
    assert.equal(run(base, agent), 'site=false\n');
    git('mv', 'content/page.md', 'content/CLAUDE.md');
    git('commit', '-qm', 'rename published page');
    const renamed = git('rev-parse', 'HEAD');
    assert.equal(run(base, renamed), 'site=true\n');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
