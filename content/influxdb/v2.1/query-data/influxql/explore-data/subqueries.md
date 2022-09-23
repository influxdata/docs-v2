---
title: Subqueries
list_title: Subqueries
description: >
  ...
menu:
  influxdb_2_1:
    name: Subqueries
    parent: Explore data
weight: 310
---

## Subqueries

A subquery is a query that is nested in the `FROM` clause of another query.
Use a subquery to apply a query as a condition in the enclosing query.
Subqueries offer functionality similar to nested functions and SQL
[`HAVING` clauses](https://en.wikipedia.org/wiki/Having_%28SQL%29).

### Syntax

```sql
SELECT_clause FROM ( SELECT_statement ) [...]
```

InfluxDB performs the subquery first and the main query second.

The main query surrounds the subquery and requires at least the [`SELECT` clause](#the-basic-select-statement) and the [`FROM` clause](#the-basic-select-statement).
The main query supports all clauses listed in this document.

The subquery appears in the main query's `FROM` clause, and it requires surrounding parentheses.
The subquery supports all clauses listed in this document.

InfluxQL supports multiple nested subqueries per main query.
Sample syntax for multiple subqueries:

```sql
SELECT_clause FROM ( SELECT_clause FROM ( SELECT_statement ) [...] ) [...]
```

{{% note %}}
#### Improve performance of time-bound subqueries
To improve the performance of InfluxQL queries with time-bound subqueries,
apply the `WHERE time` clause to the outer query instead of the inner query.
For example, the following queries return the same results, but **the query with
time bounds on the outer query is more performant than the query with time
bounds on the inner query**:

##### Time bounds on the outer query (recommended)
```sql
SELECT inner_value AS value FROM (SELECT raw_value as inner_value)
WHERE time >= '2020-07-19T21:00:00Z'
AND time <= '2020-07-20T22:00:00Z'
```

##### Time bounds on the inner query
```sql
SELECT inner_value AS value FROM (
  SELECT raw_value as inner_value
  WHERE time >= '2020-07-19T21:00:00Z'
  AND time <= '2020-07-20T22:00:00Z'
)
```
{{% /note %}}

### Examples

#### Calculate the [`SUM()`](/enterprise_influxdb/v1.9/query_language/functions/#sum) of several [`MAX()`](/enterprise_influxdb/v1.9/query_language/functions/#max) values

```sql
> SELECT SUM("max") FROM (SELECT MAX("water_level") FROM "h2o_feet" GROUP BY "location")

name: h2o_feet
time                   sum
----                   ---
1970-01-01T00:00:00Z   17.169
```

The query returns the sum of the maximum `water_level` values across every tag value of `location`.

InfluxDB first performs the subquery; it calculates the maximum value of `water_level` for each tag value of `location`:

```sql
> SELECT MAX("water_level") FROM "h2o_feet" GROUP BY "location"
name: h2o_feet

tags: location=coyote_creek
time                   max
----                   ---
2015-08-29T07:24:00Z   9.964

name: h2o_feet
tags: location=santa_monica
time                   max
----                   ---
2015-08-29T03:54:00Z   7.205
```

Next, InfluxDB performs the main query and calculates the sum of those maximum values: `9.964` + `7.205` = `17.169`.
Notice that the main query specifies `max`, not `water_level`, as the field key in the `SUM()` function.

#### Calculate the [`MEAN()`](/enterprise_influxdb/v1.9/query_language/functions/#mean) difference between two fields

```sql
> SELECT MEAN("difference") FROM (SELECT "cats" - "dogs" AS "difference" FROM "pet_daycare")

name: pet_daycare
time                   mean
----                   ----
1970-01-01T00:00:00Z   1.75
```

The query returns the average of the differences between the number of `cats` and `dogs` in the `pet_daycare` measurement.

InfluxDB first performs the subquery.
The subquery calculates the difference between the values in the `cats` field and the values in the `dogs` field,
and it names the output column `difference`:

```sql
> SELECT "cats" - "dogs" AS "difference" FROM "pet_daycare"

name: pet_daycare
time                   difference
----                   ----------
2017-01-20T00:55:56Z   -1
2017-01-21T00:55:56Z   -49
2017-01-22T00:55:56Z   66
2017-01-23T00:55:56Z   -9
```

Next, InfluxDB performs the main query and calculates the average of those differences.
Notice that the main query specifies `difference` as the field key in the `MEAN()` function.

#### Calculate several [`MEAN()`](/enterprise_influxdb/v1.9/query_language/functions/#mean) values and place a condition on those mean values

```sql
> SELECT "all_the_means" FROM (SELECT MEAN("water_level") AS "all_the_means" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' GROUP BY time(12m) ) WHERE "all_the_means" > 5

name: h2o_feet
time                   all_the_means
----                   -------------
2015-08-18T00:00:00Z   5.07625
```

The query returns all mean values of the `water_level` field that are greater than five.

InfluxDB first performs the subquery.
The subquery calculates `MEAN()` values of `water_level` from `2015-08-18T00:00:00Z` through `2015-08-18T00:30:00Z` and groups the results into 12-minute intervals.
It also names the output column `all_the_means`:

```sql
> SELECT MEAN("water_level") AS "all_the_means" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' GROUP BY time(12m)

name: h2o_feet
time                   all_the_means
----                   -------------
2015-08-18T00:00:00Z   5.07625
2015-08-18T00:12:00Z   4.950749999999999
2015-08-18T00:24:00Z   4.80675
```

Next, InfluxDB performs the main query and returns only those mean values that are greater than five.
Notice that the main query specifies `all_the_means` as the field key in the `SELECT` clause.

#### Calculate the [`SUM()`](/enterprise_influxdb/v1.9/query_language/functions/#sum) of several [`DERIVATIVE()`](/enterprise_influxdb/v1.9/query_language/functions/#derivative) values

```sql
> SELECT SUM("water_level_derivative") AS "sum_derivative" FROM (SELECT DERIVATIVE(MEAN("water_level")) AS "water_level_derivative" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' GROUP BY time(12m),"location") GROUP BY "location"

name: h2o_feet
tags: location=coyote_creek
time                   sum_derivative
----                   --------------
1970-01-01T00:00:00Z   -0.4950000000000001

name: h2o_feet
tags: location=santa_monica
time                   sum_derivative
----                   --------------
1970-01-01T00:00:00Z   -0.043999999999999595
```

The query returns the sum of the derivative of average `water_level` values for each tag value of `location`.

InfluxDB first performs the subquery.
The subquery calculates the derivative of average `water_level` values taken at 12-minute intervals.
It performs that calculation for each tag value of `location` and names the output column `water_level_derivative`:

```sql
> SELECT DERIVATIVE(MEAN("water_level")) AS "water_level_derivative" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' GROUP BY time(12m),"location"

name: h2o_feet
tags: location=coyote_creek
time                   water_level_derivative
----                   ----------------------
2015-08-18T00:12:00Z   -0.23800000000000043
2015-08-18T00:24:00Z   -0.2569999999999997

name: h2o_feet
tags: location=santa_monica
time                   water_level_derivative
----                   ----------------------
2015-08-18T00:12:00Z   -0.0129999999999999
2015-08-18T00:24:00Z   -0.030999999999999694
```

Next, InfluxDB performs the main query and calculates the sum of the `water_level_derivative` values for each tag value of `location`.
Notice that the main query specifies `water_level_derivative`, not `water_level` or `derivative`, as the field key in the `SUM()` function.

### Common issues with subqueries

#### Multiple SELECT statements in a subquery

InfluxQL supports multiple nested subqueries per main query:

```sql
SELECT_clause FROM ( SELECT_clause FROM ( SELECT_statement ) [...] ) [...]
                     ------------------   ----------------
                         Subquery 1          Subquery 2
```

InfluxQL does not support multiple [`SELECT` statements](#the-basic-select-statement) per subquery:

```sql
SELECT_clause FROM (SELECT_statement; SELECT_statement) [...]
```

The system returns a parsing error if a subquery includes multiple `SELECT` statements.
