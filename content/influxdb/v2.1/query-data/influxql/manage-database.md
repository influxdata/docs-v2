---
title: Manage your database using InfluxQL
description: >
  Use InfluxQL to administer your InfluxDB server and work with InfluxDB databases, retention policies, series, measurements, and shards.
menu:
  influxdb_2_1:
    name: Manage your database
    parent: Query with InfluxQL
    identifier: manage-database
weight: 204
---

Use of InfluxQL database management commands in 2.x versions is limited.  

The examples in the sections below use the InfluxDB [Command Line Interface (CLI)](/influxdb/v2.4/reference/cli/influx/). 
You can also execute the commands using the InfluxDB API; simply  send a `GET` request to the `/query` endpoint and include the command in the URL parameter `q`.
For more on using the InfluxDB API, see [Querying data](/enterprise_influxdb/v1.9/guides/querying_data/).

> **Note:** When authentication is enabled, only admin users can execute most of the commands listed on this page.
> See the documentation on [authentication and authorization](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/) for more information.


## Data management using DELETE

### Delete series with DELETE

The `DELETE` query deletes all points from a
[series](/enterprise_influxdb/v1.9/concepts/glossary/#series) in a database.
Unlike
[`DROP SERIES`](/enterprise_influxdb/v1.9/query_language/manage-database/#drop-series-from-the-index-with-drop-series), `DELETE` does not drop the series from the index.

You must include either the `FROM` clause, the `WHERE` clause, or both:

```
DELETE FROM <measurement_name> WHERE [<tag_key>='<tag_value>'] | [<time interval>]
```

Delete all data associated with the measurement `h2o_feet`:
```
> DELETE FROM "h2o_feet"
```

Delete all data associated with the measurement `h2o_quality` and where the tag `randtag` equals `3`:
```
> DELETE FROM "h2o_quality" WHERE "randtag" = '3'
```

Delete all data in the database that occur before January 01, 2020:
```
> DELETE WHERE time < '2020-01-01'
```

A successful `DELETE` query returns an empty result.

Things to note about `DELETE`:

* `DELETE` supports
[regular expressions](/enterprise_influxdb/v1.9/query_language/explore-data/#regular-expressions)
in the `FROM` clause when specifying measurement names and in the `WHERE` clause
when specifying tag values.
* `DELETE` does not support [fields](/enterprise_influxdb/v1.9/concepts/glossary/#field) in the `WHERE` clause.
* If you need to delete points in the future, you must specify that time period as `DELETE SERIES` runs for `time < now()` by default. [Syntax](https://github.com/influxdata/influxdb/issues/8007)

### Delete measurements with DROP MEASUREMENT

The `DROP MEASUREMENT` query deletes all data and series from the specified [measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement) and deletes the
measurement from the index.

The query takes the following form:
```sql
DROP MEASUREMENT <measurement_name>
```

Delete the measurement `h2o_feet`:
```sql
> DROP MEASUREMENT "h2o_feet"
```

> **Note:** `DROP MEASUREMENT` drops all data and series in the measurement.
It does not drop the associated continuous queries.

A successful `DROP MEASUREMENT` query returns an empty result.

{{% warn %}} Currently, InfluxDB does not support regular expressions with `DROP MEASUREMENTS`.
See GitHub Issue [#4275](https://github.com/influxdb/influxdb/issues/4275) for more information.
{{% /warn %}}

<!-- ### Delete a shard with DROP SHARD

The `DROP SHARD` query deletes a shard. It also drops the shard from the
[metastore](/enterprise_influxdb/v1.9/concepts/glossary/#metastore).
The query takes the following form:
```sql
DROP SHARD <shard_id_number>
```

Delete the shard with the id `1`:
```
> DROP SHARD 1
>
```

A successful `DROP SHARD` query returns an empty result.
InfluxDB does not return an error if you attempt to drop a shard that does not
exist. -->

<!-- ##### `SHARD DURATION`

- Optional. The `SHARD DURATION` clause determines the time range covered by a [shard group](/enterprise_influxdb/v1.9/concepts/glossary/#shard-group).
- The `<duration>` is a [duration literal](/enterprise_influxdb/v1.9/query_language/spec/#durations)
and does not support an `INF` (infinite) duration.
- By default, the shard group duration is determined by the retention policy's
`DURATION`:

| Retention Policy's DURATION  | Shard Group Duration  |
|---|---|
| < 2 days  | 1 hour  |
| >= 2 days and <= 6 months  | 1 day  |
| > 6 months  | 7 days  |

The minimum allowable `SHARD GROUP DURATION` is `1h`.
If the `CREATE RETENTION POLICY` query attempts to set the `SHARD GROUP DURATION` to less than `1h` and greater than `0s`, InfluxDB automatically sets the `SHARD GROUP DURATION` to `1h`.
If the `CREATE RETENTION POLICY` query attempts to set the `SHARD GROUP DURATION` to `0s`, InfluxDB automatically sets the `SHARD GROUP DURATION` according to the default settings listed above.

See
[Shard group duration management](/enterprise_influxdb/v1.9/concepts/schema_and_data_layout/#shard-group-duration-management)
for recommended configurations.

##### `DEFAULT`

Sets the new retention policy as the default retention policy for the database.
This setting is optional.

