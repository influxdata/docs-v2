---
title: Get started with InfluxDB Cloud Serverless
list_title: Get started
description: >
  Start collecting, querying, processing, and visualizing data in InfluxDB Cloud Serverless.
menu:
  influxdb3_cloud_serverless:
    name: Get started
weight: 3
influxdb3/cloud-serverless/tags: [get-started]
---

InfluxDB {{< current-version >}} is the platform purpose-built to collect, store,
process and visualize time series data.
The InfluxDB 3.0 storage engine provides a number of benefits including nearly
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

The {{% product-name %}} data model organizes time series data into buckets and measurements.
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

The following table compares tools that you can use to interact with {{% product-name %}}.
This tutorial covers many of the recommended tools.

| Tool                              | Administration  | Write   | Query   |
|:--------------------------------- |:---------------:|:-------:|:-------:|
| [Chronograf](/chronograf/v1/)     |       -         |   -     | **{{< icon "check" >}}**  |
| [`influx` CLI](#influx-cli)                                         |     **{{< icon "check" >}}**      | **{{< icon "check" >}}**  |   -     |
| [`influx3` data CLI](#influx3-data-cli){{< req text="\* " color="magenta" >}}               |       -         | **{{< icon "check" >}}**  | **{{< icon "check" >}}**  |
| <span style="color:gray">`influxctl` CLI</span>                          |       -         |   -     |   -     |
| [InfluxDB HTTP API](#influxdb-http-api)                          |    **{{< icon "check" >}}**        |   **{{< icon "check" >}}**  |   **{{< icon "check" >}}**     |
| [InfluxDB user interface](#influxdb-user-interface) {{< req text="\* " color="magenta" >}} |     **{{< icon "check" >}}**      |   -     | **{{< icon "check" >}}**  |
| [InfluxDB 3 client libraries](#influxdb-3-client-libraries){{< req text="\* " color="magenta" >}}      |       -         | **{{< icon "check" >}}**  | **{{< icon "check" >}}**  |
| [InfluxDB v1 client libraries](/influxdb3/cloud-serverless/reference/client-libraries/v1/)      |       -         | **{{< icon "check" >}}**  | **{{< icon "check" >}}**  |
| [InfluxDB v2 client libraries](/influxdb3/cloud-serverless/reference/client-libraries/v2/)      |     **{{< icon "check" >}}**      | **{{< icon "check" >}}**  |   -     |
| Telegraf                          |       -         | **{{< icon "check" >}}**  |   -     |
| **Third-party tools**                                                   |
| Flight SQL clients               |       -         |   -     | **{{< icon "check" >}}**  |
|  [Grafana](/influxdb3/cloud-serverless/query-data/sql/execute-queries/grafana/)  |       -         |   -     | **{{< icon "check" >}}**  |
| [Superset](/influxdb3/cloud-serverless/query-data/sql/execute-queries/superset/) |       -         |   -     | **{{< icon "check" >}}**  |
| [Tableau](/influxdb3/cloud-serverless/process-data/visualize/tableau/)           |       -         |   -     | **{{< icon "check" >}}**  |

{{< req type="key" text="Covered in this tutorial" color="magenta" >}}

> [!Warning]
> The `influxctl` admin CLI isn't available for {{% product-name %}}.
> It only works with InfluxDB Cloud Dedicated and InfluxDB Clustered.

### InfluxDB user interface

The InfluxDB user interface (UI) provides a web-based visual interface for interacting with and managing InfluxDB.
To access the {{% product-name %}} UI, [log into your InfluxDB Cloud account](https://cloud2.influxdata.com).

### `influx` CLI

The `influx` CLI lets you manage {{% product-name %}} and write data from a command line.
Querying {{% product-name %}} isn't supported.

For detailed CLI installation instructions, see
the [`influx` CLI reference](/influxdb3/cloud-serverless/reference/cli/influx/).

### `influx3` data CLI

The [`influx3` data CLI](/influxdb3/cloud-serverless/get-started/query/?t=influx3+CLI#execute-an-sql-query) is a community-maintained tool that lets you write and query data in {{% product-name %}} from a command line.
It uses the HTTP API to write data and uses Flight gRPC to query data.

### InfluxDB HTTP API

The [InfluxDB HTTP API](/influxdb/v2/reference/api/) provides a simple way to let you manage {{% product-name %}} and write and query data using HTTP(S) clients.
Examples in this tutorial use cURL, but any HTTP(S) client will work.

The `/write` and `/query` v1-compatible endpoints work with the username/password authentication schemes and existing InfluxDB 1.x tools and code.
The `/api/v2/write` v2-compatible endpoint works with existing InfluxDB 2.x tools and code.

### InfluxDB client libraries

InfluxDB client libraries are community-maintained, language-specific clients that interact with InfluxDB APIs.

[InfluxDB 3 client libraries](/influxdb3/cloud-serverless/reference/client-libraries/v3/) are the recommended client libraries for writing and querying data {{% product-name %}}.
They use the HTTP API to write data and use Flight gRPC to query data.

[InfluxDB v2 client libraries](/influxdb3/cloud-serverless/reference/client-libraries/v2/) can use `/api/v2` HTTP endpoints to manage resources such as buckets and API tokens, and write data in {{% product-name %}}.

[InfluxDB v1 client libraries](/influxdb3/cloud-serverless/reference/client-libraries/v1/) can write data to {{% product-name %}}.

## Authorization

**{{% product-name %}} requires authentication** using [API tokens](/influxdb3/cloud-serverless/admin/tokens/).
Each API token is associated with a user and a specific set of permissions for InfluxDB resources.
You can use administration tools such as the InfluxDB UI, the `influx` CLI, or the InfluxDB HTTP API to create and manage API tokens.

{{< page-nav next="/influxdb3/cloud-serverless/get-started/setup/" >}}
