---
title: Sample data
description: >
  Use sample data to familiarize yourself with time series data and InfluxDB.
  InfluxData provides many sample time series datasets to use with InfluxDB
  and InfluxDB Cloud.
aliases:
  - /v2.0/write-data/sample-data/
  - /v2.0/reference/sample-data/
menu: influxdb_2_0_ref
weight: 7
---

Use sample data to familiarize yourself with time series data and InfluxDB.
InfluxData provides many sample time series datasets to use with **InfluxDB Cloud** and **InfluxDB**.

## InfluxDB Cloud demo data
Use [InfluxDB Cloud demo data buckets](/v2.0/write-data/quick-start) for quick,
free access to different types of sample data.

{{< youtube GSaByPC1Bdc >}}

{{% note %}}
Demo data is not available for use with third-party integrations such as Grafana.
{{% /note %}}

## Sample data sets
The following sample data sets are used as examples in [InfluxDB query guides](/v2.0/query-data/flux)
and can be used with **InfluxDB OSS** or **InfluxDB Cloud**.

- [Air sensor sample data](#air-sensor-sample-data)
- [Bird migration sample data](#bird-migration-sample-data)

### Air sensor sample data
Air sensor sample data represents an "Internet of Things" (IoT) use case by simulating
temperature, humidity, and carbon monoxide levels for multiple rooms in a building.
The dataset also includes a relational SQL dataset with meta information about sensors in each room.

<a class="btn" href="https://github.com/influxdata/influxdb2-sample-data/tree/master/air-sensor-data" target="\_blank">
  <span class="icon-github"></span> View air sensor sample data
</a>

_Used in [Query SQL data sources](/v2.0/query-data/flux/sql/)._

### Bird migration sample data
Bird migration data is adapted from the
[Movebank: Animal Tracking data set on Kaggle](https://www.kaggle.com/pulkit8595/movebank-animal-tracking)
and represents animal migratory movements throughout 2019.
Use the [Flux Geo package](/influxdb/v2.0/reference/flux/stdlib/experimental/geo/#geo-schema-requirements)
to query and analyze the geo-temporal data in this sample data set.

<a class="btn" href="https://github.com/influxdata/influxdb2-sample-data/tree/master/air-sensor-data" target="\_blank">
 <span class="icon-github"></span> View bird migration sample data
</a>

_Used in [Work with geo-temporal data](/v2.0/query-data/flux/geo/)._
