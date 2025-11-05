---
description: "Telegraf plugin for collecting metrics from Counter-Strike Global Offensive (CSGO)"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Counter-Strike Global Offensive (CSGO)
    identifier: input-csgo
tags: [Counter-Strike Global Offensive (CSGO), "input-plugins", "configuration", "server"]
introduced: "v1.18.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.3/plugins/inputs/csgo/README.md, Counter-Strike Global Offensive (CSGO) Plugin Source
---

# Counter-Strike: Global Offensive (CSGO) Input Plugin

This plugin gather metrics from [Counter-Strike: Global Offensive](https://www.counter-strike.net/)
servers.

**Introduced in:** Telegraf v1.18.0
**Tags:** server
**OS support:** all

[csgo]: https://www.counter-strike.net/

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Fetch metrics from a CSGO SRCDS
[[inputs.csgo]]
  ## Specify servers using the following format:
  ##    servers = [
  ##      ["ip1:port1", "rcon_password1"],
  ##      ["ip2:port2", "rcon_password2"],
  ##    ]
  #
  ## If no servers are specified, no data will be collected
  servers = []
```

## Metrics

The plugin retrieves the output of the `stats` command that is executed via
rcon.

If no servers are specified, no data will be collected

- csgo
  - tags:
    - host
  - fields:
    - cpu (float)
    - net_in (float)
    - net_out (float)
    - uptime_minutes (float)
    - maps (float)
    - fps (float)
    - players (float)
    - sv_ms (float)
    - variance_ms (float)
    - tick_ms (float)

## Example Output
