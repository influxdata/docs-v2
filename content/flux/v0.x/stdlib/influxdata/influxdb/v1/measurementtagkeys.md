---
title: v1.measurementTagKeys() function
description: The v1.measurementTagKeys() function returns a list of tag keys for a specific measurement.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/measurementtagkeys/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/measurementtagkeys/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/measurementtagkeys/
menu:
  flux_0_x_ref:
    name: v1.measurementTagKeys
    parent: v1
weight: 301
flux/v0.x/tags: [metadata]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/explore-schema/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-tag-keys, SHOW TAG KEYS in InfluxQL
introduced: 0.16.0
deprecated: 0.88.0
---

{{% warn %}}
`v1.measurementTagKeys()` was deprecated in **Flux v0.88.0** in favor of
[`schema.measurementTagKeys()`](/flux/v0.x/stdlib/influxdata/influxdb/schema/measurementtagkeys/).
{{% /warn %}}

The `v1.measurementTagKeys()` function returns a list of tag keys for a specific measurement.
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/v1"

v1.measurementTagKeys(
    bucket: "example-bucket",
    measurement: "cpu",
)
```

## Parameters

### bucket {data-type="string"}
Bucket to return tag keys from for a specific measurement.

### measurement {data-type="string"}
Measurement to return tag keys from.
