---
title: generate.from() function
description: >
  `generate.from` generates data using provided parameter values.
menu:
  flux_0_x_ref:
    name: generate.from
    parent: generate
flux/v0.x/tags: [inputs]
weight: 202
---

`generate.from` generates data using provided parameter values.

```js
import "generate"

generate.from(
  count: 5,
  fn: (n) => n,
  start: 2021-01-01T00:00:00Z,
  stop: 2021-01-02T00:00:00Z
)
```

## Parameters

### count {data-type="int"}
({{< req >}})
Number of rows to generate.

### fn {data-type="function"}
({{< req >}}) 
Function used to generate values.
The function takes an `n` parameter that represents the row index, operates on `n`, 
and then returns an [integer value](/flux/v0.x/data-types/basic/int/).
Rows use zero-based indexing.

### start {data-type="time"}
({{< req >}})
Beginning of the time range to generate values in.

### stop {data-type="time"}
({{< req >}}) 
End of the time range to generate values in.

## Examples

### Generate sample data
```js
import "generate"

generate.from(
  count: 6,
  fn: (n) => (n + 1) * (n + 2),
  start: 2021-01-01T00:00:00Z,
  stop: 2021-01-02T00:00:00Z,
)
```

##### Output data
| _time                | _value |
| :------------------- | -----: |
| 2021-01-01T00:00:00Z |      2 |
| 2021-01-01T04:00:00Z |      6 |
| 2021-01-01T08:00:00Z |     12 |
| 2021-01-01T12:00:00Z |     20 |
| 2021-01-01T16:00:00Z |     30 |
| 2021-01-01T20:00:00Z |     42 |