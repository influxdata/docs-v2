---
title: The OFFSET and SOFFSET clauses
list_title: OFFSET and SOFFSET clause
description: >
  ...
menu:
  influxdb_2_1:
    name: OFFSET and SOFFSET clause
    parent: Explore data
weight: 306
---

`OFFSET` and `SOFFSET` paginates [points](/influxdb/v2.4/reference/glossary/#point) and [series](/influxdb/v2.4/reference/glossary/#series) returned.

<table style="width:100%">
  <tr>
    <td><a href="#the-offset-clause">The OFFSET clause</a></td>
    <td><a href="#the-soffset-clause">The SOFFSET clause</a></td>
  </tr>
</table>

## The `OFFSET` clause

`OFFSET <N>` paginates `N` [points](/influxdb/v2.4/reference/glossary/#point) in the query results.

### Syntax

```sql
SELECT_clause [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] LIMIT_clause OFFSET <N> [SLIMIT_clause]
```

`N` specifies the number of points to paginate. The `OFFSET clause` requires a `LIMIT clause`.

{{% note %}}
**NOTE:** InfluxDB returns no results if the `WHERE clause` includes a time range and the `OFFSET clause` would cause InfluxDB to return points with timestamps outside of that time range.
{{% /note %}}

### Examples

#### Paginate points

```sql
> SELECT "water_level","location" FROM "h2o_feet" LIMIT 3 OFFSET 3
```
Output:
| name: h2o_feet |
| :-------------- | :-------------------| :------------------|
| time | water_level | location |
| 2019-08-17T00:06:00Z | 2.1160000000 | santa_monica|
| 2019-08-17T00:12:00Z | 7.8870000000 | coyote_creek|
| 2019-08-17T00:12:00Z | 2.0280000000 | santa_monica|

The query returns the fourth, fifth, and sixth points from the `h2o_feet` [measurement](/influxdb/v2.4/reference/glossary/#measurement). If the query did not include `OFFSET 3`, it would return the first, second,
and third points from that measurement.

#### Paginate points and include several clauses

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:42:00Z' GROUP BY *,time(12m) ORDER BY time DESC LIMIT 2 OFFSET 2 SLIMIT 1
```
Output:
| name: h2o_feet | tags: location=coyote_creek |
| :------------------ | :---------------------|
| time   | mean |
| 2019-08-18T00:12:00Z | 8.2725000000 |
| 2019-08-18T00:00:00Z | 8.4615000000 |

This example is fairly involved, so here's the clause-by-clause breakdown:

  - The `SELECT clause` specifies an InfluxQL [function](/enterprise_influxdb/v1.9/query_language/functions).
  - The `FROM clause` (#the-basic-select-statement) specifies a single measurement.
  - The [`WHERE` clause](#the-where-clause) specifies the time range for the query.
  - The [`GROUP BY` clause](#the-group-by-clause) groups results by all tags  (`*`) and into 12-minute intervals.
  - The [`ORDER BY time DESC` clause](#order-by-time-desc) returns results in descending timestamp order.
  - The [`LIMIT 2` clause](#the-limit-clause) limits the number of points returned to two.
  - The `OFFSET 2` clause excludes the first two averages from the query results.
  - The [`SLIMIT 1` clause](#the-slimit-clause) limits the number of series returned to one.

Without `OFFSET 2`, the query would return the first two averages of the query results:

Output:
| name: h2o_feet | tags: location=coyote_creek |
| :------------------ | :---------------------|
| time   | mean |
| 2019-08-18T00:36:00Z | 7.8330000000 |
| 2019-08-18T00:24:00Z | 8.0710000000 |

## The `SOFFSET` clause

`SOFFSET <N>` paginates `N` [series](/influxdb/v2.4/reference/glossary/#series) in the query results.

### Syntax

```sql
SELECT_clause [INTO_clause] FROM_clause [WHERE_clause] GROUP BY *[,time(time_interval)] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] SLIMIT_clause SOFFSET <N>
```

`N` specifies the number of [series](/influxdb/v2.4/reference/glossary/#series) to paginate.
The `SOFFSET` clause requires an [`SLIMIT` clause](#the-slimit-clause).
Using the `SOFFSET` clause without an `SLIMIT` clause can cause [inconsistent
query results](https://github.com/influxdata/influxdb/issues/7578).
There is an [ongoing issue](https://github.com/influxdata/influxdb/issues/7571) that requires queries with `SLIMIT` to include `GROUP BY *`.

{{% note %}}
**NOTE:** InfluxDB returns no results if the `SOFFSET` clause paginates through more than the total number of series.
{{% /note %}}

### Examples

#### Paginate series

```sql
> SELECT "water_level" FROM "h2o_feet" GROUP BY * SLIMIT 1 SOFFSET 1
```
Output:
| name: h2o_feet | tags: location=santa_monica |
| :------------------ | :---------------------|
| time   |  water_level |
| 2019-08-17T00:00:00Z  | 2.0640000000|
| 2019-08-17T00:06:00Z  | 2.1160000000|
| 2019-08-17T00:12:00Z  | 2.0280000000|
| 2019-08-17T00:18:00Z  | 2.1260000000|
| 2019-08-17T00:24:00Z  | 2.0410000000|
| 2019-08-17T00:30:00Z  | 2.0510000000|
| 2019-08-17T00:36:00Z  | 2.0670000000|
| 2019-08-17T00:42:00Z  | 2.0570000000|

The results above are partial, as the data set is quite large. The query returns data for the series associated with the `h2o_feet`
measurement and the `location = santa_monica` tag. Without `SOFFSET 1`, the query returns data for the series associated with the `h2o_feet` measurement and the `location = coyote_creek` tag.

#### Paginate series and include all clauses

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:42:00Z' GROUP BY *,time(12m) ORDER BY time DESC LIMIT 2 OFFSET 2 SLIMIT 1 SOFFSET 1
```
Output:
| name: h2o_feet | tags: location=santa_monica |
| :------------------ | :---------------------|
| time   |  mean  |
| 2019-08-18T00:12:00Z | 2.3360000000|
| 2019-08-18T00:00:00Z | 2.3655000000|

This example is pretty involved, so here's the clause-by-clause breakdown:

  - The [`SELECT` clause](#the-basic-select-statement) specifies an InfluxQL [function](/enterprise_influxdb/v1.9/query_language/functions).
  - The [`FROM` clause](#the-basic-select-statement) specifies a single measurement.
  - The [`WHERE` clause](#the-where-clause) specifies the time range for the query.
  - The [`GROUP BY` clause](#the-group-by-clause) groups results by all tags  (`*`) and into 12-minute intervals.
  - The [`ORDER BY time DESC` clause](#order-by-time-desc) returns results in descending timestamp order.
  - The [`LIMIT 2` clause](#the-limit-clause) limits the number of points returned to two.
  - The [`OFFSET 2` clause](#the-offset-clause) excludes the first two averages from the query results.
  - The [`SLIMIT 1` clause](#the-slimit-clause) limits the number of series returned to one.
  - The `SOFFSET 1` clause paginates the series returned.

Without `SOFFSET 1`, the query would return the results for a different series:

Output:
| name: h2o_feet | tags: location=coyote_creek |
| :------------------ | :---------------------|
| time   | mean |
| 2019-08-18T00:12:00Z | 8.2725000000 |
| 2019-08-18T00:00:00Z | 8.4615000000 |

