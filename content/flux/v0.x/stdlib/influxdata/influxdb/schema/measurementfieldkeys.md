---
title: schema.measurementFieldKeys() function
description: The `schema.measurementFieldKeys()` function returns a list of fields in a measurement.
menu:
  flux_0_x_ref:
    name: schema.measurementFieldKeys
    parent: schema
weight: 301
flux/v0.x/tags: [metadata]
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/measurementfieldkeys/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-schema/measurementfieldkeys/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-schema/measurementfieldkeys/
related:
  - /{{< latest "influxdb" >}}/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-field-keys, SHOW FIELD KEYS in InfluxQL
introduced: 0.88.0
---

The `schema.measurementFieldKeys()` function returns a list of fields in a measurement.
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/schema"

schema.measurementFieldKeys(
    bucket: "example-bucket",
    measurement: "example-measurement",
    start: -30d,
)
```

{{% note %}}
#### Deleted fields
Fields [explicitly deleted from InfluxDB Cloud](/influxdb/cloud/write-data/delete-data/)
**do not** appear in results.

#### Expired fields
- **InfluxDB Cloud**: field keys associated with points outside of the bucket's
  retention policy **may** appear in results up to an hour after expiring.
- **InfluxDB OSS**: field keys associated with points outside of the bucket's
  retention policy **may** appear in results.
  For more information, see [Data retention in InfluxDB OSS](/{{< latest "influxdb" >}}/reference/internals/data-retention/).
{{% /note %}}

## Parameters

### bucket {data-type="string"}
Bucket to retrieve field keys from.

### measurement {data-type="string"}
Measurement to list field keys from.

### start {data-type="duration, time"}
Earliest time to include in results.
_Defaults to `-30d`._

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

### Return all field keys in a measurement
```js
import "influxdata/influxdb/schema"

schema.measurementFieldKeys(bucket: "example-bucket",  measurement: "example-measurement")
```

### Return all field keys in a measurement from a non-default time range
```js
import "influxdata/influxdb/schema"

schema.measurementFieldKeys(bucket: "example-bucket",  measurement: "example-measurement", start: -90d, stop: -60d)
```
