---
title: Explore your data schema with Flux
list_title: Explore your schema
description: >
  Flux provides functions that let you explore the structure and schema of your
  data stored in InfluxDB.
v2.0/tags: [schema]
menu:
  v2_0:
    name: Explore your schema
    parent: Query with Flux
weight: 206
aliases:
  - /v2.0/query-data/flux/explore-schema/
related:
  - /v2.0/reference/flux/stdlib/built-in/inputs/buckets/
  - /v2.0/reference/flux/stdlib/influxdb-v1/measurements
  - /v2.0/reference/flux/stdlib/influxdb-v1/fieldkeys
  - /v2.0/reference/flux/stdlib/influxdb-v1/measurementfieldkeys
  - /v2.0/reference/flux/stdlib/influxdb-v1/tagkeys
  - /v2.0/reference/flux/stdlib/influxdb-v1/measurementtagkeys
  - /v2.0/reference/flux/stdlib/influxdb-v1/tagvalues
  - /v2.0/reference/flux/stdlib/influxdb-v1/measurementtagvalues
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
Use the [`buckets()` function](/v2.0/reference/flux/stdlib/built-in/inputs/buckets/)
to list **buckets in your organization**.

```js
buckets()
```

## List measurements
Use the [`v1.measurements()` function](/v2.0/reference/flux/stdlib/influxdb-v1/measurements)
to list **measurements in a bucket**.

```js
import "influxdata/influxdb/v1"

v1.measurements(bucket: "example-bucket")
```

## List field keys
Use the [`v1.fieldKeys` function](/v2.0/reference/flux/stdlib/influxdb-v1/fieldkeys)
to list **field keys in a bucket**.

```js
import "influxdata/influxdb/v1"

v1.fieldKeys(bucket: "example-bucket")
```

### List fields in a measurement
Use the [`v1.measurementFieldKeys` function](/v2.0/reference/flux/stdlib/influxdb-v1/measurementfieldkeys)
to list **field keys in a measurement**.

```js
import "influxdata/influxdb/v1"

v1.measurementFieldKeys(
  bucket: "example-bucket",
  measurement: "example-measurement"
)
```

## List tag keys
Use the [`v1.tagKeys()` function](/v2.0/reference/flux/stdlib/influxdb-v1/tagkeys)
to list **tag keys in a bucket**.

```js
import "influxdata/influxdb/v1"

v1.tagKeys(bucket: "example-bucket")
```

### List tag keys in a measurement
Use the [`v1.measurementTagKeys` function](/v2.0/reference/flux/stdlib/influxdb-v1/measurementtagkeys)
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
Use the [`v1.tagValues()` function](/v2.0/reference/flux/stdlib/influxdb-v1/tagvalues)
to list **tag values for a given tag in a bucket**.

```js
import "influxdata/influxdb/v1"

v1.tagValues(bucket: "example-bucket", tag: "example-tag")
```

### List tag values in a measurement
Use the [`v1.measurementTagValues` function](/v2.0/reference/flux/stdlib/influxdb-v1/measurementtagvalues)
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
