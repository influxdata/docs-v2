---
title: geo.s2CellIDToken() function
description: >
  `geo.s2CellIDToken()` returns and S2 cell ID token for given cell or point at a
  specified S2 cell level.
menu:
  flux_v0_ref:
    name: geo.s2CellIDToken
    parent: experimental/geo
    identifier: experimental/geo/s2CellIDToken
weight: 201
flux/v0.x/tags: [geotemporal]
introduced: 0.64.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/geo/geo.flux#L477-L477

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`geo.s2CellIDToken()` returns and S2 cell ID token for given cell or point at a
specified S2 cell level.



##### Function type signature

```js
(level: int, ?point: {lon: float, lat: float}, ?token: string) => string
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### token

S2 cell ID token to update.

Useful for changing the S2 cell level of an existing S2 cell ID token.

### point

Record with `lat` and `lon` properties that specify the latitude and
longitude in decimal degrees (WGS 84) of a point.



### level
({{< req >}})
S2 cell level to use when generating the S2 cell ID token.




## Examples

- [Use latitude and longitude values to generate S2 cell ID tokens](#use-latitude-and-longitude-values-to-generate-s2-cell-id-tokens)
- [Update S2 cell ID token level](#update-s2-cell-id-token-level)

### Use latitude and longitude values to generate S2 cell ID tokens

```js
import "experimental/geo"

data
    |> map(
        fn: (r) =>
            ({r with s2_cell_id: geo.s2CellIDToken(point: {lat: r.lat, lon: r.lon}, level: 10)}),
    )

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *id   | lon     | lat      |
| -------------------- | ----- | ------- | -------- |
| 2021-01-01T00:00:00Z | a213b | 39.7515 | 14.01433 |
| 2021-01-02T01:00:00Z | a213b | 38.3527 | 13.9228  |
| 2021-01-03T02:00:00Z | a213b | 36.9978 | 15.08433 |

| _time                | *id   | lon     | lat      |
| -------------------- | ----- | ------- | -------- |
| 2021-01-01T00:00:00Z | b546c | 24.0069 | -14.5464 |
| 2021-01-02T01:00:00Z | b546c | 25.1304 | -13.3338 |
| 2021-01-03T02:00:00Z | b546c | 26.7899 | -12.0433 |


#### Output data

| _time                | *id   | lat      | lon     | s2_cell_id  |
| -------------------- | ----- | -------- | ------- | ----------- |
| 2021-01-01T00:00:00Z | a213b | 14.01433 | 39.7515 | 166b59      |
| 2021-01-02T01:00:00Z | a213b | 13.9228  | 38.3527 | 16696d      |
| 2021-01-03T02:00:00Z | a213b | 15.08433 | 36.9978 | 166599      |

| _time                | *id   | lat      | lon     | s2_cell_id  |
| -------------------- | ----- | -------- | ------- | ----------- |
| 2021-01-01T00:00:00Z | b546c | -14.5464 | 24.0069 | 1960d7      |
| 2021-01-02T01:00:00Z | b546c | -13.3338 | 25.1304 | 1965c7      |
| 2021-01-03T02:00:00Z | b546c | -12.0433 | 26.7899 | 1971dd      |

{{% /expand %}}
{{< /expand-wrapper >}}

### Update S2 cell ID token level

```js
import "experimental/geo"

data
    |> map(fn: (r) => ({r with s2_cell_id: geo.s2CellIDToken(token: r.s2_cell_id, level: 5)}))

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *id   | s2_cell_id  |
| -------------------- | ----- | ----------- |
| 2021-01-01T00:00:00Z | a213b | 166b59      |
| 2021-01-02T01:00:00Z | a213b | 16696d      |
| 2021-01-03T02:00:00Z | a213b | 166599      |

| _time                | *id   | s2_cell_id  |
| -------------------- | ----- | ----------- |
| 2021-01-01T00:00:00Z | b546c | 1960d7      |
| 2021-01-02T01:00:00Z | b546c | 1965c7      |
| 2021-01-03T02:00:00Z | b546c | 1971dd      |


#### Output data

| _time                | *id   | s2_cell_id  |
| -------------------- | ----- | ----------- |
| 2021-01-01T00:00:00Z | a213b | 166c        |
| 2021-01-02T01:00:00Z | a213b | 166c        |
| 2021-01-03T02:00:00Z | a213b | 1664        |

| _time                | *id   | s2_cell_id  |
| -------------------- | ----- | ----------- |
| 2021-01-01T00:00:00Z | b546c | 1964        |
| 2021-01-02T01:00:00Z | b546c | 1964        |
| 2021-01-03T02:00:00Z | b546c | 1974        |

{{% /expand %}}
{{< /expand-wrapper >}}
