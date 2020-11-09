---
title: Filter geo-temporal data by region
description: >
  Use the `geo.filterRows` function to filter geo-temporal data by box-shaped, circular, or polygonal geographic regions.
menu:
  influxdb_cloud:
    name: Filter by region
    parent: Geo-temporal data
weight: 302
related:
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/filterrows/
list_code_example: |
  ```js
  import "experimental/geo"

  sampleGeoData
    |> geo.filterRows(
      region: {lat: 30.04, lon: 31.23, radius: 200.0},
      strict: true
    )
  ```
---

{{< duplicate-oss >}}