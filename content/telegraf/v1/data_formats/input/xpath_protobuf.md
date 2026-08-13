---
title: XPath Protocol Buffers input data format
list_title: XPath Protocol Buffers
description: >
  Use the `xpath_protobuf` input data format and XPath expressions to parse
  Protocol Buffers data into Telegraf metrics.
menu:
  telegraf_v1_ref:
    name: XPath Protocol Buffers
    parent: Input data formats
weight: 10
related:
  - /telegraf/v1/data_formats/input/xpath_json/
  - /telegraf/v1/data_formats/input/xpath_msgpack/
---

Use the `xpath_protobuf` input data format to parse
[Protocol Buffers](https://protobuf.dev/) data into Telegraf metrics using
[XPath 1.0](https://www.w3.org/TR/xpath/) expressions.

`xpath_protobuf` is one of the formats provided by the Telegraf XPath
parser.
It shares its configuration options and query syntax with the
[XPath JSON input data format](/telegraf/v1/data_formats/input/xpath_json/).
See that page for the complete option reference, the document-tree mapping,
and query examples.
This page covers the additional settings required for Protocol Buffers.

## Configuration

```toml
[[inputs.file]]
  files = ["example.dat"]
  data_format = "xpath_protobuf"

  ## Protocol-buffer definition file(s)
  xpath_protobuf_files = ["sparkplug_b.proto"]

  ## Name of the protocol-buffer message type to use in a fully qualified form.
  xpath_protobuf_type = "org.eclipse.tahu.protobuf.Payload"

  ## List of paths to use when looking up imported protocol-buffer
  ## definition files.
  # xpath_protobuf_import_paths = ["."]

  ## Number of (header) bytes to ignore before parsing the message.
  # xpath_protobuf_skip_bytes = 0

  ## Keep native data types instead of converting everything to strings.
  # xpath_native_types = false

  ## Print the internal document when debug logging is enabled.
  ## Especially useful for binary formats like protocol buffers.
  # xpath_print_document = false

  [[inputs.file.xpath]]
    # metric_selection = "/metrics/*"
    [inputs.file.xpath.fields]
      value = "number(value)"
```

## Protocol Buffers settings

### xpath_protobuf_files

The names of the protocol-buffer definition files (`.proto`).

**Type:** array of strings  
**Default:** None; required

### xpath_protobuf_type

The top-level message type to use for deserializing the data, in fully
qualified form.
Usually, this is constructed from the `package` name and the `message` name
in the protocol-buffer definition file as
`<package name>.<message name>`.

**Type:** string  
**Default:** None; required

### xpath_protobuf_import_paths

Paths to search for imported protocol-buffer definition files.
If your `.proto` file imports other definitions with the `import`
statement, add the directories containing those files.

**Type:** array of strings  
**Default:** `["."]` (the current working directory when starting Telegraf)

For example, if `A.proto` in `/data/my_proto_files` imports `B.proto` from
the same directory:

```protobuf
syntax = "proto3";

package foo;

import "B.proto";

message Measurement {
    ...
}
```

use the following settings:

```toml
[[inputs.file]]
  files = ["example.dat"]

  data_format = "xpath_protobuf"
  xpath_protobuf_files = ["A.proto"]
  xpath_protobuf_type = "foo.Measurement"
  xpath_protobuf_import_paths = [".", "/data/my_proto_files"]
```

### xpath_protobuf_skip_bytes

The number of bytes to skip before parsing the protocol-buffer message.
Useful when the raw data has a header, for example a message-length header
or a gRPC header.

**Type:** integer  
**Default:** `0`

Known headers and the corresponding values:

| Data source | Setting | Comment |
| --- | --- | --- |
| [gRPC protocol](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md) | `5` | gRPC adds a 5-byte header for Length-Prefixed-Messages |
| [PowerDNS logging](https://docs.powerdns.com/recursor/lua-config/protobuf.html) | `2` | Sent messages contain a 2-byte header containing the message length |

## Byte-array fields

Protocol-buffer messages often encode data as byte arrays.
By default, byte-array fields convert to strings; use
[`fields_bytes_as_hex` or `fields_bytes_as_base64`](/telegraf/v1/data_formats/input/xpath_json/#fields_bytes_as_hex-and-fields_bytes_as_base64)
to encode them as hex or base64 strings instead.

Because Protocol Buffers is a binary format, use
[`xpath_print_document = true`](/telegraf/v1/data_formats/input/xpath_json/#xpath_print_document)
with debug logging to inspect the parsed document and work out your
queries.
