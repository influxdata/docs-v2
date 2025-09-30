---
description: "Telegraf plugin for collecting metrics from Tacacs"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Tacacs
    identifier: input-tacacs
tags: [Tacacs, "input-plugins", "configuration", "network"]
introduced: "v1.28.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.2/plugins/inputs/tacacs/README.md, Tacacs Plugin Source
---

# Tacacs Input Plugin

This plugin collects metrics on
[Terminal Access Controller Access Control System](https://datatracker.ietf.org/doc/html/rfc1492) authentication
requests like response status and response time from servers such as
[Aruba ClearPass](https://www.hpe.com/de/de/aruba-clearpass-policy-manager.html), [FreeRADIUS](https://www.freeradius.org/) or
[TACACS+](https://datatracker.ietf.org/doc/html/rfc8907).

The plugin is primarily meant to monitor how long it takes for the server to
fully handle an authentication request, including all potential dependent calls
(for example to AD servers, or other sources of truth).

**Introduced in:** Telegraf v1.28.0
**Tags:** network
**OS support:** all

[tacacs]: https://datatracker.ietf.org/doc/html/rfc1492
[aruba_clearpass]: https://www.hpe.com/de/de/aruba-clearpass-policy-manager.html
[freeradius]: https://www.freeradius.org/
[tacacs_plus]: https://datatracker.ietf.org/doc/html/rfc8907

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
# Tacacs plugin collects successful tacacs authentication response times.
[[inputs.tacacs]]
  ## An array of Server IPs (or hostnames) and ports to gather from. If none specified, defaults to localhost.
  # servers = ["127.0.0.1:49"]

  ## Request source server IP, normally the server running telegraf.
  # request_ip = "127.0.0.1"

  ## Credentials for tacacs authentication.
  username = "myuser"
  password = "mypassword"
  secret = "mysecret"

  ## Maximum time to receive response.
  # response_timeout = "5s"
```

## Metrics

- tacacs
  - tags:
    - source
  - fields:
    - response_status (string, see below
    - responsetime_ms (int64 see below    | tacacs server | real value
| Timeout              | Timeout      | telegraf      | eq. to response_timeout

### field `responsetime_ms`

The field responsetime_ms is response time of the tacacs server
in milliseconds of the furthest achieved stage of auth.
In case of timeout, its filled by telegraf to be the value of
the configured response_timeout.

## Example Output

```text
tacacs,source=127.0.0.1:49 responsetime_ms=311i,response_status="AuthenStatusPass" 1677526200000000000
```
