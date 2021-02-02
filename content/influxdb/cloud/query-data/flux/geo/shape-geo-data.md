---
title: Shape data to work with the Geo package
description: >
  Functions in the Flux Geo package require **lat** and **lon** fields and an **s2_cell_id** tag.
  Rename latitude and longitude fields and generate S2 cell ID tokens.
menu:
  influxdb_cloud:
    name: Shape geo-temporal data
    parent: Geo-temporal data
weight: 301
related:
  - /{{< latest "flux" >}}/stdlib/experimental/geo/
  - /{{< latest "flux" >}}/stdlib/experimental/geo/shapedata/
  - /{{< latest "flux" >}}/stdlib/experimental/geo/s2cellidtoken/
list_code_example: |
  ```js
  import "experimental/geo"

  sampleGeoData
    |> map(fn: (r) => ({ r with
      _field:
        if r._field == "latitude" then "lat"
        else if r._field == "longitude" then "lon"
        else r._field
      }))
    |> map(fn: (r) => ({ r with
      s2_cell_id: geo.s2CellIDToken(point: {lon: r.lon, lat: r.lat}, level: 10)
    }))  
  ```
---

{{< duplicate-oss >}}