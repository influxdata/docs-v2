---
title: Subqueries
description: >
  Subqueries (also known as inner queries or nested queries) are queries within
  a query. Subqueries can be used in `SELECT`, `FROM`, `WHERE`, and `HAVING` clauses.
menu:
  influxdb_cloud_serverless:
    name: Subqueries
    parent: SQL reference
weight: 210
related:
  - /influxdb/cloud-serverless/query-data/sql/
  - /influxdb/cloud-serverless/reference/sql/select/
  - /influxdb/cloud-serverless/reference/sql/where/
  - /influxdb/cloud-serverless/reference/sql/having/
---

Subqueries (also known as inner queries or nested queries) are queries within
a query. 
Subqueries can be used in `SELECT`, `FROM`, `WHERE`, and `HAVING` clauses.

- [Subquery operators](#subquery-operators)
  - [[ NOT ] EXISTS](#-not--exists)
  - [[ NOT ] IN](#-not--in)
- [SELECT clause subqueries](#select-clause-subqueries)
- [FROM clause subqueries](#from-clause-subqueries)
- [WHERE clause subqueries](#where-clause-subqueries)
- [HAVING clause subqueries](#having-clause-subqueries)
- [Subquery categories](#subquery-categories)
  - [Correlated subqueries](#correlated-subqueries)
  - [Non-correlated subqueries](#non-correlated-subqueries)
  - [Scalar subqueries](#scalar-subqueries)
  - [Non-scalar subqueries](#non-scalar-subqueries)

{{% note %}}
#### Sample data

Query examples on this page use the following sample data sets:

- [Get started home sensor sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data)
- [Home sensor actions sample data](/influxdb/cloud-serverless/reference/sample-data/#home-sensor-actions-data)
- [NOAA Bay Area weather sample data](/influxdb/cloud-serverless/reference/sample-data/#noaa-bay-area-weather-data)

{{% /note %}}

## Subquery operators

- [[ NOT ] EXISTS](#-not--exists)
- [[ NOT ] IN](#-not--in)

### [ NOT ] EXISTS

The `EXISTS` operator returns all rows where a
_[correlated subquery](#correlated-subqueries)_ produces one or more matches for
that row. `NOT EXISTS` returns all rows where a _correlated subquery_ produces
zero matches for that row. Only _correlated subqueries_ are supported.

#### Syntax {#-not-exists-syntax}

```sql
[NOT] EXISTS (subquery)
```

### [ NOT ] IN

The `IN` operator returns all rows where a given expression’s value can be found
in the results of a _[correlated subquery](#correlated-subqueries)_.
`NOT IN` returns all rows where a given expression’s value cannot be found in
the results of a subquery or list of values.

#### Syntax {#-not-in-syntax}

```sql
expression [NOT] IN (subquery|list-literal)
```

#### Examples {#-not-in-examples}

{{< expand-wrapper >}}
{{% expand "View `IN` examples using a query" %}}
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[IN](#)
[NOT IN](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
SELECT
  time,
  room,
  temp
FROM
  home
WHERE
  room IN (
    SELECT
      DISTINCT room
    FROM
      home_actions
  )
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
SELECT
  time,
  room,
  temp
FROM
  home
WHERE
  room NOT IN (
    SELECT
      DISTINCT room
    FROM
      home_actions
  )
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /expand %}}

{{% expand "View `IN` examples using a list literal" %}}
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[IN](#)
[NOT IN](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
SELECT
  time,
  room,
  temp
FROM home
WHERE room IN ('Bathroom', 'Bedroom', 'Kitchen')
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
SELECT
  time,
  room,
  temp
FROM home
WHERE room NOT IN ('Bathroom', 'Bedroom', 'Kitchen')
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /expand %}}

{{< /expand-wrapper >}}

## SELECT clause subqueries

`SELECT` clause subqueries use values returned from the inner query as part
of the outer query's `SELECT` list.
The `SELECT` clause only supports [scalar subqueries](#scalar-subqueries) that 
return a single value per execution of the inner query.
The returned value can be unique per row.

### Syntax {#select-subquery-syntax}

```sql
SELECT [expression1[, expression2, ..., expressionN],] (<subquery>)
```

{{% note %}}
`SELECT` clause subqueries can be used as an alternative to `JOIN` operations.
{{% /note %}}

### Examples {#select-subquery-examples}

{{< expand-wrapper >}}
{{% expand "`SELECT` clause with correlated subquery" %}}

```sql
SELECT
  time,
  room,
  co,
  (
    SELECT
      MAX(description)
    FROM
      home_actions
    WHERE
      time = home.time
      AND room = home.room
      AND level != 'ok'
  ) AS "Alert Description"
FROM
  home
ORDER BY
  room,
  time
```

#### Inner query results

Because the inner query is a [correlated subquery](#correlated-subqueries),
the result depends on the values of `room` and `time` columns in the outer query.
The results below represent the action description for each `room` and `time`
combination with a `level` value that does not equal `ok`.

{{% influxdb/custom-timestamps %}}
| time                 | room        | MAX(home_actions.description)               |
| :------------------- | :---------- | :------------------------------------------ |
| 2022-01-01T18:00:00Z | Kitchen     | Carbon monoxide level above normal: 18 ppm. |
| 2022-01-01T19:00:00Z | Kitchen     | Carbon monoxide level above normal: 22 ppm. |
| 2022-01-01T20:00:00Z | Kitchen     | Carbon monoxide level above normal: 26 ppm. |
| 2022-01-01T19:00:00Z | Living Room | Carbon monoxide level above normal: 14 ppm. |
| 2022-01-01T20:00:00Z | Living Room | Carbon monoxide level above normal: 17 ppm. |
{{% /influxdb/custom-timestamps %}}

#### Outer query results

{{% influxdb/custom-timestamps %}}
| time                 | room        |  co | Alert Description                           |
| :------------------- | :---------- | --: | :------------------------------------------ |
| 2022-01-01T08:00:00Z | Kitchen     |   0 |                                             |
| 2022-01-01T09:00:00Z | Kitchen     |   0 |                                             |
| 2022-01-01T10:00:00Z | Kitchen     |   0 |                                             |
| 2022-01-01T11:00:00Z | Kitchen     |   0 |                                             |
| 2022-01-01T12:00:00Z | Kitchen     |   0 |                                             |
| 2022-01-01T13:00:00Z | Kitchen     |   1 |                                             |
| 2022-01-01T14:00:00Z | Kitchen     |   1 |                                             |
| 2022-01-01T15:00:00Z | Kitchen     |   3 |                                             |
| 2022-01-01T16:00:00Z | Kitchen     |   7 |                                             |
| 2022-01-01T17:00:00Z | Kitchen     |   9 |                                             |
| 2022-01-01T18:00:00Z | Kitchen     |  18 | Carbon monoxide level above normal: 18 ppm. |
| 2022-01-01T19:00:00Z | Kitchen     |  22 | Carbon monoxide level above normal: 22 ppm. |
| 2022-01-01T20:00:00Z | Kitchen     |  26 | Carbon monoxide level above normal: 26 ppm. |
| 2022-01-01T08:00:00Z | Living Room |   0 |                                             |
| 2022-01-01T09:00:00Z | Living Room |   0 |                                             |
| 2022-01-01T10:00:00Z | Living Room |   0 |                                             |
| 2022-01-01T11:00:00Z | Living Room |   0 |                                             |
| 2022-01-01T12:00:00Z | Living Room |   0 |                                             |
| 2022-01-01T13:00:00Z | Living Room |   0 |                                             |
| 2022-01-01T14:00:00Z | Living Room |   0 |                                             |
| 2022-01-01T15:00:00Z | Living Room |   1 |                                             |
| 2022-01-01T16:00:00Z | Living Room |   4 |                                             |
| 2022-01-01T17:00:00Z | Living Room |   5 |                                             |
| 2022-01-01T18:00:00Z | Living Room |   9 |                                             |
| 2022-01-01T19:00:00Z | Living Room |  14 | Carbon monoxide level above normal: 14 ppm. |
| 2022-01-01T20:00:00Z | Living Room |  17 | Carbon monoxide level above normal: 17 ppm. |
{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## FROM clause subqueries

`FROM` clause subqueries return a set of results that is then queried and
operated on by the outer query.

### Syntax {#from-subquery-syntax}

```sql
SELECT expression1[, expression2, ..., expressionN] FROM (<subquery>)
```

### Examples {#from-subquery-examples}

{{< expand-wrapper >}}
{{% expand "View `FROM` clause subquery example" %}}

The following query returns the average of maximum values per room.
The inner query returns the maximum value for each field from each room.
The outer query uses the results of the inner query and returns the average
maximum value for each field.

```sql
SELECT
  AVG(max_co) AS avg_max_co,
  AVG(max_hum) AS avg_max_hum,
  AVG(max_temp) AS avg_max_temp
FROM
  (
    SELECT
      room,
      MAX(co) AS max_co,
      MAX(hum) AS max_hum,
      MAX(temp) AS max_temp
    FROM
      home
    GROUP BY
      room
  )
```

#### Inner query results

| room        | max_co | max_hum | max_temp |
| :---------- | -----: | ------: | -------: |
| Living Room |     17 |    36.4 |     22.8 |
| Kitchen     |     26 |    36.9 |     23.3 |

#### Outer query results

| avg_max_co | avg_max_hum | avg_max_temp |
| ---------: | ----------: | -----------: |
|       21.5 |        36.7 |         23.1 |

{{% /expand %}}
{{< /expand-wrapper >}}

## WHERE clause subqueries

[`WHERE` clause](/influxdb/cloud-serverless/reference/sql/where/) subqueries
compare an expression to the result of the subquery and return _true_ or _false_.
Rows that evaluate to _false_ are filtered from results.
The `WHERE` clause supports correlated and non-correlated subqueries
as well as scalar and non-scalar subqueries (depending on the the operator used
in the predicate expression).

### Syntax {#where-subquery-syntax}

```sql
SELECT
  expression1[, expression2, ..., expressionN]
FROM
  <measurement>
WHERE
  expression operator (<subquery>)
```

{{% note %}}
`WHERE` clause subqueries can be used as an alternative to `JOIN` operations.
{{% /note %}}

### Examples {#where-subquery-examples}
{{< expand-wrapper >}}
{{% expand "`WHERE` clause with scalar subquery" %}}

The following query returns all points with `temp` values above the average
of all `temp` values. The subquery returns the average `temp` value.

```sql
SELECT
  *
FROM
  home
WHERE
  temp > (
    SELECT
      AVG(temp)
    FROM
      home
  )
```

#### Inner query result

| AVG(home.temp)     |
| :----------------- |
| 22.396153846153844 |

#### Outer query result

{{% influxdb/custom-timestamps %}}
|  co |  hum | room        | temp | time                 |
| --: | ---: | :---------- | ---: | :------------------- |
|   0 | 36.2 | Kitchen     |   23 | 2022-01-01T09:00:00Z |
|   0 | 36.1 | Kitchen     | 22.7 | 2022-01-01T10:00:00Z |
|   0 |   36 | Kitchen     | 22.4 | 2022-01-01T11:00:00Z |
|   0 |   36 | Kitchen     | 22.5 | 2022-01-01T12:00:00Z |
|   1 | 36.5 | Kitchen     | 22.8 | 2022-01-01T13:00:00Z |
|   1 | 36.3 | Kitchen     | 22.8 | 2022-01-01T14:00:00Z |
|   3 | 36.2 | Kitchen     | 22.7 | 2022-01-01T15:00:00Z |
|   7 |   36 | Kitchen     | 22.4 | 2022-01-01T16:00:00Z |
|   9 |   36 | Kitchen     | 22.7 | 2022-01-01T17:00:00Z |
|  18 | 36.9 | Kitchen     | 23.3 | 2022-01-01T18:00:00Z |
|  22 | 36.6 | Kitchen     | 23.1 | 2022-01-01T19:00:00Z |
|  26 | 36.5 | Kitchen     | 22.7 | 2022-01-01T20:00:00Z |
|   0 |   36 | Living Room | 22.4 | 2022-01-01T13:00:00Z |
|   4 |   36 | Living Room | 22.4 | 2022-01-01T16:00:00Z |
|   5 | 35.9 | Living Room | 22.6 | 2022-01-01T17:00:00Z |
|   9 | 36.2 | Living Room | 22.8 | 2022-01-01T18:00:00Z |
|  14 | 36.3 | Living Room | 22.5 | 2022-01-01T19:00:00Z |
{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{% expand "`WHERE` clause with non-scalar subquery" %}}

Non-scalar subqueries must use the `[NOT] IN` operator and can only return a
single column. The values in the returned column are evaluated as a list.

The following query returns all points in the `home` measurement associated with
the same timestamps as `warn` level alerts in the `home_actions` measurement.

```sql
SELECT
  *
FROM
  home
WHERE
  time IN (
    SELECT
      DISTINCT time
    FROM
      home_actions
    WHERE
      level = 'warn'
  )
```

#### Inner query result

{{% influxdb/custom-timestamps %}}
| time                 |
| :------------------- |
| 2022-01-01T18:00:00Z |
| 2022-01-01T19:00:00Z |
| 2022-01-01T20:00:00Z |
{{% /influxdb/custom-timestamps %}}

#### Outer query result

{{% influxdb/custom-timestamps %}}
|  co |  hum | room        | temp | time                 |
| --: | ---: | :---------- | ---: | :------------------- |
|  18 | 36.9 | Kitchen     | 23.3 | 2022-01-01T18:00:00Z |
|   9 | 36.2 | Living Room | 22.8 | 2022-01-01T18:00:00Z |
|  26 | 36.5 | Kitchen     | 22.7 | 2022-01-01T20:00:00Z |
|  17 | 36.4 | Living Room | 22.2 | 2022-01-01T20:00:00Z |
|  22 | 36.6 | Kitchen     | 23.1 | 2022-01-01T19:00:00Z |
|  14 | 36.3 | Living Room | 22.5 | 2022-01-01T19:00:00Z |
{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{% expand "`WHERE` clause with correlated subquery" %}}

The following query returns rows with temperature values greater than the median
temperature value for each room. The subquery in the `WHERE` clause uses the 
`room` value from the outer query to return the median `temp` value for that
specific room.

```sql
SELECT
  time,
  room,
  temp
FROM
  home outer_query
WHERE
  temp > (
    SELECT
      median(temp) AS temp
    FROM
      home
    WHERE
      room = outer_query.room
    GROUP BY
      room
  )
ORDER BY room, time
```

#### Inner query result

The result of the inner query depends on the value of `room` in the outer query,
but the following table contains the median `temp` value for each room.

| room        | temp |
| :---------- | ---: |
| Living Room | 22.3 |
| Kitchen     | 22.7 |

#### Outer query result

{{% influxdb/custom-timestamps %}}
| time                 | room        | temp |
| :------------------- | :---------- | ---: |
| 2022-01-01T09:00:00Z | Kitchen     |   23 |
| 2022-01-01T13:00:00Z | Kitchen     | 22.8 |
| 2022-01-01T14:00:00Z | Kitchen     | 22.8 |
| 2022-01-01T18:00:00Z | Kitchen     | 23.3 |
| 2022-01-01T19:00:00Z | Kitchen     | 23.1 |
| 2022-01-01T13:00:00Z | Living Room | 22.4 |
| 2022-01-01T16:00:00Z | Living Room | 22.4 |
| 2022-01-01T17:00:00Z | Living Room | 22.6 |
| 2022-01-01T18:00:00Z | Living Room | 22.8 |
| 2022-01-01T19:00:00Z | Living Room | 22.5 |
{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## HAVING clause subqueries

[`HAVING` clause](/influxdb/cloud-serverless/reference/sql/having/) subqueries
compare an expression that uses aggregate values returned by aggregate functions
in the `SELECT` clause to the result of the subquery and return _true_ or _false_.
Rows that evaluate to _false_ are filtered from results.
The `HAVING` clause supports correlated and non-correlated subqueries
as well as scalar and non-scalar subqueries (depending on the the operator used
in the predicate expression).

### Syntax {#having-subquery-syntax}

```sql
SELECT
  aggregate_expression1[, aggregate_expression2, ..., aggregate_expressionN]
FROM
  <measurement>
WHERE
  <conditional_expression>
GROUP BY
  column_expression1[, column_expression2, ..., column_expressionN]
HAVING
  expression operator (<subquery>)
```

### Examples {#having-subquery-examples}

{{< expand-wrapper >}}
{{% expand "`HAVING` clause with scalar subquery" %}}

The following query returns all two hour blocks of time with average `temp` values
greater then the median `temp` value.

```sql
SELECT
  DATE_BIN(INTERVAL '2 hours', time) AS "2-hour block",
  AVG(temp) AS avg_temp
FROM
  home
GROUP BY
  1
HAVING
  avg_temp > (
    SELECT
      MEDIAN(temp)
    FROM
      home
  )
```

#### Inner query result

| MEDIAN(home.temp) |
| :---------------- |
| 22.45             |

#### Outer query result

{{% influxdb/custom-timestamps %}}
| 2-hour block         | avg_temp |
| :------------------- | -------: |
| 2022-01-01T12:00:00Z |   22.475 |
| 2022-01-01T16:00:00Z |   22.525 |
| 2022-01-01T18:00:00Z |   22.925 |
| 2022-01-01T14:00:00Z |   22.525 |
{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{% expand "`HAVING` clause with non-scalar subquery" %}}

Non-scalar subqueries must use the `[NOT] IN` operator and can only return a
single column. The values in the returned column are evaluated as a list.

The following query returns the maximum `co` and `temp` values within 2-hour
windows of time where the `time` value associated with time window is also
associated with a warning in the `home_actions` measurement.

```sql
SELECT
  date_bin(INTERVAL '2 hours', time) AS "2-hour block",
  max(co) AS max_co,
  max(temp) as max_temp
FROM
  home
GROUP BY
  1,
  room
HAVING
  "2-hour block" IN (
    SELECT
      DISTINCT time
    FROM
      home_actions
    WHERE
      level = 'warn'
  )
```

#### Inner query result

{{% influxdb/custom-timestamps %}}
| time                 |
| :------------------- |
| 2022-01-01T18:00:00Z |
| 2022-01-01T19:00:00Z |
| 2022-01-01T20:00:00Z |
{{% /influxdb/custom-timestamps %}}

#### Outer query result

{{% influxdb/custom-timestamps %}}
| 2-hour block         | max_co | max_temp |
| :------------------- | -----: | -------: |
| 2022-01-01T18:00:00Z |     14 |     22.8 |
| 2022-01-01T18:00:00Z |     22 |     23.3 |
| 2022-01-01T20:00:00Z |     17 |     22.2 |
| 2022-01-01T20:00:00Z |     26 |     22.7 |
{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{% expand "`HAVING` clause with correlated subquery" %}}

The following query returns 2-hour windows of time with average `temp` values
greater than the median `temp` value for each room. The subquery in the `HAVING`
clause uses the `room` value from the outer query to return the median `temp` value
for that specific room.

```sql
SELECT
  time,
  room,
  temp
FROM
  home outer_query
WHERE
  temp > (
    SELECT
      median(temp) AS temp
    FROM
      home
    WHERE
      room = outer_query.room
    GROUP BY
      room
  )
ORDER BY room, time
```

#### Inner query result

The result of the inner query depends on the value of `room` in the outer query,
but the following table contains the median `temp` value for each room.

| room        | temp |
| :---------- | ---: |
| Living Room | 22.3 |
| Kitchen     | 22.7 |

#### Outer query result

{{% influxdb/custom-timestamps %}}
| 2-hour block         | room        |           avg_temp |
| :------------------- | :---------- | -----------------: |
| 2022-01-01T14:00:00Z | Kitchen     |              22.75 |
| 2022-01-01T18:00:00Z | Kitchen     | 23.200000000000003 |
| 2022-01-01T16:00:00Z | Living Room |               22.5 |
| 2022-01-01T18:00:00Z | Living Room |              22.65 |
{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## Subquery categories

SQL subqueries can be categorized as one or more of the following based on the
behavior of the subquery:

- [correlated](#correlated-subqueries) or [non-correlated](#non-correlated-subqueries) <!-- GET MORE INFO -->
- [scalar](#scalar-subqueries) or [non-scalar](#non-scalar-subqueries)

### Correlated subqueries

In a **correlated** subquery, the inner query depends on the outer query, using
values from the outer query for its results.
Correlated subqueries can return a maximum of one row, so
[aggregations](/influxdb/cloud-serverless/reference/sql/functions/aggregate/) may
be required in the inner query.

In the query below, the inner query (`SELECT temp_avg FROM weather WHERE location = home.room`)
depends on data (`home.room`) from the outer query
(`SELECT time, room, temp FROM home`) and is therefore a _correlated_ subquery.

```sql
SELECT
  time,
  room,
  temp
FROM
  home
WHERE
  temp = (
    SELECT
      temp_avg
    FROM
      weather
    WHERE
      location = home.room
  )
```

{{% note %}}
#### Correlated subquery performance

Because correlated subqueries depend on the outer query and typically must
execute for each row returned by the outer query, correlated subqueries are
**less performant** than non-correlated subqueries.
{{% /note %}}

### Non-correlated subqueries

In a **non-correlated** subquery, the inner query _doesn't_ depend on the outer
query and executes independently.
The inner query executes first, and then passes the results to the outer query.

In the query below, the inner query (`SELECT MIN(temp_avg) FROM weather`) can
run independently from the outer query (`SELECT time, temp FROM home`) and is
therefore a _non-correlated_ subquery.

```sql
SELECT
  time,
  temp
FROM
  home
WHERE
  temp < (
    SELECT
      MIN(temp_avg)
    FROM
      weather
  )
```

### Scalar subqueries

A **scalar** subquery returns a single value (one column of one row).
If no rows are returned, the subquery returns NULL.

The example subquery below returns the average value of a specified column.
This value is a single scalar value.

```sql
SELECT * FROM home WHERE co > (SELECT avg(co) FROM home)
```

### Non-scalar subqueries

A **non-scalar** subquery returns 0, 1, or multiple rows, each of which may
contain 1 or multiple columns. For each column, if there is no value to return,
the subquery returns NULL. If no rows qualify to be returned, the subquery
returns 0 rows.

The example subquery below returns all distinct values in a column.
Multiple values are returned.

```sql
SELECT * FROM home WHERE room IN (SELECT DISTINCT room FROM home_actions)
```