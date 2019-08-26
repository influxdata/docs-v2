---
title: json.encode() function
description: The `json.encode()` function converts a value into JSON bytes
menu:
  v2_0_ref:
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

The function encodes [Flux types](/v2.0/reference/flux/language/types/) in the following manner:

- It encodes `time` values using [RFC3339](https://tools.ietf.org/html/rfc3339).
- It encodes `duration` values in number of milliseconds since the epoch.
- It encodes `regexp` values as their string representation.
- It encodes `bytes` values as base64-encoded strings.
- It cannot encode `function` values and will produce an error.

## Parameters

### v
The value to convert.

_**Data type:** Boolean | Duration | Float | Integer | String | Time | UInteger_

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
