---
title: schema.measurementTagKeys() function
description: The schema.measurementTagKeys() function returns a list of tag keys for a specific measurement.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/measurementtagkeys/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-schema/measurementtagkeys/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-schema/measurementtagkeys/
menu:
  flux_0_x_ref:
    name: schema.measurementTagKeys
    parent: InfluxDB Schema
weight: 301
flux/v0.x/tags: [tags]
related:
  - /influxdb/v2.0/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-tag-keys, SHOW TAG KEYS in InfluxQL
introduced: 0.88.0
---

The `schema.measurementTagKeys()` function returns a list of tag keys for a specific measurement.
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/schema"

schema.measurementTagKeys(
  bucket: "example-bucket",
  measurement: "cpu"
)
```

## Parameters

### bucket
Bucket to return tag keys from for a specific measurement.

_**Data type:** String_

### measurement
Measurement to return tag keys from.

_**Data type:** String_

## Function definition
```js
package schema

measurementTagKeys = (bucket, measurement) =>
  tagKeys(
    bucket: bucket,
    predicate: (r) => r._measurement == measurement
  )
```

_**Used functions:**
[schema.tagKeys()](/influxdb/v2.0/reference/flux/stdlib/influxdb-schema/tagkeys)_
