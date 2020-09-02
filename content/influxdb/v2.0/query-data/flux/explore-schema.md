---
title: Explore your data schema with Flux
list_title: Explore your schema
description: >
  Flux provides functions that let you explore the structure and schema of your
  data stored in InfluxDB.
influxdb/v2.0/tags: [schema]
menu:
  influxdb_2_0:
    name: Explore your schema
    parent: Query with Flux
weight: 206
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/inputs/buckets/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/measurements
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/fieldkeys
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/measurementfieldkeys
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/tagkeys
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/measurementtagkeys
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/tagvalues
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/measurementtagvalues
list_code_example: |
  ```js
  import "influxdata/influxdb/v1"

  // List buckets
  buckets()

  // List measurements
  v1.measurements(bucket: "example-bucket")

  // List field keys
  v1.fieldKeys(bucket: "example-bucket")

  // List tag keys
  v1.tagKeys(bucket: "example-bucket")

  // List tag values
  v1.tagValues(bucket: "example-bucket", tag: "example-tag")
  ```
---

Flux provides functions that let you explore the structure and schema of your
data stored in InfluxDB.

- [List buckets](#list-buckets)
- [List measurements](#list-measurements)
- [List field keys](#list-field-keys)
- [List tag keys](#list-tag-keys)
- [List tag values](#list-tag-values)

## List buckets
Use the [`buckets()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/inputs/buckets/)
to list **buckets in your organization**.

```js
buckets()
```

## List measurements
Use the [`v1.measurements()` function](/influxdb/v2.0/reference/flux/stdlib/influxdb-v1/measurements)
to list **measurements in a bucket**.

```js
import "influxdata/influxdb/v1"

v1.measurements(bucket: "example-bucket")
```

## List field keys
Use the [`v1.fieldKeys` function](/influxdb/v2.0/reference/flux/stdlib/influxdb-v1/fieldkeys)
to list **field keys in a bucket**.

```js
import "influxdata/influxdb/v1"

v1.fieldKeys(bucket: "example-bucket")
```

### List fields in a measurement
Use the [`v1.measurementFieldKeys` function](/influxdb/v2.0/reference/flux/stdlib/influxdb-v1/measurementfieldkeys)
to list **field keys in a measurement**.

```js
import "influxdata/influxdb/v1"

v1.measurementFieldKeys(
  bucket: "example-bucket",
  measurement: "example-measurement"
)
```

## List tag keys
Use the [`v1.tagKeys()` function](/influxdb/v2.0/reference/flux/stdlib/influxdb-v1/tagkeys)
to list **tag keys in a bucket**.

```js
import "influxdata/influxdb/v1"

v1.tagKeys(bucket: "example-bucket")
```

### List tag keys in a measurement
Use the [`v1.measurementTagKeys` function](/influxdb/v2.0/reference/flux/stdlib/influxdb-v1/measurementtagkeys)
to list **tag keys in a measurement**.
_This function returns results from the last 30 days._

```js
import "influxdata/influxdb/v1"

v1.measurementTagKeys(
  bucket: "example-bucket",
  measurement: "example-measurement"
)
```

## List tag values
Use the [`v1.tagValues()` function](/influxdb/v2.0/reference/flux/stdlib/influxdb-v1/tagvalues)
to list **tag values for a given tag in a bucket**.

```js
import "influxdata/influxdb/v1"

v1.tagValues(bucket: "example-bucket", tag: "example-tag")
```

### List tag values in a measurement
Use the [`v1.measurementTagValues` function](/influxdb/v2.0/reference/flux/stdlib/influxdb-v1/measurementtagvalues)
to list **tag values for a given tag in a measurement**.
_This function returns results from the last 30 days._

```js
import "influxdata/influxdb/v1"

v1.measurementTagValues(
  bucket: "example-bucket",
  tag: "example-tag",
  measurement: "example-measurement"
)
```
