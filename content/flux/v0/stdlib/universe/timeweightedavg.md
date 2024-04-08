---
title: timeWeightedAvg() function
description: >
  `timeWeightedAvg()` returns the time-weighted average of non-null values in
  `_value` column as a float for each input table.
menu:
  flux_v0_ref:
    name: timeWeightedAvg
    parent: universe
    identifier: universe/timeWeightedAvg
weight: 101
flux/v0/tags: [transformations, aggregates]
introduced: 0.83.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3664-L3674

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`timeWeightedAvg()` returns the time-weighted average of non-null values in
`_value` column as a float for each input table.

Time is weighted using the linearly interpolated integral of values in the table.

##### Function type signature

```js
(<-tables: stream[A], unit: duration) => stream[{B with _value: float, _value: float, _stop: D, _start: C}] where A: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### unit
({{< req >}})
Unit of time to use to compute the time-weighted average.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Calculate the time-weighted average of values

```js
data
    |> timeWeightedAvg(unit: 1s)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 4       | t1   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z |         | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| *_start              | *_stop               | _value            | *tag |
| -------------------- | -------------------- | ----------------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 4.166666666666667 | t1   |

| *_start              | *_stop               | _value            | *tag |
| -------------------- | -------------------- | ----------------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 5.416666666666667 | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
