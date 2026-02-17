---
description: "Telegraf plugin for transforming metrics using Override"
menu:
  telegraf_v1_ref:
    parent: processor_plugins_reference
    name: Override
    identifier: processor-override
tags: [Override, "processor-plugins", "configuration", "transformation"]
introduced: "v1.6.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.2/plugins/processors/override/README.md, Override Plugin Source
---

# Override Processor Plugin

This plugin allows to modify metrics using [metric modifiers](/telegraf/v1/configuration/#modifiers).
Use-cases of this plugin encompass ensuring certain tags or naming conventions
are adhered to irrespective of input plugin configurations, e.g. by
`taginclude`.

> [!NOTE]
> [Metric filtering](/telegraf/v1/configuration/#metric-filtering) options apply to both the clone and the
> original metric.

**Introduced in:** Telegraf v1.6.0
**Tags:** transformation
**OS support:** all

[modifiers]: /docs/CONFIGURATION.md#modifiers
[filtering]: /docs/CONFIGURATION.md#metric-filtering

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Apply metric modifications using override semantics.
[[processors.override]]
  ## All modifications on inputs and aggregators can be overridden:
  # name_override = "new_name"
  # name_prefix = "new_name_prefix"
  # name_suffix = "new_name_suffix"

  ## Tags to be added (all values must be strings)
  # [processors.override.tags]
  #   additional_tag = "tag_value"
```
