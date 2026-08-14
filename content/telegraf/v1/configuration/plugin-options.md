---
title: Common Telegraf plugin options
description: >
  Reference for configuration options shared by Telegraf plugins of each
  type: naming instances, per-plugin intervals, measurement renaming, extra
  tags, execution order, and startup error behavior.
menu:
  telegraf_v1:
    name: Common plugin options
    parent: Configure Telegraf
weight: 104
related:
  - /telegraf/v1/configuration/toml/
  - /telegraf/v1/configuration/agent/
  - /telegraf/v1/concepts/data-pipeline/
  - /telegraf/v1/plugins/
---

Each plugin has its own configuration options, documented on the plugin's
page in the [Plugin directory](/telegraf/v1/plugins/).
In addition, Telegraf provides a set of options available to every plugin of
a given type.

Any plugin can be defined multiple times, and each instance runs
independently, so you can run the same plugin with different configurations
in one Telegraf process:

```toml
[[inputs.cpu]]
  percpu = false
  totalcpu = true

[[inputs.cpu]]
  percpu = true
  totalcpu = false
  name_override = "percpu_usage"
```

You can also attach
[metric filters](/telegraf/v1/configuration/#metric-filtering) to any plugin
to control which metrics it handles.

Each option lists its data type and default value.
Duration values are TOML strings, such as `"10s"`.
See [Durations](/telegraf/v1/configuration/toml/#durations).

- [Options for all plugin types](#options-for-all-plugin-types)
  - [alias](#alias)
  - [log_level](#log_level)
- [Renaming and tag options](#renaming-and-tag-options)
  - [name_override](#name_override)
  - [name_prefix](#name_prefix)
  - [name_suffix](#name_suffix)
  - [tags](#tags)
- [Input plugin options](#input-plugin-options)
  - [interval](#interval)
  - [precision](#precision)
  - [time_source](#time_source)
  - [collection_jitter](#collection_jitter)
  - [collection_offset](#collection_offset)
- [Output plugin options](#output-plugin-options)
  - [flush_interval](#flush_interval)
  - [flush_jitter](#flush_jitter)
  - [metric_batch_size](#metric_batch_size)
  - [metric_buffer_limit](#metric_buffer_limit)
- [Processor plugin options](#processor-plugin-options)
  - [order](#order)
- [Aggregator plugin options](#aggregator-plugin-options)
  - [period](#period)
  - [delay](#delay)
  - [grace](#grace)
  - [drop_original](#drop_original)
- [Startup error behavior](#startup-error-behavior)
- [Examples](#examples)

## Options for all plugin types

### alias

Names a plugin instance.
Telegraf uses the alias in log messages, which makes problems easier to trace
when you run multiple instances of the same plugin.

**Type:** string  
**Default:** Not set

### log_level

Overrides the log level for this plugin: `error`, `warn`, `info`, `debug`,
or, for inputs, `trace`.

**Type:** string  
**Default:** Not set; the plugin logs at the agent log level.

## Renaming and tag options

Input, output, and aggregator plugins support the following options for
renaming measurements and adding tags.

### name_override

Replaces the measurement name.
For inputs and aggregators, the default measurement name is the plugin name.
On outputs, renames measurements before writing.

**Type:** string  
**Default:** Not set

### name_prefix

A prefix to attach to the measurement name.

**Type:** string  
**Default:** Not set

### name_suffix

A suffix to attach to the measurement name.

**Type:** string  
**Default:** Not set

### tags

A map of tags to apply to the plugin's metrics.
Supported on input and aggregator plugins.
On aggregators, behavior varies by plugin.

**Type:** table  
**Default:** Not set

## Input plugin options

### interval

How often to gather metrics from this input.

**Type:** duration  
**Default:** The value of the agent
[`interval`](/telegraf/v1/configuration/agent/#interval) setting.

### precision

Rounds collected timestamps to this interval.
On service inputs, setting precision can cause events with the same timestamp
to be merged by the output database.

**Type:** duration  
**Default:** The value of the agent
[`precision`](/telegraf/v1/configuration/agent/#precision) setting.

### time_source

The source of metric timestamps: `metric` (leaves timestamps unchanged),
`collection_start`, or `collection_end`.
Not used by service inputs.

**Type:** string  
**Default:** `"metric"`

### collection_jitter

Jitters collection for this plugin. Must be non-zero to take effect.

**Type:** duration  
**Default:** The value of the agent
[`collection_jitter`](/telegraf/v1/configuration/agent/#collection_jitter)
setting.

### collection_offset

Shifts collection for this plugin. Must be non-zero to take effect.

**Type:** duration  
**Default:** The value of the agent
[`collection_offset`](/telegraf/v1/configuration/agent/#collection_offset)
setting.

## Output plugin options

### flush_interval

The maximum time between flushes for this output.

**Type:** duration  
**Default:** The value of the agent
[`flush_interval`](/telegraf/v1/configuration/agent/#flush_interval) setting.

### flush_jitter

Jitters this output's flush interval. Must be non-zero to take effect.

**Type:** duration  
**Default:** The value of the agent
[`flush_jitter`](/telegraf/v1/configuration/agent/#flush_jitter) setting.

### metric_batch_size

The maximum number of metrics per write for this output.

**Type:** integer  
**Default:** The value of the agent
[`metric_batch_size`](/telegraf/v1/configuration/agent/#metric_batch_size)
setting.

### metric_buffer_limit

The maximum number of unsent metrics to buffer for this output.

**Type:** integer  
**Default:** The value of the agent
[`metric_buffer_limit`](/telegraf/v1/configuration/agent/#metric_buffer_limit)
setting.

## Processor plugin options

### order

The order in which processors run, starting with 1.
Processors without `order` run before those that define it.
If order matters, set `order` on all processors:

```toml
[[processors.rename]]
  order = 1
  [[processors.rename.replace]]
    tag = "path"
    dest = "resource"

[[processors.strings]]
  order = 2
  [[processors.strings.trim_prefix]]
    tag = "resource"
    prefix = "/api/"
```

**Type:** integer  
**Default:** Not set; processors run in the order they appear in the
configuration.

## Aggregator plugin options

### period

The size of the aggregation window.
Metrics with timestamps outside the current period are ignored.

**Type:** duration  
**Default:** `"30s"`

### delay

How long the aggregator waits before flushing, so inputs gathering on the
same interval have time to deliver metrics.

**Type:** duration  
**Default:** `"100ms"`

### grace

How long late metrics are still accepted into the next aggregation period.

**Type:** duration  
**Default:** `"0s"`

### drop_original

If `true`, the aggregator drops the original metrics and emits only the
aggregates.

**Type:** boolean  
**Default:** `false`

## Startup error behavior

Plugins that connect to external services support the
`startup_error_behavior` option, which controls what Telegraf does when the
plugin fails to start:

- **`error`** (default): Telegraf stops and exits.
- **`ignore`**: Telegraf disables the plugin and continues processing all
  other plugins.
- **`retry`**: Telegraf retries starting the plugin on every gather or write
  cycle. The plugin is disabled until startup succeeds.
- **`probe`**: Telegraf probes the plugin's function, if supported, and
  disables the plugin if probing fails.
  If the plugin doesn't support probing, this behaves like `ignore`.

## Examples

Use `name_suffix` to emit `cpu` metrics with the measurement name
`cpu_total`:

```toml
[[inputs.cpu]]
  name_suffix = "_total"
  percpu = false
  totalcpu = true
```

Add tags to an input's metrics with an inline table (which can appear
anywhere in the plugin definition) or a `tags` table (which must come last;
see [Table ordering](/telegraf/v1/configuration/toml/#table-ordering)):

```toml
[[inputs.cpu]]
  tags = {tag1 = "foo", tag2 = "bar"}
  percpu = false
  totalcpu = true
```

Override flush behavior for one output while others use the agent defaults:

```toml
[agent]
  flush_interval = "10s"
  flush_jitter = "5s"
  metric_batch_size = 1000

[[outputs.influxdb_v3]]
  urls = ["http://localhost:8181"]

[[outputs.file]]
  files = ["stdout"]
  flush_interval = "1s"
  metric_batch_size = 10
```
