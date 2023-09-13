---
title: toTime() function
description: >
  `toTime()` converts all values in the `_value` column to time types.
menu:
  flux_v0_ref:
    name: toTime
    parent: universe
    identifier: universe/toTime
weight: 101
flux/v0.x/tags: [transformations, type-conversions]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L4809-L4809

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`toTime()` converts all values in the `_value` column to time types.

#### Supported data types
- string (RFC3339 timestamp)
- int
- uint

`toTime()` treats all numeric input values as nanosecond epoch timestamps.

##### Function type signature

```js
(<-tables: stream[{A with _value: B}]) => stream[{A with _value: B, _value: time}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Convert an integer _value column to times

```js
data
    |> toTime()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value             | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:00Z | -20000000000000000 | t1   |
| 2021-01-01T00:00:10Z | 100000000000000000 | t1   |
| 2021-01-01T00:00:20Z | 70000000000000000  | t1   |
| 2021-01-01T00:00:30Z | 170000000000000000 | t1   |
| 2021-01-01T00:00:40Z | 150000000000000000 | t1   |
| 2021-01-01T00:00:50Z | 40000000000000000  | t1   |

| _time                | _value             | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:00Z | 190000000000000000 | t2   |
| 2021-01-01T00:00:10Z | 40000000000000000  | t2   |
| 2021-01-01T00:00:20Z | -30000000000000000 | t2   |
| 2021-01-01T00:00:30Z | 190000000000000000 | t2   |
| 2021-01-01T00:00:40Z | 130000000000000000 | t2   |
| 2021-01-01T00:00:50Z | 10000000000000000  | t2   |


#### Output data

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 1969-05-14T12:26:40Z | t1   |
| 2021-01-01T00:00:10Z | 1973-03-03T09:46:40Z | t1   |
| 2021-01-01T00:00:20Z | 1972-03-21T04:26:40Z | t1   |
| 2021-01-01T00:00:30Z | 1975-05-22T14:13:20Z | t1   |
| 2021-01-01T00:00:40Z | 1974-10-03T02:40:00Z | t1   |
| 2021-01-01T00:00:50Z | 1971-04-08T23:06:40Z | t1   |

| _time                | _value               | *tag |
| -------------------- | -------------------- | ---- |
| 2021-01-01T00:00:00Z | 1976-01-09T01:46:40Z | t2   |
| 2021-01-01T00:00:10Z | 1971-04-08T23:06:40Z | t2   |
| 2021-01-01T00:00:20Z | 1969-01-18T18:40:00Z | t2   |
| 2021-01-01T00:00:30Z | 1976-01-09T01:46:40Z | t2   |
| 2021-01-01T00:00:40Z | 1974-02-13T15:06:40Z | t2   |
| 2021-01-01T00:00:50Z | 1970-04-26T17:46:40Z | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
