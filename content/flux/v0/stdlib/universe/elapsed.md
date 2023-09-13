---
title: elapsed() function
description: >
  `elapsed()` returns the time between subsequent records.
menu:
  flux_v0_ref:
    name: elapsed
    parent: universe
    identifier: universe/elapsed
weight: 101
flux/v0.x/tags: [transformations]
introduced: 0.36.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L525-L533

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`elapsed()` returns the time between subsequent records.

For each input table, `elapsed()` returns the same table without the first row
(because there is no previous time to derive the elapsed time from) and an
additional column containing the elapsed time.

##### Function type signature

```js
(<-tables: stream[A], ?columnName: string, ?timeColumn: string, ?unit: duration) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### unit

Unit of time used in the calculation. Default is `1s`.



### timeColumn

Column to use to compute the elapsed time. Default is `_time`.



### columnName

Column to store elapsed times in. Default is `elapsed`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Calculate the time between points in seconds

```js
import "sampledata"

sampledata.int()
    |> elapsed(unit: 1s)

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

| _time                | _value  | *tag | elapsed  |
| -------------------- | ------- | ---- | -------- |
| 2021-01-01T00:00:10Z | 10      | t1   | 10       |
| 2021-01-01T00:00:20Z | 7       | t1   | 10       |
| 2021-01-01T00:00:30Z | 17      | t1   | 10       |
| 2021-01-01T00:00:40Z | 15      | t1   | 10       |
| 2021-01-01T00:00:50Z | 4       | t1   | 10       |

| _time                | _value  | *tag | elapsed  |
| -------------------- | ------- | ---- | -------- |
| 2021-01-01T00:00:10Z | 4       | t2   | 10       |
| 2021-01-01T00:00:20Z | -3      | t2   | 10       |
| 2021-01-01T00:00:30Z | 19      | t2   | 10       |
| 2021-01-01T00:00:40Z | 13      | t2   | 10       |
| 2021-01-01T00:00:50Z | 1       | t2   | 10       |

{{% /expand %}}
{{< /expand-wrapper >}}
