---
title: schema.fieldKeys() function
description: The `schema.fieldKeys()` function returns field keys in a bucket.
menu:
  flux_0_x_ref:
    name: schema.fieldKeys
    parent: schema
weight: 301
flux/v0.x/tags: [metadata]
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/fieldkeys
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-schema/fieldkeys/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-schema/fieldkeys/
related:
  - /{{< latest "influxdb" >}}/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-field-keys, SHOW FIELD KEYS in InfluxQL
introduced: 0.88.0
---

The `schema.fieldKeys()` function returns [field keys](/{{< latest "influxdb" >}}/reference/glossary/#field-key) in a bucket.
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/schema"

schema.fieldKeys(
    bucket: "example-bucket",
    predicate: (r) => true,
    start: -30d,
)
```

{{% note %}}
#### Deleted fields
Fields [deleted from InfluxDB Cloud using the `/api/v2/delete` endpoint or the `influx delete` command](/influxdb/cloud/write-data/delete-data/)
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
Bucket to list field keys from.

### predicate {data-type="function"}
Predicate function that filters field keys.
_Default is `(r) => true`._

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

### Return all field keys in a bucket
```js
import "influxdata/influxdb/schema"

schema.fieldKeys(bucket: "example-bucket")
```

### Return all field keys in a bucket from a non-default time range
```js
import "influxdata/influxdb/schema"

schema.fieldKeys(bucket: "example-bucket", start: -90d, stop: -60d)
```
