---
description: "Telegraf plugin for sending metrics to Warp10"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: Warp10
    identifier: output-warp10
tags: [Warp10, "output-plugins", "configuration", "cloud", "datastore"]
introduced: "v1.14.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.0/plugins/outputs/warp10/README.md, Warp10 Plugin Source
---

# Warp10 Output Plugin

This plugin writes metrics to the [Warp 10](https://www.warp10.io) service.

**Introduced in:** Telegraf v1.14.0
**Tags:** cloud, datastore
**OS support:** all

[warp10]: https://www.warp10.io

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Secret-store support

This plugin supports secrets from secret-stores for the `token` option.
See the [secret-store documentation](/telegraf/v1/configuration/#secret-store-secrets) for more details on how
to use them.

[SECRETSTORE]: ../../../docs/CONFIGURATION.md#secret-store-secrets

## Configuration

```toml @sample.conf
# Write metrics to Warp 10
[[outputs.warp10]]
  # Prefix to add to the measurement.
  prefix = "telegraf."

  # URL of the Warp 10 server
  warp_url = "http://localhost:8080"

  # Write token to access your app on warp 10
  token = "Token"

  # Warp 10 query timeout
  # timeout = "15s"

  ## Print Warp 10 error body
  # print_error_body = false

  ## Max string error size
  # max_string_error_size = 511

  ## Optional TLS Config
  # tls_ca = "/etc/telegraf/ca.pem"
  # tls_cert = "/etc/telegraf/cert.pem"
  # tls_key = "/etc/telegraf/key.pem"
  ## Use TLS but skip chain & host verification
  # insecure_skip_verify = false
```

## Output Format

Metrics are converted and sent using the [Geo Time Series](https://www.warp10.io/content/03_Documentation/03_Interacting_with_Warp_10/03_Ingesting_data/02_GTS_input_format) (GTS) input format.

The class name of the reading is produced by combining the value of the
`prefix` option, the measurement name, and the field key.  A dot (`.`)
character is used as the joining character.

The GTS form provides support for the Telegraf integer, float, boolean, and
string types directly.  Unsigned integer fields will be capped to the largest
64-bit integer (2^63-1) in case of overflow.

Timestamps are sent in microsecond precision.

[Geo Time Series]: https://www.warp10.io/content/03_Documentation/03_Interacting_with_Warp_10/03_Ingesting_data/02_GTS_input_format
