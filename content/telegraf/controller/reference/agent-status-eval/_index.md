---
title: Agent status evaluation
description: >
  Reference documentation for Common Expression Language (CEL) expressions used
  to evaluate Telegraf agent status.
menu:
  telegraf_controller:
    name: Agent status evaluation
    parent: Reference
weight: 107
related:
  - /telegraf/controller/agents/status/
  - /telegraf/v1/output-plugins/heartbeat/
---

The Telegraf [heartbeat output plugin](/telegraf/v1/output-plugins/heartbeat/)
uses CEL expressions to evaluate agent status based on runtime data such as
metric counts, error rates, and plugin statistics.
[CEL (Common Expression Language)](https://cel.dev) is a lightweight expression
language designed for evaluating simple conditions.

## How status evaluation works

You define CEL expressions for three status levels in the
`[outputs.heartbeat.status]` section of your Telegraf configuration:

- **ok** — The agent is healthy.
- **warn** — The agent has a potential issue.
- **fail** — The agent has a critical problem.

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
```

| Option | Type | Default | Description |
|:-------|:-----|:--------|:------------|
| `ok` | string (CEL) | `"false"` | Expression that, when `true`, sets status to **ok**. |
| `warn` | string (CEL) | `"false"` | Expression that, when `true`, sets status to **warn**. |
| `fail` | string (CEL) | `"false"` | Expression that, when `true`, sets status to **fail**. |
| `order` | list of strings | `["ok", "warn", "fail"]` | Order in which expressions are evaluated. |
| `default` | string | `"ok"` | Status used when no expression evaluates to `true`. Options: `ok`, `warn`, `fail`, `undefined`. |
| `initial` | string | `""` | Status before the first flush. Options: `ok`, `warn`, `fail`, `undefined`, `""` (empty = evaluate expressions). |

{{< children hlevel="h2" >}}
