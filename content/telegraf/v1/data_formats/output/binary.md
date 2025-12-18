---
title: Binary output data format
list_title: Binary
description: Use the `binary` output data format (serializer) to serialize Telegraf metrics into binary protocols using user-specified configurations.
menu:
  telegraf_v1_ref:
    name: Binary
    weight: 10
    parent: Output data formats
    identifier: output-data-format-binary
---

Use the `binary` output data format (serializer) to serialize Telegraf metrics into binary protocols using user-specified configurations.

## Configuration

```toml
[[outputs.socket_writer]]
  address = "tcp://127.0.0.1:54000"
  metric_batch_size = 1

  ## Data format to output.
  data_format = "binary"

  ## Specify the endianness of the data.
  ## Available values are "little" (little-endian), "big" (big-endian) and "host",
  ## where "host" means the same endianness as the machine running Telegraf.
  # endianness = "host"

  ## Definition of the message format and the serialized data.
  ## Please note that you need to define all elements of the data in the
  ## correct order as the binary format is position-dependent.
  ##
  ## Entry properties:
  ##  read_from         --  Source of the data: "field", "tag", "time" or "name".
  ##                        Defaults to "field" if omitted.
  ##  name              --  Name of the field or tag. Can be omitted for "time" and "name".
  ##  data_format       --  Target data-type: "int8/16/32/64", "uint8/16/32/64",
  ##                        "float32/64", "string".
  ##                        For time: "unix" (default), "unix_ms", "unix_us", "unix_ns".
  ##  string_length     --  Length of the string in bytes (for "string" type only).
  ##  string_terminator --  Terminator for strings: "null", "0x00", etc.
  ##                        Defaults to "null" for strings.
  entries = [
    { read_from = "name", data_format = "string", string_length = 32 },
    { read_from = "tag", name = "host", data_format = "string", string_length = 64 },
    { read_from = "field", name = "value", data_format = "float64" },
    { read_from = "time", data_format = "unix_ns" },
  ]
```

### Configuration options

| Option | Type | Description |
|--------|------|-------------|
| `endianness` | string | Byte order: `"little"`, `"big"`, or `"host"` (default) |
| `entries` | array | Ordered list of data elements to serialize |

### Entry properties

Each entry in the `entries` array defines how to serialize a piece of metric data:

| Property | Type | Description |
|----------|------|-------------|
| `read_from` | string | Data source: `"field"`, `"tag"`, `"time"`, or `"name"` |
| `name` | string | Field or tag name (required for `"field"` and `"tag"`) |
| `data_format` | string | Target type: `"int8/16/32/64"`, `"uint8/16/32/64"`, `"float32/64"`, `"string"` |
| `string_length` | integer | Fixed string length in bytes (for `"string"` type) |
| `string_terminator` | string | String terminator: `"null"`, `"0x00"`, etc. |

## Type conversion

If the original field type differs from the target type, the serializer converts the value.
A warning is logged if the conversion may cause loss of precision.

## String handling

For string fields:
- If the string is longer than `string_length`, it is truncated to fit `string + terminator = string_length`
- If the string is shorter than `string_length`, it is padded with the terminator character
