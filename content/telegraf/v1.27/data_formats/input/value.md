---
title: Value input data format
list_title: Value
description: Use the `value` input data format to parse single values into Telegraf metrics.
menu:
  telegraf_1_27_ref:
    name: Value
    weight: 10
    parent: Input data formats
---

Use the `value` input data format to parse single values into Telegraf metrics.

## Configuration

Specify the measurement name and a field to use as the parsed metric.

> To specify the measurement name for your metric, set `name_override`; otherwise, the input plugin name (for example, "exec") is used as the measurement name.

You **must** tell Telegraf what type of metric to collect by using the
`data_type` configuration option. Available data type options are:

1. integer
2. float or long
3. string
4. boolean

```toml
[[inputs.exec]]
  ## Commands array
  commands = ["cat /proc/sys/kernel/random/entropy_avail"]

  ## override the default metric name of "exec"
  name_override = "entropy_available"

  ## override the field name of "value"
  # value_field_name = "value"

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ##   https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "value"
  data_type = "integer" # required
```
