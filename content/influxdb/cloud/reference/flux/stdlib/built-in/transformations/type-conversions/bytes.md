---
title: bytes() function
description: The `bytes()` function converts a single value to bytes.
aliases:
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/type-conversions/bytes/
menu:
  influxdb_cloud_ref:
    name: bytes
    parent: built-in-type-conversions
weight: 502
---

The `bytes()` function converts a single value to bytes.

_**Function type:** Type conversion_  
_**Output data type:** Bytes_

```js
bytes(v: "1m")
```

## Parameters

### v
The value to convert.

_**Data type:** String_

## Examples
```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> map(fn:(r) => ({ r with _value: bytes(v: r._value) }))
```
