---
title: truncateTimeColumn() function
description: >
  `truncateTimeColumn()` truncates all input time values in the `_time` to a
  specified unit.
menu:
  flux_v0_ref:
    name: truncateTimeColumn
    parent: universe
    identifier: universe/truncateTimeColumn
weight: 101
flux/v0/tags: [transformations, date/time]
introduced: 0.37.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L4595-L4597

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`truncateTimeColumn()` truncates all input time values in the `_time` to a
specified unit.

#### Truncate to weeks
When truncating a time value to the week (`1w`), weeks are determined using the
**Unix epoch (1970-01-01T00:00:00Z UTC)**. The Unix epoch was on a Thursday,
so all calculated weeks begin on Thursday.

##### Function type signature

```js
(<-tables: stream[{B with _time: C}], unit: duration, ?timeColumn: A) => stream[{B with _time: C, _time: time}] where C: Timeable
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### unit
({{< req >}})
Unit of time to truncate to.

**Example units:**
- 1ns (nanosecond)
- 1us (microsecond)
- 1ms (millisecond)
- 1s (second)
- 1m (minute)
- 1h (hour)
- 1d (day)
- 1w (week)
- 1mo (month)
- 1y (year)

### timeColumn

Time column to truncate. Default is `_time`.

**Note:** Currently, assigning a custom value to this parameter will have
no effect.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Truncate all time values to the minute

```js
import "sampledata"

sampledata.int()
    |> truncateTimeColumn(unit: 1m)

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
| 2021-01-01T00:00:00Z | 10      | t1   |
| 2021-01-01T00:00:00Z | 7       | t1   |
| 2021-01-01T00:00:00Z | 17      | t1   |
| 2021-01-01T00:00:00Z | 15      | t1   |
| 2021-01-01T00:00:00Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 4       | t2   |
| 2021-01-01T00:00:00Z | -3      | t2   |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 13      | t2   |
| 2021-01-01T00:00:00Z | 1       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
