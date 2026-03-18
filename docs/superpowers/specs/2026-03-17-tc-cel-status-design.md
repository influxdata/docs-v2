# Telegraf Controller: Agent Status & CEL Expression Reference

**Date:** 2026-03-17
**Status:** Approved
**Scope:** Documentation content (no code changes)

## Summary

Add comprehensive agent status configuration documentation to Telegraf Controller docs. This includes updating the existing status page with practical examples and creating a new multi-page CEL expression reference in the reference section.

## Deliverables

### 1. Update existing status page

**File:** `content/telegraf/controller/agents/status.md`

Expand from the current stub into a practical guide with the following structure:

1. **Intro** — What agent statuses are, the four status values (`ok`, `warn`, `fail`, `undefined`) plus the Controller-applied `Not Reporting` state.
2. **How status evaluation works** — Brief explanation of CEL expressions, evaluation order, defaults, and initial status. Links to the CEL reference for full details.
3. **Configure agent statuses** — Example heartbeat plugin config with `include = ["status"]` and the `[outputs.heartbeat.status]` section. 2-3 practical inline examples:
   - Basic health check (ok when metrics are flowing)
   - Error-based warning/failure
   - Composite condition
4. **View an agent's status** — Keep existing UI steps as-is.
5. **Link to CEL reference** — Points users to the full reference for all variables, functions, and more examples.

### 2. Create CEL expression reference (multi-page)

New section under `content/telegraf/controller/reference/cel/`.

#### `_index.md` — CEL Overview

1. **Intro** — What CEL is (Common Expression Language), how Telegraf Controller uses it to evaluate agent status from heartbeat data.
2. **How status evaluation works** — Detailed evaluation flow:
   - Expressions are defined for `ok`, `warn`, `fail` — each is a CEL program returning a boolean.
   - Evaluation order is configurable via `order` (default: `["ok", "warn", "fail"]`).
   - First expression evaluating to `true` sets the status.
   - If none match, `default` status is used (default: `"ok"`).
   - `initial` status can be set for the period before the first flush.
3. **Configuration reference** — The `[outputs.heartbeat.status]` config block with all options: `ok`, `warn`, `fail`, `order`, `default`, `initial`.
4. **Child page links** — Variables, Functions, Examples.

#### `variables.md` — Variables Reference

1. **Intro** — Variables represent data collected by Telegraf since the last successful heartbeat (unless noted otherwise).
2. **Top-level variables** — Table or definition list:
   - `metrics` (int) — metrics arriving at the heartbeat plugin
   - `log_errors` (int) — errors logged
   - `log_warnings` (int) — warnings logged
   - `last_update` (time) — time of last successful heartbeat
   - `agent` (map) — agent-level statistics
   - `inputs` (map) — input plugin statistics
   - `outputs` (map) — output plugin statistics
3. **Agent statistics (`agent`)** — Map fields:
   - `metrics_written`, `metrics_rejected`, `metrics_dropped`, `metrics_gathered`, `gather_errors`, `gather_timeouts`
4. **Input plugin statistics (`inputs`)** — Map structure: key = plugin type (e.g., `cpu`), value = list of instances. Fields per instance:
   - `id`, `alias`, `errors`, `metrics_gathered`, `gather_time_ns`, `gather_timeouts`, `startup_errors`
5. **Output plugin statistics (`outputs`)** — Same map structure. Fields per instance:
   - `id`, `alias`, `errors`, `metrics_filtered`, `write_time_ns`, `startup_errors`, `metrics_added`, `metrics_written`, `metrics_rejected`, `metrics_dropped`, `buffer_size`, `buffer_limit`, `buffer_fullness`
6. **Note on accumulation** — Values accumulate since last successful heartbeat; `last_update` enables rate calculation.

#### `functions.md` — Functions Reference

1. **Intro** — CEL expressions support built-in CEL operators plus additional function libraries.
2. **Time functions** — `now()` returns current time; usage with `last_update` for duration/rate calculations. Include usage example.
3. **Math functions** — Link to CEL math library. Highlight commonly useful functions (e.g., `math.greatest()`, `math.least()`). Brief examples.
4. **String functions** — Link to CEL strings library. Note usefulness for checking `alias` or `id` fields. Brief example.
5. **Encoding functions** — Link to CEL encoder library. Brief note on relevance.
6. **CEL operators reference** — Quick reference for comparison (`==`, `!=`, `<`, `>`), logical (`&&`, `||`, `!`), arithmetic (`+`, `-`, `*`, `/`), and ternary (`? :`) operators.

#### `examples.md` — Examples

Each example follows a consistent pattern: **scenario description → CEL expression(s) → full config block → explanation**.

1. **Basic health check** — `ok` when metrics are flowing, `fail` otherwise.
   - `ok = "metrics > 0"`
2. **Error rate monitoring** — warn on logged errors, fail on high error count.
   - `warn = "log_errors > 0"`, `fail = "log_errors > 10"`
3. **Buffer health** — warn when any output buffer exceeds 80% fullness.
   - Uses `outputs` map iteration to check `buffer_fullness` across plugin instances.
4. **Plugin-specific checks** — check a specific input or output for errors.
   - Demonstrates map access like `outputs.influxdb_v2.exists(o, o.errors > 0)` and safe access with `has()`.
5. **Composite conditions** — combining multiple signals.
   - `fail = "log_errors > 5 && outputs.influxdb_v2.exists(o, o.buffer_fullness > 0.9)"`
6. **Time-based expressions** — using `now()` and `last_update` for staleness.
   - e.g., `warn = "now() - last_update > duration('10m')"`
7. **Custom evaluation order** — shows `order = ["fail", "warn", "ok"]` for fail-first evaluation.

## File Structure

### New files

```
content/telegraf/controller/reference/
  cel/
    _index.md          — CEL overview, evaluation flow, config reference
    variables.md       — All variables (top-level, agent, inputs, outputs)
    functions.md       — Functions, operators, quick reference
    examples.md        — Real-world examples by scenario
```

### Updated files

```
content/telegraf/controller/agents/status.md  — Expand from stub to practical guide
```

## Navigation / Menu Structure

The CEL section nests under the existing `Reference` parent in the `telegraf_controller` menu:

- **Reference** (existing)
  - **CEL expressions** (`_index.md`)
    - **Variables** (`variables.md`)
    - **Functions** (`functions.md`)
    - **Examples** (`examples.md`)

## Cross-Linking Strategy

- Status page → CEL reference `_index.md` for full details
- Status page → heartbeat plugin for base config syntax
- CEL examples page → status page for UI context
- CEL variables/functions pages are **self-contained** (standalone, no dependency on heartbeat plugin docs)

## Design Decisions

1. **Standalone CEL reference** — The TC CEL reference is self-contained with its own variable and function documentation, independent of the heartbeat plugin page. Users configuring statuses in Controller shouldn't need to navigate to plugin docs for the variable reference.
2. **Status page as practical guide** — Includes 2-3 inline examples for quick start; full reference lives in the CEL section.
3. **Multi-page reference** — Keeps pages shorter and searchable. Variables, functions, and examples each get their own page. Function pages can be split further by category later if they grow large.
4. **Consistent example format** — Every example includes scenario, expression, full config block, and explanation.
