---
title: v1.measurementTagValues() function
description: The v1.measurementTagValues() function returns a list of tag values for a specific measurement.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/measurementtagvalues/
menu:
  influxdb_2_0_ref:
    name: v1.measurementTagValues
    parent: InfluxDB v1
weight: 301
influxdb/v2.0/tags: [tags]
related:
  - /influxdb/v2.0/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/schema_exploration#show-tag-values, SHOW TAG VALUES in InfluxQL
---

The `v1.measurementTagValues()` function returns a list of tag values for a specific measurement.
The return value is always a single table with a single column, `_value`.



```js
import "influxdata/influxdb/v1"

v1.measurementTagValues(
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
package v1

measurementTagValues = (bucket, measurement, tag) =>
  tagValues(
    bucket: bucket,
    tag: tag,
    predicate: (r) => r._measurement == measurement
  )
```

_**Used functions:**
[v1.tagValues()](/influxdb/v2.0/reference/flux/stdlib/influxdb-v1/tagvalues)_
