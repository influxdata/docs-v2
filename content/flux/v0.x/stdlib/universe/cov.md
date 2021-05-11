---
title: cov() function
description: The `cov()` function computes the covariance between two streams by first joining the streams, then performing the covariance operation.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/cov
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/cov/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/cov/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/cov/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/cov/
menu:
  flux_0_x_ref:
    name: cov
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

The `cov()` function computes the covariance between two streams by first joining the streams,
then performing the covariance operation.

_**Output data type:** Float_

```js
cov(x: table1, y: table2, on: ["_time", "_field"], pearsonr: false)
```

## Parameters

### x {data-type="stream of tables"}
({{< req >}})
First input stream used to calculate the covariance.

### y {data-type="stream of tables"}
({{< req >}})
Second input stream used to calculate the covariance.

### on {data-type="array of strings"}
({{< req >}})
List of columns to join on.

### pearsonr {data-type="bool"}
Normalize results to the Pearson R coefficient.
Default is `false`.

## Examples

```js
table1 = from(bucket: "example-bucket")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "measurement_1"
  )

table2 = from(bucket: "example-bucket")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "measurement_2"
  )

cov(x: table1, y: table2, on: ["_time", "_field"])
```

## Function definition
```js
cov = (x,y,on,pearsonr=false) =>
  join( tables:{x:x, y:y}, on:on )
    |> covariance(pearsonr:pearsonr, columns:["_value_x","_value_y"])
```
