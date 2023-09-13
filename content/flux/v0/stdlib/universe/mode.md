---
title: mode() function
description: >
  `mode()` returns the non-null value or values that occur most often in a
  specified column in each input table.
menu:
  flux_v0_ref:
    name: mode
    parent: universe
    identifier: universe/mode
weight: 101
flux/v0.x/tags: [transformtions, aggregates]
introduced: 0.36.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L1850-L1853

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`mode()` returns the non-null value or values that occur most often in a
specified column in each input table.

If there are multiple modes, `mode()` returns all mode values in a sorted table.
If there is no mode, `mode()` returns `null`.

**Note**: `mode()` drops empty tables.

##### Function type signature

```js
(<-tables: stream[A], ?column: string) => stream[{B with _value: C}] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### column

Column to return the mode from. Default is `_value`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Return the mode of each input table

```js
import "sampledata"

sampledata.int()
    |> mode()

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

| *tag | _value  |
| ---- | ------- |
| t1   |         |

| *tag | _value  |
| ---- | ------- |
| t2   | 19      |

{{% /expand %}}
{{< /expand-wrapper >}}
