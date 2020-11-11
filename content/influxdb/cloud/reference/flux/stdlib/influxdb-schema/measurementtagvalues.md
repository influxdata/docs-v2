---
title: schema.measurementTagValues() function
description: The schema.measurementTagValues() function returns a list of tag values for a specific measurement.
aliases:
  - /influxdb/cloud/reference/flux/functions/influxdb-v1/measurementtagvalues/
menu:
  influxdb_cloud_ref:
    name: schema.measurementTagValues
    parent: InfluxDB Schema
weight: 301
influxdb/v2.0/tags: [tags]
related:
  - /influxdb/cloud/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/schema_exploration#show-tag-values, SHOW TAG VALUES in InfluxQL
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

### bucket
Bucket to return tag values from for a specific measurement.

_**Data type:** String_

### measurement
Measurement to return tag values from.

_**Data type:** String_

### tag
Tag to return all unique values from.

_**Data type:** String_


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
[schema.tagValues()](/influxdb/cloud/reference/flux/stdlib/influxdb-schema/tagvalues)_
