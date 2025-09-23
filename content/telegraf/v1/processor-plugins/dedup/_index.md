---
description: "Telegraf plugin for transforming metrics using Dedup"
menu:
  telegraf_v1_ref:
    parent: processor_plugins_reference
    name: Dedup
    identifier: processor-dedup
tags: [Dedup, "processor-plugins", "configuration", "filtering"]
introduced: "v1.14.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.1/plugins/processors/dedup/README.md, Dedup Plugin Source
---

# Dedup Processor Plugin

This plugin filters metrics whose field values are exact repetitions of the
previous values. This plugin will store its state between runs if the
`statefile` option in the agent config section is set.

**Introduced in:** Telegraf v1.14.0
**Tags:** filtering
**OS support:** all

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Filter metrics with repeating field values
[[processors.dedup]]
  ## Maximum time to suppress output
  dedup_interval = "600s"
```

## Example

```diff
- cpu,cpu=cpu0 time_idle=42i,time_guest=1i
- cpu,cpu=cpu0 time_idle=42i,time_guest=2i
- cpu,cpu=cpu0 time_idle=42i,time_guest=2i
- cpu,cpu=cpu0 time_idle=44i,time_guest=2i
- cpu,cpu=cpu0 time_idle=44i,time_guest=2i
+ cpu,cpu=cpu0 time_idle=42i,time_guest=1i
+ cpu,cpu=cpu0 time_idle=42i,time_guest=2i
+ cpu,cpu=cpu0 time_idle=44i,time_guest=2i
```
