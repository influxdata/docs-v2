---
title: toFloat() function
description: >
  `toFloat()` converts all values in the `_value` column to float types.
menu:
  flux_v0_ref:
    name: toFloat
    parent: universe
    identifier: universe/toFloat
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L4751-L4751

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`toFloat()` converts all values in the `_value` column to float types.

#### Supported data types
- string (numeric, scientific notation, ±Inf, or NaN)
- boolean
- int
- uint

##### Function type signature

```js
(<-tables: stream[{A with _value: B}]) => stream[{A with _value: B, _value: float}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Convert an integer _value column to floats](#convert-an-integer-_value-column-to-floats)
- [Convert a boolean _value column to floats](#convert-a-boolean-_value-column-to-floats)

### Convert an integer _value column to floats

```js
import "sampledata"

sampledata.int()
    |> toFloat()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Convert a boolean _value column to floats

```js
import "sampledata"

sampledata.bool()
    |> toFloat()

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

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t1   | 1       |
| 2021-01-01T00:00:10Z | t1   | 1       |
| 2021-01-01T00:00:20Z | t1   | 0       |
| 2021-01-01T00:00:30Z | t1   | 1       |
| 2021-01-01T00:00:40Z | t1   | 0       |
| 2021-01-01T00:00:50Z | t1   | 0       |

| _time                | *tag | _value  |
| -------------------- | ---- | ------- |
| 2021-01-01T00:00:00Z | t2   | 0       |
| 2021-01-01T00:00:10Z | t2   | 1       |
| 2021-01-01T00:00:20Z | t2   | 0       |
| 2021-01-01T00:00:30Z | t2   | 1       |
| 2021-01-01T00:00:40Z | t2   | 1       |
| 2021-01-01T00:00:50Z | t2   | 0       |

{{% /expand %}}
{{< /expand-wrapper >}}
