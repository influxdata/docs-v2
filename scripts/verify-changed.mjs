#!/usr/bin/env node

import fs from 'fs';
import os from 'os';
import path from 'path';
import process from 'process';
import { execFileSync, spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = process.cwd();
const CONTENT = /^content\/.+\.md$/;
const SHARED = /^content\/shared\/.+\.md$/;
const AGENT =
  /^(AGENTS\.md|\.agents\/(instructions\/.*\.md|skills\/[^/]+\/SKILL\.md))$/;

export function parseArgs(args) {
  let run = false;
  let staged = false;
  const paths = [];
  for (const arg of args) {
    if (arg === '--run') run = true;
    else if (arg === '--staged') staged = true;
    else if (arg.startsWith('--')) throw new Error(`Unknown option: ${arg}`);
    else paths.push(normalize(arg));
  }
  if (staged && paths.length)
    throw new Error('Use paths or --staged, not both.');
  if (!staged && !paths.length)
    throw new Error('Provide one or more paths, or use --staged.');
  return { paths, run, staged };
}

export function normalize(value) {
  return value.replace(/^\.\//, '').split(path.sep).join('/');
}

export function stagedPaths(root = ROOT) {
  return execFileSync(
    'git',
    ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
    {
      cwd: root,
      encoding: 'utf8',
    }
  )
    .split('\n')
    .filter(Boolean)
    .map(normalize);
}

export function sharedConsumers(sharedPath, root = ROOT) {
  const source = `/${sharedPath.replace(/^content\//, '')}`;
  const result = [];
  walk(path.join(root, 'content'), (file) => {
    const rel = normalize(path.relative(root, file));
    if (rel === sharedPath || !rel.endsWith('.md')) return;
    if (
      fs
        .readFileSync(file, 'utf8')
        .match(new RegExp(`^source:\\s*${escapeRegex(source)}\\s*$`, 'm'))
    )
      result.push(rel);
  });
  return result.sort();
}

export function classify(paths, root = ROOT) {
  const content = paths.filter((file) => CONTENT.test(file));
  const shared = content.filter((file) => SHARED.test(file));
  const agent = paths.filter((file) => AGENT.test(file));
  const unsupported = paths.filter(
    (file) => !CONTENT.test(file) && !AGENT.test(file)
  );
  const consumers = [
    ...new Set(shared.flatMap((file) => sharedConsumers(file, root))),
  ];
  return { agent, content, consumers, shared, unsupported };
}

export function plan(paths, root = ROOT) {
  const groups = classify(paths, root);
  const commands = [];
  if (groups.content.length) {
    commands.push(['yarn', ['lint-codeblocks', ...groups.content]]);
    commands.push([
      'sh',
      [
        '-c',
        'link-checker map "$@" | xargs link-checker check',
        'verify:changed',
        ...groups.content,
        ...groups.consumers,
      ],
    ]);
  }
  if (groups.agent.length) {
    commands.push(['yarn', ['build:agent:instructions']]);
    commands.push(['yarn', ['validate:agent-instructions']]);
  }
  return { ...groups, commands };
}

export function printPlan(result) {
  console.log(`Detected: ${summary(result) || 'no supported files'}.`);
  if (result.shared.length)
    console.log(
      `Shared-content consumers: ${result.consumers.join(', ') || 'none found'}.`
    );
  console.log(
    'Commit hooks cover formatting, Vale, source-path checks, and instruction linting; CI covers broader link and render checks.'
  );
  if (result.unsupported.length)
    console.log(
      `Deferred (unsupported in this release): ${result.unsupported.join(', ')}.`
    );
  if (!result.commands.length)
    console.log('No manual checks are currently selected.');
  for (const [command, args] of result.commands)
    console.log(`Would run: ${[command, ...args].join(' ')}`);
}

export function runCommand(
  command,
  args,
  { root = ROOT, spawn = spawnSync, output = console } = {}
) {
  const log = path.join(
    os.tmpdir(),
    `docs-verify-${Date.now()}-${Math.random().toString(16).slice(2)}.log`
  );
  const result = spawn(command, args, { cwd: root, encoding: 'utf8' });
  fs.writeFileSync(log, `${result.stdout || ''}${result.stderr || ''}`);
  if (result.status === 0) {
    fs.unlinkSync(log);
    output.log(`PASS ${[command, ...args].join(' ')}`);
    return { ok: true };
  }
  const excerpt = fs
    .readFileSync(log, 'utf8')
    .trim()
    .split('\n')
    .slice(-12)
    .join('\n');
  output.error(`FAIL ${[command, ...args].join(' ')} (log: ${log})`);
  if (excerpt) output.error(excerpt);
  return { ok: false, log };
}

function walk(directory, callback) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file, callback);
    else callback(file);
  }
}
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function summary(result) {
  return [
    ['content Markdown', result.content.length],
    ['shared content', result.shared.length],
    ['agent assets', result.agent.length],
  ]
    .filter(([, count]) => count)
    .map(([name, count]) => `${count} ${name}`)
    .join(', ');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const files = options.staged ? stagedPaths() : options.paths;
    if (!files.length) throw new Error('The selected target set is empty.');
    const result = plan(files);
    printPlan(result);
    if (options.run) {
      let ok = true;
      for (const [command, args] of result.commands)
        ok = runCommand(command, args).ok && ok;
      if (!ok) process.exitCode = 1;
    }
  } catch (error) {
    console.error(`verify:changed: ${error.message}`);
    process.exitCode = 1;
  }
}
