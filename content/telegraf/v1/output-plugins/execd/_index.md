---
description: "Telegraf plugin for sending metrics to Executable Daemon"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: Executable Daemon
    identifier: output-execd
tags: [Executable Daemon, "output-plugins", "configuration", "system"]
introduced: "v1.15.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.3/plugins/outputs/execd/README.md, Executable Daemon Plugin Source
---

# Executable Daemon Output Plugin

This plugin writes metrics to an external daemon program via `stdin`. The
command will be executed once and metrics will be passed to it on every write
in one of the supported [data formats](/telegraf/v1/data_formats/output).
The executable and the individual parameters must be defined as a list.

All outputs of the executable to `stderr` will be logged in the Telegraf log.
Telegraf minimum version: Telegraf 1.15.0

**Introduced in:** Telegraf v1.15.0
**Tags:** system
**OS support:** all

[data_formats]: /docs/DATA_FORMATS_OUTPUT.md

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Run executable as long-running output plugin
[[outputs.execd]]
  ## One program to run as daemon.
  ## NOTE: process and each argument should each be their own string
  command = ["my-telegraf-output", "--some-flag", "value"]

  ## Environment variables
  ## Array of "key=value" pairs to pass as environment variables
  ## e.g. "KEY=value", "USERNAME=John Doe",
  ## "LD_LIBRARY_PATH=/opt/custom/lib64:/usr/local/libs"
  # environment = []

  ## Delay before the process is restarted after an unexpected termination
  restart_delay = "10s"

  ## Flag to determine whether execd should throw error when part of metrics is unserializable
  ## Setting this to true will skip the unserializable metrics and process the rest of metrics
  ## Setting this to false will throw error when encountering unserializable metrics and none will be processed
  ## This setting does not apply when use_batch_format is set.
  # ignore_serialization_error = false

  ## Use batch serialization instead of per metric. The batch format allows for the
  ## production of batch output formats and may more efficiently encode and write metrics.
  # use_batch_format = false

  ## Data format to export.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md
  data_format = "influx"
```

## Example

see [examples](examples/)

[examples]: examples/
