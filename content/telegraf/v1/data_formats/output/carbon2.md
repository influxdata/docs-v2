---
title: Carbon2 output data format
list_title: Carbon2
description: Use the `carbon2` output data format (serializer) to format and output Telegraf metrics as Carbon2 format.
menu:
  telegraf_v1_ref:
    name: Carbon2
    parent: Output data formats
weight: 10
---

Use the `carbon2` output data format (serializer) to format and output Telegraf metrics as [Carbon2 format](http://metrics20.org/implementations/).

### Configuration

```toml
[[outputs.file]]
  ## Files to write to, "stdout" is a specially handled file.
  files = ["stdout", "/tmp/metrics.out"]

  ## Data format to output.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md
  data_format = "carbon2"

  ## Optionally configure metrics format, whether to merge metric name
  ## and field name.
  ## Possible options:
  ## * "field_separate"
  ## * "metric_includes_field"
  ## * "" - defaults to "field_separate"
  # carbon2_format = "field_separate"

  ## Character used for replacing sanitized characters. By default ":"
  ## is used. The following character set is replaced with the sanitize
  ## replace char: !@#$%^&*()+`'\"[]{};<>,?/\\|=
  # carbon2_sanitize_replace_char = ":"
```

Standard form:

```
metric=name field=field_1 host=foo  30 1234567890
metric=name field=field_2 host=foo  4 1234567890
metric=name field=field_N host=foo  59 1234567890
```

### Metrics

The serializer converts the metrics by creating `intrinsic_tags` using the combination of metric name and fields.  So, if one Telegraf metric has 4 fields, the `carbon2` output will be 4 separate metrics. There will be a `metric` tag that represents the name of the metric and a `field` tag to represent the field.

### Metrics format

Use the `carbon2_format` option to change how metric names are
constructed:

- `field_separate` (default): `metric` includes only the metric name, and
  a separate `field` tag contains the field name.
- `metric_includes_field`: the metric name includes the field name after
  an underscore:

  ```text
  metric=name_field_1 host=foo  30 1234567890
  metric=name_field_2 host=foo  4 1234567890
  metric=name_field_N host=foo  59 1234567890
  ```

### Metric name sanitization

The serializer replaces the following characters in the metric name:

```text
!@#$%^&*()+`'\"[]{};<>,?/\\|=
```

By default, they are replaced with `:`.
Use `carbon2_sanitize_replace_char` to specify a different replacement
character.

### Example

If we take the following InfluxDB Line Protocol:

```
weather,location=us-midwest,season=summer temperature=82,wind=100 1234567890
```

After serializing in Carbon2, the result would be:

```
metric=weather field=temperature location=us-midwest season=summer  82 1234567890
metric=weather field=wind location=us-midwest season=summer  100 1234567890
```

### Fields and tags with spaces

When a field key or tag key-value have spaces, spaces will be replaced with `_`.

### Tags with empty values

When a tag's value is empty, it will be replaced with `null`.
