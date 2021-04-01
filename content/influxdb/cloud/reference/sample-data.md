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

Use sample data to familiarize yourself with time series data and InfluxDB.
InfluxData provides many sample time series datasets to use with **InfluxDB Cloud**.

## InfluxDB Cloud demo data
Use [InfluxDB Cloud demo data buckets](/influxdb/cloud/reference/sample-data/#influxdb-cloud-demo-data) for quick,
free access to different types of sample data.

{{< youtube GSaByPC1Bdc >}}

{{% note %}}
Demo data is not available for use with third-party integrations such as Grafana.
{{% /note %}}

## Sample data sets
The following sample data sets are used as examples in [InfluxDB query guides](/influxdb/cloud/query-data/flux).

- [Air sensor sample data](#air-sensor-sample-data)
- [Bird migration sample data](#bird-migration-sample-data)
- [USGS earthquake data](#usgs-earthquake-data)

### Air sensor sample data
Air sensor sample data represents an "Internet of Things" (IoT) use case by simulating
temperature, humidity, and carbon monoxide levels for multiple rooms in a building.
The dataset also includes a relational SQL dataset with meta information about sensors in each room.

<a class="btn" href="https://github.com/influxdata/influxdb2-sample-data/tree/master/air-sensor-data" target="\_blank">
  <span class="icon-github"></span> View air sensor sample data
</a>

_Used in [Query SQL data sources](/influxdb/cloud/query-data/flux/sql/)._

### Bird migration sample data
Bird migration data is adapted from the
[Movebank: Animal Tracking data set on Kaggle](https://www.kaggle.com/pulkit8595/movebank-animal-tracking)
and represents animal migratory movements throughout 2019.
Use the [Flux Geo package](/influxdb/cloud/reference/flux/stdlib/experimental/geo/#geo-schema-requirements)
to query and analyze the geo-temporal data in this sample data set.

<a class="btn" href="https://github.com/influxdata/influxdb2-sample-data/tree/master/bird-migration-data" target="\_blank">
 <span class="icon-github"></span> View bird migration sample data
</a>

_Used in [Work with geo-temporal data](/influxdb/cloud/query-data/flux/geo/)._

### NOAA water sample data

This data set is  publicly available data from the [National Oceanic and Atmospheric Administration’s (NOAA) Center for Operational Oceanographic Products and Services](http://tidesandcurrents.noaa.gov/stations.html).

[The CSV data](https://influx-testdata.s3.amazonaws.com/noaa.csv) includes 15,258
observations of water levels (ft) collected every six minutes at two stations
(Santa Monica, CA (ID 9410840) and Coyote Creek, CA (ID 9414575)) over the period
from August 18, 2015 through September 18, 2015.

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

_Used in [Common queries](/influxdb/cloud/query-data/common-queries/) and [Common tasks](/influxdb/cloud/process-data/common-tasks/)._

### USGS earthquake data
The United States Geological Survey (USGS) collects earthquake data and makes
this data publicly available.
Each earthquake event includes information such as latitude and longitude
coordinates, magnitude, depth, etc.

**To periodically retrieve and write USGS earthquake data to InfluxDB:**

1. [Create a new bucket](/influxdb/cloud/organizations/buckets/create-bucket/) named `usgs`.
2. [Create a new task](/influxdb/cloud/process-data/manage-tasks/create-task/)
   and use the following the following Flux script:

   {{% truncate %}}
```js
import "csv"
import "experimental"
import "experimental/http"

usgsCSV = string(v: (http.get(url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv")).body)

csv.from(csv: usgsCSV, mode: "raw")
  |> map(fn: (r) => ({
    _measurement: "earthquakes",
    _time: time(v: r.time),
    lat: float(v: r.latitude),
    lon: float(v: r.longitude),
    depth: float(v: r.depth),
    depthError: float(v: r.depthError),
    mag: float(v: r.mag),
    magType: string(v: r.magType),
    nst: int(v: r.nst),
    gap: float(v: r.gap),
    dmin: float(v: r.dmin),
    rms: float(v: r.rms),
    net: string(v: r.net),
    id: string(v: r.id),
    updated: int(v: time(v: r.updated)) / 1000000,
    place: string(v: r.place),
    type: string(v: r.type),
    locationSource: string(v: r.locationSource),
    magSource: string(v: r.magSource),
    horizontalError: float(v: r.horizontalError),
    magError: float(v: r.magError),
    magNst: int(v: r.magNst),
  }))
  |> group(columns: ["_measurement", "locationSource", "magSource", "type", "net", "magType"])
  |> experimental.to(bucket: "usgs")
```
    {{% /truncate %}}
    {{% note %}}
USGS updates earthquake data every minute.
This task retrieves earthquake data for the current day, so set your task's
`every` interval between `1m` and `24h`, depending on how often you want to
retrieve new data.
    {{% /note %}}

The task writes to following to InfluxDB:

**Fields:**  
[lat](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#latitude),
[lon](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#longitude),
[depth](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#depth),
[depthError](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#depthError),
[mag](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#mag),
[nst](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#nst),
[gap](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#gap),
[dmin](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#dmin),
[rms](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#rms),
[id](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#id),
[updated](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#updated),
[place](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#place),
[horizontalError](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#horizontalError),
[magError](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#magError),
[magNst](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#magNst)

**Tags:**  
[magType](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#magType),
[net](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#net),
[type](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#type),
[locationSource](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#locationSource),
[magSource](https://earthquake.usgs.gov/data/comcat/data-eventterms.php#magSource)
