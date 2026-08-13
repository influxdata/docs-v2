---
title: Graphite output data format
list_title: Graphite
description: Use the `graphite` output data format (serializer) to format and output Telegraf metrics as Graphite Message Format.
menu:
  telegraf_v1_ref:
    name: Graphite
    parent: Output data formats
    identifier: output-data-format-graphite
weight: 10
---

Use the `graphite` output data format (serializer) to format and output Telegraf metrics as [Graphite Message Format](https://graphite.readthedocs.io/en/latest/feeding-carbon.html#step-3-understanding-the-graphite-message-format).

The serializer uses either the _template pattern_ method (_default_) or the _tag support_ method.
To use the tag support method, set the [`graphite_tag_support`](#graphite_tag_support) option.

## Configuration

```toml
[[outputs.file]]
  ## Files to write to, "stdout" is a specially handled file.
  files = ["stdout", "/tmp/metrics.out"]

  ## Data format to output.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md
  data_format = "graphite"

  ## Prefix added to each graphite bucket
  prefix = "telegraf"
  ## Graphite template pattern
  template = "host.tags.measurement.field"

  ## Graphite templates patterns
  ## 1. Template for cpu
  ## 2. Template for disk*
  ## 3. Default template
  # templates = [
  #  "cpu tags.measurement.host.field",
  #  "disk* measurement.field",
  #  "host.measurement.tags.field"
  #]

  ## Strict sanitization regex
  ## This is the default sanitization regex that is used on data passed to
  ## the graphite serializer. Users can add additional characters here if
  ## required. Be aware that the characters '/' '@' '*' are always replaced
  ## with '_', '..' is replaced with '.', and '\' is removed even if added
  ## to the following regex.
  # graphite_strict_sanitize_regex = '[^a-zA-Z0-9-:._=\p{L}]'

  ## Support Graphite tags, recommended to enable when using Graphite 1.1 or later.
  # graphite_tag_support = false

  ## Applied sanitization mode when graphite tag support is enabled.
  ## * strict - uses the regex specified above
  ## * compatible - allows for greater number of characters
  # graphite_tag_sanitize_mode = "strict"

  ## Character for separating metric name and field for Graphite tags
  # graphite_separator = "."
```

### graphite_tag_support

When the `graphite_tag_support` option is enabled, the template pattern is not
used.  Instead, tags are encoded using
[Graphite tag support](http://graphite.readthedocs.io/en/latest/tags.html),
added in Graphite 1.1.  The `metric_path` is a combination of the optional
`prefix` option, measurement name, and field name.

The tag `name` is reserved by Graphite, any conflicting tags and will be encoded as `_name`.

**Example conversion**:
```
cpu,cpu=cpu-total,dc=us-east-1,host=tars usage_idle=98.09,usage_user=0.89 1455320660004257758
=>
cpu.usage_user;cpu=cpu-total;dc=us-east-1;host=tars 0.89 1455320690
cpu.usage_idle;cpu=cpu-total;dc=us-east-1;host=tars 98.09 1455320690
```

### graphite_separator

The `graphite_separator` option sets the character that joins the metric
name and field name when tag support is enabled.
With `graphite_separator = "_"`, the example above becomes:

```
cpu_usage_user;cpu=cpu-total;dc=us-east-1;host=tars 0.89 1455320690
cpu_usage_idle;cpu=cpu-total;dc=us-east-1;host=tars 98.09 1455320690
```

### graphite_tag_sanitize_mode

The `graphite_tag_sanitize_mode` option defines how to sanitize tag names
and values when tag support is enabled.

- `strict` (default): uses the same rules as metrics without tags,
  applying the `graphite_strict_sanitize_regex` pattern.
- `compatible`: allows more characters through.

### Templates

Use the `template` option to set the default template pattern, or the
`templates` option to set patterns per measurement, using filters such as
`cpu` and `disk*`.
To learn more about using templates and template patterns, see
[Template patterns](/telegraf/v1/data_formats/template-patterns/).
