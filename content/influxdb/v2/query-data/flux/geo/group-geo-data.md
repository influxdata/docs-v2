---
title: Group geo-temporal data
description: >
  Use the `geo.groupByArea()` to group geo-temporal data by area and `geo.asTracks()`
  to group data into tracks or routes.
menu:
  influxdb_v2:
    parent: Geo-temporal data
weight: 302
related:
  - /flux/v0/stdlib/experimental/geo/
  - /flux/v0/stdlib/experimental/geo/groupbyarea/
  - /flux/v0/stdlib/experimental/geo/astracks/
list_code_example: |
  ```js
  import "experimental/geo"

  sampleGeoData
      |> geo.groupByArea(newColumn: "geoArea", level: 5)
      |> geo.asTracks(groupBy: ["id"],sortBy: ["_time"])
  ```
source: /shared/influxdb-v2/query-data/flux/geo/group-geo-data.md
---

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v2/query-data/flux/geo/group-geo-data.md -->
