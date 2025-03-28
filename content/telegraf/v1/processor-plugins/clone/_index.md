---
description: "Telegraf plugin for transforming metrics using Clone"
menu:
  telegraf_v1_ref:
    parent: processor_plugins_reference
    name: Clone
    identifier: processor-clone
tags: [Clone, "processor-plugins", "configuration"]
related:
  - /telegraf/v1/configure_plugins/
---

# Clone Processor Plugin

The clone processor plugin create a copy of each metric passing through it,
preserving untouched the original metric and allowing modifications in the
copied one.

The modifications allowed are the ones supported by input plugins and
aggregators:

* name_override
* name_prefix
* name_suffix
* tags

Select the metrics to modify using the standard metric
filtering.

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
