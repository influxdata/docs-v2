---
title: Sample data
description: >
  Use sample data to familiarize yourself with time series data and InfluxDB.
  InfluxData provides many sample time series datasets to use with InfluxDB
  and InfluxDB Cloud.
menu:
  v2_0:
    parent: Write data
weight: 105
---

Use sample data to familiarize yourself with time series data and InfluxDB.
InfluxData provides many sample time series datasets to use with **InfluxDB** and **InfluxDB Cloud**.

{{< children >}}

---

### Air sensor sample data
The air sensor sample data is designed to represent an "Internet of Things" (IoT) use case
 by simulating temperature, humidity, and carbon monoxide levels for multiple rooms in a building.
The dataset also includes a relational SQL dataset with meta information about sensors in each room.

<a class="btn" href="https://github.com/influxdata/influxdb2-sample-data/tree/master/air-sensor-data" target="\_blank">
  <span class="icon-github"></span> View air sensor sample data
</a>

_Used in [Query SQL data sources](/v2.0/query-data/flux/sql/)._

---

### Bird migration sample data
This sample data is adapted from the [Movebank: Animal Tracking](https://www.kaggle.com/pulkit8595/movebank-animal-tracking)
dataset available on [kaggle.com](https://kaggle.com).
The dataset as a whole represents animal migratory movements throughout 2019.
The data schema meets the requirements of the
[Flux Geo package](https://v2.docs.influxdata.com/v2.0/reference/flux/stdlib/experimental/geo/#geo-schema-requirements)
which contains tools for working with geo-temporal data.

<a class="btn" href="https://github.com/influxdata/influxdb2-sample-data/tree/master/air-sensor-data" target="\_blank">
 <span class="icon-github"></span> View bird migration sample data
</a>

_Used in [Work with geo-temporal data](/v2.0/query-data/flux/geo/)._
