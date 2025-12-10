---
description: "Telegraf plugin for sending metrics to NSQ"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: NSQ
    identifier: output-nsq
tags: [NSQ, "output-plugins", "configuration", "messaging"]
introduced: "v0.2.1"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.0/plugins/outputs/nsq/README.md, NSQ Plugin Source
---

# NSQ Output Plugin

This plugin writes metrics to the given topic of a [NSQ](https://nsq.io) instance as a
producer in one of the supported [data formats](/telegraf/v1/data_formats/output).

**Introduced in:** Telegraf v0.2.1
**Tags:** messaging
**OS support:** all

[nsq]: https://nsq.io
[data_formats]: /docs/DATA_FORMATS_OUTPUT.md

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Send telegraf measurements to NSQD
[[outputs.nsq]]
  ## Location of nsqd instance listening on TCP
  server = "localhost:4150"
  ## NSQ topic for producer messages
  topic = "telegraf"

  ## Data format to output.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md
  data_format = "influx"
```
