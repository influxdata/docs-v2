---
title: interpolate.linear() function
description: >
  `interpolate.linear()` inserts rows at regular intervals using linear interpolation to
  determine values for inserted rows.
menu:
  flux_v0_ref:
    name: interpolate.linear
    parent: interpolate
    identifier: interpolate/linear
weight: 101
flux/v0/tags: [transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/interpolate/interpolate.flux#L45-L48

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`interpolate.linear()` inserts rows at regular intervals using linear interpolation to
determine values for inserted rows.

### Function requirements
- Input data must have `_time` and `_value` columns.
- All columns other than `_time` and `_value` must be part of the group key.

##### Function type signature

```js
(<-tables: stream[{A with _value: float, _time: time}], every: duration) => stream[{A with _value: float, _time: time}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### every
({{< req >}})
Duration of time between interpolated points.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Interpolate missing data by day

```js
import "interpolate"

data
    |> interpolate.linear(every: 1d)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  |
| -------------------- | ------- |
| 2021-01-01T00:00:00Z | 10      |
| 2021-01-02T00:00:00Z | 20      |
| 2021-01-04T00:00:00Z | 40      |
| 2021-01-05T00:00:00Z | 50      |
| 2021-01-08T00:00:00Z | 80      |
| 2021-01-09T00:00:00Z | 90      |


#### Output data

| _time                | _value  |
| -------------------- | ------- |
| 2021-01-01T00:00:00Z | 10      |
| 2021-01-02T00:00:00Z | 20      |
| 2021-01-03T00:00:00Z | 30      |
| 2021-01-04T00:00:00Z | 40      |
| 2021-01-05T00:00:00Z | 50      |
| 2021-01-06T00:00:00Z | 60      |
| 2021-01-07T00:00:00Z | 70      |
| 2021-01-08T00:00:00Z | 80      |
| 2021-01-09T00:00:00Z | 90      |

{{% /expand %}}
{{< /expand-wrapper >}}
