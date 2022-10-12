---
title: InfluxQL transformation functions
description: >
  Transform data with InfluxQL transformation functions.
menu:
  influxdb_2_4:
    name: Transformations
    parent: View InfluxQL functions
weight: 205
---

Transformations take a stream of tables as input, transform the data in some way, and output a stream of tables. Transformations cover a broad range of functions, but the following categorizations highlight important behaviors associated with specific transformation functions.

## Transformations

## ABS()

Returns the absolute value of the field value.

### Basic syntax

```
SELECT ABS( [ * | <field_key> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`ABS(field_key)`  
Returns the absolute values of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

<!-- `ABS(/regular_expression/)`  
Returns the absolute value of field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/). -->

`ABS(*)`  
Returns the absolute values of field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`ABS()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `ABS()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of this [sample data](https://gist.github.com/sanderson/8f8aec94a60b2c31a61f44a37737bfea):

```sql
> SELECT * FROM "data" WHERE time >= '2018-06-24T12:00:00Z' AND time <= '2018-06-24T12:05:00Z'

name: data
time                 a                   b
----                 -                   -
1529841600000000000  1.33909108671076    -0.163643058925645
1529841660000000000  -0.774984088561186  0.137034364053949
1529841720000000000  -0.921037167720451  -0.482943221384294
1529841780000000000  -1.73880754843378   -0.0729732928756677
1529841840000000000  -0.905980032168252  1.77857552719844
1529841900000000000  -0.891164752631417  0.741147445214238
```

{{< expand-wrapper >}}

{{% expand "Calculate the absolute values of field values associated with a field key" %}}

```sql
> SELECT ABS("a") FROM "data" WHERE time >= '2018-06-24T12:00:00Z' AND time <= '2018-06-24T12:05:00Z'

name: data
time                 abs
----                 ---
1529841600000000000  1.33909108671076
1529841660000000000  0.774984088561186
1529841720000000000  0.921037167720451
1529841780000000000  1.73880754843378
1529841840000000000  0.905980032168252
1529841900000000000  0.891164752631417
```

The query returns the absolute values of field values in the `a` field key in the `data` measurement.

{{% /expand %}}

{{% expand "Calculate the absolute Values of field values associated with each field key in a measurement" %}}

```sql
> SELECT ABS(*) FROM "data" WHERE time >= '2018-06-24T12:00:00Z' AND time <= '2018-06-24T12:05:00Z'

name: data
time                 abs_a              abs_b
----                 -----              -----
1529841600000000000  1.33909108671076   0.163643058925645
1529841660000000000  0.774984088561186  0.137034364053949
1529841720000000000  0.921037167720451  0.482943221384294
1529841780000000000  1.73880754843378   0.0729732928756677
1529841840000000000  0.905980032168252  1.77857552719844
1529841900000000000  0.891164752631417  0.741147445214238
```

The query returns the absolute values of field values for each field key that stores
numerical values in the `data` measurement.
The `data` measurement has two numerical fields: `a` and `b`.

<!-- ##### Calculate the absolute values of field values associated with each field key that matches a regular expression
```
> SELECT ABS(/a/) FROM "h2o_feet" WHERE time >= '2018-06-24T12:00:00Z' AND time <= '2018-06-24T12:05:00Z' AND "location" = 'santa_monica'

name: data
time                 abs
----                 ---
1529841600000000000  1.33909108671076
1529841660000000000  0.774984088561186
1529841720000000000  0.921037167720451
1529841780000000000  1.73880754843378
1529841840000000000  0.905980032168252
1529841900000000000  0.891164752631417
```

The query returns the absolute values of field values for each field key that stores numerical values and includes `a` in the `data` measurement. -->

{{% /expand %}}

{{% expand "Calculate the absolute values of field values associated with a field key and include several clauses" %}}

```sql
> SELECT ABS("a") FROM "data" WHERE time >= '2018-06-24T12:00:00Z' AND time <= '2018-06-24T12:05:00Z' ORDER BY time DESC LIMIT 4 OFFSET 2

name: data
time                 abs
----                 ---
1529841780000000000  1.73880754843378
1529841720000000000  0.921037167720451
1529841660000000000  0.774984088561186
1529841600000000000  1.33909108671076
```

The query returns the absolute values of field values associated with the `a` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2018-06-24T12:00:00Z` and `2018-06-24T12:05:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT ABS(<function>( [ * | <field_key> ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `ABS()` function to those results.

`ABS()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the absolute values of mean values" %}}

```sql
> SELECT ABS(MEAN("a")) FROM "data" WHERE time >= '2018-06-24T12:00:00Z' AND time <= '2018-06-24T13:00:00Z' GROUP BY time(12m)

name: data
time                 abs
----                 ---
1529841600000000000  0.3960977256302787
1529842320000000000  0.0010541018316373302
1529843040000000000  0.04494733240283668
1529843760000000000  0.2553594777104415
1529844480000000000  0.20382988543108413
1529845200000000000  0.790836070736962
```

The query returns the absolute values of [average](#mean) `a`s that are calculated at 12-minute intervals.

To get those results, InfluxDB first calculates the average `a`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `ABS()`:

```sql
> SELECT MEAN("a") FROM "data" WHERE time >= '2018-06-24T12:00:00Z' AND time <= '2018-06-24T13:00:00Z' GROUP BY time(12m)

name: data
time                 mean
----                 ----
1529841600000000000  -0.3960977256302787
1529842320000000000  0.0010541018316373302
1529843040000000000  0.04494733240283668
1529843760000000000  0.2553594777104415
1529844480000000000  0.20382988543108413
1529845200000000000  -0.790836070736962
```

InfluxDB then calculates absolute values of those averages.

{{% /expand %}}

{{< /expand-wrapper >}}

## ACOS()

Returns the arccosine (in radians) of the field value. Field values must be between -1 and 1.

### Basic syntax

```
SELECT ACOS( [ * | <field_key> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`ACOS(field_key)`  
Returns the arccosine of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

<!-- `ACOS(/regular_expression/)`  
Returns the arccosine of field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/). -->

`ACOS(*)`  
Returns the arccosine of field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`ACOS()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types) with values between -1 and 1.

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `ACOS()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following data sample of simulated park occupancy relative to total capacity. The important thing to note is that all field values fall within the calculable range (-1 to 1) of the `ACOS()` function:

```sql
> SELECT "of_capacity" FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z'

name: park_occupancy
time                  capacity
----                  --------
2017-05-01T00:00:00Z  0.83
2017-05-02T00:00:00Z  0.3
2017-05-03T00:00:00Z  0.84
2017-05-04T00:00:00Z  0.22
2017-05-05T00:00:00Z  0.17
2017-05-06T00:00:00Z  0.77
2017-05-07T00:00:00Z  0.64
2017-05-08T00:00:00Z  0.72
2017-05-09T00:00:00Z  0.16
```

{{< expand-wrapper >}}

{{% expand "Calculate the arccosine of field values associated with a field key" %}}

```sql
> SELECT ACOS("of_capacity") FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z'

name: park_occupancy
time                  acos
----                  ----
2017-05-01T00:00:00Z  0.591688642426544
2017-05-02T00:00:00Z  1.266103672779499
2017-05-03T00:00:00Z  0.5735131044230969
2017-05-04T00:00:00Z  1.3489818562981022
2017-05-05T00:00:00Z  1.399966657665792
2017-05-06T00:00:00Z  0.6919551751263169
2017-05-07T00:00:00Z  0.8762980611683406
2017-05-08T00:00:00Z  0.7669940078618667
2017-05-09T00:00:00Z  1.410105673842986
```

The query returns arccosine of field values in the `of_capacity` field key in the `park_occupancy` measurement.

{{% /expand %}}

{{% expand "Calculate the arccosine of field values associated with each field key in a measurement" %}}

```sql
> SELECT ACOS(*) FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z'

name: park_occupancy
time                  acos_of_capacity
----                  -------------
2017-05-01T00:00:00Z  0.591688642426544
2017-05-02T00:00:00Z  1.266103672779499
2017-05-03T00:00:00Z  0.5735131044230969
2017-05-04T00:00:00Z  1.3489818562981022
2017-05-05T00:00:00Z  1.399966657665792
2017-05-06T00:00:00Z  0.6919551751263169
2017-05-07T00:00:00Z  0.8762980611683406
2017-05-08T00:00:00Z  0.7669940078618667
2017-05-09T00:00:00Z  1.410105673842986
```

The query returns arccosine of field values for each field key that stores numerical values in the `park_occupancy` measurement.
The `park_occupancy` measurement has one numerical field: `of_capacity`.

<!-- ##### Calculate the arccosine of field values associated with each field key that matches a regular expression
```
> SELECT ACOS(/capacity/) FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z'

name: park_occupancy
time                  acos_of_capacity
----                  ----------------
2017-05-01T00:00:00Z  0.591688642426544
2017-05-02T00:00:00Z  1.266103672779499
2017-05-03T00:00:00Z  0.5735131044230969
2017-05-04T00:00:00Z  1.3489818562981022
2017-05-05T00:00:00Z  1.399966657665792
2017-05-06T00:00:00Z  0.6919551751263169
2017-05-07T00:00:00Z  0.8762980611683406
2017-05-08T00:00:00Z  0.7669940078618667
2017-05-09T00:00:00Z  1.410105673842986
```

The query returns arccosine of field values for each field key that stores numerical values and includes the word `capacity` in the `park_occupancy` measurement. -->

{{% /expand %}}

{{% expand "Calculate the arccosine of field values associated with a field key and include several clauses" %}}

```sql
> SELECT ACOS("of_capacity") FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z' ORDER BY time DESC LIMIT 4 OFFSET 2

name: park_occupancy
time                  acos
----                  ----
2017-05-07T00:00:00Z  0.8762980611683406
2017-05-06T00:00:00Z  0.6919551751263169
2017-05-05T00:00:00Z  1.399966657665792
2017-05-04T00:00:00Z  1.3489818562981022
```

The query returns arccosine of field values associated with the `of_capacity` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2017-05-01T00:00:00Z` and `2017-05-09T00:00:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT ACOS(<function>( [ * | <field_key> ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `ACOS()` function to those results.

`ACOS()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the arccosine of mean values" %}}

```sql
> SELECT ACOS(MEAN("of_capacity")) FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z' GROUP BY time(3d)

name: park_occupancy
time                  acos
----                  ----
2017-04-30T00:00:00Z  0.9703630732143733
2017-05-03T00:00:00Z  1.1483422646081407
2017-05-06T00:00:00Z  0.7812981174487247
2017-05-09T00:00:00Z  1.410105673842986
```

The query returns arccosine of [average](#mean) `of_capacity`s that are calculated at 3-day intervals.

To get those results, InfluxDB first calculates the average `of_capacity`s at 3-day intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `ACOS()`:

```sql
> SELECT MEAN("of_capacity") FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z' GROUP BY time(3d)

name: park_occupancy
time                  mean
----                  ----
2017-04-30T00:00:00Z  0.565
2017-05-03T00:00:00Z  0.41
2017-05-06T00:00:00Z  0.71
2017-05-09T00:00:00Z  0.16
```

InfluxDB then calculates arccosine of those averages.

{{% /expand %}}

{{< /expand-wrapper >}}

## ASIN()

Returns the arcsine (in radians) of the field value. Field values must be between -1 and 1.

### Basic syntax

```
SELECT ASIN( [ * | <field_key> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`ASIN(field_key)`  
Returns the arcsine of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

<!-- `ASIN(/regular_expression/)`  
Returns the arcsine of field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/). -->

`ASIN(*)`  
Returns the arcsine of field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`ASIN()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types) with values between -1 and 1.

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `ASIN()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following data sample of simulated park occupancy relative to total capacity. The important thing to note is that all field values fall within the calculable range (-1 to 1) of the `ASIN()` function:

```sql
> SELECT "of_capacity" FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z'

name: park_occupancy
time                  capacity
----                  --------
2017-05-01T00:00:00Z  0.83
2017-05-02T00:00:00Z  0.3
2017-05-03T00:00:00Z  0.84
2017-05-04T00:00:00Z  0.22
2017-05-05T00:00:00Z  0.17
2017-05-06T00:00:00Z  0.77
2017-05-07T00:00:00Z  0.64
2017-05-08T00:00:00Z  0.72
2017-05-09T00:00:00Z  0.16
```

{{< expand-wrapper >}}

{{% expand "Calculate the arcsine of field values associated with a field key" %}}

```sql
> SELECT ASIN("of_capacity") FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z'

name: park_occupancy
time                  asin
----                  ----
2017-05-01T00:00:00Z  0.9791076843683526
2017-05-02T00:00:00Z  0.3046926540153975
2017-05-03T00:00:00Z  0.9972832223717997
2017-05-04T00:00:00Z  0.22181447049679442
2017-05-05T00:00:00Z  0.1708296691291045
2017-05-06T00:00:00Z  0.8788411516685797
2017-05-07T00:00:00Z  0.6944982656265559
2017-05-08T00:00:00Z  0.8038023189330299
2017-05-09T00:00:00Z  0.1606906529519106
```

The query returns arcsine of field values in the `of_capacity` field key in the `park_capacity` measurement.

{{% /expand %}}

{{% expand "Calculate the arcsine of field values associated with each field key in a measurement" %}}

```sql
> SELECT ASIN(*) FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z'

name: park_occupancy
time                  asin_of_capacity
----                  -------------
2017-05-01T00:00:00Z  0.9791076843683526
2017-05-02T00:00:00Z  0.3046926540153975
2017-05-03T00:00:00Z  0.9972832223717997
2017-05-04T00:00:00Z  0.22181447049679442
2017-05-05T00:00:00Z  0.1708296691291045
2017-05-06T00:00:00Z  0.8788411516685797
2017-05-07T00:00:00Z  0.6944982656265559
2017-05-08T00:00:00Z  0.8038023189330299
2017-05-09T00:00:00Z  0.1606906529519106
```

The query returns arcsine of field values for each field key that stores numerical values in the `park_capacity` measurement.
The `h2o_feet` measurement has one numerical field: `of_capacity`.

<!-- ##### Calculate the arcsine of field values associated with each field key that matches a regular expression
```
> SELECT ASIN(/capacity/) FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z'

name: park_occupancy
time                  asin
----                  ----
2017-05-01T00:00:00Z  0.9791076843683526
2017-05-02T00:00:00Z  0.3046926540153975
2017-05-03T00:00:00Z  0.9972832223717997
2017-05-04T00:00:00Z  0.22181447049679442
2017-05-05T00:00:00Z  0.1708296691291045
2017-05-06T00:00:00Z  0.8788411516685797
2017-05-07T00:00:00Z  0.6944982656265559
2017-05-08T00:00:00Z  0.8038023189330299
2017-05-09T00:00:00Z  0.1606906529519106
```

The query returns arcsine of field values for each field key that stores numerical values and includes the word `of_capacity` in the `park_occupancy` measurement. -->

{{% /expand %}}

{{% expand "Calculate the arcsine of field values associated with a field key and include several clauses" %}}

```sql
> SELECT ASIN("of_capacity") FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z' ORDER BY time DESC LIMIT 4 OFFSET 2

name: park_occupancy
time                  asin
----                  ----
2017-05-07T00:00:00Z  0.6944982656265559
2017-05-06T00:00:00Z  0.8788411516685797
2017-05-05T00:00:00Z  0.1708296691291045
2017-05-04T00:00:00Z  0.22181447049679442
```

The query returns arcsine of field values associated with the `of_capacity` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2017-05-01T00:00:00Z` and `2017-05-09T00:00:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT ASIN(<function>( [ * | <field_key> ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `ASIN()` function to those results.

`ASIN()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the arcsine of mean values" %}}

```sql
> SELECT ASIN(MEAN("of_capacity")) FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z' GROUP BY time(3d)

name: park_occupancy
time                  asin
----                  ----
2017-04-30T00:00:00Z  0.6004332535805232
2017-05-03T00:00:00Z  0.42245406218675574
2017-05-06T00:00:00Z  0.7894982093461719
2017-05-09T00:00:00Z  0.1606906529519106
```

The query returns arcsine of [average](#mean) `of_capacity`s that are calculated at 3-day intervals.

To get those results, InfluxDB first calculates the average `of_capacity`s at 3-day intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `ASIN()`:

```sql
> SELECT MEAN("of_capacity") FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z' GROUP BY time(3d)

name: park_occupancy
time                  mean
----                  ----
2017-04-30T00:00:00Z  0.565
2017-05-03T00:00:00Z  0.41
2017-05-06T00:00:00Z  0.71
2017-05-09T00:00:00Z  0.16
```

InfluxDB then calculates arcsine of those averages.

{{% /expand %}}

{{< /expand-wrapper >}}


## ATAN()

Returns the arctangent (in radians) of the field value. Field values must be between -1 and 1.

### Basic syntax

```sql
SELECT ATAN( [ * | <field_key> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`ATAN(field_key)`  
Returns the arctangent of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

<!-- `ATAN(/regular_expression/)`  
Returns the arctangent of field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/). -->

`ATAN(*)`  
Returns the arctangent of field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`ATAN()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types) with values between -1 and 1.

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `ATAN()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following data sample of simulated park occupancy relative to total capacity. The important thing to note is that all field values fall within the calculable range (-1 to 1) of the `ATAN()` function:

```sql
> SELECT "of_capacity" FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z'

name: park_occupancy
time                  capacity
----                  --------
2017-05-01T00:00:00Z  0.83
2017-05-02T00:00:00Z  0.3
2017-05-03T00:00:00Z  0.84
2017-05-04T00:00:00Z  0.22
2017-05-05T00:00:00Z  0.17
2017-05-06T00:00:00Z  0.77
2017-05-07T00:00:00Z  0.64
2017-05-08T00:00:00Z  0.72
2017-05-09T00:00:00Z  0.16
```

{{< expand-wrapper >}}

{{% expand "Calculate the arctangent of field values associated with a field key" %}}

```sql
> SELECT ATAN("of_capacity") FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z'

name: park_occupancy
time                  atan
----                  ----
2017-05-01T00:00:00Z  0.6927678353971222
2017-05-02T00:00:00Z  0.2914567944778671
2017-05-03T00:00:00Z  0.6986598247214632
2017-05-04T00:00:00Z  0.2165503049760893
2017-05-05T00:00:00Z  0.16839015714752992
2017-05-06T00:00:00Z  0.6561787179913948
2017-05-07T00:00:00Z  0.5693131911006619
2017-05-08T00:00:00Z  0.6240230529767568
2017-05-09T00:00:00Z  0.1586552621864014
```

The query returns arctangent of field values in the `of_capacity` field key in the `park_occupancy` measurement.

{{% /expand %}}

{{% expand "Calculate the arctangent of field values associated with each field key in a measurement" %}}

```sql
> SELECT ATAN(*) FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z'

name: park_occupancy
time                  atan_of_capacity
----                  -------------
2017-05-01T00:00:00Z  0.6927678353971222
2017-05-02T00:00:00Z  0.2914567944778671
2017-05-03T00:00:00Z  0.6986598247214632
2017-05-04T00:00:00Z  0.2165503049760893
2017-05-05T00:00:00Z  0.16839015714752992
2017-05-06T00:00:00Z  0.6561787179913948
2017-05-07T00:00:00Z  0.5693131911006619
2017-05-08T00:00:00Z  0.6240230529767568
2017-05-09T00:00:00Z  0.1586552621864014
```

The query returns arctangent of field values for each field key that stores numerical values in the `park_occupancy` measurement.
The `park_occupancy` measurement has one numerical field: `of_capacity`.

<!-- ##### Calculate the arctangent of field values associated with each field key that matches a regular expression
```
> SELECT ATAN(/capacity/) FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z'

name: park_occupancy
time                  atan_of_capacity
----                  -------------
2017-05-01T00:00:00Z  0.6927678353971222
2017-05-02T00:00:00Z  0.2914567944778671
2017-05-03T00:00:00Z  0.6986598247214632
2017-05-04T00:00:00Z  0.2165503049760893
2017-05-05T00:00:00Z  0.16839015714752992
2017-05-06T00:00:00Z  0.6561787179913948
2017-05-07T00:00:00Z  0.5693131911006619
2017-05-08T00:00:00Z  0.6240230529767568
2017-05-09T00:00:00Z  0.1586552621864014
```

The query returns arctangent of field values for each field key that stores numerical values and includes the word `capacity` in the `park_occupancy` measurement. -->

{{% /expand %}}

{{% expand "Calculate the arctangent of field values associated with a field key and include several clauses" %}}

```sql
> SELECT ATAN("of_capacity") FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z' ORDER BY time DESC LIMIT 4 OFFSET 2

name: park_occupancy
time                  atan
----                  ----
2017-05-07T00:00:00Z  0.5693131911006619
2017-05-06T00:00:00Z  0.6561787179913948
2017-05-05T00:00:00Z  0.16839015714752992
2017-05-04T00:00:00Z  0.2165503049760893
```

The query returns arctangent of field values associated with the `of_capacity` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2017-05-01T00:00:00Z` and `2017-05-09T00:00:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT ATAN(<function>( [ * | <field_key> ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `ATAN()` function to those results.

`ATAN()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples of advanced syntax

{{< expand-wrapper >}}

{{% expand "Calculate the arctangent of mean values" %}}

```sql
> SELECT ATAN(MEAN("of_capacity")) FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z' GROUP BY time(3d)

name: park_occupancy
time                 atan
----                 ----
2017-04-30T00:00:00Z 0.5142865412694495
2017-05-03T00:00:00Z 0.3890972310552784
2017-05-06T00:00:00Z 0.6174058917515726
2017-05-09T00:00:00Z 0.1586552621864014
```

The query returns arctangent of [average](#mean) `of_capacity`s that are calculated at 3-day intervals.

To get those results, InfluxDB first calculates the average `of_capacity`s at 3-day intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `ATAN()`:

```sql
> SELECT MEAN("of_capacity") FROM "park_occupancy" WHERE time >= '2017-05-01T00:00:00Z' AND time <= '2017-05-09T00:00:00Z' GROUP BY time(3d)

name: park_occupancy
time                  mean
----                  ----
2017-04-30T00:00:00Z  0.565
2017-05-03T00:00:00Z  0.41
2017-05-06T00:00:00Z  0.71
2017-05-09T00:00:00Z  0.16
```

InfluxDB then calculates arctangent of those averages.

{{% /expand %}}

{{< /expand-wrapper >}}

## ATAN2()

Returns the the arctangent of `y/x` in radians.

### Basic syntax

```
SELECT ATAN2( [ * | <field_key> | num ], [ <field_key> | num ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`ATAN2(field_key_y, field_key_x)`  
Returns the arctangent of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key), `field_key_y`, divided by field values associated with `field_key_x`.

<!-- `ATAN2(/regular_expression/, field_key_x)`  
Returns the arctangent of field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/)
divided by field values associated with `field_key_x`. -->

`ATAN2(*, field_key_x)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement)
divided by field values associated with `field_key_x`.

`ATAN2()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `ATAN2()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following sample of simulated flight data:

```sql
> SELECT "altitude_ft", "distance_ft" FROM "flight_data" WHERE time >= '2018-05-16T12:01:00Z' AND time <= '2018-05-16T12:10:00Z'

name: flight_data
time                  altitude_ft  distance_ft
----                  -----------  -----------
2018-05-16T12:01:00Z  1026         50094
2018-05-16T12:02:00Z  2549         53576
2018-05-16T12:03:00Z  4033         55208
2018-05-16T12:04:00Z  5579         58579
2018-05-16T12:05:00Z  7065         61213
2018-05-16T12:06:00Z  8589         64807
2018-05-16T12:07:00Z  10180        67707
2018-05-16T12:08:00Z  11777        69819
2018-05-16T12:09:00Z  13321        72452
2018-05-16T12:10:00Z  14885        75881
```

{{< expand-wrapper >}}

{{% expand "Calculate the arctangent of field_key_y over field_key_x" %}}

```sql
> SELECT ATAN2("altitude_ft", "distance_ft") FROM "flight_data" WHERE time >= '2018-05-16T12:01:00Z' AND time <= '2018-05-16T12:10:00Z'

name: flight_data
time                  atan2
----                  -----
2018-05-16T12:01:00Z  0.020478631571881498
2018-05-16T12:02:00Z  0.04754142349303296
2018-05-16T12:03:00Z  0.07292147724575364
2018-05-16T12:04:00Z  0.09495251193874832
2018-05-16T12:05:00Z  0.11490822875441563
2018-05-16T12:06:00Z  0.13176409347584003
2018-05-16T12:07:00Z  0.14923587589682233
2018-05-16T12:08:00Z  0.1671059946640312
2018-05-16T12:09:00Z  0.18182893717409565
2018-05-16T12:10:00Z  0.1937028631495223
```

The query returns the arctangents of field values in the `altitude_ft` field key divided by values in the `distance_ft` field key. Both are part of the `flight_data` measurement.

{{% /expand %}}

{{% expand "Calculate the arctangent of values associated with each field key in a measurement divided by field_key_x" %}}

```sql
> SELECT ATAN2(*, "distance_ft") FROM "flight_data" WHERE time >= '2018-05-16T12:01:00Z' AND time <= '2018-05-16T12:10:00Z'

name: flight_data
time                  atan2_altitude_ft     atan2_distance_ft
----                  -----------------     -----------------
2018-05-16T12:01:00Z  0.020478631571881498  0.7853981633974483
2018-05-16T12:02:00Z  0.04754142349303296   0.7853981633974483
2018-05-16T12:03:00Z  0.07292147724575364   0.7853981633974483
2018-05-16T12:04:00Z  0.09495251193874832   0.7853981633974483
2018-05-16T12:05:00Z  0.11490822875441563   0.7853981633974483
2018-05-16T12:06:00Z  0.13176409347584003   0.7853981633974483
2018-05-16T12:07:00Z  0.14923587589682233   0.7853981633974483
2018-05-16T12:08:00Z  0.1671059946640312    0.7853981633974483
2018-05-16T12:09:00Z  0.18182893717409565   0.7853981633974483
2018-05-16T12:10:00Z  0.19370286314952234   0.7853981633974483
```

The query returns the arctangents of all numeric field values in the `flight_data` measurement divided by values in the `distance_ft` field key.
The `flight_data` measurement has two numeric fields: `altitude_ft` and `distance_ft`.

<!-- ##### Calculate the arctangent of values associated with each field key matching a regular expression divided by field_key_x
```
> SELECT ATAN2(/ft/, "distance_ft") FROM "flight_data" WHERE time >= '2018-05-16T12:01:00Z' AND time <= '2018-05-16T12:10:00Z'

name: flight_data
time                  atan2_altitude_ft     atan2_distance_ft
----                  -----------------     -----------------
2018-05-16T12:01:00Z  0.020478631571881498  0.7853981633974483
2018-05-16T12:02:00Z  0.04754142349303296   0.7853981633974483
2018-05-16T12:03:00Z  0.07292147724575364   0.7853981633974483
2018-05-16T12:04:00Z  0.09495251193874832   0.7853981633974483
2018-05-16T12:05:00Z  0.11490822875441563   0.7853981633974483
2018-05-16T12:06:00Z  0.13176409347584003   0.7853981633974483
2018-05-16T12:07:00Z  0.14923587589682233   0.7853981633974483
2018-05-16T12:08:00Z  0.1671059946640312    0.7853981633974483
2018-05-16T12:09:00Z  0.18182893717409565   0.7853981633974483
2018-05-16T12:10:00Z  0.19370286314952234   0.7853981633974483
```

The query returns the arctangents of all numeric field values in the `flight_data` measurement that match the `/ft/` regular expression divided by values in the `distance_ft` field key.
The `flight_data` measurement has two matching numeric fields: `altitude_ft` and `distance_ft`.
-->

{{% /expand %}}

{{% expand "Calculate the arctangents of field values and include several clauses" %}}

```sql
> SELECT ATAN2("altitude_ft", "distance_ft") FROM "flight_data" WHERE time >= '2018-05-16T12:01:00Z' AND time <= '2018-05-16T12:10:00Z' ORDER BY time DESC LIMIT 4 OFFSET 2

name: flight_data
time                  atan2
----                  -----
2018-05-16T12:08:00Z  0.1671059946640312
2018-05-16T12:07:00Z  0.14923587589682233
2018-05-16T12:06:00Z  0.13176409347584003
2018-05-16T12:05:00Z  0.11490822875441563
```

The query returns the arctangent of field values associated with the `altitude_ft` field key divided by the `distance_ft` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2018-05-16T12:10:00Z` and `2018-05-16T12:10:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT ATAN2(<function()>, <function()>) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `ATAN2()` function to those results.

`ATAN2()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate arctangents of mean values" %}}

```sql
> SELECT ATAN2(MEAN("altitude_ft"), MEAN("distance_ft")) FROM "flight_data" WHERE time >= '2018-05-16T12:01:00Z' AND time <= '2018-05-16T13:01:00Z' GROUP BY time(12m)

name: flight_data
time                  atan2
----                  -----
2018-05-16T12:00:00Z  0.133815587896842
2018-05-16T12:12:00Z  0.2662716308351908
2018-05-16T12:24:00Z  0.2958845306108965
2018-05-16T12:36:00Z  0.23783439588429497
2018-05-16T12:48:00Z  0.1906803720242831
2018-05-16T13:00:00Z  0.17291511946158172
```

The query returns the argtangents of [average](#mean) `altitude_ft`s divided by average `distance_ft`s. Averages are calculated at 12-minute intervals.

To get those results, InfluxDB first calculates the average `altitude_ft`s and `distance_ft` at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `ATAN2()`:
^
```sql
> SELECT MEAN("altitude_ft"), MEAN("distance_ft") FROM "flight_data" WHERE time >= '2018-05-16T12:01:00Z' AND time <= '2018-05-16T13:01:00Z' GROUP BY time(12m)

name: flight_data
time                  mean                mean_1
----                  ----                ------
2018-05-16T12:00:00Z  8674                64433.181818181816
2018-05-16T12:12:00Z  26419.833333333332  96865.25
2018-05-16T12:24:00Z  40337.416666666664  132326.41666666666
2018-05-16T12:36:00Z  41149.583333333336  169743.16666666666
2018-05-16T12:48:00Z  41230.416666666664  213600.91666666666
2018-05-16T13:00:00Z  41184.5             235799
```

InfluxDB then calculates the arctangents of those averages.

{{% /expand %}}

{{< /expand-wrapper >}}


## CEIL()

Returns the subsequent value rounded up to the nearest integer.

### Basic syntax

```
SELECT CEIL( [ * | <field_key> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`CEIL(field_key)`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key) rounded up to the nearest integer.

<!-- `CEIL(/regular_expression/)`  
Returns the field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/) rounded up to the nearest integer. -->

`CEIL(*)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement) rounded up to the nearest integer.

`CEIL()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `CEIL()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  water_level
----                  -----------
2015-08-18T00:00:00Z  2.064
2015-08-18T00:06:00Z  2.116
2015-08-18T00:12:00Z  2.028
2015-08-18T00:18:00Z  2.126
2015-08-18T00:24:00Z  2.041
2015-08-18T00:30:00Z  2.051
```

{{< expand-wrapper >}}

{{% expand "Calculate the ceiling of field values associated with a field key" %}}

```sql
> SELECT CEIL("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  ceil
----                  ----
2015-08-18T00:00:00Z  3
2015-08-18T00:06:00Z  3
2015-08-18T00:12:00Z  3
2015-08-18T00:18:00Z  3
2015-08-18T00:24:00Z  3
2015-08-18T00:30:00Z  3
```

The query returns field values in the `water_level` field key in the `h2o_feet` measurement rounded up to the nearest integer.

{{% /expand %}}

{{% expand "Calculate the ceiling of field values associated with each field key in a measurement" %}}

```sql
> SELECT CEIL(*) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  ceil_water_level
----                  ----------------
2015-08-18T00:00:00Z  3
2015-08-18T00:06:00Z  3
2015-08-18T00:12:00Z  3
2015-08-18T00:18:00Z  3
2015-08-18T00:24:00Z  3
2015-08-18T00:30:00Z  3
```

The query returns field values for each field key that stores numerical values in the `h2o_feet` measurement rounded up to the nearest integer.
The `h2o_feet` measurement has one numerical field: `water_level`.

<!-- ##### Calculate the ceiling of the field values associated with each field key that matches a regular expression
```
> SELECT CEIL(/water/) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                   ceil_water_level
----                   ----------------
2015-08-18T00:00:00Z   3
2015-08-18T00:06:00Z   3
2015-08-18T00:12:00Z   3
2015-08-18T00:18:00Z   3
2015-08-18T00:24:00Z   3
2015-08-18T00:30:00Z   3
```

The query returns field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement rounded up to the nearest integer. -->

{{% /expand %}}

{{% expand "Calculate the ceiling of field values associated with a field key and include several clauses" %}}

```sql
> SELECT CEIL("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2

name: h2o_feet
time                  ceil
----                  ----
2015-08-18T00:18:00Z  3
2015-08-18T00:12:00Z  3
2015-08-18T00:06:00Z  3
2015-08-18T00:00:00Z  3
```

The query returns field values associated with the `water_level` field key rounded up to the nearest integer.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}



### Advanced syntax

```
SELECT CEIL(<function>( [ * | <field_key> | /<regular_expression>/ ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `CEIL()` function to those results.

`CEIL()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate mean values rounded up to the nearest integer" %}}

```sql
> SELECT CEIL(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                  ceil
----                  ----
2015-08-18T00:00:00Z  3
2015-08-18T00:12:00Z  3
2015-08-18T00:24:00Z  3
```

The query returns the [average](#mean) `water_level`s that are calculated at 12-minute intervals and rounds them up to the nearest integer.

To get those results, InfluxDB first calculates the average `water_level`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `CEIL()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
2015-08-18T00:24:00Z   2.0460000000000003
```

InfluxDB then rounds those averages up to the nearest integer.

{{% /expand %}}

{{< /expand-wrapper >}}

## COS()

Returns the cosine of the field value.

### Basic syntax

```
SELECT COS( [ * | <field_key> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`COS(field_key)`  
Returns the cosine of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

<!-- `COS(/regular_expression/)`  
Returns the cosine of field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/). -->

`COS(*)`  
Returns the cosine of field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`COS()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `COS()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):
^
```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  water_level
----                  -----------
2015-08-18T00:00:00Z  2.064
2015-08-18T00:06:00Z  2.116
2015-08-18T00:12:00Z  2.028
2015-08-18T00:18:00Z  2.126
2015-08-18T00:24:00Z  2.041
2015-08-18T00:30:00Z  2.051
```

{{< expand-wrapper >}}

{{% expand "Calculate the cosine of field values associated with a field key" %}}

```sql
> SELECT COS("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  cos
----                  ---
2015-08-18T00:00:00Z  -0.47345017433543124
2015-08-18T00:06:00Z  -0.5185922462666872
2015-08-18T00:12:00Z  -0.4414407189100776
2015-08-18T00:18:00Z  -0.5271163912192579
2015-08-18T00:24:00Z  -0.45306786455514825
2015-08-18T00:30:00Z  -0.4619598230611262
```

The query returns cosine of field values in the `water_level` field key in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the cosine of field values associated with each field key in a measurement" %}}

```sql
> SELECT COS(*) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  cos_water_level
----                  ---------------
2015-08-18T00:00:00Z  -0.47345017433543124
2015-08-18T00:06:00Z  -0.5185922462666872
2015-08-18T00:12:00Z  -0.4414407189100776
2015-08-18T00:18:00Z  -0.5271163912192579
2015-08-18T00:24:00Z  -0.45306786455514825
2015-08-18T00:30:00Z  -0.4619598230611262
```

The query returns cosine of field values for each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

<!-- ##### Calculate the cosine of field values associated with each field key that matches a regular expression
```
> SELECT COS(/water/) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  cos
----                  ---
2015-08-18T00:00:00Z  -0.47345017433543124
2015-08-18T00:06:00Z  -0.5185922462666872
2015-08-18T00:12:00Z  -0.4414407189100776
2015-08-18T00:18:00Z  -0.5271163912192579
2015-08-18T00:24:00Z  -0.45306786455514825
2015-08-18T00:30:00Z  -0.4619598230611262
```

The query returns cosine of field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement. -->

{{% /expand %}}

{{% expand "Calculate the cosine of field values associated with a field key and include several clauses" %}}

```sql
> SELECT COS("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2

name: h2o_feet
time                  cos
----                  ---
2015-08-18T00:18:00Z  -0.5271163912192579
2015-08-18T00:12:00Z  -0.4414407189100776
2015-08-18T00:06:00Z  -0.5185922462666872
2015-08-18T00:00:00Z  -0.47345017433543124
```

The query returns cosine of field values associated with the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT COS(<function>( [ * | <field_key> ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `COS()` function to those results.

`COS()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the cosine of mean values" %}}

```sql
> SELECT COS(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                  cos
----                  ---
2015-08-18T00:00:00Z  -0.49618891270599885
2015-08-18T00:12:00Z  -0.4848605136571181
2015-08-18T00:24:00Z  -0.4575195627907578
```

The query returns cosine of [average](#mean) `water_level`s that are calculated at 12-minute intervals.

To get those results, InfluxDB first calculates the average `water_level`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `COS()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
2015-08-18T00:24:00Z   2.0460000000000003
```

InfluxDB then calculates cosine of those averages.

{{% /expand %}}

{{< /expand-wrapper >}}

## CUMULATIVE_SUM()

Returns the running total of subsequent [field values](/influxdb/v2.4/reference/glossary/#field-value).

### Basic syntax

```
SELECT CUMULATIVE_SUM( [ * | <field_key> | /<regular_expression>/ ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`CUMULATIVE_SUM(field_key)`  
Returns the running total of subsequent field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

`CUMULATIVE_SUM(/regular_expression/)`  
Returns the running total of subsequent field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/).

`CUMULATIVE_SUM(*)`  
Returns the running total of subsequent field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`CUMULATIVE_SUM()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `CUMULATIVE_SUM()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                   water_level
----                   -----------
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   2.116
2015-08-18T00:12:00Z   2.028
2015-08-18T00:18:00Z   2.126
2015-08-18T00:24:00Z   2.041
2015-08-18T00:30:00Z   2.051
```

{{< expand-wrapper >}}

{{% expand "Calculate the cumulative sum of the field values associated with a field key" %}}

```sql
> SELECT CUMULATIVE_SUM("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                   cumulative_sum
----                   --------------
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   4.18
2015-08-18T00:12:00Z   6.208
2015-08-18T00:18:00Z   8.334
2015-08-18T00:24:00Z   10.375
2015-08-18T00:30:00Z   12.426
```

The query returns the running total of the field values in the `water_level` field key and in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the cumulative sum of the field values associated with each field key in a measurement" %}}

```sql
> SELECT CUMULATIVE_SUM(*) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                   cumulative_sum_water_level
----                   --------------------------
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   4.18
2015-08-18T00:12:00Z   6.208
2015-08-18T00:18:00Z   8.334
2015-08-18T00:24:00Z   10.375
2015-08-18T00:30:00Z   12.426
```

The query returns the running total of the field values for each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

{{% /expand %}}

{{% expand "Calculate the cumulative sum of the field values associated with each field key that matches a regular expression" %}}

```sql
> SELECT CUMULATIVE_SUM(/water/) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                   cumulative_sum_water_level
----                   --------------------------
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   4.18
2015-08-18T00:12:00Z   6.208
2015-08-18T00:18:00Z   8.334
2015-08-18T00:24:00Z   10.375
2015-08-18T00:30:00Z   12.426
```

The query returns the running total of the field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the cumulative sum of the field values associated with a field key and include several clauses" %}}

```sql
> SELECT CUMULATIVE_SUM("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2

name: h2o_feet
time                  cumulative_sum
----                  --------------
2015-08-18T00:18:00Z  6.218
2015-08-18T00:12:00Z  8.246
2015-08-18T00:06:00Z  10.362
2015-08-18T00:00:00Z  12.426
```

The query returns the running total of the field values associated with the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT CUMULATIVE_SUM(<function>( [ * | <field_key> | /<regular_expression>/ ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `CUMULATIVE_SUM()` function to those results.

`CUMULATIVE_SUM()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the cumulative sum of mean values" %}}

```sql
> SELECT CUMULATIVE_SUM(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   cumulative_sum
----                   --------------
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   4.167
2015-08-18T00:24:00Z   6.213
```

The query returns the running total of [average](#mean) `water_level`s that are calculated at 12-minute intervals.

To get those results, InfluxDB first calculates the average `water_level`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `CUMULATIVE_SUM()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
2015-08-18T00:24:00Z   2.0460000000000003
```

Next, InfluxDB calculates the running total of those averages.
The second point in the final results (`4.167`) is the sum of `2.09` and `2.077`
and the third point (`6.213`) is the sum of `2.09`, `2.077`, and `2.0460000000000003`.

{{% /expand %}}

{{< /expand-wrapper >}}

## DERIVATIVE()

Returns the rate of change between subsequent [field values](/influxdb/v2.4/reference/glossary/#field-value).

### Basic syntax

```
SELECT DERIVATIVE( [ * | <field_key> | /<regular_expression>/ ] [ , <unit> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

InfluxDB calculates the difference between subsequent field values and converts those results into the rate of change per `unit`.
The `unit` argument is an integer followed by a [duration literal](/enterprise_influxdb/v1.9/query_language/spec/#literals) and it is optional.
If the query does not specify the `unit` the unit defaults to one second (`1s`).

`DERIVATIVE(field_key)`  
Returns the rate of change between subsequent field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

`DERIVATIVE(/regular_expression/)`  
Returns the rate of change between subsequent field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/).

`DERIVATIVE(*)`  
Returns the rate of change between subsequent field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`DERIVATIVE()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax-1) section for how to use `DERIVATIVE()` with a `GROUP BY time()` clause.

### Examples

Examples 1-5 use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z'

name: h2o_feet
time                   water_level
----                   -----------
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   2.116
2015-08-18T00:12:00Z   2.028
2015-08-18T00:18:00Z   2.126
2015-08-18T00:24:00Z   2.041
2015-08-18T00:30:00Z   2.051
```

{{< expand-wrapper >}}

{{% expand "Calculate the derivative between the field values associated with a field key" %}}

```sql
> SELECT DERIVATIVE("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z'

name: h2o_feet
time                   derivative
----                   ----------
2015-08-18T00:06:00Z   0.00014444444444444457
2015-08-18T00:12:00Z   -0.00024444444444444465
2015-08-18T00:18:00Z   0.0002722222222222218
2015-08-18T00:24:00Z   -0.000236111111111111
2015-08-18T00:30:00Z   2.777777777777842e-05
```

The query returns the one-second rate of change between the field values associated with the `water_level` field key and in the `h2o_feet` measurement.

The first result (`0.00014444444444444457`) is the one-second rate of change between the first two subsequent field values in the raw data.
InfluxDB calculates the difference between the field values and normalizes that value to the one-second rate of change:

```
(2.116 - 2.064) / (360s / 1s)
--------------    ----------
       |               |
       |          the difference between the field values' timestamps / the default unit
second field value - first field value
```

{{% /expand %}}

{{% expand "Calculate the derivative between the field values associated with a field key and specify the unit option" %}}

```sql
> SELECT DERIVATIVE("water_level",6m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z'

name: h2o_feet
time			derivative
----			----------
2015-08-18T00:06:00Z	0.052000000000000046
2015-08-18T00:12:00Z	-0.08800000000000008
2015-08-18T00:18:00Z	0.09799999999999986
2015-08-18T00:24:00Z	-0.08499999999999996
2015-08-18T00:30:00Z	0.010000000000000231
```

The query returns the six-minute rate of change between the field values associated with the `water_level` field key and in the `h2o_feet` measurement.

The first result (`0.052000000000000046`) is the six-minute rate of change between the first two subsequent field values in the raw data.
InfluxDB calculates the difference between the field values and normalizes that value to the six-minute rate of change:

```
(2.116 - 2.064) / (6m / 6m)
--------------    ----------
       |              |
       |          the difference between the field values' timestamps / the specified unit
second field value - first field value
```

{{% /expand %}}

{{% expand "Calculate the derivative between the field values associated with each field key in a measurement and specify the unit option" %}}

```sql
> SELECT DERIVATIVE(*,3m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z'


name: h2o_feet
time                   derivative_water_level
----                   ----------------------
2015-08-18T00:06:00Z   0.026000000000000023
2015-08-18T00:12:00Z   -0.04400000000000004
2015-08-18T00:18:00Z   0.04899999999999993
2015-08-18T00:24:00Z   -0.04249999999999998
2015-08-18T00:30:00Z   0.0050000000000001155
```

The query returns the three-minute rate of change between the field values associated with each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

The first result (`0.026000000000000023`) is the three-minute rate of change between the first two subsequent field values in the raw data.
InfluxDB calculates the difference between the field values and normalizes that value to the three-minute rate of change:

```
(2.116 - 2.064) / (6m / 3m)
--------------    ----------
       |              |
       |          the difference between the field values' timestamps / the specified unit
second field value - first field value
```

{{% /expand %}}

{{% expand "Calculate the derivative between the field values associated with each field key that matches a regular expression and specify the unit option" %}}

```sql
> SELECT DERIVATIVE(/water/,2m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z'

name: h2o_feet
time                   derivative_water_level
----                   ----------------------
2015-08-18T00:06:00Z   0.01733333333333335
2015-08-18T00:12:00Z   -0.02933333333333336
2015-08-18T00:18:00Z   0.03266666666666662
2015-08-18T00:24:00Z   -0.02833333333333332
2015-08-18T00:30:00Z   0.0033333333333334103
```

The query returns the two-minute rate of change between the field values associated with each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement.

The first result (`0.01733333333333335`) is the two-minute rate of change between the first two subsequent field values in the raw data.
InfluxDB calculates the difference between the field values and normalizes that value to the two-minute rate of change:

```
(2.116 - 2.064) / (6m / 2m)
--------------    ----------
       |              |
       |          the difference between the field values' timestamps / the specified unit
second field value - first field value
```

{{% /expand %}}

{{% expand "Calculate the derivative between the field values associated with a field key and include several clauses" %}}

```sql
> SELECT DERIVATIVE("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' ORDER BY time DESC LIMIT 1 OFFSET 2

name: h2o_feet
time                   derivative
----                   ----------
2015-08-18T00:12:00Z   -0.0002722222222222218
```

The query returns the one-second rate of change between the field values associated with the `water_level` field key and in the `h2o_feet` measurement.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to one and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

The only result (`-0.0002722222222222218`) is the one-second rate of change between the relevant subsequent field values in the raw data.
InfluxDB calculates the difference between the field values and normalizes that value to the one-second rate of change:

```
(2.126 - 2.028) / (360s / 1s)
--------------    ----------
       |              |
       |          the difference between the field values' timestamps / the default unit
second field value - first field value
```

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT DERIVATIVE(<function> ([ * | <field_key> | /<regular_expression>/ ]) [ , <unit> ] ) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `DERIVATIVE()` function to those results.

The `unit` argument is an integer followed by a [duration literal](/enterprise_influxdb/v1.9/query_language/spec/#literals) and it is optional.
If the query does not specify the `unit` the `unit` defaults to the `GROUP BY time()` interval.
Note that this behavior is different from the [basic syntax's](#basic-syntax-1) default behavior.

`DERIVATIVE()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples
{{< expand-wrapper >}}

{{% expand "Calculate the derivative of mean values" %}}

```sql
> SELECT DERIVATIVE(MEAN("water_level")) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' GROUP BY time(12m)

name: h2o_feet
time                   derivative
----                   ----------
2015-08-18T00:12:00Z   -0.0129999999999999
2015-08-18T00:24:00Z   -0.030999999999999694
```

The query returns the 12-minute rate of change between [average](#mean) `water_level`s that are calculated at 12-minute intervals.

To get those results, InfluxDB first calculates the average `water_level`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `DERIVATIVE()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' GROUP BY time(12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
2015-08-18T00:24:00Z   2.0460000000000003
```

Next, InfluxDB calculates the 12-minute rate of change between those averages.
The first result (`-0.0129999999999999`) is the 12-minute rate of change between the first two averages.
InfluxDB calculates the difference between the field values and normalizes that value to the 12-minute rate of change.

```
(2.077 - 2.09) / (12m / 12m)
-------------    ----------
       |               |
       |          the difference between the field values' timestamps / the default unit
second field value - first field value
```

{{% /expand %}}

{{% expand "Calculate the derivative of mean values and specify the unit option" %}}

```sql
> SELECT DERIVATIVE(MEAN("water_level"),6m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' GROUP BY time(12m)

name: h2o_feet
time                   derivative
----                   ----------
2015-08-18T00:12:00Z   -0.00649999999999995
2015-08-18T00:24:00Z   -0.015499999999999847
```

The query returns the six-minute rate of change between average `water_level`s that are calculated at 12-minute intervals.

To get those results, InfluxDB first calculates the average `water_level`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `DERIVATIVE()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' GROUP BY time(12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
2015-08-18T00:24:00Z   2.0460000000000003
```

Next, InfluxDB calculates the six-minute rate of change between those averages.
The first result (`-0.00649999999999995`) is the six-minute rate of change between the first two averages.
InfluxDB calculates the difference between the field values and normalizes that value to the six-minute rate of change.

```
(2.077 - 2.09) / (12m / 6m)
-------------    ----------
       |               |
       |          the difference between the field values' timestamps / the specified unit
second field value - first field value
```

{{% /expand %}}

{{< /expand-wrapper >}}

## DIFFERENCE()

Returns the result of subtraction between subsequent [field values](/influxdb/v2.4/reference/glossary/#field-value).

### Syntax

```
SELECT DIFFERENCE( [ * | <field_key> | /<regular_expression>/ ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`DIFFERENCE(field_key)`  
Returns the difference between subsequent field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

`DIFFERENCE(/regular_expression/)`  
Returns the difference between subsequent field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/).

`DIFFERENCE(*)`  
Returns the difference between subsequent field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`DIFFERENCE()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax-2) section for how to use `DIFFERENCE()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                   water_level
----                   -----------
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   2.116
2015-08-18T00:12:00Z   2.028
2015-08-18T00:18:00Z   2.126
2015-08-18T00:24:00Z   2.041
2015-08-18T00:30:00Z   2.051
```

{{< expand-wrapper >}}

{{% expand "Calculate the difference between the field values associated with a field key" %}}

```sql
> SELECT DIFFERENCE("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                   difference
----                   ----------
2015-08-18T00:06:00Z   0.052000000000000046
2015-08-18T00:12:00Z   -0.08800000000000008
2015-08-18T00:18:00Z   0.09799999999999986
2015-08-18T00:24:00Z   -0.08499999999999996
2015-08-18T00:30:00Z   0.010000000000000231
```

The query returns the difference between the subsequent field values in the `water_level` field key and in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the difference between the field values associated with each field key in a measurement" %}}

```sql
> SELECT DIFFERENCE(*) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                   difference_water_level
----                   ----------------------
2015-08-18T00:06:00Z   0.052000000000000046
2015-08-18T00:12:00Z   -0.08800000000000008
2015-08-18T00:18:00Z   0.09799999999999986
2015-08-18T00:24:00Z   -0.08499999999999996
2015-08-18T00:30:00Z   0.010000000000000231
```

The query returns the difference between the subsequent field values for each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

{{% /expand %}}

{{% expand "Calculate the difference between the field values associated with each field key that matches a regular expression" %}}

```sql
> SELECT DIFFERENCE(/water/) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                   difference_water_level
----                   ----------------------
2015-08-18T00:06:00Z   0.052000000000000046
2015-08-18T00:12:00Z   -0.08800000000000008
2015-08-18T00:18:00Z   0.09799999999999986
2015-08-18T00:24:00Z   -0.08499999999999996
2015-08-18T00:30:00Z   0.010000000000000231
```

The query returns the difference between the subsequent field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the difference between the field values associated with a field key and include several clauses" %}}

```sql
> SELECT DIFFERENCE("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 2 OFFSET 2

name: h2o_feet
time                   difference
----                   ----------
2015-08-18T00:12:00Z   -0.09799999999999986
2015-08-18T00:06:00Z   0.08800000000000008
```

The query returns the difference between the subsequent field values in the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
They query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to two and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT DIFFERENCE(<function>( [ * | <field_key> | /<regular_expression>/ ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `DIFFERENCE()` function to those results.

`DIFFERENCE()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the difference between maximum values" %}}

```sql
> SELECT DIFFERENCE(MAX("water_level")) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   difference
----                   ----------
2015-08-18T00:12:00Z   0.009999999999999787
2015-08-18T00:24:00Z   -0.07499999999999973
```

The query returns the difference between [maximum](#max) `water_level`s that are calculated at 12-minute intervals.

To get those results, InfluxDB first calculates the maximum `water_level`s at 12-minute intervals.
This step is the same as using the `MAX()` function with the `GROUP BY time()` clause and without `DIFFERENCE()`:

```sql
> SELECT MAX("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   max
----                   ---
2015-08-18T00:00:00Z   2.116
2015-08-18T00:12:00Z   2.126
2015-08-18T00:24:00Z   2.051
```

Next, InfluxDB calculates the difference between those maximum values.
The first point in the final results (`0.009999999999999787`) is the difference between `2.126` and `2.116`, and the second point in the final results (`-0.07499999999999973`) is the difference between `2.051` and `2.126`.

{{% /expand %}}

{{< /expand-wrapper >}}

## ELAPSED()

Returns the difference between subsequent [field value's](/influxdb/v2.4/reference/glossary/#field-value) timestamps.

### Syntax

```
SELECT ELAPSED( [ * | <field_key> | /<regular_expression>/ ] [ , <unit> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

InfluxDB calculates the difference between subsequent timestamps.
The `unit` option is an integer followed by a [duration literal](/enterprise_influxdb/v1.9/query_language/spec/#literals) and it determines the unit of the returned difference.
If the query does not specify the `unit` option the query returns the difference between timestamps in nanoseconds.

`ELAPSED(field_key)`  
Returns the difference between subsequent timestamps associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

`ELAPSED(/regular_expression/)`  
Returns the difference between subsequent timestamps associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/).

`ELAPSED(*)`  
Returns the difference between subsequent timestamps associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`ELAPSED()` supports all field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

### Examples

The examples use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:12:00Z'

name: h2o_feet
time                   water_level
----                   -----------
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   2.116
2015-08-18T00:12:00Z   2.028
```

{{< expand-wrapper >}}

{{% expand "Calculate the elapsed time between field values associated with a field key" %}}

```sql
> SELECT ELAPSED("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:12:00Z'

name: h2o_feet
time                   elapsed
----                   -------
2015-08-18T00:06:00Z   360000000000
2015-08-18T00:12:00Z   360000000000
```

The query returns the difference (in nanoseconds) between subsequent timestamps in the `water_level` field key and in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the elapsed time between field values associated with a field key and specify the unit option" %}}

```sql
> SELECT ELAPSED("water_level",1m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:12:00Z'

name: h2o_feet
time                   elapsed
----                   -------
2015-08-18T00:06:00Z   6
2015-08-18T00:12:00Z   6
```

The query returns the difference (in minutes) between subsequent timestamps in the `water_level` field key and in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the elapsed time between field values associated with each field key in a measurement and specify the unit option" %}}

```sql
> SELECT ELAPSED(*,1m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:12:00Z'

name: h2o_feet
time                   elapsed_level description   elapsed_water_level
----                   -------------------------   -------------------
2015-08-18T00:06:00Z   6                           6
2015-08-18T00:12:00Z   6                           6
```

The query returns the difference (in minutes) between subsequent timestamps associated with each field key in the `h2o_feet`
measurement.
The `h2o_feet` measurement has two field keys: `level description` and `water_level`.

{{% /expand %}}

{{% expand "Calculate the elapsed time between field values associated with each field key that matches a regular expression and specify the unit option" %}}

```sql
> SELECT ELAPSED(/level/,1s) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:12:00Z'

name: h2o_feet
time                   elapsed_level description   elapsed_water_level
----                   -------------------------   -------------------
2015-08-18T00:06:00Z   360                         360
2015-08-18T00:12:00Z   360                         360
```

The query returns the difference (in seconds) between subsequent timestamps associated with each field key that includes the word `level` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the elapsed time between field values associated with a field key and include several clauses" %}}

```sql
> SELECT ELAPSED("water_level",1ms) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:12:00Z' ORDER BY time DESC LIMIT 1 OFFSET 1

name: h2o_feet
time                   elapsed
----                   -------
2015-08-18T00:00:00Z   -360000
```

The query returns the difference (in milliseconds) between subsequent timestamps in the `water_level` field key and in the `h2o_feet` measurement.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:12:00Z` and sorts timestamps in [descending order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to one and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by one point.

Notice that the result is negative; the [`ORDER BY time DESC` clause](/influxdb/v2.4/query-data/influxql/explore-data/order-by/) sorts timestamps in descending order so `ELAPSED()` calculates the difference between timestamps in reverse order.

{{% /expand %}}

{{< /expand-wrapper >}}

## Common Issues with ELAPSED()

### ELAPSED() and units greater than the elapsed time

InfluxDB returns `0` if the `unit` option is greater than the difference between the timestamps.

### Example

The timestamps in the `h2o_feet` measurement occur at six-minute intervals.
If the query sets the `unit` option to one hour, InfluxDB returns `0`:

```sql
> SELECT ELAPSED("water_level",1h) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:12:00Z'

name: h2o_feet
time                   elapsed
----                   -------
2015-08-18T00:06:00Z   0
2015-08-18T00:12:00Z   0
```

### ELAPSED() with GROUP BY time() clauses

The `ELAPSED()` function supports the [`GROUP BY time()` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) but the query results aren't particularly useful.
Currently, an `ELAPSED()` query with a nested function and a `GROUP BY time()` clause simply returns the interval specified in the `GROUP BY time()` clause.

The `GROUP BY time()` clause determines the timestamps in the results; each timestamp marks the start of a time interval.
That behavior also applies to nested selector functions (like [`FIRST()`](#first) or [`MAX()`](#max)) which would, in all other cases, return a specific timestamp from the raw data.
Because the `GROUP BY time()` clause overrides the original timestamps, the `ELAPSED()` calculation always returns the same value as the `GROUP BY time()` interval.

### Example

In the codeblock below, the first query attempts to use the `ELAPSED()` function with a `GROUP BY time()` clause to find the time elapsed (in minutes) between [minimum](#min) `water_level`s.
The query returns 12 minutes for both time intervals.

To get those results, InfluxDB first calculates the minimum `water_level`s at 12-minute intervals.
The second query in the codeblock shows the results of that step.
The step is the same as using the `MIN()` function with the `GROUP BY time()` clause and without the `ELAPSED()` function.
Notice that the timestamps returned by the second query are 12 minutes apart.
In the raw data, the first result (`2.057`) occurs at `2015-08-18T00:42:00Z` but the `GROUP BY time()` clause overrides that original timestamp.
Because the timestamps are determined by the `GROUP BY time()` interval and not by the original data, the `ELAPSED()` calculation always returns the same value as the `GROUP BY time()` interval.

```sql
> SELECT ELAPSED(MIN("water_level"),1m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:36:00Z' AND time <= '2015-08-18T00:54:00Z' GROUP BY time(12m)

name: h2o_feet
time                   elapsed
----                   -------
2015-08-18T00:36:00Z   12
2015-08-18T00:48:00Z   12

> SELECT MIN("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:36:00Z' AND time <= '2015-08-18T00:54:00Z' GROUP BY time(12m)

name: h2o_feet
time                   min
----                   ---
2015-08-18T00:36:00Z   2.057    <--- Actually occurs at 2015-08-18T00:42:00Z
2015-08-18T00:48:00Z   1.991
```

## EXP()

Returns the exponential of the field value.

### Syntax

```
SELECT EXP( [ * | <field_key> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`EXP(field_key)`  
Returns the exponential of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

<!-- `EXP(/regular_expression/)`  
Returns the exponential of field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/). -->

`EXP(*)`  
Returns the exponential of field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`EXP()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `EXP()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  water_level
----                  -----------
2015-08-18T00:00:00Z  2.064
2015-08-18T00:06:00Z  2.116
2015-08-18T00:12:00Z  2.028
2015-08-18T00:18:00Z  2.126
2015-08-18T00:24:00Z  2.041
2015-08-18T00:30:00Z  2.051
```

{{< expand-wrapper >}}

{{% expand "Calculate the exponential of field values associated with a field key" %}}

```sql
> SELECT EXP("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  exp
----                  ---
2015-08-18T00:00:00Z  7.877416541092307
2015-08-18T00:06:00Z  8.297879498060171
2015-08-18T00:12:00Z  7.598873404088091
2015-08-18T00:18:00Z  8.381274573459967
2015-08-18T00:24:00Z  7.6983036546645645
2015-08-18T00:30:00Z  7.775672892658607
```

The query returns the exponential of field values in the `water_level` field key in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the exponential of field values associated with each field key in a measurement" %}}

```sql
> SELECT EXP(*) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  exp_water_level
----                  ---------------
2015-08-18T00:00:00Z  7.877416541092307
2015-08-18T00:06:00Z  8.297879498060171
2015-08-18T00:12:00Z  7.598873404088091
2015-08-18T00:18:00Z  8.381274573459967
2015-08-18T00:24:00Z  7.6983036546645645
2015-08-18T00:30:00Z  7.775672892658607
```

The query returns the exponential of field values for each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

<!-- ##### Calculate the exponential of field values associated with each field key that matches a regular expression
```
> SELECT EXP(/water/) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  exp_water_level
----                  ---------------
2015-08-18T00:00:00Z  7.877416541092307
2015-08-18T00:06:00Z  8.297879498060171
2015-08-18T00:12:00Z  7.598873404088091
2015-08-18T00:18:00Z  8.381274573459967
2015-08-18T00:24:00Z  7.6983036546645645
2015-08-18T00:30:00Z  7.775672892658607
```
```

The query returns the exponential of field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement.
-->

{{% /expand %}}

{{% expand "Calculate the exponential of field values associated with a field key and include several clauses" %}}

```sql
> SELECT EXP("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2

name: h2o_feet
time                  exp
----                  ---
2015-08-18T00:18:00Z  8.381274573459967
2015-08-18T00:12:00Z  7.598873404088091
2015-08-18T00:06:00Z  8.297879498060171
2015-08-18T00:00:00Z  7.877416541092307
```

The query returns the exponentials of field values associated with the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT EXP(<function>( [ * | <field_key> ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `EXP()` function to those results.

`EXP()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the exponential of mean values" %}}

```sql
> SELECT EXP(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                  exp
----                  ---
2015-08-18T00:00:00Z  8.084915164305059
2015-08-18T00:12:00Z  7.980491491670466
2015-08-18T00:24:00Z  7.736891562315577
```

The query returns the exponential of [average](#mean) `water_level`s that are calculated at 12-minute intervals.

To get those results, InfluxDB first calculates the average `water_level`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `EXP()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
2015-08-18T00:24:00Z   2.0460000000000003
```

InfluxDB then calculates the exponentials of those averages.

{{% /expand %}}

{{< /expand-wrapper >}}

## FLOOR()

Returns the subsequent value rounded down to the nearest integer.

### Syntax

```
SELECT FLOOR( [ * | <field_key> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`FLOOR(field_key)`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key) rounded down to the nearest integer.

<!-- `FLOOR(/regular_expression/)`  
Returns the field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/) rounded down to the nearest integer. -->

`FLOOR(*)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement) rounded down to the nearest integer.

`FLOOR()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `FLOOR()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  water_level
----                  -----------
2015-08-18T00:00:00Z  2.064
2015-08-18T00:06:00Z  2.116
2015-08-18T00:12:00Z  2.028
2015-08-18T00:18:00Z  2.126
2015-08-18T00:24:00Z  2.041
2015-08-18T00:30:00Z  2.051
```

{{< expand-wrapper >}}

{{% expand "Calculate the floor of field values associated with a field key" %}}

```sql
> SELECT FLOOR("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  floor
----                  -----
2015-08-18T00:00:00Z  2
2015-08-18T00:06:00Z  2
2015-08-18T00:12:00Z  2
2015-08-18T00:18:00Z  2
2015-08-18T00:24:00Z  2
2015-08-18T00:30:00Z  2
```

The query returns field values in the `water_level` field key in the `h2o_feet` measurement rounded down to the nearest integer.

{{% /expand %}}

{{% expand "Calculate the floor of field values associated with each field key in a measurement" %}}

```sql
> SELECT FLOOR(*) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  floor_water_level
----                  -----------------
2015-08-18T00:00:00Z  2
2015-08-18T00:06:00Z  2
2015-08-18T00:12:00Z  2
2015-08-18T00:18:00Z  2
2015-08-18T00:24:00Z  2
2015-08-18T00:30:00Z  2
```

The query returns field values for each field key that stores numerical values in the `h2o_feet` measurement rounded down to the nearest integer.
The `h2o_feet` measurement has one numerical field: `water_level`.

<!-- ##### Calculate the floor of the field values associated with each field key that matches a regular expression
```
> SELECT FLOOR(/water/) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                   floor_water_level
----                   -----------------
2015-08-18T00:00:00Z   2
2015-08-18T00:06:00Z   2
2015-08-18T00:12:00Z   2
2015-08-18T00:18:00Z   2
2015-08-18T00:24:00Z   2
2015-08-18T00:30:00Z   2
```

The query returns field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement rounded down to the nearest integer. -->

{{% /expand %}}

{{% expand "Calculate the floor of field values associated with a field key and include several clauses" %}}

```sql
> SELECT FLOOR("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2

name: h2o_feet
time                  floor
----                  -----
2015-08-18T00:18:00Z  2
2015-08-18T00:12:00Z  2
2015-08-18T00:06:00Z  2
2015-08-18T00:00:00Z  2
```

The query returns field values associated with the `water_level` field key rounded down to the nearest integer.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced Syntax

```
SELECT FLOOR(<function>( [ * | <field_key> ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `FLOOR()` function to those results.

`FLOOR()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate mean values rounded down to the nearest integer" %}}

```sql
> SELECT FLOOR(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                  floor
----                  -----
2015-08-18T00:00:00Z  2
2015-08-18T00:12:00Z  2
2015-08-18T00:24:00Z  2
```

The query returns the [average](#mean) `water_level`s that are calculated at 12-minute intervals and rounds them up to the nearest integer.

To get those results, InfluxDB first calculates the average `water_level`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `FLOOR()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
2015-08-18T00:24:00Z   2.0460000000000003
```

InfluxDB then rounds those averages down to the nearest integer.

{{% /expand %}}

{{< /expand-wrapper >}}

## HISTOGRAM()

_InfluxQL does not currently support histogram generation.
For information about creating histograms with data stored in InfluxDB, see
[Flux's `histogram()` function](/{{< latest "flux" >}}/stdlib/universe/histogram)._

## LN()

Returns the natural logarithm of the field value.

### Syntax

```
SELECT LN( [ * | <field_key> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`LN(field_key)`  
Returns the natural logarithm of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

<!-- `LN(/regular_expression/)`  
Returns the natural logarithm of field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/). -->

`LN(*)`  
Returns the natural logarithm of field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`LN()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `LN()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  water_level
----                  -----------
2015-08-18T00:00:00Z  2.064
2015-08-18T00:06:00Z  2.116
2015-08-18T00:12:00Z  2.028
2015-08-18T00:18:00Z  2.126
2015-08-18T00:24:00Z  2.041
2015-08-18T00:30:00Z  2.051
```

{{< expand-wrapper >}}

{{% expand "Calculate the natural logarithm of field values associated with a field key" %}}

```sql
> SELECT LN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  ln
----                  --
2015-08-18T00:00:00Z  0.7246458476193163
2015-08-18T00:06:00Z  0.749527513996053
2015-08-18T00:12:00Z  0.7070500857289368
2015-08-18T00:18:00Z  0.7542422799197561
2015-08-18T00:24:00Z  0.7134398838277077
2015-08-18T00:30:00Z  0.7183274790902436
```

The query returns the natural logarithm of field values in the `water_level` field key in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the natural logarithm of field values associated with each field key in a measurement" %}}

```sql
> SELECT LN(*) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  ln_water_level
----                  --------------
2015-08-18T00:00:00Z  0.7246458476193163
2015-08-18T00:06:00Z  0.749527513996053
2015-08-18T00:12:00Z  0.7070500857289368
2015-08-18T00:18:00Z  0.7542422799197561
2015-08-18T00:24:00Z  0.7134398838277077
2015-08-18T00:30:00Z  0.7183274790902436
```

The query returns the natural logarithm of field values for each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

<!-- ##### Calculate the natural logarithm of field values associated with each field key that matches a regular expression
```
> SELECT LN(/water/) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  ln_water_level
----                  --------------
2015-08-18T00:00:00Z  0.7246458476193163
2015-08-18T00:06:00Z  0.749527513996053
2015-08-18T00:12:00Z  0.7070500857289368
2015-08-18T00:18:00Z  0.7542422799197561
2015-08-18T00:24:00Z  0.7134398838277077
2015-08-18T00:30:00Z  0.7183274790902436
```
```

The query returns the natural logarithm of field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement. -->

{{% /expand %}}

{{% expand "Calculate the natural logarithm of field values associated with a field key and include several clauses" %}}

```sql
> SELECT LN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2

name: h2o_feet
time                  ln
----                  --
2015-08-18T00:18:00Z  0.7542422799197561
2015-08-18T00:12:00Z  0.7070500857289368
2015-08-18T00:06:00Z  0.749527513996053
2015-08-18T00:00:00Z  0.7246458476193163
```

The query returns the natural logarithms of field values associated with the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT LN(<function>( [ * | <field_key> ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `LN()` function to those results.

`LN()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the natural logarithm of mean values" %}}

```sql
> SELECT LN(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                  ln
----                  --
2015-08-18T00:00:00Z  0.7371640659767196
2015-08-18T00:12:00Z  0.7309245448939752
2015-08-18T00:24:00Z  0.7158866675294349
```

The query returns the natural logarithm of [average](#mean) `water_level`s that are calculated at 12-minute intervals.

To get those results, InfluxDB first calculates the average `water_level`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `LN()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
2015-08-18T00:24:00Z   2.0460000000000003
```

InfluxDB then calculates the natural logarithms of those averages.

{{% /expand %}}

{{< /expand-wrapper >}}

## LOG()

Returns the logarithm of the field value with base `b`.

### Basic syntax

```
SELECT LOG( [ * | <field_key> ], <b> ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`LOG(field_key, b)`  
Returns the logarithm of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key) with base `b`.

<!-- `LOG(/regular_expression/, b)`  
Returns the logarithm of field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/) with base `b`. -->

`LOG(*, b)`  
Returns the logarithm of field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement) with base `b`.

`LOG()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `LOG()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  water_level
----                  -----------
2015-08-18T00:00:00Z  2.064
2015-08-18T00:06:00Z  2.116
2015-08-18T00:12:00Z  2.028
2015-08-18T00:18:00Z  2.126
2015-08-18T00:24:00Z  2.041
2015-08-18T00:30:00Z  2.051
```

{{< expand-wrapper >}}

{{% expand "Calculate the logarithm base 4 of field values associated with a field key" %}}

```sql
> SELECT LOG("water_level", 4) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  log
----                  ---
2015-08-18T00:00:00Z  0.5227214853805835
2015-08-18T00:06:00Z  0.5406698137259695
2015-08-18T00:12:00Z  0.5100288261706268
2015-08-18T00:18:00Z  0.5440707984345088
2015-08-18T00:24:00Z  0.5146380911853161
2015-08-18T00:30:00Z  0.5181637459088826
```

The query returns the logarithm base 4 of field values in the `water_level` field key in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the logarithm base 4 of field values associated with each field key in a measurement" %}}

```sql
> SELECT LOG(*, 4) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  log_water_level
----                  ---------------
2015-08-18T00:00:00Z  0.5227214853805835
2015-08-18T00:06:00Z  0.5406698137259695
2015-08-18T00:12:00Z  0.5100288261706268
2015-08-18T00:18:00Z  0.5440707984345088
2015-08-18T00:24:00Z  0.5146380911853161
2015-08-18T00:30:00Z  0.5181637459088826
```

The query returns the logarithm base 4 of field values for each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

<!-- ##### Calculate the logarithm base 4 of field values associated with each field key that matches a regular expression
```
> SELECT LOG(/water/) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  log
----                  ---
2015-08-18T00:00:00Z  0.5227214853805835
2015-08-18T00:06:00Z  0.5406698137259695
2015-08-18T00:12:00Z  0.5100288261706268
2015-08-18T00:18:00Z  0.5440707984345088
2015-08-18T00:24:00Z  0.5146380911853161
2015-08-18T00:30:00Z  0.5181637459088826
```
```

The query returns the logarithm base 4 of field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement. -->

{{% /expand %}}

{{% expand "Calculate the logarithm base 4 of field values associated with a field key and include several clauses" %}}

```sql
> SELECT LOG("water_level", 4) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2

name: h2o_feet
time                  log
----                  ---
2015-08-18T00:18:00Z  0.5440707984345088
2015-08-18T00:12:00Z  0.5100288261706268
2015-08-18T00:06:00Z  0.5406698137259695
2015-08-18T00:00:00Z  0.5227214853805835
```

The query returns the logarithm base 4 of field values associated with the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT LOG(<function>( [ * | <field_key> ] ), <b>) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `LOG()` function to those results.

`LOG()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the logarithm base 4 of mean values" %}}

```sql
> SELECT LOG(MEAN("water_level"), 4) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                  log
----                  ---
2015-08-18T00:00:00Z  0.531751471153079
2015-08-18T00:12:00Z  0.5272506080912802
2015-08-18T00:24:00Z  0.5164030725416209
```

The query returns the logarithm base 4 of [average](#mean) `water_level`s that are calculated at 12-minute intervals.

To get those results, InfluxDB first calculates the average `water_level`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `LOG()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
2015-08-18T00:24:00Z   2.0460000000000003
```

InfluxDB then calculates the logarithm base 4 of those averages.

{{% /expand %}}

{{< /expand-wrapper >}}

## LOG2()

Returns the logarithm of the field value to the base 2.

### Basic syntax

```
SELECT LOG2( [ * | <field_key> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`LOG2(field_key)`  
Returns the logarithm of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key) to the base 2.

<!-- `LOG2(/regular_expression/)`  
Returns the logarithm of field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/) to the base 2. -->

`LOG2(*)`  
Returns the logarithm of field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement) to the base 2.

`LOG2()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced syntax](#advanced-syntax) section for how to use `LOG2()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  water_level
----                  -----------
2015-08-18T00:00:00Z  2.064
2015-08-18T00:06:00Z  2.116
2015-08-18T00:12:00Z  2.028
2015-08-18T00:18:00Z  2.126
2015-08-18T00:24:00Z  2.041
2015-08-18T00:30:00Z  2.051
```

{{< expand-wrapper >}}

{{% expand "Calculate the logarithm base 2 of field values associated with a field key" %}}

```sql
> SELECT LOG2("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  log2
----                  ----
2015-08-18T00:00:00Z  1.045442970761167
2015-08-18T00:06:00Z  1.081339627451939
2015-08-18T00:12:00Z  1.0200576523412537
2015-08-18T00:18:00Z  1.0881415968690176
2015-08-18T00:24:00Z  1.0292761823706322
2015-08-18T00:30:00Z  1.0363274918177652
```

The query returns the logarithm base 2 of field values in the `water_level` field key in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the logarithm base 2 of field values associated with each field key in a measurement" %}}

```sql
> SELECT LOG2(*) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  log2_water_level
----                  ----------------
2015-08-18T00:00:00Z  1.045442970761167
2015-08-18T00:06:00Z  1.081339627451939
2015-08-18T00:12:00Z  1.0200576523412537
2015-08-18T00:18:00Z  1.0881415968690176
2015-08-18T00:24:00Z  1.0292761823706322
2015-08-18T00:30:00Z  1.0363274918177652
```

The query returns the logarithm base 2 of field values for each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

<!-- ##### Calculate the logarithm base 2 of field values associated with each field key that matches a regular expression
```
> SELECT LOG2(/water/) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  log2
----                  ----
2015-08-18T00:00:00Z  1.045442970761167
2015-08-18T00:06:00Z  1.081339627451939
2015-08-18T00:12:00Z  1.0200576523412537
2015-08-18T00:18:00Z  1.0881415968690176
2015-08-18T00:24:00Z  1.0292761823706322
2015-08-18T00:30:00Z  1.0363274918177652
```
```

The query returns the logarithm base 2 of field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement. -->

{{% /expand %}}

{{% expand "Calculate the logarithm base 2 of field values associated with a field key and include several clauses" %}}

```sql
> SELECT LOG2("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2

name: h2o_feet
time                  log2
----                  ----
2015-08-18T00:18:00Z  1.0881415968690176
2015-08-18T00:12:00Z  1.0200576523412537
2015-08-18T00:06:00Z  1.081339627451939
2015-08-18T00:00:00Z  1.045442970761167
```

The query returns the logarithm base 2 of field values associated with the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```sql
SELECT LOG2(<function>( [ * | <field_key> ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `LOG2()` function to those results.

`LOG2()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the logarithm base 2 of mean values" %}}

```sql
> SELECT LOG2(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                  log2
----                  ----
2015-08-18T00:00:00Z  1.063502942306158
2015-08-18T00:12:00Z  1.0545012161825604
2015-08-18T00:24:00Z  1.0328061450832418
```

The query returns the logarithm base 2 of [average](#mean) `water_level`s that are calculated at 12-minute intervals.

To get those results, InfluxDB first calculates the average `water_level`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `LOG2()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
2015-08-18T00:24:00Z   2.0460000000000003
```

InfluxDB then calculates the logarithm base 2 of those averages.

{{% /expand %}}

{{< /expand-wrapper >}}

## LOG10()

Returns the logarithm of the field value to the base 10.

### Basic syntax

```
SELECT LOG10( [ * | <field_key> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`LOG10(field_key)`  
Returns the logarithm of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key) to the base 10.

<!-- `LOG10(/regular_expression/)`  
Returns the logarithm of field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/) to the base 10. -->

`LOG10(*)`  
Returns the logarithm of field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement) to the base 10.

`LOG10()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `LOG10()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  water_level
----                  -----------
2015-08-18T00:00:00Z  2.064
2015-08-18T00:06:00Z  2.116
2015-08-18T00:12:00Z  2.028
2015-08-18T00:18:00Z  2.126
2015-08-18T00:24:00Z  2.041
2015-08-18T00:30:00Z  2.051
```

{{< expand-wrapper >}}

{{% expand "Calculate the logarithm base 10 of field values associated with a field key" %}}

```sql
> SELECT LOG10("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  log10
----                  -----
2015-08-18T00:00:00Z  0.3147096929551737
2015-08-18T00:06:00Z  0.32551566336314813
2015-08-18T00:12:00Z  0.3070679506612984
2015-08-18T00:18:00Z  0.32756326018727794
2015-08-18T00:24:00Z  0.3098430047160705
2015-08-18T00:30:00Z  0.3119656603683663
```

The query returns the logarithm base 10 of field values in the `water_level` field key in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the logarithm base 10 of field values associated with each field key in a measurement" %}}

```sql
> SELECT LOG10(*) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  log10_water_level
----                  -----------------
2015-08-18T00:00:00Z  0.3147096929551737
2015-08-18T00:06:00Z  0.32551566336314813
2015-08-18T00:12:00Z  0.3070679506612984
2015-08-18T00:18:00Z  0.32756326018727794
2015-08-18T00:24:00Z  0.3098430047160705
2015-08-18T00:30:00Z  0.3119656603683663
```

The query returns the logarithm base 10 of field values for each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

<!-- ##### Calculate the logarithm base 10 of field values associated with each field key that matches a regular expression
```
> SELECT LOG10(/water/) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  log10
----                  -----
2015-08-18T00:00:00Z  0.3147096929551737
2015-08-18T00:06:00Z  0.32551566336314813
2015-08-18T00:12:00Z  0.3070679506612984
2015-08-18T00:18:00Z  0.32756326018727794
2015-08-18T00:24:00Z  0.3098430047160705
2015-08-18T00:30:00Z  0.3119656603683663
```
```

The query returns the logarithm base 10 of field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement. -->

{{% /expand %}}

{{% expand "Calculate the logarithm base 10 of field values associated with a field key and include several clauses" %}}

```sql
> SELECT LOG10("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2

name: h2o_feet
time                  log10
----                  -----
2015-08-18T00:18:00Z  0.32756326018727794
2015-08-18T00:12:00Z  0.3070679506612984
2015-08-18T00:06:00Z  0.32551566336314813
2015-08-18T00:00:00Z  0.3147096929551737
```

The query returns the logarithm base 10 of field values associated with the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT LOG10(<function>( [ * | <field_key> ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `LOG10()` function to those results.

`LOG10()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the logarithm base 10 of mean values" %}}

```sql
> SELECT LOG10(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                  log10
----                  -----
2015-08-18T00:00:00Z  0.32014628611105395
2015-08-18T00:12:00Z  0.3174364965350991
2015-08-18T00:24:00Z  0.3109056293761414
```

The query returns the logarithm base 10 of [average](#mean) `water_level`s that are calculated at 12-minute intervals.

To get those results, InfluxDB first calculates the average `water_level`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `LOG10()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
2015-08-18T00:24:00Z   2.0460000000000003
```

InfluxDB then calculates the logarithm base 10 of those averages.

{{% /expand %}}

{{< /expand-wrapper >}}

## MOVING_AVERAGE()

Returns the rolling average across a window of subsequent [field values](/influxdb/v2.4/reference/glossary/#field-value).

### Basic syntax

```
SELECT MOVING_AVERAGE( [ * | <field_key> | /<regular_expression>/ ] , <N> ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`MOVING_AVERAGE()` calculates the rolling average across a window of `N` subsequent field values.
The `N` argument is an integer and it is required.

`MOVING_AVERAGE(field_key,N)`  
Returns the rolling average across `N` field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

`MOVING_AVERAGE(/regular_expression/,N)`  
Returns the rolling average across `N` field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/).

`MOVING_AVERAGE(*,N)`  
Returns the rolling average across `N` field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`MOVING_AVERAGE()` int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax-3) section for how to use `MOVING_AVERAGE()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z'

name: h2o_feet
time                   water_level
----                   -----------
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   2.116
2015-08-18T00:12:00Z   2.028
2015-08-18T00:18:00Z   2.126
2015-08-18T00:24:00Z   2.041
2015-08-18T00:30:00Z   2.051
```

{{< expand-wrapper >}}

{{% expand "Calculate the moving average of the field values associated with a field key" %}}

```sql
> SELECT MOVING_AVERAGE("water_level",2) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z'

name: h2o_feet
time                   moving_average
----                   --------------
2015-08-18T00:06:00Z   2.09
2015-08-18T00:12:00Z   2.072
2015-08-18T00:18:00Z   2.077
2015-08-18T00:24:00Z   2.0835
2015-08-18T00:30:00Z   2.0460000000000003
```

The query returns the rolling average across a two-field-value window for the `water_level` field key and the `h2o_feet` measurement.
The first result (`2.09`) is the average of the first two points in the raw data: (`2.064 + 2.116) / 2`).
The second result (`2.072`) is the average of the second two points in the raw data: (`2.116 + 2.028) / 2`).

{{% /expand %}}

{{% expand "Calculate the moving average of the field values associated with each field key in a measurement" %}}

```sql
> SELECT MOVING_AVERAGE(*,3) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z'

name: h2o_feet
time                   moving_average_water_level
----                   --------------------------
2015-08-18T00:12:00Z   2.0693333333333332
2015-08-18T00:18:00Z   2.09
2015-08-18T00:24:00Z   2.065
2015-08-18T00:30:00Z   2.0726666666666667
```

The query returns the rolling average across a three-field-value window for each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

{{% /expand %}}

{{% expand "Calculate the moving average of the field values associated with each field key that matches a regular expression" %}}

```sql
> SELECT MOVING_AVERAGE(/level/,4) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z'

name: h2o_feet
time                    moving_average_water_level
----                    --------------------------
2015-08-18T00:18:00Z    2.0835
2015-08-18T00:24:00Z    2.07775
2015-08-18T00:30:00Z    2.0615
```

The query returns the rolling average across a four-field-value window for each field key that stores numerical values and includes the word `level` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the moving average of the field values associated with a field key and include several clauses" %}}

```sql
> SELECT MOVING_AVERAGE("water_level",2) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' ORDER BY time DESC LIMIT 2 OFFSET 3

name: h2o_feet
time                   moving_average
----                   --------------
2015-08-18T00:06:00Z   2.072
2015-08-18T00:00:00Z   2.09
```

The query returns the rolling average across a two-field-value window for the `water_level` field key in the `h2o_feet` measurement.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to two and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by three points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT MOVING_AVERAGE(<function> ([ * | <field_key> | /<regular_expression>/ ]) , N ) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `MOVING_AVERAGE()` function to those results.

`MOVING_AVERAGE()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the moving average of maximum values" %}}

```sql
> SELECT MOVING_AVERAGE(MAX("water_level"),2) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' GROUP BY time(12m)

name: h2o_feet
time                   moving_average
----                   --------------
2015-08-18T00:12:00Z   2.121
2015-08-18T00:24:00Z   2.0885
```

The query returns the rolling average across a two-value window of [maximum](#max) `water_level`s that are calculated at 12-minute intervals.

To get those results, InfluxDB first calculates the maximum `water_level`s at 12-minute intervals.
This step is the same as using the `MAX()` function with the `GROUP BY time()` clause and without `MOVING_AVERAGE()`:

```sql
> SELECT MAX("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' GROUP BY time(12m)

name: h2o_feet
time                   max
----                   ---
2015-08-18T00:00:00Z   2.116
2015-08-18T00:12:00Z   2.126
2015-08-18T00:24:00Z   2.051
```

Next, InfluxDB calculates the rolling average across a two-value window using those maximum values.
The first final result (`2.121`) is the average of the first two maximum values (`(2.116 + 2.126) / 2`).

{{% /expand %}}

{{< /expand-wrapper >}}

## NON_NEGATIVE_DERIVATIVE()

Returns the non-negative rate of change between subsequent [field values](/influxdb/v2.4/reference/glossary/#field-value).
Non-negative rates of change include positive rates of change and rates of change that equal zero.

### Basic syntax

```
SELECT NON_NEGATIVE_DERIVATIVE( [ * | <field_key> | /<regular_expression>/ ] [ , <unit> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

InfluxDB calculates the difference between subsequent field values and converts those results into the rate of change per `unit`.
The `unit` argument is an integer followed by a [duration literal](/enterprise_influxdb/v1.9/query_language/spec/#literals) and it is optional.
If the query does not specify the `unit`, the unit defaults to one second (`1s`).
`NON_NEGATIVE_DERIVATIVE()` returns only positive rates of change or rates of change that equal zero.

`NON_NEGATIVE_DERIVATIVE(field_key)`  
Returns the non-negative rate of change between subsequent field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

`NON_NEGATIVE_DERIVATIVE(/regular_expression/)`  
Returns the non-negative rate of change between subsequent field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/).

`NON_NEGATIVE_DERIVATIVE(*)`  
Returns the non-negative rate of change between subsequent field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`NON_NEGATIVE_DERIVATIVE()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax-4) section for how to use `NON_NEGATIVE_DERIVATIVE()` with a `GROUP BY time()` clause.

### Examples

See the examples in the [`DERIVATIVE()` documentation](#basic-syntax-8).
`NON_NEGATIVE_DERIVATIVE()` behaves the same as the `DERIVATIVE()` function but `NON_NEGATIVE_DERIVATIVE()` returns only positive rates of change or rates of change that equal zero.

### Advanced syntax

```
SELECT NON_NEGATIVE_DERIVATIVE(<function> ([ * | <field_key> | /<regular_expression>/ ]) [ , <unit> ] ) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `NON_NEGATIVE_DERIVATIVE()` function to those results.

The `unit` argument is an integer followed by a [duration literal](/enterprise_influxdb/v1.9/query_language/spec/#literals) and it is optional.
If the query does not specify the `unit`, the `unit` defaults to the `GROUP BY time()` interval.
Note that this behavior is different from the [basic syntax's](#basic-syntax-4) default behavior.
`NON_NEGATIVE_DERIVATIVE()` returns only positive rates of change or rates of change that equal zero.

`NON_NEGATIVE_DERIVATIVE()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

See the examples in the [`DERIVATIVE()` documentation](#advanced-syntax-8).
`NON_NEGATIVE_DERIVATIVE()` behaves the same as the `DERIVATIVE()` function but `NON_NEGATIVE_DERIVATIVE()` returns only positive rates of change or rates of change that equal zero.

## NON_NEGATIVE_DIFFERENCE()

Returns the non-negative result of subtraction between subsequent [field values](/influxdb/v2.4/reference/glossary/#field-value).
Non-negative results of subtraction include positive differences and differences that equal zero.

### Basic syntax

```
SELECT NON_NEGATIVE_DIFFERENCE( [ * | <field_key> | /<regular_expression>/ ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`NON_NEGATIVE_DIFFERENCE(field_key)`  
Returns the non-negative difference between subsequent field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

`NON_NEGATIVE_DIFFERENCE(/regular_expression/)`  
Returns the non-negative difference between subsequent field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/).

`NON_NEGATIVE_DIFFERENCE(*)`  
Returns the non-negative difference between subsequent field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`NON_NEGATIVE_DIFFERENCE()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax-5) section for how to use `NON_NEGATIVE_DIFFERENCE()` with a `GROUP BY time()` clause.

### Examples

See the examples in the [`DIFFERENCE()` documentation](#basic-syntax-9).
`NON_NEGATIVE_DIFFERENCE()` behaves the same as the `DIFFERENCE()` function but `NON_NEGATIVE_DIFFERENCE()` returns only positive differences or differences that equal zero.

### Advanced syntax

```
SELECT NON_NEGATIVE_DIFFERENCE(<function>( [ * | <field_key> | /<regular_expression>/ ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `NON_NEGATIVE_DIFFERENCE()` function to those results.

`NON_NEGATIVE_DIFFERENCE()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

See the examples in the [`DIFFERENCE()` documentation](#advanced-syntax-9).
`NON_NEGATIVE_DIFFERENCE()` behaves the same as the `DIFFERENCE()` function but `NON_NEGATIVE_DIFFERENCE()` returns only positive differences or differences that equal zero.

## POW()

Returns the field value to the power of `x`.

### Basic syntax

```
SELECT POW( [ * | <field_key> ], <x> ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`POW(field_key, x)`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key) to the power of `x`.

<!-- `POW(/regular_expression/, x)`  
Returns the field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/) to the power of `x`. -->

`POW(*, x)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement) to the power of `x`.

`POW()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `POW()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  water_level
----                  -----------
2015-08-18T00:00:00Z  2.064
2015-08-18T00:06:00Z  2.116
2015-08-18T00:12:00Z  2.028
2015-08-18T00:18:00Z  2.126
2015-08-18T00:24:00Z  2.041
2015-08-18T00:30:00Z  2.051
```

{{< expand-wrapper >}}

{{% expand "Calculate field values associated with a field key to the power of 4" %}}

```sql
> SELECT POW("water_level", 4) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  pow
----                  ---
2015-08-18T00:00:00Z  18.148417929216
2015-08-18T00:06:00Z  20.047612231936
2015-08-18T00:12:00Z  16.914992230656004
2015-08-18T00:18:00Z  20.429279055375993
2015-08-18T00:24:00Z  17.352898193760993
2015-08-18T00:30:00Z  17.69549197320101
```

The query returns field values in the `water_level` field key in the `h2o_feet` measurement multiplied to a power of 4.

{{% /expand %}}

{{% expand "Calculate field values associated with each field key in a measurement to the power of 4" %}}

```sql
> SELECT POW(*, 4) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  pow_water_level
----                  ---------------
2015-08-18T00:00:00Z  18.148417929216
2015-08-18T00:06:00Z  20.047612231936
2015-08-18T00:12:00Z  16.914992230656004
2015-08-18T00:18:00Z  20.429279055375993
2015-08-18T00:24:00Z  17.352898193760993
2015-08-18T00:30:00Z  17.69549197320101
```

The query returns field values for each field key that stores numerical values in the `h2o_feet` measurement multiplied to the power of 4.
The `h2o_feet` measurement has one numerical field: `water_level`.

<!-- ##### Calculate field values associated with each field key that matches a regular expression to the power of 4
```
> SELECT POW(/water/) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  pow
----                  ---
2015-08-18T00:00:00Z  18.148417929216
2015-08-18T00:06:00Z  20.047612231936
2015-08-18T00:12:00Z  16.914992230656004
2015-08-18T00:18:00Z  20.429279055375993
2015-08-18T00:24:00Z  17.352898193760993
2015-08-18T00:30:00Z  17.69549197320101
```
```

The query returns field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement multiplied to the power of 4. -->

{{% /expand %}}

{{% expand "Calculate field values associated with a field key to the power of 4 and include several clauses" %}}

```sql
> SELECT POW("water_level", 4) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2

name: h2o_feet
time                  pow
----                  ---
2015-08-18T00:18:00Z  20.429279055375993
2015-08-18T00:12:00Z  16.914992230656004
2015-08-18T00:06:00Z  20.047612231936
2015-08-18T00:00:00Z  18.148417929216
```

The query returns field values associated with the `water_level` field key multiplied to the power of 4.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT POW(<function>( [ * | <field_key> ] ), <x>) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `POW()` function to those results.

`POW()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate mean values to the power of 4" %}}

```sql
> SELECT POW(MEAN("water_level"), 4) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                  pow
----                  ---
2015-08-18T00:00:00Z  19.08029760999999
2015-08-18T00:12:00Z  18.609983417041
2015-08-18T00:24:00Z  17.523567165456008
```

The query returns [average](#mean) `water_level`s that are calculated at 12-minute intervals multiplied to the power of 4.

To get those results, InfluxDB first calculates the average `water_level`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `POW()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
2015-08-18T00:24:00Z   2.0460000000000003
```

InfluxDB then calculates those averages multiplied to the power of 4.

{{% /expand %}}

{{< /expand-wrapper >}}

## ROUND()

Returns the subsequent value rounded to the nearest integer.

### Basic syntax

```
SELECT ROUND( [ * | <field_key> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`ROUND(field_key)`  
Returns the field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key) rounded to the nearest integer.

<!-- `ROUND(/regular_expression/)`  
Returns the field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/) rounded to the nearest integer. -->

`ROUND(*)`  
Returns the field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement) rounded to the nearest integer.

`ROUND()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `ROUND()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  water_level
----                  -----------
2015-08-18T00:00:00Z  2.064
2015-08-18T00:06:00Z  2.116
2015-08-18T00:12:00Z  2.028
2015-08-18T00:18:00Z  2.126
2015-08-18T00:24:00Z  2.041
2015-08-18T00:30:00Z  2.051
```

{{< expand-wrapper >}}

{{% expand "Round field values associated with a field key" %}}

```sql
> SELECT ROUND("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  round
----                  -----
2015-08-18T00:00:00Z  2
2015-08-18T00:06:00Z  2
2015-08-18T00:12:00Z  2
2015-08-18T00:18:00Z  2
2015-08-18T00:24:00Z  2
2015-08-18T00:30:00Z  2
```

The query returns field values in the `water_level` field key in the `h2o_feet` measurement rounded to the nearest integer.

{{% /expand %}}

{{% expand "Round field values associated with each field key in a measurement" %}}

```sql
> SELECT ROUND(*) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  round_water_level
----                  -----------------
2015-08-18T00:00:00Z  2
2015-08-18T00:06:00Z  2
2015-08-18T00:12:00Z  2
2015-08-18T00:18:00Z  2
2015-08-18T00:24:00Z  2
2015-08-18T00:30:00Z  2
```

The query returns field values for each field key that stores numerical values in the `h2o_feet` measurement rounded to the nearest integer.
The `h2o_feet` measurement has one numerical field: `water_level`.

<!-- ##### Rounds field values associated with each field key that matches a regular expression
```
> SELECT ROUND(/water/) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                   round_water_level
----                   -----------------
2015-08-18T00:00:00Z   3
2015-08-18T00:06:00Z   3
2015-08-18T00:12:00Z   3
2015-08-18T00:18:00Z   3
2015-08-18T00:24:00Z   3
2015-08-18T00:30:00Z   4
```

The query returns field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement rounded to the nearest integer. -->

{{% /expand %}}

{{% expand "Round field values associated with a field key and include several clauses" %}}

```sql
> SELECT ROUND("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2

name: h2o_feet
time                  round
----                  -----
2015-08-18T00:18:00Z  2
2015-08-18T00:12:00Z  2
2015-08-18T00:06:00Z  2
2015-08-18T00:00:00Z  2
```

The query returns field values associated with the `water_level` field key rounded to the nearest integer.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT ROUND(<function>( [ * | <field_key> ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `ROUND()` function to those results.

`ROUND()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate mean values rounded to the nearest integer" %}}

```sql
> SELECT ROUND(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                  round
----                  -----
2015-08-18T00:00:00Z  2
2015-08-18T00:12:00Z  2
2015-08-18T00:24:00Z  2
```

The query returns the [average](#mean) `water_level`s that are calculated at 12-minute intervals and rounds to the nearest integer.

To get those results, InfluxDB first calculates the average `water_level`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `ROUND()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
2015-08-18T00:24:00Z   2.0460000000000003
```

InfluxDB then rounds those averages to the nearest integer.

{{% /expand %}}

{{< /expand-wrapper >}}

## SIN()

Returns the sine of the field value.

### Basic syntax

```
SELECT SIN( [ * | <field_key> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`SIN(field_key)`  
Returns the sine of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

<!-- `SIN(/regular_expression/)`  
Returns the sine of field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/). -->

`SIN(*)`  
Returns the sine of field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`SIN()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `SIN()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  water_level
----                  -----------
2015-08-18T00:00:00Z  2.064
2015-08-18T00:06:00Z  2.116
2015-08-18T00:12:00Z  2.028
2015-08-18T00:18:00Z  2.126
2015-08-18T00:24:00Z  2.041
2015-08-18T00:30:00Z  2.051
```

{{< expand-wrapper >}}

{{% expand "Calculate the sine of field values associated with a field key" %}}

```sql
> SELECT SIN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  sin
----                  ---
2015-08-18T00:00:00Z  0.8808206017241819
2015-08-18T00:06:00Z  0.8550216851706579
2015-08-18T00:12:00Z  0.8972904165810275
2015-08-18T00:18:00Z  0.8497930984115993
2015-08-18T00:24:00Z  0.8914760289023131
2015-08-18T00:30:00Z  0.8869008523376968
```

The query returns sine of field values in the `water_level` field key in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the sine of field values associated with each field key in a measurement" %}}

```sql
> SELECT SIN(*) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  sin_water_level
----                  ---------------
2015-08-18T00:00:00Z  0.8808206017241819
2015-08-18T00:06:00Z  0.8550216851706579
2015-08-18T00:12:00Z  0.8972904165810275
2015-08-18T00:18:00Z  0.8497930984115993
2015-08-18T00:24:00Z  0.8914760289023131
2015-08-18T00:30:00Z  0.8869008523376968
```

The query returns sine of field values for each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

<!-- ##### Calculate the sine of field values associated with each field key that matches a regular expression
```
> SELECT SIN(/water/) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  sin
----                  ---
2015-08-18T00:00:00Z  0.8808206017241819
2015-08-18T00:06:00Z  0.8550216851706579
2015-08-18T00:12:00Z  0.8972904165810275
2015-08-18T00:18:00Z  0.8497930984115993
2015-08-18T00:24:00Z  0.8914760289023131
2015-08-18T00:30:00Z  0.8869008523376968
```

The query returns sine of field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement. -->

{{% /expand %}}

{{% expand "Calculate the sine of field values associated with a field key and include several clauses" %}}

```sql
> SELECT SIN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2

name: h2o_feet
time                  sin
----                  ---
2015-08-18T00:18:00Z  0.8497930984115993
2015-08-18T00:12:00Z  0.8972904165810275
2015-08-18T00:06:00Z  0.8550216851706579
2015-08-18T00:00:00Z  0.8808206017241819
```

The query returns sine of field values associated with the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT SIN(<function>( [ * | <field_key> ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `SIN()` function to those results.

`SIN()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the sine of mean values" %}}

```sql
> SELECT SIN(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                  sin
----                  ---
2015-08-18T00:00:00Z  0.8682145834456126
2015-08-18T00:12:00Z  0.8745914945253902
2015-08-18T00:24:00Z  0.8891995555912935
```

The query returns the sine of [average](#mean) `water_level`s that are calculated at 12-minute intervals.

To get those results, InfluxDB first calculates the average `water_level`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `SIN()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
2015-08-18T00:24:00Z   2.0460000000000003
```

InfluxDB then calculates sine of those averages.

{{% /expand %}}

{{< /expand-wrapper >}}

## SQRT()

Returns the square root of field value.

### Basic syntax

```
SELECT SQRT( [ * | <field_key> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`SQRT(field_key)`  
Returns the square root of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

<!-- `SQRT(/regular_expression/)`  
Returns the square root field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/). -->

`SQRT(*)`  
Returns the square root field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`SQRT()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `SQRT()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  water_level
----                  -----------
2015-08-18T00:00:00Z  2.064
2015-08-18T00:06:00Z  2.116
2015-08-18T00:12:00Z  2.028
2015-08-18T00:18:00Z  2.126
2015-08-18T00:24:00Z  2.041
2015-08-18T00:30:00Z  2.051
```

{{< expand-wrapper >}}

{{% expand "Calculate the square root of field values associated with a field key" %}}

```sql
> SELECT SQRT("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  sqrt
----                  ----
2015-08-18T00:00:00Z  1.4366627996854378
2015-08-18T00:06:00Z  1.4546477236774544
2015-08-18T00:12:00Z  1.4240786495134319
2015-08-18T00:18:00Z  1.4580809305384939
2015-08-18T00:24:00Z  1.4286357128393508
2015-08-18T00:30:00Z  1.4321312788986909
```

The query returns the square roots of field values in the `water_level` field key in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the square root of field values associated with each field key in a measurement" %}}

```sql
> SELECT SQRT(*) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  sqrt_water_level
----                  ----------------
2015-08-18T00:00:00Z  1.4366627996854378
2015-08-18T00:06:00Z  1.4546477236774544
2015-08-18T00:12:00Z  1.4240786495134319
2015-08-18T00:18:00Z  1.4580809305384939
2015-08-18T00:24:00Z  1.4286357128393508
2015-08-18T00:30:00Z  1.4321312788986909
```

The query returns the square roots of field values for each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

<!-- ##### Calculate the square root of field values associated with each field key that matches a regular expression
```
> SELECT SQRT(/water/) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  sqrt_water_level
----                  ----------------
2015-08-18T00:00:00Z  1.4366627996854378
2015-08-18T00:06:00Z  1.4546477236774544
2015-08-18T00:12:00Z  1.4240786495134319
2015-08-18T00:18:00Z  1.4580809305384939
2015-08-18T00:24:00Z  1.4286357128393508
2015-08-18T00:30:00Z  1.4321312788986909
```
```

The query returns the square roots of field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement. -->

{{% /expand %}}

{{% expand "Calculate the square root of field values associated with a field key and include several clauses" %}}

```sql
> SELECT SQRT("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2

name: h2o_feet
time                  sqrt
----                  ----
2015-08-18T00:18:00Z  1.4580809305384939
2015-08-18T00:12:00Z  1.4240786495134319
2015-08-18T00:06:00Z  1.4546477236774544
2015-08-18T00:00:00Z  1.4366627996854378
```

The query returns the square roots of field values associated with the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT SQRT(<function>( [ * | <field_key> ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `SQRT()` function to those results.

`SQRT()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the square root of mean values" %}}

```sql
> SELECT SQRT(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                  sqrt
----                  ----
2015-08-18T00:00:00Z  1.445683229480096
2015-08-18T00:12:00Z  1.4411800720243115
2015-08-18T00:24:00Z  1.430384563675098
```

The query returns the square roots of [average](#mean) `water_level`s that are calculated at 12-minute intervals.

To get those results, InfluxDB first calculates the average `water_level`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `SQRT()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
2015-08-18T00:24:00Z   2.0460000000000003
```

InfluxDB then calculates the square roots of those averages.

{{% /expand %}}

{{< /expand-wrapper >}}

## TAN()

Returns the tangent of the field value.

### Basic syntax

```
SELECT TAN( [ * | <field_key> ] ) [INTO_clause] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`TAN(field_key)`  
Returns the tangent of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

<!-- `TAN(/regular_expression/)`  
Returns the tangent of field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/). -->

`TAN(*)`  
Returns the tangent of field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`TAN()` supports int64 and float64 field value [data types](/influxdb/v2.4/query-data/influxql/explore-data/#data-types).

The basic syntax supports `GROUP BY` clauses that [group by tags](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-tags) but not `GROUP BY` clauses that [group by time](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals).
See the [Advanced Syntax](#advanced-syntax) section for how to use `TAN()` with a `GROUP BY time()` clause.

### Examples

The examples below use the following subsample of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data):

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  water_level
----                  -----------
2015-08-18T00:00:00Z  2.064
2015-08-18T00:06:00Z  2.116
2015-08-18T00:12:00Z  2.028
2015-08-18T00:18:00Z  2.126
2015-08-18T00:24:00Z  2.041
2015-08-18T00:30:00Z  2.051
```

{{< expand-wrapper >}}

{{% expand "Calculate the tangent of field values associated with a field key" %}}

```sql
> SELECT TAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  tan
----                  ---
2015-08-18T00:00:00Z  -1.8604293534384375
2015-08-18T00:06:00Z  -1.6487359603347427
2015-08-18T00:12:00Z  -2.0326408012302273
2015-08-18T00:18:00Z  -1.6121545688343464
2015-08-18T00:24:00Z  -1.9676434782626282
2015-08-18T00:30:00Z  -1.9198657720074992
```

The query returns tangent of field values in the `water_level` field key in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the tangent of field values associated with each field key in a measurement" %}}

```sql
> SELECT TAN(*) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  tan_water_level
----                  ---------------
2015-08-18T00:00:00Z  -1.8604293534384375
2015-08-18T00:06:00Z  -1.6487359603347427
2015-08-18T00:12:00Z  -2.0326408012302273
2015-08-18T00:18:00Z  -1.6121545688343464
2015-08-18T00:24:00Z  -1.9676434782626282
2015-08-18T00:30:00Z  -1.9198657720074992
```

The query returns tangent of field values for each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

<!-- ##### Calculate the tangent of field values associated with each field key that matches a regular expression
```
> SELECT TAN(/water/) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  tan
----                  ---
2015-08-18T00:00:00Z  -1.8604293534384375
2015-08-18T00:06:00Z  -1.6487359603347427
2015-08-18T00:12:00Z  -2.0326408012302273
2015-08-18T00:18:00Z  -1.6121545688343464
2015-08-18T00:24:00Z  -1.9676434782626282
2015-08-18T00:30:00Z  -1.9198657720074992
```

The query returns tangent of field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement. -->

{{% /expand %}}

{{% expand "Calculate the tangent of field values associated with a field key and include several clauses" %}}

```sql
> SELECT TAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' ORDER BY time DESC LIMIT 4 OFFSET 2

name: h2o_feet
time                  tan
----                  ---
2015-08-18T00:18:00Z  -1.6121545688343464
2015-08-18T00:12:00Z  -2.0326408012302273
2015-08-18T00:06:00Z  -1.6487359603347427
2015-08-18T00:00:00Z  -1.8604293534384375
```

The query returns tangent of field values associated with the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2015-08-18T00:00:00Z` and `2015-08-18T00:30:00Z` and returns results in [descending timestamp order](/influxdb/v2.4/query-data/influxql/explore-data/order-by/).
The query also [limits](/influxdb/v2.4/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to four and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/offset-and-soffset/) results by two points.

{{% /expand %}}

{{< /expand-wrapper >}}

### Advanced syntax

```
SELECT TAN(<function>( [ * | <field_key> ] )) [INTO_clause] FROM_clause [WHERE_clause] GROUP_BY_clause [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

The advanced syntax requires a [`GROUP BY time() ` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/#group-by-time-intervals) and a nested InfluxQL function.
The query first calculates the results for the nested function at the specified `GROUP BY time()` interval and then applies the `TAN()` function to those results.

`TAN()` supports the following nested functions:
[`COUNT()`](#count),
[`MEAN()`](#mean),
[`MEDIAN()`](#median),
[`MODE()`](#mode),
[`SUM()`](#sum),
[`FIRST()`](#first),
[`LAST()`](#last),
[`MIN()`](#min),
[`MAX()`](#max), and
[`PERCENTILE()`](#percentile).

### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the tangent of mean values" %}}

```sql
> SELECT TAN(MEAN("water_level")) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                  tan
----                  ---
2015-08-18T00:00:00Z  -1.7497661902817365
2015-08-18T00:12:00Z  -1.8038002062256624
2015-08-18T00:24:00Z  -1.9435224805850773
```

The query returns tangent of [average](#mean) `water_level`s that are calculated at 12-minute intervals.

To get those results, InfluxDB first calculates the average `water_level`s at 12-minute intervals.
This step is the same as using the `MEAN()` function with the `GROUP BY time()` clause and without `TAN()`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(12m)

name: h2o_feet
time                   mean
----                   ----
2015-08-18T00:00:00Z   2.09
2015-08-18T00:12:00Z   2.077
2015-08-18T00:24:00Z   2.0460000000000003
```

InfluxDB then calculates tangent of those averages.


{{% /expand %}}

{{< /expand-wrapper >}}
