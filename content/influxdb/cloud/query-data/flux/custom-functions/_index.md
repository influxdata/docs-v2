---
title: Create custom Flux functions
description: Create your own custom Flux functions to transform and manipulate data.
list_title: Custom functions
influxdb/cloud/tags: [functions, custom, flux]
menu:
  influxdb_cloud:
    name: Custom functions
    parent: Query with Flux
weight: 220
list_code_example: |
  ```js
  multByX = (tables=<-, x) =>
    tables
      |> map(fn: (r) => ({ r with _value: r._value * x}))

  data
    |> multByX(x: 2.0)
  ```
---

{{< duplicate-oss >}}