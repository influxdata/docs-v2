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
   its environment. Run `maintenance.sh`; classify any failure before claiming readiness.
3. Reuse a ready preview on port 1315, or start `preview.sh` and record its owned PID.
   Wait for the first build and HTTP 200 on the affected route before running tests.
4. Run focused Cypress specs serially. Inspect mobile, tablet, and desktop images
   and exercise affected interactions. Use `browser-smoke.mjs` for resource failures
   with TLS and web security enabled.
5. Record checks and artifacts. Stop only a server you started, after its build
   finishes. Report live integration and fresh-session restoration separately.

Source edits use the running preview. Publish only when saving a new environment
baseline or activating configuration changes. A denied destination requires the
configuration workflow; a rejected CA import requires explicit authorization.
