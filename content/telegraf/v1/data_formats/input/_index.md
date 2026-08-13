---
title: Telegraf input data formats
list_title: Input data formats
description: >
  Telegraf input plugins use parsers to convert incoming data, such as JSON,
  CSV, and Prometheus format, into Telegraf metrics.
menu:
  telegraf_v1_ref:
    name: Input data formats
    parent: Data formats
weight: 101
related:
  - /telegraf/v1/configure_plugins/input_plugins/parse-data/
  - /telegraf/v1/concepts/metrics/
---

Telegraf input plugins use **parsers** to convert incoming data into
[Telegraf metrics](/telegraf/v1/concepts/metrics/).
Any input plugin that supports the `data_format` option can use it to
select a parser:

```toml
[[inputs.file]]
  files = ["example.json"]

  ## Data format to consume.
  data_format = "json_v2"
```

Each parser has its own configuration options for describing your data's
schema and how it maps to metric names, tags, fields, and timestamps.
For guidance on choosing and configuring a parser, including timestamp
format reference and worked examples, see
[Parse incoming data](/telegraf/v1/configure_plugins/input_plugins/parse-data/).

## Choose a JSON parser

Three parsers read JSON data.
They differ in how much control they give you and how they handle nested
structures:

| Parser | Best for | Value selection | Type control |
| --- | --- | --- | --- |
| [json](/telegraf/v1/data_formats/input/json/) | Flat objects | Flattens everything; optional GJSON `json_query` | Numbers only by default; strings and booleans via `json_string_fields` |
| [json_v2](/telegraf/v1/data_formats/input/json_v2/) | Existing configurations that select nested values | GJSON paths | Per-value `type` option |
| [xpath_json](/telegraf/v1/data_formats/input/xpath_json/) | Nested documents and arrays; new configurations | XPath 1.0 queries | XPath conversion functions or native JSON types |

> [!Important]
> We recommend `xpath_json` over `json_v2` for new
> configurations, especially when working with arrays.
> Use `json` when your data is flat and you don't need type control.

## Available parsers

{{< children >}}
