# Stage GitHub production deployment with isolated jobs

**Status:** Merged 2026-11-03 through [#7991](https://github.com/influxdata/docs-v2/pull/7991)
and [#7992](https://github.com/influxdata/docs-v2/pull/7992).
Production cutover is verified.
[Credential retirement](2026-11-03-retire-circleci-credentials.md) remains in progress.

## Goal

Build production documentation without deployment credentials.
Deploy only a verified artifact through a fresh job in the protected production environment.
Stage the workflow with uploads disabled until the CircleCI cutover is explicitly completed.

## Why now

[The authentication probe](https://github.com/influxdata/docs-v2/pull/7990)
is merged.
[Its master run](https://github.com/influxdata/docs-v2/actions/runs/41686471450)
verified the production role identity and absent build credentials.
The original CircleCI context approach failed because jobs without a context
still receive V3 tokens.

## Decisions

- Use separate build, artifact-verification, and deployment jobs.
  Only deployment receives OIDC permission and the production environment.
- Validate the archive again on a fresh runner before authentication.
  Checksums and manifest commit/ref checks detect wrong or damaged artifacts.
  Reject traversal, links, and special files so build output cannot replace
  deployment code or files outside the extracted site.
- Preserve the production API build, Rust compilation, Flux frontmatter,
  Hugo configuration, AI artifacts, Markdown coherence check, page floor,
  sitemap floor, uploader version, CloudFront invalidation, and Slack notifications.
  Use committed Flux version data, matching the canonical action and manual fallback,
  rather than bringing a private-repository credential into the build.
- Use the repository deployment mode to separate verification, manual cutover,
  and automatic deployment.
  The default permits no uploads.
  Disable and drain CircleCI before enabling manual uploads.
  Enable automatic uploads only after the first controlled deployment succeeds.
- Keep existing CircleCI configuration and keys during preparation.
  Retire stack-managed keys through a reviewed CloudFormation change after cutover.
  Keep the existing manual production script as an emergency fallback.

## Explicitly out of scope

- Splitting PR Preview's build and deploy jobs.
- Self-hosted runner migration, shared-build fan-out, and other CI consolidation phases.
- Live production uploads, CircleCI shutdown, or key revocation during PR validation.

## Verification

Run `python3 -m unittest discover --start-directory deploy/tests --verbose`.
Run `actionlint .github/workflows/deploy-production.yml`.
The workflow's PR run must build the full site and verify the transferred artifact;
its protected deployment job must be skipped.
After merge, dispatch `operation=verify` on `master` while the mode remains disabled.
Use the cutover runbook in `DOCS-DEPLOYING.md` before any real upload.

Reconsider CircleCI if GitHub performance and uptime become unsatisfactory
and CircleCI fully supports the required GitHub workflow syntax outside Preview.
Revalidate the credential boundary before switching.

## Production cutover evidence

The [master verification](https://github.com/influxdata/docs-v2/actions/runs/41694815009),
[first live deployment](https://github.com/influxdata/docs-v2/actions/runs/41702740868),
and [automatic deployment after merge](https://github.com/influxdata/docs-v2/actions/runs/41720785914)
passed.
The automatic deployment served commit `2933470` on the live site.
Its restored notification appeared in `#team-docs`.
Automatic mode is enabled, and CircleCI is blocked from new work.
The separate retirement record tracks the old IAM user and replacement-key drift.
