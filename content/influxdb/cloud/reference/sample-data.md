---
title: Sample data
description: >
  Use sample data to familiarize yourself with time series data and InfluxDB.
  InfluxData provides many sample time series datasets to use with InfluxDB
  and InfluxDB Cloud.
aliases:
  - /influxdb/cloud/write-data/sample-data/
menu: influxdb_cloud_ref
weight: 7
---

Use **sample data** to familiarize yourself with time series data and InfluxDB Cloud.
InfluxDB Cloud lets you access **Sample datasets** that contain time
series data without having to write data to InfluxDB. 
Sample datasets are available for download and can be written to InfluxDB
or loaded at query time.

- [Sample datasets](#sample-datasets)
- [InfluxDB Cloud demo data](#influxdb-cloud-demo-data)

## Sample datasets

- [Air sensor sample data](#air-sensor-sample-data)
- [Bird migration sample data](#bird-migration-sample-data)
- [NOAA sample data](#noaa-sample-data)
  - [NOAA NDBC data](#noaa-ndbc-data)
  - [NOAA water sample data](#noaa-water-sample-data)
- [USGS Earthquake data](#usgs-earthquake-data)

### Air sensor sample data

{{% caption %}}
**Size**: ~600 KB • **Updated**: every 15m
{{% /caption %}}

Air sensor sample data represents an "Internet of Things" (IoT) use case by simulating
temperature, humidity, and carbon monoxide levels for multiple rooms in a building.

To download and output the air sensor sample dataset, use the
[`sample.data()` function](/influxdb/cloud/reference/flux/stdlib/influxdb-sample/data/).

```js
import "influxdata/influxdb/sample"

sample.data(set: "airSensor")
```

#### Companion SQL sensor data
The air sensor sample dataset is paired with a relational SQL dataset with meta
information about sensors in each room.
These two sample datasets are used to demonstrate
[how to join time series data and relational data with Flux](/influxdb/cloud/query-data/flux/sql/#join-sql-data-with-data-in-influxdb)
in the [Query SQL data sources](/influxdb/cloud/query-data/flux/sql/) guide.

<a class="btn download" href="https://influx-testdata.s3.amazonaws.com/sample-sensor-info.csv" download>Download SQL air sensor data</a>

### Bird migration sample data

{{% caption %}}
**Size**: ~1.2 MB • **Updated**: N/A
{{% /caption %}}

Bird migration sample data is adapted from the
[Movebank: Animal Tracking data set](https://www.kaggle.com/pulkit8595/movebank-animal-tracking)
and represents animal migratory movements throughout 2019.

To download and output the bird migration sample dataset, use the
[`sample.data()` function](/influxdb/cloud/reference/flux/stdlib/influxdb-sample/data/).

```js
import "influxdata/influxdb/sample"

sample.data(set: "birdMigration")
```

The bird migration sample dataset is used in the [Work with geo-temporal data](/influxdb/cloud/query-data/flux/geo/)
guide to demonstrate how to query and analyze geo-temporal data.

### NOAA sample data

The following two National Oceanic and Atmospheric Administration (NOAA) datasets are
available to use with InfluxDB.

- [NOAA NDBC data](#noaa-ndbc-data)
- [NOAA water sample data](#noaa-water-sample-data)

#### NOAA NDBC data

{{% caption %}}
**Size**: ~1.3 MB • **Updated**: every 15m
{{% /caption %}}

The **NOAA National Data Buoy Center (NDBC)** dataset provides observations (updated every 15 minutes) from the NOAA NDBC network of buoys throughout the world.

To download and output the most recent NOAA NDBC observations, use the
[`sample.data()` function](/influxdb/cloud/reference/flux/stdlib/influxdb-sample/data/).

```js
import "influxdata/influxdb/sample"

sample.data(set: "noaa")
```

{{% note %}}
##### Store historical NOAA NDBC data

The **NOAA NDBC sample dataset** only returns the most recent observations;
not historical observations.
To regularly query and store NOAA NDBC observations, add the following as an
[InfluxDB task](/inflxudb/v2.0/process-data/manage-tasks/).
Replace `example-org` and `example-bucket` with your organization name and the
name of the bucket to store data in.

{{% get-shared-text "flux/noaa-ndbc-sample-task.md" %}}
{{% /note %}}

#### NOAA water sample data

{{% caption %}}
**Size**: ~10 MB • **Updated**: N/A
{{% /caption %}}

The **NOAA water sample dataset** is static dataset extracted from
[NOAA Center for Operational Oceanographic Products and Services](http://tidesandcurrents.noaa.gov/stations.html) data.
The sample dataset includes 15,258 observations of water levels (ft) collected every six minutes at two stations
(Santa Monica, CA (ID 9410840) and Coyote Creek, CA (ID 9414575)) over the period
from **August 18, 2015** through **September 18, 2015**.

{{% note %}}
##### Store NOAA water sample data to avoid bandwidth usage
To avoid having to re-download this 10MB dataset every time you run a query,
we recommend that you [create a new bucket](/influxdb/cloud/organizations/buckets/create-bucket/)
(`noaa`) and write the NOAA data to it.
We also recommend updating the timestamps of the data to be relative to `now()`.
To do so, run the following:

```js
import "experimental/csv"

relativeToNow = (tables=<-) =>
  tables
    |> elapsed()
    |> sort(columns: ["_time"], desc: true)
    |> cumulativeSum(columns: ["elapsed"])
    |> map(fn: (r) => ({ r with _time: time(v: int(v: now()) - (r.elapsed * 1000000000))}))

csv.from(url: "https://influx-testdata.s3.amazonaws.com/noaa.csv")
  |> relativeToNow()
  |> to(bucket: "noaa", org: "example-org")
```
{{% /note %}}

The NOAA water sample dataset is used to demonstrate Flux queries in the
[Common queries](/influxdb/cloud/query-data/common-queries/) and
[Common tasks](/influxdb/cloud/process-data/common-tasks/) guides.

### USGS Earthquake data

{{% caption %}}
**Size**: ~6 MB • **Updated**: every 15m
{{% /caption %}}

The United States Geological Survey (USGS) earthquake dataset contains observations
collected from USGS seismic sensors around the world over the last week.
Data is updated approximately every 15m.

To download and output the last week of USGS seismic data, use the
[`sample.data()` function](/influxdb/cloud/reference/flux/stdlib/influxdb-sample/data/).

```js
import "influxdata/influxdb/sample"

sample.data(set: "usgs")
```

## InfluxDB Cloud demo data
Use [InfluxDB Cloud demo data buckets](/influxdb/cloud/reference/sample-data/#influxdb-cloud-demo-data) for quick,
free access to different time series datasets.

{{< youtube GSaByPC1Bdc >}}

{{% note %}}
Demo data is not available for use with third-party integrations such as Grafana.
{{% /note %}}