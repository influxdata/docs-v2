---
title: Group geo-temporal data
description: >
  Use the `geo.groupByArea()` to group geo-temporal data by area and `geo.asTracks()`
  to group data into tracks or routes.
menu:
  influxdb_cloud:
    parent: Geo-temporal data
weight: 302
related:
  - /{{< latest "flux" >}}/stdlib/experimental/geo/
  - /{{< latest "flux" >}}/stdlib/experimental/geo/groupbyarea/
  - /{{< latest "flux" >}}/stdlib/experimental/geo/astracks/
list_code_example: |
  ```js
  import "experimental/geo"

  sampleGeoData
    |> geo.groupByArea(newColumn: "geoArea", level: 5)
    |> geo.asTracks(groupBy: ["id"],sortBy: ["_time"])
  ```
---

{{< duplicate-oss >}}