---
title: Query the Flux version
seotitle: Query the version of Flux installed in InfluxDB Cloud
list_title: Query the Flux version
description: >
  Use `runtime.version()` to return the version of Flux installed in InfluxDB Cloud.
weight: 221
menu:
  influxdb_cloud:
    parent: Query with Flux
    name: Flux version
influxdb/cloud/tags: [query]
related:
  - /flux/v0/stdlib/runtime/version/
list_code_example: |
  ```js
  import "array"
  import "runtime"
  
  array.from(rows: [{version: runtime.version()}])
  ```
---

{{< duplicate-oss >}}
