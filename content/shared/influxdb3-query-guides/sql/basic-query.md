
The InfluxDB SQL implementation is powered by the [Apache Arrow DataFusion](https://arrow.apache.org/datafusion/)
query engine which provides an SQL syntax similar to other relational query languages.

A basic SQL query that queries data from {{< product-name >}} most commonly
includes the following clauses:

{{< req type="key" >}}

- {{< req "\*">}} `SELECT`: Specify fields, tags, and calculations to output
  from a table or use the wildcard alias (`*`) to select all fields and tags
  from a table.
- {{< req "\*">}} `FROM`: Specify the table to query data from.
- `WHERE`: Only return rows that meets the specified conditions--for example,
  the time is within a time range, a tag has a specific value, or a field value
  is above or below a specified threshold.

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
in the query result set. An SQL query result set includes columns listed in the
query's `SELECT` statement.

## Basic query examples

- [Query data within time boundaries](#query-data-within-time-boundaries)
- [Query data without time boundaries](#query-data-without-time-boundaries)
- [Query specific fields and tags](#query-specific-fields-and-tags)
- [Query fields based on tag values](#query-fields-based-on-tag-values)
- [Query points based on field values](#query-points-based-on-field-values)
- [Alias queried fields and tags](#alias-queried-fields-and-tags)

> [!Note]
> #### Sample data
> 
> The following examples use the
> [Home sensor sample data](/influxdb3/version/reference/sample-data/#home-sensor-data).
> To run the example queries and return results,
> [write the sample data](/influxdb3/version/reference/sample-data/#write-home-sensor-data-to-influxdb)
> to your {{% product-name %}} database before running the example queries.

### Query data within time boundaries

- Use the `SELECT` clause to specify what tags and fields to return.
  To return all tags and fields, use the wildcard alias (`*`).
- Specify the table to query in the `FROM` clause.
- Specify time boundaries in the `WHERE` clause.
  Include time-based predicates that compare the value of the `time` column to a timestamp.
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
SELECT * FROM home WHERE time >= now() - INTERVAL '1 month'
```

##### Query one day of data data from a week ago
```sql
SELECT *
FROM home
WHERE
  time >= now() - INTERVAL '7 days'
  AND time <= now() - INTERVAL '6 days'
```
{{% /expand %}}

{{% expand "Query with absolute time boundaries" %}}

To query data from absolute time boundaries, compare the value of the `time` column
to a timestamp literal.
Use the `AND` logical operator to chain together multiple predicates and define
both start and stop boundaries for the query.

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

{{% expand "Query data using a time zone offset" %}}

To query data using a time zone offset, use the
[`AT TIME ZONE` operator](/influxdb3/version/reference/sql/operators/other/#at-time-zone)
to apply a time zone offset to timestamps in the `WHERE` clause.

> [!Note]
> Timestamp types in InfluxDB always represent a UTC time. `AT TIME ZONE` returns
> a UTC timestamp adjusted for the offset of the specified time zone.
> Timestamps in the `time` column are not updated.
> If you need to display the timestamps in your current timezone, this should be
> handled client-side.

{{% influxdb/custom-timestamps %}}
```sql
SELECT
  *
FROM
  home
WHERE
  time >= '2022-01-01 00:00:00'::TIMESTAMP AT TIME ZONE 'America/Los_Angeles'
  AND time <= '2022-01-01 12:00:00'::TIMESTAMP AT TIME ZONE 'America/Los_Angeles'
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}

### Query data without time boundaries

To query data without time boundaries, do not include any time-based predicates
in your `WHERE` clause.

> [!Warning]
> Querying data _without time bounds_ can return an unexpected amount of data.
> The query may take a long time to complete and results may be truncated.

```sql
SELECT * FROM home
```

### Query specific fields and tags

To query specific fields, include them in the `SELECT` clause.
If querying multiple fields or tags, comma-delimit each.
If a field or tag key includes special characters or spaces or is case-sensitive,
wrap the key in _double-quotes_.

```sql
SELECT time, room, temp, hum FROM home
```

### Query fields based on tag values

- Include the fields you want to query and the tags you want to base conditions
  on in the `SELECT` clause.
- Include predicates in the `WHERE` clause that compare the tag identifier to
  a string literal.
  Use [logical operators](/influxdb3/version/reference/sql/operators/logical/) to
  chain multiple predicates together and apply multiple conditions.

```sql
SELECT * FROM home WHERE room = 'Kitchen'
```

### Query points based on field values

- In the `SELECT` clause, include fields you want to query.
- In the `WHERE` clause, include predicates that compare the field identifier to a value or expression.
  Use [logical operators](/influxdb3/version/reference/sql/where/#logical-operators) (`AND`, `OR`) to chain multiple predicates together
  and apply multiple conditions.

```sql
SELECT co, time FROM home WHERE co >= 10 OR co <= -10
```

### Alias queried fields and tags

To alias or rename fields and tags that you query, pass a string literal after
the field or tag identifier in the `SELECT` clause.
You can use the `AS` clause to define the alias, but it isn't necessary.
The following queries are functionally the same:

```sql
SELECT temp 'temperature', hum 'humidity' FROM home

SELECT temp AS 'temperature', hum AS 'humidity' FROM home
```
