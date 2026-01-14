---
description: "Telegraf plugin for collecting metrics from NATS Consumer"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: NATS Consumer
    identifier: input-nats_consumer
tags: [NATS Consumer, "input-plugins", "configuration", "messaging"]
introduced: "v0.10.3"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.1/plugins/inputs/nats_consumer/README.md, NATS Consumer Plugin Source
---

# NATS Consumer Input Plugin

This service plugin consumes messages from [NATS](https://www.nats.io/about/) instances in one of the
supported [data formats](/telegraf/v1/data_formats/input). A [Queue Group](https://www.nats.io/documentation/concepts/nats-queueing/) is used
when subscribing to subjects so multiple instances of telegraf can consume
messages in parallel.
The plugin supports authenticating via [username/password](https://docs.nats.io/using-nats/developer/connecting/userpass), a
[credentials file](https://docs.nats.io/using-nats/developer/connecting/creds) (NATS 2.0), or an [nkey seed file](https://docs.nats.io/using-nats/developer/connecting/nkey) (NATS 2.0).

**Introduced in:** Telegraf v0.10.3
**Tags:** messaging
**OS support:** all

[nats]: https://www.nats.io/about/
[data_formats]: /docs/DATA_FORMATS_INPUT.md
[queue_group]: https://www.nats.io/documentation/concepts/nats-queueing/
[userpass]: https://docs.nats.io/using-nats/developer/connecting/userpass
[creds]: https://docs.nats.io/using-nats/developer/connecting/creds
[nkey]: https://docs.nats.io/using-nats/developer/connecting/nkey

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
# Read metrics from NATS subject(s)
[[inputs.nats_consumer]]
  ## urls of NATS servers
  servers = ["nats://localhost:4222"]

  ## subject(s) to consume
  ## If you use jetstream you need to set the subjects
  ## in jetstream_subjects
  subjects = ["telegraf"]

  ## jetstream subjects
  ## jetstream is a streaming technology inside of nats.
  ## With jetstream the nats-server persists messages and
  ## a consumer can consume historical messages. This is
  ## useful when telegraf needs to restart it don't miss a
  ## message. You need to configure the nats-server.
  ## https://docs.nats.io/nats-concepts/jetstream.
  jetstream_subjects = ["js_telegraf"]

  ## explicitly specify the jetstream stream name
  ## useful for sourced streams where there is no subject defined and
  ## thus jetstream_subjects won't work
  jetstream_stream = ""

  ## name a queue group
  queue_group = "telegraf_consumers"

  ## Optional authentication with username and password credentials
  # username = ""
  # password = ""

  ## Optional authentication with NATS credentials file (NATS 2.0)
  # credentials = "/etc/telegraf/nats.creds"

  ## Optional authentication with nkey seed file (NATS 2.0)
  # nkey_seed = "/etc/telegraf/seed.txt"

  ## Use Transport Layer Security
  # secure = false

  ## Optional TLS Config
  # tls_ca = "/etc/telegraf/ca.pem"
  # tls_cert = "/etc/telegraf/cert.pem"
  # tls_key = "/etc/telegraf/key.pem"
  ## Use TLS but skip chain & host verification
  # insecure_skip_verify = false

  ## Sets the limits for pending msgs and bytes for each subscription
  ## These shouldn't need to be adjusted except in very high throughput scenarios
  # pending_message_limit = 65536
  # pending_bytes_limit = 67108864

  ## Max undelivered messages
  ## This plugin uses tracking metrics, which ensure messages are read to
  ## outputs before acknowledging them to the original broker to ensure data
  ## is not lost. This option sets the maximum messages to read from the
  ## broker that have not been written by an output.
  ##
  ## This value needs to be picked with awareness of the agent's
  ## metric_batch_size value as well. Setting max undelivered messages too high
  ## can result in a constant stream of data batches to the output. While
  ## setting it too low may never flush the broker's messages.
  # max_undelivered_messages = 1000

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "influx"
```

## Metrics

Which data you will get depends on the subjects you consume from nats

## Example Output

Depends on the nats subject input
nats_consumer,host=foo,subject=recvsubj value=1.9 1655972309339341000
