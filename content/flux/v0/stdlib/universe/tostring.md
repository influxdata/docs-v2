---
title: toString() function
description: >
  `toString()` converts all values in the `_value` column to string types.
menu:
  flux_v0_ref:
    name: toString
    parent: universe
    identifier: universe/toString
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L4618-L4618

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`toString()` converts all values in the `_value` column to string types.



##### Function type signature

```js
(<-tables: stream[{A with _value: B}]) => stream[{A with _value: B, _value: string}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Convert the _value column to strings

```js
import "sampledata"

sampledata.float()
    |> toString()

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

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2.18   | t1   |
| 2021-01-01T00:00:10Z | 10.92   | t1   |
| 2021-01-01T00:00:20Z | 7.35    | t1   |
| 2021-01-01T00:00:30Z | 17.53   | t1   |
| 2021-01-01T00:00:40Z | 15.23   | t1   |
| 2021-01-01T00:00:50Z | 4.43    | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19.85   | t2   |
| 2021-01-01T00:00:10Z | 4.97    | t2   |
| 2021-01-01T00:00:20Z | -3.75   | t2   |
| 2021-01-01T00:00:30Z | 19.77   | t2   |
| 2021-01-01T00:00:40Z | 13.86   | t2   |
| 2021-01-01T00:00:50Z | 1.86    | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
