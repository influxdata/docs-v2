---
title: Telegraf output data formats
list_title: Output data formats
description: Telegraf serializes metrics into output data formats.
menu:
  telegraf_v1_ref:
    name: Output data formats
    parent: data_formats_reference
    identifier: output_data_formats_reference
    weight: 20
tags: [output-data-formats, output-serializers]

Telegraf supports the following output data formats for serializing metrics.
Output plugins that support these formats include a `data_format` configuration option.

For example, in the [File output plugin](/telegraf/v1/output-plugins/file/):

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

{{< telegraf/data-formats type="output" >}}
