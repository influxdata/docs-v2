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

## Sample data sets
The following sample data sets are used as examples in [InfluxDB query guides](/influxdb/v2.0/query-data/flux)
and can be used with **InfluxDB OSS** or **InfluxDB Cloud**.

- [Air sensor sample data](#air-sensor-sample-data)
- [Bird migration sample data](#bird-migration-sample-data)
- [NOAA water sample data](#noaa-water-sample-data)

### Air sensor sample data
Air sensor sample data represents an "Internet of Things" (IoT) use case by simulating
temperature, humidity, and carbon monoxide levels for multiple rooms in a building.
The dataset also includes a relational SQL dataset with meta information about sensors in each room.

<a class="btn" href="https://github.com/influxdata/influxdb2-sample-data/tree/master/air-sensor-data" target="\_blank">
  <span class="icon-github"></span> View air sensor sample data
</a>

_Used in [Query SQL data sources](/influxdb/v2.0/query-data/flux/sql/)._

### Bird migration sample data
Bird migration data is adapted from the
[Movebank: Animal Tracking data set on Kaggle](https://www.kaggle.com/pulkit8595/movebank-animal-tracking)
and represents animal migratory movements throughout 2019.
Use the [Flux Geo package](/influxdb/v2.0/reference/flux/stdlib/experimental/geo/#geo-schema-requirements)
to query and analyze the geo-temporal data in this sample data set.

<a class="btn" href="https://github.com/influxdata/influxdb2-sample-data/tree/master/bird-migration-data" target="\_blank">
 <span class="icon-github"></span> View bird migration sample data
</a>

_Used in [Work with geo-temporal data](/influxdb/v2.0/query-data/flux/geo/)._

### NOAA water sample data

This data set is  publicly available data from the [National Oceanic and Atmospheric Administration’s (NOAA) Center for Operational Oceanographic Products and Services](http://tidesandcurrents.noaa.gov/stations.html).

[The CSV data](https://influx-testdata.s3.amazonaws.com/noaa.csv) includes 15,258
observations of water levels (ft) collected every six minutes at two stations
(Santa Monica, CA (ID 9410840) and Coyote Creek, CA (ID 9414575)) over the period
from August 18, 2015 through September 18, 2015.

To avoid having to re-download this 10MB dataset every time you run a query,
we recommend that you [create a new bucket](/influxdb/v2.0/organizations/buckets/create-bucket/)
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

_Used in [Common queries](/influxdb/v2.0/query-data/common-queries/) and [Common tasks](/influxdb/v2.0/process-data/common-tasks/)._
