---
title: Value input data format
list_title: Value
description: Use the `value` input data format to parse single values into Telegraf metrics.
menu:
  telegraf_v1_ref:
    name: Value
    parent: Input data formats
weight: 10
---

Use the `value` input data format to parse single values into Telegraf metrics.

## Configuration

Specify the measurement name and a field to use as the parsed metric.

> To specify the measurement name for your metric, set `name_override`; otherwise, the input plugin name (for example, "exec") is used as the measurement name.

You **must** tell Telegraf what type of metric to collect by using the
`data_type` configuration option. Available options are:

- `integer`: converts the received data to an integer value.
  Produces an error on non-integer data.
- `float` (or `long`): converts the received data to a floating-point
  value.
  Treats integers as floating-point values and produces an error on data
  that can't be converted, such as strings.
- `string`: outputs the data as a string.
- `base64`: outputs the data as a base64-encoded string.
- `boolean`: converts the received data to a boolean value.
  Produces an error on any data except the strings `true` and `false`.
- `auto_integer`: converts the received data to an integer value if
  possible, and returns the data as a string otherwise.
  Helpful for mixed-type data.
- `auto_float`: converts the received data to a floating-point value if
  possible, and returns the data as a string otherwise.
  Helpful for mixed-type data.
  Integer data is treated as floating-point values.

> [!Note]
> The `auto` conversions might convert data to their prioritized type by
> accident.
> For example, if a string data source provides `"55"`, it converts to an
> integer or float.
> This might break outputs that require a consistent type within a field
> or column, so use strict typing whenever possible.

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
