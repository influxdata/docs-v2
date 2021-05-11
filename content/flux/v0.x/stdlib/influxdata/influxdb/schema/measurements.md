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

## Function definition
```js
package schema

measurements = (bucket) =>
  tagValues(bucket: bucket, tag: "_measurement")
```

_**Used functions:**
[schema.tagValues()](/flux/v0.x/stdlib/influxdata/influxdb/schema/tagvalues)_
