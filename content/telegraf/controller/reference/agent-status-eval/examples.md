---
title: CEL expression examples
description: >
  Real-world examples of CEL expressions for evaluating Telegraf agent status.
menu:
  telegraf_controller:
    name: Examples
    parent: Agent status evaluation
weight: 203
related:
  - /telegraf/controller/agents/status/
  - /telegraf/controller/reference/agent-status-eval/variables/
  - /telegraf/controller/reference/agent-status-eval/functions/
---

Each example includes a scenario description, the CEL expression, a full
heartbeat plugin configuration block, and an explanation.

For the full list of available variables and functions, see:

- [CEL variables](/telegraf/controller/reference/agent-status-eval/variables/)
- [CEL functions and operators](/telegraf/controller/reference/agent-status-eval/functions/)

## Basic health check

**Scenario:** Report `ok` when Telegraf is actively processing metrics.
Fall back to the default status (`ok`) when no expression matches — this means
the agent is healthy as long as metrics are flowing.

**Expression:**

```js
ok = "metrics > 0"
```

**Configuration:**

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "agent-123"
  interval = "1m"
  include = ["hostname", "statistics", "configs", "logs", "status"]

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

```js
warn = "log_errors > 0"
fail = "log_errors > 10"
```

**Configuration:**

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "agent-123"
  interval = "1m"
  include = ["hostname", "statistics", "configs", "logs", "status"]

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

```js
warn = "outputs.influxdb_v2.exists(o, o.buffer_fullness > 0.8)"
fail = "outputs.influxdb_v2.exists(o, o.buffer_fullness > 0.95)"
```

**Configuration:**

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "agent-123"
  interval = "1m"
  include = ["hostname", "statistics", "configs", "logs", "status"]

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

```js
warn = "has(inputs.cpu) && inputs.cpu.exists(i, i.errors > 0)"
fail = "has(inputs.cpu) && inputs.cpu.exists(i, i.startup_errors > 0)"
```

**Configuration:**

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "agent-123"
  interval = "1m"
  include = ["hostname", "statistics", "configs", "logs", "status"]

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

```js
fail = "log_errors > 5 && has(outputs.influxdb_v2) && outputs.influxdb_v2.exists(o, o.buffer_fullness > 0.9)"
```

**Configuration:**

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "agent-123"
  interval = "1m"
  include = ["hostname", "statistics", "configs", "logs", "status"]

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

```js
warn = "now() - last_update > duration('10m')"
fail = "now() - last_update > duration('30m')"
```

**Configuration:**

```toml
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "agent-123"
  interval = "1m"
  include = ["hostname", "statistics", "configs", "logs", "status"]

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
  include = ["hostname", "statistics", "configs", "logs", "status"]

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
