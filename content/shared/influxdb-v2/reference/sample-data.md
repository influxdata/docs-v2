
Use sample data to familiarize yourself with time series data and InfluxDB.
InfluxData provides many sample time series datasets to use with InfluxDB.
You can also use the [Flux InfluxDB sample package](/flux/v0/stdlib/influxdata/influxdb/sample/)
to view, download, and output sample datasets.

- [Live datasets](#live-datasets)
  - [Air sensor sample data](#air-sensor-sample-data)
  - [Bitcoin sample data](#bitcoin-sample-data)
  - [NOAA NDBC data](#noaa-ndbc-data)
  - [USGS Earthquake data](#usgs-earthquake-data)
- [Static datasets](#static-datasets)
  - [Bird migration sample data](#bird-migration-sample-data)
  - [Machine production sample data](#machine-production-sample-data)
  - [NOAA water sample data](#noaa-water-sample-data)

## Live datasets

Live sample datasets are continually updated with new data.
These sets can be loaded once and treated as a "static" dataset, or you can create
an [InfluxDB task](/influxdb/version/process-data/get-started/) to periodically
collect and write new data.

- [Air sensor sample data](#air-sensor-sample-data)
- [Bitcoin sample data](#bitcoin-sample-data)
- [NOAA NDBC data](#noaa-ndbc-data)
- [USGS Earthquake data](#usgs-earthquake-data)

---

### Air sensor sample data

{{% caption %}}
**Size**: ~600 KB • **Updated**: every 15m
{{% /caption %}}

Air sensor sample data represents an "Internet of Things" (IoT) use case by simulating
temperature, humidity, and carbon monoxide levels for multiple rooms in a building.

To continually download and write updated air sensor sample data to a bucket,
[create an InfluxDB task](/influxdb/version/process-data/manage-tasks/create-task/)
with the following Flux query.
_Replace `example-bucket` with your target bucket_.

```js
import "influxdata/influxdb/sample"

option task = {
  name: "Collect air sensor sample data",
  every: 15m,
}

sample.data(set: "airSensor")
    |> to(bucket: "example-bucket")
```

{{< expand-wrapper >}}
{{% expand "Companion relational sensor data" %}}

The air sensor sample dataset is paired with a relational SQL dataset with meta
information about sensors in each room.
These two sample datasets are used to demonstrate
[how to join time series data and relational data with Flux](/influxdb/version/query-data/flux/sql/#join-sql-data-with-data-in-influxdb)
in the [Query SQL data sources](/influxdb/version/query-data/flux/sql/) guide.

<a class="btn download" href="https://influx-testdata.s3.amazonaws.com/sample-sensor-info.csv" download>Download SQL air sensor data</a>

{{% /expand %}}
{{< /expand-wrapper >}}

### Bitcoin sample data

{{% caption %}}
**Size**: ~700 KB • **Updated**: every 15m
{{% /caption %}}

The Bitcoin sample dataset provides Bitcoin prices from the last 30
days—[Powered by CoinDesk](https://www.coindesk.com/price/bitcoin).

To continually download and write updated Bitcoin sample data to a bucket,
[create an InfluxDB task](/influxdb/version/process-data/manage-tasks/create-task/)
with the following Flux query.
_Replace `example-bucket` with your target bucket_.

```js
import "influxdata/influxdb/sample"

option task = {
  name: "Collect Bitcoin sample data",
  every: 15m,
}

sample.data(set: "bitcoin")
    |> to(bucket: "example-bucket")
```

---

### NOAA NDBC data

{{% caption %}}
**Size**: ~1.3 MB • **Updated**: every 15m
{{% /caption %}}

The **National Oceanic and Atmospheric Administration (NOAA) National Data Buoy Center (NDBC)**
dataset provides the latest observations from the NOAA NDBC network of buoys throughout the world.

To continually download and write updated NOAA NDBC sample data to a bucket,
[create an InfluxDB task](/influxdb/version/process-data/manage-tasks/create-task/)
with the following Flux query.
_Replace `example-bucket` with your target bucket_.

```js
import "influxdata/influxdb/sample"

option task = {
  name: "Collect NOAA NDBC sample data",
  every: 15m,
}

sample.data(set: "noaa")
    |> to(bucket: "example-bucket")
```

---

### USGS Earthquake data

{{% caption %}}
**Size**: ~6 MB • **Updated**: every 15m
{{% /caption %}}

The United States Geological Survey (USGS) earthquake dataset contains observations
collected from USGS seismic sensors around the world over the last week.

To continually download and write updated USGS earthquake sample data to a bucket,
[create an InfluxDB task](/influxdb/version/process-data/manage-tasks/create-task/)
with the following Flux query.
_Replace `example-bucket` with your target bucket_.

```js
import "influxdata/influxdb/sample"

option task = {
  name: "Collect USGS sample data",
  every: 15m,
}

sample.data(set: "usgs")
    |> to(bucket: "example-bucket")
```

---

## Static datasets

Static datasets are fixed datasets from a specific past time range.

- [Bird migration sample data](#bird-migration-sample-data)
- [Machine production sample data](#machine-production-sample-data)
- [NOAA water sample data](#noaa-water-sample-data)

{{% show-in "cloud,cloud-serverless" %}}

{{% note %}}
#### Static sample data and bucket retention periods

If writing a static sample dataset to a bucket with a limited retention period,
use [sample.alignToNow()](/flux/v0/stdlib/influxdata/influxdb/sample/aligntonow/)
to shift timestamps to align the last point in the set to now.
This will prevent writing points with timestamps beyond the bucket's retention period.
For example:

```js
import "influxdata/influxdb/sample"

sample.data(set: "birdMigration")
    |> sample.alignToNow()
    |> to("example-bucket")
```

{{% /note %}}

{{% /show-in %}}

---

### Bird migration sample data

{{% caption %}}
**Size**: ~1.2 MB  
**Time range**: 2019-04-01T13:00:00Z to 2019-04-12T20:00:00Z
{{% /caption %}}

Bird migration sample data is adapted from the
[Movebank: Animal Tracking dataset](https://www.kaggle.com/pulkit8595/movebank-animal-tracking)
and represents animal migratory movements throughout 2019.

To download and write the bird migration sample data to a bucket, run the
following Flux query.
_Replace `example-bucket` with your target bucket_.

```js
import "influxdata/influxdb/sample"

sample.data(set: "birdMigration")
    |> to("example-bucket")
```

The bird migration sample dataset is used in the [Work with geo-temporal data](/influxdb/version/query-data/flux/geo/)
guide to demonstrate how to query and analyze geo-temporal data.

---

### Machine production sample data

{{% caption %}}
**Size**: ~11.9 MB  
**Time range**: 2021-08-01T00:00:00Z to 2021-08-02T00:00:00Z
{{% /caption %}}

The machine production sample dataset includes states and metrics reported from
four automated grinding wheel stations on a production line.

To download and write the machine production sample data to a bucket, run the
following Flux query.
_Replace `example-bucket` with your target bucket_.

```js
import "influxdata/influxdb/sample"

sample.data(set: "machineProduction")
    |> to(bucket: "example-bucket")
```

The machine production data is used in the
[IoT sensor common query](/influxdb/version/query-data/common-queries/iot-common-queries/) guide.

---

### NOAA water sample data

{{% caption %}}
**Size**: ~10 MB  
**Time range**: 2019-08-17T00:00:00Z to 2019-09-17T22:00:00Z
{{% /caption %}}

The **National Oceanic and Atmospheric Administration (NOAA) water sample dataset**
is static dataset extracted from
[NOAA Center for Operational Oceanographic Products and Services](http://tidesandcurrents.noaa.gov/stations.html) data.
The sample dataset includes 15,258 observations of water levels (ft) collected every six minutes at two stations
(Santa Monica, CA (ID 9410840) and Coyote Creek, CA (ID 9414575)) over the period
from **August 17, 2019** through **September 17, 2019**.

To download and write the NOAA water sample data to a bucket, run the
following Flux query.
_Replace `example-bucket` with your target bucket_.

```js
import "influxdata/influxdb/sample"

sample.data(set: "noaaWater")
    |> to(bucket: "example-bucket")
```

The NOAA water sample dataset is used to demonstrate Flux queries in the
[Common queries](/influxdb/version/query-data/common-queries/) and
[Common tasks](/influxdb/version/process-data/common-tasks/) guides.
