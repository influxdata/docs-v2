---
title: Explore data using InfluxQL
description: >
  Explore time series data using InfluxData's SQL-like query language. Use the SELECT statement to query data from measurements, tags, and fields.
menu:
  influxdb_2_4:
    name: Explore data
    parent: Query with InfluxQL
weight: 201
---

InfluxQL is an SQL-like query language for interacting with data in InfluxDB.
The following sections detail InfluxQL's `SELECT` statement, other key clauses, and useful query syntax for exploring your data.

{{< children readmore=true hr=true >}}

### Download sample data

InfluxQL example queries use publicly available data from the
[National Oceanic and Atmospheric Administration's (NOAA) Center for Operational Oceanographic Products and Services](http://tidesandcurrents.noaa.gov/stations.html?type=Water+Levels).

To download a subset of NOAA data used in examples, run the script under [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data) (for example, copy and paste the script into your Data Explorer - Script Editor), and replace "example-org" in the script with the name of your InfluxDB organization.

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
occurs at six-minute time intervals.
This measurement has one [tag key](influxdb/v2.4/reference/glossary/#tag-key)
(`location`) which has two [tag values](/influxdb/v2.4/reference/glossary/#tag-value):
`coyote_creek` and `santa_monica`.
The measurement also has two [fields](/influxdb/v2.4/reference/glossary/#field):
`level description` stores string [field values](/influxdb/v2.4/reference/glossary/#field-value)
and `water_level` stores float field values.

{{% note %}}
**Disclaimer:** The `level description` field isn't part of the original NOAA data - we snuck it in there for the sake of having a field key with a special character and string field values.
{{% /note %}}

### Configure timestamps in the InfluxQL shell

The [InfluxQL shell](/influxdb/v2.4/tools/influxql-shell/) returns timestamps in
nanosecond UNIX epoch format by default.

If you are using the [InfluxQL shell](/influxdb/v2.4/tools/influxql-shell/), use the precision helper command `precision rfc3339` to view results in human readable format.

The [InfluxDB API](/influxdb/v2.4/reference/api/influxdb-1x/) returns timestamps
in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) format by default.
Specify alternative formats with the [`epoch` query string parameter](/influxdb/v2.4/reference/api/influxdb-1x/).
