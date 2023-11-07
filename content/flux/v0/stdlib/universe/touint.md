---
title: toUInt() function
description: >
  `toUInt()` converts all values in the `_value` column to unsigned integer types.
menu:
  flux_v0_ref:
    name: toUInt
    parent: universe
    identifier: universe/toUInt
weight: 101
flux/v0/tags: [transformations, type-conversions]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L4716-L4716

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`toUInt()` converts all values in the `_value` column to unsigned integer types.

#### Supported types and behaviors
`toUInt()` behavior depends on the `_value` column type:

| _value type | Returned value                                  |
| :---------- | :---------------------------------------------- |
| string      | UInteger equivalent of the numeric string       |
| bool        | 1 (true) or 0 (false)                           |
| duration    | Number of nanoseconds in the specified duration |
| time        | Equivalent nanosecond epoch timestamp           |
| float       | Value truncated at the decimal                  |
| int         | UInteger equivalent of the integer              |

##### Function type signature

```js
(<-tables: stream[{A with _value: B}]) => stream[{A with _value: B, _value: uint}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Convert a float _value column to uintegers](#convert-a-float-_value-column-to-uintegers)
- [Convert a boolean _value column to uintegers](#convert-a-boolean-_value-column-to-uintegers)
- [Convert a uinteger _value column to an uintegers](#convert-a-uinteger-_value-column-to-an-uintegers)

### Convert a float _value column to uintegers

```js
import "sampledata"

sampledata.float()
    |> toUInt()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t1   | -2.18   |
| 2021-01-01T00:00:10Z | t1   | 10.92   |
| 2021-01-01T00:00:20Z | t1   | 7.35    |
| 2021-01-01T00:00:30Z | t1   | 17.53   |
| 2021-01-01T00:00:40Z | t1   | 15.23   |
| 2021-01-01T00:00:50Z | t1   | 4.43    |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t2   | 19.85   |
| 2021-01-01T00:00:10Z | t2   | 4.97    |
| 2021-01-01T00:00:20Z | t2   | -3.75   |
| 2021-01-01T00:00:30Z | t2   | 19.77   |
| 2021-01-01T00:00:40Z | t2   | 13.86   |
| 2021-01-01T00:00:50Z | t2   | 1.86    |


#### Output data

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 18446744073709551614 | t1   |
| 2021-01-01T00:00:10Z | 10                   | t1   |
| 2021-01-01T00:00:20Z | 7                    | t1   |
| 2021-01-01T00:00:30Z | 17                   | t1   |
| 2021-01-01T00:00:40Z | 15                   | t1   |
| 2021-01-01T00:00:50Z | 4                    | t1   |

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 19                   | t2   |
| 2021-01-01T00:00:10Z | 4                    | t2   |
| 2021-01-01T00:00:20Z | 18446744073709551613 | t2   |
| 2021-01-01T00:00:30Z | 19                   | t2   |
| 2021-01-01T00:00:40Z | 13                   | t2   |
| 2021-01-01T00:00:50Z | 1                    | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Convert a boolean _value column to uintegers

```js
import "sampledata"

sampledata.bool()
    |> toUInt()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t1   | true    |
| 2021-01-01T00:00:10Z | t1   | true    |
| 2021-01-01T00:00:20Z | t1   | false   |
| 2021-01-01T00:00:30Z | t1   | true    |
| 2021-01-01T00:00:40Z | t1   | false   |
| 2021-01-01T00:00:50Z | t1   | false   |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t2   | false   |
| 2021-01-01T00:00:10Z | t2   | true    |
| 2021-01-01T00:00:20Z | t2   | false   |
| 2021-01-01T00:00:30Z | t2   | true    |
| 2021-01-01T00:00:40Z | t2   | true    |
| 2021-01-01T00:00:50Z | t2   | false   |


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 1       | t1   |
| 2021-01-01T00:00:10Z | 1       | t1   |
| 2021-01-01T00:00:20Z | 0       | t1   |
| 2021-01-01T00:00:30Z | 1       | t1   |
| 2021-01-01T00:00:40Z | 0       | t1   |
| 2021-01-01T00:00:50Z | 0       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 0       | t2   |
| 2021-01-01T00:00:10Z | 1       | t2   |
| 2021-01-01T00:00:20Z | 0       | t2   |
| 2021-01-01T00:00:30Z | 1       | t2   |
| 2021-01-01T00:00:40Z | 1       | t2   |
| 2021-01-01T00:00:50Z | 0       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Convert a uinteger _value column to an uintegers

```js
import "sampledata"

sampledata.uint()
    |> toUInt()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 18446744073709551614 | t1   |
| 2021-01-01T00:00:10Z | 10                   | t1   |
| 2021-01-01T00:00:20Z | 7                    | t1   |
| 2021-01-01T00:00:30Z | 17                   | t1   |
| 2021-01-01T00:00:40Z | 15                   | t1   |
| 2021-01-01T00:00:50Z | 4                    | t1   |

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 19                   | t2   |
| 2021-01-01T00:00:10Z | 4                    | t2   |
| 2021-01-01T00:00:20Z | 18446744073709551613 | t2   |
| 2021-01-01T00:00:30Z | 19                   | t2   |
| 2021-01-01T00:00:40Z | 13                   | t2   |
| 2021-01-01T00:00:50Z | 1                    | t2   |


#### Output data

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 18446744073709551614 | t1   |
| 2021-01-01T00:00:10Z | 10                   | t1   |
| 2021-01-01T00:00:20Z | 7                    | t1   |
| 2021-01-01T00:00:30Z | 17                   | t1   |
| 2021-01-01T00:00:40Z | 15                   | t1   |
| 2021-01-01T00:00:50Z | 4                    | t1   |

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 19                   | t2   |
| 2021-01-01T00:00:10Z | 4                    | t2   |
| 2021-01-01T00:00:20Z | 18446744073709551613 | t2   |
| 2021-01-01T00:00:30Z | 19                   | t2   |
| 2021-01-01T00:00:40Z | 13                   | t2   |
| 2021-01-01T00:00:50Z | 1                    | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
