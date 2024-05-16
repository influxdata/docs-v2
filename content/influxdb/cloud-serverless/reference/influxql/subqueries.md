---
title: InfluxQL subqueries
description: >
  An InfluxQL subquery is a query nested in the `FROM` clause of an InfluxQL query.
  The outer query queries results returned by the inner query (subquery).
menu:
  influxdb_cloud_serverless:
    name: Subqueries
    identifier: influxql-subqueries
    parent: influxql-reference
weight: 207
list_code_example: |
  ```sql
  SELECT_clause FROM ( SELECT_statement ) [...]
  ```
---

An InfluxQL subquery is a query nested in the `FROM` clause of an InfluxQL query.
The outer query queries results returned by the inner query (subquery).

- [Syntax](#syntax)
- [Examples](#examples)
- [Notable subquery behaviors](#notable-subquery-behaviors)

{{% note %}}
InfluxQL does not support a `HAVING` clause, however InfluxQL subqueries offer
functionality similar to the [SQL `HAVING` clause](/influxdb/cloud-serverless/reference/sql/having/). 
{{% /note %}}

## Syntax

```sql
SELECT_clause FROM ( SELECT_statement ) [...]
```

When using subqueries, InfluxQL **performs the inner query first**, then performs
the outer query.

The outer query requires a [`SELECT` clause](/influxdb/cloud-serverless/reference/influxql/select/#select-clause)
and a [`FROM` clause](/influxdb/cloud-serverless/reference/influxql/select/#from-clause).
The inner query is enclosed in parentheses in the outer query's `FROM` clause.

InfluxQL supports multiple nested subqueries:

```sql
SELECT_clause FROM ( SELECT_clause FROM ( SELECT_statement ) [...] ) [...]
```

## Examples

{{% note %}}
#### Sample data

The examples below use the following sample data sets:

- [Get started home sensor data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data)
- [Random numbers sample data](/influxdb/cloud-serverless/reference/sample-data/#random-numbers-sample-data)
{{% /note %}}

{{< expand-wrapper >}}

{{% expand "Apply an aggregate function to an aggregated result set" %}}

```sql
SELECT
  SUM(max)
FROM
  (
    SELECT
      MAX(temp)
    FROM
      home
    GROUP BY
      room
  )
```

{{% influxql/table-meta %}}
Table: home
{{% /influxql/table-meta %}}

| time                 |  sum |
| :------------------- | ---: |
| 1970-01-01T00:00:00Z | 46.1 |

{{% /expand %}}

{{% expand "Calculate the average difference between two fields" %}}

```sql
SELECT
  MEAN(difference)
FROM
  (
    SELECT
      a - b AS difference
    FROM
      numbers
  )
```

{{% influxql/table-meta %}}
Table: numbers
{{% /influxql/table-meta %}}

| time                 |                 mean |
| :------------------- | -------------------: |
| 1970-01-01T00:00:00Z | -0.03629771779732732 |

{{% /expand %}}

{{% expand "Filter aggregate values based on a threshold" %}}
{{% influxdb/custom-timestamps %}}

```sql
SELECT
  co_change
FROM
  (
    SELECT
      SPREAD(co) AS co_change
    FROM
      home
    GROUP BY
      room,
      time(2h)
  )
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
  AND co_change >= 4
```

{{% influxql/table-meta %}}
Table: home
{{% /influxql/table-meta %}}

| time                 | co_chnage |
| :------------------- | --------: |
| 2022-01-01T18:00:00Z |         4 |
| 2022-01-01T18:00:00Z |         5 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Perform additional aggregate operations on aggregate values" %}}
{{% influxdb/custom-timestamps %}}

```sql
SELECT
  SUM(co_derivative) AS sum_derivative
FROM
  (
    SELECT
      DERIVATIVE(MEAN(co)) AS co_derivative
    FROM
      home
    GROUP BY
      time(12m),
      room
  )
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
GROUP BY
  room
```

{{% /influxdb/custom-timestamps %}}

{{% influxql/table-meta %}}
Table: home
{{% /influxql/table-meta %}}

| time                 | room        | sum_derivative |
| :------------------- | :---------- | -------------: |
| 1970-01-01T00:00:00Z | Kitchen     |            5.2 |
| 1970-01-01T00:00:00Z | Living Room |            3.4 |

{{% /expand %}}
{{< /expand-wrapper >}}

## Notable subquery behaviors

- [Apply time bounds to the outer query to improve performance](#apply-time-bounds-to-the-outer-query-to-improve-performance)
- [Cannot use multiple SELECT statements in a subquery](#cannot-use-multiple-select-statements-in-a-subquery)

### Apply time bounds to the outer query to improve performance

To improve the performance of InfluxQL queries that use subqueries and a
specified time range, apply the `WHERE` clause with time-based predicates to the
outer query rather than the inner query.
For example--the following queries return the same results, but **the query with
time-based predicate on the outer query is more performant than the query with
time-based predicate on the inner query**:

{{% influxdb/custom-timestamps %}}

#### Time bounds on the outer query {note="(Recommended)"}

```sql
SELECT
  inner_value AS value
FROM
  (
    SELECT
      raw_value as inner_value
  )
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
```

#### Time bounds on the inner query

```sql
SELECT
  inner_value AS value
FROM
  (
    SELECT
      raw_value as inner_value
    WHERE
      time >= '2022-07-19T08:00:00Z'
      AND time <= '2022-01-01T20:00:00Z'
  )
```
{{% /influxdb/custom-timestamps %}}

### Cannot use multiple SELECT statements in a subquery

InfluxQL does not support multiple
[`SELECT` statements](/influxdb/cloud-serverless/reference/influxql/select/)
per subquery:

```sql
SELECT_clause FROM (SELECT_statement; SELECT_statement) [...]
```

However, InfluxQL does support multiple nested subqueries per outer query:

```sql
SELECT_clause FROM ( SELECT_clause FROM ( SELECT_statement ) [...] ) [...]
                     ------------------   ----------------
                         Subquery 1          Subquery 2
```
