---
description: "Telegraf plugin for sending metrics to Librato"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: Librato
    identifier: output-librato
tags: [Librato, "output-plugins", "configuration"]
related:
  - /telegraf/v1/configure_plugins/
---

# Librato Output Plugin

This plugin writes to the [Librato Metrics API](http://dev.librato.com/v1/metrics#metrics) and requires an
`api_user` and `api_token` which can be obtained [here](https://metrics.librato.com/account/api_tokens) for the account.

The `source_tag` option in the Configuration file is used to send contextual
information from Point Tags to the API.

If the point value being sent cannot be converted to a float64, the metric is
skipped.

Currently, the plugin does not send any associated Point Tags.

[metrics-api]: http://dev.librato.com/v1/metrics#metrics

[tokens]: https://metrics.librato.com/account/api_tokens

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Secret-store support

This plugin supports secrets from secret-stores for the `api_user` and
`api_token` option.
See the [secret-store documentation](/telegraf/v1/configuration/#secret-store-secrets) for more details on how
to use them.

[SECRETSTORE]: ../../../docs/CONFIGURATION.md#secret-store-secrets

## Configuration

```toml @sample.conf
# Configuration for Librato API to send metrics to.
[[outputs.librato]]
  ## Librato API Docs
  ## http://dev.librato.com/v1/metrics-authentication
  ## Librato API user
  api_user = "telegraf@influxdb.com" # required.
  ## Librato API token
  api_token = "my-secret-token" # required.
  ## Debug
  # debug = false
  ## Connection timeout.
  # timeout = "5s"
  ## Output source Template (same as graphite buckets)
  ## see https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md#graphite
  ## This template is used in librato's source (not metric's name)
  template = "host"
```
