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
  - /flux/v0/stdlib/univese/buckets/
  - /flux/v0/stdlib/influxdata/influxdb/schema/measurements
  - /flux/v0/stdlib/influxdata/influxdb/schema/fieldkeys
  - /flux/v0/stdlib/influxdata/influxdb/schema/measurementfieldkeys
  - /flux/v0/stdlib/influxdata/influxdb/schema/tagkeys
  - /flux/v0/stdlib/influxdata/influxdb/schema/measurementtagkeys
  - /flux/v0/stdlib/influxdata/influxdb/schema/tagvalues
  - /flux/v0/stdlib/influxdata/influxdb/schema/measurementtagvalues
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
source: /shared/influxdb-v2/query-data/flux/explore-schema.md
---

<!-- The content of this file is at 
// SOURCE content/shared/influxdb-v2/query-data/flux/explore-schema.md-->