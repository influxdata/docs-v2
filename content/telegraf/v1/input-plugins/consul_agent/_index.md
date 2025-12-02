---
description: "Telegraf plugin for collecting metrics from Hashicorp Consul Agent"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Hashicorp Consul Agent
    identifier: input-consul_agent
tags: [Hashicorp Consul Agent, "input-plugins", "configuration", "server"]
introduced: "v1.22.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.4/plugins/inputs/consul_agent/README.md, Hashicorp Consul Agent Plugin Source
---

# Hashicorp Consul Agent Input Plugin

This plugin collects metrics from a [Consul agent](https://developer.hashicorp.com/consul/commands/agent). Telegraf may be
present in every node and connect to the agent locally. Tested on Consul v1.10.

**Introduced in:** Telegraf v1.22.0
**Tags:** server
**OS support:** all

[agent]: https://developer.hashicorp.com/consul/commands/agent

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Read metrics from the Consul Agent API
[[inputs.consul_agent]]
  ## URL for the Consul agent
  # url = "http://127.0.0.1:8500"

  ## Use auth token for authorization.
  ## If both are set, an error is thrown.
  ## If both are empty, no token will be used.
  # token_file = "/path/to/auth/token"
  ## OR
  # token = "a1234567-40c7-9048-7bae-378687048181"

  ## Set timeout (default 5 seconds)
  # timeout = "5s"

  ## Optional TLS Config
  # tls_ca = /path/to/cafile
  # tls_cert = /path/to/certfile
  # tls_key = /path/to/keyfile
```

## Metrics

Consul collects various metrics. For every details, please have a look at
[Consul's documentation](https://www.consul.io/api/agent#view-metrics).

## Example Output
