---
title: schema.measurements() function
description: The schema.measurements() function returns a list of measurements in a specific bucket.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/measurements/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-schema/measurements/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-schema/measurements/
menu:
  flux_0_x_ref:
    name: schema.measurements
    parent: schema
weight: 301
flux/v0.x/tags: [metadata]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-measurements, SHOW MEASUREMENTS in InfluxQL
introduced: 0.88.0
---

The `schema.measurements()` function returns a list of measurements in a specific bucket.
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/schema"

schema.measurements(bucket: "example-bucket")
```

## Parameters

### bucket {data-type="string"}
Bucket to retrieve measurements from.

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

### Return all measurements in a bucket
```js
import "influxdata/influxdb/schema"

measurements(bucket: "example-bucket")
```

### Return all measurements in a bucket from a non-default time range
```js
import "influxdata/influxdb/schema"

measurements(bucket: "example-bucket", start: -90d, stop: -60d)
```
