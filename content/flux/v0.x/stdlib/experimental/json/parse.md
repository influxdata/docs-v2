---
title: json.parse() function
description: >
  The `json.parse()` function takes JSON data as bytes and returns a value.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/json/parse/
  - /influxdb/cloud/reference/flux/stdlib/experimental/json/parse/
menu:
  flux_0_x_ref:
    name: json.parse
    parent: json-exp
weight: 401
flux/v0.x/tags: [type-conversions]
introduced: 0.69.0
---

The `json.parse()` function takes JSON data as bytes and returns a value.
The function can return lists, records, strings, booleans, and float values.
All numeric values are returned as floats.

_**Function type:** Type conversion_

```js
import "experimental/json"

json.parse(
  data: bytes(v: "{\"a\":1,\"b\":2,\"c\":3}")
)
```

## Parameters

### data
JSON data to parse.

_**Data type:** Bytes_


## Examples

##### Parse and use JSON data to restructure a table
```js
import "experimental/json"

data
  |> map(fn: (r) => {
      jsonData = json.parse(data: bytes(v: r._value))

      return {
        _time: r._time,
        _field: r._field,
        a: jsonData.a,
        b: jsonData.b,
        c: jsonData.c,
      }
    })
```
