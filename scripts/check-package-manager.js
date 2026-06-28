#!/usr/bin/env node
/**
 * preinstall guard: enforce Yarn Classic as the only package manager.
 *
 * Runs in the `preinstall` lifecycle, before dependencies are installed, so it
 * must use Node built-ins only (no imports). It reads `npm_config_user_agent`,
 * which npm, pnpm, and Yarn all set when running lifecycle scripts -- the same
 * signal the `only-allow` package uses, but without a network fetch (important
 * for network-restricted CI; see AGENTS.md).
 *
 * Fails open: if the user agent is missing or unrecognized, it allows the
 * install rather than blocking on a false positive.
 */

const EXPECTED = 'yarn';

const userAgent = process.env.npm_config_user_agent || '';
// Format: "<name>/<version> npm/? node/<version> <os> <arch>"
const pmName = userAgent.split('/')[0];

if (pmName && pmName !== EXPECTED) {
  console.error(
    [
      '',
      `✗ This repo uses Yarn Classic. Detected "${pmName}" instead.`,
      '',
      '  Install dependencies with:',
      '',
      '    yarn install',
      '',
      '  See "packageManager" in package.json for the pinned version.',
      '',
    ].join('\n')
  );
  process.exit(1);
}
