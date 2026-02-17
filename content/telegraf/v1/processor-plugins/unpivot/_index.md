---
description: "Telegraf plugin for transforming metrics using Unpivot"
menu:
  telegraf_v1_ref:
    parent: processor_plugins_reference
    name: Unpivot
    identifier: processor-unpivot
tags: [Unpivot, "processor-plugins", "configuration", "transformation"]
introduced: "v1.12.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.2/plugins/processors/unpivot/README.md, Unpivot Plugin Source
---

# Unpivot Processor Plugin

This plugin allows to rotate a multi-field series into single-valued metrics.
The resulting metrics allow to more easily aggregate data across fields.

> [!TIP]
> To perform the reverse operation use the [pivot](/telegraf/v1/plugins/#processor-pivot) processor.

**Introduced in:** Telegraf v1.12.0
**Tags:** transformation
**OS support:** all

[pivot]: /plugins/processors/pivot/README.md

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Rotate multi field metric into several single field metrics
[[processors.unpivot]]
  ## Metric mode to pivot to
  ## Set to "tag", metrics are pivoted as a tag and the metric is kept as
  ## the original measurement name. Tag key name is set by tag_key value.
  ## Set to "metric" creates a new metric named the field name. With this
  ## option the tag_key is ignored. Be aware that this could lead to metric
  ## name conflicts!
  # use_fieldname_as = "tag"

  ## Tag to use for the name.
  # tag_key = "name"

  ## Field to use for the name of the value.
  # value_key = "value"
```

## Example

Metric mode `tag`:

```diff
- cpu,cpu=cpu0 time_idle=42i,time_user=43i
+ cpu,cpu=cpu0,name=time_idle value=42i
+ cpu,cpu=cpu0,name=time_user value=43i
```

Metric mode `metric`:

```diff
- cpu,cpu=cpu0 time_idle=42i,time_user=43i
+ time_idle,cpu=cpu0 value=42i
+ time_user,cpu=cpu0 value=43i
```
