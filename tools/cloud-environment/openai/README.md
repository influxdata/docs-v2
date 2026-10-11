# OpenAI cloud environment for docs-v2

These scripts prepare a checkout for local UI testing. The environment install
script can call `bash tools/cloud-environment/openai/setup.sh` from the checkout.
The scripts resolve their checkout from their own location.

Agent workflow: [openai-cloud-ui](../../../.agents/skills/openai-cloud-ui/SKILL.md).

## Installation and startup

Provide Node 22 or later, Corepack, Chromium, and the Linux libraries required by
Cypress in the base environment. Chromium is selected with
`PUPPETEER_EXECUTABLE_PATH`; the default is `/usr/bin/chromium`.

Executing `setup.sh` enables the pinned Yarn through Corepack, installs locked
dependencies, installs and verifies the package's Cypress binary, and runs
readiness checks. Install failures stop setup rather than reporting partial success.

At the start of each session, configure the shell and check readiness:

```bash
source tools/cloud-environment/openai/setup.sh
bash tools/cloud-environment/openai/maintenance.sh
```

Sourcing setup only exports paths and cache settings. Maintenance installs nothing.
Caches default to `/workspace/.cache` and artifacts to
`/workspace/environment-artifacts/docs-v2`. Override `DOCS_CACHE_ROOT` and
`DOCS_ENVIRONMENT_ARTIFACTS` for another writable environment.

## Browser trust and network access

Keep the inherited proxy and CA environment variables. Browser smoke uses the
sidecar proxy while local preview traffic goes directly to loopback. TLS checking
and browser web security remain enabled.

If Chromium does not trust the proxy CA, install `certutil` and `openssl` in the
base environment. Set `DOCS_PROXY_CA_FILE` to the platform-provided PEM certificate
and `DOCS_CONFIGURE_BROWSER_TRUST=1` during installation. The explicit
`browser-trust.sh` step imports that CA into the current user's NSS database.
Override `DOCS_BROWSER_NSS_DB` only if the selected Chromium uses another database.
Close existing browser processes before changing trust. Verify an allowed HTTPS
origin afterward; a successful import alone does not establish browser trust.

A previous session's NSS import was rejected by automatic approval review.
Including this script does not authorize retrying that rejected operation.
Obtain explicit authorization before executing it in that session.

Network destinations belong in environment settings, not a shell script. For
the current docs UI, allow the Google font origins, the Kapa origins, and the
reCAPTCHA origins needed by the loaded widget. In addition to the package-manager
preset, preparation identified these custom hosts:

```text
api.github.com
api.kapa.ai
cdn.cypress.io
docs.influxdata.com
download.cypress.io
fonts.googleapis.com
fonts.gstatic.com
influxdata-research-ext.mcp.kapa.ai
kapa-widget-proxy-la7dkmplpq-uc.a.run.app
metrics.kapa.ai
proxy.kapa.ai
recaptcha.google.com
widget.kapa.ai
www.google.com
www.googletagmanager.com
www.gstatic.com
```

Collect failed destinations from a representative browser run and review additions
together. Allowlisting does not resolve certificate errors or prove a widget works.

## UI iteration

```bash
bash tools/cloud-environment/openai/preview.sh
```

Keep the preview running between edits. Allow at least 180 seconds for its first
build and wait for HTTP 200 on the affected route. Never cancel an active build.
Run focused Cypress specs against the ready server on port 1315. The runner's
default readiness timeout is 30 seconds, so qualify the server first. Serialize
runner invocations because they share temporary files.

To check browser rendering and external requests with normal browser security:

```bash
node tools/cloud-environment/openai/browser-smoke.mjs http://127.0.0.1:1315/influxdb3/core/
```

Use existing screenshot commands for visual inspection, with explicit viewport,
Chrome path, base URL, and output location. The current generic Puppeteer helper
disables web security, so its screenshots alone do not qualify integration behavior.

## Snapshot qualification

Publish environment configuration and the prepared filesystem together once setup
is verified. UI source edits can then use the running preview without republishing.
Configuration changes such as allowlist updates still need the platform's review
and publish workflow.

Start a fresh session from the published environment. Verify the checkout contains
this directory, source setup, run maintenance, build the preview, check an affected
route, and run a focused Cypress spec plus a browser smoke check. Record outcomes
and screenshots outside tracked files. Only that fresh session proves restoration.
Current-session checks cannot establish it.

## Checks for changes to these tools

```bash
for script in tools/cloud-environment/openai/*.sh; do bash -n "$script" || exit; done
node --test tools/cloud-environment/openai/setup.test.mjs
```

The tests configure temporary shells only. They do not install Cypress or change
browser trust.
