---
title: Common variable queries
description: Useful queries to use to populate values in common dashboard variable use cases.
menu:
  v2_0:
    parent: Use and manage variables
    name: Common Variables
weight: 206
"v2.0/tags": [variables]
---

##### List buckets
```js
buckets()
	|> rename(columns: {"name": "_value"})
  |> keep(columns: ["_value"])
```

##### List measurements
```js
import "influxdata/influxdb/v1"

v1.measurements(bucket: "bucket-name")
```

##### List hosts
```js
import "influxdata/influxdb/v1"

v1.tagValues(bucket: "bucket-name", tag: "host")
```

##### List fields in a measurement
```js
import "influxdata/influxdb/v1"

v1.measurementTagValues(bucket: "bucket-name", measurement: "measurment-name", tag: "_field")
```
