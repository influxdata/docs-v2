---
title: Telegraf output data formats
description: Telegraf serializes metrics into output data formats.
menu:
  telegraf_1_20:
    name: Output data formats
    weight: 1
    parent: Data formats
---

In addition to output-specific data formats, Telegraf supports the following set
of common data formats that may be selected when configuring many of the Telegraf
output plugins.

{{< children >}}

You will be able to identify the plugins with support by the presence of a
`data_format` configuration option, for example, in the File (`file`) output plugin:

```toml
[[outputs.file]]
  ## Files to write to, "stdout" is a specially handled file.
  files = ["stdout"]

  ## Data format to output.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md
  data_format = "influx"
```
