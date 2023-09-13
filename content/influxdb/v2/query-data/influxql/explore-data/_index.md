---
title: Explore data using InfluxQL
description: >
  Explore time series data using InfluxQL, InfluxData's SQL-like query language.
  Use the `SELECT` statement to query data from measurements, tags, and fields.
menu:
  influxdb_v2:
    name: Explore data
    parent: Query with InfluxQL
weight: 202
---

To start exploring data with InfluxQL, do the following:

1. Verify your bucket has a database and retention policy (DBRP) mapping by [listing DBRP mappings for your bucket](/influxdb/v2/query-data/influxql/dbrp/#list-dbrp-mappings). If not, [create a new DBRP mapping](/influxdb/v2/query-data/influxql/dbrp/#create-dbrp-mappings).

2. [Configure timestamps in the InfluxQL shell](/influxdb/v2/query-data/influxql/explore-data/time-and-timezone/).

3. _(Optional)_ If you would like to use the data used in the examples below, [download the NOAA sample data](#download-sample-data).

4. Use the InfluxQL `SELECT` statement with other key clauses to explore your data.

{{< children type="anchored-list" >}}

{{< children readmore=true hr=true >}}

## Download sample data

The example InfluxQL queries in this documentation use publicly available [National Oceanic and Atmospheric Administration (NOAA)](https://www.noaa.gov/) data.

To download a subset of NOAA data used in examples, run the script under [NOAA water sample data](/influxdb/v2/reference/sample-data/#noaa-water-sample-data) (for example, copy and paste the script into your Data Explorer - Script Editor), and replace "example-org" in the script with the name of your InfluxDB organization.

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
                                                
The data in the `h2o_feet` [measurement](/influxdb/v2/reference/glossary/#measurement)
occurs at six-minute time intervals.
This measurement has one [tag key](/influxdb/v2/reference/glossary/#tag-key)
(`location`) which has two [tag values](/influxdb/v2/reference/glossary/#tag-value):
`coyote_creek` and `santa_monica`.
The measurement also has two [fields](/influxdb/v2/reference/glossary/#field):
`level description` stores string [field values](/influxdb/v2/reference/glossary/#field-value)
and `water_level` stores float field values.


### Configure timestamps in the InfluxQL shell

By default, the [InfluxQL shell](/influxdb/v2/tools/influxql-shell/) returns timestamps in
nanosecond UNIX epoch format by default.
To return human-readable RFC3339 timestamps instead of Unix nanosecond timestamps,
use the [precision helper command](/influxdb/v2/tools/influxql-shell/#precision) ` to configure
the timestamp format:

```sql
precision rfc3339
```

The [InfluxDB API](/influxdb/v2/reference/api/influxdb-1x/) returns timestamps
in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) format by default.
Specify alternative formats with the [`epoch` query string parameter](/influxdb/v2/reference/api/influxdb-1x/).
