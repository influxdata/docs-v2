---
title: v1.measurementTagKeys() function
description: The v1.measurementTagKeys() function returns a list of tag keys for a specific measurement.
aliases:
  - /v2.0/reference/flux/functions/influxdb-v1/measurementtagkeys/
menu:
  influxdb_2_0_ref:
    name: v1.measurementTagKeys
    parent: InfluxDB v1
weight: 301
influxdb/v2.0/tags: [tags]
related:
  - /influxdb/v2.0/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/schema_exploration#show-tag-keys, SHOW TAG KEYS in InfluxQL
---

The `v1.measurementTagKeys()` function returns a list of tag keys for a specific measurement.
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/v1"

v1.measurementTagKeys(
  bucket: "example-bucket",
  measurement: "cpu"
)
```

## Parameters

### bucket
The bucket from which to return tag keys for a specific measurement.

_**Data type:** String_

### measurement
The measurement from which to return tag keys.

_**Data type:** String_

## Function definition
```js
package v1

measurementTagKeys = (bucket, measurement) =>
  tagKeys(
    bucket: bucket,
    predicate: (r) => r._measurement == measurement
  )
```

_**Used functions:**
[v1.tagKeys()](/influxdb/v2.0/reference/flux/stdlib/influxdb-v1/tagkeys)_
