
Use the [Flux Geo package](/flux/v0/stdlib/experimental/geo) to
filter geo-temporal data and group by geographic location or track.

{{% warn %}}
The Geo package is experimental and subject to change at any time.
By using it, you agree to the [risks of experimental functions](/flux/v0/stdlib/experimental/to/#experimental-functions-are-subject-to-change).
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
The [Bird Migration Sample Data](/influxdb/version/reference/sample-data/#bird-migration-sample-data)
provides sample geo-temporal data that meets the
[requirements of the Flux Geo package](/flux/v0/stdlib/experimental/geo/#geo-schema-requirements).

### Load bird migration sample data
Use the [`sample.data()` function](/flux/v0/stdlib/influxdata/influxdb/sample/data/)
to load the sample bird migration data:

```js
import "influxdata/influxdb/sample"

sampleGeoData = sample.data(set: "birdMigration")
```

{{% note %}}
`sample.data()` downloads sample data each time you execute the query **(~1.3 MB)**.
If bandwidth is a concern, use the [`to()` function](/flux/v0/stdlib/influxdata/influxdb/to/)
to write the data to a bucket, and then query the bucket with [`from()`](/flux/v0/stdlib/influxdata/influxdb/from/).
{{% /note %}}
