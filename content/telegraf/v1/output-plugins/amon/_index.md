---
description: "Telegraf plugin for sending metrics to Amon"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: Amon
    identifier: output-amon
tags: [Amon, "output-plugins", "configuration", "datastore"]
introduced: "v0.2.1"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.4/plugins/outputs/amon/README.md, Amon Plugin Source
---

# Amon Output Plugin

This plugin writes metrics to [Amon monitoring platform](https://www.amon.cx). It requires a
`serverkey` and `amoninstance` URL which can be obtained from the
[website](https://www.amon.cx/docs/monitoring/) for your account.

> [!IMPORTANT]
> If point values being sent cannot be converted to a `float64`, the metric is
> skipped.

**Introduced in:** Telegraf v0.2.1
**Tags:** datastore
**OS support:** all

[amon]: https://www.amon.cx
[amon_monitoring]:https://www.amon.cx/docs/monitoring/

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Configuration for Amon Server to send metrics to.
[[outputs.amon]]
  ## Amon Server Key
  server_key = "my-server-key" # required.

  ## Amon Instance URL
  amon_instance = "https://youramoninstance" # required

  ## Connection timeout.
  # timeout = "5s"
```

## Conversions

Metrics are grouped by converting any `_` characters to `.` in the point name
