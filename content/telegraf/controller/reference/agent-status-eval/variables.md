---
title: CEL variables
description: >
  Reference for variables available in CEL expressions used to evaluate
  Telegraf agent status in {{% product-name %}}.
menu:
  telegraf_controller:
    name: Variables
    parent: Agent status evaluation
weight: 201
---

CEL expressions for agent status evaluation have access to variables that
represent data collected by Telegraf since the last successful heartbeat message
(unless noted otherwise).

## Top-level variables

| Variable       | Type | Description                                                                                           |
| :------------- | :--- | :---------------------------------------------------------------------------------------------------- |
| `metrics`      | int  | Number of metrics arriving at the heartbeat output plugin.                                            |
| `log_errors`   | int  | Number of errors logged by the Telegraf instance.                                                     |
| `log_warnings` | int  | Number of warnings logged by the Telegraf instance.                                                   |
| `last_update`  | time | Timestamp of the last successful heartbeat message. Use with `now()` to calculate durations or rates. |
| `agent`        | map  | Agent-level statistics. See [Agent statistics](#agent-statistics).                                    |
| `inputs`       | map  | Input plugin statistics. See [Input plugin statistics](#input-plugin-statistics-inputs).              |
| `outputs`      | map  | Output plugin statistics. See [Output plugin statistics](#output-plugin-statistics-outputs).          |

## Agent statistics

The `agent` variable is a map containing aggregate statistics for the entire
Telegraf instance.
These fields correspond to the `internal_agent` metric from the
Telegraf [internal input plugin](/telegraf/v1/plugins/#input-internal).

| Field                    | Type | Description                                         |
| :----------------------- | :--- | :-------------------------------------------------- |
| `agent.metrics_written`  | int  | Total metrics written by all output plugins.        |
| `agent.metrics_rejected` | int  | Total metrics rejected by all output plugins.       |
| `agent.metrics_dropped`  | int  | Total metrics dropped by all output plugins.        |
| `agent.metrics_gathered` | int  | Total metrics collected by all input plugins.       |
| `agent.gather_errors`    | int  | Total collection errors across all input plugins.   |
| `agent.gather_timeouts`  | int  | Total collection timeouts across all input plugins. |

### Example

```js
agent.gather_errors > 0
```

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

```js
// Check if any cpu input instance has errors
inputs.cpu.exists(i, i.errors > 0)
```

```js
// Access the first instance of the cpu input
inputs.cpu[0].metrics_gathered
```

Use `has()` to safely check if a plugin type exists before accessing it:

```js
// Safe access — returns false if no cpu input is configured
has(inputs.cpu) && inputs.cpu.exists(i, i.errors > 0)
```

## Output plugin statistics (`outputs`)

The `outputs` variable is a map with the same structure as `inputs`.
Each key is a plugin type (for example, `influxdb_v3` for `outputs.influxdb_v3`)
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

```js
// Access the first instance of the InfluxDB v3 output plugin
outputs.influxdb_v3[0].metrics_written
```

```js
// Check if any InfluxDB v3 output has write errors
outputs.influxdb_v3.exists(o, o.errors > 0)
```

```js
// Check buffer fullness across all instances of an output
outputs.influxdb_v3.exists(o, o.buffer_fullness > 0.8)
```

Use `has()` to safely check if a plugin type exists before accessing it:

```js
// Safe access — returns false if no cpu input is configured
has(outputs.influxdb_v3) && outputs.influxdb_v3.exists(o, o.errors > 0)
```

## Accumulation behavior

Unless noted otherwise, all variable values are **accumulated since the last
successful heartbeat message**.
Use the `last_update` variable with `now()` to calculate rates — for example:

```js
// True if the error rate exceeds 1 error per minute
log_errors > 0 && duration.getMinutes(now() - last_update) > 0
  && log_errors / duration.getMinutes(now() - last_update) > 1
```
