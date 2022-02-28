---
title: schema.measurementTagValues() function
description: The schema.measurementTagValues() function returns a list of tag values for a specific measurement.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/measurementtagvalues/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-schema/measurementtagvalues/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-schema/measurementtagvalues/
menu:
  flux_0_x_ref:
    name: schema.measurementTagValues
    parent: schema
weight: 301
flux/v0.x/tags: [metadata]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-tag-values, SHOW TAG VALUES in InfluxQL
introduced: 0.88.0
---

The `schema.measurementTagValues()` function returns a list of tag values for a specific measurement.
The return value is always a single table with a single column, `_value`.



```js
import "influxdata/influxdb/schema"

schema.measurementTagValues(
    bucket: "example-bucket",
    measurement: "cpu",
    tag: "host",
)
```

## Parameters

### bucket {data-type="string"}
Bucket to return tag values from for a specific measurement.

### measurement {data-type="string"}
Measurement to return tag values from.

### tag {data-type="string"}
Tag to return all unique values from.

### start {data-type="duration, time"}
Earliest time to include in results.
_Default is `-30d`._

Relative start times are defined using negative durations.
Negative durations are relative to now.
Absolute start times are defined using [time values](/flux/v0.x/spec/types/#time-types).

### stop {data-type="duration, time"}
Latest time to include in results.
_Default is `now()`._

The `stop` time is exclusive, meaning values with a time equal to stop time are
excluded from results.
Relative start times are defined using negative durations.
Negative durations are relative to `now()`.
Absolute start times are defined using [time values](/flux/v0.x/spec/types/#time-types).

## Examples

### Return all values for a tag in a measurement
```js
import "influxdata/influxdb/schema"

schema.measurementTagValues(bucket: "example-bucket", measurement: "example-measurement", tag: "host")
```

### Return all tag values in a measurement during a non-default time range
```js
import "influxdata/influxdb/schema"

schema.measurementTagValues(
    bucket: "example-bucket",
    measurement: "example-measurement",
    tag: "host",
    start: -90d,
    stop: -60d,
)
```
