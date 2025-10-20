---
description: "Telegraf plugin for transforming metrics using Pivot"
menu:
  telegraf_v1_ref:
    parent: processor_plugins_reference
    name: Pivot
    identifier: processor-pivot
tags: [Pivot, "processor-plugins", "configuration", "transformation"]
introduced: "v1.12.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.2/plugins/processors/pivot/README.md, Pivot Plugin Source
---

# Pivot Processor Plugin

This plugin rotates single-valued metrics into a multi-field metric. The result
is a more compact representation for applying mathematical operators to or do
comparisons between metrics or flatten fields.

> [!TIP]
> To perform the reverse operation use the [unpivot](/telegraf/v1/plugins/#processor-unpivot) processor.

**Introduced in:** Telegraf v1.12.0
**Tags:** transformation
**OS support:** all

[unpivot]: /plugins/processors/unpivot/README.md

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Rotate a single valued metric into a multi field metric
[[processors.pivot]]
  ## Tag to use for naming the new field.
  tag_key = "name"
  ## Field to use as the value of the new field.
  value_key = "value"
```

## Example

```diff
- cpu,cpu=cpu0,name=time_idle value=42i
- cpu,cpu=cpu0,name=time_user value=43i
+ cpu,cpu=cpu0 time_idle=42i
+ cpu,cpu=cpu0 time_user=43i
```
