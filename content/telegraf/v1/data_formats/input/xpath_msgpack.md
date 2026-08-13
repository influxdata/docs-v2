---
title: XPath MessagePack input data format
list_title: XPath MessagePack
description: >
  Use the `xpath_msgpack` input data format and XPath expressions to parse
  MessagePack data into Telegraf metrics.
menu:
  telegraf_v1_ref:
    name: XPath MessagePack
    parent: Input data formats
weight: 10
related:
  - /telegraf/v1/data_formats/input/xpath_json/
  - /telegraf/v1/data_formats/input/xpath_cbor/
---

Use the `xpath_msgpack` input data format to parse
[MessagePack](https://msgpack.org/) data into Telegraf metrics using
[XPath 1.0](https://www.w3.org/TR/xpath/) expressions.

`xpath_msgpack` is one of the formats provided by the Telegraf XPath
parser.
It shares its configuration options and query syntax with the
[XPath JSON input data format](/telegraf/v1/data_formats/input/xpath_json/).
See that page for the complete option reference, the document-tree mapping,
and query examples.

## Configuration

```toml
[[inputs.file]]
  files = ["example.bin"]
  data_format = "xpath_msgpack"

  ## Keep native data types instead of converting everything to strings.
  ## MessagePack carries type information.
  # xpath_native_types = false

  ## Print the internal document when debug logging is enabled.
  ## Especially useful for binary formats like MessagePack.
  # xpath_print_document = false

  [[inputs.file.xpath]]
    # metric_selection = "/measurements/*"
    [inputs.file.xpath.fields]
      value = "number(value)"
```

Because MessagePack is a binary format, use
[`xpath_print_document = true`](/telegraf/v1/data_formats/input/xpath_json/#xpath_print_document)
with debug logging to inspect the parsed document and work out your
queries.
Fields containing byte arrays convert to strings by default; use
[`fields_bytes_as_hex` or `fields_bytes_as_base64`](/telegraf/v1/data_formats/input/xpath_json/#fields_bytes_as_hex-and-fields_bytes_as_base64)
to encode them instead.
