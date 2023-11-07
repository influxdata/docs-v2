---
title: types.isNumeric() function
description: >
  `types.isNumeric()` tests if a value is a numeric type (int, uint, or float).
menu:
  flux_v0_ref:
    name: types.isNumeric
    parent: types
    identifier: types/isNumeric
weight: 101
flux/v0/tags: [types, tests]
introduced: 0.187.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/types/types.flux#L189-L190

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`types.isNumeric()` tests if a value is a numeric type (int, uint, or float).

This is a helper function to test or filter for values that can be used in
arithmatic operations or aggregations.

##### Function type signature

```js
(v: A) => bool where A: Basic
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
Value to test.




## Examples

### Filter by numeric values

```js
import "types"

data
    |> filter(fn: (r) => types.isNumeric(v: r._value))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *type | _value  |
| -------------------- | ----- | ------- |
| 2021-01-01T00:00:00Z | float | -2.18   |
| 2021-01-01T00:00:10Z | float | 10.92   |
| 2021-01-01T00:00:20Z | float | 7.35    |

| _time  | *type | _value  |
| ------ | ----- | ------- |

| _time                | *type | _value  |
| -------------------- | ----- | ------- |
| 2021-01-01T00:00:00Z | bool  | true    |
| 2021-01-01T00:00:10Z | bool  | true    |
| 2021-01-01T00:00:20Z | bool  | false   |

| _time  | *type | _value  |
| ------ | ----- | ------- |

| _time                | *type  | _value      |
| -------------------- | ------ | ----------- |
| 2021-01-01T00:00:00Z | string | smpl_g9qczs |
| 2021-01-01T00:00:10Z | string | smpl_0mgv9n |
| 2021-01-01T00:00:20Z | string | smpl_phw664 |

| _time  | *type | _value  |
| ------ | ----- | ------- |

| _time                | *type | _value  |
| -------------------- | ----- | ------- |
| 2021-01-01T00:00:00Z | int   | -2      |
| 2021-01-01T00:00:10Z | int   | 10      |
| 2021-01-01T00:00:20Z | int   | 7       |


#### Output data

| _time                | *type | _value  |
| -------------------- | ----- | ------- |
| 2021-01-01T00:00:00Z | float | -2.18   |
| 2021-01-01T00:00:10Z | float | 10.92   |
| 2021-01-01T00:00:20Z | float | 7.35    |

| _time  | *type | _value  |
| ------ | ----- | ------- |

| _time                | *type | _value  |
| -------------------- | ----- | ------- |
| 2021-01-01T00:00:00Z | int   | -2      |
| 2021-01-01T00:00:10Z | int   | 10      |
| 2021-01-01T00:00:20Z | int   | 7       |

{{% /expand %}}
{{< /expand-wrapper >}}
