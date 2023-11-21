---
title: types.isType() function
description: >
  `types.isType()` tests if a value is a specified type.
menu:
  flux_v0_ref:
    name: types.isType
    parent: types
    identifier: types/isType
weight: 101
flux/v0/tags: [types, tests]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/types/types.flux#L128-L128

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`types.isType()` tests if a value is a specified type.



##### Function type signature

```js
(type: string, v: A) => bool where A: Basic
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
Value to test.



### type
({{< req >}})
String describing the type to check against.

**Supported types**:
- string
- bytes
- int
- uint
- float
- bool
- time
- duration
- regexp


## Examples

- [Filter by value type](#filter-by-value-type)
- [Aggregate or select data based on type](#aggregate-or-select-data-based-on-type)

### Filter by value type

```js
import "types"

data
    |> filter(fn: (r) => types.isType(v: r._value, type: "string"))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *_field | _value  |
| -------------------- | ------- | ------- |
| 2022-01-01T00:00:00Z | foo     | 12      |
| 2022-01-01T00:01:00Z | foo     | 15      |
| 2022-01-01T00:02:00Z | foo     | 9       |

| _time  | *_field | _value  |
| ------ | ------- | ------- |

| _time                | *_field | _value   |
| -------------------- | ------- | -------- |
| 2022-01-01T00:00:00Z | bar     | 0jCcsMYM |
| 2022-01-01T00:01:00Z | bar     | jHvuDw35 |
| 2022-01-01T00:02:00Z | bar     | HE5uCIC2 |


#### Output data

| _time                | *_field | _value   |
| -------------------- | ------- | -------- |
| 2022-01-01T00:00:00Z | bar     | 0jCcsMYM |
| 2022-01-01T00:01:00Z | bar     | jHvuDw35 |
| 2022-01-01T00:02:00Z | bar     | HE5uCIC2 |

{{% /expand %}}
{{< /expand-wrapper >}}

### Aggregate or select data based on type

```js
import "types"

nonNumericData =
    data
        |> filter(
            fn: (r) =>
                types.isType(v: r._value, type: "string") or types.isType(
                        v: r._value,
                        type: "bool",
                    ),
        )
        |> aggregateWindow(every: 30s, fn: last)

numericData =
    data
        |> filter(
            fn: (r) =>
                types.isType(v: r._value, type: "int") or types.isType(v: r._value, type: "float"),
        )
        |> aggregateWindow(every: 30s, fn: mean)

union(tables: [nonNumericData, numericData])

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_start              | *_stop               | _time                | *type | _value  |
| -------------------- | -------------------- | -------------------- | ----- | ------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | bool  | true    |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | bool  | true    |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | bool  | false   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | bool  | true    |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | bool  | false   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | bool  | false   |

| *_start | *_stop | _time  | *type | _value  |
| ------- | ------ | ------ | ----- | ------- |

| *_start              | *_stop               | _time                | *type | _value  |
| -------------------- | -------------------- | -------------------- | ----- | ------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | float | -2.18   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | float | 10.92   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | float | 7.35    |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | float | 17.53   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | float | 15.23   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | float | 4.43    |

| *_start | *_stop | _time  | _value  | *type |
| ------- | ------ | ------ | ------- | ----- |

| *_start              | *_stop               | _time                | _value  | *type |
| -------------------- | -------------------- | -------------------- | ------- | ----- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | -2      | int   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | 10      | int   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | 7       | int   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 17      | int   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 15      | int   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 4       | int   |

| *_start | *_stop | _time  | *type | _value  |
| ------- | ------ | ------ | ----- | ------- |

| *_start              | *_stop               | _time                | *type  | _value      |
| -------------------- | -------------------- | -------------------- | ------ | ----------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | string | smpl_g9qczs |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | string | smpl_0mgv9n |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | string | smpl_phw664 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | string | smpl_guvzy4 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | string | smpl_5v3cce |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | string | smpl_s9fmgy |


#### Output data

| *_start              | *_stop               | _time                | *type | _value  |
| -------------------- | -------------------- | -------------------- | ----- | ------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | bool  | false   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:01:00Z | bool  | false   |

| _time  | *_start | *_stop | *type | _value  |
| ------ | ------- | ------ | ----- | ------- |

| _time                | *_start              | *_stop               | *type | _value             |
| -------------------- | -------------------- | -------------------- | ----- | ------------------ |
| 2021-01-01T00:00:30Z | 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | float | 5.363333333333333  |
| 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | float | 12.396666666666668 |

| _time                | *_start              | *_stop               | *type | _value  |
| -------------------- | -------------------- | -------------------- | ----- | ------- |
| 2021-01-01T00:00:30Z | 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | int   | 5       |
| 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | int   | 12      |

| *_start | *_stop | _time  | *type | _value  |
| ------- | ------ | ------ | ----- | ------- |

| *_start              | *_stop               | _time                | *type  | _value      |
| -------------------- | -------------------- | -------------------- | ------ | ----------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | string | smpl_phw664 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:01:00Z | string | smpl_s9fmgy |

{{% /expand %}}
{{< /expand-wrapper >}}
