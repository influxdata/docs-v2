---
title: aggregate.rate() function
description: >
  `aggregate.rate()` calculates the average rate of increase per window of time for each
  input table.
menu:
  flux_v0_ref:
    name: aggregate.rate
    parent: experimental/aggregate
    identifier: experimental/aggregate/rate
weight: 201
flux/v0/tags: [transformations, aggregates]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/aggregate/aggregate.flux#L46-L57

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`aggregate.rate()` calculates the average rate of increase per window of time for each
input table.

`aggregate.rate()` requires that input data have `_start` and `_stop` columns
to calculate windows of time to operate on.
Use `range()` to assign `_start` and `_stop` values.

This function is designed to replicate the
[Prometheus `rate()` function](https://prometheus.io/docs/prometheus/latest/querying/functions/#rate)
and should only be used with [counters](/flux/v0/prometheus/metric-types/counter/).

##### Function type signature

```js
(<-tables: stream[A], every: duration, ?groupColumns: [string], ?unit: duration) => stream[B] where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### every
({{< req >}})
Duration of time windows.



### groupColumns

List of columns to group by. Default is `[]`.



### unit

Time duration to use when calculating the rate. Default is `1s`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Calculate the average rate of change in data

```js
import "experimental/aggregate"
import "sampledata"

data =
    sampledata.int()
        |> range(start: sampledata.start, stop: sampledata.stop)

data
    |> aggregate.rate(every: 30s, unit: 1s, groupColumns: ["tag"])

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 4       | t1   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| *_start              | *_stop               | *tag | _value  | _time                |
| -------------------- | -------------------- | ---- | ------- | -------------------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1   | 1.2     | 2021-01-01T00:00:30Z |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1   | 1       | 2021-01-01T00:01:00Z |

| *_start              | *_stop               | *tag | _value  | _time                |
| -------------------- | -------------------- | ---- | ------- | -------------------- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2   |         | 2021-01-01T00:00:30Z |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2   | 2.2     | 2021-01-01T00:01:00Z |

{{% /expand %}}
{{< /expand-wrapper >}}
