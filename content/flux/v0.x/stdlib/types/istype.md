---
title: types.isType() function
description: >
  `types.isType()` tests if a value is a specified
  [Flux basic type](/flux/v0.x/data-types/basic/) or
  [regular expression type](/flux/v0.x/data-types/regexp/).
menu:
  flux_0_x_ref:
    name: types.isType
    parent: types
weight: 101
flux/v0.x/tags: [tests, types]
---

`types.isType()` tests if a value is a specified
[Flux basic type](/flux/v0.x/data-types/basic/) or
[regular expression type](/flux/v0.x/data-types/regexp/).

```js
import "types"

types.isType(v: 12, type: "int")

// Returns true
```

## Parameters

### v
({{< req >}})
Value to test.

### type {data-type="string"}
({{< req >}})
Flux basic type.

**Supported values:**

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

### Filter fields by type
```js
import "strings"

data
    |> filter(fn: (r) => types.isType(v: r._value, type: "string"))
```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data

| _time                | _field | _value <span style="opacity:.5">(int)</span> |
| :------------------- | :----- | -------------------------------------------: |
| 2022-01-01T00:00:00Z | foo    |                                           12 |
| 2022-01-01T00:01:00Z | foo    |                                           15 |
| 2022-01-01T00:02:00Z | foo    |                                            9 |

| _time                | _field | _value <span style="opacity:.5">(string)</span> |
| :------------------- | :----- | ----------------------------------------------: |
| 2022-01-01T00:00:00Z | bar    |                                        0jCcsMYM |
| 2022-01-01T00:01:00Z | bar    |                                        jHvuDw35 |
| 2022-01-01T00:02:00Z | bar    |                                        HE5uCIC2 |

{{% /flex-content %}}
{{% flex-content %}}

##### Output data

| _time                | _field | _value <span style="opacity:.5">(string)</span> |
| :------------------- | :----- | ----------------------------------------------: |
| 2022-01-01T00:00:00Z | bar    |                                        0jCcsMYM |
| 2022-01-01T00:01:00Z | bar    |                                        jHvuDw35 |
| 2022-01-01T00:02:00Z | bar    |                                        HE5uCIC2 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}


### Aggregate or select data based on type
```javascript
data = () => from(bucket: "example-bucket")
    |> range(start: -1m)

nonNumericData = data()
    |> filter(fn: (r) => types.isType(v: r._value, type: "string") or types.isType(v: r._value, type: "bool"))
    |> aggregateWindow(every: 30s, fn: last)

numericData = data()
    |> filter(fn: (r) => types.isType(v: r._value, type: "int") or types.isType(v: r._value, type: "float"))
    |> aggregateWindow(every: 30s, fn: mean)

> union(tables: [nonNumericData, numericData])
```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data
| _start               | _stop                | _time                | type  | _value |
| :------------------- | :------------------- | :------------------- | :---- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | float |  -2.18 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | float |  10.92 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | float |   7.35 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | float |  17.53 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | float |  15.23 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | float |   4.43 |

| _start               | _stop                | _time                | type | _value |
| :------------------- | :------------------- | :------------------- | :--- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | bool |   true |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | bool |   true |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | bool |  false |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | bool |   true |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | bool |  false |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | bool |  false |

| _start               | _stop                | _time                | type   |      _value |
| :------------------- | :------------------- | :------------------- | :----- | ----------: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | string | smpl_g9qczs |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | string | smpl_0mgv9n |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | string | smpl_phw664 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | string | smpl_guvzy4 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | string | smpl_5v3cce |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | string | smpl_s9fmgy |

| _start               | _stop                | _time                | type | _value |
| :------------------- | :------------------- | :------------------- | :--- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | int  |     -2 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | int  |     10 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | int  |      7 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | int  |     17 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | int  |     15 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | int  |      4 |

#### Output data

| _start               | _stop                | _time                | type | _value |
| :------------------- | :------------------- | :------------------- | :--- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | bool |  false |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:01:00Z | bool |  false |

| _start               | _stop                | _time                | type  |             _value |
| :------------------- | :------------------- | :------------------- | :---- | -----------------: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | float |  5.363333333333333 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:01:00Z | float | 12.396666666666668 |

| _start               | _stop                | _time                | type | _value |
| :------------------- | :------------------- | :------------------- | :--- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | int  |      5 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:01:00Z | int  |     12 |

| _start               | _stop                | _time                | type   |      _value |
| :------------------- | :------------------- | :------------------- | :----- | ----------: |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | string | smpl_phw664 |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:01:00Z | string | smpl_s9fmgy |

{{% /expand %}}
{{< /expand-wrapper >}}
