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
  - /telegraf/controller/reference/agent-status-eval/, Agent status evaluation reference
  - /telegraf/controller/agents/reporting-rules/
  - /telegraf/v1/output-plugins/heartbeat/, Heartbeat output plugin
---

Agent statuses reflect the health of a Telegraf instance based on runtime data.
The Telegraf [heartbeat output plugin](/telegraf/v1/output-plugins/heartbeat/)
evaluates [Common Expression Language (CEL)](/telegraf/controller/reference/agent-status-eval/)
expressions against agent metrics, error counts, and plugin statistics to
determine the status sent with each heartbeat.


<!-- TODO: Update version to 1.38.2 after it's released -->
> [!Note]
> #### Requires Telegraf v1.38.0+
>
> Agent status evaluation in the Heartbeat output plugins requires Telegraf
> v1.38.0+.

> [!Warning]
> #### Heartbeat output plugin panic in Telegraf v1.38.0
>
> Telegraf v1.38.0 introduced a panic in the Heartbeat output plugin that
> prevents Telegraf from starting when the plugin is enabled. Telegraf v1.38.2
> will include a fix, but in the meantime, to use the Heartbeat output plugin,
> do one of the following:
>
> - Revert back to Telegraf v1.37.x _(Recommended)_
> - Use a Telegraf nightly build
> - Build Telegraf from source

## Status values

{{% product-name %}} displays the following agent statuses:

| Status            | Source               | Description                                                                                                                                                                     |
| :---------------- | :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Ok**            | Heartbeat plugin     | The agent is healthy. Set when the `ok` CEL expression evaluates to `true`.                                                                                                     |
| **Warn**          | Heartbeat plugin     | The agent has a potential issue. Set when the `warn` CEL expression evaluates to `true`.                                                                                        |
| **Fail**          | Heartbeat plugin     | The agent has a critical problem. Set when the `fail` CEL expression evaluates to `true`.                                                                                       |
| **Undefined**     | Heartbeat plugin     | No expression matched and the `default` is set to `undefined`, or the `initial` status is `undefined`.                                                                          |
| **Not Reporting** | {{% product-name %}} | The agent has not sent a heartbeat within the [reporting rule](/telegraf/controller/agents/reporting-rules/) threshold. {{% product-name %}} applies this status automatically. |

## How status evaluation works

You define CEL expressions for `ok`, `warn`, and `fail` in the
`[outputs.heartbeat.status]` section of your heartbeat plugin configuration.
Telegraf evaluates expressions in a configurable order and assigns the status
of the first expression that evaluates to `true`.

For full details on evaluation flow, configuration options, and available
variables and functions, see the
[Agent status evaluation reference](/telegraf/controller/reference/agent-status-eval/).

## Configure agent statuses

To configure status evaluation, add `"status"` to the `include` list in your
heartbeat plugin configuration and define CEL expressions in the
`[outputs.heartbeat.status]` section.

### Example: Basic health check

Report `ok` when metrics are flowing.
If no metrics arrive, fall back to the `fail` status.

```toml { .tc-dynamic-values }
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "&{agent_id}"
  token = "${INFLUX_TOKEN}"
  interval = "1m"
  include = ["hostname", "statistics", "configs", "logs", "status"]

  [outputs.heartbeat.status]
    ok = "metrics > 0"
    default = "fail"
```

### Example: Error-based status

Warn when errors are logged, fail when the error count is high.

```toml { .tc-dynamic-values }
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "&{agent_id}"
  token = "${INFLUX_TOKEN}"
  interval = "1m"
  include = ["hostname", "statistics", "configs", "logs", "status"]

  [outputs.heartbeat.status]
    ok = "log_errors == 0 && log_warnings == 0"
    warn = "log_errors > 0"
    fail = "log_errors > 10"
    order = ["fail", "warn", "ok"]
    default = "ok"
```

### Example: Composite condition

Combine error count and buffer pressure signals.

```toml { .tc-dynamic-values }
[[outputs.heartbeat]]
  url = "http://telegraf_controller.example.com/agents/heartbeat"
  instance_id = "&{agent_id}"
  token = "${INFLUX_TOKEN}"
  interval = "1m"
  include = ["hostname", "statistics", "configs", "logs", "status"]

  [outputs.heartbeat.status]
    ok = "metrics > 0 && log_errors == 0"
    warn = "log_errors > 0 || (has(outputs.influxdb_v2) && outputs.influxdb_v2.exists(o, o.buffer_fullness > 0.8))"
    fail = "log_errors > 5 && has(outputs.influxdb_v2) && outputs.influxdb_v2.exists(o, o.buffer_fullness > 0.9)"
    order = ["fail", "warn", "ok"]
    default = "ok"
```

For more examples including buffer health, plugin-specific checks, and
time-based expressions, see
[CEL expression examples](/telegraf/controller/reference/agent-status-eval/examples/).

## View an agent's status

1.  In {{% product-name %}}, go to **Agents**.
2.  Check the **Status** column for each agent.
3.  To see more details, click the **More button ({{% icon "tc-more" %}})** and
    select **View Details**.
4.  The details page shows the reported status, reporting rule assignment, and
    the time of the last heartbeat.
