---
title: v1.measurementTagKeys() function
description: The v1.measurementTagKeys() function returns a list of tag keys for a specific measurement.
aliases:
  - /influxdb/cloud/reference/flux/functions/influxdb-v1/measurementtagkeys/
menu:
  influxdb_cloud_ref:
    name: v1.measurementTagKeys
    parent: InfluxDB v1
weight: 301
influxdb/v2.0/tags: [tags]
related:
  - /influxdb/cloud/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/schema_exploration#show-tag-keys, SHOW TAG KEYS in InfluxQL
introduced: 0.16.0
deprecated: 0.88.0
---

{{% warn %}}
`v1.measurementTagKeys()` was deprecated in **Flux v0.88.0** in favor of
[`schema.measurementTagKeys()`](/influxdb/cloud/reference/flux/stdlib/influxdb-schema/measurementtagkeys/).
{{% /warn %}}

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
Bucket to return tag keys from for a specific measurement.

_**Data type:** String_

### measurement
Measurement to return tag keys from.

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
[v1.tagKeys()](/influxdb/cloud/reference/flux/stdlib/influxdb-schema/tagkeys)_
