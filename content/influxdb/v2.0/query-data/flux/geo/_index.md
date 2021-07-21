---
title: Work with geo-temporal data
list_title: Geo-temporal data
description: >
  Use the Flux Geo package to filter geo-temporal data and group by geographic location or track.
menu:
  influxdb_2_0:
    name: Geo-temporal data
    parent: Query with Flux
weight: 220
list_code_example: |
  ```js
  import "experimental/geo"

  sampleGeoData
    |> geo.filterRows(region: {lat: 30.04, lon: 31.23, radius: 200.0})
    |> geo.groupByArea(newColumn: "geoArea", level: 5)
  ```
---

Use the [Flux Geo package](/{{< latest "flux" >}}/stdlib/experimental/to/geo) to
filter geo-temporal data and group by geographic location or track.

{{% warn %}}
The Geo package is experimental and subject to change at any time.
By using it, you agree to the [risks of experimental functions](/{{< latest "flux" >}}/stdlib/experimental/to/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

**To work with geo-temporal data:**

1. Import the `experimental/geo` package.

    ```js
    import "experimental/geo"
    ```

2. Load geo-temporal data. _See below for [sample geo-temporal data](#sample-data)._
3. Do one or more of the following:

    - [Shape data to work with the Geo package](#shape-data-to-work-with-the-geo-package)
    - [Filter data by region](#filter-geo-temporal-data-by-region) (using strict or non-strict filters)
    - [Group data by area or by track](#group-geo-temporal-data)

{{< children >}}

---

## Sample data
Many of the examples in this section use a `sampleGeoData` variable that represents
a sample set of geo-temporal data.
The [Bird Migration Sample Data](/influxdb/v2.0/reference/sample-data/#bird-migration-sample-data)
provides sample geo-temporal data that meets the
[requirements of the Flux Geo package](/influxdb/v2.0/reference/flux/stdlib/experimental/geo/#geo-schema-requirements).

### Load bird migration sample data
Use the [`sample.data()` function](/influxdb/v2.0/reference/flux/stdlib/influxdb-sample/data/)
to load the sample bird migration data:

```js
import "influxdata/influxdb/sample"

sampleGeoData = sample.data(set: "birdMigration")
```

{{% note %}}
`sample.data()` downloads sample data each time you execute the query **(~1.3 MB)**.
If bandwidth is a concern, use the [`to()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/outputs/to/)
to write the data to a bucket, and then query the bucket with [`from()`](/influxdb/v2.0/reference/flux/stdlib/built-in/inputs/from/).
{{% /note %}}
