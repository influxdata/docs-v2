# Verify GitHub production deployment access

**Status:** In review, [PR #7990](https://github.com/influxdata/docs-v2/pull/7990).

## Goal

Verify the production AWS authentication boundary before migrating site uploads.
Build jobs must not obtain deployment credentials.
Only a job in the protected GitHub `production` environment may assume the production role.

## Why now

The proposed CircleCI context boundary failed a live test:
[job 27037](https://circleci.com/gh/influxdata/docs-v2/27037) received V3 tokens without a context.
The role's project and branch restrictions cannot distinguish build from deploy on `master`.
The 2026-11-03 decision is to use GitHub Actions for build, checks, and deployment.

## Decisions

- Give the build probe `id-token: none` and check that OIDC request variables and AWS credentials are absent.
  Separate jobs on fresh hosted runners establish the intended boundary.
- Request a GitHub token outside the production environment and require AWS to return `AccessDenied`.
  An unrelated error or unexpected successful assumption fails the check.
  Returned credentials and raw tokens never appear in the log.
- Run the authorized identity check only after manual dispatch from `master`.
  The GitHub environment separately permits only the `master` branch.
  The role trusts `repo:influxdata/docs-v2:environment:production` with audience `sts.amazonaws.com`.
  The repository's OIDC settings confirm the default, non-immutable subject format.
- Use the dedicated `github-docs-deploy` role in account `056065491910`.
  Keep the staging role separate.
  Use the production environment's `AWS_DEPLOY_ROLE_ARN` and `REGION` variables.
- Keep the probe independent of checkout, dependency installation, build scripts, and site uploads.
  The first slice can verify authentication without changing live deployment.
  The pinned AWS credentials action is the only third-party action in the probe.

## Explicitly out of scope

- Moving the production build and uploader, or splitting PR Preview.
- Disabling CircleCI, deleting permanent AWS keys, or changing the CloudFormation stack.
- Moving public-repository jobs onto the organization's self-hosted runner pool.

Reconsider CircleCI if GitHub performance and uptime become unsatisfactory
and CircleCI fully supports the required GitHub workflow syntax outside Preview.
Revalidate credential isolation before switching.

## Verification

Run `actionlint .github/workflows/verify-production-access.yml`.
The [initial branch run](https://github.com/influxdata/docs-v2/actions/runs/41684498445)
passed the build-isolation and denial checks on 2026-11-03.
The logs confirm absent build credentials and AWS `AccessDenied` outside production.
The authorized role identity check remains pending.
After review and merge, manually run `Verify production deployment access` on `master`.
The authorized check must report an assumed-role ARN for `github-docs-deploy` in account `056065491910`.
No check uploads, deletes, or invalidates production content.
