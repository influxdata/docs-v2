# Telegraf Controller: Agent Status & CEL Reference Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add comprehensive agent status configuration docs and a multi-page CEL expression reference to the Telegraf Controller documentation.

**Architecture:** Update the existing status stub page with practical examples and create four new pages under `reference/cel/`. All content is documentation-only (Markdown). The CEL reference is self-contained and does not depend on the heartbeat plugin docs.

**Tech Stack:** Hugo, Markdown, TOML (config examples), CEL (expression examples)

**Spec:** `docs/superpowers/specs/2026-03-17-tc-cel-status-design.md`

***

## File Map

| Action | File                                                     | Responsibility                                            |
| ------ | -------------------------------------------------------- | --------------------------------------------------------- |
| Modify | `content/telegraf/controller/agents/status.md`           | Practical guide: status values, config examples, UI steps |
| Create | `content/telegraf/controller/reference/cel/_index.md`    | CEL overview, evaluation flow, config reference           |
| Create | `content/telegraf/controller/reference/cel/variables.md` | All CEL variables: top-level, agent, inputs, outputs      |
| Create | `content/telegraf/controller/reference/cel/functions.md` | CEL functions, operators, quick reference                 |
| Create | `content/telegraf/controller/reference/cel/examples.md`  | Real-world CEL expression examples by scenario            |

### Conventions (from existing TC docs)

- **Menu:** All TC pages use `menu: telegraf_controller:`. Child pages use `parent:` matching the parent's `name`.
- **Reference children:** Existing reference pages use `parent: Reference` with weights 101-110. The CEL section uses `parent: Reference` on `_index.md` with weight 107 (after authorization at 106, before EULA at 110). CEL child pages use `parent: CEL expressions`.
- **Product name shortcode:** Use `{{% product-name %}}` for "Telegraf Controller" and `{{% product-name "short" %}}` for "Controller".
- **Dynamic values shortcode:** Wrap TOML configs containing `&{...}` parameters with `{{% telegraf/dynamic-values %}}...{{% /telegraf/dynamic-values %}}`.
- **Callouts:** Use `> [!Note]`, `> [!Important]`, `> [!Warning]` syntax.
- **Semantic line feeds:** One sentence per line.

***

## Task 1: Create CEL reference index page

**Files:**

- Create: `content/telegraf/controller/reference/cel/_index.md`

- [ ] **Step 1: Create the CEL reference index page**

Create `content/telegraf/controller/reference/cel/_index.md` with the following content:

````markdown
---
title: CEL expressions
description: >
  Reference documentation for Common Expression Language (CEL) expressions used
  to evaluate Telegraf agent status in {{% product-name %}}.
menu:
  telegraf_controller:
    name: CEL expressions
    parent: Reference
weight: 107
related:
  - /telegraf/controller/agents/status/
  - /telegraf/v1/output-plugins/heartbeat/
---

[Common Expression Language (CEL)](https://cel.dev) is a lightweight expression
language designed for evaluating simple conditions.
{{% product-name %}} uses CEL expressions in the Telegraf
[heartbeat output plugin](/telegraf/v1/output-plugins/heartbeat/) to evaluate
agent status based on runtime data such as metric counts, error rates, and
plugin statistics.

## How status evaluation works

You define CEL expressions for three status levels in the
`[outputs.heartbeat.status]` section of your Telegraf configuration:

- **`ok`** — The agent is healthy.
- **`warn`** — The agent has a potential issue.
- **`fail`** — The agent has a critical problem.

Each expression is a CEL program that returns a boolean value.
Telegraf evaluates expressions in a configurable order (default:
`ok`, `warn`, `fail`) and assigns the status of the **first expression that
evaluates to `true`**.

If no expression evaluates to `true`, the `default` status is used
(default: `"ok"`).

### Initial status

Use the `initial` setting to define a status before the first Telegraf flush
cycle.
If `initial` is not set or is empty, Telegraf evaluates the status expressions
immediately, even before the first flush.

### Evaluation order

The `order` setting controls which expressions are evaluated and in what
sequence.

> [!Note]
> If you omit a status from the `order` list, its expression is **not
> evaluated**.

## Configuration reference

Configure status evaluation in the `[outputs.heartbeat.status]` section of the
heartbeat output plugin.
You must include `"status"` in the `include` list for status evaluation to take
effect.

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "agent-123"
  interval = "1m"
  include = ["hostname", "statistics", "status"]

  [outputs.heartbeat.status]
    ## CEL expressions that return a boolean.
    ## The first expression that evaluates to true sets the status.
    ok = "metrics > 0"
    warn = "log_errors > 0"
    fail = "log_errors > 10"

    ## Evaluation order (default: ["ok", "warn", "fail"])
    order = ["ok", "warn", "fail"]

    ## Default status when no expression matches
    ## Options: "ok", "warn", "fail", "undefined"
    default = "ok"

    ## Initial status before the first flush cycle
    ## Options: "ok", "warn", "fail", "undefined", ""
    # initial = ""
````

| Option    | Type            | Default                  | Description                                                                                                     |
| :-------- | :-------------- | :----------------------- | :-------------------------------------------------------------------------------------------------------------- |
| `ok`      | string (CEL)    | `"false"`                | Expression that, when `true`, sets status to **ok**.                                                            |
| `warn`    | string (CEL)    | `"false"`                | Expression that, when `true`, sets status to **warn**.                                                          |
| `fail`    | string (CEL)    | `"false"`                | Expression that, when `true`, sets status to **fail**.                                                          |
| `order`   | list of strings | `["ok", "warn", "fail"]` | Order in which expressions are evaluated.                                                                       |
| `default` | string          | `"ok"`                   | Status used when no expression evaluates to `true`. Options: `ok`, `warn`, `fail`, `undefined`.                 |
| `initial` | string          | `""`                     | Status before the first flush. Options: `ok`, `warn`, `fail`, `undefined`, `""` (empty = evaluate expressions). |

{{< children hlevel="h2" >}}

````

- [ ] **Step 2: Verify the file renders correctly**

Run: `npx hugo server` and navigate to the CEL expressions reference page.
Verify: page renders, navigation shows "CEL expressions" under "Reference", child page links appear.

- [ ] **Step 3: Commit**

```bash
git add content/telegraf/controller/reference/cel/_index.md
git commit -m "feat(tc-cel): add CEL expressions reference index page"
````

***

## Task 2: Create CEL variables reference page

**Files:**

- Create: `content/telegraf/controller/reference/cel/variables.md`

- [ ] **Step 1: Create the variables reference page**

Create `content/telegraf/controller/reference/cel/variables.md` with the following content:

````markdown
---
title: CEL variables
description: >
  Reference for variables available in CEL expressions used to evaluate
  Telegraf agent status in {{% product-name %}}.
menu:
  telegraf_controller:
    name: Variables
    parent: CEL expressions
weight: 201
---

CEL expressions for agent status evaluation have access to variables that
represent data collected by Telegraf since the last successful heartbeat message
(unless noted otherwise).

## Top-level variables

| Variable | Type | Description |
|:---------|:-----|:------------|
| `metrics` | int | Number of metrics arriving at the heartbeat output plugin. |
| `log_errors` | int | Number of errors logged by the Telegraf instance. |
| `log_warnings` | int | Number of warnings logged by the Telegraf instance. |
| `last_update` | time | Timestamp of the last successful heartbeat message. Use with `now()` to calculate durations or rates. |
| `agent` | map | Agent-level statistics. See [Agent statistics](#agent-statistics). |
| `inputs` | map | Input plugin statistics. See [Input plugin statistics](#input-plugin-statistics-inputs). |
| `outputs` | map | Output plugin statistics. See [Output plugin statistics](#output-plugin-statistics-outputs). |

## Agent statistics

The `agent` variable is a map containing aggregate statistics for the entire
Telegraf instance.
These fields correspond to the `internal_agent` metric from the
Telegraf [internal input plugin](/telegraf/v1/plugins/#input-internal).

| Field | Type | Description |
|:------|:-----|:------------|
| `agent.metrics_written` | int | Total metrics written by all output plugins. |
| `agent.metrics_rejected` | int | Total metrics rejected by all output plugins. |
| `agent.metrics_dropped` | int | Total metrics dropped by all output plugins. |
| `agent.metrics_gathered` | int | Total metrics collected by all input plugins. |
| `agent.gather_errors` | int | Total collection errors across all input plugins. |
| `agent.gather_timeouts` | int | Total collection timeouts across all input plugins. |

### Example

```cel
agent.gather_errors > 0
````

## Input plugin statistics (`inputs`)

The `inputs` variable is a map where each key is a plugin type (for example,
`cpu` for `inputs.cpu`) and the value is a **list** of plugin instances.
Each entry in the list represents one configured instance of that plugin type.

These fields correspond to the `internal_gather` metric from the Telegraf
[internal input plugin](/telegraf/v1/plugins/#input-internal).

| Field              | Type   | Description                                                                               |
| :----------------- | :----- | :---------------------------------------------------------------------------------------- |
| `id`               | string | Unique plugin identifier.                                                                 |
| `alias`            | string | Alias set for the plugin. Only exists if an alias is defined in the plugin configuration. |
| `errors`           | int    | Collection errors for this plugin instance.                                               |
| `metrics_gathered` | int    | Number of metrics collected by this instance.                                             |
| `gather_time_ns`   | int    | Time spent gathering metrics, in nanoseconds.                                             |
| `gather_timeouts`  | int    | Number of timeouts during metric collection.                                              |
| `startup_errors`   | int    | Number of times the plugin failed to start.                                               |

### Access patterns

Access a specific plugin type and iterate over its instances:

```cel
// Check if any cpu input instance has errors
inputs.cpu.exists(i, i.errors > 0)
```

```cel
// Access the first instance of the cpu input
inputs.cpu[0].metrics_gathered
```

Use `has()` to safely check if a plugin type exists before accessing it:

```cel
// Safe access — returns false if no cpu input is configured
has(inputs.cpu) && inputs.cpu.exists(i, i.errors > 0)
```

## Output plugin statistics (`outputs`)

The `outputs` variable is a map with the same structure as `inputs`.
Each key is a plugin type (for example, `influxdb_v2` for `outputs.influxdb_v2`)
and the value is a list of plugin instances.

These fields correspond to the `internal_write` metric from the Telegraf
[internal input plugin](/telegraf/v1/plugins/#input-internal).

| Field              | Type   | Description                                                                                              |
| :----------------- | :----- | :------------------------------------------------------------------------------------------------------- |
| `id`               | string | Unique plugin identifier.                                                                                |
| `alias`            | string | Alias set for the plugin. Only exists if an alias is defined in the plugin configuration.                |
| `errors`           | int    | Write errors for this plugin instance.                                                                   |
| `metrics_filtered` | int    | Number of metrics filtered by the output.                                                                |
| `write_time_ns`    | int    | Time spent writing metrics, in nanoseconds.                                                              |
| `startup_errors`   | int    | Number of times the plugin failed to start.                                                              |
| `metrics_added`    | int    | Number of metrics added to the output buffer.                                                            |
| `metrics_written`  | int    | Number of metrics written to the output destination.                                                     |
| `metrics_rejected` | int    | Number of metrics rejected by the service or serialization.                                              |
| `metrics_dropped`  | int    | Number of metrics dropped (for example, due to buffer fullness).                                         |
| `buffer_size`      | int    | Current number of metrics in the output buffer.                                                          |
| `buffer_limit`     | int    | Capacity of the output buffer. Irrelevant for disk-based buffers.                                        |
| `buffer_fullness`  | float  | Ratio of metrics in the buffer to capacity. Can exceed `1.0` (greater than 100%) for disk-based buffers. |

### Access patterns

```cel
// Check if any InfluxDB v2 output has write errors
outputs.influxdb_v2.exists(o, o.errors > 0)
```

```cel
// Check buffer fullness across all instances of an output
outputs.influxdb_v2.exists(o, o.buffer_fullness > 0.8)
```

## Accumulation behavior

Unless noted otherwise, all variable values are **accumulated since the last
successful heartbeat message**.
Use the `last_update` variable with `now()` to calculate rates — for example:

```cel
// True if the error rate exceeds 1 error per minute
log_errors > 0 && duration.getMinutes(now() - last_update) > 0
  && log_errors / duration.getMinutes(now() - last_update) > 1
```

````

- [ ] **Step 2: Verify the file renders correctly**

Run: `npx hugo server` and navigate to the Variables page under CEL expressions.
Verify: page renders, tables display correctly, code blocks have proper syntax highlighting, navigation shows "Variables" under "CEL expressions".

- [ ] **Step 3: Commit**

```bash
git add content/telegraf/controller/reference/cel/variables.md
git commit -m "feat(tc-cel): add CEL variables reference page"
````

***

## Task 3: Create CEL functions reference page

**Files:**

- Create: `content/telegraf/controller/reference/cel/functions.md`

- [ ] **Step 1: Create the functions reference page**

Create `content/telegraf/controller/reference/cel/functions.md` with the following content:

````markdown
---
title: CEL functions and operators
description: >
  Reference for functions and operators available in CEL expressions used to
  evaluate Telegraf agent status in {{% product-name %}}.
menu:
  telegraf_controller:
    name: Functions
    parent: CEL expressions
weight: 202
---

CEL expressions for agent status evaluation support built-in CEL operators and
the following function libraries.

## Time functions

### `now()`

Returns the current time.
Use with `last_update` to calculate durations or detect stale data.

```cel
// True if more than 10 minutes since last heartbeat
now() - last_update > duration('10m')
````

```cel
// True if more than 5 minutes since last heartbeat
now() - last_update > duration('5m')
```

## Math functions

Math functions from the
[CEL math library](https://github.com/google/cel-go/blob/master/ext/README.md#math)
are available for numeric calculations.

### Commonly used functions

| Function                   | Description                 | Example                                    |
| :------------------------- | :-------------------------- | :----------------------------------------- |
| `math.greatest(a, b, ...)` | Returns the greatest value. | `math.greatest(log_errors, log_warnings)`  |
| `math.least(a, b, ...)`    | Returns the least value.    | `math.least(agent.metrics_gathered, 1000)` |

### Example

```cel
// Warn if either errors or warnings exceed a threshold
math.greatest(log_errors, log_warnings) > 5
```

## String functions

String functions from the
[CEL strings library](https://github.com/google/cel-go/blob/master/ext/README.md#strings)
are available for string operations.
These are useful when checking plugin `alias` or `id` fields.

### Example

```cel
// Check if any input plugin has an alias containing "critical"
inputs.cpu.exists(i, has(i.alias) && i.alias.contains("critical"))
```

## Encoding functions

Encoding functions from the
[CEL encoder library](https://github.com/google/cel-go/blob/master/ext/README.md#encoders)
are available for encoding and decoding values.

## Operators

CEL supports standard operators for building expressions.

### Comparison operators

| Operator | Description           | Example                        |
| :------- | :-------------------- | :----------------------------- |
| `==`     | Equal                 | `metrics == 0`                 |
| `!=`     | Not equal             | `log_errors != 0`              |
| `<`      | Less than             | `agent.metrics_gathered < 100` |
| `<=`     | Less than or equal    | `buffer_fullness <= 0.5`       |
| `>`      | Greater than          | `log_errors > 10`              |
| `>=`     | Greater than or equal | `metrics >= 1000`              |

### Logical operators

| Operator | Description | Example                                  |
| :------- | :---------- | :--------------------------------------- |
| `&&`     | Logical AND | `log_errors > 0 && metrics == 0`         |
| `\|\|`   | Logical OR  | `log_errors > 10 \|\| log_warnings > 50` |
| `!`      | Logical NOT | `!(metrics > 0)`                         |

### Arithmetic operators

| Operator | Description    | Example                                          |
| :------- | :------------- | :----------------------------------------------- |
| `+`      | Addition       | `log_errors + log_warnings`                      |
| `-`      | Subtraction    | `agent.metrics_gathered - agent.metrics_dropped` |
| `*`      | Multiplication | `log_errors * 2`                                 |
| `/`      | Division       | `agent.metrics_dropped / agent.metrics_gathered` |
| `%`      | Modulo         | `metrics % 100`                                  |

### Ternary operator

```cel
// Conditional expression
log_errors > 10 ? true : false
```

### List operations

| Function                 | Description                    | Example                                     |
| :----------------------- | :----------------------------- | :------------------------------------------ |
| `exists(var, condition)` | True if any element matches.   | `inputs.cpu.exists(i, i.errors > 0)`        |
| `all(var, condition)`    | True if all elements match.    | `outputs.influxdb_v2.all(o, o.errors == 0)` |
| `size()`                 | Number of elements.            | `inputs.cpu.size() > 0`                     |
| `has()`                  | True if a field or key exists. | `has(inputs.cpu)`                           |

````

- [ ] **Step 2: Verify the file renders correctly**

Run: `npx hugo server` and navigate to the Functions page under CEL expressions.
Verify: page renders, tables display correctly, pipe characters in logical operators table render properly, navigation shows "Functions" under "CEL expressions".

- [ ] **Step 3: Commit**

```bash
git add content/telegraf/controller/reference/cel/functions.md
git commit -m "feat(tc-cel): add CEL functions and operators reference page"
````

***

## Task 4: Create CEL examples page

**Files:**

- Create: `content/telegraf/controller/reference/cel/examples.md`

- [ ] **Step 1: Create the examples page**

Create `content/telegraf/controller/reference/cel/examples.md` with the following content:

````markdown
---
title: CEL expression examples
description: >
  Real-world examples of CEL expressions for evaluating Telegraf agent status
  in {{% product-name %}}.
menu:
  telegraf_controller:
    name: Examples
    parent: CEL expressions
weight: 203
related:
  - /telegraf/controller/agents/status/
  - /telegraf/controller/reference/cel/variables/
  - /telegraf/controller/reference/cel/functions/
---

Each example includes a scenario description, the CEL expression, a full
heartbeat plugin configuration block, and an explanation.

For the full list of available variables and functions, see:

- [CEL variables](/telegraf/controller/reference/cel/variables/)
- [CEL functions and operators](/telegraf/controller/reference/cel/functions/)

## Basic health check

**Scenario:** Report `ok` when Telegraf is actively processing metrics.
Fall back to the default status (`ok`) when no expression matches — this means
the agent is healthy as long as metrics are flowing.

**Expression:**

```cel
ok = "metrics > 0"
````

**Configuration:**

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "agent-123"
  interval = "1m"
  include = ["hostname", "statistics", "status"]

  [outputs.heartbeat.status]
    ok = "metrics > 0"
    default = "fail"
```

**How it works:** If the heartbeat plugin received metrics since the last
heartbeat, the status is `ok`.
If no metrics arrived, no expression matches and the `default` status of `fail`
is used, indicating the agent is not processing data.

## Error rate monitoring

**Scenario:** Warn when any errors are logged and fail when the error count is
high.

**Expressions:**

```cel
warn = "log_errors > 0"
fail = "log_errors > 10"
```

**Configuration:**

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "agent-123"
  interval = "1m"
  include = ["hostname", "statistics", "status"]

  [outputs.heartbeat.status]
    ok = "log_errors == 0 && log_warnings == 0"
    warn = "log_errors > 0"
    fail = "log_errors > 10"
    order = ["fail", "warn", "ok"]
    default = "ok"
```

**How it works:** Expressions are evaluated in `fail`, `warn`, `ok` order.
If more than 10 errors occurred since the last heartbeat, the status is `fail`.
If 1-10 errors occurred, the status is `warn`.
If no errors or warnings occurred, the status is `ok`.

## Buffer health

**Scenario:** Warn when any output plugin's buffer exceeds 80% fullness,
indicating potential data backpressure.

**Expression:**

```cel
warn = "outputs.influxdb_v2.exists(o, o.buffer_fullness > 0.8)"
fail = "outputs.influxdb_v2.exists(o, o.buffer_fullness > 0.95)"
```

**Configuration:**

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "agent-123"
  interval = "1m"
  include = ["hostname", "statistics", "status"]

  [outputs.heartbeat.status]
    ok = "metrics > 0"
    warn = "outputs.influxdb_v2.exists(o, o.buffer_fullness > 0.8)"
    fail = "outputs.influxdb_v2.exists(o, o.buffer_fullness > 0.95)"
    order = ["fail", "warn", "ok"]
    default = "ok"
```

**How it works:** The `outputs.influxdb_v2` map contains a list of all
`influxdb_v2` output plugin instances.
The `exists()` function iterates over all instances and returns `true` if any
instance's `buffer_fullness` exceeds the threshold.
At 95% fullness, the status is `fail`; at 80%, `warn`; otherwise `ok`.

## Plugin-specific checks

**Scenario:** Monitor a specific input plugin for collection errors and use
safe access patterns to avoid errors when the plugin is not configured.

**Expression:**

```cel
warn = "has(inputs.cpu) && inputs.cpu.exists(i, i.errors > 0)"
fail = "has(inputs.cpu) && inputs.cpu.exists(i, i.startup_errors > 0)"
```

**Configuration:**

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "agent-123"
  interval = "1m"
  include = ["hostname", "statistics", "status"]

  [outputs.heartbeat.status]
    ok = "metrics > 0"
    warn = "has(inputs.cpu) && inputs.cpu.exists(i, i.errors > 0)"
    fail = "has(inputs.cpu) && inputs.cpu.exists(i, i.startup_errors > 0)"
    order = ["fail", "warn", "ok"]
    default = "ok"
```

**How it works:** The `has()` function checks if the `cpu` key exists in the
`inputs` map before attempting to access it.
This prevents evaluation errors when the plugin is not configured.
If the plugin has startup errors, the status is `fail`.
If it has collection errors, the status is `warn`.

## Composite conditions

**Scenario:** Combine multiple signals to detect a degraded agent — high error
count combined with output buffer pressure.

**Expression:**

```cel
fail = "log_errors > 5 && has(outputs.influxdb_v2) && outputs.influxdb_v2.exists(o, o.buffer_fullness > 0.9)"
```

**Configuration:**

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "agent-123"
  interval = "1m"
  include = ["hostname", "statistics", "status"]

  [outputs.heartbeat.status]
    ok = "metrics > 0 && log_errors == 0"
    warn = "log_errors > 0 || (has(outputs.influxdb_v2) && outputs.influxdb_v2.exists(o, o.buffer_fullness > 0.8))"
    fail = "log_errors > 5 && has(outputs.influxdb_v2) && outputs.influxdb_v2.exists(o, o.buffer_fullness > 0.9)"
    order = ["fail", "warn", "ok"]
    default = "ok"
```

**How it works:** The `fail` expression requires **both** a high error count
**and** buffer pressure to trigger.
The `warn` expression uses `||` to trigger on **either** condition independently.
This layered approach avoids false alarms from transient spikes in a single
metric.

## Time-based expressions

**Scenario:** Warn when the time since the last successful heartbeat exceeds a
threshold, indicating potential connectivity or performance issues.

**Expression:**

```cel
warn = "now() - last_update > duration('10m')"
fail = "now() - last_update > duration('30m')"
```

**Configuration:**

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "agent-123"
  interval = "1m"
  include = ["hostname", "statistics", "status"]

  [outputs.heartbeat.status]
    ok = "metrics > 0"
    warn = "now() - last_update > duration('10m')"
    fail = "now() - last_update > duration('30m')"
    order = ["fail", "warn", "ok"]
    default = "undefined"
    initial = "undefined"
```

**How it works:** The `now()` function returns the current time and
`last_update` is the timestamp of the last successful heartbeat.
Subtracting them produces a duration that can be compared against a threshold.
The `initial` status is set to `undefined` so new agents don't immediately show
a stale-data warning before their first successful heartbeat.

## Custom evaluation order

**Scenario:** Use fail-first evaluation to prioritize detecting critical issues
before checking for healthy status.

**Configuration:**

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "agent-123"
  interval = "1m"
  include = ["hostname", "statistics", "status"]

  [outputs.heartbeat.status]
    ok = "metrics > 0 && log_errors == 0"
    warn = "log_errors > 0"
    fail = "log_errors > 10 || agent.metrics_dropped > 100"
    order = ["fail", "warn", "ok"]
    default = "undefined"
```

**How it works:** By setting `order = ["fail", "warn", "ok"]`, the most severe
conditions are checked first.
If the agent has more than 10 logged errors or has dropped more than 100
metrics, the status is `fail` — regardless of whether the `ok` or `warn`
expression would also match.
This is the recommended order for production deployments where early detection
of critical issues is important.

````

- [ ] **Step 2: Verify the file renders correctly**

Run: `npx hugo server` and navigate to the Examples page under CEL expressions.
Verify: page renders, all seven example sections display with correct TOML syntax highlighting, navigation shows "Examples" under "CEL expressions".

- [ ] **Step 3: Commit**

```bash
git add content/telegraf/controller/reference/cel/examples.md
git commit -m "feat(tc-cel): add CEL expression examples page"
````

***

## Task 5: Update the agent status page

**Files:**

- Modify: `content/telegraf/controller/agents/status.md`

- [ ] **Step 1: Replace the status page content**

Replace the full content of `content/telegraf/controller/agents/status.md` with the following:

````markdown
---
title: Set agent statuses
description: >
  Configure agent status evaluation using CEL expressions in the Telegraf
  heartbeat output plugin and view statuses in {{% product-name %}}.
menu:
  telegraf_controller:
    name: Set agent statuses
    parent: Manage agents
weight: 104
related:
  - /telegraf/controller/reference/cel/
  - /telegraf/controller/agents/reporting-rules/
  - /telegraf/v1/output-plugins/heartbeat/
---

Agent statuses reflect the health of a Telegraf instance based on runtime data.
The Telegraf [heartbeat output plugin](/telegraf/v1/output-plugins/heartbeat/)
evaluates [Common Expression Language (CEL)](/telegraf/controller/reference/cel/)
expressions against agent metrics, error counts, and plugin statistics to
determine the status sent with each heartbeat.

## Status values

{{% product-name %}} displays the following agent statuses:

| Status | Source | Description |
|:-------|:-------|:------------|
| **Ok** | Heartbeat plugin | The agent is healthy. Set when the `ok` CEL expression evaluates to `true`. |
| **Warn** | Heartbeat plugin | The agent has a potential issue. Set when the `warn` CEL expression evaluates to `true`. |
| **Fail** | Heartbeat plugin | The agent has a critical problem. Set when the `fail` CEL expression evaluates to `true`. |
| **Undefined** | Heartbeat plugin | No expression matched and the `default` is set to `undefined`, or the `initial` status is `undefined`. |
| **Not Reporting** | {{% product-name "short" %}} | The agent has not sent a heartbeat within the [reporting rule](/telegraf/controller/agents/reporting-rules/) threshold. {{% product-name "short" %}} applies this status automatically. |

## How status evaluation works

You define CEL expressions for `ok`, `warn`, and `fail` in the
`[outputs.heartbeat.status]` section of your heartbeat plugin configuration.
Telegraf evaluates expressions in a configurable order and assigns the status
of the first expression that evaluates to `true`.

For full details on evaluation flow, configuration options, and available
variables and functions, see the
[CEL expressions reference](/telegraf/controller/reference/cel/).

## Configure agent statuses

To configure status evaluation, add `"status"` to the `include` list in your
heartbeat plugin configuration and define CEL expressions in the
`[outputs.heartbeat.status]` section.

### Example: Basic health check

Report `ok` when metrics are flowing.
If no metrics arrive, fall back to the `fail` status.

{{% telegraf/dynamic-values %}}
```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "&{agent_id}"
  token = "${INFLUX_TOKEN}"
  interval = "1m"
  include = ["hostname", "statistics", "status"]

  [outputs.heartbeat.status]
    ok = "metrics > 0"
    default = "fail"
````

{{% /telegraf/dynamic-values %}}

### Example: Error-based status

Warn when errors are logged, fail when the error count is high.

{{% telegraf/dynamic-values %}}

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "&{agent_id}"
  token = "${INFLUX_TOKEN}"
  interval = "1m"
  include = ["hostname", "statistics", "status"]

  [outputs.heartbeat.status]
    ok = "log_errors == 0 && log_warnings == 0"
    warn = "log_errors > 0"
    fail = "log_errors > 10"
    order = ["fail", "warn", "ok"]
    default = "ok"
```

{{% /telegraf/dynamic-values %}}

### Example: Composite condition

Combine error count and buffer pressure signals.

{{% telegraf/dynamic-values %}}

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "&{agent_id}"
  token = "${INFLUX_TOKEN}"
  interval = "1m"
  include = ["hostname", "statistics", "status"]

  [outputs.heartbeat.status]
    ok = "metrics > 0 && log_errors == 0"
    warn = "log_errors > 0 || (has(outputs.influxdb_v2) && outputs.influxdb_v2.exists(o, o.buffer_fullness > 0.8))"
    fail = "log_errors > 5 && has(outputs.influxdb_v2) && outputs.influxdb_v2.exists(o, o.buffer_fullness > 0.9)"
    order = ["fail", "warn", "ok"]
    default = "ok"
```

{{% /telegraf/dynamic-values %}}

For more examples including buffer health, plugin-specific checks, and
time-based expressions, see
[CEL expression examples](/telegraf/controller/reference/cel/examples/).

## View an agent's status

1. In {{% product-name %}}, go to **Agents**.
2. Check the **Status** column for each agent.
3. To see more details, click the **More button ({{% icon "tc-more" %}})** and
   select **View Details**.
4. The details page shows the reported status, reporting rule assignment, and
   the time of the last heartbeat.

## Learn more

- [CEL expressions reference](/telegraf/controller/reference/cel/) — Full
  reference for CEL evaluation flow, configuration, variables, functions, and
  examples.
- [Heartbeat output plugin](/telegraf/v1/output-plugins/heartbeat/) — Plugin
  configuration reference.
- [Define reporting rules](/telegraf/controller/agents/reporting-rules/) — Configure
  thresholds for the **Not Reporting** status.

````

- [ ] **Step 2: Verify the file renders correctly**

Run: `npx hugo server` and navigate to the "Set agent statuses" page under "Manage agents".
Verify: page renders, status table displays correctly, all three example config blocks render with TOML syntax highlighting, cross-links resolve correctly, the "View an agent's status" section is preserved.

- [ ] **Step 3: Commit**

```bash
git add content/telegraf/controller/agents/status.md
git commit -m "feat(tc-status): expand agent status page with CEL examples and configuration"
````

***

## Task 6: Cross-link verification and final review

**Files:**

- All files from Tasks 1-5

- [ ] **Step 1: Verify all cross-links**

Run: `npx hugo server` and verify the following links resolve:

1. Status page → CEL reference index: `/telegraf/controller/reference/cel/`
2. Status page → Heartbeat plugin: `/telegraf/v1/output-plugins/heartbeat/`
3. Status page → Reporting rules: `/telegraf/controller/agents/reporting-rules/`
4. Status page → CEL examples: `/telegraf/controller/reference/cel/examples/`
5. CEL index → Heartbeat plugin: `/telegraf/v1/output-plugins/heartbeat/`
6. CEL examples → Variables: `/telegraf/controller/reference/cel/variables/`
7. CEL examples → Functions: `/telegraf/controller/reference/cel/functions/`
8. CEL examples → Status page: `/telegraf/controller/agents/status/`
9. CEL variables → Internal input plugin: `/telegraf/v1/plugins/#input-internal`

- [ ] **Step 2: Verify navigation structure**

In the left nav, confirm:

- "CEL expressions" appears under "Reference"

- "Variables", "Functions", and "Examples" appear as children of "CEL expressions"

- "Set agent statuses" remains under "Manage agents"

- [ ] **Step 3: Run Vale linting**

Run: `.ci/vale/vale.sh content/telegraf/controller/agents/status.md content/telegraf/controller/reference/cel/`
Fix any errors or warnings. Suggestions can be evaluated but are not blocking.

- [ ] **Step 4: Commit any linting fixes**

```bash
git add content/telegraf/controller/agents/status.md content/telegraf/controller/reference/cel/
git commit -m "style(tc-cel): fix Vale linting issues"
```
