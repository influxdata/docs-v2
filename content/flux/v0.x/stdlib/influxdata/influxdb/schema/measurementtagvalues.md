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
  tag: "host"
)
```

## Parameters

### bucket {data-type="string"}
Bucket to return tag values from for a specific measurement.

### measurement {data-type="string"}
Measurement to return tag values from.

### tag {data-type="string"}
Tag to return all unique values from.

## Function definition
```js
package schema

measurementTagValues = (bucket, measurement, tag) =>
  tagValues(
    bucket: bucket,
    tag: tag,
    predicate: (r) => r._measurement == measurement
  )
```

_**Used functions:**
[schema.tagValues()](/flux/v0.x/stdlib/influxdata/influxdb/schema/tagvalues)_
