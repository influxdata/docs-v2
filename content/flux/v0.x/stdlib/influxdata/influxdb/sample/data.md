---
title: sample.data() function
description: >
  The `sample.data()` function downloads and outputs an InfluxDB sample dataset.
menu:
  flux_0_x_ref:
    name: sample.data
    parent: sample-pkg
weight: 301
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-sample/data
  - /influxdb/cloud/reference/flux/stdlib/influxdb-sample/data
related:
  - /influxdb/v2.0/reference/sample-data/
flux/v0.x/tags: [sample data, inputs]
introduced: 0.123.0
---

The `sample.data()` function downloads and outputs an InfluxDB sample dataset.

```js
import "influxdata/influxdb/sample"

sample.data(
  set: "airSensor"
)
```

{{% note %}}
#### Network bandwidth
Each execution of `sample.data()` downloads the specified dataset from **Amazon S3**.
If using [InfluxDB Cloud](/influxdb/cloud/) or a hosted InfluxDB OSS instance,
you may see additional network bandwidth costs when using this function.
Approximate sample dataset sizes are listed [below](#available-influxdb-sample-datasets)
and in the output of [`sample.list()`](/flux/v0.x/stdlib/influxdata/influxdb/sample/list/).
{{% /note %}}

## Parameters

### set {data-type="string"}
({{< req >}}) InfluxDB sample dataset to download and output.

**Valid values**:

- [`airSensor`](#airsensor)
- [`birdMigration`](#birdmigration)
- [`bitcoin`](#bitcoin)
- [`machineProduction`](#machineproduction)
- [`noaa`](#noaa)
- [`noaaWater`](#noaawater)
- [`usgs`](#usgs)

## Available InfluxDB sample datasets

### airSensor

Simulated office building air sensor data with temperature,
humidity, and carbon monoxide metrics.

{{% caption %}}
**Size**: ~600 KB • **Updated**: every 15m
{{% /caption %}}

### birdMigration

2019 African bird migration data from the
[Movebank: Animal Tracking](https://www.kaggle.com/pulkit8595/movebank-animal-tracking) dataset.
Contains geotemporal data between 2019-01-01 and 2019-12-31.

{{% caption %}}
**Size**: ~1.2 MB • **Updated**: N/A
{{% /caption %}}

### bitcoin

Bitcoin price data from the last 30 days ([Powered by CoinDesk](https://www.coindesk.com/price/bitcoin)).
Data is updated approximately every 15m.

{{% caption %}}
**Size**: ~700 KB • **Updated**: every 15m
{{% /caption %}}

### machineProduction

States and metrics reported from four automated grinding wheel stations on a production line.
Contains data from 2021-08-01T00:00:00Z to 2021-08-01T23:59:59Z.

{{% caption %}}
**Size**: ~11.9 MB • **Updated**: N/A
{{% /caption %}}

### noaa

Latest observations from the [NOAA National Data Buoy Center (NDBC)](https://www.ndbc.noaa.gov/).
Contains only the most recent observations (no historical data).
Data is updated approximately every 15m.

{{% caption %}}
**Size**: ~1.3 MB • **Updated**: every 15m
{{% /caption %}}

### noaaWater

Water level observations from two stations reported by the NOAA Center for
Operational Oceanographic Products and Services.
Contains data between 2019-08-17 and 2019-09-17.

{{% caption %}}
**Size**: ~10.3 MB • **Updated**: N/A
{{% /caption %}}

### usgs

USGS earthquake data from the last week.
Contains geotemporal data collected from USGS seismic sensors around the world.
Data is updated approximately every 15m. 

{{% caption %}}
**Size**: ~6 MB • **Updated**: every 15m
{{% /caption %}}

## Examples

#### Return USGS earthquake data from the last week
```js
import "influxdata/influxdb/sample"

sample.data(set: "usgs")
```

#### Download and write NOAA NDBC data to InfluxDB
Add the following as an [InfluxDB task](/{{< latest "influxdb" >}}/process-data/)
to regularly collect the latest reported observations from the NOAA NDBC.

{{% get-shared-text "flux/noaa-ndbc-sample-task.md" %}}
