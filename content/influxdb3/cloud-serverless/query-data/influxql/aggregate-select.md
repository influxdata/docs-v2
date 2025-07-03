---
title: Aggregate data with InfluxQL
seotitle: Aggregate or apply selector functions to data with InfluxQL
description: >
  Use InfluxQL aggregate and selector functions to perform aggregate operations
  on your time series data.
menu:
  influxdb3_cloud_serverless:
    name: Aggregate data
    parent: Query with InfluxQL
    identifier: query-influxql-aggregate
weight: 203
influxdb3/cloud-serverless/tags: [query, influxql]
related:
  - /influxdb3/cloud-serverless/reference/influxql/functions/aggregates/
  - /influxdb3/cloud-serverless/reference/influxql/functions/selectors/
list_code_example: |
  ##### Aggregate fields by groups
  ```sql
  SELECT
    MEAN(temp) AS mean,
    FIRST(hum) as first,
  FROM home
  GROUP BY tag
  ```

  ##### Aggregate by time-based intervals
  ```sql
  SELECT
    MEAN(temp),
    sum(hum),
  FROM home
  WHERE time >= now() - 24h
  GROUP BY time(1h),room
  ```
---

An InfluxQL query that aggregates data includes the following clauses:

{{< req type="key" >}}

- {{< req "\*">}} `SELECT`: Specify fields and calculations to output from a
  measurement or use the wildcard alias (`*`) to select all fields and tags
  from a measurement.
- {{< req "\*">}} `FROM`: Specify the measurement to query data from.
- `WHERE`: Only retrieve data that meets the specified conditions--for example, falls within
  a time range, contains specific tag values, or contains a field value outside
  a specified range.
- `GROUP BY`: Group data by tag values and time intervals.

> [!Note]
> For simplicity, the term _"aggregate"_ in this guide refers to applying
> both aggregate and selector functions to a dataset.

Learn how to apply aggregate operations to your queried data:

- [Aggregate and selector functions](#aggregate-and-selector-functions)
  - [Aggregate functions](#aggregate-functions)
  - [Selector functions](#selector-functions)
- [Example aggregate queries](#example-aggregate-queries)

## Aggregate and selector functions

Both aggregate and selector functions return a limited number of rows from each group.
Aggregate functions return a single row, whereas some selector functions let you
specify the number of rows to return from each group.
For example, if you `GROUP BY room` and perform an aggregate operation
in your `SELECT` clause, results include an aggregate value for each unique
value of `room`.

### Aggregate functions

Use **aggregate functions** to aggregate values in a specified field for each
group and return a single row per group containing the aggregate field value.

[View aggregate functions](/influxdb3/cloud-serverless/reference/influxql/functions/aggregates/)

##### Basic aggregate query

```sql
SELECT MEAN(co) from home
```

### Selector functions

Use **selector functions** to "select" a value from a specified field.

[View selector functions](/influxdb3/cloud-serverless/reference/influxql/functions/selectors/)

##### Basic selector query

```sql
SELECT TOP(co, 3) from home
```

## Example aggregate queries

- [Perform an ungrouped aggregation](#perform-an-ungrouped-aggregation)
- [Group and aggregate data](#group-and-aggregate-data)
  - [Downsample data by applying interval-based aggregates](#downsample-data-by-applying-interval-based-aggregates)
- [Query rows based on aggregate values](#query-rows-based-on-aggregate-values)

> [!Note]
> #### Sample data
> 
> The following examples use the sample data written in the
> [Get started home sensor data](/influxdb3/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).
> To run the example queries and return results,
> [write the sample data](/influxdb3/cloud-serverless/reference/sample-data/#write-home-sensor-data-to-influxdb)
> to your {{% product-name %}} bucket before running the example queries.

### Perform an ungrouped aggregation

To aggregate _all_ queried values in a specified field:

- Use aggregate or selector functions in your `SELECT` statement.
- Do not include a `GROUP BY` clause to leave your data ungrouped.

```sql
SELECT MEAN(co) AS "average co" FROM home
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}
{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time |        average co |
| :--- | ----------------: |
| 0    | 5.269230769230769 |
{{% /expand %}}
{{< /expand-wrapper >}}

### Group and aggregate data

To apply aggregate or selector functions to grouped data:

- Use aggregate or selector functions in your `SELECT` statement.
- Include a `GROUP BY` clause with a comma-delimited list of tags to group by.

Keep the following in mind when using `GROUP BY`:

- `GROUP BY` can use column aliases that are defined in the `SELECT` clause.

```sql
SELECT
  MEAN(temp) AS "average temp"
FROM home
GROUP BY room
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}

{{% influxql/table-meta %}}
name: home  
tags: room=Kitchen
{{% /influxql/table-meta %}}

| time |       average temp |
| :--- | -----------------: |
| 0    | 22.623076923076926 |

{{% influxql/table-meta %}}
name: home  
tags: room=Living Room
{{% /influxql/table-meta %}}

| time |      average temp |
| :--- | ----------------: |
| 0    | 22.16923076923077 |
{{% /expand %}}
{{< /expand-wrapper >}}

#### Downsample data by applying interval-based aggregates

A common use case when querying time series is downsampling data by applying
aggregates to time-based groups. To group and aggregate data into time-based
groups:

- In your `SELECT` clause, apply [aggregate](/influxdb3/cloud-serverless/reference/influxql/functions/aggregates/)
  or [selector](/influxdb3/cloud-serverless/reference/influxql/functions/selectors/)
  functions to queried fields.

- In your `WHERE` clause, include time bounds for the query.
  Interval-based aggregates produce a row for each specified time interval.
  If no time bounds are specified in the `WHERE` clause, the query uses the 
  default time range (1970-01-01T00:00:00Z to now) and returns a row for each
  interval in that time range.

- In your `GROUP BY` clause:
 
  - Use the [`time()` function](/influxdb3/cloud-serverless/reference/influxql/functions/date-time/#time)
    to specify the time interval to group by.
  - _Optional_: Specify other tags to group by.


The following example retrieves unique combinations of time intervals and rooms with their minimum, maximum, and average temperatures.

```sql
SELECT
  MAX(temp) AS "max temp",
  MIN(temp) AS "min temp",
  MEAN(temp) AS "average temp"
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time < '2022-01-01T20:00:00Z'
GROUP BY time(2h), room
```

{{< expand-wrapper >}}
{{% expand "View example results" "1" %}}
{{% influxdb/custom-timestamps %}}

{{% influxql/table-meta %}}
name: home  
tags: room=Kitchen
{{% /influxql/table-meta %}}

| time                 | max temp | min temp |       average temp |
| :------------------- | -------: | -------: | -----------------: |
| 2022-01-01T08:00:00Z |       23 |       21 |                 22 |
| 2022-01-01T10:00:00Z |     22.7 |     22.4 | 22.549999999999997 |
| 2022-01-01T12:00:00Z |     22.8 |     22.5 |              22.65 |
| 2022-01-01T14:00:00Z |     22.8 |     22.7 |              22.75 |
| 2022-01-01T16:00:00Z |     22.7 |     22.4 | 22.549999999999997 |
| 2022-01-01T18:00:00Z |     23.3 |     23.1 | 23.200000000000003 |
| 2022-01-01T20:00:00Z |     22.7 |     22.7 |               22.7 |

{{% influxql/table-meta %}}
name: home  
tags: room=Living Room
{{% /influxql/table-meta %}}

| time                 | max temp | min temp |       average temp |
| :------------------- | -------: | -------: | -----------------: |
| 2022-01-01T08:00:00Z |     21.4 |     21.1 |              21.25 |
| 2022-01-01T10:00:00Z |     22.2 |     21.8 |                 22 |
| 2022-01-01T12:00:00Z |     22.4 |     22.2 | 22.299999999999997 |
| 2022-01-01T14:00:00Z |     22.3 |     22.3 |               22.3 |
| 2022-01-01T16:00:00Z |     22.6 |     22.4 |               22.5 |
| 2022-01-01T18:00:00Z |     22.8 |     22.5 |              22.65 |
| 2022-01-01T20:00:00Z |     22.2 |     22.2 |               22.2 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}
