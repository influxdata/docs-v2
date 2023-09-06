---
title: geo.asTracks() function
description: >
  `geo.asTracks()` groups rows into tracks (sequential, related data points).
menu:
  flux_v0_ref:
    name: geo.asTracks
    parent: experimental/geo
    identifier: experimental/geo/asTracks
weight: 201
flux/v0.x/tags: [transformations, geotemporal]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L1008-L1011

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.asTracks()` groups rows into tracks (sequential, related data points).



##### Function type signature

```js
(<-tables: stream[A], ?groupBy: [string], ?orderBy: [string]) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### groupBy

Columns to group by. These columns should uniquely identify each track.
Default is `["id","tid"]`.



### orderBy

Columns to order results by. Default is `["_time"]`.

Sort precedence is determined by list order (left to right).

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Group geotemporal data into tracks](#group-geotemporal-data-into-tracks)
- [Group geotemporal data into tracks and sort by specified columns](#group-geotemporal-data-into-tracks-and-sort-by-specified-columns)

### Group geotemporal data into tracks

```js
import "experimental/geo"

data
    |> geo.asTracks()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | id    | lat      | lon      |
| -------------------- | ----- | -------- | -------- |
| 2021-01-01T00:00:00Z | a213b | 14.01433 | -14.5464 |
| 2021-01-02T01:00:00Z | a213b | 13.9228  | -13.3338 |
| 2021-01-03T02:00:00Z | a213b | 15.08433 | -12.0433 |
| 2021-01-01T00:00:00Z | b546c | 14.01433 | 39.7515  |
| 2021-01-02T01:00:00Z | b546c | 13.9228  | 38.3527  |
| 2021-01-03T02:00:00Z | b546c | 15.08433 | 36.9978  |


#### Output data

| _time                | *id   | lat      | lon      |
| -------------------- | ----- | -------- | -------- |
| 2021-01-01T00:00:00Z | a213b | 14.01433 | -14.5464 |
| 2021-01-02T01:00:00Z | a213b | 13.9228  | -13.3338 |
| 2021-01-03T02:00:00Z | a213b | 15.08433 | -12.0433 |

| _time                | *id   | lat      | lon     |
| -------------------- | ----- | -------- | ------- |
| 2021-01-01T00:00:00Z | b546c | 14.01433 | 39.7515 |
| 2021-01-02T01:00:00Z | b546c | 13.9228  | 38.3527 |
| 2021-01-03T02:00:00Z | b546c | 15.08433 | 36.9978 |

{{% /expand %}}
{{< /expand-wrapper >}}

### Group geotemporal data into tracks and sort by specified columns

```js
import "experimental/geo"

data
    |> geo.asTracks(orderBy: ["lat", "lon"])

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | id    | lat      | lon      |
| -------------------- | ----- | -------- | -------- |
| 2021-01-01T00:00:00Z | a213b | 14.01433 | -14.5464 |
| 2021-01-02T01:00:00Z | a213b | 13.9228  | -13.3338 |
| 2021-01-03T02:00:00Z | a213b | 15.08433 | -12.0433 |
| 2021-01-01T00:00:00Z | b546c | 14.01433 | 39.7515  |
| 2021-01-02T01:00:00Z | b546c | 13.9228  | 38.3527  |
| 2021-01-03T02:00:00Z | b546c | 15.08433 | 36.9978  |


#### Output data

| _time                | *id   | lat      | lon      |
| -------------------- | ----- | -------- | -------- |
| 2021-01-02T01:00:00Z | a213b | 13.9228  | -13.3338 |
| 2021-01-01T00:00:00Z | a213b | 14.01433 | -14.5464 |
| 2021-01-03T02:00:00Z | a213b | 15.08433 | -12.0433 |

| _time                | *id   | lat      | lon     |
| -------------------- | ----- | -------- | ------- |
| 2021-01-02T01:00:00Z | b546c | 13.9228  | 38.3527 |
| 2021-01-01T00:00:00Z | b546c | 14.01433 | 39.7515 |
| 2021-01-03T02:00:00Z | b546c | 15.08433 | 36.9978 |

{{% /expand %}}
{{< /expand-wrapper >}}
