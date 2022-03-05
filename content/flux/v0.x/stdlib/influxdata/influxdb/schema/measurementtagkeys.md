---
title: schema.measurementTagKeys() function
description: The schema.measurementTagKeys() function returns a list of tag keys for a specific measurement.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/measurementtagkeys/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-schema/measurementtagkeys/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-schema/measurementtagkeys/
menu:
  flux_0_x_ref:
    name: schema.measurementTagKeys
    parent: schema
weight: 301
flux/v0.x/tags: [metadata]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-tag-keys, SHOW TAG KEYS in InfluxQL
introduced: 0.88.0
---

The `schema.measurementTagKeys()` function returns a list of tag keys for a specific measurement.
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/schema"

schema.measurementTagKeys(
    bucket: "example-bucket",
    measurement: "cpu",
)
```

{{% note %}}
#### Deleted tags
Tags [explicitly deleted from InfluxDB](/{{< latest "influxdb" >}}/write-data/delete-data/)
**do not** appear in results.

#### Expired tags
- **InfluxDB Cloud**: tags associated with points outside of the bucket's
  retention policy **do not** appear in results.
- **InfluxDB OSS**: tags associated with points outside of the bucket's
  retention policy **may** appear in results.
  For more information, see [Data retention in InfluxDB OSS](/{{< latest "influxdb" >}}/reference/internals/data-retention/).
{{% /note %}}

## Parameters

### bucket {data-type="string"}
Bucket to return tag keys from for a specific measurement.

### measurement {data-type="string"}
Measurement to return tag keys from.

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

### Return all tag keys in a measurement
```js
import "influxdata/influxdb/schema"

schema.measurementTagKeys(bucket: "example-bucket", measurement: "example-measurement")
```

### Return all tag keys in a measurement during a non-default time range
```js
import "influxdata/influxdb/schema"

schema.measurementTagKeys(bucket: "example-bucket", measurement: "example-measurement", start: -90d, stop: -60d)
```
