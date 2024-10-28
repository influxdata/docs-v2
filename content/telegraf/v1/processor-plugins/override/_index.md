---
description: "Telegraf plugin for transforming metrics using Override"
menu:
  telegraf_v1_ref:
    parent: processor_plugins_reference
    name: Override
    identifier: processor-override
tags: [Override, "processor-plugins", "configuration"]
related:
  - /telegraf/v1/configure_plugins/
---

# Override Processor Plugin

The override processor plugin allows overriding all modifications that are
supported by input plugins and aggregators:

* name_override
* name_prefix
* name_suffix
* tags

All metrics passing through this processor will be modified accordingly.  Select
the metrics to modify using the standard metric
filtering options.

Values of *name_override*, *name_prefix*, *name_suffix* and already present
*tags* with conflicting keys will be overwritten. Absent *tags* will be
created.

Use-case of this plugin encompass ensuring certain tags or naming conventions
are adhered to irrespective of input plugin configurations, e.g. by
`taginclude`.

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

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
