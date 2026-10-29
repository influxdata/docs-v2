# OpenAI cloud environment for docs-v2

These scripts prepare a checkout for local UI testing.
The environment install script can call `bash tools/cloud-environment/openai/setup.sh` from the checkout.
The scripts resolve their checkout from their own location.

For the agent workflow, see [openai-cloud-ui](../../../.agents/skills/openai-cloud-ui/SKILL.md).

## Installation and startup

Provide Node 22 or later, Corepack, Chromium, Xvfb, xauth, and the Linux libraries required by Cypress in the base environment.
Use `PUPPETEER_EXECUTABLE_PATH` to select Chromium.
The default is `/usr/bin/chromium`.

When you execute `setup.sh`, it performs these steps:

1. Checks for Xvfb and enables the pinned Yarn through Corepack.
2. Installs locked dependencies.
3. Installs and verifies the package's Cypress binary.
4. Runs readiness checks.

If installation fails, setup stops without reporting partial success.

At the start of each session, configure the shell and check readiness:

```bash
source tools/cloud-environment/openai/setup.sh
bash tools/cloud-environment/openai/maintenance.sh
```

Sourcing `setup.sh` only exports paths and cache settings.
`maintenance.sh` installs nothing.
It verifies the Cypress binary, local browser rendering, and an allowed HTTPS resource under the current command's permissions.
The default HTTPS resource is the Google reCAPTCHA bootstrap script.
To use another allowed HTTPS resource, set `DOCS_BROWSER_HTTPS_URL`.
Caches default to `/workspace/.cache`.
Artifacts default to `/workspace/environment-artifacts/docs-v2`.
`XDG_CONFIG_HOME` defaults to `$DOCS_CACHE_ROOT/config`, so Cypress can write its configuration without access to the home directory.
An explicit `XDG_CONFIG_HOME` remains unchanged and must be writable.
For another writable environment, override `DOCS_CACHE_ROOT` and `DOCS_ENVIRONMENT_ARTIFACTS`.

### Edit Environment session

Apply the system dependencies in the base environment, with administrator privileges.
On Debian or Ubuntu:

```bash
apt-get update
apt-get install -y xvfb xauth
```

Use the repository version containing these startup changes, then run:

```bash
bash tools/cloud-environment/openai/setup.sh
source tools/cloud-environment/openai/setup.sh
bash tools/cloud-environment/openai/maintenance.sh
```

Preserve the configured proxy and CA settings.
If maintenance reports that the existing NSS database is read-only, grant browser commands scoped write access to that database as described below.
Shell exports cannot grant sandbox permissions.
Do not change `HOME`, disable TLS verification, or add the session's temporary Xvfb extraction directory to the saved startup configuration.

After readiness and the browser checks pass, publish the prepared environment and verify restoration in a new session.
Repository commits do not update a published environment automatically.

## Browser trust and network access

Keep the inherited proxy and certificate authority (CA) environment variables.
The browser smoke check uses the sidecar proxy.
Local preview traffic goes directly to loopback.
Transport Layer Security (TLS) checking and browser web security remain enabled.

If Chromium doesn't trust the proxy CA, install `certutil` and `openssl` in the base environment.
During installation, set `DOCS_PROXY_CA_FILE` to the platform-provided PEM certificate.
During installation, also set `DOCS_CONFIGURE_BROWSER_TRUST=1`.
The explicit `browser-trust.sh` step imports that CA into the current user's Network Security Services (NSS) database.
Override `DOCS_BROWSER_NSS_DB` only if the selected Chromium uses another database.

Before you change trust, close existing browser processes.
Afterward, verify an allowed HTTPS origin.
A successful import alone doesn't establish browser trust.
Run `maintenance.sh` under the same permissions you use for browser tests.
Chromium needs write access to its NSS database during browser execution.
In the tested environment, that database is `/home/agent/.pki/nssdb`.
If maintenance reports a read-only database, request a scoped filesystem write grant for that directory.
Importing the CA during setup doesn't grant write access to later agent commands.

If automatic approval review rejects a CA import, report the action and the stated reason.
Obtain explicit authorization before retrying the import in that session.

Configure network destinations in environment settings instead of a shell script.
For the current docs UI, allow the Google font origins, the Kapa origins, and the reCAPTCHA origins needed by the loaded widget.
In addition to the package-manager preset, add the custom hosts in [JSON reference](allowlist-reference.json), which records the custom hosts for manual configuration review.
Setup and startup scripts can't apply either file.

Collect failed destinations from a representative browser run.
Inspect bootstrap scripts for dependencies, such as reCAPTCHA's JavaScript on `www.gstatic.com`.
Separate required script and API hosts from optional telemetry hosts.
Review the additions together.
Allowlisting doesn't resolve certificate errors or prove a widget works.
After you publish an allowlist update, start a new session and verify its enforced policy.

## UI iteration

If you test API reference pages, generate their content before you start the preview:

```bash
yarn build:api-docs
```

Verify that the affected API route and its CSS and JavaScript are present.
A successful Hugo build alone doesn't establish that generated API pages exist.

To start the preview, run:

```bash
bash tools/cloud-environment/openai/preview.sh
```

Keep the preview running between edits.
Allow at least 180 seconds for its first build.
Wait for HTTP 200 on the affected route.
Never cancel an active build.

The runner's default readiness timeout is 30 seconds, so verify that the server is ready first.
Run focused Cypress specs against the ready server on port 1315.
Runner invocations share temporary files, so run them one at a time.

To check browser rendering and external requests with normal browser security:

```bash
node tools/cloud-environment/openai/browser-smoke.mjs http://127.0.0.1:1315/influxdb3/core/
```

For visual inspection, use existing screenshot commands with an explicit viewport, Chrome path, base URL, and output location.
The current generic Puppeteer helper disables web security, so its screenshots alone don't verify integration behavior.

For live widget checks, observe callbacks and requests without replacing vendor methods.
Across viewport changes, compare conversation content instead of all visible dialog text.
Narrow layouts can hide controls, such as **Use MCP**, without losing the conversation.
Record submission acknowledgment, answer completion, and retained conversation history as separate results.
An acknowledged question doesn't establish a completed answer.
Use headed Chromium for live answer verification in the cloud environment:

```bash
bash tools/cloud-environment/openai/kapa-live.sh
```

The runner checks readiness and uses `xvfb-run -a` to create and clean up its own display.
It does not depend on a display left running by a previous command.
To run only the mobile close spec:

```bash
bash tools/cloud-environment/openai/kapa-live.sh --spec cypress/live/kapa-mobile-close-live.cy.js
```

The general `yarn test:e2e:kapa-live` command also discovers live specs correctly outside the cloud environment.
Only the cloud wrapper selects headed Chromium and a virtual display.
Headless requests returned `Captcha token is invalid` during diagnosis; headed Chromium and the headed Cypress mobile suite completed answers.
Headed mode does not guarantee CAPTCHA acceptance in every session.

The strict page smoke check reports every failed resource, including optional telemetry.
The current network policy blocks `analytics.google.com` and `stats.g.doubleclick.net`.
These failures are separate from widget and CAPTCHA resource loading; do not treat a page smoke failure alone as an answer failure.
If a required host is denied, finish independent checks and record the blocked criterion, host, policy revision, and rerun command.

## Snapshot qualification

After you verify setup, publish the environment configuration and the prepared filesystem together.
You can then use the running preview for UI source edits without republishing.
Configuration changes, such as allowlist updates, still need the platform's review and publish workflow.

To verify restoration, follow these steps:

1. Start a fresh session from the published environment.
2. Verify that the checkout contains this directory.
3. Source `setup.sh`.
4. Run `maintenance.sh`.
5. Build the preview.
6. Check an affected route.
7. Run a focused Cypress spec.
8. Run a browser smoke check.
9. Record outcomes and screenshots outside tracked files.

Only that fresh session proves restoration.
Current-session checks can't establish it.

## Checks for changes to these tools

```bash
for script in tools/cloud-environment/openai/*.sh; do bash -n "$script" || exit; done
node --test tools/cloud-environment/openai/setup.test.mjs
```

The tests configure temporary shells and simulate readiness failures.
They don't install Cypress or change browser trust.
