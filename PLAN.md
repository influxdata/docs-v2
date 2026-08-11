# Telegraf v1 documentation revamp plan

**Base branch:** `docs/telegraf-revamp`
**Status:** Approved 2026-08-11
**Scope:** `content/telegraf/v1/`

This plan defines the new structure for the Telegraf v1 documentation and parcels the work into PRs.
Child PRs branch from and merge into `docs/telegraf-revamp`.
Remove this file before merging `docs/telegraf-revamp` into `master`.

## Goals

- Revamp and restructure the Telegraf documentation to provide a thorough understanding of Telegraf and its capabilities.
- Make getting started easy while providing a path into deep functionality.
- Provide useful, applicable examples of Telegraf configurations.
- Let plugin documentation carry the weight for each plugin; centralize general configuration concepts.
- Document the data flow from inputs to processors to aggregators to outputs.
- Provide examples of using input formats (parsers) and output formats (serializers).
- Inform Telegraf users that Telegraf Controller is available for managing agents at scale, without duplicating its documentation set.

## Constraints

- The paths and structure of the Telegraf plugin docs are auto-generated in the Telegraf release process and must stay the same:
  `input-plugins/`, `output-plugins/`, `processor-plugins/`, `aggregator-plugins/`, `secretstore-plugins/`, and their `_index.md` files.
- Heavily linked URLs must keep resolving (see [URL and alias strategy](#url-and-alias-strategy)).

## Design principles

1. **Two reading paths.**
   The main nav (`telegraf_v1`) tells the learning story: Install → Get started → How it works → Configure → Use plugins → Examples → Administer.
   The reference nav (`telegraf_v1_ref`) stays terse and complete: Plugin directory, Commands, Data formats.
2. **Decompose the configuration monolith in place.**
   Convert `configuration.md` to `configuration/_index.md` (URL and anchors preserved) and grow child topic pages under it.
3. **Plugin pages carry plugin detail; central pages carry concepts.**
   Central pages never document a specific plugin's options; they document what all plugins share.
4. **Every move gets a Hugo alias.**
   Frozen plugin paths don't move at all.
5. **Level-based page weights** per `DOCS-FRONTMATTER.md` and newer doc sets (Telegraf Controller, InfluxDB 3 Explorer):
   top level 1–99 (sequential from 1), second level 101–199, third level 201–299.
   `_index.md` files are weighted one level up from other `.md` files in the same directory.
   Set `weight` at the page level (top-level frontmatter), not on the menu entry; menu items inherit the page weight.
6. **Settings references use per-setting headings with Type and Default metadata.**
   Group settings under H2s by purpose; each setting is an H3 (stable anchor) with a short description followed by `**Type:**` and `**Default:**` metadata lines, matching the Telegraf Controller config-options precedent.
   The Type line ends with a markdown hard break (trailing double space) so Type and Default render as adjacent lines, not separate paragraphs.
   Type vocabulary: string, boolean, integer, duration, size, table, array of strings.
   Defaults use TOML-literal form (`"10s"`, `true`) or "Not set;" plus the unset behavior; inherited options link the agent setting's anchor.
   Give each repeated option name one canonical heading per page so anchors stay stable.
   Verify types and defaults against the Telegraf source, not memory.
7. **Periods over semicolons and colons in prose.**
   Use semicolons and colons sparingly.
   A clause joined by a semicolon or colon should usually be its own sentence.
   Colons that introduce lists, code blocks, or definition-list terms are fine.
   The Documentation MCP server sinks to 206 following the Explorer precedent; Release notes leads the reference nav at weight 1.

## Content sources

Upstream material in the Telegraf repo (`docs/` unless noted) maps to new or revised pages as listed per page below.
Plugin-level source of truth is `plugins/*/README.md` in the Telegraf repo and is out of scope here.

## New structure

### Main nav (`telegraf_v1`)

```
1   Telegraf (_index.md)
2   Install (install.md)
3   Get started (get-started.md)
4   How Telegraf works (concepts/_index.md)
      101 Telegraf metrics (concepts/metrics.md)
      102 Data pipeline (concepts/data-pipeline.md)
5   Configure Telegraf (configuration/_index.md)
      101 Configuration file (configuration/file.md)
      102 TOML syntax (configuration/toml.md)
      103 Agent settings (configuration/agent.md)
      104 Common plugin options (configuration/plugin-options.md)
      105 Filter metrics (configuration/filtering.md)
      106 Environment variables (configuration/environment-variables.md)
      107 Secrets (configuration/secrets.md)
      108 TLS (configuration/tls.md)
      109 Labels and selectors (configuration/labels-selectors.md)
6   Use plugins (configure_plugins/_index.md)
      101 Input plugins (configure_plugins/input_plugins/_index.md)
            201 Parse incoming data (configure_plugins/input_plugins/parse-data.md)
            202 Use HTTP listeners (configure_plugins/input_plugins/using_http.md)
      102 Output plugins (configure_plugins/output_plugins/_index.md)
            201 Serialize outgoing data (configure_plugins/output_plugins/serialize-data.md)
      103 Processors and aggregators (configure_plugins/aggregator_processor/_index.md)
      104 External plugins (configure_plugins/external_plugins/_index.md)
            201 Use the execd shim (configure_plugins/external_plugins/shim.md)
            202 Write an external plugin (configure_plugins/external_plugins/write_external_plugin.md)
7   Configuration examples (examples/_index.md)
      101+ One page per scenario
8   Administer Telegraf (administer/_index.md)
      101 Run Telegraf as a service (administer/run-as-service.md)
      102 Monitor Telegraf (administer/monitor.md)
      103 Configure agent statuses (administer/agent-status.md, shared)
      104 Manage agents at scale (administer/manage-at-scale.md)
      105 Troubleshoot Telegraf (administer/troubleshoot.md)
10  Telegraf Enterprise (enterprise.md)
```

### Reference nav (`telegraf_v1_ref`)

```
1   Release notes (release-notes.md)
2   Plugin directory (plugins.md) — frozen structure below it
      input-plugins/, output-plugins/, processor-plugins/,
      aggregator-plugins/, secretstore-plugins/ (auto-generated; do not touch)
3   Telegraf commands (commands/_index.md)
      101+ config, plugins, secrets, service, version subcommand pages
4   Data formats (data_formats/_index.md)
      101 Input data formats (data_formats/input/_index.md) + per-format pages (201+)
      102 Output data formats (data_formats/output/_index.md) + per-format pages (201+)
      103 Template patterns (data_formats/template-patterns.md, moved with alias)
5   Agent status evaluation (agent-status-eval/_index.md, shared)
      101 CEL variables (agent-status-eval/variables.md, shared)
      102 CEL functions and operators (agent-status-eval/functions.md, shared)
      103 CEL expression examples (agent-status-eval/examples.md, shared)
6   Supported platforms (supported-platforms.md)
7   Glossary (glossary.md)
8   Contribute to Telegraf (contribute.md)
206 Documentation MCP server (mcp-server.md)
```

Weights inside the frozen plugin directories are generated; leave them untouched.

## Page descriptions

### Top level

- **Telegraf** (`_index.md`, revise): what Telegraf is (plugin-driven collection agent), the pipeline diagram (inputs → processors → aggregators → outputs), capability tour (300+ plugins, parsers and serializers, buffering, secret stores), a pointer to Telegraf Controller for managing agents at scale, and clear next-step links.
- **Install** (`install.md`, refresh in place): keep the comprehensive single page.
  Add the supported-platforms matrix reference and nightly builds, and refresh the existing custom-compile section (upstream `CUSTOMIZATION.md`, `NIGHTLIES.md`, `INSTALL_GUIDE.md`).
  Windows service installation stays here; running and managing the service moves to Administer.
- **Get started** (`get-started.md`, rewrite): assumes Telegraf is installed.
  Generate a config, enable cpu/mem input and file output, run, read the output, then swap in an InfluxDB output.
  Ends with "where to go deeper," including Telegraf Controller for multi-agent fleets.
  Draws on upstream `QUICK_START.md`.
- **Telegraf Enterprise** (`enterprise.md`, light refresh in PR 11): stays the licensing and support home; already introduces Telegraf Controller.
  Cross-link the new manage-at-scale page and fix dash punctuation to house style.

### How Telegraf works (`concepts/`, new section)

- **Section index** (`concepts/_index.md`): the architecture in one page: plugin types, service versus polling inputs, where parsers and serializers sit, external plugins at a glance.
  Fixes the currently orphaned "Concepts" menu parent referenced by `metrics.md`.
- **Telegraf metrics** (`concepts/metrics.md`, moved from `/telegraf/v1/metrics/` with alias): metric model (measurement, tags, fields, timestamp), tags versus fields guidance, tracking metrics and delivery acknowledgment.
  Source: upstream `METRICS.md`.
- **Data pipeline** (`concepts/data-pipeline.md`, new): the full flow with diagram; processor and aggregator ordering and the `skip_processors_before_aggregators` / `skip_processors_after_aggregators` settings; where filtering applies at each stage; the metric buffer, flush cycle, and `buffer_strategy` (memory versus disk).
  Sources: upstream `AGGREGATORS_AND_PROCESSORS.md`, `CONFIGURATION.md` (order of operations), `specs/tsd-005-output-buffer-strategy.md`.

### Configure Telegraf (`configuration/`, converted from `configuration.md`)

- **Section index** (`configuration/_index.md`): initially the current full reference content so inbound anchors (for example `#filters`) keep resolving.
  Each section gains a link to its child page.
  In the final cleanup PR, slims to an overview plus quick-reference tables with stable anchor targets.
- **Configuration file** (`configuration/file.md`, new): config file anatomy (global tags, agent, plugins), generating a config (`telegraf config`), file locations, `--config-directory`, multiple-file merging, loading config from a URL.
  Sources: upstream `CONFIGURATION.md`, `specs/tsd-007-url-config-behavior.md`.
- **TOML syntax** (`configuration/toml.md`, new): TOML for Telegraf: single table versus array of tables, inline-table ordering gotchas, validation.
  Source: upstream `TOML.md`.
- **Agent settings** (`configuration/agent.md`, new): every `[agent]` setting explained in groups: scheduling (interval, jitter, offset), batching and buffering, flushing, precision, logging and rotation, hostname, statefile.
  Sources: upstream `CONFIGURATION.md`, `specs/tsd-003-state-persistence.md`.
- **Common plugin options** (`configuration/plugin-options.md`, new): options shared by all plugins: `alias`, per-plugin `interval`, `name_override`, `name_prefix`, `name_suffix`, extra tags, multiple instances of one plugin, `startup_error_behavior`.
  Sources: upstream `CONFIGURATION.md`, `docs/includes/`, `specs/tsd-006-startup-error-behavior.md`.
- **Filter metrics** (`configuration/filtering.md`, new): selectors (`namepass`/`namedrop`, `tagpass`/`tagdrop`, `metricpass` with CEL) and modifiers (`fieldinclude`/`fieldexclude`, `taginclude`/`tagexclude`), order of operations per stage, full worked filtering examples.
  Source: upstream `CONFIGURATION.md` (Metric Filtering, Filtering Examples).
- **Environment variables** (`configuration/environment-variables.md`, new): environment-variable substitution and shell-parameter-expansion forms.
- **Secrets** (`configuration/secrets.md`, new): using secret stores (`@{store:key}`), which plugins support them, the `telegraf secrets` CLI, links to secret-store plugin pages.
- **TLS** (`configuration/tls.md`, new): client TLS, server and mutual TLS, cipher suites, and version constraints.
  Source: upstream `TLS.md`.
- **Labels and selectors** (`configuration/labels-selectors.md`, new): plugin labels and `--select` CLI selection.
  Sources: upstream `CONFIGURATION.md`, `specs/tsd-010-labels-and-selectors.md`.

### Use plugins (`configure_plugins/`, URLs kept, menu label changed)

- **Section index** (`configure_plugins/_index.md`, revise): orientation across the four plugin types with links to concepts and the plugin directory.
- **Input plugins** (`input_plugins/_index.md`, rewrite the 19-line stub): collecting data: polling versus service inputs, `--test` and `--once` behavior with service inputs, choosing a plugin, pointing to the directory.
- **Parse incoming data** (`input_plugins/parse-data.md`, new): choosing and configuring a parser via `data_format`; the three JSON strategies (json, json\_v2, xpath\_json); timestamps and timezones; worked CSV and JSON examples.
  Source: upstream `PARSING_DATA.md`.
- **Use HTTP listeners** (`input_plugins/using_http.md`, keep; tidy the menu parent).
- **Output plugins** (`output_plugins/_index.md`, expand): writing data: batching and flush behavior, what happens on output failure (buffer, retry, partial writes, startup error behavior).
  Sources: upstream `CONFIGURATION.md`, `specs/tsd-008-partial-write-error-handling.md`.
- **Serialize outgoing data** (`output_plugins/serialize-data.md`, new): choosing a serializer via `data_format`, worked examples (line protocol, JSON, Prometheus).
  Source: upstream `DATA_FORMATS_OUTPUT.md`.
- **Processors and aggregators** (`aggregator_processor/_index.md`, refresh): task-focused: when to reach for which, common processor and aggregator recipes.
  Deep ordering material moves to `concepts/data-pipeline.md`.
- **External plugins** (`external_plugins/`, keep all three pages; refresh against upstream `EXTERNAL_PLUGINS.md`).

### Configuration examples (`examples/`, new section)

One page per scenario; each page includes the full TOML, a walkthrough, and sample output.
Initial set:

- System monitoring to InfluxDB (cpu, mem, disk → influxdb\_v2/v3)
- Scrape Prometheus endpoints
- Kafka consumer with JSON parsing
- Parse CSV files from a directory
- Downsample with aggregators before writing
- Route different metrics to different outputs with filtering

### Administer Telegraf (`administer/`, new section)

- **Run Telegraf as a service** (`administer/run-as-service.md`, new): systemd and Windows service operation.
  Sources: upstream `WINDOWS_SERVICE.md` plus service material currently in `install.md`.
- **Monitor Telegraf** (`administer/monitor.md`, new): monitoring Telegraf itself with the `internal` input; log interpretation.
  Also covers monitoring with Telegraf Controller: agents running the [heartbeat output plugin](/telegraf/v1/output-plugins/heartbeat/) report metrics, error counts, plugin statistics, and a self-evaluated status back to Controller.
  Source: upstream `specs/tsd-011-internal-plugin-statistics.md`.
- **Configure agent statuses** (`administer/agent-status.md`, new, shared): how the heartbeat output plugin evaluates CEL expressions to produce a self-reported agent status; status values; configuration.
  Consumes `/shared/telegraf/agent-status.md`; the Telegraf Controller page is canonical (see [Shared content with Telegraf Controller](#shared-content-with-telegraf-controller)).
- **Manage agents at scale** (`administer/manage-at-scale.md`, new): a short signpost page, not a duplicate of the Controller docs.
  What Telegraf Controller provides (centralized configuration management, agent status and monitoring, labels), that it is part of Telegraf Enterprise, and a handoff to the [Telegraf Controller documentation](/telegraf/controller/).
  Three or four paragraphs plus links; `enterprise.md` and this page cross-link each other via `related` frontmatter.
- **Troubleshoot Telegraf** (`administer/troubleshoot.md`, moved from `configure_plugins/troubleshoot.md` with alias): `--test`/`--once`/debug workflow, file-output debugging, pprof profiling, AppArmor denials, common errors salvaged from upstream `FAQ.md`.
  Sources: upstream `PROFILING.md`, `APPARMOR.md`, `FAQ.md`.
  No separate FAQ page; useful FAQ answers fold in here.

### Reference

- **Plugin directory** (`plugins.md` and the five plugin directories): frozen; untouched.
- **Telegraf commands** (`commands/`, expand): complete global-flags reference, `telegraf service` commands, and fill the thin subcommand pages.
  Source: upstream `COMMANDS_AND_FLAGS.md`.
- **Data formats** (`data_formats/`, keep structure and URLs):
  add missing input formats (`openmetrics.md`, `parquet.md`, `prometheus.md`);
  refresh all format pages against upstream parser and serializer READMEs;
  index pages link to the parse and serialize guides;
  fix the missing-table note referencing Issue #2360;
  move `template-patterns` under Data formats (alias from `configure_plugins/template-patterns/`).
- **Agent status evaluation** (`agent-status-eval/`, new, shared): CEL reference for heartbeat status expressions: variables, functions and operators, and examples.
  Four pages consuming `/shared/telegraf/agent-status-eval/*`; the Telegraf Controller pages are canonical.
- **Supported platforms** (`supported-platforms.md`, new): OS support matrix.
  Source: upstream `SUPPORTED_PLATFORMS.md`.
- **Glossary** (`glossary.md`, expand): add parser, serializer, secret store, selector, label, tracking metric, service input.
- **Release notes** (`release-notes.md`, keep): add a short release-cadence and versioning intro and a nightly-builds pointer.
  Sources: upstream `RELEASES.md`, `NIGHTLIES.md`.
- **Contribute** (`contribute.md`) and **Documentation MCP server** (`mcp-server.md`): unchanged.

## Preservation requirements

Existing frontmatter and assets that rewrites must carry forward:

- **`cascade` block on `_index.md`**: `product: telegraf` and `version: v1` cascade to every v1 page; the landing page rewrite must keep it.
- **Dual menu membership**: `_index.md` and `enterprise.md` also appear in the `telegraf_enterprise` menu; keep both menu entries (and the `state: new` badge on `enterprise.md`).
- **Existing `aliases`**: `get-started.md`, `install.md`, `configuration.md`, `release-notes.md`, `configure_plugins/troubleshoot.md`, `plugins.md`, and `data_formats/output/msgpack.md` carry legacy redirects (`/administration/*`, `/introduction/*`, and others); carry every existing alias forward when a page is rewritten or moved, and append new aliases rather than replacing.
- **Landing page education assets**: keep the intro video (`{{< youtube >}}`), the two InfluxDB University shortcodes (`influxdbu`), and the `/resources/videos/intro-to-telegraf/` related link in the revamped landing page.
- **`related` frontmatter**: preserve existing related-link lists on rewritten pages (fix the stale `/telegraf/v1/get_started/` link on `_index.md` to `/telegraf/v1/get-started/`).
- **Menu rename mechanics**: relabeling "Configure plugins" to "Use plugins" requires updating every child's `parent:` reference in the same PR; generated plugin pages parent to identifiers on frozen `_index.md` files and are unaffected.
- **`__tests__/shortcodes.md`**: test-only infrastructure; leave untouched.

## Shared content with Telegraf Controller

Agent status content is maintained once and rendered in both doc sets:

- Extract the body of `content/telegraf/controller/agents/status.md` to `content/shared/telegraf/agent-status.md`, and the bodies of `content/telegraf/controller/reference/agent-status-eval/*.md` to `content/shared/telegraf/agent-status-eval/`.
- Controller pages keep their URLs and frontmatter and consume the shared files via `source:`; they are the canonical versions.
- Telegraf v1 consuming pages (`administer/agent-status.md` and the `agent-status-eval/` reference section) set `canonical:` to the corresponding `/telegraf/controller/` URL.
- During extraction, rewrite Controller-specific `{{% product-name %}}` references to explicit "Telegraf Controller" text; on Telegraf v1 pages, `{{% product-name %}}` renders "Telegraf".
  Keep the shared prose product-neutral.

## URL and alias strategy

| Old URL                                                                                                                                                       | New URL                                        | Mechanism                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------- |
| `/telegraf/v1/configuration/`                                                                                                                                 | same (file becomes `configuration/_index.md`)  | no change; anchors preserved initially |
| `/telegraf/v1/metrics/`                                                                                                                                       | `/telegraf/v1/concepts/metrics/`               | alias                                  |
| `/telegraf/v1/configure_plugins/troubleshoot/`                                                                                                                | `/telegraf/v1/administer/troubleshoot/`        | alias                                  |
| `/telegraf/v1/configure_plugins/template-patterns/`                                                                                                           | `/telegraf/v1/data_formats/template-patterns/` | alias                                  |
| `/telegraf/v1/plugins/`, `/telegraf/v1/install/`, `/telegraf/v1/get-started/`, `/telegraf/v1/data_formats/**`, `/telegraf/v1/commands/**`, plugin directories | unchanged                                      | —                                      |

High-traffic inbound links to verify in each PR:
`/telegraf/v1/configuration/#filters`, `/telegraf/v1/plugins/` (37 refs), `/telegraf/v1/install/` (13 refs), `/telegraf/v1/data_formats/input/csv/` (10 refs), and the existing legacy aliases (`/administration/*`, `/introduction/*`).

## PR parceling

All PRs branch from and target `docs/telegraf-revamp`.

| #  | Branch                             | Scope                                                                                                                                                                                              | Depends on |
| -- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 0  | (base branch)                      | This plan                                                                                                                                                                                          | —          |
| 1  | `docs/telegraf-nav-skeleton`       | Section `_index` pages, menu labels, level-based weights, moves and aliases, landing page revamp                                                                                                   | 0          |
| 2  | `docs/telegraf-concepts`           | `concepts/` content: metrics rewrite, data-pipeline page                                                                                                                                           | 1          |
| 3  | `docs/telegraf-config-core`        | `configuration/` conversion plus file, toml, agent, plugin-options pages                                                                                                                           | 1          |
| 4  | `docs/telegraf-config-filtering`   | filtering and labels-selectors pages                                                                                                                                                               | 3          |
| 5  | `docs/telegraf-config-secrets-tls` | environment-variables, secrets, TLS pages                                                                                                                                                          | 3          |
| 6  | `docs/telegraf-get-started`        | Get started rewrite, install refresh                                                                                                                                                               | 1          |
| 7  | `docs/telegraf-plugin-guides`      | Use-plugins guides plus parse-data and serialize-data                                                                                                                                              | 2          |
| 8  | `docs/telegraf-data-formats`       | Missing formats plus refresh pass                                                                                                                                                                  | 7          |
| 9  | `docs/telegraf-examples`           | Examples section (may split per example)                                                                                                                                                           | 3, 7       |
| 10 | `docs/telegraf-administer`         | Service, monitor, manage-at-scale, troubleshoot                                                                                                                                                    | 1          |
| 11 | `docs/telegraf-reference-cleanup`  | Commands, glossary, platforms, release cadence; slim `configuration/_index.md`; light `enterprise.md` refresh; sweep earlier parcels for semicolon and colon sentence joins and menu-level weights | 3, 4, 5    |

\| 12 | `docs/telegraf-agent-status-shared` | Extract agent status content to `content/shared/telegraf/`, convert Controller pages to `source:` consumers, add v1 consuming pages | 1 |

PRs 2, 3, 6, and 10 can proceed in parallel once the skeleton (PR 1) merges.
Coordinate PR 12 with the Telegraf Controller doc owners; it converts Controller pages to shared-content consumers.

## Known gaps and fixes captured above

- `metrics.md` menu parent "Concepts" doesn't exist (orphaned nav entry) → fixed by PR 1/2.
- Input data formats missing: OpenMetrics, Parquet, Prometheus → PR 8.
- `data_formats/_index.md` carries a note about a missing table (Issue #2360) → PR 8.
- `configure_plugins/input_plugins/using_http.md` has an inconsistent menu parent → PR 1.
