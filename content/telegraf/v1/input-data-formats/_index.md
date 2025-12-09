---
title: Telegraf input data formats
list_title: Input data formats
description: Telegraf supports parsing input data formats into Telegraf metrics.
menu:
  telegraf_v1_ref:
    name: Input data formats
    parent: data_formats_reference
    identifier: input_data_formats_reference
    weight: 20
tags: [input-data-formats, input-serializers]
---

Telegraf supports the following input data formats for parsing data into [metrics](/telegraf/v1/metrics/).
Input plugins that support these formats include a `data_format` configuration option.

For example, in the [Exec input plugin](/telegraf/v1/input-plugins/exec/):

```toml
[[inputs.exec]]
  ## Commands array
  commands = ["/tmp/test.sh", "/usr/bin/mycollector --foo=bar"]

  ## measurement name suffix (for separating different commands)
  name_suffix = "_mycollector"

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "json_v2"
```

{{< telegraf/data-formats type="input" >}}
