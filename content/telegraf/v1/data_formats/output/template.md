---
title: Template output data format
list_title: Template
description: Use the `template` output data format (serializer) to format and output Telegraf metrics using custom Go templates.
menu:
  telegraf_v1_ref:
    name: Template
    weight: 10
    parent: Output data formats
    identifier: output-data-format-template
---

Use the `template` output data format (serializer) to format and output Telegraf metrics using custom [Go templates](https://pkg.go.dev/text/template).
[Sprig](http://masterminds.github.io/sprig/) helper functions are also available for enhanced template functionality.

## Configuration

```toml
[[outputs.file]]
  ## Files to write to, "stdout" is a specially handled file.
  files = ["stdout", "/tmp/metrics.out"]

  ## Data format to output.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md
  data_format = "template"

  ## Go template for formatting a single metric
  template = '{{ .Tag "host" }} {{ .Field "available" }}'
```

### Configuration options

- **`template`**: Go template string that defines the output format for a single metric.
  The template context (the "dot") is a single metric object with methods to access tags and fields.

## Template methods

Within the template, use the following methods to access metric data:

| Method | Description | Example |
|--------|-------------|---------|
| `.Name` | Returns the metric name | `{{ .Name }}` |
| `.Tag "key"` | Returns the value of the specified tag | `{{ .Tag "host" }}` |
| `.Field "key"` | Returns the value of the specified field | `{{ .Field "available" }}` |
| `.Tags` | Returns a map of all tags | `{{ .Tags }}` |
| `.Fields` | Returns a map of all fields | `{{ .Fields }}` |
| `.Time` | Returns the metric timestamp | `{{ .Time }}` |

## Examples

### Basic example

Output host and a field value:

```toml
[[outputs.file]]
  files = ["stdout"]
  data_format = "template"
  template = '{{ .Tag "host" }}: {{ .Field "usage_idle" }}'
```

**Input metric:**
```
cpu,host=server01 usage_idle=98.5,usage_user=1.2 1640000000000000000
```

**Output:**
```
server01: 98.5
```

### Multiple fields example

Output multiple fields with formatting:

```toml
[[outputs.file]]
  files = ["stdout"]
  data_format = "template"
  template = '{{ .Name }} on {{ .Tag "host" }}: idle={{ .Field "usage_idle" }}, user={{ .Field "usage_user" }}'
```

**Output:**
```
cpu on server01: idle=98.5, user=1.2
```

## Batch mode

When an output plugin emits multiple metrics in a batch, the template repeats for each metric by default.
To define custom formatting for batches, use `batch_template` with `use_batch_format = true`.

In batch mode, the template context (the "dot") is a slice of metrics instead of a single metric.

### Batch configuration

```toml
[[outputs.file]]
  files = ["stdout"]
  data_format = "template"

  ## Enable batch mode (required for batch_template)
  use_batch_format = true

  ## Template for formatting multiple metrics together
  batch_template = '''
{{- range $index, $metric := . -}}
{{- if $index }}, {{ end -}}
{{ $metric.Name }}
{{- end -}}
'''
```

### Batch example with Sprig functions

Use Sprig functions for advanced batch formatting:

```toml
[[outputs.file]]
  files = ["stdout"]
  data_format = "template"
  use_batch_format = true
  batch_template = '''
{{- range $metric := . -}}
{{ $metric.Tag "host" }}: {{ range $metric.Fields | keys | initial -}}
{{ . }}={{ get $metric.Fields . }}, {{ end -}}
{{ $metric.Fields | keys | last }}={{ $metric.Fields | values | last }}
{{ end -}}
'''
```

## Sprig functions

The template serializer supports [Sprig](http://masterminds.github.io/sprig/) template functions for string manipulation, math operations, and data transformations.

Common Sprig functions:

| Function | Description | Example |
|----------|-------------|---------|
| `keys` | Returns map keys | `{{ .Fields \| keys }}` |
| `values` | Returns map values | `{{ .Fields \| values }}` |
| `get` | Gets value by key | `{{ get .Fields "cpu" }}` |
| `initial` | All but last element | `{{ .Fields \| keys \| initial }}` |
| `last` | Last element | `{{ .Fields \| keys \| last }}` |
| `upper` | Uppercase string | `{{ .Name \| upper }}` |
| `lower` | Lowercase string | `{{ .Tag "host" \| lower }}` |

For the complete list of available functions, see the [Sprig documentation](http://masterminds.github.io/sprig/).
