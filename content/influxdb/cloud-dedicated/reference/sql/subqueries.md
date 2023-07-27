---
title: Subqueries
description: >
  ...
menu:
  influxdb_cloud_dedicated:
    name: Subqueries
    parent: SQL reference
weight: 200
related:
  - /influxdb/cloud-dedicated/query-data/sql/
  - /influxdb/cloud-dedicated/reference/sql/select/
  - /influxdb/cloud-dedicated/reference/sql/where/
---

Subqueries (also known as inner queries or nested queries) are queries within
a query. 
Subqueries can be used in `SELECT`, `FROM`, `WHERE`, and `HAVING` clauses.

## Subquery operators

- [[ NOT ] EXISTS](#-not--exists)
- [[ NOT ] IN](#-not--in)

### [ NOT ] EXISTS

The `EXISTS` operator returns all rows where a
_[correlated subquery](#correlated-subquery)_ produces one or more matches for
that row. `NOT EXISTS` returns all rows where a _correlated subquery_ produces
zero matches for that row. Only _correlated subqueries_ are supported.

#### Syntax {#-not-exists-syntax}

```sql
[NOT] EXISTS (<query>)
```

### [ NOT ] IN

The `IN` operator returns all rows where a given expression’s value can be found
in the results of a _[correlated subquery](#correlated-subquery)_.
`NOT IN` returns all rows where a given expression’s value cannot be found in
the results of a subquery or list of values.

#### Syntax {#-not-in-syntax}

```sql
expression [NOT] IN (query|list-literal)
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

Subqueries in the `SELECT` clause use values returned from inner query as part
of the outer query's `SELECT` list.
The `SELECT` clause only supports [scalar subqueries](#scalar-subqueries) that 
return a single value per execution of the inner query.
The returned value can be unique per row.

{{% note %}}
`SELECT` clause subqueries can be used as an alternative to join operations.
{{% /note %}}

{{< expand-wrapper >}}
{{% expand "View `SELECT` clause subquery example" %}}

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

##### Results

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

{{< expand-wrapper >}}
{{% expand "View `FROM` clause subquery example" %}}

The following query uses the [Get started home sensor sample data](/influxdb/cloud-dedicated/reference/sample-data/#get-started-home-sensor-data)
and calculates the average of maximum values per room.
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

#### Inner query result

| room        | max_co | max_hum | max_temp |
| :---------- | -----: | ------: | -------: |
| Living Room |     17 |    36.4 |     22.8 |
| Kitchen     |     26 |    36.9 |     23.3 |

#### Outer query result

| avg_max_co | avg_max_hum | avg_max_temp |
| ---------: | ----------: | -----------: |
|       21.5 |        36.7 |         23.1 |

{{% /expand %}}
{{< /expand-wrapper >}}

## WHERE clause subqueries

- Correlated and non-correlated
- Scalar and non-scalar



## HAVING clause subqueries

## Subquery categories

SQL subqueries can be categorized as one or more of the following base on the
behavior of the subquery:

- [correlated](#correlated-subqueries) or [non-correlated](#non-correlated-subqueries) <!-- GET MORE INFO -->
- [scalar](#scalar-subqueries) or [non-scalar](#non-scalar-subqueries)

### Correlated subqueries

In a **correlated** subquery, the inner query depends on the outer query, using
values from the outer query for its results.
Correlated subqueries can return a maximum of one row, so
[aggregations](/influxdb/cloud-dedicated/reference/sql/functions/aggregate/) may
be required in the inner query.

{{< expand-wrapper >}}
{{% expand "View correlated subquery example" %}}

In the query below, the inner query (`SELECT temp_avg FROM weather WHERE location = home.room`)
depends on data (`home.room`) from the outer query
(`SELECT time, room, temp FROM home`) and is therefore a _correlated_ subquery.

```sql
SELECT
  time,
  room,
  temp
FROM home
WHERE temp = (SELECT temp_avg
              FROM weather
              WHERE location = home.room)
```

{{% /expand %}}
{{< /expand-wrapper >}}

{{% note %}}
#### Correlated subquery performance

Because correlated subqueries depend on the outer query and typically must
execute for each row returned by the outer query, correlated subqueries are
**less performant** than non-correlated subqueries.
{{% /note %}}

### Non-correlated subqueries

In a **non-correlated** subquery, the inner query deoes _not_ depend on the outer
query and executes independently.
The inner query executes first, and then passes the results to the outer query.


{{< expand-wrapper >}}
{{% expand "View non-correlated subquery example" %}}

In the query below, the inner query (`SELECT MIN(temp_avg) FROM weather`) can
run independently from the outer query (`SELECT time, temp FROM home`) and is
therefore a _non-correlated_ subquery.

```sql
SELECT
  time,
  temp
FROM home
WHERE temp < (SELECT MIN(temp_avg) FROM weather)
```

{{% /expand %}}
{{< /expand-wrapper >}}

### Scalar subqueries

A **scalar** subquery returns a single value (one column of one row).
If no rows are returned, the subquery returns NULL.

#### Examples

Select points where the value of a column is greater than the average value of
that column

```sql
SELECT * FROM home WHERE co > (SELECT avg(co) FROM home)
```

### Non-scalar subqueries

A **non-scalar** subquery returns 0, 1, or multiple rows, each of which may
contain 1 or multiple columns. For each column, if there is no value to return,
the subquery returns NULL. If no rows qualify to be returned, the subquery
returns 0 rows.

```sql
SELECT * FROM home WHERE room IN (SELECT DISTINCT room FROM home_actions)
```