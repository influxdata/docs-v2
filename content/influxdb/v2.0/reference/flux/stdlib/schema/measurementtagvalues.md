---
title: schema.measurementTagValues() function
description: The schema.measurementTagValues() function returns a list of tag values for a specific measurement.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-schema/measurementtagvalues/
menu:
  influxdb_2_0_ref:
    name: schema.measurementTagValues
    parent: InfluxDB Schema
weight: 301
influxdb/v2.0/tags: [tags]
related:
  - /influxdb/v2.0/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/schema_exploration#show-tag-values, SHOW TAG VALUES in InfluxQL
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
The bucket from which to return tag values for a specific measurement.

_**Data type:** String_

### measurement
The measurement from which to return tag values.

_**Data type:** String_

### tag
The tag from which to return all unique values.

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
[schema.tagValues()](/influxdb/v2.0/reference/flux/stdlib/influxdb-schema/tagvalues)_
