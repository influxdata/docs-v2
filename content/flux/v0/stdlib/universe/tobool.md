---
title: toBool() function
description: >
  `toBool()` converts all values in the `_value` column to boolean types.
menu:
  flux_v0_ref:
    name: toBool
    parent: universe
    identifier: universe/toBool
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L4778-L4778

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`toBool()` converts all values in the `_value` column to boolean types.

#### Supported data types
- **string**: `true` or `false`
- **int**: `1` or `0`
- **uint**: `1` or `0`
- **float**: `1.0` or `0.0`

##### Function type signature

```js
(<-tables: stream[{A with _value: B}]) => stream[{A with _value: B, _value: bool}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Convert an integer _value column to booleans

```js
import "sampledata"

sampledata.numericBool()
    |> toBool()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

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


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | true    | t1   |
| 2021-01-01T00:00:10Z | true    | t1   |
| 2021-01-01T00:00:20Z | false   | t1   |
| 2021-01-01T00:00:30Z | true    | t1   |
| 2021-01-01T00:00:40Z | false   | t1   |
| 2021-01-01T00:00:50Z | false   | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | false   | t2   |
| 2021-01-01T00:00:10Z | true    | t2   |
| 2021-01-01T00:00:20Z | false   | t2   |
| 2021-01-01T00:00:30Z | true    | t2   |
| 2021-01-01T00:00:40Z | true    | t2   |
| 2021-01-01T00:00:50Z | false   | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
