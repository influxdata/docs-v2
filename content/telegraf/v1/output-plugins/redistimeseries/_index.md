---
description: "Telegraf plugin for sending metrics to Redis Time Series"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: Redis Time Series
    identifier: output-redistimeseries
tags: [Redis Time Series, "output-plugins", "configuration", "datastore"]
introduced: "v1.0.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.1/plugins/outputs/redistimeseries/README.md, Redis Time Series Plugin Source
---

# Redis Time Series Output Plugin

This plugin writes metrics to a [Redis time-series](https://redis.io/timeseries) server.

**Introduced in:** Telegraf v1.0.0
**Tags:** datastore
**OS support:** all

[redists]: https://redis.io/timeseries

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Secret-store support

This plugin supports secrets from secret-stores for the `username` and
`password` option.
See the [secret-store documentation](/telegraf/v1/configuration/#secret-store-secrets) for more details on how
to use them.

[SECRETSTORE]: ../../../docs/CONFIGURATION.md#secret-store-secrets

## Configuration

```toml @sample.conf
# Publishes metrics to a redis timeseries server
[[outputs.redistimeseries]]
  ## The address of the RedisTimeSeries server.
  address = "127.0.0.1:6379"

  ## Redis ACL credentials
  # username = ""
  # password = ""
  # database = 0

  ## Timeout for operations such as ping or sending metrics
  # timeout = "10s"

  ## Enable attempt to convert string fields to numeric values
  ## If "false" or in case the string value cannot be converted the string
  ## field will be dropped.
  # convert_string_fields = true

  ## Optional TLS Config
  # tls_ca = "/etc/telegraf/ca.pem"
  # tls_cert = "/etc/telegraf/cert.pem"
  # tls_key = "/etc/telegraf/key.pem"
  # insecure_skip_verify = false
```
