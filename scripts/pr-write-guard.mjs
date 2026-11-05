#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const SCRIPT = fileURLToPath(import.meta.url);
const BRANCH_WRITES = new Set([
  'push',
  'update-ref',
  'update-file',
  'delete-file',
]);
const OPERATIONS = new Set([...BRANCH_WRITES, 'merge-pr', 'close-pr']);
const same = (a, b) =>
  typeof a === 'string' &&
  typeof b === 'string' &&
  a.toLowerCase() === b.toLowerCase();
const fail = (message) => {
  throw new Error(message);
};

function validateRequest(request) {
  if (!request || !OPERATIONS.has(request.operation))
    fail('Unsupported write operation.');
  if (!/^[\w.-]+\/[\w.-]+$/.test(request.repository ?? ''))
    fail('Use an explicit owner/repository target.');
  if (!/^[\w-]+$/.test(request.actor ?? ''))
    fail('Provide the invoking user’s GitHub login.');
  if (
    request.expectedHead !== null &&
    !/^[a-f\d]{40}$/i.test(request.expectedHead ?? '')
  )
    fail('Provide the exact expectedHead SHA, or null for a new branch.');
  if (BRANCH_WRITES.has(request.operation)) {
    if (
      typeof request.branch !== 'string' ||
      !/^[\w./-]+$/.test(request.branch) ||
      request.branch.includes('..') ||
      request.branch.startsWith('-')
    )
      fail('Provide a literal branch name.');
    if (request.force)
      fail('History rewrites are outside this collaborative review guard.');
    if (
      ['push', 'update-ref'].includes(request.operation) &&
      !/^[a-f\d]{40}$/i.test(request.sha ?? '')
    )
      fail('Provide the exact commit SHA to publish.');
    if (
      request.pullRequest &&
      (!/^[\w.-]+\/[\w.-]+$/.test(request.pullRequest.repository ?? '') ||
        !Number.isSafeInteger(request.pullRequest.number) ||
        request.pullRequest.number < 1)
    )
      fail('Invalid pullRequest target.');
    if (['update-file', 'delete-file'].includes(request.operation)) {
      const file = request.file;
      if (
        !file ||
        typeof file.path !== 'string' ||
        file.path.startsWith('/') ||
        file.path
          .split('/')
          .some((part) => !part || part === '..' || part === '.') ||
        !file.message ||
        !/^[a-f\d]{40}$/i.test(file.sha ?? '')
      )
        fail(
          'Provide a relative file path, commit message, and current file blob SHA.'
        );
      if (
        request.operation === 'update-file' &&
        (typeof file.content !== 'string' ||
          !/^(?:[A-Za-z\d+/]{4})*(?:[A-Za-z\d+/]{2}==|[A-Za-z\d+/]{3}=)?$/.test(
            file.content
          ))
      )
        fail('Provide base64-encoded file content.');
    }
  } else if (!Number.isSafeInteger(request.pr) || request.pr < 1)
    fail('Provide an explicit PR number.');
  if (
    request.successor !== undefined &&
    (!Number.isSafeInteger(request.successor) ||
      request.successor < 1 ||
      request.successor === request.pr)
  )
    fail('Provide a different successor PR number in the same repository.');
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, canonical(item)])
    );
  return value;
}

export function authorizationScope(request) {
  const { authorization, ...payload } = request;
  return {
    actor: request.actor,
    repository: request.repository,
    operation: request.operation,
    target: request.branch ?? String(request.pr),
    expectedHead: request.expectedHead,
    payloadSha256: createHash('sha256')
      .update(JSON.stringify(canonical(payload)))
      .digest('hex'),
  };
}

function requireAuthorization(request) {
  const scope = authorizationScope(request);
  const authorization = request.authorization;
  if (
    !authorization ||
    !Object.entries(scope).every(
      ([key, value]) => authorization[key] === value
    ) ||
    typeof authorization.instruction !== 'string' ||
    !authorization.instruction.trim()
  ) {
    fail(
      'Scoped authorization is required for this actor, operation, repository, target, and expected head. Record the user’s explicit instruction; use suggestions or a correction PR otherwise.'
    );
  }
}

export function evaluateWrite(request, facts) {
  if (!same(request.actor, facts.actor))
    fail(
      'Authenticated GitHub identity differs from the invoking user. Use that user’s credentials or hand off.'
    );
  const permissions = facts.repository.permissions ?? {};
  const canPush =
    permissions.push === true ||
    permissions.maintain === true ||
    permissions.admin === true;
  if (BRANCH_WRITES.has(request.operation)) {
    if (!canPush)
      fail(
        'No push permission on the target repository. Publish from the invoking user’s fork.'
      );
    if (facts.ref !== request.expectedHead)
      fail(
        'The target branch head changed. Inspect it and prepare a new scoped request.'
      );
    for (const pr of facts.pullRequests) {
      if (
        pr.state !== 'open' ||
        !same(pr.head.repo?.full_name, request.repository) ||
        pr.head.ref !== request.branch ||
        pr.head.sha !== facts.ref
      )
        fail('The PR does not match the target repository, branch, or head.');
    }
    if (
      facts.ref === null ||
      (facts.pullRequests.length > 0 &&
        facts.pullRequests.every((pr) => same(pr.user.login, request.actor))) ||
      (facts.pullRequests.length === 0 &&
        same(facts.repository.owner?.login, request.actor))
    )
      return;
    if (
      facts.pullRequests.some((pr) => !same(pr.user.login, request.actor)) &&
      !request.authorization
    )
      fail(
        'Another author owns this PR. Use suggestions or a correction PR unless the user explicitly approves the direct write.'
      );
    requireAuthorization(request);
    return;
  }
  const pr = facts.pullRequests[0];
  if (
    !pr ||
    pr.number !== request.pr ||
    pr.state !== 'open' ||
    !same(pr.base.repo?.full_name, request.repository)
  )
    fail('The target PR is not open in the requested repository.');
  if (pr.head.sha !== request.expectedHead)
    fail('The PR head changed. Inspect it before proceeding.');
  requireAuthorization(request);
  if (request.operation === 'merge-pr') {
    if (!canPush)
      fail('A maintainer with write permission must merge this PR.');
    return;
  }
  if (same(pr.user.login, request.actor)) return;
  if (!(canPush || permissions.triage === true))
    fail(
      'Ask the original author or a maintainer with closure permission to close this PR.'
    );
  const successor = facts.successor;
  if (!request.successor || !successor || successor.state !== 'open')
    fail(
      'Verify an open successor PR before closing another author’s contribution.'
    );
  if (
    !same(successor.base.repo?.full_name, request.repository) ||
    successor.base.ref !== pr.base.ref
  )
    fail('The successor must target the original upstream base.');
  if (!facts.preservesHead)
    fail(
      'The successor does not preserve the original fork head ancestry. Leave the original open.'
    );
}

function command(program, args, input) {
  const result = spawnSync(program, args, {
    encoding: 'utf8',
    input,
    env: { ...process.env, GH_HOST: 'github.com', GH_PROMPT_DISABLED: '1' },
  });
  if (result.error || result.status !== 0)
    fail(result.error?.message ?? result.stderr?.trim() ?? `${program} failed`);
  return result.stdout;
}

async function github(endpoint, method = 'GET', body) {
  const args = [
    'api',
    '--hostname',
    'github.com',
    '--method',
    method,
    endpoint,
  ];
  if (body !== undefined) args.push('--input', '-');
  return JSON.parse(
    command(
      'gh',
      args,
      body === undefined ? undefined : JSON.stringify(body)
    ) || 'null'
  );
}

async function inspect(request, api) {
  const actor = (await api('user', 'GET')).login;
  const repository = await api(`repos/${request.repository}`, 'GET');
  if (!BRANCH_WRITES.has(request.operation)) {
    const pr = await api(
      `repos/${request.repository}/pulls/${request.pr}`,
      'GET'
    );
    const facts = { actor, repository, pullRequests: [pr] };
    if (request.operation === 'close-pr' && request.successor) {
      facts.successor = await api(
        `repos/${request.repository}/pulls/${request.successor}`,
        'GET'
      );
      const comparison = await api(
        `repos/${request.repository}/compare/${pr.head.sha}...${facts.successor.head.sha}`,
        'GET'
      );
      facts.preservesHead = ['ahead', 'identical'].includes(comparison.status);
    }
    return facts;
  }
  let ref;
  try {
    ref = (
      await api(
        `repos/${request.repository}/git/ref/heads/${request.branch}`,
        'GET'
      )
    ).object.sha;
  } catch (error) {
    if (!/\b404\b/.test(error.message)) throw error;
    ref = null;
  }
  const owner = request.repository.split('/')[0];
  const prs = await api(
    `repos/${request.repository}/pulls?state=open&head=${encodeURIComponent(`${owner}:${request.branch}`)}&per_page=100`,
    'GET'
  );
  if (prs.length >= 100)
    fail('PR lookup is incomplete. Inspect the branch before publishing.');
  if (request.pullRequest) {
    const pr = await api(
      `repos/${request.pullRequest.repository}/pulls/${request.pullRequest.number}`,
      'GET'
    );
    prs.push(pr);
  }
  return { actor, repository, ref, pullRequests: prs };
}

export async function executeWrite(
  request,
  { api = github, git = (args) => command('git', args), check = false } = {}
) {
  validateRequest(request);
  const facts = await inspect(request, api);
  evaluateWrite(request, facts);
  if (request.operation === 'push') {
    if (git(['rev-parse', 'HEAD']).trim() !== request.sha)
      fail('The local HEAD differs from the requested commit.');
    if (request.expectedHead !== null)
      git(['merge-base', '--is-ancestor', request.expectedHead, request.sha]);
  }
  if (check)
    return {
      allowed: true,
      actor: facts.actor,
      operation: request.operation,
      repository: request.repository,
      target: request.branch ?? request.pr,
    };
  if (request.operation === 'push') {
    return git([
      '-c',
      'credential.helper=',
      '-c',
      'credential.helper=!gh auth git-credential',
      'push',
      `--force-with-lease=refs/heads/${request.branch}:${request.expectedHead ?? ''}`,
      `https://github.com/${request.repository}.git`,
      `${request.sha}:refs/heads/${request.branch}`,
    ]);
  }
  if (request.operation === 'update-ref')
    return api(
      `repos/${request.repository}/git/refs/heads/${request.branch}`,
      'PATCH',
      { sha: request.sha, force: false }
    );
  if (['update-file', 'delete-file'].includes(request.operation)) {
    const { path: filePath, message, content, sha } = request.file;
    const body = { message, sha, branch: request.branch };
    if (request.operation === 'update-file') body.content = content;
    return api(
      `repos/${request.repository}/contents/${filePath.split('/').map(encodeURIComponent).join('/')}`,
      request.operation === 'update-file' ? 'PUT' : 'DELETE',
      body
    );
  }
  if (request.operation === 'merge-pr')
    return api(`repos/${request.repository}/pulls/${request.pr}/merge`, 'PUT', {
      sha: request.expectedHead,
      merge_method: 'merge',
    });
  return api(`repos/${request.repository}/pulls/${request.pr}`, 'PATCH', {
    state: 'closed',
  });
}

export function inspectHook(event) {
  const name = event.tool_name ?? '';
  const input = event.tool_input ?? {};
  const raw = input.command ?? input.cmd ?? '';
  const blockedTool =
    /(?:github(?:__|_))(?:update_ref|push_files|create_or_update_file|update_file|delete_file|merge_pull_request)$/.test(
      name
    ) ||
    (/(?:github(?:__|_))update_pull_request$/.test(name) &&
      input.state === 'closed');
  const blockedShell =
    /\bgit(?:\s+(?:(?:-C|-c|--git-dir|--work-tree)\s+(?:"[^"]*"|'[^']*'|[^\s;&|]+)|--[\w-]+(?:=[^\s;&|]+)?))*\s+push\b/.test(
      raw
    ) ||
    /\bgh(?:\s+(?:--repo|-R)\s+\S+)?\s+pr(?:\s+(?:--repo|-R)\s+\S+)?\s+(?:close|merge)\b/.test(
      raw
    ) ||
    (/\b(?:gh\s+api|curl)\b/.test(raw) &&
      /(?:git\/refs|\/contents\/|\/pulls(?:\/|\b)|graphql)/.test(raw) &&
      /(?:--method(?:=|\s+)|-X\s*)(?:POST|PUT|PATCH|DELETE)|(?:--input|--field|--raw-field|--data|-f\b|-F\b|-d\b)/i.test(
        raw
      ));
  return blockedTool || blockedShell
    ? 'Use node scripts/pr-write-guard.mjs REQUEST.json for this protected write. It checks identity, permissions, target ownership, and scoped authorization; use a fork or maintainer handoff when access is missing.'
    : null;
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT) {
  try {
    if (process.argv[2] === '--hook') {
      const reason = inspectHook(JSON.parse(fs.readFileSync(0, 'utf8')));
      if (reason) fail(reason);
    } else {
      if (
        process.argv.length < 3 ||
        process.argv.length > 4 ||
        (process.argv[3] && !['--check', '--scope'].includes(process.argv[3]))
      )
        fail(
          'Usage: node scripts/pr-write-guard.mjs REQUEST.json [--check|--scope]'
        );
      const request = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
      validateRequest(request);
      const result =
        process.argv[3] === '--scope'
          ? { ...authorizationScope(request), instruction: '' }
          : await executeWrite(request, {
              check: process.argv[3] === '--check',
            });
      console.log(typeof result === 'string' ? result : JSON.stringify(result));
    }
  } catch (error) {
    console.error(`PR write guard: ${error.message}`);
    process.exitCode = 2;
  }
}
