---
title: Common variable queries
description: Useful queries to use to populate values in common dashboard variable use cases.
menu:
  v2_0:
    parent: Use and manage variables
    name: Common variable queries
weight: 208
"v2.0/tags": [variables]
---

### List buckets
List all buckets in the current organization.
```js
buckets()
  |> rename(columns: {"name": "_value"})
  |> keep(columns: ["_value"])
```

### List measurements
List all measurements in a specified bucket.

```js
import "influxdata/influxdb/v1"
v1.measurements(bucket: "bucket-name")
```

### List hosts
List all `host` tag values in a specified bucket.

```js
import "influxdata/influxdb/v1"
v1.tagValues(bucket: "bucket-name", tag: "host")
```

### List fields in a measurement
List all fields in a specified bucket and measurement.

```js
import "influxdata/influxdb/v1"
v1.measurementTagValues(
  bucket: "bucket-name",
  measurement: "measurment-name",
  tag: "_field"
)
```
