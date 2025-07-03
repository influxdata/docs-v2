---
title: Query the Flux version
seotitle: Query the version of Flux installed in InfluxDB
list_title: Query the Flux version
description: >
  Use `runtime.version()` to return the version of Flux installed in InfluxDB.
weight: 221
menu:
  influxdb_v2:
    parent: Query with Flux
    name: Flux version
influxdb/v2/tags: [query]
related:
  - /flux/v0/stdlib/runtime/version/
list_code_example: |
  ```js
  import "array"
  import "runtime"
  
  array.from(rows: [{version: runtime.version()}])
  ```
source: /shared/influxdb-v2/query-data/flux/flux-version.md
---

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v2/query-data/flux/flux-version.md -->
