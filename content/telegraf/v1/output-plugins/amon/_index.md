---
description: "Telegraf plugin for sending metrics to Amon"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: Amon
    identifier: output-amon
tags: [Amon, "output-plugins", "configuration", "datastore"]
introduced: "v0.2.1"
deprecated: v1.37.0
removal: v1.40.0
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.3/plugins/outputs/amon/README.md, Amon Plugin Source
---

# Amon Output Plugin

This plugin writes metrics to [Amon monitoring platform](https://www.amon.cx). It requires a
`serverkey` and `amoninstance` URL which can be obtained from the
[website](https://www.amon.cx/docs/monitoring/) for your account.

> [!IMPORTANT]
> If point values being sent cannot be converted to a `float64`, the metric is
> skipped.

**Introduced in:** Telegraf v0.2.1
**Deprecated in:** Telegraf v1.37.0
**Removal in:** Telegraf v1.40.0
**Tags:** datastore
**OS support:** all

[amon]: https://www.amon.cx
[amon_monitoring]:https://www.amon.cx/docs/monitoring/

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

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
