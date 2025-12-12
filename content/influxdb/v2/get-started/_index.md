---
title: Get started with InfluxDB
list_title: Get started
description: >
  Start collecting, querying, processing, and visualizing data in InfluxDB OSS.
menu:
  influxdb_v2:
    name: Get started
weight: 3
influxdb/v2/tags: [get-started]
aliases:
  - /influxdb/v2/introduction/get-started/
  - /influxdb/v2/introduction/getting-started/
---

InfluxDB {{< current-version >}} is the platform purpose-built to collect, store,
process and visualize time series data.
**Time series data** is a sequence of data points indexed in time order.
Data points typically consist of successive measurements made from the same
source and are used to track changes over time.
Examples of time series data include:

- Industrial sensor data
- Server performance metrics
- Heartbeats per minute
- Electrical activity in the brain
- Rainfall measurements
- Stock prices

This multi-part tutorial walks you through writing time series data to InfluxDB {{< current-version >}},
querying that data, processing and alerting on the data, and then visualizing the data.

## Key concepts before you get started

Before you get started using InfluxDB, it's important to understand how time series
data is organized and stored in InfluxDB and some key definitions that are used
throughout this documentation.

### Data organization

The InfluxDB data model organizes time series data into buckets and measurements.
A bucket can contain multiple measurements. Measurements contain multiple
tags and fields.

- **Bucket**<span id="creating-a-database"></span>: Named location where time series data is stored.
  A bucket can contain multiple _measurements_.
  - **Measurement**: Logical grouping for time series data.
    All _points_ in a given measurement should have the same _tags_.
    A measurement contains multiple _tags_ and _fields_.
      - **Tags**: Key-value pairs with values that differ, but do not change often.
        Tags are meant for storing metadata for each point--for example,
        something to identify the source of the data like host, location, station, etc.
      - **Fields**: Key-value pairs with values that change over time--for example: temperature, pressure, stock price, etc.
      - **Timestamp**: Timestamp associated with the data.
        When stored on disk and queried, all data is ordered by time.

_For detailed information and examples of the InfluxDB data model, see
[Data elements](/influxdb/v2/reference/key-concepts/data-elements/)._

### Important definitions

The following are important definitions to understand when using InfluxDB:

- **Point**: Single data record identified by its _measurement, tag keys, tag values, field key, and timestamp_.
- **Series**: A group of points with the same
  {{% show-in "v2" %}}_measurement, tag keys, and tag values_.{{% /show-in %}}
  {{% show-in "cloud,cloud-serverless" %}}_measurement, tag keys and values, and field key_.{{% /show-in %}}

##### Example InfluxDB query results

{{< influxdb/points-series-flux >}}

## Tools to use

Throughout this tutorial, there are multiple tools you can use to interact with
InfluxDB {{< current-version >}}. Examples are provided for each of the following:

- [InfluxDB user interface (UI)](#influxdb-user-interface-ui)
- [`influx` CLI](#influx-cli)
- [InfluxDB HTTP API](#influxdb-http-api)

### InfluxDB user interface (UI)

The InfluxDB UI provides a web-based visual interface for interacting with and managing InfluxDB.
{{% show-in "v2" %}}The UI is packaged with InfluxDB and runs as part of the InfluxDB service. To access the UI, with InfluxDB running, visit [localhost:8086](http://localhost:8086) in your browser.{{% /show-in %}}
{{% show-in "cloud,cloud-serverless" %}}To access the InfluxDB Cloud UI, [log into your InfluxDB Cloud account](https://cloud2.influxdata.com).{{% /show-in %}}

### `influx` CLI

The `influx` CLI lets you interact with and manage InfluxDB {{< current-version >}} from a command line.
{{% show-in "v2" %}}The CLI is packaged separately from InfluxDB and must be downloaded and installed separately.{{% /show-in %}}
For detailed CLI installation instructions, see
[Use the influx CLI](/influxdb/v2/tools/influx-cli/).

### InfluxDB HTTP API

The [InfluxDB API](/influxdb/v2/reference/api/) provides a simple way to
interact with the InfluxDB {{< current-version >}} using HTTP(S) clients.
Examples in this tutorial use cURL, but any HTTP(S) client will work.

{{% note %}}
#### InfluxDB client libraries

[InfluxDB client libraries](/influxdb/v2/api-guide/client-libraries/) are
language-specific clients that interact with the InfluxDB HTTP API.
Examples for client libraries are not provided in this tutorial, but these can
be used to perform all the actions outlined in this tutorial.
{{% /note %}}

## Authorization

**InfluxDB {{< current-version >}} requires authentication** using [API tokens](/influxdb/v2/admin/tokens/).
Each API token is associated with a user and a specific set of permissions for InfluxDB resources.

{{< page-nav next="/influxdb/v2/get-started/setup/" >}}

---

{{< influxdbu "influxdb-101" >}}
