---
description: "Telegraf plugin for sending metrics to STOMP Producer"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: STOMP Producer
    identifier: output-stomp
tags: [STOMP Producer, "output-plugins", "configuration"]
related:
  - /telegraf/v1/configure_plugins/
---

# STOMP Producer Output Plugin

This plugin writes to a [Active MQ Broker](http://activemq.apache.org/)
for STOMP <http://stomp.github.io>.

It also support Amazon MQ  <https://aws.amazon.com/amazon-mq/>

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Secret-store support

This plugin supports secrets from secret-stores for the `username` and
`password` option.
See the [secret-store documentation](/telegraf/v1/configuration/#secret-store-secrets) for more details on how
to use them.

[SECRETSTORE]: ../../../docs/CONFIGURATION.md#secret-store-secrets

## Configuration

```toml @sample.conf
# Configuration for active mq with stomp protocol to send metrics to
[[outputs.stomp]]
  host = "localhost:61613"

  ## Queue name for producer messages
  queueName = "telegraf"

  ## Username and password if required by the Active MQ server.
  # username = ""
  # password = ""

  ## Optional TLS Config
  # tls_ca = "/etc/telegraf/ca.pem"
  # tls_cert = "/etc/telegraf/cert.pem"
  # tls_key = "/etc/telegraf/key.pem"

  ## Data format to output.
  data_format = "json"
```
