
Use the following data management commands to write and delete data with InfluxQL:

- [Write data with INSERT](#write-data-with-insert)
- [Delete series with DELETE](#delete-series-with-delete)
- [Delete measurements with DROP MEASUREMENT](#delete-measurements-with-drop-measurement)

## Write data with INSERT

The `INSERT` statement writes [line protocol](/influxdb/version/reference/syntax/line-protocol/)
to a database and retention policy.

### Syntax
```sql
INSERT [INTO <database>[.<retention-policy>]] <line-protocol>
```

- The `INTO` clause is optional.
  If the command does not include `INTO`, you must specify the
  database with `USE <database_name>` when using the [InfluxQL shell](/influxdb/version/tools/influxql-shell/)
  or with the `db` query string parameter in the
  [InfluxDB 1.x compatibility API](/influxdb/version/reference/api/influxdb-1x/) request.

### Examples

- [Insert data into the a specific database and retention policy](#insert-data-into-the-a-specific-database-and-retention-policy)
- [Insert data into the a the default retention policy of a database](#insert-data-into-the-a-the-default-retention-policy-of-a-database)
- [Insert data into the currently used database](#insert-data-into-the-currently-used-database)

#### Insert data into the a specific database and retention policy

```sql
INSERT INTO mydb.myrp example-m,tag1=value1 field1=1i 1640995200000000000
```

#### Insert data into the a the default retention policy of a database

```sql
INSERT INTO mydb example-m,tag1=value1 field1=1i 1640995200000000000
```

#### Insert data into the currently used database

The following example uses the [InfluxQL shell](/influxdb/version/tools/influxql-shell).

```sql
> USE mydb
> INSERT example-m,tag1=value1 field1=1i 1640995200000000000
```

## Delete series with DELETE

The `DELETE` statement deletes all points from a [series](/influxdb/version/reference/glossary/#series) in a database.

### Syntax

```sql
DELETE FROM <measurement_name> WHERE [<tag_key>='<tag_value>'] | [<time interval>]
```

You must include either the [`FROM` clause](/influxdb/version/query-data/influxql/explore-data/select/#from-clause), the [`WHERE` clause](/influxdb/version/query-data/influxql/explore-data/where/), or both.

{{% note %}}
- `DELETE` supports [regular expressions](/influxdb/version/query-data/influxql/explore-data/regular-expressions/)
  in the `FROM` clause when specifying measurement names and in the `WHERE` clause
  when specifying tag values.
- `DELETE` does not support [fields](/influxdb/version/reference/glossary/#field) in the `WHERE` clause.
{{% /note %}}

### Examples

- [Delete all measurement data](#delete-all-measurement-data)
- [Delete data in a measurement that has a specific tag value](#delete-data-in-a-measurement-that-has-a-specific-tag-value)
- [Delete data before or after specified time](#delete-data-before-or-after-specified-time)

#### Delete all measurement data

Delete all data associated with the measurement `h2o_feet`:

```sql
DELETE FROM "h2o_feet"
```

#### Delete data in a measurement that has a specific tag value

Delete all data associated with the measurement `h2o_quality` and where the tag `randtag` equals `3`:

```sql
DELETE FROM "h2o_quality" WHERE "randtag" = '3'
```

#### Delete data before or after specified time

Delete all data in the database that occur before January 01, 2020:

```sql
DELETE WHERE time < '2020-01-01'
```

A successful `DELETE` query returns an empty result.

If you need to delete points in the future, you must specify the future time period because `DELETE SERIES` runs for `time < now()` by default.

Delete future points:

```sql 
DELETE FROM device_data WHERE "device" = 'sensor1" and time > now() and < '2024-01-14T01:00:00Z'
```

Delete points in the future within a specified time range:

```sql
DELETE FROM device_data WHERE "device" = 'sensor15" and time >= '2024-01-01T12:00:00Z' and <= '2025-06-30T11:59:00Z'
```

## Delete measurements with DROP MEASUREMENT

The `DROP MEASUREMENT` statement deletes all data and series from the specified [measurement](/influxdb/version/reference/glossary/#measurement) and deletes the measurement from the index.

#### Syntax

```sql
DROP MEASUREMENT <measurement_name>
```

#### Example

Delete the measurement `h2o_feet`:

```sql
DROP MEASUREMENT "h2o_feet"
```

A successful `DROP MEASUREMENT` query returns an empty result.

{{% warn %}}
The DROP MEASUREMENT command is very resource intensive. We do not recommend this command for bulk data deletion.  Use the DELETE FROM command instead, which is less resource intensive. 
{{% /warn %}}
