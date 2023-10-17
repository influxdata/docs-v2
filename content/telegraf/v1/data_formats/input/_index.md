---
title: Telegraf input data formats
list_title: Input data formats
description: Telegraf supports parsing input data formats into Telegraf metrics.
menu:
  telegraf_v1_ref:
    name: Input data formats
    weight: 1
    parent: Data formats
---

Telegraf [input plugins](/telegraf/v1/plugins/inputs/) consume data in one or more data formats and 
parse the data into Telegraf [metrics][/telegraf/v1/metrics/].
Many input plugins use configurable parsers for parsing data formats into metrics.
This allows input plugins such as [`kafka_consumer` input plugin](/telegraf/v1/plugins/#input-kafka_consumer)
to consume and process different data formats, such as InfluxDB line
protocol or JSON.
Telegraf supports the following input **data formats**:

{{< children >}}

Any input plugin containing the `data_format` option can use it to select the
desired parser:

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

## Input parser plugins

When you specify a `data_format` in an [input plugin](/telegraf/v1/plugins/inputs/) configuration that supports it, the input plugin uses the associated [parser plugin](https://github.com/influxdata/telegraf/tree/master/plugins/parsers) to convert data from its source format into Telegraf metrics.
Many parser plugins provide additional configuration options for specifying details about your data schema and how it should map to fields in Telegraf metrics.

[metrics]: /telegraf/v1/metrics/
