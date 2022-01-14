---
title: Use the LIMIT and SLIMIT clause
list_title: LIMIT and SLIMIT clause
description: >
  ...
menu:
  influxdb_2_1:
    name: LIMIT and SLIMIT clause
    parent: Explore data
weight: 305
---

# The LIMIT and SLIMIT clauses

`LIMIT` and `SLIMIT` limit the number of
[points](/enterprise_influxdb/v1.9/concepts/glossary/#point) and the number of
[series](/enterprise_influxdb/v1.9/concepts/glossary/#series) returned per query.

## The LIMIT clause

`LIMIT <N>` returns the first `N` [points](/enterprise_influxdb/v1.9/concepts/glossary/#point) from the specified [measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement).

### Syntax

```sql
SELECT_clause [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] LIMIT <N>
```

`N` specifies the number of [points](/enterprise_influxdb/v1.9/concepts/glossary/#point) to return from the specified [measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement).
If `N` is greater than the number of points in a measurement, InfluxDB returns
all points from that series.

Note that the `LIMIT` clause must appear in the order outlined in the syntax above.

### Examples

#### Limit the number of points returned

```sql
> SELECT "water_level","location" FROM "h2o_feet" LIMIT 3

name: h2o_feet
time                   water_level   location
----                   -----------   --------
2015-08-18T00:00:00Z   8.12          coyote_creek
2015-08-18T00:00:00Z   2.064         santa_monica
2015-08-18T00:06:00Z   8.005         coyote_creek
```

The query returns the three oldest [points](/enterprise_influxdb/v1.9/concepts/glossary/#point) (determined by timestamp) from the `h2o_feet` [measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement).

#### Limit the number points returned and include a GROUP BY clause

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:42:00Z' GROUP BY *,time(12m) LIMIT 2

name: h2o_feet
tags: location=coyote_creek
time                   mean
----                   ----
2015-08-18T00:00:00Z   8.0625
2015-08-18T00:12:00Z   7.8245

name: h2o_feet
tags: location=santa_monica
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
```

The query uses an InfluxQL [function](/enterprise_influxdb/v1.9/query_language/functions)
and a [GROUP BY clause](#group-by-time-intervals)
to calculate the average `water_level` for each [tag](/enterprise_influxdb/v1.9/concepts/glossary/#tag) and for each twelve-minute
interval in the query's time range.
`LIMIT 2` requests the two oldest twelve-minute averages (determined by timestamp).

Note that without `LIMIT 2`, the query would return four points per [series](/enterprise_influxdb/v1.9/concepts/glossary/#series);
one for each twelve-minute interval in the query's time range.

## The `SLIMIT` clause

`SLIMIT <N>` returns every [point](/enterprise_influxdb/v1.9/concepts/glossary/#point) from \<N> [series](/enterprise_influxdb/v1.9/concepts/glossary/#series) in the specified [measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement).

### Syntax

```sql
SELECT_clause [INTO_clause] FROM_clause [WHERE_clause] GROUP BY *[,time(<time_interval>)] [ORDER_BY_clause] SLIMIT <N>
```

`N` specifies the number of [series](/enterprise_influxdb/v1.9/concepts/glossary/#series) to return from the specified [measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement).
If `N` is greater than the number of series in a measurement, InfluxDB returns
all series from that measurement.

There is an [ongoing issue](https://github.com/influxdata/influxdb/issues/7571) that requires queries with `SLIMIT` to include `GROUP BY *`.
Note that the `SLIMIT` clause must appear in the order outlined in the syntax above.

### Examples

#### Limit the number of series returned

```sql
> SELECT "water_level" FROM "h2o_feet" GROUP BY * SLIMIT 1

name: h2o_feet
tags: location=coyote_creek
time                   water_level
----                   -----
2015-08-18T00:00:00Z   8.12
2015-08-18T00:06:00Z   8.005
2015-08-18T00:12:00Z   7.887
[...]
2015-09-18T16:12:00Z   3.402
2015-09-18T16:18:00Z   3.314
2015-09-18T16:24:00Z   3.235
```

The query returns all `water_level` [points](/enterprise_influxdb/v1.9/concepts/glossary/#point) from one of the [series](/enterprise_influxdb/v1.9/concepts/glossary/#series) associated
with the `h2o_feet` [measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement).

#### Limit the number of series returned and include a GROUP BY time() clause

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:42:00Z' GROUP BY *,time(12m) SLIMIT 1

name: h2o_feet
tags: location=coyote_creek
time                   mean
----                   ----
2015-08-18T00:00:00Z   8.0625
2015-08-18T00:12:00Z   7.8245
2015-08-18T00:24:00Z   7.5675
2015-08-18T00:36:00Z   7.303
```

The query uses an InfluxQL [function](/enterprise_influxdb/v1.9/query_language/functions)
and a time interval in the [GROUP BY clause](#group-by-time-intervals)
to calculate the average `water_level` for each twelve-minute
interval in the query's time range.
`SLIMIT 1` requests a single series associated with the `h2o_feet` measurement.

Note that without `SLIMIT 1`, the query would return results for the two series
associated with the `h2o_feet` measurement: `location=coyote_creek` and
`location=santa_monica`.

## LIMIT and SLIMIT

`LIMIT <N>` followed by `SLIMIT <N>` returns the first \<N> [points](/enterprise_influxdb/v1.9/concepts/glossary/#point) from \<N> [series](/enterprise_influxdb/v1.9/concepts/glossary/#series) in the specified measurement.

### Syntax

```sql
SELECT_clause [INTO_clause] FROM_clause [WHERE_clause] GROUP BY *[,time(<time_interval>)] [ORDER_BY_clause] LIMIT <N1> SLIMIT <N2>
```

`N1` specifies the number of [points](/enterprise_influxdb/v1.9/concepts/glossary/#point) to return per [measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement).
If `N1` is greater than the number of points in a measurement, InfluxDB returns all points from that measurement.

`N2` specifies the number of series to return from the specified [measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement).
If `N2` is greater than the number of series in a measurement, InfluxDB returns all series from that measurement.

There is an [ongoing issue](https://github.com/influxdata/influxdb/issues/7571) that requires queries with `LIMIT` and `SLIMIT` to include `GROUP BY *`.
Note that the `LIMIT` and `SLIMIT` clauses must appear in the order outlined in the syntax above.

### Examples

#### Limit the number of points and series returned

```sql
> SELECT "water_level" FROM "h2o_feet" GROUP BY * LIMIT 3 SLIMIT 1

name: h2o_feet
tags: location=coyote_creek
time                   water_level
----                   -----------
2015-08-18T00:00:00Z   8.12
2015-08-18T00:06:00Z   8.005
2015-08-18T00:12:00Z   7.887
```

The query returns the three oldest [points](/enterprise_influxdb/v1.9/concepts/glossary/#point) (determined by timestamp) from one
of the [series](/enterprise_influxdb/v1.9/concepts/glossary/#series) associated with the
[measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement) `h2o_feet`.

#### Limit the number of points and series returned and include a GROUP BY time() clause

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:42:00Z' GROUP BY *,time(12m) LIMIT 2 SLIMIT 1

name: h2o_feet
tags: location=coyote_creek
time                   mean
----                   ----
2015-08-18T00:00:00Z   8.0625
2015-08-18T00:12:00Z   7.8245
```

The query uses an InfluxQL [function](/enterprise_influxdb/v1.9/query_language/functions)
and a time interval in the [GROUP BY clause](#group-by-time-intervals)
to calculate the average `water_level` for each twelve-minute
interval in the query's time range.
`LIMIT 2` requests the two oldest twelve-minute averages (determined by
timestamp) and `SLIMIT 1` requests a single series
associated with the `h2o_feet` measurement.

Note that without `LIMIT 2 SLIMIT 1`, the query would return four points
for each of the two series associated with the `h2o_feet` measurement.