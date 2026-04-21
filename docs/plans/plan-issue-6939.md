## Issue #6939 plan

### Summary

- PR #6939 overhauls the API docs pipeline: a unified TypeScript post-processor (`api-docs/scripts/post-process-specs.ts`) writes resolved specs to `_build/`, Redoc and static copies read from `_build/`, and workflows add a TypeScript compile step.
- We need to review and harden the new script and workflows, focusing on correctness when overlays/tags are absent and ensuring CI/previews run the build steps in the right order.

### Files to touch

- `api-docs/scripts/post-process-specs.ts` — adjust write/log behavior when no overlays/tags are applied and ensure output handling is correct (lines \~350-395).
- `api-docs/scripts/test-post-process-specs.ts` — align tests with expected write/log behavior and add coverage if needed (lines \~552-575).
- `.circleci/config.yml` — confirm/adjust API docs build step ordering and TypeScript compile inclusion (lines \~24-35).
- `.github/workflows/pr-preview.yml` — ensure PR preview runs TypeScript compile + API docs generation when API docs change (lines \~118-150).
- (If needed) `api-docs/generate-api-docs.sh` — keep pipeline steps in sync (lines \~52-68).

### Approach

1. Run the PR’s test plan locally to surface current failures: `npx tsc --project api-docs/scripts/tsconfig.json`, `node api-docs/scripts/dist/post-process-specs.js`, `node api-docs/scripts/dist/generate-openapi-articles.js --static-only`, and `npx hugo --quiet` (accepting the runtime). Note existing untracked artifacts (`content/enterprise_influxdb/v1/api/v1/`, `static/openapi/`) to avoid clobbering.
2. Review `post-process-specs.ts` logic around overlays/tags and output writes; ensure it skips unnecessary writes/logs while still producing required `_build` outputs for downstream steps.
3. Update tests in `test-post-process-specs.ts` to reflect the intended behavior (particularly the “no overlays” case) and add assertions for `_build` outputs if needed.
4. Validate CI wiring: confirm `.circleci/config.yml` and `pr-preview.yml` run TypeScript compile before API docs generation and don’t skip API steps incorrectly.
5. Re-run the pipeline commands after changes; ensure Hugo/build/test outputs are clean, then prepare for branch/commit per guidelines.

### Risks / Open questions

- Hugo build is long (\~75s) and must not be canceled.
- If any product lacks overlays/tags, skipping writes could leave `_build` empty; need to balance no-op behavior with required outputs.
- Existing untracked API outputs may obscure diffs; keep them untouched.
