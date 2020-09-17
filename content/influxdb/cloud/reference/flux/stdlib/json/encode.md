---
title: json.encode() function
description: The `json.encode()` function converts a value into JSON bytes.
aliases:
  - /influxdb/cloud/reference/flux/functions/json/encode/
menu:
  influxdb_cloud_ref:
    name: json.encode
    parent: JSON
weight: 202
---

The `json.encode()` function converts a value into JSON bytes.

_**Function type:** Type conversion_

```js
import "json"

json.encode(v: "some value")
```

This function encodes [Flux types](/influxdb/cloud/reference/flux/language/types/) as follows:

- `time` values in [RFC3339](/influxdb/cloud/reference/glossary/#rfc3339-timestamp) format
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
