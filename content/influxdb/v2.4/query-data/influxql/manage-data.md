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

In InfluxDB 2.x, InfluxQL data management commands are **limited to deleting data**:

- [Delete series with DELETE](#delete-series-with-delete)
- [Delete measurements with DROP MEASUREMENT](#delete-measurements-with-drop-measurement)

{{% note %}}

#### Examples use the InfluxQL shell

Examples show how to run commands using the [InfluxQL shell](/influxdb/v2.4/tools/influxql-shell/). You can also query with InfluxQL using the [InfluxDB 1.x compatibility API](/influxdb/v2.4/reference/api/influxdb-1x/) by sending a `GET` request to the `/query` endpoint and including the command in the URL parameter `q`.

For information about how to get started querying using either the InfluxQL shell or the InfluxDB API, see how to [Query data with InfluxQL](/influxdb/v2.4/query-data/influxql).
{{% /note %}}

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
