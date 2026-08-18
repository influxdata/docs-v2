---
title: Work with geo-temporal data
list_title: Geo-temporal data
description: >
  Use the Flux Geo package to filter geo-temporal data and group by geographic location or track.
menu:
  influxdb_v1:
    name: Geo-temporal data
    parent: Query with Flux
weight: 20
canonical: /influxdb/v2/query-data/flux/geo/
alt_links:
  v2: /influxdb/v2/query-data/flux/geo/
list_code_example: |
  ```js
  import "experimental/geo"

  sampleGeoData
    |> geo.filterRows(region: {lat: 30.04, lon: 31.23, radius: 200.0})
    |> geo.groupByArea(newColumn: "geoArea", level: 5)
  ```
source: /shared/influxdb-v1/flux/guides/geo/_index.md
---

<!-- The content for this file is located at
// SOURCE content/shared/influxdb-v1/flux/guides/geo/_index.md -->
