---
title: Aggregate or apply selector functions to data
seotitle: Perform a basic SQL query in InfluxDB Cloud
description: >
  Use aggregate and selector functions to perform aggregate operations on your
  time series data.
menu:
  influxdb_cloud_iox:
    name: Aggregate data
    parent: Query with SQL
    identifier: query-sql-aggregate
weight: 203
influxdb/cloud-iox/tags: [query, sql]
related:
  - /influxdb/cloud-iox/reference/sql/functions/aggregate/
  - /influxdb/cloud-iox/reference/sql/functions/selector/
list_code_example: |
  ##### Aggregate fields by groups
  ```sql
  SELECT
    mean(field1) AS mean,
    selector_first(field2)['value'] as first,
    tag1
  FROM home
  GROUP BY tag
  ```

  ##### Aggregate by time-based intervals
  ```sql
  SELECT
    DATE_BIN(INTERVAL '1 hour', time, '2022-01-01T00:00:00Z'::TIMESTAMP) AS time,
    mean(field1),
    sum(field2),
    tag1
  FROM home
  GROUP BY
    time,
    tag1
  ```
---

A SQL query that aggregates data includes the following clauses:

{{< req type="key" >}}

- {{< req "\*">}} `SELECT`: Identify specific fields and tags to query from a
  measurement or use the wild card alias (`*`) to select all fields and tags
  from a measurement. Include any columns you want to group by in the `SELECT`
  clause.
- {{< req "\*">}} `FROM`: Identify the measurement to query data from.
- `WHERE`: Only return data that meets defined conditions such as falling within
  a time range, containing specific tag values, etc.
- `GROUP BY`: Group data into SQL partitions by specific columns and apply an
  aggregate or selector function to each group.

{{% note %}}
For simplicity, the term **"aggregate"** in this guide refers to applying
both aggregate and selector functions to a dataset.
{{% /note %}}

Learn how to apply aggregate operations to your queried data:

- [Aggregate and selector functions](#aggregate-and-selector-functions)
  - [Aggregate functions](#aggregate-functions)
  - [Selector functions](#selector-functions)
- [Example aggregate queries](#example-aggregate-queries)

## Aggregate and selector functions

Both aggregate and selector functions return a single row from each SQL partition
or group. For example, if you `GROUP BY room` and perform an aggregate operation
in your `SELECT` clause, results include an aggregate value for each unique
value of `room`.

### Aggregate functions

Use **aggregate functions** to aggregate values in a specified column for each
group and return a single row per group containing the aggregate value.

[View aggregate functions](/influxdb/cloud-iox/reference/sql/functions/aggregate/)

##### Basic aggregate query

```sql
SELECT AVG(co) from home
```

### Selector functions

Use **selector functions** to "select" a value from a specified column.
The available selector functions are designed to work with time series data.

[View selector functions](/influxdb/cloud-iox/reference/sql/functions/selector/)

Each selector function returns a Rust _struct_ (similar to a JSON object)
representing a single time and value from the specified column in the each group.
What time and value get returned depend on the logic in the selector function.
For example, `selector_first` returns the value of specified column in the first row of the group.
`selector_max` returns the maximum value of the specified column in the group.

#### Selector struct schema

The struct returned from a selector function has two properties:

- **time**: `time` value in the selected row
- **value**: value of the specified column in the selected row

```js
{time: 2023-01-01T00:00:00Z, value: 72.1}
```

#### Use selector functions

Each selector function has two arguments:

- The first is the column to operate on.
- The second is the time column to use in the selection logic.

In your `SELECT` statement, execute a selector function and use bracket notation
to reference properties of the [returned struct](#selector-struct-schema) to
populate the column value:

```sql
SELECT
  selector_first(temp, time)['time'] AS time,
  selector_first(temp, time)['value'] AS temp,
  room
FROM home
GROUP BY room
```

## Example aggregate queries

- [Perform an ungrouped aggregation](#perform-an-ungrouped-aggregation)
- [Group and aggregate data](#group-and-aggregate-data)
  - [Downsample data by applying interval-based aggregates](#downsample-data-by-applying-interval-based-aggregates)
- [Query rows based on aggregate values](#query-rows-based-on-aggregate-values)

{{% note %}}
#### Sample data

The following examples use the sample data written in the
[Get started writing data guide](/influxdb/cloud-iox/get-started/write/).
To run the example queries and return results,
[write the sample data](/influxdb/cloud-iox/get-started/write/#write-line-protocol-to-influxdb)
to your InfluxDB Cloud bucket before running the example queries.
{{% /note %}}

### Perform an ungrouped aggregation

To aggregate _all_ queried values in a specified column:

- Use aggregate or selector functions in your `SELECT` statement.
- Do not include a `GROUP BY` clause to leave your data ungrouped.

```sql
SELECT avg(co) AS 'average co' from home
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}
|    average co     |
| :---------------: |
| 5.269230769230769 |
{{% /expand %}}
{{< /expand-wrapper >}}

### Group and aggregate data

To apply aggregate or selector functions to grouped data:

- Use aggregate or selector functions in your `SELECT` statement.
- Include columns to group by in your `SELECT` statement.
- Include a `GROUP BY` clause with a comma-delimited list of columns to group by.

```sql
SELECT
  room,
  avg(temp) AS 'average temp'
FROM home
GROUP BY room
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}
| room        |       average temp |
| :---------- | -----------------: |
| Living Room |  22.16923076923077 |
| Kitchen     | 22.623076923076926 |
{{% /expand %}}
{{< /expand-wrapper >}}

#### Downsample data by applying interval-based aggregates

A common use case when querying time series is downsampling data by applying
aggregates to time-based groups. To group and aggregate data into time-based
groups:

- In your `SELECT` clause:

  - Use the [`DATE_BIN` function](/influxdb/cloud-iox/reference/sql/functions/time-and-date/#date_bin)
    to calculate time intervals and return a new `time` column that contains the start of the nearest interval associated with your timestamp--for example,
    the following statement calculates two-hour intervals starting at `1970-01-01T00:00:00Z` and calculates the nearest interval for `time` in each row:
    
    ```sql
    SELECT DATE_BIN(INTERVAL '2 hours', time, '1970-01-01T00:00:00Z'::TIMESTAMP) AS time
    FROM home
    ```
    
    If the `time` timestamp in your data is
    {{% influxdb/custom-timestamps-span %}}`2023-03-09T13:00:50.000Z`{{% /influxdb/custom-timestamps-span %}},
    then the query returns the `time` value
    {{% influxdb/custom-timestamps-span %}}`2023-03-09T12:00:00.000Z`{{% /influxdb/custom-timestamps-span %}}.
  - Use [aggregate](/influxdb/cloud-iox/reference/sql/functions/aggregate/) or [selector](/influxdb/cloud-iox/reference/sql/functions/selector/) functions on specified columns.
  - Include columns to group by.

- Include a `GROUP BY` clause with `time` and other columns to group by.

```sql
SELECT
  DATE_BIN(INTERVAL '2 hours', time, '1970-01-01T00:00:00Z'::TIMESTAMP) AS time,
  room,
  selector_max(temp, time)['value'] AS 'max temp',
  selector_min(temp, time)['value'] AS 'min temp',
  avg(temp) AS 'average temp'
FROM home
GROUP BY time, room
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}
{{% influxdb/custom-timestamps %}}
| time                 | room        | max temp | min temp |       average temp |
| :------------------- | :---------- | -------: | -------: | -----------------: |
| 2022-01-01T08:00:00Z | Kitchen     |       23 |       21 |                 22 |
| 2022-01-01T10:00:00Z | Kitchen     |     22.7 |     22.4 | 22.549999999999997 |
| 2022-01-01T12:00:00Z | Kitchen     |     22.8 |     22.5 |              22.65 |
| 2022-01-01T14:00:00Z | Kitchen     |     22.8 |     22.7 |              22.75 |
| 2022-01-01T16:00:00Z | Kitchen     |     22.7 |     22.4 | 22.549999999999997 |
| 2022-01-01T18:00:00Z | Kitchen     |     23.3 |     23.1 | 23.200000000000003 |
| 2022-01-01T20:00:00Z | Kitchen     |     22.7 |     22.7 |               22.7 |
| 2022-01-01T08:00:00Z | Living Room |     21.4 |     21.1 |              21.25 |
| 2022-01-01T10:00:00Z | Living Room |     22.2 |     21.8 |                 22 |
| 2022-01-01T12:00:00Z | Living Room |     22.4 |     22.2 | 22.299999999999997 |
| 2022-01-01T14:00:00Z | Living Room |     22.3 |     22.3 |               22.3 |
| 2022-01-01T16:00:00Z | Living Room |     22.6 |     22.4 |               22.5 |
| 2022-01-01T18:00:00Z | Living Room |     22.8 |     22.5 |              22.65 |
| 2022-01-01T20:00:00Z | Living Room |     22.2 |     22.2 |               22.2 |
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}


### Query rows based on aggregate values

To query data based on values after an aggregate operation, include a `HAVING`
clause with defined predicate conditions such as a value threshold.
Predicates in the `WHERE` clause are applied _before_ data is aggregated.
Predicates in the `HAVING` clause are applied _after_ data is aggregated.

```sql
SELECT
  room,
  avg(co) AS 'average co'
FROM home
GROUP BY room
HAVING "average co" > 5
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}
| room    |         average co |
| :------ | -----------------: |
| Kitchen | 6.6923076923076925 |
{{% /expand %}}
{{< /expand-wrapper >}}
