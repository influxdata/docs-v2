---
title: Get started with InfluxDB Cloud Serverless
list_title: Get started
description: >
  Start collecting, querying, processing, and visualizing data in InfluxDB Cloud Serverless.
menu:
  influxdb_cloud_serverless:
    name: Get started
weight: 3
influxdb/cloud-serverless/tags: [get-started]
---

InfluxDB {{< current-version >}} is the platform purpose-built to collect, store,
process and visualize time series data.
The InfluxDB IOx storage engine provides a number of benefits including nearly
unlimited series cardinality, improved query performance, and interoperability
with widely used data processing tools and platforms.

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
querying, and then visualizing that data.

## Key concepts before you get started

Before you get started using InfluxDB, it's important to understand how time series
data is organized and stored in InfluxDB and some key definitions that are used
throughout this documentation.

- [Data organization](#data-organization)
- [Schema on write](#schema-on-write)
- [Important definitions](#important-definitions)

### Data organization

The InfluxDB data model organizes time series data into buckets and measurements.
A bucket can contain multiple measurements. Measurements contain multiple
tags and fields.

- **Bucket**: Named location where time series data is stored.
  A bucket can contain multiple _measurements_.
  - **Measurement**: Logical grouping for time series data.
    All _points_ in a given measurement should have the same _tags_.
    A measurement contains multiple _tags_ and _fields_.
      - **Tags**: Key-value pairs that provide metadata for each point--for example,
        something to identify the source or context of the data like host,
        location, station, etc.
        Tag values may be null.
      - **Fields**: Key-value pairs with values that change over time--for example,
        temperature, pressure, stock price, etc.
        Field values may be null, but at least one field value is not null on any given row.
      - **Timestamp**: Timestamp associated with the data.
        When stored on disk and queried, all data is ordered by time.
        A timestamp is never null.

<!-- _For detailed information and examples of the InfluxDB data model, see
[Data elements](/influxdb/v2/reference/key-concepts/data-elements/)._ -->

### Schema on write

When using InfluxDB, you define your schema as you write your data.
You don't need to create measurements (equivalent to a relational table) or
explicitly define the schema of the measurement.
Measurement schemas are defined by the schema of data as it is written to the measurement.

### Important definitions

The following definitions are important to understand when using InfluxDB:

- **Point**: Single data record identified by its _measurement, tag keys, tag values, field key, and timestamp_.
- **Series**: A group of points with the same _measurement, tag keys and values, and field key_.
- **Primary key**: Columns used to uniquely identify each row in a table.
  Rows are uniquely identified by their _timestamp and tag set_.
  A row's primary key _tag set_ does not include tags with null values.

##### Example InfluxDB query results

{{< influxdb/points-series-sql >}}

## Tools to use

Throughout this tutorial, there are multiple tools you can use to interact with
InfluxDB {{< current-version >}}. Examples are provided for each of the following:

- [InfluxDB user interface](#influxdb-user-interface)
- [`influx` CLI](#influx-cli)
- [InfluxDB HTTP API](#influxdb-http-api)

### InfluxDB user interface

The InfluxDB user interface (UI) provides a web-based visual interface for interacting with and managing InfluxDB.
To access the InfluxDB Cloud Serverless UI, [log into your InfluxDB Cloud account](https://cloud2.influxdata.com).

### `influx` CLI

The `influx` CLI lets you interact with and manage InfluxDB Cloud Serverless from a command line.
For detailed CLI installation instructions, see
the [`influx` CLI reference](/influxdb/cloud-serverless/reference/cli/influx/).

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

**InfluxDB {{< current-version >}} requires authentication** using [API tokens](/influxdb/v2/security/tokens/).
Each API token is associated with a user and a specific set of permissions for InfluxDB resources.

{{< page-nav next="/influxdb/cloud-serverless/get-started/setup/" >}}
