---
description: "Telegraf plugin for sending metrics to ActiveMQ STOMP"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: ActiveMQ STOMP
    identifier: output-stomp
tags: [ActiveMQ STOMP, "output-plugins", "configuration", "messaging"]
introduced: "v1.24.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.1/plugins/outputs/stomp/README.md, ActiveMQ STOMP Plugin Source
---

# ActiveMQ STOMP Output Plugin

This plugin writes metrics to an [Active MQ Broker](http://activemq.apache.org/) for [STOMP](https://stomp.github.io)
but also supports [Amazon MQ](https://aws.amazon.com/amazon-mq) brokers. Metrics can be written in one
of the supported [data formats](/telegraf/v1/data_formats/output).

**Introduced in:** Telegraf v1.24.0
**Tags:** messaging
**OS support:** all

[activemq]: http://activemq.apache.org/
[stomp]: https://stomp.github.io
[amazonmq]:https://aws.amazon.com/amazon-mq
[data_formats]: /docs/DATA_FORMATS_OUTPUT.md

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
