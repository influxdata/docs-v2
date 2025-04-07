---
title: Explore your data schema with Flux
list_title: Explore your schema
description: >
  Flux provides functions that let you explore the structure and schema of your
  data stored in InfluxDB.
influxdb/v2/tags: [schema]
menu:
  influxdb_v2:
    name: Explore your schema
    parent: Query with Flux
weight: 206
related:
  - /flux/v0/stdlib/universe/buckets/
  - /flux/v0/stdlib/schema/measurements
  - /flux/v0/stdlib/schema/fieldkeys
  - /flux/v0/stdlib/schema/measurementfieldkeys
  - /flux/v0/stdlib/schema/tagkeys
  - /flux/v0/stdlib/schema/measurementtagkeys
  - /flux/v0/stdlib/schema/tagvalues
  - /flux/v0/stdlib/schema/measurementtagvalues
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

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v2/query-data/flux/explore-schema.md -->
