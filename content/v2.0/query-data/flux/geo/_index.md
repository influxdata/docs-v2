---
title: Work with geo-temporal data
description: >
  Use the Flux Geo package to filter geo-temporal data and group by geographic location or track.
menu:
  v2_0:
    name: Geo-temporal data
    parent: Query with Flux
weight: 220
---

Use the [Flux Geo package](/v2.0/reference/flux/stdlib/experimental/geo) to
filter geo-temporal data and group by geographic location or track.
Import the `experimental/geo` package.

```js
import "experimental/geo"
```

{{% warn %}}
The Geo package is experimental and subject to change at any time.
By using it, you agree to the [risks of experimental functions](/v2.0/reference/flux/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

{{< children >}}

## Sample data
Many of the examples in this section use a `sampleGeoData` variable that represents
a sample set of geo-temporal data.
The [Bird Migration Sample Data](https://github.com/influxdata/influxdb2-sample-data/tree/master/bird-migration-data)
available on GitHub provides sample geo-temporal data that meets the
[requirements of the Flux Geo package](/v2.0/reference/flux/stdlib/experimental/geo/#geo-schema-requirements).

### Load annotated CSV sample data
Use the [experimental `csv.from()` function](/v2.0/reference/flux/stdlib/experimental/csv/from/)
to load the sample bird migration annotated CSV data from GitHub:

```js
import `experimental/csv`

sampleGeoData = csv.from(
  url: "https://github.com/influxdata/influxdb2-sample-data/blob/master/bird-migration-data/bird-migration.csv"
)
```

{{% note %}}
This downloads all the sample data each time you execute the query **(~1.3 MB)**.
If bandwidth is a concern, use the [`to()` function](/v2.0/reference/flux/stdlib/built-in/outputs/to/)
to write the data to a bucket, and then query the bucket with [`from()`](/v2.0/reference/flux/stdlib/built-in/inputs/from/).
{{% /note %}}

### Write sample data to InfluxDB with line protocol
Use `curl` and the `influx write` command to write bird migration line protocol to InfluxDB.
Replace `example-bucket` with your destination bucket:

```sh
curl https://raw.githubusercontent.com/influxdata/influxdb2-sample-data/master/bird-migration-data/bird-migration.line --output ./tmp-data
influx write -b example-bucket @./tmp-data
rm -f ./tmp-data
```

Use Flux to query the bird migration data and assign it to the `sampleGeoData` variable:

```js
sampleGeoData = from(bucket: "example-bucket")
  |> range(start: 2019-01-01T00:00:00Z, stop: 2019-12-31T23:59:59Z)
  |> filter(fn: (r) => r._measurement == "migration")
```
