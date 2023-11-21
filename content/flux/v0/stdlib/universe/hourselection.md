---
title: hourSelection() function
description: >
  `hourSelection()` filters rows by time values in a specified hour range.
menu:
  flux_v0_ref:
    name: hourSelection
    parent: universe
    identifier: universe/hourSelection
weight: 101
flux/v0/tags: [transformations, date/time, filters]
introduced: 0.39.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L1043-L1051

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`hourSelection()` filters rows by time values in a specified hour range.



##### Function type signature

```js
(
    <-tables: stream[A],
    start: int,
    stop: int,
    ?location: {zone: string, offset: duration},
    ?timeColumn: string,
) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### start
({{< req >}})
First hour of the hour range (inclusive). Hours range from `[0-23]`.



### stop
({{< req >}})
Last hour of the hour range (inclusive). Hours range from `[0-23]`.



### location

Location used to determine timezone. Default is the `location` option.



### timeColumn

Column that contains the time value. Default is `_time`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Filter by business hours

```js
data
    |> hourSelection(start: 9, stop: 17)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | tag  | _value  |
| -------------------- | ---- | ------- |
| 2022-01-01T05:00:00Z | t1   | -2      |
| 2022-01-01T09:00:10Z | t1   | 10      |
| 2022-01-01T11:00:20Z | t1   | 7       |
| 2022-01-01T16:00:30Z | t1   | 17      |
| 2022-01-01T19:00:40Z | t1   | 15      |
| 2022-01-01T20:00:50Z | t1   | 4       |


#### Output data

| _time                | tag  | _value  |
| -------------------- | ---- | ------- |
| 2022-01-01T09:00:10Z | t1   | 10      |
| 2022-01-01T11:00:20Z | t1   | 7       |
| 2022-01-01T16:00:30Z | t1   | 17      |

{{% /expand %}}
{{< /expand-wrapper >}}
