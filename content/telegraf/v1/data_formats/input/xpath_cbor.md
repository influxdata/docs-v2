---
title: XPath CBOR input data format
list_title: XPath CBOR
description: >
  Use the `xpath_cbor` input data format and XPath expressions to parse
  Concise Binary Object Representation (CBOR) data into Telegraf metrics.
menu:
  telegraf_v1_ref:
    name: XPath CBOR
    parent: Input data formats
weight: 10
related:
  - /telegraf/v1/data_formats/input/xpath_json/
  - /telegraf/v1/data_formats/input/xpath_msgpack/
---

Use the `xpath_cbor` input data format to parse
[Concise Binary Object Representation (CBOR)](https://cbor.io/) data into
Telegraf metrics using [XPath 1.0](https://www.w3.org/TR/xpath/)
expressions.

`xpath_cbor` is one of the formats provided by the Telegraf XPath parser.
It shares its configuration options and query syntax with the
[XPath JSON input data format](/telegraf/v1/data_formats/input/xpath_json/).
See that page for the complete option reference, the document-tree mapping,
and query examples.

## Configuration

```toml
[[inputs.file]]
  files = ["example.cbor"]
  data_format = "xpath_cbor"

  ## Keep native data types instead of converting everything to strings.
  ## Applies to batch-selected fields (field_selection).
  # xpath_native_types = false

  ## Print the internal document when debug logging is enabled.
  ## Especially useful for binary formats like CBOR.
  # xpath_print_document = false

  [[inputs.file.xpath]]
    # metric_selection = "/measurements/*"
    [inputs.file.xpath.fields]
      value = "number(value)"
```

## Numeric keys

CBOR supports numeric keys, but the parser's document tree requires node
names to be strings starting with a letter.
The parser prefixes numeric keys with a lowercase `n` and converts them to
strings.
For example, to query a CBOR key `123`, use `n123` in your XPath
expressions.
