---
title: experimental.alignTime() function
description: >
  `experimental.alignTime()` shifts time values in input tables to all start at a common start time.
menu:
  flux_v0_ref:
    name: experimental.alignTime
    parent: experimental
    identifier: experimental/alignTime
weight: 101
flux/v0.x/tags: [transformations, date/time]
introduced: 0.66.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L495-L499

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.alignTime()` shifts time values in input tables to all start at a common start time.



##### Function type signature

```js
(<-tables: stream[B], ?alignTo: A) => stream[C] where B: Record, C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### alignTo

Time to align tables to. Default is `1970-01-01T00:00:00Z`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Compare month-over-month values

1. Window data by calendar month creating two separate tables (one for January and one for February).
2. Align tables to `2021-01-01T00:00:00Z`.

Each output table represents data from a calendar month.
When visualized, data is still grouped by month, but timestamps are aligned
to a common start time and values can be compared by time.

```js
import "experimental"

data
    |> window(every: 1mo)
    |> experimental.alignTime(alignTo: 2021-01-01T00:00:00Z)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_start              | *_stop               | _time                | _value  |
| -------------------- | -------------------- | -------------------- | ------- |
| 2021-01-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-01-01T00:00:00Z | 32.1    |
| 2021-01-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-01-02T00:00:00Z | 32.9    |
| 2021-01-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-01-03T00:00:00Z | 33.2    |
| 2021-01-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-01-04T00:00:00Z | 34      |
| 2021-01-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-02-01T00:00:00Z | 38.3    |
| 2021-01-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-02-02T00:00:00Z | 38.4    |
| 2021-01-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-02-03T00:00:00Z | 37.8    |
| 2021-01-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-02-04T00:00:00Z | 37.5    |


#### Output data

| *_start              | *_stop               | _time                | _value  |
| -------------------- | -------------------- | -------------------- | ------- |
| 2021-01-01T00:00:00Z | 2021-02-01T00:00:00Z | 2021-01-01T00:00:00Z | 32.1    |
| 2021-01-01T00:00:00Z | 2021-02-01T00:00:00Z | 2021-01-02T00:00:00Z | 32.9    |
| 2021-01-01T00:00:00Z | 2021-02-01T00:00:00Z | 2021-01-03T00:00:00Z | 33.2    |
| 2021-01-01T00:00:00Z | 2021-02-01T00:00:00Z | 2021-01-04T00:00:00Z | 34      |

| *_start              | *_stop               | _time                | _value  |
| -------------------- | -------------------- | -------------------- | ------- |
| 2021-02-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-01-01T00:00:00Z | 38.3    |
| 2021-02-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-01-02T00:00:00Z | 38.4    |
| 2021-02-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-01-03T00:00:00Z | 37.8    |
| 2021-02-01T00:00:00Z | 2021-03-01T00:00:00Z | 2021-01-04T00:00:00Z | 37.5    |

{{% /expand %}}
{{< /expand-wrapper >}}
