---
description: "Telegraf plugin for transforming metrics using Clone"
menu:
  telegraf_v1_ref:
    parent: processor_plugins_reference
    name: Clone
    identifier: processor-clone
tags: [Clone, "processor-plugins", "configuration", "transformation"]
introduced: "v1.13.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.4/plugins/processors/clone/README.md, Clone Plugin Source
---

# Clone Processor Plugin

This plugin creates a copy of each metric passing through it, preserving the
original metric and allowing modifications such as [metric modifiers](/telegraf/v1/configuration/#modifiers)
in the copied metric.

> [!NOTE]
> [Metric filtering](/telegraf/v1/configuration/#metric-filtering) options apply to both the clone and the
> original metric.

**Introduced in:** Telegraf v1.13.0
**Tags:** transformation
**OS support:** all

[modifiers]: /docs/CONFIGURATION.md#modifiers
[filtering]: /docs/CONFIGURATION.md#metric-filtering

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Apply metric modifications using override semantics.
[[processors.clone]]
  ## All modifications on inputs and aggregators can be overridden:
  # name_override = "new_name"
  # name_prefix = "new_name_prefix"
  # name_suffix = "new_name_suffix"

  ## Tags to be added (all values must be strings)
  # [processors.clone.tags]
  #   additional_tag = "tag_value"
```
