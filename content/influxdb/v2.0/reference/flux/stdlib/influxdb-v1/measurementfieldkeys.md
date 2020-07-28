---
title: v1.measurementFieldKeys() function
description: The `v1.measurementFieldKeys()` function returns a list of fields in a measurement.
menu:
  v2_0_ref:
    name: v1.measurementFieldKeys
    parent: InfluxDB v1
weight: 301
v2.0/tags: [fields]
related:
  - /v2.0/query-data/flux/explore-schema/
  - https://docs.influxdata.com/influxdb/latest/query_language/schema_exploration#show-field-keys, SHOW FIELD KEYS in InfluxQL
---

The `v1.measurementFieldKeys()` function returns a list of fields in a measurement.
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/v1"

v1.measurementFieldKeys(
  bucket: "example-bucket",
  measurement: "example-measurement",
  start: -30d
)
```

## Parameters

### bucket
The bucket to list field keys from.

_**Data type:** String_

### measurement
The measurement to list field keys from.

_**Data type:** String_

### start
The oldest time to include in results.
_Defaults to `-30d`._

Relative start times are defined using negative durations.
Negative durations are relative to now.
Absolute start times are defined using timestamps.

_**Data type:** Duration_

## Examples
```js
import "influxdata/influxdb/v1"

v1.measurementFieldKeys(
  bucket: "telegraf",
  measurement: "cpu",
)
```

## Function definition
```js
package v1

measurementFieldKeys = (bucket, measurement, start=-30d) =>
  fieldKeys(bucket: bucket, predicate: (r) => r._measurement == measurement, start: start)
```

_**Used functions:**
[v1.fieldKeys](/v2.0/reference/flux/stdlib/influxdb-v1/fieldkeys/)_
