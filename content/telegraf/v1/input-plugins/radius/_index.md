---
description: "Telegraf plugin for collecting metrics from Radius"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Radius
    identifier: input-radius
tags: [Radius, "input-plugins", "configuration", "server"]
introduced: "v1.26.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.3/plugins/inputs/radius/README.md, Radius Plugin Source
---

# Radius Input Plugin

This plugin collects response times for [Radius](https://datatracker.ietf.org/doc/html/rfc2865) authentication
requests.

**Introduced in:** Telegraf v1.26.0
**Tags:** server
**OS support:** all

[rfc2865]: https://datatracker.ietf.org/doc/html/rfc2865

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Secret-store support

This plugin supports secrets from secret-stores for the `username`, `password`
and `secret` option. See the
[secret-store documentation](/telegraf/v1/configuration/#secret-store-secrets) for more details on how to use them.

[SECRETSTORE]: ../../../docs/CONFIGURATION.md#secret-store-secrets

## Configuration

```toml @sample.conf
[[inputs.radius]]
  ## An array of Server IPs and ports to gather from. If none specified, defaults to localhost.
  servers = ["127.0.0.1:1812","hostname.domain.com:1812"]

  ## Credentials for radius authentication.
  username = "myuser"
  password = "mypassword"
  secret = "mysecret"

  ## Request source server IP, normally the server running telegraf.
  ## This corresponds to Radius' NAS-IP-Address.
  # request_ip = "127.0.0.1"

  ## Maximum time to receive response.
  # response_timeout = "5s"
```

## Metrics

- radius
  - tags:
    - response_code
    - source
    - source_port
  - fields:
    - responsetime_ms (int64)

## Example Output

```text
radius,response_code=Access-Accept,source=hostname.com,source_port=1812 responsetime_ms=311i 1677526200000000000
```
