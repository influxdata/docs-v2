---
description: "Telegraf plugin for sending metrics to Inlong"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: Inlong
    identifier: output-inlong
tags: [Inlong, "output-plugins", "configuration", "messaging"]
introduced: "v1.35.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.2/plugins/outputs/inlong/README.md, Inlong Plugin Source
---

# Inlong Output Plugin

This plugin publishes metrics to an [Apache InLong](https://inlong.apache.org) instance.

**Introduced in:** Telegraf v1.35.0
**Tags:** messaging
**OS support:** all

[inlong]: https://inlong.apache.org

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Send telegraf metrics to Apache Inlong
[[outputs.inlong]]
  ## Manager URL to obtain the Inlong data-proxy IP list for sending the data
  url = "http://127.0.0.1:8083"

  ## Unique identifier for the data-stream group
  group_id = "telegraf"  

  ## Unique identifier for the data stream within its group
  stream_id = "telegraf"  

  ## Data format to output.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md
  # data_format = "influx"
```
