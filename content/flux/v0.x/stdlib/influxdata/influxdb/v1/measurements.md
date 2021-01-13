---
title: v1.measurements() function
description: The v1.measurements() function returns a list of measurements in a specific bucket.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/measurements/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/measurements/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/measurements/
menu:
  flux_0_x_ref:
    name: v1.measurements
    parent: v1
weight: 301
flux/v0.x/tags: [measurements]
related:
  - /influxdb/v2.0/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-measurements, SHOW MEASUREMENTS in InfluxQL
introduced: 0.16.0
deprecated: 0.88.0
---

{{% warn %}}
`v1.measurements()` was deprecated in **Flux v0.88.0** in favor of
[`schema.measurements()`](/influxdb/v2.0/reference/flux/stdlib/influxdb-schema/measurements/).
{{% /warn %}}

The `v1.measurements()` function returns a list of measurements in a specific bucket.
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/v1"

v1.measurements(bucket: "example-bucket")
```

## Parameters

### bucket
Bucket to retrieve measurements from.

_**Data type:** String_

## Function definition
```js
package v1

measurements = (bucket) =>
  tagValues(bucket: bucket, tag: "_measurement")
```

_**Used functions:**
[v1.tagValues()](/influxdb/v2.0/reference/flux/stdlib/influxdb-schema/tagvalues)_
