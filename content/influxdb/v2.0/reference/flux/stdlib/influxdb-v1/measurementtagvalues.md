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
introduced: 0.16.0
deprecated: 0.88.0
---

{{% warn %}}
`v1.measurementTagValues()` was deprecated in **Flux v0.88.0** in favor of
[`schema.measurementTagValues()`](/influxdb/v2.0/reference/flux/stdlib/influxdb-schema/measurementtagvalues/).
{{% /warn %}}

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

## bucket
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
package v1

measurementTagValues = (bucket, measurement, tag) =>
  tagValues(
    bucket: bucket,
    tag: tag,
    predicate: (r) => r._measurement == measurement
  )
```

_**Used functions:**
[v1.tagValues()](/influxdb/v2.0/reference/flux/stdlib/influxdb-schema/tagvalues)_
