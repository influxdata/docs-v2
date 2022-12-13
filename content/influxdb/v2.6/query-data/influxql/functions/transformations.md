---
title: InfluxQL transformation functions
list_title: Tranfsormation functions
description: >
  Use transformation functions modify and return values each row of queried data.
menu:
  influxdb_2_6:
    name: Transformations
    parent: InfluxQL functions
weight: 205
---

InfluxQL transformation functions modify and return values each row of queried data.

Each transformation function below covers **syntax**, including parameters to pass to the function, and **examples** of how to use the function. Examples use [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data) and data from [sample_test.txt](https://gist.github.com/sanderson/244e3dc2d778d5c37783483c6c2b548a).

- [ABS()](#abs)
- [ACOS()](#acos)
- [ASIN()](#asin)
- [ATAN()](#atan)
- [ATAN2()](#atan2)
- [CEIL()](#ceil)
- [COS()](#cos)
- [CUMULATIVE_SUM()](#cumulative_sum)
- [DERIVATIVE()](#derivative)
- [DIFFERENCE()](#difference)
- [ELAPSED()](#elapsed)
- [EXP()](#exp)
- [FLOOR()](#floor)
- [HISTOGRAM()](#histogram)
- [LN()](#ln)
- [LOG()](#log)
- [LOG2()](#log2)
- [LOG10()](#log10)
- [MOVING_AVERAGE()](#moving_average)
- [NON_NEGATIVE_DERIVATIVE()](#non_negative_derivative)
- [NON_NEGATIVE_DIFFERENCE](#non_negative_difference)
- [POW](#pow)
- [ROUND](#round)
- [SIN](#sin)
- [SQRT](#sqrt)
- [TAN](#tan)

## ABS()

Returns the absolute value of the field value. Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).

### Basic syntax

```sql
SELECT ABS( [ * | <field_key> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`ABS(field_key)`  
Returns the absolute values of field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

`ABS(*)`  
Returns the absolute values of field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`ABS()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the absolute values of field values associated with a field key" %}}

Return the absolute values of field values in the `water_level` field key in the `h2o_feet` measurement.

```sql
SELECT ABS("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:15:00Z'
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |          abs |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 8.5040000000 |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 8.4190000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 8.3200000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |

{{% /expand %}}

{{% expand "Calculate the absolute values of field values associated with each field key in a measurement" %}}

Return the absolute values of field values for each field key that stores numeric values in the `data` measurement.
The `h2o_feet` measurement has one numeric field `water_level`.

```sql
SELECT ABS(*) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:15:00Z'
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 | abs_water_level |
| :------------------- | --------------: |
| 2019-08-18T00:00:00Z |    8.5040000000 |
| 2019-08-18T00:00:00Z |    2.3520000000 |
| 2019-08-18T00:06:00Z |    8.4190000000 |
| 2019-08-18T00:06:00Z |    2.3790000000 |
| 2019-08-18T00:12:00Z |    8.3200000000 |
| 2019-08-18T00:12:00Z |    2.3430000000 |


{{% /expand %}}

{{% expand "Calculate the absolute values of field values associated with a field key and include several clauses" %}}

Return the absolute values of field values associated with the `water_level`
field key in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

```sql
SELECT ABS("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |          abs |
| :------------------- | -----------: |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:24:00Z | 8.1300000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:18:00Z | 8.2250000000 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT ABS(<function>( [ * | <field_key> ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `ABS()` function to those results.

`ABS()` supports the following nested functions:

[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the absolute values of mean values" %}}

Return the absolute values of [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `water_level`s that are calculated at 12-minute intervals.

```sql
SELECT ABS(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |          abs |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 5.4135000000 |
| 2019-08-18T00:12:00Z | 5.3042500000 |
| 2019-08-18T00:24:00Z | 5.1682500000 |

{{% /expand %}}

{{< /expand-wrapper >}}

## ACOS()

Returns the arccosine (in radians) of the field value. Field values must be between -1 and 1. Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but does not support [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).

### Basic syntax

```sql
SELECT ACOS( [ * | <field_key> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`ACOS(field_key)`  
Returns the arccosine of field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

`ACOS(*)`  
Returns the arccosine of field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`ACOS()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types) with values between -1 and 1.

#### Examples

The examples below use a subset of data from [sample_test.txt](https://gist.github.com/sanderson/244e3dc2d778d5c37783483c6c2b548a), which only includes field values within the calculable range (-1 to 1). This value range is required for the `ACOS()` function:

| time                 |                  a |
| :------------------- | -----------------: |
| 2018-06-24T12:01:00Z | -0.774984088561186 |
| 2018-06-24T12:02:00Z | -0.921037167720451 |
| 2018-06-24T12:04:00Z | -0.905980032168252 |
| 2018-06-24T12:05:00Z | -0.891164752631417 |
| 2018-06-24T12:09:00Z |  0.416579917279588 |
| 2018-06-24T12:10:00Z |  0.328968116955350 |
| 2018-06-24T12:11:00Z |  0.263585064411983 |


{{< expand-wrapper >}}

{{% expand "Calculate the arccosine of field values associated with a field key" %}}

Return the arccosine of field values in the `a` field key in the `data` measurement.

```sql
SELECT ACOS("a") FROM "data" WHERE time >= '2018-06-24T00:00:00Z' AND time <= '2018-06-25T00:00:00Z'
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |         acos |
| :------------------- | -----------: |
| 2018-06-24T12:00:00Z |              |
| 2018-06-24T12:01:00Z | 2.4574862443 |
| 2018-06-24T12:02:00Z | 2.7415314737 |
| 2018-06-24T12:03:00Z |              |
| 2018-06-24T12:04:00Z | 2.7044854503 |
| 2018-06-24T12:05:00Z | 2.6707024029 |
| 2018-06-24T12:06:00Z |              |
| 2018-06-24T12:07:00Z |              |
| 2018-06-24T12:08:00Z |              |
| 2018-06-24T12:09:00Z | 1.1411163210 |
| 2018-06-24T12:10:00Z | 1.2355856616 |
| 2018-06-24T12:11:00Z | 1.3040595066 |

{{% /expand %}}

{{% expand "Calculate the arccosine of field values associated with each field key in a measurement" %}}

Return the arccosine of field values for each field key that stores numeric values in the `data` measurement, field `a` and `b`.

```sql
SELECT ACOS(*) FROM "data" WHERE time >= '2018-06-24T00:00:00Z' AND time <= '2018-06-25T00:00:00Z'
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |       acos_a |       acos_b |
| :------------------- | -----------: | -----------: |
| 2018-06-24T12:00:00Z |              | 1.7351786976 |
| 2018-06-24T12:01:00Z | 2.4574862443 | 1.4333294161 |
| 2018-06-24T12:02:00Z | 2.7415314737 | 2.0748091141 |
| 2018-06-24T12:03:00Z |              | 1.6438345404 |
| 2018-06-24T12:04:00Z | 2.7044854503 |              |
| 2018-06-24T12:05:00Z | 2.6707024029 | 0.7360183965 |
| 2018-06-24T12:06:00Z |              | 1.2789990384 |
| 2018-06-24T12:07:00Z |              | 2.1522589654 |
| 2018-06-24T12:08:00Z |              | 0.6128438977 |
| 2018-06-24T12:09:00Z | 1.1411163210 |              |
| 2018-06-24T12:10:00Z | 1.2355856616 |              |
| 2018-06-24T12:11:00Z | 1.3040595066 | 1.7595349692 |
| 2018-06-24T12:12:00Z | 1.8681669412 | 2.5213034266 |

{{% /expand %}}

{{% expand "Calculate the arccosine of field values associated with a field key and include several clauses" %}}

Return the arccosine of field values associated with the `a` field key in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2018-06-24T00:00:00Z` and `2018-06-25T00:00:00Z` with results in [descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

```sql
SELECT ACOS("a") FROM "data" WHERE time >= '2018-06-24T00:00:00Z' AND time <= '2018-06-25T00:00:00Z' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |         acos |
| :------------------- | -----------: |
| 2018-06-24T23:58:00Z | 1.5361053361 |
| 2018-06-24T23:57:00Z |              |
| 2018-06-24T23:56:00Z | 0.5211076815 |
| 2018-06-24T23:55:00Z |  1.647695085 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT ACOS(<function>( [ * | <field_key> ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `ACOS()` function to those results.

`ACOS()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the arccosine of mean values" %}}

Return the arccosine of [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `a` that are calculated at 3 hour intervals.

```sql
SELECT ACOS(MEAN("a")) FROM "data" WHERE time >= '2018-06-24T00:00:00Z' AND time <= '2018-06-25T00:00:00Z' GROUP BY time(3h)
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |         acos |
| :------------------- | -----------: |
| 2018-06-24T00:00:00Z |              |
| 2018-06-24T03:00:00Z |              |
| 2018-06-24T06:00:00Z |              |
| 2018-06-24T09:00:00Z |              |
| 2018-06-24T12:00:00Z | 1.5651603194 |
| 2018-06-24T15:00:00Z | 1.6489104619 |
| 2018-06-24T18:00:00Z | 1.4851295699 |
| 2018-06-24T21:00:00Z | 1.6209901549 |
| 2018-06-25T00:00:00Z | 1.7149309371 |

{{% /expand %}}

{{< /expand-wrapper >}}

## ASIN()

Returns the arcsine (in radians) of the field value. Field values must be between -1 and 1.

### Basic syntax

```sql
SELECT ASIN( [ * | <field_key> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`ASIN(field_key)`  
Returns the arcsine of field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

`ASIN(*)`  
Returns the arcsine of field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`ASIN()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types) with values between -1 and 1.

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `ASIN()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following data from [sample_test.txt](https://gist.github.com/sanderson/244e3dc2d778d5c37783483c6c2b548a).  

The following data from this data set only includes field value within the calculable range (-1 to 1) required for the `ASIN()` function:

| time                 |                  a |
| :------------------- | -----------------: |
| 2018-06-24T12:01:00Z | -0.774984088561186 |
| 2018-06-24T12:02:00Z | -0.921037167720451 |
| 2018-06-24T12:04:00Z | -0.905980032168252 |
| 2018-06-24T12:05:00Z | -0.891164752631417 |
| 2018-06-24T12:09:00Z |  0.416579917279588 |
| 2018-06-24T12:10:00Z |  0.328968116955350 |
| 2018-06-24T12:11:00Z |  0.263585064411983 |

{{< expand-wrapper >}}

{{% expand "Calculate the arcsine of field values associated with a field key" %}}

Return the arcsine of field values in the `a` field key in the `data` measurement.

```sql
SELECT ASIN("a") FROM "data" WHERE time >= '2018-06-24T00:00:00Z' AND time <= '2018-06-25T00:00:00Z'
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |          asin |
| :------------------- | ------------: |
| 2018-06-24T12:00:00Z |               |
| 2018-06-24T12:01:00Z | -0.8866899175 |
| 2018-06-24T12:02:00Z | -1.1707351469 |
| 2018-06-24T12:03:00Z |               |
| 2018-06-24T12:04:00Z | -1.1336891235 |
| 2018-06-24T12:05:00Z | -1.0999060761 |
| 2018-06-24T12:06:00Z |               |
| 2018-06-24T12:07:00Z |               |
| 2018-06-24T12:08:00Z |               |
| 2018-06-24T12:09:00Z |  0.4296800058 |
| 2018-06-24T12:10:00Z |  0.3352106652 |
| 2018-06-24T12:11:00Z |  0.2667368202 |
| 2018-06-24T12:12:00Z | -0.2973706144 |

{{% /expand %}}

{{% expand "Calculate the arcsine of field values associated with each field key in a measurement" %}}

Return the arcsine of field values for each field key that stores numeric values in the `data` measurement.
The `data` measurement has one numeric field: `a`.

```sql
SELECT ASIN(*) FROM "data" WHERE time >= '2018-06-24T00:00:00Z' AND time <= '2018-06-25T00:00:00Z'
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |        asin_a |        asin_b |
| :------------------- | ------------: | ------------: |
| 2018-06-24T12:00:00Z |               | -0.1643823708 |
| 2018-06-24T12:01:00Z | -0.8866899175 |  0.1374669107 |
| 2018-06-24T12:02:00Z | -1.1707351469 | -0.5040127873 |
| 2018-06-24T12:03:00Z |               | -0.0730382136 |
| 2018-06-24T12:04:00Z | -1.1336891235 |               |
| 2018-06-24T12:05:00Z | -1.0999060761 |  0.8347779303 |
| 2018-06-24T12:06:00Z |               |  0.2917972884 |
| 2018-06-24T12:07:00Z |               | -0.5814626386 |
| 2018-06-24T12:08:00Z |               |  0.9579524291 |
| 2018-06-24T12:09:00Z |  0.4296800058 |               |
| 2018-06-24T12:10:00Z |  0.3352106652 |               |
| 2018-06-24T12:11:00Z |  0.2667368202 | -0.1887386424 |
| 2018-06-24T12:12:00Z | -0.2973706144 | -0.9505070998 |

{{% /expand %}}

{{% expand "Calculate the arcsine of field values associated with a field key and include several clauses" %}}

Return the arcsine of field values associated with the `a` field key in the
[time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2018-06-24T00:00:00Z` and `2018-06-25T00:00:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

```sql
SELECT ASIN("a") FROM "data" WHERE time >= '2018-06-24T00:00:00Z' AND time <= '2018-06-25T00:00:00Z' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |         asin |
| :------------------- | -----------: |
| 2018-06-24T23:58:00Z | 0.0346909907 |
| 2018-06-24T23:57:00Z |              |
| 2018-06-24T23:56:00Z | 1.0496886453 |
| 2018-06-24T23:55:00Z | 0.0768987583 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT ASIN(<function>( [ * | <field_key> ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `ASIN()` function to those results.

`ASIN()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the arcsine of mean values" %}}

Return the arcsine of [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `a`s that are calculated at 3-hour intervals.

```sql
SELECT ASIN(MEAN("a")) FROM "data" WHERE time >= '2018-06-24T00:00:00Z' AND time <= '2018-06-25T00:00:00Z' GROUP BY time(3h)
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |          asin |
| :------------------- | ------------: |
| 2018-06-24T00:00:00Z |               |
| 2018-06-24T03:00:00Z |               |
| 2018-06-24T06:00:00Z |               |
| 2018-06-24T09:00:00Z |               |
| 2018-06-24T12:00:00Z |  0.0056360073 |
| 2018-06-24T15:00:00Z | -0.0781141351 |
| 2018-06-24T18:00:00Z |  0.0856667569 |
| 2018-06-24T21:00:00Z | -0.0501938281 |
| 2018-06-25T00:00:00Z | -0.1441346103 |

{{% /expand %}}

{{< /expand-wrapper >}}

## ATAN()

Returns the arctangent (in radians) of the field value. Field values must be between -1 and 1.

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `ATAN()` with a `GROUP BY time()` clause, see the [Advanced syntax](#advanced-syntax).

### Basic syntax

```sql
SELECT ATAN( [ * | <field_key> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`ATAN(field_key)`  
Returns the arctangent of field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

<!-- `ATAN(/regular_expression/)`  
Returns the arctangent of field values associated with each field key that matches the [regular expression](/influxdb/v2.6/query-data/influxql/explore-data/regular-expressions/). -->

`ATAN(*)`  
Returns the arctangent of field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`ATAN()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types) with values between -1 and 1.

#### Examples

The examples below use a subset of data from [sample_test.txt](https://gist.github.com/sanderson/244e3dc2d778d5c37783483c6c2b548a) that only includes field values within the calculable range (-1 to 1) required for the of the `ATAN()` function.

{{< expand-wrapper >}}

{{% expand "Calculate the arctangent of field values associated with a field key" %}}

Return the arctangent of field values in the `a` field key in the `data` measurement.

```sql
SELECT ATAN("a") FROM "data" WHERE time >= '2018-06-24T00:00:00Z' AND time <= '2018-06-25T00:00:00Z'
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |          atan |
| :------------------- | ------------: |
| 2018-06-24T12:00:00Z |  0.9293622934 |
| 2018-06-24T12:01:00Z | -0.6593001275 |
| 2018-06-24T12:02:00Z | -0.7443170184 |
| 2018-06-24T12:03:00Z | -1.0488818071 |
| 2018-06-24T12:04:00Z | -0.7361091801 |
| 2018-06-24T12:05:00Z | -0.7279122495 |
| 2018-06-24T12:06:00Z |  0.8379907133 |
| 2018-06-24T12:07:00Z | -0.9117032768 |
| 2018-06-24T12:08:00Z | -1.0364006848 |
| 2018-06-24T12:09:00Z |  0.3947172008 |
| 2018-06-24T12:10:00Z |  0.3178167283 |
| 2018-06-24T12:11:00Z |  0.2577231762 |
| 2018-06-24T12:12:00Z | -0.2850291359 |

{{% /expand %}}

{{% expand "Calculate the arctangent of field values associated with each field key in a measurement" %}}

Return the arctangent of field values for each field key that stores numeric values in the `data` measurement--fields `a` and `b`.

```sql
SELECT ATAN(*) FROM "data" WHERE time >= '2018-06-24T00:00:00Z' AND time <= '2018-06-25T00:00:00Z'
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |        atan_a |        atan_b |
| :------------------- | ------------: | ------------: |
| 2018-06-24T12:00:00Z |  0.9293622934 | -0.1622053541 |
| 2018-06-24T12:01:00Z | -0.6593001275 |  0.1361861379 |
| 2018-06-24T12:02:00Z | -0.7443170184 | -0.4499093122 |
| 2018-06-24T12:03:00Z | -1.0488818071 | -0.0728441751 |
| 2018-06-24T12:04:00Z | -0.7361091801 |  1.0585985451 |
| 2018-06-24T12:05:00Z | -0.7279122495 |  0.6378113578 |
| 2018-06-24T12:06:00Z |  0.8379907133 |  0.2801105336 |
| 2018-06-24T12:07:00Z | -0.9117032768 | -0.5022647489 |
| 2018-06-24T12:08:00Z | -1.0364006848 |  0.6856298940 |
| 2018-06-24T12:09:00Z |  0.3947172008 | -0.8711781065 |
| 2018-06-24T12:10:00Z |  0.3178167283 | -0.8273348593 |
| 2018-06-24T12:11:00Z |  0.2577231762 | -0.1854639556 |
| 2018-06-24T12:12:00Z | -0.2850291359 | -0.6830451940 |

{{% /expand %}}

{{% expand "Calculate the arctangent of field values associated with a field key and include several clauses" %}}

Return the arctangent of field values associated with the `a` field key in 
[time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2017-05-01T00:00:00Z` and `2017-05-09T00:00:00Z` and returns results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

```sql
SELECT ATAN("a") FROM "data" WHERE time >= '2018-06-24T00:00:00Z' AND time <= '2018-06-25T00:00:00Z' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |          atan |
| :------------------- | ------------: |
| 2018-06-24T23:58:00Z |  0.0346701348 |
| 2018-06-24T23:57:00Z | -0.8582372146 |
| 2018-06-24T23:56:00Z |  0.7144341473 |
| 2018-06-24T23:55:00Z | -0.0766723939 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT ATAN(<function>( [ * | <field_key> ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `ATAN()` function to those results.

`ATAN()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples of advanced syntax

{{< expand-wrapper >}}

{{% expand "Calculate the arctangent of mean values" %}}

Return the arctangent of [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `a`s that are calculated at 3-hour intervals.

```sql
SELECT ATAN(MEAN("a")) FROM "data" WHERE time >= '2018-06-24T00:00:00Z' AND time <= '2018-06-25T00:00:00Z' GROUP BY time(3h)
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |          atan |
| :------------------- | ------------: |
| 2018-06-24T00:00:00Z |               |
| 2018-06-24T03:00:00Z |               |
| 2018-06-24T06:00:00Z |               |
| 2018-06-24T09:00:00Z |               |
| 2018-06-24T12:00:00Z |  0.0056359178 |
| 2018-06-24T15:00:00Z | -0.0778769005 |
| 2018-06-24T18:00:00Z |  0.0853541301 |
| 2018-06-24T21:00:00Z | -0.0501307176 |
| 2018-06-25T00:00:00Z | -0.1426603174 |

{{% /expand %}}

{{< /expand-wrapper >}}

## ATAN2()

Returns the the arctangent of `y/x` in radians.

### Basic syntax

```sql
SELECT ATAN2( [ * | <field_key> | num ], [ <field_key> | num ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`ATAN2(field_key_y, field_key_x)`  
Returns the arctangent of field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key), `field_key_y`, divided by field values associated with `field_key_x`.

`ATAN2(*, field_key_x)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement)
divided by field values associated with `field_key_x`.

`ATAN2()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `ATAN2()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use [sample_test.txt](https://gist.github.com/sanderson/244e3dc2d778d5c37783483c6c2b548a).

{{< expand-wrapper >}}

{{% expand "Calculate the arctangent of field_key_b over field_key_a" %}}

Return the arctangents of field values in the `a` field key divided by values in the `b` field key. Both are part of the `data` measurement.

```sql
SELECT ATAN2("a", "b") FROM "data" WHERE time >= '2018-06-24T00:00:00Z' AND time <= '2018-06-25T00:00:00Z'
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |         atan2 |
| :------------------- | ------------: |
| 2018-06-24T12:00:00Z |  1.6923979639 |
| 2018-06-24T12:01:00Z | -1.3957831900 |
| 2018-06-24T12:02:00Z | -2.0537314089 |
| 2018-06-24T12:03:00Z | -1.6127391493 |
| 2018-06-24T12:04:00Z | -0.4711275404 |
| 2018-06-24T12:05:00Z | -0.8770454978 |
| 2018-06-24T12:06:00Z |  1.3174573347 |
| 2018-06-24T12:07:00Z | -1.9730696643 |
| 2018-06-24T12:08:00Z | -1.1199236554 |
| 2018-06-24T12:09:00Z |  2.8043757212 |
| 2018-06-24T12:10:00Z |  2.8478694533 |
| 2018-06-24T12:11:00Z |  2.1893985296 |
| 2018-06-24T12:12:00Z | -2.7959592806 |

{{% /expand %}}

{{% expand "Calculate the arctangent of values associated with each field key in a measurement divided by field_key_a" %}}

Return the arctangents of all numeric field values in the `data` measurement divided by values in the `a` field key.
The `data` measurement has two numeric fields: `a` and `b`.

```sql
SELECT ATAN2(*, "a") FROM "data" WHERE time >= '2018-06-24T00:00:00Z' AND time <= '2018-06-25T00:00:00Z'
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |       atan2_a |       atan2_b |
| :------------------- | ------------: | ------------: |
| 2018-06-24T12:00:00Z |  0.7853981634 | -0.1216016371 |
| 2018-06-24T12:01:00Z | -2.3561944902 |  2.9665795168 |
| 2018-06-24T12:02:00Z | -2.3561944902 | -2.6586575715 |
| 2018-06-24T12:03:00Z | -2.3561944902 | -3.0996498311 |
| 2018-06-24T12:04:00Z | -2.3561944902 |  2.0419238672 |
| 2018-06-24T12:05:00Z | -2.3561944902 |  2.4478418246 |
| 2018-06-24T12:06:00Z |  0.7853981634 |  0.2533389921 |
| 2018-06-24T12:07:00Z | -2.3561944902 | -2.7393193161 |
| 2018-06-24T12:08:00Z | -2.3561944902 |  2.6907199822 |
| 2018-06-24T12:09:00Z |  0.7853981634 | -1.2335793944 |
| 2018-06-24T12:10:00Z |  0.7853981634 | -1.2770731265 |
| 2018-06-24T12:11:00Z |  0.7853981634 | -0.6186022028 |
| 2018-06-24T12:12:00Z | -2.3561944902 | -1.9164296997 |

{{% /expand %}}

{{% expand "Calculate the arctangents of field values and include several clauses" %}}

Return the arctangent of field values associated with the `a` field key divided
by the `b` field key in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2018-05-16T12:10:00Z` and `2018-05-16T12:10:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

```sql
SELECT ATAN2("a", "b") FROM "data" WHERE time >= '2018-06-24T00:00:00Z' AND time <= '2018-06-25T00:00:00Z' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |         atan2 |
| :------------------- | ------------: |
| 2018-06-24T23:58:00Z |  0.0166179004 |
| 2018-06-24T23:57:00Z | -2.3211306482 |
| 2018-06-24T23:56:00Z |  1.8506549463 |
| 2018-06-24T23:55:00Z | -0.0768444917 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT ATAN2(<function()>, <function()>) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `ATAN2()` function to those results.

`ATAN2()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate arctangents of mean values" %}}

Return the arctangents of [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `a`s divided by average `b`s. Averages are calculated at 2-hour intervals.

```sql
SELECT ATAN2(MEAN("b"), MEAN("a")) FROM "data" WHERE time >= '2018-06-24T12:00:00Z' AND time <= '2018-06-25T00:00:00Z' GROUP BY time(2h)
```

{{% influxql/table-meta %}}
name: data
{{% /influxql/table-meta %}}

| time                 |         atan2 |
| :------------------- | ------------: |
| 2018-06-24T12:00:00Z | -0.8233039154 |
| 2018-06-24T14:00:00Z |  1.6676707651 |
| 2018-06-24T16:00:00Z |  2.3853882606 |
| 2018-06-24T18:00:00Z | -1.0180694195 |
| 2018-06-24T20:00:00Z | -0.2601965301 |
| 2018-06-24T22:00:00Z |  2.1893237434 |
| 2018-06-25T00:00:00Z | -2.5572285037 |

{{% /expand %}}

{{< /expand-wrapper >}}

## CEIL()

Returns the subsequent value rounded up to the nearest integer.

### Basic syntax

```sql
SELECT CEIL( [ * | <field_key> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`CEIL(field_key)`  
Returns the field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key) rounded up to the nearest integer.

`CEIL(*)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement) rounded up to the nearest integer.

`CEIL()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `CEIL()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'
``` 

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Calculate the ceiling of field values associated with a field key" %}}

Return field values in the `water_level` field key in the `h2o_feet` measurement rounded up to the nearest integer.

```sql
SELECT CEIL("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |         ceil |
| :------------------- | -----------: |
| 2019-08-17T00:00:00Z | 3.0000000000 |
| 2019-08-17T00:06:00Z | 3.0000000000 |
| 2019-08-17T00:12:00Z | 3.0000000000 |
| 2019-08-17T00:18:00Z | 3.0000000000 |
| 2019-08-17T00:24:00Z | 3.0000000000 |
| 2019-08-17T00:30:00Z | 3.0000000000 |

{{% /expand %}}

{{% expand "Calculate the ceiling of field values associated with each field key in a measurement" %}}

Return field values for each field key that stores numeric values in the `h2o_feet`
measurement rounded up to the nearest integer.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT CEIL(*) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' 
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | ceil_water_level |
| :------------------- | ---------------: |
| 2019-08-17T00:00:00Z |     3.0000000000 |
| 2019-08-17T00:06:00Z |     3.0000000000 |
| 2019-08-17T00:12:00Z |     3.0000000000 |
| 2019-08-17T00:18:00Z |     3.0000000000 |
| 2019-08-17T00:24:00Z |     3.0000000000 |
| 2019-08-17T00:30:00Z |     3.0000000000 |

{{% /expand %}}

{{% expand "Calculate the ceiling of field values associated with a field key and include several clauses" %}}

Return field values associated with the `water_level` field key rounded up to the
nearest integer in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

```sql
SELECT CEIL("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |         ceil |
| :------------------- | -----------: |
| 2019-08-17T00:18:00Z | 3.0000000000 |
| 2019-08-17T00:12:00Z | 3.0000000000 |
| 2019-08-17T00:06:00Z | 3.0000000000 |
| 2019-08-17T00:00:00Z | 3.0000000000 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT CEIL(<function>( [ * | <field_key> | /<regular_expression>/ ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `CEIL()` function to those results.

`CEIL()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate mean values rounded up to the nearest integer" %}}

Return the [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `water_level`s that are calculated at 12-minute intervals and rounds them up to the nearest integer.

```sql
SELECT CEIL(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |         ceil |
| :------------------- | -----------: |
| 2019-08-17T00:00:00Z | 3.0000000000 |
| 2019-08-17T00:12:00Z | 3.0000000000 |
| 2019-08-17T00:24:00Z | 3.0000000000 |

{{% /expand %}}

{{< /expand-wrapper >}}

## COS()

Returns the cosine of the field value.

### Basic syntax

```sql
SELECT COS( [ * | <field_key> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`COS(field_key)`  
Returns the cosine of field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

`COS(*)`  
Returns the cosine of field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`COS()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `COS()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Calculate the cosine of field values associated with a field key" %}}

Return the cosine of field values in the `water_level` field key in the `h2o_feet` measurement.

```sql
SELECT COS("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |           cos |
| :------------------- | ------------: |
| 2019-08-18T00:00:00Z | -0.7041346171 |
| 2019-08-18T00:06:00Z | -0.7230474420 |
| 2019-08-18T00:12:00Z | -0.6977155876 |
| 2019-08-18T00:18:00Z | -0.6876182920 |
| 2019-08-18T00:24:00Z | -0.6390047316 |
| 2019-08-18T00:30:00Z | -0.6413094611 |

{{% /expand %}}

{{% expand "Calculate the cosine of field values associated with each field key in a measurement" %}}

Return the cosine of field values for each numeric field in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT COS(*) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | cos_water_level |
| :------------------- | --------------: |
| 2019-08-18T00:00:00Z |   -0.7041346171 |
| 2019-08-18T00:06:00Z |   -0.7230474420 |
| 2019-08-18T00:12:00Z |   -0.6977155876 |
| 2019-08-18T00:18:00Z |   -0.6876182920 |
| 2019-08-18T00:24:00Z |   -0.6390047316 |
| 2019-08-18T00:30:00Z |   -0.6413094611 |

{{% /expand %}}

{{% expand "Calculate the cosine of field values associated with a field key and include several clauses" %}}

Return the cosine of field values associated with the `water_level` field key
in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

```sql
SELECT COS("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |           cos |
| :------------------- | ------------: |
| 2019-08-18T00:18:00Z | -0.6876182920 |
| 2019-08-18T00:12:00Z | -0.6977155876 |
| 2019-08-18T00:06:00Z | -0.7230474420 |
| 2019-08-18T00:00:00Z | -0.7041346171 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT COS(<function>( [ * | <field_key> ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `COS()` function to those results.

`COS()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the cosine of mean values" %}}

Return the cosine of [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `water_level`s that are calculated at 12-minute intervals.

```sql
SELECT COS(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                  |   cos |
| ----                  |   --- |
| 2019-08-18T00:00:00Z  |   -0.7136560605 |
| 2019-08-18T00:12:00Z  |   -0.6926839105 |
| 2019-08-18T00:24:00Z  |   -0.6401578165 |

{{% /expand %}}

{{< /expand-wrapper >}}

## CUMULATIVE_SUM()

Returns the running total of subsequent [field values](/influxdb/v2.6/reference/glossary/#field-value).

### Basic syntax

```sql
SELECT CUMULATIVE_SUM( [ * | <field_key> | /<regular_expression>/ ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`CUMULATIVE_SUM(field_key)`  
Returns the running total of subsequent field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

`CUMULATIVE_SUM(/regular_expression/)`  
Returns the running total of subsequent field values associated with each field key that matches the [regular expression](/influxdb/v2.6/query-data/influxql/explore-data/regular-expressions/).

`CUMULATIVE_SUM(*)`  
Returns the running total of subsequent field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`CUMULATIVE_SUM()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `CUMULATIVE_SUM()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Calculate the cumulative sum of the field values associated with a field key" %}}

Return the running total of the field values in the `water_level` field key and in the `h2o_feet` measurement.

```sql
SELECT CUMULATIVE_SUM("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | cumulative_sum |
| :------------------- | -------------: |
| 2019-08-18T00:00:00Z |   2.3520000000 |
| 2019-08-18T00:06:00Z |   4.7310000000 |
| 2019-08-18T00:12:00Z |   7.0740000000 |
| 2019-08-18T00:18:00Z |   9.4030000000 |
| 2019-08-18T00:24:00Z |  11.6670000000 |
| 2019-08-18T00:30:00Z |  13.9340000000 |

{{% /expand %}}

{{% expand "Calculate the cumulative sum of the field values associated with each field key in a measurement" %}}

Return the running total of the field values for each numeric field in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT CUMULATIVE_SUM(*) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | cumulative_sum_water_level |
| :------------------- | -------------------------: |
| 2019-08-18T00:00:00Z |               2.3520000000 |
| 2019-08-18T00:06:00Z |               4.7310000000 |
| 2019-08-18T00:12:00Z |               7.0740000000 |
| 2019-08-18T00:18:00Z |               9.4030000000 |
| 2019-08-18T00:24:00Z |              11.6670000000 |
| 2019-08-18T00:30:00Z |              13.9340000000 |

{{% /expand %}}

{{% expand "Calculate the cumulative sum of the field values associated with each field key that matches a regular expression" %}}

Return the running total of the field values for each field key that stores
numeric values and includes the word `water` in the `h2o_feet` measurement.

```sql
SELECT CUMULATIVE_SUM(/water/) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | cumulative_sum_water_level |
| :------------------- | -------------------------: |
| 2019-08-18T00:00:00Z |               2.3520000000 |
| 2019-08-18T00:06:00Z |               4.7310000000 |
| 2019-08-18T00:12:00Z |               7.0740000000 |
| 2019-08-18T00:18:00Z |               9.4030000000 |
| 2019-08-18T00:24:00Z |              11.6670000000 |
| 2019-08-18T00:30:00Z |              13.9340000000 |

{{% /expand %}}

{{% expand "Calculate the cumulative sum of the field values associated with a field key and include several clauses" %}}

Return the running total of the field values associated with the `water_level`
field key in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

```sql
SELECT CUMULATIVE_SUM("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | cumulative_sum |
| :------------------- | -------------: |
| 2019-08-18T00:18:00Z |   6.8600000000 |
| 2019-08-18T00:12:00Z |   9.2030000000 |
| 2019-08-18T00:06:00Z |  11.5820000000 |
| 2019-08-18T00:00:00Z |  13.9340000000 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT CUMULATIVE_SUM(<function>( [ * | <field_key> | /<regular_expression>/ ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `CUMULATIVE_SUM()` function to those results.

`CUMULATIVE_SUM()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the cumulative sum of mean values" %}}

Return the running total of [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `water_level`s that are calculated at 12-minute intervals.

```sql
SELECT CUMULATIVE_SUM(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | cumulative_sum |
| :------------------- | -------------: |
| 2019-08-18T00:00:00Z |   2.3655000000 |
| 2019-08-18T00:12:00Z |   4.7015000000 |
| 2019-08-18T00:24:00Z |   6.9670000000 |

{{% /expand %}}

{{< /expand-wrapper >}}

## DERIVATIVE()

Returns the rate of change between subsequent [field values](/influxdb/v2.6/reference/glossary/#field-value).

### Basic syntax

```sql
SELECT DERIVATIVE( [ * | <field_key> | /<regular_expression>/ ] [ , <unit> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

InfluxDB calculates the difference between subsequent field values and converts those results into the rate of change per `unit`.
The `unit` argument is an integer followed by a [duration](/influxdb/v2.6/reference/glossary/#duration) and it is optional.
If the query does not specify the `unit` the unit defaults to one second (`1s`).

`DERIVATIVE(field_key)`  
Returns the rate of change between subsequent field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

`DERIVATIVE(/regular_expression/)`  
Returns the rate of change between subsequent field values associated with each field key that matches the [regular expression](/influxdb/v2.6/query-data/influxql/explore-data/regular-expressions/).

`DERIVATIVE(*)`  
Returns the rate of change between subsequent field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`DERIVATIVE()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `DERIVATIVE()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples in this section use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Calculate the derivative between the field values associated with a field key" %}}

Return the one-second rate of change between the `water_level` field values in the `h2o_feet` measurement.

```sql
SELECT DERIVATIVE("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |    derivative |
| :------------------- | ------------: |
| 2019-08-18T00:06:00Z |  0.0000750000 |
| 2019-08-18T00:12:00Z | -0.0001000000 |
| 2019-08-18T00:18:00Z | -0.0000388889 |
| 2019-08-18T00:24:00Z | -0.0001805556 |
| 2019-08-18T00:30:00Z |  0.0000083333 |

The first result (`0.0000750000`) is the one-second rate of change between the first two subsequent field values in the raw data. InfluxDB calculates the difference between the field values (subtracts the first field value from the second field value) and then normalizes that value to the one-second rate of change (dividing the difference between the field values' timestamps in seconds (`360s`) by the default unit (`1s`)):

```
(2.379 - 2.352) / (360s / 1s)
```

{{% /expand %}}

{{% expand "Calculate the derivative between the field values associated with a field key and specify the unit option" %}}

Return the six-minute rate of change between the field values in the `water_level` field in the `h2o_feet` measurement.

```sql
SELECT DERIVATIVE("water_level",6m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |    derivative |
| :------------------- | ------------: |
| 2019-08-18T00:06:00Z |  0.0270000000 |
| 2019-08-18T00:12:00Z | -0.0360000000 |
| 2019-08-18T00:18:00Z | -0.0140000000 |
| 2019-08-18T00:24:00Z | -0.0650000000 |
| 2019-08-18T00:30:00Z |  0.0030000000 |

The first result (`0.0270000000`) is the six-minute rate of change between the first two subsequent field values in the raw data. InfluxDB calculates the difference between the field values (subtracts the first field value from the second field value) and then normalizes that value to the six-minute rate of change (dividing the difference between the field values' timestamps in minutes (`6m`) by the specified interval (`6m`)):

```
(2.379 - 2.352) / (6m / 6m)
```

{{% /expand %}}

{{% expand "Calculate the derivative between the field values associated with each field key in a measurement and specify the unit option" %}}

Returns three-minute rate of change between the field values associated with each field key that stores numeric values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT DERIVATIVE(*,3m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | derivative_water_level |
| :------------------- | ---------------------: |
| 2019-08-18T00:06:00Z |           0.0135000000 |
| 2019-08-18T00:12:00Z |          -0.0180000000 |
| 2019-08-18T00:18:00Z |          -0.0070000000 |
| 2019-08-18T00:24:00Z |          -0.0325000000 |
| 2019-08-18T00:30:00Z |           0.0015000000 |

The first result (`0.0135000000`) is the three-minute rate of change between the first two subsequent field values in the raw data.

InfluxDB calculates the difference between the field values (subtracts the first field value from the second field value) and then normalizes that value to the three-minute rate of change (dividing the difference between the field values' timestamps in minutes (`6m`) by the specified interval (`3m`)):

```
(2.379 - 2.352) / (6m / 3m)
```

{{% /expand %}}

{{% expand "Calculate the derivative between the field values associated with each field key that matches a regular expression and specify the unit option" %}}

Return the two-minute rate of change between the field values associated with
each field key that stores numeric values and includes the word `water` in the
`h2o_feet` measurement.

```sql
SELECT DERIVATIVE(/water/,2m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | derivative_water_level |
| :------------------- | ---------------------: |
| 2019-08-18T00:06:00Z |           0.0090000000 |
| 2019-08-18T00:12:00Z |          -0.0120000000 |
| 2019-08-18T00:18:00Z |          -0.0046666667 |
| 2019-08-18T00:24:00Z |          -0.0216666667 |
| 2019-08-18T00:30:00Z |           0.0010000000 |

The first result (`0.0090000000`) is the two-minute rate of change between the first two subsequent field values in the raw data.

InfluxDB calculates the difference between the field values (subtracts the first field value from the second field value) and then normalizes that value to the three-minute rate of change (dividing the difference between the field values' timestamps in minutes (`6m`) by the specified interval (`2m`)):

```
(2.379 - 2.352)  / (6m / 2m)
```

{{% /expand %}}

{{% expand "Calculate the derivative between the field values associated with a field key and include several clauses" %}}

Return the one-second rate of change between `water_level` field values in the
`h2o_feet` measurement in [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to one and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

```sql
SELECT DERIVATIVE("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' ORDER BY time DESC LIMIT 1 OFFSET 2
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | derivative   |
| -------------------- | ------------ |
| 2019-08-18T00:12:00Z | 0.0000388889 |

The only result (`0.0000388889`) is the one-second rate of change between the relevant subsequent field values in the raw data. InfluxDB calculates the difference between the field values (subtracts the first field value from the second field value) and then normalizes that value to the one-second rate of change (dividing the difference between the field values' timestamps in seconds (`360`) by the specified rate of change (`1s`)):

```
(2.379 - 2.352) / (360s / 1s)
```

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT DERIVATIVE(<function> ([ * | <field_key> | /<regular_expression>/ ]) [ , <unit> ] ) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time()` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `DERIVATIVE()` function to those results.

The `unit` argument is an integer followed by a [duration](//influxdb/v2.6/reference/glossary/#duration) and it is optional.
If the query does not specify the `unit` the `unit` defaults to the `GROUP BY time()` interval.
Note that this behavior is different from the [basic syntax's](#basic-syntax-1) default behavior.

`DERIVATIVE()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples
{{< expand-wrapper >}}

{{% expand "Calculate the derivative of mean values" %}}

Return the 12-minute rate of change between [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `water_level`s that are calculated at 12-minute intervals.

```sql
SELECT DERIVATIVE(MEAN("water_level")) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |    derivative |
| :------------------- | ------------: |
| 2019-08-18T00:00:00Z | -0.1375000000 |
| 2019-08-18T00:12:00Z | -0.0295000000 |
| 2019-08-18T00:24:00Z | -0.0705000000 |

{{% /expand %}}

{{% expand "Calculate the derivative of mean values and specify the unit option" %}}

Return the six-minute rate of change between average `water_level`s that are calculated at 12-minute intervals.

```sql
SELECT DERIVATIVE(MEAN("water_level"),6m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |    derivative |
| :------------------- | ------------: |
| 2019-08-18T00:00:00Z | -0.0687500000 |
| 2019-08-18T00:12:00Z | -0.0147500000 |
| 2019-08-18T00:24:00Z | -0.0352500000 |

{{% /expand %}}

{{< /expand-wrapper >}}

## DIFFERENCE()

Returns the result of subtraction between subsequent [field values](/influxdb/v2.6/reference/glossary/#field-value).

### Syntax

```sql
SELECT DIFFERENCE( [ * | <field_key> | /<regular_expression>/ ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`DIFFERENCE(field_key)`  
Returns the difference between subsequent field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

`DIFFERENCE(/regular_expression/)`  
Returns the difference between subsequent field values associated with each field key that matches the [regular expression](/influxdb/v2.6/query-data/influxql/explore-data/regular-expressions/).

`DIFFERENCE(*)`  
Returns the difference between subsequent field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`DIFFERENCE()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `DIFFERENCE()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Calculate the difference between the field values associated with a field key" %}}

Return the difference between the subsequent field values in the `water_level` field key and in the `h2o_feet` measurement.

```sql
SELECT DIFFERENCE("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |    difference |
| :------------------- | ------------: |
| 2019-08-18T00:06:00Z |  0.0270000000 |
| 2019-08-18T00:12:00Z | -0.0360000000 |
| 2019-08-18T00:18:00Z | -0.0140000000 |
| 2019-08-18T00:24:00Z | -0.0650000000 |
| 2019-08-18T00:30:00Z |  0.0030000000 |

{{% /expand %}}

{{% expand "Calculate the difference between the field values associated with each field key in a measurement" %}}

Return the difference between the subsequent field values for each field key
that stores numeric values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT DIFFERENCE(*) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | difference_water_level |
| :------------------- | ---------------------: |
| 2019-08-18T00:06:00Z |           0.0270000000 |
| 2019-08-18T00:12:00Z |          -0.0360000000 |
| 2019-08-18T00:18:00Z |          -0.0140000000 |
| 2019-08-18T00:24:00Z |          -0.0650000000 |
| 2019-08-18T00:30:00Z |           0.0030000000 |

{{% /expand %}}

{{% expand "Calculate the difference between the field values associated with each field key that matches a regular expression" %}}

Return the difference between the subsequent field values for each field key
that stores numeric values and includes the word `water` in the `h2o_feet` measurement.

```sql
SELECT DIFFERENCE(/water/) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | difference_water_level |
| :------------------- | ---------------------: |
| 2019-08-18T00:06:00Z |           0.0270000000 |
| 2019-08-18T00:12:00Z |          -0.0360000000 |
| 2019-08-18T00:18:00Z |          -0.0140000000 |
| 2019-08-18T00:24:00Z |          -0.0650000000 |
| 2019-08-18T00:30:00Z |           0.0030000000 |

{{% /expand %}}

{{% expand "Calculate the difference between the field values associated with a field key and include several clauses" %}}

```sql
SELECT DIFFERENCE("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 2 OFFSET 2
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |   difference |
| :------------------- | -----------: |
| 2019-08-18T00:12:00Z | 0.0140000000 |
| 2019-08-18T00:06:00Z | 0.0360000000 |

Return the difference between the subsequent field values in the `water_level`
field key in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
They query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to two and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT DIFFERENCE(<function>( [ * | <field_key> | /<regular_expression>/ ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `DIFFERENCE()` function to those results.

`DIFFERENCE()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the difference between maximum values" %}}

Return the difference between [maximum](/influxdb/v2.6/query-data/influxql/functions/selectors/#max) `water_level`s that are calculated at 12-minute intervals.

```sql
SELECT DIFFERENCE(MAX("water_level")) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |    difference |
| :------------------- | ------------: |
| 2019-08-18T00:00:00Z | -0.2290000000 |
| 2019-08-18T00:12:00Z | -0.0360000000 |
| 2019-08-18T00:24:00Z | -0.0760000000 |

{{% /expand %}}

{{< /expand-wrapper >}}

## ELAPSED()

Returns the difference between subsequent [field value's](/influxdb/v2.6/reference/glossary/#field-value) timestamps.

### Syntax

```sql
SELECT ELAPSED( [ * | <field_key> | /<regular_expression>/ ] [ , <unit> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

InfluxDB calculates the difference between subsequent timestamps.
The `unit` option is an integer followed by a [duration](/influxdb/v2.6/reference/glossary/#duration) and it determines the unit of the returned difference.
If the query does not specify the `unit` option the query returns the difference between timestamps in nanoseconds.

`ELAPSED(field_key)`  
Returns the difference between subsequent timestamps associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

`ELAPSED(/regular_expression/)`  
Returns the difference between subsequent timestamps associated with each field key that matches the [regular expression](/influxdb/v2.6/query-data/influxql/explore-data/regular-expressions/).

`ELAPSED(*)`  
Returns the difference between subsequent timestamps associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`ELAPSED()` supports all field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

#### Examples

The examples use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:12:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |

{{< expand-wrapper >}}

{{% expand "Calculate the elapsed time between field values associated with a field key" %}}

Return the elapsed time (in nanoseconds) between subsequent timestamps in the `water_level` field key and in the `h2o_feet` measurement.

```sql
SELECT ELAPSED("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:12:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |                 elapsed |
| :------------------- | ----------------------: |
| 2019-08-18T00:06:00Z | 360000000000.0000000000 |
| 2019-08-18T00:12:00Z | 360000000000.0000000000 |

{{% /expand %}}

{{% expand "Calculate the elapsed time between field values associated with a field key and specify the unit option" %}}

Return the elapsed time (in minutes) between subsequent timestamps in the `water_level` field key and in the `h2o_feet` measurement.

```sql
SELECT ELAPSED("water_level",1m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:12:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |      elapsed |
| :------------------- | -----------: |
| 2019-08-18T00:06:00Z | 6.0000000000 |
| 2019-08-18T00:12:00Z | 6.0000000000 |

{{% /expand %}}

{{% expand "Calculate the elapsed time between field values associated with each field key in a measurement and specify the unit option" %}}

Return the difference (in minutes) between subsequent timestamps associated with
each field key in the `h2o_feet`measurement.
The `h2o_feet` measurement has two field keys: `level description` and `water_level`.

```sql
SELECT ELAPSED(*,1m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:12:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | elapsed_level description | elapsed_water_level |
| :------------------- | ------------------------: | ------------------: |
| 2019-08-18T00:06:00Z |              6.0000000000 |        6.0000000000 |
| 2019-08-18T00:12:00Z |              6.0000000000 |        6.0000000000 |

{{% /expand %}}

{{% expand "Calculate the elapsed time between field values associated with each field key that matches a regular expression and specify the unit option" %}}

Return the difference (in seconds) between subsequent timestamps associated with
each field key that includes the word `level` in the `h2o_feet` measurement.

```sql
SELECT ELAPSED(/level/,1s) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:12:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | elapsed_level description | elapsed_water_level |
| :------------------- | ------------------------: | ------------------: |
| 2019-08-18T00:06:00Z |            360.0000000000 |      360.0000000000 |
| 2019-08-18T00:12:00Z |            360.0000000000 |      360.0000000000 |

{{% /expand %}}

{{% expand "Calculate the elapsed time between field values associated with a field key and include several clauses" %}}

Return the difference (in milliseconds) between subsequent timestamps in the
`water_level` field key and in the `h2o_feet` measurement in the
[time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-17T00:00:00Z` and `2019-08-17T00:12:00Z` with timestamps in
[descending order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to one and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by one point.

```sql
SELECT ELAPSED("water_level",1ms) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:12:00Z' ORDER BY time DESC LIMIT 1 OFFSET 1
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |            elapsed |
| :------------------- | -----------------: |
| 2019-08-18T00:00:00Z | -360000.0000000000 |

Notice that the result is negative; the [`ORDER BY time DESC` clause](/influxdb/v2.6/query-data/influxql/explore-data/order-by/) sorts timestamps in descending order so `ELAPSED()` calculates the difference between timestamps in reverse order.

{{% /expand %}}

{{< /expand-wrapper >}}

### Common issues with ELAPSED()

#### ELAPSED() and units greater than the elapsed time

InfluxDB returns `0` if the `unit` option is greater than the difference between the timestamps.

##### Example

The timestamps in the `h2o_feet` measurement occur at six-minute intervals.
If the query sets the `unit` option to one hour, InfluxDB returns `0`:

```sql
SELECT ELAPSED("water_level",1h) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:12:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |      elapsed |
| :------------------- | -----------: |
| 2019-08-18T00:06:00Z | 0.0000000000 |
| 2019-08-18T00:12:00Z | 0.0000000000 |

#### ELAPSED() with GROUP BY time() clauses

The `ELAPSED()` function supports the [`GROUP BY time()` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) but the query results aren't particularly useful.
Currently, an `ELAPSED()` query with a nested function and a `GROUP BY time()` clause simply returns the interval specified in the `GROUP BY time()` clause.

The `GROUP BY time()` clause determines the timestamps in the results; each timestamp marks the start of a time interval.
That behavior also applies to nested selector functions (like [`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first) or [`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max)) which would, in all other cases, return a specific timestamp from the raw data.
Because the `GROUP BY time()` clause overrides the original timestamps, the `ELAPSED()` calculation always returns the same value as the `GROUP BY time()` interval.

##### Example

In the codeblock below, the first query attempts to use the `ELAPSED()` function with a `GROUP BY time()` clause to find the time elapsed (in minutes) between [minimum](/influxdb/v2.6/query-data/influxql/functions/selectors/#min) `water_level`s.
Returns 12 minutes for both time intervals.

To get those results, InfluxDB first calculates the minimum `water_level`s at 12-minute intervals.
The second query in the codeblock shows the results of that step.
The step is the same as using the `MIN()` function with the `GROUP BY time()` clause and without the `ELAPSED()` function.
Notice that the timestamps returned by the second query are 12 minutes apart.
In the raw data, the first result (`2.0930000000`) occurs at `2019-08-18T00:42:00Z` but the `GROUP BY time()` clause overrides that original timestamp.
Because the timestamps are determined by the `GROUP BY time()` interval and not by the original data, the `ELAPSED()` calculation always returns the same value as the `GROUP BY time()` interval.

```sql
SELECT ELAPSED(MIN("water_level"),1m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:36:00Z' AND time <= '2019-08-18T00:54:00Z' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |       elapsed |
| :------------------- | ------------: |
| 2019-08-18T00:36:00Z | 12.0000000000 |
| 2019-08-18T00:48:00Z | 12.0000000000 |

```sql
SELECT MIN("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:36:00Z' AND time <= '2019-08-18T00:54:00Z' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | min          |
| -------------------- | ------------ |
| 2019-08-18T00:36:00Z | 2.0930000000 |
| 2019-08-18T00:48:00Z | 2.0870000000 |

{{% note %}}
The first point actually occurs at 2019-08-18T00:42:00Z, not 2019-08-18T00:36:00Z.
{{% /note %}}

## EXP()

Returns the exponential of the field value.

### Syntax

```sql
SELECT EXP( [ * | <field_key> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`EXP(field_key)`  
Returns the exponential of field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

<!-- `EXP(/regular_expression/)`  
Returns the exponential of field values associated with each field key that matches the [regular expression](/influxdb/v2.6/query-data/influxql/explore-data/regular-expressions/). -->

`EXP(*)`  
Returns the exponential of field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`EXP()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `EXP()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Calculate the exponential of field values associated with a field key" %}}

Return the exponential of field values in the `water_level` field key in the `h2o_feet` measurement.

```sql
SELECT EXP("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |           exp |
| :------------------- | ------------: |
| 2019-08-18T00:00:00Z | 10.5065618493 |
| 2019-08-18T00:06:00Z | 10.7941033617 |
| 2019-08-18T00:12:00Z | 10.4124270347 |
| 2019-08-18T00:18:00Z | 10.2676687288 |
| 2019-08-18T00:24:00Z |  9.6214982905 |
| 2019-08-18T00:30:00Z |  9.6504061254 |

{{% /expand %}}

{{% expand "Calculate the exponential of field values associated with each field key in a measurement" %}}

Return the exponential of field values for each field key that stores numeric
values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT EXP(*) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | exp_water_level |
| :------------------- | --------------: |
| 2019-08-18T00:00:00Z |   10.5065618493 |
| 2019-08-18T00:06:00Z |   10.7941033617 |
| 2019-08-18T00:12:00Z |   10.4124270347 |
| 2019-08-18T00:18:00Z |   10.2676687288 |
| 2019-08-18T00:24:00Z |    9.6214982905 |
| 2019-08-18T00:30:00Z |    9.6504061254 |

{{% /expand %}}

{{% expand "Calculate the exponential of field values associated with a field key and include several clauses" %}}

```sql
SELECT EXP("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |           exp |
| :------------------- | ------------: |
| 2019-08-18T00:18:00Z | 10.2676687288 |
| 2019-08-18T00:12:00Z | 10.4124270347 |
| 2019-08-18T00:06:00Z | 10.7941033617 |
| 2019-08-18T00:00:00Z | 10.5065618493 |

Return the exponentials of field values associated with the `water_level` field key in
the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT EXP(<function>( [ * | <field_key> ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `EXP()` function to those results.

`EXP()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the exponential of mean values" %}}

Return the exponential of [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `water_level`s that are calculated at 12-minute intervals.

```sql
SELECT EXP(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |           exp |
| :------------------- | ------------: |
| 2019-08-18T00:00:00Z | 10.6493621676 |
| 2019-08-18T00:12:00Z | 10.3397945558 |
| 2019-08-18T00:24:00Z |  9.6359413675 |

{{% /expand %}}

{{< /expand-wrapper >}}

## FLOOR()

Returns the subsequent value rounded down to the nearest integer.

### Syntax

```sql
SELECT FLOOR( [ * | <field_key> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`FLOOR(field_key)`  
Returns the field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key) rounded down to the nearest integer.

`FLOOR(*)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement) rounded down to the nearest integer.

`FLOOR()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `FLOOR()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Calculate the floor of field values associated with a field key" %}}

Return field values in the `water_level` field key in the `h2o_feet` measurement rounded down to the nearest integer.

```sql
SELECT FLOOR("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |        floor |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.0000000000 |
| 2019-08-18T00:06:00Z | 2.0000000000 |
| 2019-08-18T00:12:00Z | 2.0000000000 |
| 2019-08-18T00:18:00Z | 2.0000000000 |
| 2019-08-18T00:24:00Z | 2.0000000000 |
| 2019-08-18T00:30:00Z | 2.0000000000 |

{{% /expand %}}

{{% expand "Calculate the floor of field values associated with each field key in a measurement" %}}

Return field values for each field key that stores numeric values in the
`h2o_feet` measurement rounded down to the nearest integer.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT FLOOR(*) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | floor_water_level |
| :------------------- | ----------------: |
| 2019-08-18T00:00:00Z |      2.0000000000 |
| 2019-08-18T00:06:00Z |      2.0000000000 |
| 2019-08-18T00:12:00Z |      2.0000000000 |
| 2019-08-18T00:18:00Z |      2.0000000000 |
| 2019-08-18T00:24:00Z |      2.0000000000 |
| 2019-08-18T00:30:00Z |      2.0000000000 |

{{% /expand %}}

{{% expand "Calculate the floor of field values associated with a field key and include several clauses" %}}

Return field values associated with the `water_level` field key rounded down to
the nearest integer in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

```sql
SELECT FLOOR("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |        floor |
| :------------------- | -----------: |
| 2019-08-18T00:18:00Z | 2.0000000000 |
| 2019-08-18T00:12:00Z | 2.0000000000 |
| 2019-08-18T00:06:00Z | 2.0000000000 |
| 2019-08-18T00:00:00Z | 2.0000000000 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT FLOOR(<function>( [ * | <field_key> ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `FLOOR()` function to those results.

`FLOOR()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate mean values rounded down to the nearest integer" %}}

Return the [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `water_level`s that are calculated at 12-minute intervals and rounds them up to the nearest integer.

```sql
SELECT FLOOR(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |        floor |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.0000000000 |
| 2019-08-18T00:12:00Z | 2.0000000000 |
| 2019-08-18T00:24:00Z | 2.0000000000 |

{{% /expand %}}

{{< /expand-wrapper >}}

## HISTOGRAM()

_InfluxQL does not currently support histogram generation.
For information about creating histograms with data stored in InfluxDB, see
[Flux's `histogram()` function](/{{< latest "flux" >}}/stdlib/universe/histogram)._

## LN()

Returns the natural logarithm of the field value.

### Syntax

```sql
SELECT LN( [ * | <field_key> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`LN(field_key)`  
Returns the natural logarithm of field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

`LN(*)`  
Returns the natural logarithm of field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`LN()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `LN()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Calculate the natural logarithm of field values associated with a field key" %}}

Return the natural logarithm of field values in the `water_level` field key in the `h2o_feet` measurement.

```sql
SELECT LN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |           ln |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 0.8552660300 |
| 2019-08-18T00:06:00Z | 0.8666802313 |
| 2019-08-18T00:12:00Z | 0.8514321595 |
| 2019-08-18T00:18:00Z | 0.8454389909 |
| 2019-08-18T00:24:00Z | 0.8171331603 |
| 2019-08-18T00:30:00Z | 0.8184573715 |

{{% /expand %}}

{{% expand "Calculate the natural logarithm of field values associated with each field key in a measurement" %}}

Return the natural logarithm of field values for each field key that stores
numeric values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT LN(*) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | ln_water_level |
| :------------------- | -------------: |
| 2019-08-18T00:00:00Z |   0.8552660300 |
| 2019-08-18T00:06:00Z |   0.8666802313 |
| 2019-08-18T00:12:00Z |   0.8514321595 |
| 2019-08-18T00:18:00Z |   0.8454389909 |
| 2019-08-18T00:24:00Z |   0.8171331603 |
| 2019-08-18T00:30:00Z |   0.8184573715 |

{{% /expand %}}

{{% expand "Calculate the natural logarithm of field values associated with a field key and include several clauses" %}}

```sql
SELECT LN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |           ln |
| :------------------- | -----------: |
| 2019-08-18T00:18:00Z | 0.8454389909 |
| 2019-08-18T00:12:00Z | 0.8514321595 |
| 2019-08-18T00:06:00Z | 0.8666802313 |
| 2019-08-18T00:00:00Z | 0.8552660300 |

Return the natural logarithms of field values associated with the `water_level`
field key in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT LN(<function>( [ * | <field_key> ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `LN()` function to those results.

`LN()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the natural logarithm of mean values" %}}

Return the natural logarithm of [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `water_level`s that are calculated at 12-minute intervals.

```sql
SELECT LN(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |           ln |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 0.8609894161 |
| 2019-08-18T00:12:00Z | 0.8484400650 |
| 2019-08-18T00:24:00Z | 0.8177954851 |

{{% /expand %}}

{{< /expand-wrapper >}}

## LOG()

Returns the logarithm of the field value with base `b`.

### Basic syntax

```sql
SELECT LOG( [ * | <field_key> ], <b> ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`LOG(field_key, b)`  
Returns the logarithm of field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key) with base `b`.

`LOG(*, b)`  
Returns the logarithm of field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement) with base `b`.

`LOG()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `LOG()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Calculate the logarithm base 4 of field values associated with a field key" %}}

Return the logarithm base 4 of field values in the `water_level` field key in the `h2o_feet` measurement.

```sql
SELECT LOG("water_level", 4) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |          log |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 0.6169440301 |
| 2019-08-18T00:06:00Z | 0.6251776359 |
| 2019-08-18T00:12:00Z | 0.6141784771 |
| 2019-08-18T00:18:00Z | 0.6098553198 |
| 2019-08-18T00:24:00Z | 0.5894369791 |
| 2019-08-18T00:30:00Z | 0.5903921955 |

{{% /expand %}}

{{% expand "Calculate the logarithm base 4 of field values associated with each field key in a measurement" %}}

Return the logarithm base 4 of field values for each numeric field in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT LOG(*, 4) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | log_water_level |
| :------------------- | --------------: |
| 2019-08-18T00:00:00Z |    0.6169440301 |
| 2019-08-18T00:06:00Z |    0.6251776359 |
| 2019-08-18T00:12:00Z |    0.6141784771 |
| 2019-08-18T00:18:00Z |    0.6098553198 |
| 2019-08-18T00:24:00Z |    0.5894369791 |
| 2019-08-18T00:30:00Z |    0.5903921955 |

{{% /expand %}}

{{% expand "Calculate the logarithm base 4 of field values associated with a field key and include several clauses" %}}

Return the logarithm base 4 of field values associated with the `water_level`
field key in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

```sql
SELECT LOG("water_level", 4) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |          log |
| :------------------- | -----------: |
| 2019-08-18T00:18:00Z | 0.6098553198 |
| 2019-08-18T00:12:00Z | 0.6141784771 |
| 2019-08-18T00:06:00Z | 0.6251776359 |
| 2019-08-18T00:00:00Z | 0.6169440301 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT LOG(<function>( [ * | <field_key> ] ), <b>) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `LOG()` function to those results.

`LOG()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the logarithm base 4 of mean values" %}}

Return the logarithm base 4 of [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `water_level`s that are calculated at 12-minute intervals.

```sql
SELECT LOG(MEAN("water_level"), 4) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |          log |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 0.6210725804 |
| 2019-08-18T00:12:00Z | 0.6120201371 |
| 2019-08-18T00:24:00Z | 0.5899147454 |

{{% /expand %}}

{{< /expand-wrapper >}}

## LOG2()

Returns the logarithm of the field value to the base 2.

### Basic syntax

```sql
SELECT LOG2( [ * | <field_key> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`LOG2(field_key)`  
Returns the logarithm of field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key) to the base 2.

`LOG2(*)`  
Returns the logarithm of field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement) to the base 2.

`LOG2()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `LOG2()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Calculate the logarithm base 2 of field values associated with a field key" %}}

Return the logarithm base 2 of field values in the `water_level` field key in the `h2o_feet` measurement.

```sql
SELECT LOG2("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |         log2 |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 1.2338880602 |
| 2019-08-18T00:06:00Z | 1.2503552718 |
| 2019-08-18T00:12:00Z | 1.2283569542 |
| 2019-08-18T00:18:00Z | 1.2197106395 |
| 2019-08-18T00:24:00Z | 1.1788739582 |
| 2019-08-18T00:30:00Z | 1.1807843911 |

{{% /expand %}}

{{% expand "Calculate the logarithm base 2 of field values associated with each field key in a measurement" %}}

```sql
SELECT LOG2(*) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | log2_water_level |
| :------------------- | ---------------: |
| 2019-08-18T00:00:00Z |     1.2338880602 |
| 2019-08-18T00:06:00Z |     1.2503552718 |
| 2019-08-18T00:12:00Z |     1.2283569542 |
| 2019-08-18T00:18:00Z |     1.2197106395 |
| 2019-08-18T00:24:00Z |     1.1788739582 |
| 2019-08-18T00:30:00Z |     1.1807843911 |

Return the logarithm base 2 of field values for each numeric field in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

{{% /expand %}}

{{% expand "Calculate the logarithm base 2 of field values associated with a field key and include several clauses" %}}

Return the logarithm base 2 of field values associated with the `water_level`
field key in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

```sql
SELECT LOG2("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |         log2 |
| :------------------- | -----------: |
| 2019-08-18T00:18:00Z | 1.2197106395 |
| 2019-08-18T00:12:00Z | 1.2283569542 |
| 2019-08-18T00:06:00Z | 1.2503552718 |
| 2019-08-18T00:00:00Z | 1.2338880602 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT LOG2(<function>( [ * | <field_key> ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `LOG2()` function to those results.

`LOG2()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the logarithm base 2 of mean values" %}}

Return the logarithm base 2 of [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `water_level`s that are calculated at 12-minute intervals.

```sql
SELECT LOG2(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |         log2 |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 1.2421451608 |
| 2019-08-18T00:12:00Z | 1.2240402742 |
| 2019-08-18T00:24:00Z | 1.1798294909 |

{{% /expand %}}

{{< /expand-wrapper >}}

## LOG10()

Returns the logarithm of the field value to the base 10.

### Basic syntax

```sql
SELECT LOG10( [ * | <field_key> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`LOG10(field_key)`  
Returns the logarithm of field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key) to the base 10.

`LOG10(*)`  
Returns the logarithm of field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement) to the base 10.

`LOG10()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `LOG10()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Calculate the logarithm base 10 of field values associated with a field key" %}}

Return the logarithm base 10 of field values in the `water_level` field key in the `h2o_feet` measurement.

```sql
SELECT LOG10("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |        log10 |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 0.3714373174 |
| 2019-08-18T00:06:00Z | 0.3763944420 |
| 2019-08-18T00:12:00Z | 0.3697722886 |
| 2019-08-18T00:18:00Z | 0.3671694885 |
| 2019-08-18T00:24:00Z | 0.3548764225 |
| 2019-08-18T00:30:00Z | 0.3554515201 |

{{% /expand %}}

{{% expand "Calculate the logarithm base 10 of field values associated with each field key in a measurement" %}}

Return the logarithm base 10 of field values for each numeric field in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT LOG10(*) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | log10_water_level |
| :------------------- | ----------------: |
| 2019-08-18T00:00:00Z |      0.3714373174 |
| 2019-08-18T00:06:00Z |      0.3763944420 |
| 2019-08-18T00:12:00Z |      0.3697722886 |
| 2019-08-18T00:18:00Z |      0.3671694885 |
| 2019-08-18T00:24:00Z |      0.3548764225 |
| 2019-08-18T00:30:00Z |      0.3554515201 |

{{% /expand %}}

{{% expand "Calculate the logarithm base 10 of field values associated with a field key and include several clauses" %}}

Return the logarithm base 10 of field values associated with the `water_level`
field key in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

```sql
SELECT LOG10("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |        log10 |
| :------------------- | -----------: |
| 2019-08-18T00:18:00Z | 0.3671694885 |
| 2019-08-18T00:12:00Z | 0.3697722886 |
| 2019-08-18T00:06:00Z | 0.3763944420 |
| 2019-08-18T00:00:00Z | 0.3714373174 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT LOG10(<function>( [ * | <field_key> ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `LOG10()` function to those results.

`LOG10()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the logarithm base 10 of mean values" %}}

Return the logarithm base 10 of [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `water_level`s that are calculated at 12-minute intervals.

```sql
SELECT LOG10(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |        log10 |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 0.3739229524 |
| 2019-08-18T00:12:00Z | 0.3684728384 |
| 2019-08-18T00:24:00Z | 0.3551640665 |

{{% /expand %}}

{{< /expand-wrapper >}}

## MOVING_AVERAGE()

Returns the rolling average across a window of subsequent [field values](/influxdb/v2.6/reference/glossary/#field-value).

### Basic syntax

```sql
SELECT MOVING_AVERAGE( [ * | <field_key> | /<regular_expression>/ ] , <N> ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`MOVING_AVERAGE()` calculates the rolling average across a window of `N` subsequent field values.
The `N` argument is an integer and it is required.

`MOVING_AVERAGE(field_key,N)`  
Returns the rolling average across `N` field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

`MOVING_AVERAGE(/regular_expression/,N)`  
Returns the rolling average across `N` field values associated with each field key that matches the [regular expression](/influxdb/v2.6/query-data/influxql/explore-data/regular-expressions/).

`MOVING_AVERAGE(*,N)`  
Returns the rolling average across `N` field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`MOVING_AVERAGE()` int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `MOVING_AVERAGE()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Calculate the moving average of the field values associated with a field key" %}}

Return the rolling average across a two-field-value window for the `water_level` field key and the `h2o_feet` measurement.

```sql
SELECT MOVING_AVERAGE("water_level",2) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | moving_average |
| :------------------- | -------------: |
| 2019-08-18T00:06:00Z |   2.3655000000 |
| 2019-08-18T00:12:00Z |   2.3610000000 |
| 2019-08-18T00:18:00Z |   2.3360000000 |
| 2019-08-18T00:24:00Z |   2.2965000000 |
| 2019-08-18T00:30:00Z |   2.2655000000 |

The first result (`2.3655000000`) is the average of the first two points in the raw data: (`2.3520000000 + 2.3790000000) / 2`).
The second result (`2.3610000000`) is the average of the second two points in the raw data: (`2.3790000000 + 2.3430000000) / 2`).

{{% /expand %}}

{{% expand "Calculate the moving average of the field values associated with each field key in a measurement" %}}

Return the rolling average across a three-field-value window for each field key
that stores numeric values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT MOVING_AVERAGE(*,3) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | moving_average_water_level |
| :------------------- | -------------------------: |
| 2019-08-18T00:12:00Z |               2.3580000000 |
| 2019-08-18T00:18:00Z |               2.3503333333 |
| 2019-08-18T00:24:00Z |               2.3120000000 |
| 2019-08-18T00:30:00Z |               2.2866666667 |

{{% /expand %}}

{{% expand "Calculate the moving average of the field values associated with each field key that matches a regular expression" %}}

Return the rolling average across a four-field-value window for each numeric
field with a field key that includes the word `level` in the `h2o_feet` measurement.

```sql
SELECT MOVING_AVERAGE(/level/,4) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | moving_average_water_level |
| :------------------- | -------------------------: |
| 2019-08-18T00:18:00Z |               2.3507500000 |
| 2019-08-18T00:24:00Z |               2.3287500000 |
| 2019-08-18T00:30:00Z |               2.3007500000 |

{{% /expand %}}

{{% expand "Calculate the moving average of the field values associated with a field key and include several clauses" %}}

Return the rolling average across a two-field-value window for the `water_level`
field key in the `h2o_feet` measurement in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to two and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by three points.

```sql
SELECT MOVING_AVERAGE("water_level",2) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' ORDER BY time DESC LIMIT 2 OFFSET 3
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | moving_average |
| :------------------- | -------------: |
| 2019-08-18T00:06:00Z |   2.3610000000 |
| 2019-08-18T00:00:00Z |   2.3655000000 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT MOVING_AVERAGE(<function> ([ * | <field_key> | /<regular_expression>/ ]) , N ) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `MOVING_AVERAGE()` function to those results.

`MOVING_AVERAGE()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the moving average of maximum values" %}}

Return the rolling average across a two-value window of [maximum](/influxdb/v2.6/query-data/influxql/functions/selectors/#max) `water_level`s that are calculated at 12-minute intervals.

```sql
SELECT MOVING_AVERAGE(MAX("water_level"),2) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | moving_average |
| :------------------- | -------------: |
| 2019-08-18T00:00:00Z |   2.4935000000 |
| 2019-08-18T00:12:00Z |   2.3610000000 |
| 2019-08-18T00:24:00Z |   2.3050000000 |

{{% /expand %}}

{{< /expand-wrapper >}}

## NON_NEGATIVE_DERIVATIVE()

Returns the non-negative rate of change between subsequent [field values](/influxdb/v2.6/reference/glossary/#field-value).
Non-negative rates of change include positive rates of change and rates of change that equal zero.

### Basic syntax

```sql
SELECT NON_NEGATIVE_DERIVATIVE( [ * | <field_key> | /<regular_expression>/ ] [ , <unit> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

InfluxDB calculates the difference between subsequent field values and converts those results into the rate of change per `unit`.
The `unit` argument is an integer followed by a [duration](/influxdb/v2.6/reference/glossary/#duration) and it is optional.
If the query does not specify the `unit`, the unit defaults to one second (`1s`).
`NON_NEGATIVE_DERIVATIVE()` returns only positive rates of change or rates of change that equal zero.

`NON_NEGATIVE_DERIVATIVE(field_key)`  
Returns the non-negative rate of change between subsequent field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

`NON_NEGATIVE_DERIVATIVE(/regular_expression/)`  
Returns the non-negative rate of change between subsequent field values associated with each field key that matches the [regular expression](/influxdb/v2.6/query-data/influxql/explore-data/regular-expressions/).

`NON_NEGATIVE_DERIVATIVE(*)`  
Returns the non-negative rate of change between subsequent field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`NON_NEGATIVE_DERIVATIVE()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `NON_NEGATIVE_DERIVATIVE()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

See the examples in the [`DERIVATIVE()` documentation](#basic-syntax-8).
`NON_NEGATIVE_DERIVATIVE()` behaves the same as the `DERIVATIVE()` function but `NON_NEGATIVE_DERIVATIVE()` returns only positive rates of change or rates of change that equal zero.

### Advanced syntax

```sql
SELECT NON_NEGATIVE_DERIVATIVE(<function> ([ * | <field_key> | /<regular_expression>/ ]) [ , <unit> ] ) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `NON_NEGATIVE_DERIVATIVE()` function to those results.

The `unit` argument is an integer followed by a [duration](/influxdb/v2.6/reference/glossary/#duration) and it is optional.
If the query does not specify the `unit`, the `unit` defaults to the `GROUP BY time()` interval.
Note that this behavior is different from the [basic syntax's](#basic-syntax-4) default behavior.
`NON_NEGATIVE_DERIVATIVE()` returns only positive rates of change or rates of change that equal zero.

`NON_NEGATIVE_DERIVATIVE()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

See the examples in the [`DERIVATIVE()` documentation](#advanced-syntax-8).
`NON_NEGATIVE_DERIVATIVE()` behaves the same as the `DERIVATIVE()` function but `NON_NEGATIVE_DERIVATIVE()` returns only positive rates of change or rates of change that equal zero.

## NON_NEGATIVE_DIFFERENCE()

Returns the non-negative result of subtraction between subsequent [field values](/influxdb/v2.6/reference/glossary/#field-value).
Non-negative results of subtraction include positive differences and differences that equal zero.

### Basic syntax

```sql
SELECT NON_NEGATIVE_DIFFERENCE( [ * | <field_key> | /<regular_expression>/ ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`NON_NEGATIVE_DIFFERENCE(field_key)`  
Returns the non-negative difference between subsequent field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

`NON_NEGATIVE_DIFFERENCE(/regular_expression/)`  
Returns the non-negative difference between subsequent field values associated with each field key that matches the [regular expression](/influxdb/v2.6/query-data/influxql/explore-data/regular-expressions/).

`NON_NEGATIVE_DIFFERENCE(*)`  
Returns the non-negative difference between subsequent field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`NON_NEGATIVE_DIFFERENCE()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `NON_NEGATIVE_DIFFERENCE()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

See the examples in the [`DIFFERENCE()` documentation](#basic-syntax-9).
`NON_NEGATIVE_DIFFERENCE()` behaves the same as the `DIFFERENCE()` function but `NON_NEGATIVE_DIFFERENCE()` returns only positive differences or differences that equal zero.

### Advanced syntax

```sql
SELECT NON_NEGATIVE_DIFFERENCE(<function>( [ * | <field_key> | /<regular_expression>/ ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `NON_NEGATIVE_DIFFERENCE()` function to those results.

`NON_NEGATIVE_DIFFERENCE()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

See the examples in the [`DIFFERENCE()` documentation](#advanced-syntax-9).
`NON_NEGATIVE_DIFFERENCE()` behaves the same as the `DIFFERENCE()` function but `NON_NEGATIVE_DIFFERENCE()` returns only positive differences or differences that equal zero.

## POW()

Returns the field value to the power of `x`.

### Basic syntax

```sql
SELECT POW( [ * | <field_key> ], <x> ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`POW(field_key, x)`  
Returns the field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key) to the power of `x`.

`POW(*, x)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement) to the power of `x`.

`POW()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `POW()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Calculate field values associated with a field key to the power of 4" %}}

Return field values in the `water_level` field key in the `h2o_feet` measurement
multiplied to a power of 4.

```sql
SELECT POW("water_level", 4) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |           pow |
| :------------------- | ------------: |
| 2019-08-18T00:00:00Z | 30.6019618652 |
| 2019-08-18T00:06:00Z | 32.0315362489 |
| 2019-08-18T00:12:00Z | 30.1362461432 |
| 2019-08-18T00:18:00Z | 29.4223904261 |
| 2019-08-18T00:24:00Z | 26.2727594844 |
| 2019-08-18T00:30:00Z | 26.4122914255 |

{{% /expand %}}

{{% expand "Calculate field values associated with each field key in a measurement to the power of 4" %}}

Return field values for each field key that stores numeric values in the `h2o_feet` measurement multiplied to the power of 4.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT POW(*, 4) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | pow_water_level |
| :------------------- | --------------: |
| 2019-08-18T00:00:00Z |   30.6019618652 |
| 2019-08-18T00:06:00Z |   32.0315362489 |
| 2019-08-18T00:12:00Z |   30.1362461432 |
| 2019-08-18T00:18:00Z |   29.4223904261 |
| 2019-08-18T00:24:00Z |   26.2727594844 |
| 2019-08-18T00:30:00Z |   26.4122914255 |

{{% /expand %}}

{{% expand "Calculate field values associated with a field key to the power of 4 and include several clauses" %}}

Return field values associated with the `water_level` field key multiplied to
the power of 4 in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

```sql
SELECT POW("water_level", 4) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |           pow |
| :------------------- | ------------: |
| 2019-08-18T00:18:00Z | 29.4223904261 |
| 2019-08-18T00:12:00Z | 30.1362461432 |
| 2019-08-18T00:06:00Z | 32.0315362489 |
| 2019-08-18T00:00:00Z | 30.6019618652 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT POW(<function>( [ * | <field_key> ] ), <x>) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `POW()` function to those results.

`POW()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate mean values to the power of 4" %}}

Return [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `water_level`s that are calculated at 12-minute intervals multiplied to the power of 4.

```sql
SELECT POW(MEAN("water_level"), 4) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |           pow |
| :------------------- | ------------: |
| 2019-08-18T00:00:00Z | 31.3106302459 |
| 2019-08-18T00:12:00Z | 29.7777139548 |
| 2019-08-18T00:24:00Z | 26.3424561663 |

{{% /expand %}}

{{< /expand-wrapper >}}

## ROUND()

Returns the subsequent value rounded to the nearest integer.

### Basic syntax

```sql
SELECT ROUND( [ * | <field_key> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`ROUND(field_key)`  
Returns the field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key) rounded to the nearest integer.

`ROUND(*)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement) rounded to the nearest integer.

`ROUND()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/. To use `ROUND()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Round field values associated with a field key" %}}

Return field values in the `water_level` field key in the `h2o_feet` measurement
rounded to the nearest integer.

```sql
SELECT ROUND("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |        round |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.0000000000 |
| 2019-08-18T00:06:00Z | 2.0000000000 |
| 2019-08-18T00:12:00Z | 2.0000000000 |
| 2019-08-18T00:18:00Z | 2.0000000000 |
| 2019-08-18T00:24:00Z | 2.0000000000 |
| 2019-08-18T00:30:00Z | 2.0000000000 |

{{% /expand %}}

{{% expand "Round field values associated with each field key in a measurement" %}}

Return field values for each numeric field in the `h2o_feet` measurement rounded to the nearest integer.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT ROUND(*) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | round_water_level |
| :------------------- | ----------------: |
| 2019-08-18T00:00:00Z |      2.0000000000 |
| 2019-08-18T00:06:00Z |      2.0000000000 |
| 2019-08-18T00:12:00Z |      2.0000000000 |
| 2019-08-18T00:18:00Z |      2.0000000000 |
| 2019-08-18T00:24:00Z |      2.0000000000 |
| 2019-08-18T00:30:00Z |      2.0000000000 |

{{% /expand %}}

{{% expand "Round field values associated with a field key and include several clauses" %}}

Return field values associated with the `water_level` field key rounded to the
nearest integer in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

```sql
SELECT ROUND("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |        round |
| :------------------- | -----------: |
| 2019-08-18T00:18:00Z | 2.0000000000 |
| 2019-08-18T00:12:00Z | 2.0000000000 |
| 2019-08-18T00:06:00Z | 2.0000000000 |
| 2019-08-18T00:00:00Z | 2.0000000000 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT ROUND(<function>( [ * | <field_key> ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `ROUND()` function to those results.

`ROUND()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate mean values rounded to the nearest integer" %}}

Return the [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `water_level`s that are calculated at 12-minute intervals and rounds to the nearest integer.

```sql
SELECT ROUND(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |        round |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.0000000000 |
| 2019-08-18T00:12:00Z | 2.0000000000 |
| 2019-08-18T00:24:00Z | 2.0000000000 |

{{% /expand %}}

{{< /expand-wrapper >}}

## SIN()

Returns the sine of the field value.

### Basic syntax

```sql
SELECT SIN( [ * | <field_key> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`SIN(field_key)`  
Returns the sine of field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

`SIN(*)`  
Returns the sine of field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`SIN()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `SIN()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Calculate the sine of field values associated with a field key" %}}

Return the sine of field values in the `water_level` field key in the `h2o_feet` measurement.

```sql
SELECT SIN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |          sin |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 0.7100665046 |
| 2019-08-18T00:06:00Z | 0.6907983763 |
| 2019-08-18T00:12:00Z | 0.7163748731 |
| 2019-08-18T00:18:00Z | 0.7260723687 |
| 2019-08-18T00:24:00Z | 0.7692028035 |
| 2019-08-18T00:30:00Z | 0.7672823308 |

{{% /expand %}}

{{% expand "Calculate the sine of field values associated with each field key in a measurement" %}}

Return the sine of field values for each numeric field in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT SIN(*) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | sin_water_level |
| :------------------- | --------------: |
| 2019-08-18T00:00:00Z |    0.7100665046 |
| 2019-08-18T00:06:00Z |    0.6907983763 |
| 2019-08-18T00:12:00Z |    0.7163748731 |
| 2019-08-18T00:18:00Z |    0.7260723687 |
| 2019-08-18T00:24:00Z |    0.7692028035 |
| 2019-08-18T00:30:00Z |    0.7672823308 |

{{% /expand %}}

{{% expand "Calculate the sine of field values associated with a field key and include several clauses" %}}

Return the sine of field values associated with the `water_level`
field key in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

```sql
SELECT SIN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |          sin |
| :------------------- | -----------: |
| 2019-08-18T00:18:00Z | 0.7260723687 |
| 2019-08-18T00:12:00Z | 0.7163748731 |
| 2019-08-18T00:06:00Z | 0.6907983763 |
| 2019-08-18T00:00:00Z | 0.7100665046 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT SIN(<function>( [ * | <field_key> ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `SIN()` function to those results.

`SIN()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the sine of mean values" %}}

Return the sine of [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `water_level`s that are calculated at 12-minute intervals.

```sql
SELECT SIN(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |          sin |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 0.7004962722 |
| 2019-08-18T00:12:00Z | 0.7212412912 |
| 2019-08-18T00:24:00Z | 0.7682434314 |

{{% /expand %}}

{{< /expand-wrapper >}}

## SQRT()

Returns the square root of field value.

### Basic syntax

```sql
SELECT SQRT( [ * | <field_key> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`SQRT(field_key)`  
Returns the square root of field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

`SQRT(*)`  
Returns the square root field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`SQRT()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `SQRT()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Calculate the square root of field values associated with a field key" %}}

Return the square roots of field values in the `water_level` field key in the `h2o_feet` measurement.

```sql
SELECT SQRT("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |         sqrt |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 1.5336231610 |
| 2019-08-18T00:06:00Z | 1.5424007261 |
| 2019-08-18T00:12:00Z | 1.5306861207 |
| 2019-08-18T00:18:00Z | 1.5261061562 |
| 2019-08-18T00:24:00Z | 1.5046594299 |
| 2019-08-18T00:30:00Z | 1.5056560032 |

{{% /expand %}}

{{% expand "Calculate the square root of field values associated with each field key in a measurement" %}}

Return the square roots of field values for each numeric field in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT SQRT(*) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | sqrt_water_level |
| :------------------- | ---------------: |
| 2019-08-18T00:00:00Z |     1.5336231610 |
| 2019-08-18T00:06:00Z |     1.5424007261 |
| 2019-08-18T00:12:00Z |     1.5306861207 |
| 2019-08-18T00:18:00Z |     1.5261061562 |
| 2019-08-18T00:24:00Z |     1.5046594299 |
| 2019-08-18T00:30:00Z |     1.5056560032 |

{{% /expand %}}

{{% expand "Calculate the square root of field values associated with a field key and include several clauses" %}}

Return the square roots of field values associated with the `water_level`
field key in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

```sql
SELECT SQRT("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |         sqrt |
| :------------------- | -----------: |
| 2019-08-18T00:18:00Z | 1.5261061562 |
| 2019-08-18T00:12:00Z | 1.5306861207 |
| 2019-08-18T00:06:00Z | 1.5424007261 |
| 2019-08-18T00:00:00Z | 1.5336231610 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT SQRT(<function>( [ * | <field_key> ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `SQRT()` function to those results.

`SQRT()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the square root of mean values" %}}

Return the square roots of [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `water_level`s that are calculated at 12-minute intervals.

```sql
SELECT SQRT(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |         sqrt |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 1.5380182054 |
| 2019-08-18T00:12:00Z | 1.5283978540 |
| 2019-08-18T00:24:00Z | 1.5051577990 |

{{% /expand %}}

{{< /expand-wrapper >}}

## TAN()

Returns the tangent of the field value.

### Basic syntax

```sql
SELECT TAN( [ * | <field_key> ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`TAN(field_key)`  
Returns the tangent of field values associated with the [field key](/influxdb/v2.6/reference/glossary/#field-key).

`TAN(*)`  
Returns the tangent of field values associated with each field key in the [measurement](/influxdb/v2.6/reference/glossary/#measurement).

`TAN()` supports int64 and float64 field value [data types](/influxdb/v2.6/query-data/influxql/explore-data/select/#data-types).

Supports `GROUP BY` clauses that [group by tags](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
To use `TAN()` with a `GROUP BY time()` clause, see [Advanced syntax](#advanced-syntax).

#### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.6/reference/sample-data/#noaa-water-sample-data):

```sql
SELECT "water_level" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3520000000 |
| 2019-08-18T00:06:00Z | 2.3790000000 |
| 2019-08-18T00:12:00Z | 2.3430000000 |
| 2019-08-18T00:18:00Z | 2.3290000000 |
| 2019-08-18T00:24:00Z | 2.2640000000 |
| 2019-08-18T00:30:00Z | 2.2670000000 |

{{< expand-wrapper >}}

{{% expand "Calculate the tangent of field values associated with a field key" %}}

Return the tangent of field values in the `water_level` field key in the `h2o_feet` measurement.

```sql
SELECT TAN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |           tan |
| :------------------- | ------------: |
| 2019-08-18T00:00:00Z | -1.0084243657 |
| 2019-08-18T00:06:00Z | -0.9553984098 |
| 2019-08-18T00:12:00Z | -1.0267433979 |
| 2019-08-18T00:18:00Z | -1.0559235802 |
| 2019-08-18T00:24:00Z | -1.2037513424 |
| 2019-08-18T00:30:00Z | -1.1964307053 |

{{% /expand %}}

{{% expand "Calculate the tangent of field values associated with each field key in a measurement" %}}

Return the tangent of field values for each numeric field in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT TAN(*) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | tan_water_level |
| :------------------- | --------------: |
| 2019-08-18T00:00:00Z |   -1.0084243657 |
| 2019-08-18T00:06:00Z |   -0.9553984098 |
| 2019-08-18T00:12:00Z |   -1.0267433979 |
| 2019-08-18T00:18:00Z |   -1.0559235802 |
| 2019-08-18T00:24:00Z |   -1.2037513424 |
| 2019-08-18T00:30:00Z |   -1.1964307053 |

{{% /expand %}}

{{% expand "Calculate the tangent of field values associated with a field key and include several clauses" %}}

Return the tangent of field values associated with the `water_level`
field key in the [time range](/influxdb/v2.6/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` with results in
[descending timestamp order](/influxdb/v2.6/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.6/query-data/influxql/explore-data/limit-and-slimit/)
the number of points returned to four and [offsets](/influxdb/v2.6/query-data/influxql/explore-data/offset-and-soffset/)
results by two points.

```sql
SELECT TAN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |           tan |
| :------------------- | ------------: |
| 2019-08-18T00:18:00Z | -1.0559235802 |
| 2019-08-18T00:12:00Z | -1.0267433979 |
| 2019-08-18T00:06:00Z | -0.9553984098 |
| 2019-08-18T00:00:00Z | -1.0084243657 |

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT TAN(<function>( [ * | <field_key> ] )) FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.6/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `TAN()` function to those results.

`TAN()` supports the following nested functions:
[`COUNT()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#count),
[`MEAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean),
[`MEDIAN()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#median),
[`MODE()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mode),
[`SUM()`](/influxdb/v2.6/query-data/influxql/functions/aggregates/#sum),
[`FIRST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#first),
[`LAST()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#last),
[`MIN()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#min),
[`MAX()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#max), and
[`PERCENTILE()`](/influxdb/v2.6/query-data/influxql/functions/selectors/#percentile).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the tangent of mean values" %}}

Return the tangent of [mean](/influxdb/v2.6/query-data/influxql/functions/aggregates/#mean) `water_level`s that are calculated at 12-minute intervals.

```sql
SELECT TAN(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |           tan |
| :------------------- | ------------: |
| 2019-08-18T00:00:00Z | -0.9815600413 |
| 2019-08-18T00:12:00Z | -1.0412271461 |
| 2019-08-18T00:24:00Z | -1.2000844348 |

{{% /expand %}}

{{< /expand-wrapper >}}
