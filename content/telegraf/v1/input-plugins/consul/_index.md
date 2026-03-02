---
description: "Telegraf plugin for collecting metrics from Hashicorp Consul"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Hashicorp Consul
    identifier: input-consul
tags: [Hashicorp Consul, "input-plugins", "configuration", "server"]
introduced: "v1.0.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.3/plugins/inputs/consul/README.md, Hashicorp Consul Plugin Source
---

# Hashicorp Consul Input Plugin

This plugin will collect statistics about all health checks registered in
[Consul](https://www.consul.io) using the [Consul API](https://www.consul.io/docs/agent/http/health.html#health_state). The plugin will not report any
[telemetry metrics](https://www.consul.io/docs/agent/telemetry.html) but Consul can report those statistics using
the StatsD protocol if needed.

**Introduced in:** Telegraf v1.0.0
**Tags:** server
**OS support:** all

[api]: https://www.consul.io/docs/agent/http/health.html#health_state
[telemetry]: https://www.consul.io/docs/agent/telemetry.html
[consul]: https://www.consul.io

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Gather health check statuses from services registered in Consul
[[inputs.consul]]
  ## Consul server address
  # address = "localhost:8500"

  ## URI scheme for the Consul server, one of "http", "https"
  # scheme = "http"

  ## Metric version controls the mapping from Consul metrics into
  ## Telegraf metrics. Version 2 moved all fields with string values
  ## to tags.
  ##
  ##   example: metric_version = 1; deprecated in 1.16
  ##            metric_version = 2; recommended version
  # metric_version = 1

  ## ACL token used in every request
  # token = ""

  ## HTTP Basic Authentication username and password.
  # username = ""
  # password = ""

  ## Data center to query the health checks from
  # datacenter = ""

  ## Optional TLS Config
  # tls_ca = "/etc/telegraf/ca.pem"
  # tls_cert = "/etc/telegraf/cert.pem"
  # tls_key = "/etc/telegraf/key.pem"
  ## Use TLS but skip chain & host verification
  # insecure_skip_verify = true

  ## Consul checks' tag splitting
  # When tags are formatted like "key:value" with ":" as a delimiter then
  # they will be split and reported as proper key:value in Telegraf
  # tag_delimiter = ":"
```

## Metrics

### metric_version = 1

- consul_health_checks
  - tags:
    - node (node that check/service is registered on)
    - service_name
    - check_id
  - fields:
    - check_name
    - service_id
    - status
    - passing (integer)
    - critical (integer)
    - warning (integer)

### metric_version = 2

- consul_health_checks
  - tags:
    - node (node that check/service is registered on)
    - service_name
    - check_id
    - check_name
    - service_id
    - status
  - fields:
    - passing (integer)
    - critical (integer)
    - warning (integer)

`passing`, `critical`, and `warning` are integer representations of the health
check state. A value of `1` represents that the status was the state of the
health check at this sample. `status` is string representation of the same
state.

## Example Output

```text
consul_health_checks,host=wolfpit,node=consul-server-node,check_id="serfHealth" check_name="Serf Health Status",service_id="",status="passing",passing=1i,critical=0i,warning=0i 1464698464486439902
consul_health_checks,host=wolfpit,node=consul-server-node,service_name=www.example.com,check_id="service:www-example-com.test01" check_name="Service 'www.example.com' check",service_id="www-example-com.test01",status="critical",passing=0i,critical=1i,warning=0i 1464698464486519036
```
