---
description: "Telegraf plugin for transforming metrics using Round"
menu:
  telegraf_v1_ref:
    parent: processor_plugins_reference
    name: Round
    identifier: processor-round
tags: [Round, "processor-plugins", "configuration", "transformation"]
introduced: "v1.36.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.2/plugins/processors/round/README.md, Round Plugin Source
---

# Round Processor Plugin

This plugin allows to round numerical field values to the configured precision.
This is particularly useful in combination with the [dedup processor](/telegraf/v1/plugins/#processor-dedup)
to reduce the number of metrics sent to the output if only a lower precision
is required for the values.

**Introduced in:** Telegraf v1.36.0
**Tags:** transformation
**OS support:** all

[dedup]: /plugins/processors/dedup/README.md

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Round numerical fields
[[processors.round]]
  ## Precision to round to.
  ## A positive number indicates rounding to the right of the decimal separator (i.e. the fractional part).
  ## A negative number indicates rounding to the left of the decimal separator.
  # precision = 0

  ## Round only numeric fields matching the filter criteria below.
  ## Excludes takes precedence over includes.
  # include_fields = ["*"]
  # exclude_fields = []
```

## Example

Round each value the _inputs.cpu_ plugin generates, except for the
`usage_steal`, `usage_user`, `uptime_format`, `usage_idle` field:

```toml
[[inputs.cpu]]
  percpu = true
  totalcpu = true
  collect_cpu_time = false
  report_active = false

[[processors.round]]
  precision = 1
  include_fields = []
  exclude_fields = ["usage_steal", "usage_user", "uptime_format", "usage_idle" ]
```

Result of rounding the _cpu_ metric:

```diff
- cpu map[cpu:cpu11 host:98d5b8dbad1c] map[usage_guest:0 usage_guest_nice:0 usage_idle:94.3999999994412 usage_iowait:0 usage_irq:0.1999999999998181 usage_nice:0 usage_softirq:0.20000000000209184 usage_steal:0 usage_system:1.2000000000080036 usage_user:4.000000000014552]
+ cpu map[cpu:cpu11 host:98d5b8dbad1c] map[usage_guest:0 usage_guest_nice:0 usage_idle:94.4 usage_iowait:0 usage_irq:0.2 usage_nice:0 usage_softirq:0.2 usage_steal:0 usage_system:1.2 usage_user:4.0]
```
