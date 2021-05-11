---
title: query.filterMeasurement() function
description: >
  The `query.filterMeasurement()` function filters input data by measurement.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/query/filtermeasurement/
  - /influxdb/cloud/reference/flux/stdlib/experimental/query/filtermeasurement/
menu:
  flux_0_x_ref:
    name: query.filterMeasurement
    parent: query
weight: 401
flux/v0.x/tags: [transformations]
introduced: 0.60.0
---

The `query.filterMeasurement()` function filters input data by measurement.

_**Function type:** Transformation_

```js
import "experimental/query"

query.filterMeasurement(
  measurement: "example-measurement"
)
```

## Parameters

### measurement {data-type="string"}
The name of the measurement to filter by.
Must be an exact string match.

## Examples

```js
import "experimental/query"

query.fromRange(bucket: "example-bucket", start: -1h)
  |> query.filterMeasurement(
    measurement: "example-measurement"
  )
```

## Function definition
```js
package query

filterMeasurement = (tables=<-, measurement) =>
  tables
    |> filter(fn: (r) => r._measurement == measurement)
```

_**Used functions:**_  
[filter()](/flux/v0.x/stdlib/universe/filter/)
