---
title: Sample data
description: >
  Use sample data to familiarize yourself with time series data and InfluxDB.
  InfluxData provides many sample time series datasets to use with InfluxDB
  and InfluxDB Cloud.
aliases:
  - /influxdb/v2.0/write-data/sample-data/
menu: influxdb_2_0_ref
weight: 7
---

Use sample data to familiarize yourself with time series data and InfluxDB.
InfluxData provides many sample time series datasets to use with InfluxDB.
You can also use the [Flux InfluxDB sample package](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/sample/)
to view, download, and output sample datasets.

- [Air sensor sample data](#air-sensor-sample-data)
- [Bird migration sample data](#bird-migration-sample-data)
- [NOAA sample data](#noaa-sample-data)
  - [NOAA NDBC data](#noaa-ndbc-data)
  - [NOAA water sample data](#noaa-water-sample-data)
- [USGS Earthquake data](#usgs-earthquake-data)

## Air sensor sample data

{{% caption %}}
**Size**: ~600 KB • **Updated**: every 15m
{{% /caption %}}

Air sensor sample data represents an "Internet of Things" (IoT) use case by simulating
temperature, humidity, and carbon monoxide levels for multiple rooms in a building.

To download and output the air sensor sample dataset, use the
[`sample.data()` function](/{{< latest "flux" >}}/stdlib/universe/influxdata/influxdb/sample/data/).

```js
import "influxdata/influxdb/sample"

sample.data(set: "airSensor")
```

#### Companion SQL sensor data
The air sensor sample dataset is paired with a relational SQL dataset with meta
information about sensors in each room.
These two sample datasets are used to demonstrate
[how to join time series data and relational data with Flux](/influxdb/v2.0/query-data/flux/sql/#join-sql-data-with-data-in-influxdb)
in the [Query SQL data sources](/influxdb/v2.0/query-data/flux/sql/) guide.

<a class="btn download" href="https://influx-testdata.s3.amazonaws.com/sample-sensor-info.csv" download>Download SQL air sensor data</a>

## Bird migration sample data

{{% caption %}}
**Size**: ~1.2 MB • **Updated**: N/A
{{% /caption %}}

Bird migration sample data is adapted from the
[Movebank: Animal Tracking data set](https://www.kaggle.com/pulkit8595/movebank-animal-tracking)
and represents animal migratory movements throughout 2019.

To download and output the bird migration sample dataset, use the
[`sample.data()` function](/{{< latest "flux" >}}/stdlib/universe/influxdata/influxdb/sample/data/).

```js
import "influxdata/influxdb/sample"

sample.data(set: "birdMigration")
```

The bird migration sample dataset is used in the [Work with geo-temporal data](/influxdb/v2.0/query-data/flux/geo/)
guide to demonstrate how to query and analyze geo-temporal data.

## NOAA sample data

There are two National Oceanic and Atmospheric Administration (NOAA) datasets 
available to use with InfluxDB.

- [NOAA NDBC data](#noaa-ndbc-data)
- [NOAA water sample data](#noaa-water-sample-data)

### NOAA NDBC data

{{% caption %}}
**Size**: ~1.3 MB • **Updated**: every 15m
{{% /caption %}}

The **NOAA National Data Buoy Center (NDBC)** dataset provides the latest
observations from the NOAA NDBC network of buoys throughout the world.
Observations are updated approximately every 15 minutes.

To download and output the most recent NOAA NDBC observations, use the
[`sample.data()` function](/{{< latest "flux" >}}/stdlib/universe/influxdata/influxdb/sample/data/).

```js
import "influxdata/influxdb/sample"

sample.data(set: "noaa")
```

{{% note %}}
#### Store historical NOAA NDBC data

The **NOAA NDBC sample dataset** only returns the most recent observations;
not historical observations.
To regularly query and store NOAA NDBC observations, add the following as an
[InfluxDB task](/inflxudb/v2.0/process-data/manage-tasks/).
Replace `example-org` and `example-bucket` with your organization name and the
name of the bucket to store data in.

{{% get-shared-text "flux/noaa-ndbc-sample-task.md" %}}
{{% /note %}}

### NOAA water sample data

{{% caption %}}
**Size**: ~10 MB • **Updated**: N/A
{{% /caption %}}

The **NOAA water sample dataset** is static dataset extracted from
[NOAA Center for Operational Oceanographic Products and Services](http://tidesandcurrents.noaa.gov/stations.html) data.
The sample dataset includes 15,258 observations of water levels (ft) collected every six minutes at two stations
(Santa Monica, CA (ID 9410840) and Coyote Creek, CA (ID 9414575)) over the period
from **August 18, 2015** through **September 18, 2015**.

{{% note %}}
#### Store NOAA water sample data to avoid bandwidth usage
To avoid having to re-download this 10MB dataset every time you run a query,
we recommend that you [create a new bucket](/influxdb/v2.0/organizations/buckets/create-bucket/)
(`noaa`) and write the NOAA sample water data to it.

```js
import "experimental/csv"

csv.from(url: "https://influx-testdata.s3.amazonaws.com/noaa.csv")
  |> to(bucket: "noaa", org: "example-org")
```
{{% /note %}}

The NOAA water sample dataset is used to demonstrate Flux queries in the
[Common queries](/influxdb/v2.0/query-data/common-queries/) and
[Common tasks](/influxdb/v2.0/process-data/common-tasks/) guides.

## USGS Earthquake data

{{% caption %}}
**Size**: ~6 MB • **Updated**: every 15m
{{% /caption %}}

The United States Geological Survey (USGS) earthquake dataset contains observations
collected from USGS seismic sensors around the world over the last week.
Data is updated approximately every 15m.

To download and output the last week of USGS seismic data, use the
[`sample.data()` function](/{{< latest "flux" >}}/stdlib/universe/influxdata/influxdb/sample/data/).

```js
import "influxdata/influxdb/sample"

sample.data(set: "usgs")
```
