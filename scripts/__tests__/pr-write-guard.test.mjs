import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import {
  authorizationScope,
  evaluateWrite,
  executeWrite,
  inspectHook,
} from '../pr-write-guard.mjs';

const sha = '1'.repeat(40);
const next = '2'.repeat(40);
const request = {
  operation: 'push',
  actor: 'contributor',
  repository: 'org/docs',
  branch: 'fix/tls',
  expectedHead: sha,
  sha: next,
  pullRequest: { repository: 'org/docs', number: 10 },
};
const pr = {
  number: 10,
  state: 'open',
  user: { login: 'contributor' },
  head: { sha, ref: 'fix/tls', repo: { full_name: 'org/docs' } },
  base: { ref: 'master', repo: { full_name: 'org/docs' } },
};
const facts = {
  actor: 'contributor',
  repository: { owner: { login: 'org' }, permissions: { push: true } },
  ref: sha,
  pullRequests: [pr],
};
const authorize = (input) => ({
  ...input,
  authorization: {
    ...authorizationScope(input),
    instruction: 'The user explicitly authorized this operation and target.',
  },
});

test('own PR writes still require actual access and an unchanged head', () => {
  assert.doesNotThrow(() => evaluateWrite(request, facts));
  assert.throws(
    () => evaluateWrite(request, { ...facts, actor: 'different-account' }),
    /identity/
  );
  assert.throws(
    () => evaluateWrite(request, { ...facts, repository: { permissions: {} } }),
    /fork/
  );
  assert.throws(
    () => evaluateWrite(request, { ...facts, ref: next }),
    /head changed/
  );
});

test('write access and maintainer edit permission do not authorize another author’s branch', () => {
  const other = {
    ...pr,
    maintainer_can_modify: true,
    user: { login: 'other' },
  };
  const snapshot = { ...facts, pullRequests: [other] };
  assert.throws(
    () => evaluateWrite(request, snapshot),
    /suggestions or a correction PR/
  );
  assert.doesNotThrow(() => evaluateWrite(authorize(request), snapshot));
  for (const field of [
    'actor',
    'repository',
    'operation',
    'target',
    'expectedHead',
  ]) {
    const scoped = authorize(request);
    scoped.authorization[field] = 'wrong';
    assert.throws(() => evaluateWrite(scoped, snapshot), /authorization/);
  }
  assert.throws(
    () =>
      evaluateWrite({ ...authorize(request), sha: '3'.repeat(40) }, snapshot),
    /authorization/
  );
});

test('a contributor can publish a new branch or update an owned fork', () => {
  const fresh = { ...request, expectedHead: null, pullRequest: undefined };
  assert.doesNotThrow(() =>
    evaluateWrite(fresh, { ...facts, ref: null, pullRequests: [] })
  );
  const fork = {
    ...facts,
    repository: {
      owner: { login: 'contributor' },
      permissions: { push: true },
    },
    pullRequests: [],
  };
  assert.doesNotThrow(() =>
    evaluateWrite({ ...request, pullRequest: undefined }, fork)
  );
  assert.throws(
    () =>
      evaluateWrite(
        { ...request, pullRequest: undefined },
        { ...facts, pullRequests: [] }
      ),
    /authorization/
  );
});

test('a PR identifier cannot authorize an unrelated branch or repository', () => {
  assert.throws(
    () =>
      evaluateWrite(request, {
        ...facts,
        pullRequests: [{ ...pr, head: { ...pr.head, ref: 'other' } }],
      }),
    /target/
  );
  assert.throws(
    () =>
      evaluateWrite(request, {
        ...facts,
        pullRequests: [
          {
            ...pr,
            head: { ...pr.head, repo: { full_name: 'elsewhere/docs' } },
          },
        ],
      }),
    /target/
  );
});

test('closing someone else’s PR requires authority and a verified successor', () => {
  const close = authorize({
    operation: 'close-pr',
    actor: 'contributor',
    repository: 'org/docs',
    pr: 10,
    expectedHead: sha,
    successor: 11,
  });
  const original = { ...pr, user: { login: 'external' } };
  const snapshot = {
    ...facts,
    pullRequests: [original],
    successor: { ...pr, number: 11 },
    preservesHead: true,
  };
  assert.doesNotThrow(() => evaluateWrite(close, snapshot));
  assert.throws(
    () =>
      evaluateWrite(close, { ...snapshot, repository: { permissions: {} } }),
    /maintainer.*close/
  );
  assert.throws(
    () => evaluateWrite(close, { ...snapshot, preservesHead: false }),
    /ancestry/
  );
  assert.throws(
    () =>
      evaluateWrite(close, {
        ...snapshot,
        successor: { ...pr, state: 'closed' },
      }),
    /open successor/
  );
  assert.throws(
    () =>
      evaluateWrite(authorize({ ...close, successor: undefined }), snapshot),
    /successor/
  );
  assert.throws(
    () =>
      evaluateWrite(close, {
        ...snapshot,
        successor: { ...pr, base: { ...pr.base, ref: 'different' } },
      }),
    /base/
  );
});

test('a PR author can close their own PR without repository write access', () => {
  const close = authorize({
    operation: 'close-pr',
    actor: 'contributor',
    repository: 'org/docs',
    pr: 10,
    expectedHead: sha,
  });
  assert.doesNotThrow(() =>
    evaluateWrite(close, { ...facts, repository: { permissions: {} } })
  );
});

test('merging requires scoped authorization and repository write access', () => {
  const merge = {
    operation: 'merge-pr',
    actor: 'contributor',
    repository: 'org/docs',
    pr: 10,
    expectedHead: sha,
  };
  assert.throws(() => evaluateWrite(merge, facts), /authorization/);
  assert.doesNotThrow(() => evaluateWrite(authorize(merge), facts));
  assert.throws(
    () =>
      evaluateWrite(authorize(merge), {
        ...facts,
        repository: { permissions: { triage: true } },
      }),
    /maintainer.*merge/
  );
});

test('file and ref writes use the same policy as Git pushes', () => {
  const other = {
    ...facts,
    pullRequests: [{ ...pr, user: { login: 'external' } }],
  };
  for (const operation of ['update-file', 'update-ref']) {
    assert.throws(
      () => evaluateWrite({ ...request, operation }, other),
      /suggestions or a correction PR/
    );
    assert.doesNotThrow(() =>
      evaluateWrite(authorize({ ...request, operation }), other)
    );
  }
});

test('denial prevents every write, including when live GitHub inspection fails', async () => {
  const writes = [];
  const api = async (endpoint, method) => {
    if (method !== 'GET') writes.push(endpoint);
    if (endpoint === 'user') return { login: 'contributor' };
    if (endpoint === 'repos/org/docs') return facts.repository;
    if (endpoint.includes('/pulls/10'))
      return { ...pr, user: { login: 'external' } };
    if (endpoint.includes('/git/ref/')) return { object: { sha } };
    return [];
  };
  await assert.rejects(
    executeWrite(request, { api, git: () => writes.push('git') }),
    /suggestions/
  );
  await assert.rejects(
    executeWrite(request, {
      api: async () => {
        throw new Error('offline');
      },
      git: () => writes.push('git'),
    }),
    /offline/
  );
  assert.deepEqual(writes, []);
});

test('an allowed API write executes only its validated target and payload', async () => {
  const calls = [];
  const api = async (endpoint, method, body) => {
    if (method !== 'GET') {
      calls.push({ endpoint, method, body });
      return { ok: true };
    }
    if (endpoint === 'user') return { login: 'contributor' };
    if (endpoint === 'repos/org/docs') return facts.repository;
    if (endpoint.includes('/pulls/10')) return pr;
    if (endpoint.includes('/git/ref/')) return { object: { sha } };
    return [];
  };
  await executeWrite({ ...request, operation: 'update-ref' }, { api });
  assert.deepEqual(calls, [
    {
      endpoint: 'repos/org/docs/git/refs/heads/fix/tls',
      method: 'PATCH',
      body: { sha: next, force: false },
    },
  ]);
});

test('tool hook blocks raw Git and API mutation routes while allowing inspection', () => {
  for (const command of [
    'git push origin fix/tls',
    'git -C /tmp/repo push',
    'gh pr close 10',
    'gh pr --repo org/docs merge 10',
    'gh api -X PATCH repos/org/docs/git/refs/heads/fix/tls',
    'gh api --method=PATCH repos/org/docs/git/refs/heads/fix/tls',
    'curl -X PUT https://api.github.com/repos/org/docs/contents/a.md',
  ]) {
    assert.match(
      inspectHook({ tool_name: 'Bash', tool_input: { command } }),
      /pr-write-guard/
    );
  }
  for (const name of [
    'mcp__github__push_files',
    'mcp__codex_apps__github_update_ref',
    'mcp__codex_apps__github_update_file',
    'mcp__github__merge_pull_request',
  ]) {
    assert.match(
      inspectHook({ tool_name: name, tool_input: {} }),
      /pr-write-guard/
    );
  }
  assert.match(
    inspectHook({
      tool_name: 'mcp__codex_apps__github_update_pull_request',
      tool_input: { state: 'closed' },
    }),
    /pr-write-guard/
  );
  assert.equal(
    inspectHook({
      tool_name: 'mcp__codex_apps__github_update_pull_request',
      tool_input: { body: 'Description update' },
    }),
    null
  );
  assert.equal(
    inspectHook({
      tool_name: 'Bash',
      tool_input: { command: 'git status --short' },
    }),
    null
  );
  for (const command of [
    'git log --grep push',
    'gh pr edit 10 --title "Explain merge behavior"',
    'node scripts/pr-write-guard.mjs /tmp/request.json --check',
  ]) {
    assert.equal(
      inspectHook({ tool_name: 'Bash', tool_input: { command } }),
      null
    );
  }
  assert.equal(
    inspectHook({ tool_name: 'mcp__github__fetch_pr', tool_input: {} }),
    null
  );
});

test('configured hooks execute the shared guard and block a real hook event', () => {
  const root = new URL('../../', import.meta.url);
  for (const file of ['.codex/hooks.json', '.claude/settings.json']) {
    const config = JSON.parse(fs.readFileSync(new URL(file, root), 'utf8'));
    const hook = config.hooks.PreToolUse.find((group) =>
      group.hooks.some((handler) =>
        handler.command.includes('pr-write-guard.mjs')
      )
    );
    assert.match('mcp__github__update_ref', new RegExp(hook.matcher));
    assert.match('Bash', new RegExp(hook.matcher));
    const result = spawnSync('sh', ['-c', hook.hooks[0].command], {
      cwd: root,
      encoding: 'utf8',
      input: JSON.stringify({
        tool_name: 'mcp__github__update_ref',
        tool_input: {},
      }),
    });
    assert.equal(result.status, 2, result.stderr);
    assert.match(result.stderr, /pr-write-guard/);
    const read = spawnSync('sh', ['-c', hook.hooks[0].command], {
      cwd: new URL('scripts/', root),
      encoding: 'utf8',
      input: JSON.stringify({
        tool_name: 'Bash',
        tool_input: { command: 'git status --short' },
      }),
    });
    assert.equal(read.status, 0, read.stderr);
  }
});

test('authorization scope ignores JSON ordering and cannot authorize changed payloads', () => {
  assert.deepEqual(
    authorizationScope(request),
    authorizationScope(Object.fromEntries(Object.entries(request).reverse()))
  );
  assert.notEqual(
    authorizationScope(request).payloadSha256,
    authorizationScope({ ...request, sha: next.replace(/^2/, '3') })
      .payloadSha256
  );
});

test('file writes validate paths and bind authorization to the exact content', async () => {
  const calls = [];
  const fileRequest = {
    ...request,
    operation: 'update-file',
    file: {
      path: 'content/a page.md',
      message: 'Correct guidance',
      sha,
      content: Buffer.from('Verified guidance').toString('base64'),
    },
  };
  const api = async (endpoint, method, body) => {
    if (method !== 'GET') {
      calls.push({ endpoint, method, body });
      return { ok: true };
    }
    if (endpoint === 'user') return { login: 'contributor' };
    if (endpoint === 'repos/org/docs') return facts.repository;
    if (endpoint.includes('/pulls/10')) return pr;
    if (endpoint.includes('/git/ref/')) return { object: { sha } };
    return [];
  };
  await executeWrite(fileRequest, { api, check: true });
  assert.deepEqual(calls, []);
  await executeWrite(fileRequest, { api });
  assert.deepEqual(calls, [
    {
      endpoint: 'repos/org/docs/contents/content/a%20page.md',
      method: 'PUT',
      body: {
        message: 'Correct guidance',
        sha,
        branch: 'fix/tls',
        content: fileRequest.file.content,
      },
    },
  ]);
  const other = {
    ...facts,
    pullRequests: [{ ...pr, user: { login: 'external' } }],
  };
  const approved = authorize(fileRequest);
  assert.throws(
    () =>
      evaluateWrite(
        { ...approved, file: { ...approved.file, content: '' } },
        other
      ),
    /authorization/
  );
  let reads = 0;
  await assert.rejects(
    executeWrite(
      { ...fileRequest, file: { ...fileRequest.file, path: '../outside.md' } },
      {
        api: () => {
          reads += 1;
        },
      }
    ),
    /relative file path/
  );
  assert.equal(reads, 0);
});

test('unknown operations and forced rewrites fail before contacting GitHub', async () => {
  let reads = 0;
  const api = () => {
    reads += 1;
  };
  await assert.rejects(
    executeWrite({ ...request, operation: 'delete-repository' }, { api }),
    /Unsupported/
  );
  await assert.rejects(
    executeWrite({ ...request, force: true }, { api }),
    /History rewrites/
  );
  assert.equal(reads, 0);
});
