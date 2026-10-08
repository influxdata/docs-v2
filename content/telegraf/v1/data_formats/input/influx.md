---
title: InfluxDB line protocol input data format
list_title: InfluxDB line protocol
description: Use the `influx` line protocol input data format to parse InfluxDB metrics directly into Telegraf metrics.
menu:
  telegraf_v1_ref:
    name: InfluxDB line protocol
    parent: Input data formats
weight: 10
---

Use the `influx` line protocol input data format to parse InfluxDB [line protocol](/influxdb3/core/reference/syntax/line-protocol/) data into Telegraf [metrics](/telegraf/v1/concepts/metrics/).

## Configuration

```toml
[[inputs.file]]
  files = ["example"]

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ##   https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "influx"

  ## Influx line protocol parser
  ## 'internal' is the default. 'upstream' is a newer parser that is faster
  ## and more memory efficient.
  # influx_parser_type = "internal"

  ## Influx line protocol timestamp precision
  ## Time duration to specify the precision of the data's timestamp to parse.
  ## The default assumes nanosecond (1ns) precision, but users can set to
  ## second (1s), millisecond (1ms), or microsecond (1us) precision as well.
  # influx_timestamp_precision = "1ns"
```
