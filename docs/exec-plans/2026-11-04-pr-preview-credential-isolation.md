# Isolate PR Preview deployment credentials

**Status:** In review, [PR #8000](https://github.com/influxdata/docs-v2/pull/8000); GitHub verification pending.

## Goal

Keep dependency installation and Hugo execution away from AWS credentials and OIDC request access.
Retain full-site PR previews, incremental S3 uploads, production cache headers, CloudFront invalidation, and sticky comments.
This completes the PR Preview split in section 1.6 of the CI consolidation plan.

## Decisions

- Run the build with read-only GitHub permissions and explicit `id-token: none` on a fresh hosted runner.
  Check that AWS credentials and OIDC request variables are absent before checkout or dependency installation.
  Disable persisted checkout credentials.
- Give only the deployment and close-cleanup jobs OIDC permission.
  These jobs don't check out the repository, install dependencies, import repository modules, or run build output.
  Install s3deploy from a fixed release and verify its committed checksum before extraction.
  The [GitHub OIDC reference](https://docs.github.com/en/actions/reference/security/oidc) documents the job-level permission boundary.
- Transfer `public/` and the declarative `.s3deploy.yml` together as artifact data.
  Include hidden files for `.well-known` routes and the header configuration.
  Download the exact artifact ID returned by this build, within the same workflow run.
  [The download action](https://github.com/actions/download-artifact) extracts a single ID directly to the requested directory.
- Post success comments on a separate runner after deployment succeeds.
  Load the helper from the PR base revision with OIDC disabled.
  Pass build metadata through environment variables rather than JavaScript interpolation.
  Close cleanup uses inline code to delete only the matching GitHub Actions bot comment.
- Record elapsed upload, job scheduling, and download time in the deploy job summary.
  Validate the build-supplied timestamp before shell arithmetic.
  The measurement includes scheduling, so it isn't pure network transfer time.

## Branch cleanup

Preserve [`claude/great-ramanujan-t7p7t2`](https://github.com/influxdata/docs-v2/tree/claude/great-ramanujan-t7p7t2), the consolidated CI optimization plan and remaining converter hardening.
Its verified tip at cleanup is `7caf492d7bb725675964ab3dfdf8cbdee455e6c2`.
Don't merge its superseded CircleCI OIDC proposal into the completed GitHub migration.

Deleted these obsolete remote branches on 2026-11-04 after refreshing their tips:

| Branch                                     | Deleted tip                                | Preserved work                                                                              |
| ------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `claude/hugo-dependency-management-h7v86e` | `9fd9008e593160fae40f19d3b64c444daf96bb5d` | Code in `016f63fb1` and `f931d316b` on the preserved branch; plan consolidated in `PLAN.md` |
| `ccr-ed7ae69a-bs2fua`                      | `fcec40fbc1765de1384873fc3754ce27a5227c1a` | Link-check plan consolidated as L0–L5 in the preserved branch                               |

Deletion used expected-tip leases to reject concurrent changes.
GitHub branch searches confirm both deletions and the preserved plan branch.
The completed `ci/github-*` migration branches were already absent.
The merged `feat/sample-data-constants` and `chore/prose-lint` branches were also absent.
Preserve the still-open `chore/remove-vale` and `test/playwright-render-regression` branches.

## Scope

Production deployment, AWS trust policies, and the scheduled stale-preview sweep stay with their existing workflows.
Fork and draft previews remain unavailable.
Remaining install caching, converter provenance, and shared-build work stays in the preserved CI plan.

## Verification

Run `node --test .github/scripts/test-preview-isolation.js` and `actionlint .github/workflows/pr-preview.yml`.
The checks exercise credential rejection, tampered uploader rejection, deploy arguments, unsafe timestamp rejection, and bot-only comment cleanup.
The policy checks also reject dependency execution and repository checkout on AWS runners.
After publishing, verify a same-repository PR deploys, records transfer timing, and updates its sticky comment.
Close the PR and verify its preview prefix and bot comment disappear.
Live artifact transfer, OIDC authentication, and S3 cleanup remain unverified locally.
