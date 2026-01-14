---
description: "Telegraf plugin for collecting metrics from Riemann Listener"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Riemann Listener
    identifier: input-riemann_listener
tags: [Riemann Listener, "input-plugins", "configuration", "datastore"]
introduced: "v1.17.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.1/plugins/inputs/riemann_listener/README.md, Riemann Listener Plugin Source
---

# Riemann Listener Input Plugin

This service plugin listens for messages from [Riemann](https://riemann.io/) clients using
the protocol buffer format.

**Introduced in:** Telegraf v1.17.0
**Tags:** datastore
**OS support:** all

[riemann]: https://riemann.io/

## Service Input <!-- @/docs/includes/service_input.md -->

This plugin is a service input. Normal plugins gather metrics determined by the
interval setting. Service plugins start a service to listen and wait for
metrics or events to occur. Service plugins have two key differences from
normal plugins:

1. The global or plugin specific `interval` setting may not apply
2. The CLI options of `--test`, `--test-wait`, and `--once` may not produce
   output for this plugin

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Riemann protobuff listener
[[inputs.riemann_listener]]
  ## URL to listen on
  ## Default is "tcp://:5555"
  #  service_address = "tcp://:8094"
  #  service_address = "tcp://127.0.0.1:http"
  #  service_address = "tcp4://:8094"
  #  service_address = "tcp6://:8094"
  #  service_address = "tcp6://[2001:db8::1]:8094"

  ## Maximum number of concurrent connections.
  ## 0 (default) is unlimited.
  #  max_connections = 1024
  ## Read timeout.
  ## 0 (default) is unlimited.
  #  read_timeout = "30s"
  ## Optional TLS configuration.
  #  tls_cert = "/etc/telegraf/cert.pem"
  #  tls_key  = "/etc/telegraf/key.pem"
  ## Enables client authentication if set.
  #  tls_allowed_cacerts = ["/etc/telegraf/clientca.pem"]
  ## Maximum socket buffer size (in bytes when no unit specified).
  #  read_buffer_size = "64KiB"
  ## Period between keep alive probes.
  ## 0 disables keep alive probes.
  ## Defaults to the OS configuration.
  #  keep_alive_period = "5m"
```

Just like Riemann the default port is 5555. This can be configured, refer
configuration above.

Riemann `Service` is mapped as `measurement`. `metric` and `TTL` are converted
into field values.  As Riemann tags as simply an array, they are converted into
the `influx_line` format key-value, where both key and value are the tags.

## Metrics

## Example Output
