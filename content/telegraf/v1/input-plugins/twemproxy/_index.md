---
description: "Telegraf plugin for collecting metrics from Twemproxy"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Twemproxy
    identifier: input-twemproxy
tags: [Twemproxy, "input-plugins", "configuration"]
related:
  - /telegraf/v1/configure_plugins/
---

# Twemproxy Input Plugin

The `twemproxy` plugin gathers statistics from
[Twemproxy](https://github.com/twitter/twemproxy) servers.

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Read Twemproxy stats data
[[inputs.twemproxy]]
  ## Twemproxy stats address and port (no scheme)
  addr = "localhost:22222"
  ## Monitor pool name
  pools = ["redis_pool", "mc_pool"]
```

## Metrics

## Example Output
