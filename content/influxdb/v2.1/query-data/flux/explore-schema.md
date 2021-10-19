---
title: Explore your data schema with Flux
list_title: Explore your schema
description: >
  Flux provides functions that let you explore the structure and schema of your
  data stored in InfluxDB.
influxdb/v2.1/tags: [schema]
menu:
  influxdb_2_1:
    name: Explore your schema
    parent: Query with Flux
weight: 206
related:
  - /{{< latest "flux" >}}/stdlib/universe/buckets/
  - /{{< latest "flux" >}}/stdlib/schema/measurements
  - /{{< latest "flux" >}}/stdlib/schema/fieldkeys
  - /{{< latest "flux" >}}/stdlib/schema/measurementfieldkeys
  - /{{< latest "flux" >}}/stdlib/schema/tagkeys
  - /{{< latest "flux" >}}/stdlib/schema/measurementtagkeys
  - /{{< latest "flux" >}}/stdlib/schema/tagvalues
  - /{{< latest "flux" >}}/stdlib/schema/measurementtagvalues
list_code_example: |
  ```js
  import "influxdata/influxdb/schema"

  // List buckets
  buckets()

  // List measurements
  schema.measurements(bucket: "example-bucket")

  // List field keys
  schema.fieldKeys(bucket: "example-bucket")

  // List tag keys
  schema.tagKeys(bucket: "example-bucket")

  // List tag values
  schema.tagValues(bucket: "example-bucket", tag: "example-tag")
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
Use the [`buckets()` function](/{{< latest "flux" >}}/stdlib/universe/buckets/)
to list **buckets in your organization**.

```js
buckets()
```

## List measurements
Use the [`schema.measurements()` function](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/measurements)
to list **measurements in a bucket**.

```js
import "influxdata/influxdb/schema"

schema.measurements(bucket: "example-bucket")
```

## List field keys
Use the [`schema.fieldKeys` function](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/fieldkeys)
to list **field keys in a bucket**.

```js
import "influxdata/influxdb/schema"

schema.fieldKeys(bucket: "example-bucket")
```

### List fields in a measurement
Use the [`schema.measurementFieldKeys` function](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/measurementfieldkeys)
to list **field keys in a measurement**.

```js
import "influxdata/influxdb/schema"

schema.measurementFieldKeys(
  bucket: "example-bucket",
  measurement: "example-measurement"
)
```

## List tag keys
Use the [`schema.tagKeys()` function](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/tagkeys)
to list **tag keys in a bucket**.

```js
import "influxdata/influxdb/schema"

schema.tagKeys(bucket: "example-bucket")
```

### List tag keys in a measurement
Use the [`schema.measurementTagKeys` function](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/measurementtagkeys)
to list **tag keys in a measurement**.
_This function returns results from the last 30 days._

```js
import "influxdata/influxdb/schema"

schema.measurementTagKeys(
  bucket: "example-bucket",
  measurement: "example-measurement"
)
```

## List tag values
Use the [`schema.tagValues()` function](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/tagvalues)
to list **tag values for a given tag in a bucket**.

```js
import "influxdata/influxdb/schema"

schema.tagValues(bucket: "example-bucket", tag: "example-tag")
```

### List tag values in a measurement
Use the [`schema.measurementTagValues` function](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/measurementtagvalues)
to list **tag values for a given tag in a measurement**.
_This function returns results from the last 30 days._

```js
import "influxdata/influxdb/schema"

schema.measurementTagValues(
  bucket: "example-bucket",
  tag: "example-tag",
  measurement: "example-measurement"
)
```
