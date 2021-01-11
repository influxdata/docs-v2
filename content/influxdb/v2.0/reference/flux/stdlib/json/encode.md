---
title: json.encode() function
description: The `json.encode()` function converts a value into JSON bytes.
aliases:
  - /influxdb/v2.0/reference/flux/functions/json/encode/
  - /influxdb/v2.0/reference/flux/stdlib/json/encode/
  - /influxdb/cloud/reference/flux/stdlib/json/encode/
menu:
  influxdb_2_0_ref:
    name: json.encode
    parent: JSON
weight: 202
introduced: 0.40.0
---

The `json.encode()` function converts a value into JSON bytes.

_**Function type:** Type conversion_

```js
import "json"

json.encode(v: "some value")
```

This function encodes [Flux types](/influxdb/v2.0/reference/flux/language/types/) as follows:

- `time` values in [RFC3339](/influxdb/v2.0/reference/glossary/#rfc3339-timestamp) format
- `duration` values in number of milliseconds since the epoch
- `regexp` values as their string representation
- `bytes` values as base64-encoded strings
- `function` values are not encoded and produce an error

## Parameters

### v
The value to convert.

_**Data type:** Record | Array | Boolean | Duration | Float | Integer | String | Time | UInteger_

## Examples

### Encode all values in a column in JSON bytes
```js
import "json"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> map(fn: (r) => ({
      r with _value: json.encode(v: r._value)
  }))
```
