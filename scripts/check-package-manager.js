#!/usr/bin/env node
// Refuse a pnpm install. This repo uses yarn (yarn.lock, yarn 1.22.22), and a
// pnpm install here succeeds silently, writes a 200KB+ pnpm-lock.yaml and a
// pnpm-workspace.yaml, and leaves both as untracked churn in every worktree.
//
// npm is allowed on purpose: .github/workflows/sync-plugins.yml runs
// `npm install playwright` inside this repo, and pr-remark-check.yml installs
// under .ci/remark-lint. Blocking npm would break both.
//
// No network call, unlike `npx only-allow` — this runs on every install.

const agent = process.env.npm_config_user_agent ?? '';

if (agent.startsWith('pnpm')) {
  process.stderr.write(
    '\nThis repository uses yarn, not pnpm.\n\n' +
      '  yarn install\n\n' +
      'A pnpm install writes pnpm-lock.yaml and pnpm-workspace.yaml that do not\n' +
      'belong here. If you already ran one, delete both files.\n\n'
  );
  process.exit(1);
}
