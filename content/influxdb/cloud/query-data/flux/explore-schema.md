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
  - /{{< latest "flux" >}}/stdlib/univese/buckets/
  - /{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/measurements
  - /{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/fieldkeys
  - /{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/measurementfieldkeys
  - /{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/tagkeys
  - /{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/measurementtagkeys
  - /{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/tagvalues
  - /{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/measurementtagvalues
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

{{< duplicate-oss >}}