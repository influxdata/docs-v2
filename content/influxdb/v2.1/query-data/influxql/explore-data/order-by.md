---
title: Use the ORDER BY clause
list_title: ORDER BY clause
description: >
  ...
menu:
  influxdb_2_1:
    name: ORDER BY clause
    parent: Explore data
weight: 304
---

## ORDER BY time DESC

By default, InfluxDB returns results in ascending time order; the first [point](/enterprise_influxdb/v1.9/concepts/glossary/#point)
returned has the oldest [timestamp](/enterprise_influxdb/v1.9/concepts/glossary/#timestamp) and
the last point returned has the most recent timestamp.
`ORDER BY time DESC` reverses that order such that InfluxDB returns the points
with the most recent timestamps first.

### Syntax

```sql
SELECT_clause [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] ORDER BY time DESC
```

`ORDER by time DESC` must appear after the [`GROUP BY` clause](#the-group-by-clause)
if the query includes a `GROUP BY` clause.
`ORDER by time DESC` must appear after the [`WHERE` clause](#the-where-clause)
if the query includes a `WHERE` clause and no `GROUP BY` clause.

### Examples

#### Return the newest points first

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' ORDER BY time DESC

name: h2o_feet
time                   water_level
----                   -----------
2015-09-18T21:42:00Z   4.938
2015-09-18T21:36:00Z   5.066
[...]
2015-08-18T00:06:00Z   2.116
2015-08-18T00:00:00Z   2.064
```

The query returns the points with the most recent timestamps from the
`h2o_feet` [measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement) first.
Without `ORDER by time DESC`, the query would return `2015-08-18T00:00:00Z`
first and `2015-09-18T21:42:00Z` last.

#### Return the newest points first and include a GROUP BY time() clause

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:42:00Z' GROUP BY time(12m) ORDER BY time DESC

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:36:00Z   4.6825
2015-08-18T00:24:00Z   4.80675
2015-08-18T00:12:00Z   4.950749999999999
2015-08-18T00:00:00Z   5.07625
```

The query uses an InfluxQL [function](/enterprise_influxdb/v1.9/query_language/functions)
and a time interval in the [GROUP BY clause](#group-by-time-intervals)
to calculate the average `water_level` for each twelve-minute
interval in the query's time range.
`ORDER BY time DESC` returns the most recent 12-minute time intervals
first.

Without `ORDER BY time DESC`, the query would return
`2015-08-18T00:00:00Z` first and `2015-08-18T00:36:00Z` last.