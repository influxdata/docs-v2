---
title: v1.measurementFieldKeys() function
description: The `v1.measurementFieldKeys()` function returns a list of fields in a measurement.
menu:
  flux_0_x_ref:
    name: v1.measurementFieldKeys
    parent: v1
weight: 301
flux/v0.x/tags: [metadata]
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/measurementfieldkeys/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/measurementfieldkeys/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/measurementfieldkeys/
related:
  - /{{< latest "influxdb" >}}/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-field-keys, SHOW FIELD KEYS in InfluxQL
introduced: 0.68.0
deprecated: 0.88.0
---

{{% warn %}}
`v1.measurementFieldKeys()` was deprecated in **Flux v0.88.0** in favor of
[`schema.measurementFieldKeys()`](/flux/v0.x/stdlib/influxdata/influxdb/schema/measurementfieldkeys/).
{{% /warn %}}

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

### bucket {data-type="string"}
Bucket to retrieve field keys from.

### measurement {data-type="string"}
Measurement to list field keys from.

### start {data-type="duration, time"}
Oldest time to include in results.
_Defaults to `-30d`._

Relative start times are defined using negative durations.
Negative durations are relative to now.
Absolute start times are defined using [time values](/flux/v0.x/spec/types/#time-types).

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
[v1.fieldKeys](/flux/v0.x/stdlib/influxdata/influxdb/schema/fieldkeys/)_
