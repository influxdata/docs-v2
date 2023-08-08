---
title: InfluxDB line protocol input data format
list_title: InfluxDB line protocol
description: Use the `influx` line protocol input data format to parse InfluxDB metrics directly into Telegraf metrics.
menu:
  telegraf_1_27_ref:
    name: InfluxDB line protocol
    weight: 10
    parent: Input data formats
---

Use the `influx` line protocol input data format to parse InfluxDB [line protocol](/influxdb/cloud-serverless/reference/syntax/line-protocol/) data into Telegraf [metrics](/telegraf/v1.27/metrics/).

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
  ## influx_parser_type = "internal"
```
