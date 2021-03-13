---
title: cov() function
description: The `cov()` function computes the covariance between two streams by first joining the streams, then performing the covariance operation.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/cov
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/cov/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/cov/
menu:
  influxdb_2_0_ref:
    name: cov
    parent: built-in-transformations
weight: 402
---

The `cov()` function computes the covariance between two streams by first joining the streams,
then performing the covariance operation.

_**Function type:** Transformation_  
_**Output data type:** Float_

```js
cov(x: table1, y: table2, on: ["_time", "_field"], pearsonr: false)
```

## Parameters

### x
One input stream used to calculate the covariance.

_**Data type:** Record_

### y
The other input table used to calculate the covariance.

_**Data type:** Record_

### on
The list of columns on which to join.

_**Data type:** Array of strings_

### pearsonr
Indicates whether the result should be normalized to be the Pearson R coefficient.

_**Data type:** Boolean_


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
