---
title: Perform a basic InfluxQL query
seotitle: Perform a basic InfluxQL query in InfluxDB Cloud
description: >
  A basic InfluxQL query that queries data from InfluxDB most commonly includes
  `SELECT`, `FROM`, and `WHERE` clauses.
menu:
  influxdb3_cloud_dedicated:
    name: Basic query
    parent: Query with InfluxQL
    identifier: query-influxql-basic
weight: 202
influxdb3/cloud-dedicated/tags: [query, influxql]
list_code_example: |
  ```sql
  SELECT temp, room FROM home WHERE time >= now() - 1d
  ```
---

InfluxQL (Influx Query Language) is an SQL-like query language used to interact
with InfluxDB and work with times series data.

A basic InfluxQL query that queries data from InfluxDB most commonly includes the
following clauses:

{{< req type="key" >}}

- {{< req "\*">}} `SELECT`: Specify fields, tags, and calculations to return
  from a [table](/influxdb3/cloud-dedicated/reference/glossary/#table) or use the
  wildcard alias (`*`) to select all fields and tags from a table. It requires
  at least one
  [field key](/influxdb3/cloud-dedicated/reference/glossary/#field-key) or the
  wildcard alias (`*`). For more information, see
  [Notable SELECT statement behaviors](/influxdb3/cloud-dedicated/reference/influxql/select/#notable-select-statement-behaviors).
- {{< req "\*">}} `FROM`: Specify the
  [table](/influxdb3/cloud-dedicated/reference/glossary/#table) to query from.
    <!-- vale InfluxDataDocs.v3Schema = NO -->
  It requires one or more comma-delimited
  [measurement expressions](/influxdb3/cloud-dedicated/reference/influxql/select/#measurement_expression).
    <!-- vale InfluxDataDocs.v3Schema = YES -->
- `WHERE`: Filter data based on
  [field values](/influxdb3/cloud-dedicated/reference/glossary/#field),
  [tag values](/influxdb3/cloud-dedicated/reference/glossary/#tag), or
  [timestamps](/influxdb3/cloud-dedicated/reference/glossary/#timestamp). Only
  return data that meets the specified conditions--for example, falls within a
  time range, contains specific tag values, or contains a field value outside a
  specified range.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  temp,
  hum,
  room
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
```

{{% /influxdb/custom-timestamps %}}

## Result set

If at least one row satisfies the query, {{% product-name %}} returns row data
in the query result set.
If a query uses a `GROUP BY` clause, the result set
includes the following:

- Columns listed in the query's `SELECT` clause
- A `time` column that contains the timestamp for the record or the group
- An `iox::measurement` column that contains the record's
  [table](/influxdb3/cloud-dedicated/reference/glossary/#table) name
- Columns listed in the query's `GROUP BY` clause; each row in the result set
  contains the values used for grouping

### GROUP BY result columns

If a query uses `GROUP BY` and the `WHERE` clause doesn't filter by time, then
groups are based on the
[default time range](/influxdb3/cloud-dedicated/reference/influxql/group-by/#default-time-range).

## Basic query examples

- [Query data within time boundaries](#query-data-within-time-boundaries)
- [Query data without time boundaries](#query-data-without-time-boundaries)
- [Query specific fields and tags](#query-specific-fields-and-tags)
- [Query fields based on tag values](#query-fields-based-on-tag-values)
- [Query points based on field values](#query-points-based-on-field-values)
- [Alias queried fields and tags](#alias-queried-fields-and-tags)

> [!Note]
> 
> #### Sample data
> 
> The following examples use the
> [Get started home sensor data](/influxdb3/cloud-dedicated/reference/sample-data/#get-started-home-sensor-data).
> To run the example queries and return results,
> [write the sample data](/influxdb3/cloud-dedicated/reference/sample-data/#write-the-home-sensor-data-to-influxdb)
> to your {{% product-name %}} database before running the example queries.

### Query data within time boundaries

- Use the `SELECT` clause to specify what tags and fields to return.
  Specify at least one field key.
  To return all tags and fields, use the wildcard alias (`*`).
- Specify the [table](/influxdb3/cloud-dedicated/reference/glossary/#table) to
  query in the `FROM` clause.
- Specify time boundaries in the `WHERE` clause. Include time-based predicates
  that compare the value of the `time` column to a timestamp.
  Use the `AND` logical operator to chain multiple predicates together.

{{% influxdb/custom-timestamps %}}

```sql
SELECT *
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T12:00:00Z'
```

{{% /influxdb/custom-timestamps %}}

Query time boundaries can be relative or absolute.

{{< expand-wrapper >}}
{{% expand "Query with relative time boundaries" %}}
To query data from relative time boundaries, compare the value of the `time`
column to a timestamp calculated by subtracting an interval from a timestamp.
Use `now()` to return the timestamp for the current time (UTC).

##### Query all data from the last month

```sql
SELECT * FROM home WHERE time >= now() - 30d
```

##### Query one day of data from a week ago

```sql
SELECT *
FROM home
WHERE
  time >= now() - 7d
  AND time <= now() - 6d
```

{{% /expand %}}

{{% expand "Query with absolute time boundaries" %}}

To query data from absolute time boundaries, compare the value of the `time`
column to a timestamp literal.
Use the `AND` logical operator to chain together
multiple predicates and define both start and stop boundaries for the query.

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  *
FROM
  home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
```

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

### Query data without time boundaries

To query data without time boundaries, do not include any time-based predicates
in your `WHERE` clause.
If a time range is not defined in the `WHERE` clause,
the default time range is the Unix epoch (`1970-01-01T00:00:00Z`) to _now_.

> [!Warning]
> Querying data _without time bounds_ can return an unexpected amount of data.
> The query may take a long time to complete and results may be truncated.

```sql
SELECT * FROM home
```

### Query specific fields and tags

To query specific fields, include them in the `SELECT` clause.
If querying multiple fields or tags, comma-delimit each.
If a field or tag key includes special characters or spaces or is
case-sensitive, wrap the key in _double-quotes_.

```sql
SELECT time, room, temp, hum FROM home
```

### Query fields based on tag values

- In the `SELECT` clause, include fields you want to query and tags you want to
  base conditions on.
- In the `WHERE` clause, include predicates that compare the tag identifier to a
  string literal. Use
  [logical operators](/influxdb3/cloud-dedicated/reference/influxql/where/#logical-operators)
  to chain multiple predicates together and apply multiple conditions.

```sql
SELECT * FROM home WHERE room = 'Kitchen'
```

### Query points based on field values

- In the `SELECT` clause, include fields you want to query.
- In the `WHERE` clause, include predicates that compare the field identifier to
  a value or expression.
  Use
  [logical operators](/influxdb3/cloud-dedicated/reference/influxql/where/#logical-operators)
  (`AND`, `OR`) to chain multiple predicates together and apply multiple
  conditions.

```sql
SELECT co, time FROM home WHERE co >= 10 OR co <= -10
```

### Alias queried fields and tags

To alias or rename fields and tags that you query, use the `AS` clause.
After the tag, field, or expression you want to alias, pass `AS` followed by the
alias name as an identifier (wrap in double quotes (`"`) if the alias includes
spaces or special characters)--for example:

```sql
SELECT temp AS temperature, hum AS "humidity (%)" FROM home
```

> [!Note]
> When aliasing columns in **InfluxQL**, use the `AS` clause and an
> [identifier](/influxdb3/cloud-dedicated/reference/influxql/#identifiers). When
> [aliasing columns in **SQL**](/influxdb3/cloud-dedicated/query-data/sql/basic-query/#alias-queried-fields-and-tags),
> you can use the `AS` clause to define the alias, but it isn't necessary.
