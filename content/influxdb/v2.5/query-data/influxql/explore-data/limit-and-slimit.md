---
title: The LIMIT and SLIMIT clause
list_title: LIMIT and SLIMIT clause
description: >
  Use the `LIMIT` and `SLIMIT` clauses to limit the number of [points](/influxdb/v2.5/reference/glossary/#point) and the number of [series](/influxdb/v2.5/reference/glossary/#series) returned in queries.
menu:
  influxdb_2_5:
    name: LIMIT and SLIMIT clause
    parent: Explore data
weight: 305
list_code_example: |
  ```sql
  SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] LIMIT <N>
  ```
---

Use `LIMIT` and `SLIMIT` to limit the number of [points](/influxdb/v2.5/reference/glossary/#point) and the number of [series](/influxdb/v2.5/reference/glossary/#series) returned per query.

  - [The LIMIT clause](#the-limit-clause)  
     - [Syntax](#syntax)
     - [Examples](#examples)
  - [The SLIMIT clause](#the-slimit-clause)  
     - [Syntax](#syntax-1)
     - [Examples](#examples-2)

## The LIMIT clause

`LIMIT <N>` returns the first `N` points from the specified [measurement](/influxdb/v2.5/reference/glossary/#measurement).

### Syntax

```sql
SELECT_clause FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] LIMIT <N>
```

`N` specifies the number of points to return from the specified measurement . If `N` is greater than the number of points in a measurement, InfluxDB returns all points from that series.

{{% note %}}
**IMPORTANT:** The `LIMIT` clause must appear in the order outlined in the syntax above.
{{% /note %}}

### Examples

{{< expand-wrapper >}}

{{% expand "Limit the number of points returned" %}}

```sql
> SELECT "water_level","location" FROM "h2o_feet" LIMIT 3
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time | water_level | location |
| :-------------- | :-------------------| ------------------:|
| 2019-08-17T00:00:00Z | 8.1200000000 | coyote_creek|
| 2019-08-17T00:00:00Z | 2.0640000000 |santa_monica |
| 2019-08-17T00:06:00Z | 8.0050000000 |coyote_creek |

The query returns the three oldest points, determined by timestamp, from the `h2o_feet` [measurement](/influxdb/v2.5/reference/glossary/#measurement).

{{% /expand %}}

{{% expand "Limit the number of points returned and include a GROUP BY clause" %}}

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:42:00Z' GROUP BY *,time(12m) LIMIT 2
```
Output:  
{{% influxql/table-meta %}}
name: h2o_feet  
tags: location=coyote_creek
{{% /influxql/table-meta %}}

| time                 | mean                        |
| :------------------- | :-------------------------- |
| 2019-08-18T00:00:00Z | 8.4615000000                |
| 2019-08-18T00:12:00Z | 8.2725000000                |

{{% influxql/table-meta %}}
name: h2o_feet       
tags: location=santa_monica
{{% /influxql/table-meta %}}

| time                 | mean                        |
| :------------------- | :-------------------------- |
| 2019-08-18T00:00:00Z | 2.3655000000                |
| 2019-08-18T00:12:00Z | 2.3360000000                |

This query uses the InfluxQL [MEAN() function](/influxdb/v2.5/query-data/influxql/view-functions/aggregates/#mean) and a `GROUP BY` clause to calculate the average `water_level` for each [tag](/influxdb/v2.5/reference/glossary/#tag) and for each twelve-minute interval in the query's time range. `LIMIT 2` requests the two oldest twelve-minute averages (determined by timestamp).

Note that without `LIMIT 2`, the query would return four points per series; one for each twelve-minute interval in the query's time range.

{{% /expand %}}

{{< /expand-wrapper >}}

## The `SLIMIT` clause

`SLIMIT <N>` returns every [point](/influxdb/v2.5/reference/glossary/#point) from \<N> [series](//influxdb/v2.5/reference/glossary/#series) in the specified [measurement](/influxdb/v2.5/reference/glossary/#measurement).

### Syntax

```sql
SELECT_clause FROM_clause [WHERE_clause] GROUP BY *[,time(<time_interval>)] [ORDER_BY_clause] SLIMIT <N>
```

`N` specifies the number of series to return from the specified measurement. If `N` is greater than the number of series in a measurement, InfluxDB returns all series from that measurement.

There is an [ongoing issue](https://github.com/influxdata/influxdb/issues/7571) that requires queries with `SLIMIT` to include `GROUP BY *`. Note that the `SLIMIT` clause must appear in the order outlined in the syntax above.

### Examples

{{< expand-wrapper >}}

{{% expand "Limit the number of series returned" %}}

```sql
> SELECT "water_level" FROM "h2o_feet" GROUP BY * SLIMIT 1
```
Output:  
{{% influxql/table-meta %}} 
name: h2o_feet  
tags: location=coyote_creek
{{% /influxql/table-meta %}} 

| time   |  water_level |
| :------------------ | ---------------------:|
| 2019-08-17T00:00:00Z | 8.1200000000|
| 2019-08-17T00:06:00Z | 8.0050000000|
| 2019-08-17T00:12:00Z | 7.8870000000|
| 2019-08-17T00:18:00Z | 7.7620000000|
| 2019-08-17T00:24:00Z | 7.6350000000|
| 2019-08-17T00:30:00Z | 7.5000000000|
| 2019-08-17T00:36:00Z | 7.3720000000|

The results above include only the first few rows, as the data set is quite large. The query returns all `water_level` [points](/influxdb/v2.5/reference/glossary/#point) from one of the [series](/influxdb/v2.5/reference/glossary/#series) associated with the `h2o_feet` [measurement](/influxdb/v2.5/reference/glossary/#measurement).

{{% /expand %}}

{{% expand "Limit the number of series returned and include a GROUP BY time() clause" %}}

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:42:00Z' GROUP BY *,time(12m) SLIMIT 1
```

Output:  
{{% influxql/table-meta %}} 
name: h2o_feet  
tags: location=coyote_creek
{{% /influxql/table-meta %}} 

| time  | mean |
| :------------------ | ---------------------:|
| 2019-08-18T00:00:00Z | 8.4615000000|
| 2019-08-18T00:12:00Z | 8.2725000000|
| 2019-08-18T00:24:00Z | 8.0710000000|
| 2019-08-18T00:36:00Z | 7.8330000000|

The query uses the InfluxQL [MEAN() function](/influxdb/v2.5/query-data/influxql/view-functions/aggregates/#mean)
and a time interval in the [GROUP BY clause](/influxdb/v2.5/query-data/influxql/explore-data/group-by/)
to calculate the average `water_level` for each twelve-minute
interval in the query's time range.

`SLIMIT 1` requests a single series associated with the `h2o_feet` measurement.

Note that without `SLIMIT 1`, the query would return results for the two series
associated with the `h2o_feet` measurement: `location=coyote_creek` and
`location=santa_monica`.

{{% /expand %}}

{{< /expand-wrapper >}}

## LIMIT and SLIMIT

`LIMIT <N>` followed by `SLIMIT <N>` returns the first \<N> [points](/influxdb/v2.5/reference/glossary/#point) from \<N> series in the specified measurement.

### Syntax

```sql
SELECT_clause FROM_clause [WHERE_clause] GROUP BY *[,time(<time_interval>)] [ORDER_BY_clause] LIMIT <N1> SLIMIT <N2>
```

`N1` specifies the number of points to return per measurement. If `N1` is greater than the number of points in a measurement, InfluxDB returns all points from that measurement.

`N2` specifies the number of series to return from the specified measurement. If `N2` is greater than the number of series in a measurement, InfluxDB returns all series from that measurement.

There is an [ongoing issue](https://github.com/influxdata/influxdb/issues/7571) that requires queries with `LIMIT` and `SLIMIT` to include `GROUP BY *`.
Note that the `LIMIT` and `SLIMIT` clauses must appear in the order outlined in the syntax above.

### Examples

{{< expand-wrapper >}}

{{% expand "Limit the number of points and series returned" %}}

```sql
> SELECT "water_level" FROM "h2o_feet" GROUP BY * LIMIT 3 SLIMIT 1
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet  
Tags: location=coyote_creek
{{% /influxql/table-meta %}}

| time   |  water_level |
| :------------------ | ---------------------:|
| 2019-08-17T00:00:00Z  |  8.1200000000|
| 2019-08-17T00:06:00Z  |  8.0050000000|
| 2019-08-17T00:12:00Z  |  7.8870000000|

The query returns the three oldest points, determined by timestamp, from one of the series associated with the measurement  `h2o_feet`.

{{% /expand %}}

{{% expand "Limit the number of points and series returned and include a GROUP BY time() clause" %}}

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:42:00Z' GROUP BY *,time(12m) LIMIT 2 SLIMIT 1
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet  
Tags: location=coyote_creek
{{% /influxql/table-meta %}}

| time   | mean |
| :------------------ | ---------------------:|
| 2019-08-18T00:00:00Z | 8.4615000000|
| 2019-08-18T00:12:00Z | 8.2725000000|

The query uses the InfluxQL function MEAN() and a time interval in the GROUP BY clause to calculate the average `water_level` for each twelve-minute interval in the query's time range. `LIMIT 2` requests the two oldest twelve-minute averages (determined by
timestamp) and `SLIMIT 1` requests a single series associated with the `h2o_feet` measurement.

Note that without `LIMIT 2 SLIMIT 1`, the query would return four points for each of the two series associated with the `h2o_feet` measurement.

{{% /expand %}}

{{< /expand-wrapper >}}
