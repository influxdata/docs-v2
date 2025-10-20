---
description: "Telegraf plugin for sending metrics to Discard"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: Discard
    identifier: output-discard
tags: [Discard, "output-plugins", "configuration", "testing"]
introduced: "v1.2.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.2/plugins/outputs/discard/README.md, Discard Plugin Source
---

# Discard Output Plugin

This plugin discards all metrics written to it and is meant for testing
purposes.

**Introduced in:** Telegraf v1.2.0
**Tags:** testing
**OS support:** all

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Send metrics to nowhere at all
[[outputs.discard]]
  # no configuration
```
