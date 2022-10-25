---
title: Manage your data using InfluxQL
description: >
  Use InfluxQL data management commands to manage data.
menu:
  influxdb_2_4:
    name: Manage your data
    parent: Query with InfluxQL
    identifier: manage-database
weight: 204
---

Use of InfluxQL data management statements in InfuxDB 2.x is limited.  

The examples in the sections below use the [InfluxQL shell](/influxdb/v2.4/tools/influxql-shell/). 

You can also execute the commands using the 1.x compatibility API; simply  send a `GET` request to the `/query` endpoint and include the command in the URL parameter `q`.
For more information, see [InfluxDB 1.x compatibility API](/influxdb/v2.4/reference/api/influxdb-1x/).

<!-- {{% note %}}
**Note:** When authentication is enabled, only admin users can execute most of the commands listed on this page.
See the documentation on [authentication and authorization](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/) for more information.
{{% /note %}} -->

### Delete series with DELETE

The `DELETE` statement deletes all points from a [series](/influxdb/v2.4/reference/glossary/#series) in a database. You must include either the [`FROM` clause](/influxdb/v2.4/query-data/influxql/explore-data/select/#from-clause), the [`WHERE` clause](/influxdb/v2.4/query-data/influxql/explore-data/where/), or both:

```sql
DELETE FROM <measurement_name> WHERE [<tag_key>='<tag_value>'] | [<time interval>]
```

Delete all data associated with the measurement `h2o_feet`:

```sql
> DELETE FROM "h2o_feet"
```

Delete all data associated with the measurement `h2o_quality` and where the tag `randtag` equals `3`:

```sql
> DELETE FROM "h2o_quality" WHERE "randtag" = '3'
```

Delete all data in the database that occur before January 01, 2020:

```sql
> DELETE WHERE time < '2020-01-01'
```

A successful `DELETE` query returns an empty result.

If you need to delete points in the future, you must specify the future time period because `DELETE SERIES` runs for `time < now()` by default. 

Delete future points:

```sql 
> DELETE FROM device_data WHERE "device" = 'sensor1" and time > now() and < '2024-01-14T01:00:00Z'
```

Delete points in the future within a specified time range:

```sql
> DELETE FROM device_data WHERE "device" = 'sensor15" and time >= '2024-01-01T12:00:00Z' and <= '2025-06-30T11:59:00Z'
```

Things to note about `DELETE`:

* `DELETE` supports
[regular expressions](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/)
in the `FROM` clause when specifying measurement names and in the `WHERE` clause
when specifying tag values.
* `DELETE` does not support [fields](/influxdb/v2.4/reference/glossary/#field) in the `WHERE` clause.

### Delete measurements with DROP MEASUREMENT

The `DROP MEASUREMENT` statement deletes all data and series from the specified [measurement](/influxdb/v2.4/reference/glossary/#measurement) and deletes the
measurement from the index.

The query takes the following form:
```sql
DROP MEASUREMENT <measurement_name>
```

Delete the measurement `h2o_feet`:
```sql
> DROP MEASUREMENT "h2o_feet"
```

A successful `DROP MEASUREMENT` query returns an empty result.

{{% warn %}} Currently, InfluxDB does not support regular expressions with `DROP MEASUREMENTS`.
See GitHub Issue [#4275](https://github.com/influxdb/influxdb/issues/4275) for more information.
{{% /warn %}}

