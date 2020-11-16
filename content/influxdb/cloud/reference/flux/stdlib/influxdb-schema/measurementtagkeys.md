---
title: schema.measurementTagKeys() function
description: The schema.measurementTagKeys() function returns a list of tag keys for a specific measurement.
aliases:
  - /influxdb/cloud/reference/flux/functions/influxdb-v1/measurementtagkeys/
menu:
  influxdb_cloud_ref:
    name: schema.measurementTagKeys
    parent: InfluxDB Schema
weight: 301
influxdb/v2.0/tags: [tags]
related:
  - /influxdb/cloud/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/schema_exploration#show-tag-keys, SHOW TAG KEYS in InfluxQL
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
[schema.tagKeys()](/influxdb/cloud/reference/flux/stdlib/influxdb-schema/tagkeys)_
