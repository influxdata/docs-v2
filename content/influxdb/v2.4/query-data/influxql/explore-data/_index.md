---
title: Explore data using InfluxQL
description: >
  Explore time series data using InfluxData's SQL-like query language. Understand how to use the SELECT statement to query data from measurements, tags, and fields.
menu:
  influxdb_2_4:
    name: Explore data
    parent: Query with InfluxQL
weight: 202
---

InfluxQL is an SQL-like query language for interacting with data in InfluxDB.
The following sections detail InfluxQL's `SELECT` statement, as well as other key clauses, and useful query syntax
for exploring your data.

{{< children readmore=true hr=true >}}

### Sample data

This document uses publicly available data from the
[National Oceanic and Atmospheric Administration's (NOAA) Center for Operational Oceanographic Products and Services](http://tidesandcurrents.noaa.gov/stations.html?type=Water+Levels).
See the [Sample Data](influxdb/v2.4/reference/sample-data/#noaa-sample-data) page to download
the data and follow along with the example queries in the sections below.

Let's get acquainted with this subsample of the data in the `h2o_feet` measurement:

Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

|time | level description | location | water_level |
| :------------------- | :------------------ | :----------------------- |----------------------:|
| 2019-08-18T00:00:00Z | between 6 and 9 feet |coyote_creek   | 8.1200000000 |
| 2019-08-18T00:00:00Z | below 3 feet | santa_monica          | 2.0640000000 |
| 2019-08-18T00:06:00Z | between 6 and 9 feet |	coyote_creek  | 8.0050000000 |
| 2019-08-18T00:06:00Z | below 3 feet|	santa_monica          | 2.1160000000 |
| 2019-08-18T00:12:00Z | between 6 and 9 feet|	coyote_creek  | 7.8870000000 |
| 2019-08-18T00:12:00Z | below 3 feet | santa_monica          | 2.0280000000 |                                     
                                                
The data in the `h2o_feet` [measurement](/influxdb/v2.4/reference/glossary/#measurement)
occur at six-minute time intervals.
The measurement has one [tag key](influxdb/v2.4/reference/glossary/#tag-key)
(`location`) which has two [tag values](/influxdb/v2.4/reference/glossary/#tag-value):
`coyote_creek` and `santa_monica`.
The measurement also has two [fields](/influxdb/v2.4/reference/glossary/#field):
`level description` stores string [field values](/influxdb/v2.4/reference/glossary/#field-value)
and `water_level` stores float field values.
All of these data is in the `noaa` [database](/influxdb/v2.4/reference/glossary/#database).

{{% note %}}
**Disclaimer:** The `level description` field isn't part of the original NOAA data - we snuck it in there for the sake of having a field key with a special character and string field values.
{{% /note %}}

### Configuring the returned timestamps

The [InfluxQL shell](/influxdb/v2.4/tools/influxql-shell/) returns timestamps in
nanosecond UNIX epoch format by default.
Specify alternative formats with the
[`precision <format>` command](/influxdb/v2.4/tools/influxql-shell/#precision).  

If you are using the [InfluxQL shell](/influxdb/v2.4/tools/influxql-shell/), use the precision helper command `precision rfc3339` to view results in human readable format.

The [InfluxDB API](/influxdb/v2.4/reference/api/influxdb-1x/) returns timestamps
in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) format by default.
Specify alternative formats with the
[`epoch` query string parameter](/influxdb/v2.4/reference/api/influxdb-1x/).

