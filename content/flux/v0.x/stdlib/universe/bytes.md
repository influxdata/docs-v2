---
title: bytes() function
description: The `bytes()` function converts a single value to bytes.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/bytes/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/bytes/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/bytes/
menu:
  flux_0_x_ref:
    name: bytes
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions]
related:
  - /flux/v0.x/data-types/basic/bytes/
introduced: 0.40.0
---

The `bytes()` function converts a single value to bytes.

_**Output data type:** Bytes_

```js
bytes(v: "1m")
```

## Parameters

### v {data-type="string"}
The value to convert.

## Examples
```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> map(fn:(r) => ({ r with _value: bytes(v: r._value) }))
```
