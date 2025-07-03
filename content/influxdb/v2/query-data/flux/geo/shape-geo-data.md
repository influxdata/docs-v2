---
title: Shape data to work with the Geo package
description: >
  Functions in the Flux Geo package require **lat** and **lon** fields and an **s2_cell_id** tag.
  Rename latitude and longitude fields and generate S2 cell ID tokens.
menu:
  influxdb_v2:
    name: Shape geo-temporal data
    parent: Geo-temporal data
weight: 301
related:
  - /flux/v0/stdlib/experimental/geo/
  - /flux/v0/stdlib/experimental/geo/shapedata/
list_code_example: |
  ```js
  import "experimental/geo"

  sampleGeoData
      |> geo.shapeData(latField: "latitude", lonField: "longitude", level: 10)
  ```
source: /shared/influxdb-v2/query-data/flux/geo/shape-geo-data.md
---

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v2/query-data/flux/geo/shape-geo-data.md -->
