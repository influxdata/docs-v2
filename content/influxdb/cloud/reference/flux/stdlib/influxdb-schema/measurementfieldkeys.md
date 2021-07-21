---
title: schema.measurementFieldKeys() function
description: The `schema.measurementFieldKeys()` function returns a list of fields in a measurement.
menu:
  influxdb_cloud_ref:
    name: schema.measurementFieldKeys
    parent: InfluxDB schema
weight: 301
influxdb/v2.0/tags: [fields]
aliases:
  - /influxdb/cloud/reference/flux/functions/influxdb-v1/measurementfieldkeys/
related:
  - /influxdb/cloud/query-data/flux/explore-schema/
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
  start: -30d
)
```

## Parameters

### bucket
Bucket to retrieve field keys from.

_**Data type:** String_

### measurement
Measurement to list field keys from.

_**Data type:** String_

### start
Oldest time to include in results.
_Defaults to `-30d`._

Relative start times are defined using negative durations.
Negative durations are relative to now.
Absolute start times are defined using [time values](/influxdb/cloud/reference/flux/language/types/#time-types).

_**Data type:** Duration_

## Examples
```js
import "influxdata/influxdb/schema"

schema.measurementFieldKeys(
  bucket: "telegraf",
  measurement: "cpu",
)
```

## Function definition
```js
package schema

measurementFieldKeys = (bucket, measurement, start=-30d) =>
  fieldKeys(bucket: bucket, predicate: (r) => r._measurement == measurement, start: start)
```

_**Used functions:**
[schema.fieldKeys](/influxdb/cloud/reference/flux/stdlib/influxdb-schema/fieldkeys/)_
