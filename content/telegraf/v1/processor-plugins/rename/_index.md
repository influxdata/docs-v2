---
description: "Telegraf plugin for transforming metrics using Rename"
menu:
  telegraf_v1_ref:
    parent: processor_plugins_reference
    name: Rename
    identifier: processor-rename
tags: [Rename, "processor-plugins", "configuration", "transformation"]
introduced: "v1.8.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.3/plugins/processors/rename/README.md, Rename Plugin Source
---

# Rename Processor Plugin

This plugin allows to rename measurements, fields and tags.

**Introduced in:** Telegraf v1.8.0
**Tags:** transformation
**OS support:** all

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Rename measurements, tags, and fields that pass through this filter.
[[processors.rename]]
  ## Specify one sub-table per rename operation.
  [[processors.rename.replace]]
    measurement = "network_interface_throughput"
    dest = "throughput"

  [[processors.rename.replace]]
    tag = "hostname"
    dest = "host"

  [[processors.rename.replace]]
    field = "lower"
    dest = "min"

  [[processors.rename.replace]]
    field = "upper"
    dest = "max"
```

## Example

```diff
- network_interface_throughput,hostname=backend.example.com lower=10i,upper=1000i,mean=500i 1502489900000000000
+ throughput,host=backend.example.com min=10i,max=1000i,mean=500i 1502489900000000000
```
