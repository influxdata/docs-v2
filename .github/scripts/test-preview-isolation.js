import assert from 'node:assert/strict';
import {
  readFileSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import process from 'node:process';
import { load } from 'js-yaml';

const workflow = load(
  readFileSync(
    process.env.PREVIEW_WORKFLOW_PATH ||
      new URL('../workflows/pr-preview.yml', import.meta.url),
    'utf8'
  )
);
const jobs = workflow.jobs;
const build = jobs['preview-build'];
const deploy = jobs['preview-deploy'];
const comment = jobs['preview-comment'];
const stepNamed = (job, name) => job.steps.find((step) => step.name === name);
const capabilities = [
  'ACTIONS_ID_TOKEN_REQUEST_URL',
  'ACTIONS_ID_TOKEN_REQUEST_TOKEN',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_SESSION_TOKEN',
  'AWS_WEB_IDENTITY_TOKEN_FILE',
];

function runShell(script, env = {}) {
  const cleanEnv = { ...process.env, ...env };
  for (const name of capabilities) {
    if (!(name in env)) delete cleanEnv[name];
  }
  return spawnSync('bash', ['-e', '-o', 'pipefail', '-c', script], {
    env: cleanEnv,
    encoding: 'utf8',
  });
}

test('dependency execution has no OIDC, AWS secrets, or write token', () => {
  assert.deepEqual(workflow.permissions, {});
  assert.equal(build.permissions['id-token'], 'none');
  assert.ok(
    Object.values(build.permissions).every((value) =>
      ['read', 'none'].includes(value)
    )
  );
  assert.equal(build['runs-on'], 'ubuntu-latest');
  assert.equal(build.environment, undefined);
  assert.doesNotMatch(
    JSON.stringify(build),
    /secrets\.|configure-aws-credentials/
  );
  const checkout = build.steps.find((step) =>
    step.uses?.startsWith('actions/checkout@')
  );
  assert.equal(checkout.with['persist-credentials'], false);
});

test('build credential probe accepts absence and rejects every deployment capability', () => {
  const probe = stepNamed(build, 'Verify build credential isolation').run;
  assert.equal(runShell(probe).status, 0);
  for (const name of capabilities) {
    const result = runShell(probe, { [name]: 'unexpected-capability' });
    assert.equal(result.status, 1, name);
    assert.match(result.stderr, new RegExp(name));
    assert.doesNotMatch(result.stderr, /unexpected-capability/);
  }
});

test('AWS jobs use fresh runners, pinned actions, and no repository execution', () => {
  const allowed = new Set([
    'actions/download-artifact',
    'aws-actions/configure-aws-credentials',
    'actions/github-script',
  ]);
  for (const job of [deploy, jobs.cleanup]) {
    assert.equal(job['runs-on'], 'ubuntu-latest');
    assert.equal(job.permissions['id-token'], 'write');
    for (const step of job.steps) {
      if (step.uses) {
        assert.match(step.uses, /@[a-f0-9]{40}$/);
        assert.ok(allowed.has(step.uses.split('@')[0]), step.uses);
      }
      const script = step.run || step.with?.script || '';
      assert.doesNotMatch(
        script,
        /\b(?:yarn|npm|npx|node|python3?|require|import|eval)\b/
      );
      assert.doesNotMatch(
        script,
        /\.\/deploy\/|GITHUB_WORKSPACE|(?:^|\n)\s*source\s/
      );
    }
  }
  assert.equal(deploy.permissions['pull-requests'], undefined);
});

test('deploy consumes this build artifact only after a successful build', () => {
  assert.equal(deploy.needs, 'preview-build');
  assert.equal(deploy.if, undefined);
  assert.match(build.if, /should-run == 'true'/);
  assert.match(build.if, /action != 'closed'/);
  assert.match(build.if, /head.repo.full_name == github.repository/);
  const upload = stepNamed(build, 'Upload preview artifact');
  const download = stepNamed(deploy, 'Download preview artifact');
  assert.equal(upload.with['include-hidden-files'], true);
  assert.equal(upload.with['if-no-files-found'], 'error');
  assert.equal(
    download.with['artifact-ids'],
    '${{ needs.preview-build.outputs.artifact-id }}'
  );
  assert.equal(download.with['run-id'], undefined);
  assert.equal(download.with.repository, undefined);
  assert.equal(download.with.path, '${{ runner.temp }}/preview-artifact');
});

test('artifact timing rejects build output that could execute shell arithmetic', () => {
  const directory = mkdtempSync(join(tmpdir(), 'preview-timing-'));
  try {
    const result = runShell(
      stepNamed(deploy, 'Record artifact transfer time').run,
      {
        UPLOAD_START: 'x[$(touch "$RUNNER_TEMP/executed")]',
        RUNNER_TEMP: directory,
        GITHUB_STEP_SUMMARY: join(directory, 'summary'),
      }
    );
    assert.equal(result.status, 1);
    assert.throws(() => readFileSync(join(directory, 'executed')), /ENOENT/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('uploader checksum is mandatory before extraction and authentication', () => {
  const install = stepNamed(deploy, 'Install checksum-verified s3deploy');
  assert.match(install.env.S3DEPLOY_VERSION_HASH, /^[a-f0-9]{64}$/);
  assert.ok(
    install.run.indexOf('sha256sum --check') < install.run.indexOf('tar -xzf')
  );
  assert.ok(
    deploy.steps.indexOf(install) <
      deploy.steps.indexOf(stepNamed(deploy, 'Configure AWS credentials'))
  );
  const directory = mkdtempSync(join(tmpdir(), 'preview-uploader-'));
  try {
    const bin = join(directory, 'bin');
    mkdirSync(bin);
    writeFileSync(
      join(bin, 'curl'),
      '#!/bin/bash\nprintf tampered > "${@: -1}"\n',
      { mode: 0o755 }
    );
    writeFileSync(
      join(bin, 'tar'),
      '#!/bin/bash\ntouch "$RUNNER_TEMP/extracted"\n',
      { mode: 0o755 }
    );
    const result = runShell(install.run, {
      ...install.env,
      RUNNER_TEMP: directory,
      PATH: `${bin}:${process.env.PATH}`,
    });
    assert.notEqual(result.status, 0);
    assert.throws(() => readFileSync(join(directory, 'extracted')), /ENOENT/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('deploy preserves the PR prefix, header config, incremental sync, and invalidation', () => {
  const directory = mkdtempSync(join(tmpdir(), 'preview-deploy-'));
  try {
    mkdirSync(join(directory, 's3deploy'));
    writeFileSync(
      join(directory, 's3deploy/s3deploy'),
      '#!/bin/bash\nprintf "%s\\n" "$@" > "$RUNNER_TEMP/args"\n',
      { mode: 0o755 }
    );
    const result = runShell(
      stepNamed(deploy, 'Deploy full site to S3 preview prefix').run,
      {
        RUNNER_TEMP: directory,
        STAGING_BUCKET: 'staging.example',
        AWS_REGION: 'us-east-1',
        PR_NUMBER: '123',
      }
    );
    assert.equal(result.status, 0, result.stderr);
    const args = readFileSync(join(directory, 'args'), 'utf8');
    assert.match(args, /-source=.*\/preview-artifact\/public\//);
    assert.match(args, /-config=.*\/preview-artifact\/\.s3deploy\.yml/);
    assert.match(args, /-bucket=staging.example/);
    assert.match(args, /-path\npr-preview\/pr-123\n/);
    assert.doesNotMatch(args, /-force|-distribution-id/);
    assert.match(
      stepNamed(deploy, 'Invalidate CloudFront preview prefix').run,
      /\/pr-preview\/pr-\$\{PR_NUMBER\}\/\*/
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('success comments require deployment and run without OIDC from the base revision', () => {
  assert.deepEqual(comment.needs, ['preview-build', 'preview-deploy']);
  assert.equal(comment.permissions['id-token'], 'none');
  const checkout = comment.steps.find((step) =>
    step.uses?.startsWith('actions/checkout@')
  );
  assert.equal(checkout.with.ref, '${{ github.event.pull_request.base.sha }}');
  assert.equal(checkout.with['persist-credentials'], false);
  const script = stepNamed(comment, 'Post success comment').with.script;
  assert.doesNotMatch(script, /\$\{\{.*(?:changed-pages|build-time)/);
  assert.match(script, /JSON.parse\(process.env.CHANGED_PAGES\)/);
});

test('close cleanup deletes only the bot preview comment without repository imports', async () => {
  assert.match(jobs.cleanup.if, /action == 'closed'/);
  assert.match(jobs.cleanup.if, /head.repo.full_name == github.repository/);
  const script = stepNamed(jobs.cleanup, 'Delete preview comment').with.script;
  const deleted = [];
  const github = {
    rest: {
      issues: {
        listComments() {},
        async deleteComment(value) {
          deleted.push(value.comment_id);
        },
      },
    },
    async paginate() {
      return [
        {
          id: 1,
          user: { login: 'contributor' },
          body: '<!-- pr-preview-comment -->',
        },
        {
          id: 2,
          user: { login: 'github-actions[bot]' },
          body: '<!-- another-comment -->',
        },
        {
          id: 3,
          user: { login: 'github-actions[bot]' },
          body: '<!-- pr-preview-comment -->',
        },
      ];
    },
  };
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  await new AsyncFunction('github', 'context', script)(github, {
    repo: { owner: 'example', repo: 'docs' },
    issue: { number: 123 },
  });
  assert.deepEqual(deleted, [3]);
});
