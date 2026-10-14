---
name: openai-cloud-ui
description: Use when preparing or resuming docs-v2 in an OpenAI cloud environment, diagnosing missing browser tools, or testing UI changes against its local preview.
---

# Cloud UI testing

Read [the environment README](../../../tools/cloud-environment/openai/README.md) for installation, browser trust, network configuration,
and fresh-session qualification. Use the repository's docs-testing skill to choose
checks for the actual source change.

1. Read repository instructions and preserve the current checkout's changes.
2. Source `tools/cloud-environment/openai/setup.sh` in each command shell that uses
   its environment. Run `maintenance.sh` under agent permissions to check the
   prepared environment's local rendering and HTTPS trust.
   Sourcing setup and running maintenance install nothing.
   If readiness fails, report the failed check and use the environment's
   documented recovery procedure. Classify the failure before claiming readiness.
   Provisioning commands belong to environment setup, not routine verification.
3. Reuse a ready preview on port 1315, or start `preview.sh` and record its owned PID.
   Wait for the first build and HTTP 200 on the affected route before running tests.
   For API reference work, generate API content first and verify the target route
   and its assets, as described in the README.
4. Run focused Cypress specs serially. Inspect mobile, tablet, and desktop images
   and exercise affected interactions. Use `browser-smoke.mjs` for resource failures
   with TLS and web security enabled.
5. Record checks and artifacts. Stop only a server you started, after its build
   finishes. Record submission acknowledgment, completed answers, retained
   conversation history, and fresh-session restoration separately. Observe vendor
   behavior without replacing vendor methods; compare conversation content across resize.
6. For denied destinations, collect the required hosts and bootstrap dependencies
   in one run. Finish independent checks and record the blocked criterion, host,
   enforced policy revision, and next-session command. Review allowlist changes
   together through environment settings.

Source edits use the running preview. Publish only when saving a new environment
baseline or activating configuration changes. A denied destination requires the
configuration workflow and a new session after publishing. If automatic approval
review rejected a CA import in the current session, obtain explicit authorization
before retrying it there.
