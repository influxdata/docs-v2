---
title: InfluxQL aggregate functions
description: >
  Aggregate data with InfluxQL aggregate functions.
menu:
  influxdb_2_4:
    name: Aggregates
    parent: View InfluxQL functions
weight: 205
---

Use aggregate functions to assess, aggregate, and return values in your data.

Each aggregate function below covers **syntax** including parameters to pass to the function, and **examples** of how to use the function. Examples use [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data).

- [COUNT()](#count)
- [DISTINCT()](#distinct)
- [INTEGRAL()](#integral)
- [MEAN()](#mean)
- [MEDIAN()](#median)
- [MODE()](#mode)
- [SPREAD()](#spread)
- [STDDEV()](#stddev)
- [SUM()](#sum)

## COUNT()

Returns the number of non-null [field values](/influxdb/v2.4/reference/glossary/#field-value). Supports all field value [data types](/influxdb/v2.4/reference/glossary/#data-type).

### Syntax

```
SELECT COUNT( [ * | <field_key> | /<regular_expression>/ ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`COUNT(*)`

Returns the number of field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

`COUNT(field_key)`  

Returns the number of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

`COUNT(/regular_expression/)`  

Returns the number of field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/#regular-expressions).

#### Examples

{{< expand-wrapper >}}
{{% expand "Count values for a field" %}}

```sql
> SELECT COUNT("water_level") FROM "h2o_feet"

name: h2o_feet
time                   count
----                   -----
1970-01-01T00:00:00Z   61026.0000000000
```

Returns the number of non-null field values in the `water_level` field key in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Count values for each field in a measurement" %}}

```sql
> SELECT COUNT(*) FROM "h2o_feet"

name: h2o_feet
time                   count_level description   count_water_level
----                   -----------------------   -----------------
1970-01-01T00:00:00Z   61026.0000000000          61026.0000000000
```

Returns the number of non-null field values for each field key associated with the `h2o_feet` measurement.
The `h2o_feet` measurement has two field keys: `level description` and `water_level`.

{{% /expand %}}

{{% expand "Count the values that match a regular expression" %}}

```sql
> SELECT COUNT(/water/) FROM "h2o_feet"

name: h2o_feet
time                   count_water_level
----                   -----------------
1970-01-01T00:00:00Z   61026.0000000000
```

Returns the number of non-null field values for every field key that contains the word `water` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Count distinct values for a field" %}}

InfluxQL supports nesting [DISTINCT()](#distinct) in `COUNT()`.

```sql
> SELECT COUNT(DISTINCT("level description")) FROM "h2o_feet"

name: h2o_feet
time                   count
----                   -----
1970-01-01T00:00:00Z   4.0000000000
```

Returns the number of unique field values for the `level description` field key and the `h2o_feet` measurement.

{{% /expand %}}

{{< /expand-wrapper >}}

## DISTINCT()

Returns the list of unique [field values](/influxdb/v2.4/reference/glossary/#field-value). Supports all field value [data types](/influxdb/v2.4/reference/glossary/#data-type).

InfluxQL supports nesting `DISTINCT()` with [`COUNT()`](#count).

### Syntax

```
SELECT DISTINCT( [ <field_key> | /<regular_expression>/ ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`DISTINCT(field_key)`

Returns the unique field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

#### Examples

{{< expand-wrapper >}}
{{% expand "List the distinct field values associated with a field key" %}}

```sql
> SELECT DISTINCT("level description") FROM "h2o_feet"

name: h2o_feet
time                   distinct
----                   --------
1970-01-01T00:00:00Z   between 6 and 9 feet
1970-01-01T00:00:00Z   below 3 feet
1970-01-01T00:00:00Z   between 3 and 6 feet
1970-01-01T00:00:00Z   at or greater than 9 feet
```

Returns a tabular list of the unique field values in the `level description` field key in the `h2o_feet` measurement.

{{% /expand %}}

<!-->
{{% expand "List the distinct field values associated with each field key in a measurement" %}}

```sql
> SELECT DISTINCT(*) FROM "h2o_feet"

name: h2o_feet
time                   distinct_level description   distinct_water_level
----                   --------------------------   --------------------
1970-01-01T00:00:00Z   between 6 and 9 feet         8.12
1970-01-01T00:00:00Z   between 3 and 6 feet         8.005
1970-01-01T00:00:00Z   at or greater than 9 feet    7.887
1970-01-01T00:00:00Z   below 3 feet                 7.762
[...]
```

Returns a tabular list of the unique field values for each field key in the `h2o_feet` measurement.
The `h2o_feet` measurement has two field keys: `level description` and `water_level`.

{{% /expand %}}

-->
{{< /expand-wrapper >}}

## INTEGRAL()

Returns the area under the curve for subsequent [field values](/influxdb/v2.4/reference/glossary/#field-value).

{{% note %}}
`INTEGRAL()` does not support [`fill()`](/influxdb/v2.4/query-data/influxql/explore-data/#group-by-time-intervals-and-fill). `INTEGRAL()` supports int64 and float64 field value [data types](/influxdb/v2.4/reference/glossary/#data-type).
{{% /note %}}

### Syntax

```
SELECT INTEGRAL( [ * | <field_key> | /<regular_expression>/ ] [ , <unit> ]  ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

InfluxDB calculates the area under the curve for subsequent field values and converts those results into the summed area per `unit`.
The `unit` argument is an integer followed by an optional [duration literal](/influxdb/v2.4/reference/syntax/spec/#literals).
If the query does not specify the `unit`, the unit defaults to one second (`1s`).

`INTEGRAL(field_key)`

Returns the area under the curve for subsequent field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

`INTEGRAL(/regular_expression/)`

Returns the area under the curve for subsequent field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/#regular-expressions).

`INTEGRAL(*)`

Returns the average field value associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

#### Examples

The following examples use a subset of the [NOAA water sample data](/influxdb/v2.4/reference/sample-data/#noaa-water-sample-data) data:

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'

name: h2o_feet
time                   water_level
----                   -----------
2019-08-18T00:00:00Z   2.3520000000
2019-08-18T00:06:00Z   2.3790000000
2019-08-18T00:12:00Z   2.3430000000
2019-08-18T00:18:00Z   2.3290000000
2019-08-18T00:24:00Z   2.2640000000
2019-08-18T00:30:00Z   2.2670000000
```

{{< expand-wrapper >}}
{{% expand "Calculate the integral for the field values associated with a field key" %}}

```sql
> SELECT INTEGRAL("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'

name: h2o_feet
time                 integral
----                 --------
1970-01-01T00:00:00Z 4184.8200000000
```

Returns the area under the curve (in seconds) for the field values associated with the `water_level` field key and in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the integral for the field values associated with a field key and specify the unit option" %}}

```sql
> SELECT INTEGRAL("water_level",1m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'

name: h2o_feet
time                 integral
----                 --------
1970-01-01T00:00:00Z 69.7470000000
```

Returns the area under the curve (in minutes) for the field values associated with the `water_level` field key and in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the integral for the field values associated with each field key in a measurement and specify the unit option" %}}

```sql
> SELECT INTEGRAL(*,1m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'

name: h2o_feet
time                   integral_water_level
----                   --------------------
1970-01-01T00:00:00Z   69.7470000000
```

Returns the area under the curve (in minutes) for the field values associated with each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has on numerical field: `water_level`.

{{% /expand %}}

{{% expand "Calculate the integral for the field values associated with each field key that matches a regular expression and specify the unit option" %}}

```sql
> SELECT INTEGRAL(/water/,1m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z'

name: h2o_feet
time                   integral_water_level
----                   --------------------
1970-01-01T00:00:00Z   69.7470000000
```

Returns the area under the curve (in minutes) for the field values associated with each field key that stores numerical values includes the word `water` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the integral for the field values associated with a field key and include several clauses" %}}

```sql
> SELECT INTEGRAL("water_level",1m) FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' GROUP BY time(12m) LIMIT 1

name: h2o_feet
time                 integral
----                 --------
2015-08-18T00:00:00Z 28.3590000000
```

Returns the area under the curve (in minutes) for the field values associated with the `water_level` field key and in the `h2o_feet` measurement.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/#time-syntax) between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z`, [groups](/influxdb/v2.4/query-data/influxql/explore-data/#group-by-time-intervals) results into 12-minute intervals, and [limits](/influxdb/v2.4/query-data/influxql/explore-data/#the-limit-and-slimit-clauses) the number of results returned to one.

{{% /expand %}}
{{< /expand-wrapper >}}

## MEAN()

Returns the arithmetic mean (average) of [field values](/influxdb/v2.4/reference/glossary/#field-value). `MEAN()` supports int64 and float64 field value [data types](/influxdb/v2.4/reference/glossary/#data-type).

### Syntax

```
SELECT MEAN( [ * | <field_key> | /<regular_expression>/ ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`MEAN(field_key)`
Returns the average field value associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

`MEAN(/regular_expression/)  

Returns the average field value associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/#regular-expressions).

`MEAN(*)`
Returns the average field value associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

#### Examples

{{< expand-wrapper >}}
{{% expand "Calculate the mean field value associated with a field key" %}}

```sql
> SELECT MEAN("water_level") FROM "h2o_feet"

name: h2o_feet
time                   mean
----                   ----
1970-01-01T00:00:00Z   4.4418674882
```

Returns the average field value in the `water_level` field key in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the mean field value associated with each field key in a measurement" %}}

```sql
> SELECT MEAN(*) FROM "h2o_feet"

name: h2o_feet
time                   mean_water_level
----                   ----------------
1970-01-01T00:00:00Z   4.4418674882
```

Returns the average field value for every field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

{{% /expand %}}

{{% expand "Calculate the mean field value associated with each field key that matches a regular expression" %}}

```sql
> SELECT MEAN(/water/) FROM "h2o_feet"

name: h2o_feet
time                   mean_water_level
----                   ----------------
1970-01-01T00:00:00Z   4.4418674882
```

Returns the average field value for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the mean field value associated with a field key and include several clauses" %}}

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' GROUP BY time(12m),* fill(9.01) LIMIT 7 SLIMIT 1

name: h2o_feet
tags: location=coyote_creek
time                   mean
----                   ----
2019-08-18T00:00:00Z   8.4615000000
2019-08-18T00:12:00Z   8.2725000000
2019-08-18T00:24:00Z   8.0710000000┃
```

Returns the average of the values in the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/#time-syntax) between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` and [groups](/influxdb/v2.4/query-data/influxql/explore-data/#the-group-by-clause) results into 12-minute time intervals and per tag.
The query [fills](/influxdb/v2.4/query-data/influxql/explore-data/#group-by-time-intervals-and-fill) empty time intervals with `9.01` and [limits](/influxdb/v2.4/query-data/influxql/explore-data/#the-limit-and-slimit-clauses) the number of points and series returned to seven and one.

{{% /expand %}}
{{< /expand-wrapper >}}

## MEDIAN()

Returns the middle value from a sorted list of [field values](/influxdb/v2.4/reference/glossary/#field-value). `MEDIAN()` supports int64 and float64 field value [data types](/influxdb/v2.4/reference/glossary/#data-type).

{{% note %}}
**Note:** `MEDIAN()` is nearly equivalent to [`PERCENTILE(field_key, 50)`](#percentile), except `MEDIAN()` returns the average of the two middle field values if the field contains an even number of values.
{{% /note %}}

### Syntax

```
SELECT MEDIAN( [ * | <field_key> | /<regular_expression>/ ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`MEDIAN(field_key)`

Returns the middle field value associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

`MEDIAN(/regular_expression/)`

Returns the middle field value associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/#regular-expressions).

`MEDIAN(*)`

Returns the middle field value associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

#### Examples

{{< expand-wrapper >}}
{{% expand "Calculate the median field value associated with a field key" %}}

```sql
> SELECT MEDIAN("water_level") FROM "h2o_feet"

name: h2o_feet
time                   median
----                   ------
1970-01-01T00:00:00Z   4.1240000000
```

Returns the middle field value in the `water_level` field key and in the `h2o_feet` measurement.
{{% /expand %}}

{{% expand "Calculate the median field value associated with each field key in a measurement" %}}

```sql
> SELECT MEDIAN(*) FROM "h2o_feet"

name: h2o_feet
time                   median_water_level
----                   ------------------
1970-01-01T00:00:00Z   4.1240000000
```

Returns the middle field value for every field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

{{% /expand %}}

{{% expand "Calculate the median field value associated with each field key that matches a regular expression" %}}

```sql
> SELECT MEDIAN(/water/) FROM "h2o_feet"

name: h2o_feet
time                   median_water_level
----                   ------------------
1970-01-01T00:00:00Z   4.1240000000
```

Returns the middle field value for every field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the median field value associated with a field key and include several clauses" %}}

```sql
> SELECT MEDIAN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' GROUP BY time(12m),* fill(700) LIMIT 7 SLIMIT 1 SOFFSET 1

name: h2o_feet
tags: location=santa_monica
time                   median
----                   ------
2019-08-18T00:00:00Z   2.3655000000
2019-08-18T00:12:00Z   2.3360000000
2019-08-18T00:24:00Z   2.2655000000
```

Returns the middle field value in the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/#time-syntax) between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` and [groups](/influxdb/v2.4/query-data/influxql/explore-data/#the-group-by-clause) results into 12-minute time intervals and per tag.
The query [fills](/influxdb/v2.4/query-data/influxql/explore-data/#group-by-time-intervals-and-fill) empty time intervals with `700 `, [limits](/influxdb/v2.4/query-data/influxql/explore-data/#the-limit-and-slimit-clauses) the number of points and series returned to seven and one, and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/#the-offset-and-soffset-clauses) the series returned by one.

{{% /expand %}}
{{< /expand-wrapper >}}

## MODE()

Returns the most frequent value in a list of [field values](/influxdb/v2.4/reference/glossary/#field-value). `MODE()` supports all field value [data types](/influxdb/v2.4/reference/glossary/#data-type).

{{% note %}}
**Note:** `MODE()` returns the field value with the earliest [timestamp](/influxdb/v2.4/reference/glossary/#timestamp) if  there's a tie between two or more values for the maximum number of occurrences.
{{% /note %}}

### Syntax

```
SELECT MODE( [ * | <field_key> | /<regular_expression>/ ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`MODE(field_key)`

Returns the most frequent field value associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

`MODE(/regular_expression/)`

Returns the most frequent field value associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/#regular-expressions).

`MODE(*)`

Returns the most frequent field value associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the mode field value associated with a field key" %}}

```sql
> SELECT MODE("level description") FROM "h2o_feet"

name: h2o_feet
time                   mode
----                   ----
1970-01-01T00:00:00Z   between 3 and 6 feet
```

Returns the most frequent field value in the `level description` field key and in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the mode field value associated with each field key in a measurement" %}}

```sql
> SELECT MODE(*) FROM "h2o_feet"

name: h2o_feet
time                   mode_level description   mode_water_level
----                   ----------------------   ----------------
1970-01-01T00:00:00Z   between 3 and 6 feet     2.6900000000
```

Returns the most frequent field value for every field key in the `h2o_feet` measurement.
The `h2o_feet` measurement has two field keys: `level description` and `water_level`.

{{% /expand %}}

{{% expand "Calculate the mode field value associated with each field key that matches a regular expression" %}}

```sql
> SELECT MODE(/water/) FROM "h2o_feet"

name: h2o_feet
time                   mode_water_level
----                   ----------------
1970-01-01T00:00:00Z   2.6900000000
```

Returns the most frequent field value for every field key that includes the word `/water/` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the mode field value associated with a field key and include several clauses" %}}

```sql
> SELECT MODE("level description") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' GROUP BY time(12m),* LIMIT 3 SLIMIT 1 SOFFSET 1

name: h2o_feet
tags: location=santa_monica
time                   mode
----                   ----
2019-08-18T00:00:00Z   below 3 feet
2019-08-18T00:12:00Z   below 3 feet
2019-08-18T00:24:00Z   below 3 feet
```

Returns the mode of the values associated with the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/#time-syntax) between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` and [groups](/influxdb/v2.4/query-data/influxql/explore-data/#the-group-by-clause) results into 12-minute time intervals and per tag.
The query [limits](/influxdb/v2.4/query-data/influxql/explore-data/#the-limit-and-slimit-clauses) the number of points and series returned to three and one, and it [offsets](/influxdb/v2.4/query-data/influxql/explore-data/#the-offset-and-soffset-clauses) the series returned by one.

{{% /expand %}}
{{< /expand-wrapper >}}

## SPREAD()

Returns the difference between the minimum and maximum [field values](/influxdb/v2.4/reference/glossary/#field-value). `SPREAD()` supports int64 and float64 field value [data types](/influxdb/v2.4/reference/glossary/#data-type).

### Syntax

```
SELECT SPREAD( [ * | <field_key> | /<regular_expression>/ ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`SPREAD(field_key)`

Returns the difference between the minimum and maximum field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

`SPREAD(/regular_expression/)`

Returns the difference between the minimum and maximum field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/#regular-expressions).

`SPREAD(*)`

Returns the difference between the minimum and maximum field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the spread for the field values associated with a field key" %}}

```sql
> SELECT SPREAD("water_level") FROM "h2o_feet"

name: h2o_feet
time                   spread
----                   ------
1970-01-01T00:00:00Z   10.5740000000
```

Returns the difference between the minimum and maximum field values in the `water_level` field key and in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the spread for the field values associated with each field key in a measurement" %}}

```sql
> SELECT SPREAD(*) FROM "h2o_feet"

name: h2o_feet
time                   spread_water_level
----                   ------------------
1970-01-01T00:00:00Z   10.5740000000
```

Returns the difference between the minimum and maximum field values for every field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

{{% /expand %}}

{{% expand "Calculate the spread for the field values associated with each field key that matches a regular expression" %}}

```sql
> SELECT SPREAD(/water/) FROM "h2o_feet"

name: h2o_feet
time                   spread_water_level
----                   ------------------
1970-01-01T00:00:00Z    10.5740000000
```

Returns the difference between the minimum and maximum field values for every field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the spread for the field values associated with a field key and include several clauses" %}}

```sql
> SELECT SPREAD("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' GROUP BY time(12m),* fill(18) LIMIT 3 SLIMIT 1 SOFFSET 1

name: h2o_feet
tags: location=santa_monica
time                   spread
----                   ------
2019-08-18T00:00:00Z   0.0270000000
2019-08-18T00:12:00Z   0.0140000000
2019-08-18T00:24:00Z   0.0030000000
```

Returns the difference between the minimum and maximum field values in the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/#time-syntax) between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` and [groups](/influxdb/v2.4/query-data/influxql/explore-data/#the-group-by-clause) results into 12-minute time intervals and per tag.
The query [fills](/influxdb/v2.4/query-data/influxql/explore-data/#group-by-time-intervals-and-fill) empty time intervals with `18`, [limits](/influxdb/v2.4/query-data/influxql/explore-data/#the-limit-and-slimit-clauses) the number of points and series returned to three and one, and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/#the-offset-and-soffset-clauses) the series returned by one.

{{% /expand %}}
{{< /expand-wrapper >}}

## STDDEV()

Returns the standard deviation of [field values](/influxdb/v2.4/reference/glossary/#field-value). `STDDEV()` supports int64 and float64 field value [data types](/influxdb/v2.4/reference/glossary/#data-type).

### Syntax

```
SELECT STDDEV( [ * | <field_key> | /<regular_expression>/ ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`STDDEV(field_key)`

Returns the standard deviation of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

`STDDEV(/regular_expression/)`

Returns the standard deviation of field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/#regular-expressions).

`STDDEV(*)`

Returns the standard deviation of field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

#### Examples

{{< expand-wrapper >}}
{{% expand "Calculate the standard deviation for the field values associated with a field key" %}}

```sql
> SELECT STDDEV("water_level") FROM "h2o_feet"

name: h2o_feet
time                   stddev
----                   ------
1970-01-01T00:00:00Z   2.2789744110
```

Returns the standard deviation of the field values in the `water_level` field key and in the `h2o_feet` measurement.
{{% /expand %}}

{{% expand "Calculate the standard deviation for the field values associated with each field key in a measurement" %}}

```sql
> SELECT STDDEV(*) FROM "h2o_feet"

name: h2o_feet
time                   stddev_water_level
----                   ------------------
1970-01-01T00:00:00Z    2.2789744110
```

Returns the standard deviation of the field values for each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

{{% /expand %}}

{{% expand "Calculate the standard deviation for the field values associated with each field key that matches a regular expression" %}}

```sql
> SELECT STDDEV(/water/) FROM "h2o_feet"

name: h2o_feet
time                   stddev_water_level
----                   ------------------
1970-01-01T00:00:00Z    2.2789744110
```

Returns the standard deviation of the field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the standard deviation for the field values associated with a field key and include several clauses" %}}

```sql
> SELECT STDDEV("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' GROUP BY time(12m),* fill(18000) LIMIT 2 SLIMIT 1 SOFFSET 1

name: h2o_feet
tags: location=santa_monica
time                   stddev
----                   ------
2019-08-18T00:00:00Z   0.0190918831
2019-08-18T00:12:00Z   0.0098994949
```

Returns the standard deviation of the field values in the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/#time-syntax) between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` and [groups](/influxdb/v2.4/query-data/influxql/explore-data/#the-group-by-clause) results into 12-minute time intervals and per tag.
The query [fills](/influxdb/v2.4/query-data/influxql/explore-data/#group-by-time-intervals-and-fill) empty time intervals with `18000`, [limits](/influxdb/v2.4/query-data/influxql/explore-data/#the-limit-and-slimit-clauses) the number of points and series returned to two and one, and [offsets](/influxdb/v2.4/query-data/influxql/explore-data/#the-offset-and-soffset-clauses) the series returned by one.

{{% /expand %}}
{{< /expand-wrapper >}}

## SUM()

Returns the sum of [field values](/influxdb/v2.4/reference/glossary/#field-value). `SUM()` supports int64 and float64 field value [data types](/influxdb/v2.4/reference/glossary/#data-type).

### Syntax

```
SELECT SUM( [ * | <field_key> | /<regular_expression>/ ] ) FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`SUM(field_key)`

Returns the sum of field values associated with the [field key](/influxdb/v2.4/reference/glossary/#field-key).

`SUM(/regular_expression/)`

Returns the sum of field values associated with each field key that matches the [regular expression](/influxdb/v2.4/query-data/influxql/explore-data/#regular-expressions).

`SUM(*)`

Returns the sums of field values associated with each field key in the [measurement](/influxdb/v2.4/reference/glossary/#measurement).

#### Examples

{{< expand-wrapper >}}
{{% expand "Calculate the sum of the field values associated with a field key" %}}

```sql
> SELECT SUM("water_level") FROM "h2o_feet"

name: h2o_feet
time                   sum
----                   ---
1970-01-01T00:00:00Z   271069.4053333958
```

Returns the summed total of the field values in the `water_level` field key and in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Calculate the sum of the field values associated with each field key in a measurement" %}}

```sql
> SELECT SUM(*) FROM "h2o_feet"

name: h2o_feet
time                   sum_water_level
----                   ---------------
1970-01-01T00:00:00Z    271069.4053333958
```

Returns the summed total of the field values for each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

{{% /expand %}}

{{% expand "Calculate the sum of the field values associated with each field key that matches a regular expression" %}}

```sql
> SELECT SUM(/water/) FROM "h2o_feet"

name: h2o_feet
time                   sum_water_level
----                   ---------------
1970-01-01T00:00:00Z   271069.4053333958
```

Returns the summed total of the field values for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement.
{{% /expand %}}

{{% expand "Calculate the sum of the field values associated with a field key and include several clauses" %}}

```sql
> SELECT SUM("water_level") FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' GROUP BY time(12m),* fill(18000) LIMIT 4 SLIMIT 1

name: h2o_feet
tags: location=coyote_creek
time                   sum
----                   ---
2019-08-18T00:00:00Z   16.9230000000
2019-08-18T00:12:00Z   16.5450000000
2019-08-18T00:24:00Z   16.1420000000
```

Returns the summed total of the field values in the `water_level` field key.
It covers the [time range](/influxdb/v2.4/query-data/influxql/explore-data/#time-syntax) between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` and [groups](/influxdb/v2.4/query-data/influxql/explore-data/#the-group-by-clause) results into 12-minute time intervals and per tag. The query [fills](/influxdb/v2.4/query-data/influxql/explore-data/#group-by-time-intervals-and-fill) empty time intervals with 18000, and it [limits](/influxdb/v2.4/query-data/influxql/explore-data/#the-limit-and-slimit-clauses) the number of points and series returned to four and one.

{{% /expand %}}
{{< /expand-wrapper >}}
