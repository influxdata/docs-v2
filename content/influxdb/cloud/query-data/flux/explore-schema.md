---
title: Explore your data schema with Flux
list_title: Explore your schema
description: >
  Flux provides functions that let you explore the structure and schema of your
  data stored in InfluxDB.
influxdb/cloud/tags: [schema]
menu:
  influxdb_cloud:
    name: Explore your schema
    parent: Query with Flux
weight: 206
related:
  - /influxdb/cloud/reference/flux/stdlib/built-in/inputs/buckets/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/measurements
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/fieldkeys
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/measurementfieldkeys
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/tagkeys
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/measurementtagkeys
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/tagvalues
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/measurementtagvalues
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

{{< duplicate-oss >}}