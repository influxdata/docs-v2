---
title: InfluxQL selector functions
description: >
  Select data with InfluxQL selector functions.
menu:
  influxdb_2_5:
    name: Selectors
    parent: View InfluxQL functions
weight: 205
---

Use selector functions to assess, select, and return values in your data. Selector functions return one or more record per input table. Each output table includes one or more unmodified records and the same group key as the input table.

Each selector function below covers **syntax**, including parameters to pass to the function, and **examples** of how to use the function. Examples use [NOAA water sample data](/influxdb/v2.5/reference/sample-data/#noaa-water-sample-data).

- [BOTTOM()](#bottom)
- [FIRST()](#first)
- [LAST()](#last)
- [MAX()](#max)
- [MIN()](#min)
- [PERCENTILE()](#percentile)
- [SAMPLE()](#sample)
- [TOP()](#top)

## BOTTOM()

Returns the smallest `N` [field values](/influxdb/v2.5/reference/glossary/#field-value). `BOTTOM()` supports int64 and float64 field value [data types](/influxdb/v2.5/query-data/influxql/explore-data/select/#data-types).

{{% note %}}
**Note:** `BOTTOM()` returns the field value with the earliest timestamp if there's a tie between two or more values for the smallest value.
{{% /note %}}

### Syntax

```
SELECT BOTTOM(<field_key>[,<tag_key(s)>],<N> )[,<tag_key(s)>|<field_key(s)>] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`BOTTOM(field_key,N)`  
Returns the smallest N field values associated with the [field key](/influxdb/v2.5/reference/glossary/#field-key).

`BOTTOM(field_key,tag_key,N)`  
Returns the smallest field value for N tag values of the [tag key](/influxdb/v2.5/reference/glossary/#tag-key). Add a comma between multiple tag keys: `tag_key,tag_key`.

`BOTTOM((field_key,N),tag_key,field_key)`  
Returns the smallest N field values associated with the field key in the parentheses and the relevant [tag](/influxdb/v2.5/reference/glossary/#tag) and/or [field](/influxdb/v2.5/reference/glossary/#field). Add a comma between multiple tag or field keys: `tag_key,tag_key,field_key,field_key`.

#### Examples

{{< expand-wrapper >}}
{{% expand "Select the bottom three field values associated with a field key" %}}

```sql
> SELECT BOTTOM("water_level",3) FROM "h2o_feet"

name: h2o_feet
time                   bottom
----                   ------
2019-08-29T14:30:00Z   -0.610
2019-08-29T14:36:00Z   -0.591
2019-08-30T15:18:00Z   -0.594
```

Returns the smallest three field values in the `water_level` field key and in the `h2o_feet` [measurement](/influxdb/v2.5/reference/glossary/#measurement).

{{% /expand %}}

{{% expand "Select the bottom field value associated with a field key for two tags" %}}

```sql
> SELECT BOTTOM("water_level","location",2) FROM "h2o_feet"

name: h2o_feet
time                   bottom    location
----                   ------    --------
2019-08-29T10:36:00Z   -0.243    santa_monica
2019-08-29T14:30:00Z   -0.610    coyote_creek
```

Returns the smallest field values in the `water_level` field key for two tag values associated with the `location` tag key.

{{% /expand %}}

{{% expand "Select the bottom four field values associated with a field key and the relevant tags and fields" %}}

```sql
> SELECT BOTTOM("water_level",4),"location","level description" FROM "h2o_feet"

name: h2o_feet
time                  bottom  location      level description
----                  ------  --------      -----------------
2019-08-29T14:24:00Z  -0.587  coyote_creek  below 3 feet
2019-08-29T14:30:00Z  -0.610  coyote_creek  below 3 feet
2019-08-29T14:36:00Z  -0.591  coyote_creek  below 3 feet
2019-08-30T15:18:00Z  -0.594  coyote_creek  below 3 feet
```

Returns the smallest four field values in the `water_level` field key and the relevant values of the `location` tag key and the `level description` field key.

{{% /expand %}}

{{% expand "Select the bottom three field values associated with a field key and include several clauses" %}}

```sql
> SELECT BOTTOM("water_level",3),"location" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:54:00Z' GROUP BY time(24m) ORDER BY time DESC

name: h2o_feet
time                  bottom         location
----                  ------         --------
2019-08-18T00:54:00Z  2.172          santa_monica
2019-08-18T00:54:00Z  7.510          coyote_creek
2019-08-18T00:48:00Z  2.087          santa_monica
2019-08-18T00:42:00Z  2.093          santa_monica
2019-08-18T00:36:00Z  2.1261441420   santa_monica
2019-08-18T00:24:00Z  2.264          santa_monica
2019-08-18T00:18:00Z  2.329          santa_monica
2019-08-18T00:12:00Z  2.343          santa_monica
2019-08-18T00:00:00Z  2.352          santa_monica

```

Returns the smallest three values in the `water_level` field key for each 24-minute [interval](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#basic-group-by-time-syntax) between `2019-08-18T00:00:00Z` and `2019-08-18T00:54:00Z`.
It also returns results in [descending timestamp](/influxdb/v2.5/query-data/influxql/explore-data/order-by/) order.

Notice that the [GROUP BY time() clause](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals) does not override the points’ original timestamps. See [Issue 1](#bottom-with-a-group-by-time-clause) in the section below for a more detailed explanation of that behavior.

{{% /expand %}}

{{< /expand-wrapper >}}

### Common issues with `BOTTOM()`

#### `BOTTOM()` with a `GROUP BY time()` clause

Queries with `BOTTOM()` and a `GROUP BY time()` clause return the specified
number of points per `GROUP BY time()` interval.
For
[most `GROUP BY time()` queries](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals),
the returned timestamps mark the start of the `GROUP BY time()` interval.
`GROUP BY time()` queries with the `BOTTOM()` function behave differently;
they maintain the timestamp of the original data point.

##### Example

The query below returns two points per 18-minute
`GROUP BY time()` interval.
Notice that the returned timestamps are the points' original timestamps; they
are not forced to match the start of the `GROUP BY time()` intervals.

```sql
> SELECT BOTTOM("water_level",2) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(18m)

name: h2o_feet
time                   bottom
----                   ------
                           __
2019-08-18T00:00:00Z  2.064 |
2019-08-18T00:12:00Z  2.028 | <------- Smallest points for the first time interval
                           --
                           __
2019-08-18T00:24:00Z  2.041 |
2019-08-18T00:30:00Z  2.051 | <------- Smallest points for the second time interval                      --
```

#### BOTTOM() and a tag key with fewer than N tag values

Queries with the syntax `SELECT BOTTOM(<field_key>,<tag_key>,<N>)` can return fewer points than expected.
If the tag key has `X` tag values, the query specifies `N` values, and `X` is smaller than `N`, then the query returns `X` points.

##### Example

The query below asks for the smallest field values of `water_level` for three tag values of the `location` tag key.
Because the `location` tag key has two tag values (`santa_monica` and `coyote_creek`), the query returns two points instead of three.

```sql
> SELECT BOTTOM("water_level","location",3) FROM "h2o_feet"

name: h2o_feet
time                   bottom   location
----                   ------   --------
2019-08-29T10:36:00Z   -0.243   santa_monica
2019-08-29T14:30:00Z   -0.610    coyote_creek
```

<!--##### BOTTOM(), tags, and the INTO clause

When combined with an [`INTO` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#the-into-clause) and no [`GROUP BY tag` clause](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-tags), most InfluxQL functions [convert](/enterprise_influxdb/v1.9/troubleshooting/frequently-asked-questions/#why-are-my-into-queries-missing-data) any tags in the initial data to fields in the newly written data.
This behavior also applies to the `BOTTOM()` function unless `BOTTOM()` includes a tag key as an argument: `BOTTOM(field_key,tag_key(s),N)`.
In those cases, the system preserves the specified tag as a tag in the newly written data.

###### Example

The first query in the code block below returns the smallest field values in the `water_level` field key for two tag values associated with the `location` tag key.
It also writes those results to the `bottom_water_levels` measurement.

The second query [shows](/influxdb/v2.5/query-data/influxql/explore-schema/#show-tag-keys) that InfluxDB preserved the `location` tag as a tag in the `bottom_water_levels` measurement.

```sql
> SELECT BOTTOM("water_level","location",2) INTO "bottom_water_levels" FROM "h2o_feet"

name: result
time                 written
----                 -------
1970-01-01T00:00:00Z 2

> SHOW TAG KEYS FROM "bottom_water_levels"

name: bottom_water_levels
tagKey
------
location
```
-->

## FIRST()

Returns the [field value ](/influxdb/v2.5/reference/glossary/#field-value) with the oldest timestamp.

### Syntax

```
SELECT FIRST(<field_key>)[,<tag_key(s)>|<field_key(s)>] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`FIRST(field_key)`  
Returns the oldest field value (determined by timestamp) associated with the field key.

`FIRST(/regular_expression/)`  
Returns the oldest field value (determined by timestamp) associated with each field key that matches the [regular expression](/influxdb/v2.5/query-data/influxql/explore-data/regular-expressions/).

`FIRST(*)`  
Returns the oldest field value (determined by timestamp) associated with each field key in the [measurement](/influxdb/v2.5/reference/glossary/#measurement).

`FIRST(field_key),tag_key(s),field_key(s)`  
Returns the oldest field value (determined by timestamp) associated with the field key in the parentheses and the relevant [tag](/influxdb/v2.5/reference/glossary/#tag) and/or [field](/influxdb/v2.5/reference/glossary/#field).

`FIRST()` supports all field value [data types](/influxdb/v2.5/query-data/influxql/explore-data/select/#data-types).

#### Examples

{{< expand-wrapper >}}

{{% expand "Select the first field value associated with a field key" %}}

```sql
> SELECT FIRST("level description") FROM "h2o_feet"

name: h2o_feet
time                   first
----                   -----
2019-08-17T00:00:00Z   between 6 and 9 feet
```

Returns the oldest field value (determined by timestamp) associated with the `level description` field key and in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Select the first field value associated with each field key in a measurement" %}}

```sql
> SELECT FIRST(*) FROM "h2o_feet"

name: h2o_feet
time                   first_level description   first_water_level
----                   -----------------------   -----------------
1970-01-01T00:00:00Z   between 6 and 9 feet      8.120
```

Returns the oldest field value (determined by timestamp) for each field key in the `h2o_feet` measurement.
The `h2o_feet` measurement has two field keys: `level description` and `water_level`.

{{% /expand %}}

{{% expand "Select the first field value associated with each field key that matches a regular expression" %}}

```sql
> SELECT FIRST(/level/) FROM "h2o_feet"

name: h2o_feet
time                   first_level description   first_water_level
----                   -----------------------   -----------------
1970-01-01T00:00:00Z   between 6 and 9 feet      8.120
```

Returns the oldest field value for each field key that includes the word `level` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Select the first value associated with a field key and the relevant tags and fields" %}}

```sql
> SELECT FIRST("level description"),"location","water_level" FROM "h2o_feet"

name: h2o_feet
time                  first                 location      water_level
----                  -----                 --------      -----------
2019-08-17T00:00:00Z  between 6 and 9 feet  coyote_creek  8.120
```

Returns the oldest field value (determined by timestamp) in the `level description` field key and the relevant values of the `location` tag key and the `water_level` field key.

{{% /expand %}}

{{% expand "Select the first field value associated with a field key and include several clauses" %}}

```sql
> SELECT FIRST("water_level") FROM "h2o_feet" WHERE time >= '2019-08-17T23:48:00Z' AND time <= '2019-08-18T00:54:00Z' GROUP BY time(12m),* fill(9.01) LIMIT 4 SLIMIT 1

name: h2o_feet
tags: location=coyote_creek
time                   first
----                   -----
2019-08-17T23:48:00Z   8.635
2019-08-18T00:00:00Z   8.504
2019-08-18T00:12:00Z   8.320
2019-08-18T00:24:00Z   8.130
```

Returns the oldest field value (determined by timestamp) in the `water_level` field key.
It covers the [time range](/influxdb/v2.5/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2019-08-17T23:48:00Z` and `2019-08-18T00:54:00Z` and [groups](/influxdb/v2.5/query-data/influxql/explore-data/group-by/) results into 12-minute time intervals and per tag.
The query [fills](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals-and-fill) empty time intervals with `9.01`, and it [limits](/influxdb/v2.5/query-data/influxql/explore-data/limit-and-slimit/) the number of points and series returned to four and one.

Notice that the [`GROUP BY time()` clause](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals) overrides the points' original timestamps.
The timestamps in the results indicate the the start of each 12-minute time interval;
the first point in the results covers the time interval between `2019-08-17T23:48:00Z` and just before `2019-08-18T00:00:00Z` and the last point in the results covers the time interval between `2019-08-18T00:24:00Z` and just before `2019-08-18T00:36:00Z`.

{{% /expand %}}

{{< /expand-wrapper >}}

## LAST()

Returns the [field value](/influxdb/v2.5/reference/glossary/#field-value) with the most recent timestamp.

### Syntax

```sql
SELECT LAST(<field_key>)[,<tag_key(s)>|<field_keys(s)>] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`LAST(field_key)`  
Returns the newest field value (determined by timestamp) associated with the [field key](/influxdb/v2.5/reference/glossary/#field-key).

`LAST(/regular_expression/)`  
Returns the newest field value (determined by timestamp) associated with each field key that matches the [regular expression](/influxdb/v2.5/query-data/influxql/explore-data/regular-expressions/).

`LAST(*)`  
Returns the newest field value (determined by timestamp) associated with each field key in the [measurement](/influxdb/v2.5/reference/glossary/#measurement).

`LAST(field_key),tag_key(s),field_key(s)`  
Returns the newest field value (determined by timestamp) associated with the field key in the parentheses and the relevant [tag](/influxdb/v2.5/reference/glossary/#tag) and/or [field](/influxdb/v2.5/reference/glossary/#field).

`LAST()` supports all field value [data types](/influxdb/v2.5/query-data/influxql/explore-data/select/#data-types).

#### Examples

{{< expand-wrapper >}}

{{% expand "Select the last field values associated with a field key" %}}

```sql
> SELECT LAST("level description") FROM "h2o_feet"

name: h2o_feet
time                   last
----                   ----
2019-09-17T21:42:00Z   between 3 and 6 feet
```

Returns the newest field value (determined by timestamp) associated with the `level description` field key and in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Select the last field values associated with each field key in a measurement" %}}

```sql
> SELECT LAST(*) FROM "h2o_feet"

name: h2o_feet
time                   last_level description   last_water_level
----                   -----------------------   -----------------
1970-01-01T00:00:00Z   between 3 and 6 feet      4.938
```

Returns the newest field value (determined by timestamp) for each field key in the `h2o_feet` measurement.
The `h2o_feet` measurement has two field keys: `level description` and `water_level`.

{{% /expand %}}

{{% expand "Select the last field value associated with each field key that matches a regular expression" %}}

```sql
> SELECT LAST(/level/) FROM "h2o_feet"

name: h2o_feet
time                   last_level description   last_water_level
----                   -----------------------   -----------------
1970-01-01T00:00:00Z   between 3 and 6 feet      4.938
```

Returns the newest field value for each field key that includes the word `level` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Select the last field value associated with a field key and the relevant tags and fields" %}}

```sql
> SELECT LAST("level description"),"location","water_level" FROM "h2o_feet"

name: h2o_feet
time                  last                  location      water_level
----                  ----                  --------      -----------
2019-09-17T21:42:00Z  between 3 and 6 feet  santa_monica  4.938
```

Returns the newest field value (determined by timestamp) in the `level description` field key and the relevant values of the `location` tag key and the `water_level` field key.

{{% /expand %}}

{{% expand "Select the last field value associated with a field key and include several clauses" %}}

```sql
> SELECT LAST("water_level") FROM "h2o_feet" WHERE time >= '2019-08-17T23:48:00Z' AND time <= '2019-08-18T00:54:00Z' GROUP BY time(12m),* fill(9.01) LIMIT 4 SLIMIT 1

name: h2o_feet
tags: location=coyote_creek
time                   last
----                   ----
2019-08-17T23:48:00Z   8.570
2019-08-18T00:00:00Z   8.419
2019-08-18T00:12:00Z   8.225
2019-08-18T00:24:00Z   8.012
```

Returns the newest field value (determined by timestamp) in the `water_level` field key.
It covers the [time range](/influxdb/v2.5/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2019-08-17T23:48:00Z` and `2019-08-18T00:54:00Z` and [groups](/influxdb/v2.5/query-data/influxql/explore-data/group-by/) results into 12-minute time intervals and per tag.
The query [fills](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals-and-fill) empty time intervals with `9.01`, and it [limits](/influxdb/v2.5/query-data/influxql/explore-data/limit-and-slimit/) the number of points and series returned to four and one.

Notice that the [`GROUP BY time()` clause](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals) overrides the points' original timestamps.
The timestamps in the results indicate the the start of each 12-minute time interval;
the first point in the results covers the time interval between `2019-08-17T23:48:00Z` and just before `2019-08-18T00:00:00Z` and the last point in the results covers the time interval between `2019-08-18T00:24:00Z` and just before `2019-08-18T00:36:00Z`.

{{% /expand %}}

{{< /expand-wrapper >}}

## MAX()

Returns the greatest [field value](/influxdb/v2.5/reference/glossary/#field-value).

### Syntax

```
SELECT MAX(<field_key>)[,<tag_key(s)>|<field__key(s)>] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`MAX(field_key)`  
Returns the greatest field value associated with the [field key](/influxdb/v2.5/reference/glossary/#field-key).

`MAX(/regular_expression/)`  
Returns the greatest field value associated with each field key that matches the [regular expression](/influxdb/v2.5/query-data/influxql/explore-data/regular-expressions/).

`MAX(*)`  
Returns the greatest field value associated with each field key in the [measurement](/influxdb/v2.5/reference/glossary/#measurement).

`MAX(field_key),tag_key(s),field_key(s)`  
Returns the greatest field value associated with the field key in the parentheses and the relevant [tag](/influxdb/v2.5/reference/glossary/#tag) and/or [field](/influxdb/v2.5/reference/glossary/#field).

`MAX()` supports int64 and float64 field value [data types](/influxdb/v2.5/query-data/influxql/explore-data/select/#data-types).

#### Examples

{{< expand-wrapper >}}

{{% expand "Select the maximum field value associated with a field key" %}}

```sql
> SELECT MAX("water_level") FROM "h2o_feet"

name: h2o_feet
time                   max
----                   ---
2019-08-28T07:24:00Z   9.964
```

Returns the greatest field value in the `water_level` field key and in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Select the maximum field value associated with each field key in a measurement" %}}

```sql
> SELECT MAX(*) FROM "h2o_feet"

name: h2o_feet
time                   max_water_level
----                   ---------------
2019-08-28T07:24:00Z   9.964
```

Returns the greatest field value for each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

{{% /expand %}}

{{% expand "Select the maximum field value associated with each field key that matches a regular expression" %}}

```sql
> SELECT MAX(/level/) FROM "h2o_feet"

name: h2o_feet
time                   max_water_level
----                   ---------------
2019-08-28T07:24:00Z   9.964
```

Returns the greatest field value for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Select the maximum field value associated with a field key and the relevant tags and fields" %}}

```sql
> SELECT MAX("water_level"),"location","level description" FROM "h2o_feet"

name: h2o_feet
time                  max    location      level description
----                  ---    --------      -----------------
2019-08-28T07:24:00Z  9.964  coyote_creek  at or greater than 9 feet
```

Returns the greatest field value in the `water_level` field key and the relevant values of the `location` tag key and the `level description` field key.

{{% /expand %}}

{{% expand "Select the maximum field value associated with a field key and include several clauses" %}}

```sql
> SELECT MAX("water_level") FROM "h2o_feet" WHERE time >= '2019-08-17T23:48:00Z' AND time <= '2019-08-18T00:54:00Z' GROUP BY time(12m),* fill(9.01) LIMIT 4 SLIMIT 1

name: h2o_feet
tags: location=coyote_creek
time                       max
----                       ---
2019-08-17T23:48:00Z       8.635
2019-08-18T00:00:00Z       8.504
2019-08-18T00:12:00Z       8.320
2019-08-18T00:24:00Z       8.130
```

Returns the greatest field value in the `water_level` field key.
It covers the [time range](/influxdb/v2.5/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2019-08-17T23:48:00Z` and `2019-08-18T00:54:00Z` and [groups](/influxdb/v2.5/query-data/influxql/explore-data/group-by/) results in to 12-minute time intervals and per tag.
The query [fills](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals-and-fill) empty time intervals with `9.01`, and it [limits](/influxdb/v2.5/query-data/influxql/explore-data/limit-and-slimit/) the number of points and series returned to four and one.

Notice that the [`GROUP BY time()` clause](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals) overrides the points’ original timestamps.
The timestamps in the results indicate the the start of each 12-minute time interval;
the first point in the results covers the time interval between `2019-08-17T23:48:00Z` and just before `2019-08-18T00:00:00Z` and the last point in the results covers the time interval between `2019-08-18T00:24:00Z` and just before `2019-08-18T00:36:00Z`.

{{% /expand %}}

{{< /expand-wrapper >}}

## MIN()

Returns the lowest [field value](/influxdb/v2.5/reference/glossary/#field-value).

### Syntax

```
SELECT MIN(<field_key>)[,<tag_key(s)>|<field_key(s)>] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`MIN(field_key)`  
Returns the lowest field value associated with the [field key](/influxdb/v2.5/reference/glossary/#field-key).

`MIN(/regular_expression/)`  
Returns the lowest field value associated with each field key that matches the [regular expression](/influxdb/v2.5/query-data/influxql/explore-data/regular-expressions/).

`MIN(*)`  
Returns the lowest field value associated with each field key in the [measurement](/influxdb/v2.5/reference/glossary/#measurement).

`MIN(field_key),tag_key(s),field_key(s)`  
Returns the lowest field value associated with the field key in the parentheses and the relevant [tag](/influxdb/v2.5/reference/glossary/#tag) and/or [field](/influxdb/v2.5/reference/glossary/#field).

`MIN()` supports int64 and float64 field value [data types](/influxdb/v2.5/query-data/influxql/explore-data/select/#data-types).

#### Examples

{{< expand-wrapper >}}

{{% expand "Select the minimum field value associated with a field key" %}}

```sql
> SELECT MIN("water_level") FROM "h2o_feet"

name: h2o_feet
time                   min
----                   ---
2019-08-28T14:30:00Z   -0.610
```

Returns the lowest field value in the `water_level` field key and in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Select the minimum field value associated with each field key in a measurement" %}}

```sql
> SELECT MIN(*) FROM "h2o_feet"

name: h2o_feet
time                   min_water_level
----                   ---------------
2019-08-28T14:30:00Z   -0.610
```

Returns the lowest field value for each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

{{% /expand %}}

{{% expand "Select the minimum field value associated with each field key that matches a regular expression" %}}

```sql
> SELECT MIN(/level/) FROM "h2o_feet"

name: h2o_feet
time                   min_water_level
----                   ---------------
2019-08-28T14:30:00Z   -0.610
```

Returns the lowest field value for each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Select the minimum field value associated with a field key and the relevant tags and fields" %}}

```sql
> SELECT MIN("water_level"),"location","level description" FROM "h2o_feet"

name: h2o_feet
time                  min    location      level description
----                  ---    --------      -----------------
2019-08-28T14:30:00Z  -0.610  coyote_creek  below 3 feet
```

Returns the lowest field value in the `water_level` field key and the relevant values of the `location` tag key and the `level description` field key.

{{% /expand %}}

{{% expand "Select the minimum field value associated with a field key and include several clauses" %}}

```sql
> SELECT MIN("water_level") FROM "h2o_feet" WHERE time >= '2019-08-17T23:48:00Z' AND time <= '2019-08-18T00:54:00Z' GROUP BY time(12m),* fill(9.01) LIMIT 4 SLIMIT 1

name: h2o_feet
tags: location=coyote_creek
time                   min
----                   ---
2019-08-17T23:48:00Z   8.570
2019-08-18T00:00:00Z   8.419
2019-08-18T00:12:00Z   8.225
2019-08-18T00:24:00Z   8.012
```

Returns the lowest field value in the `water_level` field key.
It covers the [time range](/influxdb/v2.5/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2019-08-17T23:48:00Z` and `2019-08-18T00:54:00Z` and [groups](/influxdb/v2.5/query-data/influxql/explore-data/group-by/) results in to 12-minute time intervals and per tag.
The query [fills](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals-and-fill) empty time intervals with `9.01`, and it [limits](/influxdb/v2.5/query-data/influxql/explore-data/limit-and-slimit/) the number of points and series returned to four and one.

Notice that the [`GROUP BY time()` clause](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals) overrides the points’ original timestamps.
The timestamps in the results indicate the the start of each 12-minute time interval;
the first point in the results covers the time interval between `2019-08-17T23:48:00Z` and just before `2019-08-18T00:00:00Z` and the last point in the results covers the time interval between `2019-08-18T00:24:00Z` and just before `2019-08-18T00:36:00Z`.

{{% /expand %}}

{{< /expand-wrapper >}}

## PERCENTILE()

Returns the `N`th percentile [field value](/influxdb/v2.5/reference/glossary/#field-value).

### Syntax

```
SELECT PERCENTILE(<field_key>, <N>)[,<tag_key(s)>|<field_key(s)>] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`PERCENTILE(field_key,N)`  
Returns the Nth percentile field value associated with the [field key](/influxdb/v2.5/reference/glossary/#field-key).

`PERCENTILE(/regular_expression/,N)`  
Returns the Nth percentile field value associated with each field key that matches the [regular expression](/influxdb/v2.5/query-data/influxql/explore-data/regular-expressions/).

`PERCENTILE(*,N)`  
Returns the Nth percentile field value associated with each field key in the [measurement](/influxdb/v2.5/reference/glossary/#measurement).

`PERCENTILE(field_key,N),tag_key(s),field_key(s)`  
Returns the Nth percentile field value associated with the field key in the parentheses and the relevant [tag](/influxdb/v2.5/reference/glossary/#tag) and/or [field](/influxdb/v2.5/reference/glossary/#field).

`N` must be an integer or floating point number between `0` and `100`, inclusive.
`PERCENTILE()` supports int64 and float64 field value [data types](/influxdb/v2.5/query-data/influxql/explore-data/select/#data-types).

#### Examples

{{< expand-wrapper >}}

{{% expand "Select the fifth percentile field value associated with a field key" %}}

```sql
> SELECT PERCENTILE("water_level",5) FROM "h2o_feet"

name: h2o_feet
time                   percentile
----                   ----------
2019-09-01T17:54:00Z   1.122
```

Returns the field value that is larger than five percent of the field values in the `water_level` field key and in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Select the fifth percentile field value associated with each field key in a measurement" %}}

```sql
> SELECT PERCENTILE(*,5) FROM "h2o_feet"

name: h2o_feet
time                   percentile_water_level
----                   ----------------------
2019-09-01T17:54:00Z   1.122
```

Returns the field value that is larger than five percent of the field values in each field key that stores numerical values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numerical field: `water_level`.

{{% /expand %}}

{{% expand "Select fifth percentile field value associated with each field key that matches a regular expression" %}}

```sql
> SELECT PERCENTILE(/level/,5) FROM "h2o_feet"

name: h2o_feet
time                   percentile_water_level
----                   ----------------------
2019-09-01T17:54:00Z   1.122
```

Returns the field value that is larger than five percent of the field values in each field key that stores numerical values and includes the word `water` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Select the fifth percentile field values associated with a field key and the relevant tags and fields" %}}

```sql
> SELECT PERCENTILE("water_level",5),"location","level description" FROM "h2o_feet"

name: h2o_feet
time                  percentile  location      level description
----                  ----------  --------      -----------------
2019-08-24T10:18:00Z  1.122       coyote_creek  below 3 feet
```

Returns the field value that is larger than five percent of the field values in the `water_level` field key and the relevant values of the `location` tag key and the `level description` field key.

{{% /expand %}}

{{% expand "Select the twentieth percentile field value associated with a field key and include several clauses" %}}

```sql
> SELECT PERCENTILE("water_level",20) FROM "h2o_feet" WHERE time >= '2019-08-17T23:48:00Z' AND time <= '2019-08-18T00:54:00Z' GROUP BY time(24m) fill(15) LIMIT 2

name: h2o_feet
time                   percentile
----                   ----------
2019-08-17T23:36:00Z   2.398
2019-08-18T00:00:00Z   2.343
```

Returns the field value that is larger than 20 percent of the values in the `water_level` field key.
It covers the [time range](/influxdb/v2.5/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2019-08-17T23:48:00Z` and `2019-08-18T00:54:00Z` and [groups](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals) results into 24-minute intervals.
It [fills](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals-and-fill) empty time intervals with `15` and it [limits](/influxdb/v2.5/query-data/influxql/explore-data/limit-and-slimit/) the number of points returned to two.

Notice that the [`GROUP BY time()` clause](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals) overrides the points’ original timestamps.
The timestamps in the results indicate the the start of each 24-minute time interval; the first point in the results covers the time interval between `2019-08-17T23:36:00Z` and just before `2019-08-18T00:00:00Z` and the last point in the results covers the time interval between `2019-08-18T00:00:00Z` and just before `2019-08-18T00:24:00Z`.

{{% /expand %}}

{{< /expand-wrapper >}}

### Common issues with PERCENTILE()

#### PERCENTILE() compared to other InfluxQL functions

* `PERCENTILE(<field_key>,100)` is equivalent to [`MAX(<field_key>)`](#max).
* `PERCENTILE(<field_key>, 50)` is nearly equivalent to [`MEDIAN(<field_key>)`](#median), except the `MEDIAN()` function returns the average of the two middle values if the field key contains an even number of field values.
* `PERCENTILE(<field_key>,0)` is not equivalent to [`MIN(<field_key>)`](#min). This is a known [issue](https://github.com/influxdata/influxdb/issues/4418).

## SAMPLE()

Returns a random sample of `N` [field values](/influxdb/v2.5/reference/glossary/#field-value).
`SAMPLE()` uses [reservoir sampling](https://en.wikipedia.org/wiki/Reservoir_sampling) to generate the random points.

### Syntax

```
SELECT SAMPLE(<field_key>, <N>)[,<tag_key(s)>|<field_key(s)>] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`SAMPLE(field_key,N)`  
Returns N randomly selected field values associated with the [field key](/influxdb/v2.5/reference/glossary/#field-key).

`SAMPLE(/regular_expression/,N)`  
Returns N randomly selected field values associated with each field key that matches the [regular expression](/influxdb/v2.5/query-data/influxql/explore-data/regular-expressions/).

`SAMPLE(*,N)`  
Returns N randomly selected field values associated with each field key in the [measurement](/influxdb/v2.5/reference/glossary/#measurement).

`SAMPLE(field_key,N),tag_key(s),field_key(s)`  
Returns N randomly selected field values associated with the field key in the parentheses and the relevant [tag](/influxdb/v2.5/reference/glossary/#tag) and/or [field](/influxdb/v2.5/reference/glossary/#field).

`N` must be an integer.
`SAMPLE()` supports all field value [data types](/influxdb/v2.5/query-data/influxql/explore-data/select/#data-types).

#### Examples

{{< expand-wrapper >}}

{{% expand "Select a sample of the field values associated with a field key" %}}

```sql
> SELECT SAMPLE("water_level",2) FROM "h2o_feet"

name: h2o_feet
time                   sample
----                   ------
2019-08-22T03:42:00Z   7.218
2019-08-28T20:18:00Z   2.848
```

Returns two randomly selected points from the `water_level` field key and in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Select a sample of the field values associated with each field key in a measurement" %}}

```sql
> SELECT SAMPLE(*,2) FROM "h2o_feet"

name: h2o_feet
time                   sample_level description   sample_water_level
----                   ------------------------   ------------------
2019-08-23T17:30:00Z   below 3 feet 
2019-09-08T19:18:00Z                              8.379
2019-09-09T03:54:00Z   between 6 and 9 feet
2019-09-16T04:48:00Z                              1.437
```

Returns two randomly selected points for each field key in the `h2o_feet` measurement.
The `h2o_feet` measurement has two field keys: `level description` and `water_level`.

{{% /expand %}}

{{% expand "Select a sample of the field values associated with each field key that matches a regular expression" %}}

```sql
> SELECT SAMPLE(/level/,2) FROM "h2o_feet"

name: h2o_feet
time                   sample_level description   sample_water_level
----                   ------------------------   ------------------
2019-08-19T20:24:00Z                              4.951
2019-08-26T06:30:00Z    below 3 feet
2019-09-10T09:06:00Z                              1.312
2019-09-16T21:00:00Z    between 3 and 6 feet
```

Returns two randomly selected points for each field key that includes the word `level` in the `h2o_feet` measurement.

{{% /expand %}}

{{% expand "Select a sample of the field values associated with a field key and the relevant tags and fields" %}}

```sql
> SELECT SAMPLE("water_level",2),"location","level description" FROM "h2o_feet"

name: h2o_feet
time                  sample  location      level description
----                  ------  --------      -----------------
2019-08-31T04:30:00Z  4.954   santa_monica  between 3 and 6 feet
2019-09-13T01:24:00Z  3.389   santa_monica  between 3 and 6 feet
```

Returns two randomly selected points from the `water_level` field key and the relevant values of the `location` tag and the `level description` field.

{{% /expand %}}

{{% expand "Select a sample of the field values associated with a field key and include several clauses" %}}

```sql
> SELECT SAMPLE("water_level",1) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(18m)

name: h2o_feet
time                   sample
----                   ------
2019-08-18T00:12:00Z   2.343
2019-08-18T00:24:00Z   2.264
```

Returns one randomly selected point from the `water_level` field key.
It covers the [time range](/influxdb/v2.5/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` and [groups](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals) results into 18-minute intervals.

Notice that the [`GROUP BY time()` clause](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals) does not override the points' original timestamps.
See [Issue 1](#sample-with-a-group-by-time-clause) in the section below for a more detailed explanation of that behavior.

{{% /expand %}}

{{< /expand-wrapper >}}

### Common issues with `SAMPLE()`

#### `SAMPLE()` with a `GROUP BY time()` clause

Queries with `SAMPLE()` and a `GROUP BY time()` clause return the specified
number of points (`N`) per `GROUP BY time()` interval.
For
[most `GROUP BY time()` queries](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals),
the returned timestamps mark the start of the `GROUP BY time()` interval.
`GROUP BY time()` queries with the `SAMPLE()` function behave differently;
they maintain the timestamp of the original data point.

##### Example

The query below returns two randomly selected points per 18-minute
`GROUP BY time()` interval.
Notice that the returned timestamps are the points' original timestamps; they
are not forced to match the start of the `GROUP BY time()` intervals.

```sql
> SELECT SAMPLE("water_level",2) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(18m)

name: h2o_feet
time                   sample
----                   ------
                           __
2019-08-18T00:06:00Z   2.116 |
2019-08-18T00:12:00Z   2.028 | <------- Randomly-selected points for the first time interval
                           --
                           __
2019-08-18T00:18:00Z   2.126 |
2019-08-18T00:30:00Z   2.051 | <------- Randomly-selected points for the second time interval
                           --
```

## TOP()

Returns the greatest `N` [field values](/influxdb/v2.5/reference/glossary/#field-value).

### Syntax

```
SELECT TOP( <field_key>[,<tag_key(s)>],<N> )[,<tag_key(s)>|<field_key(s)>] FROM_clause [WHERE_clause] [GROUP_BY_clause] [ORDER_BY_clause] [LIMIT_clause] [OFFSET_clause] [SLIMIT_clause] [SOFFSET_clause]
```

`TOP(field_key,N)`  
Returns the greatest N field values associated with the [field key](/influxdb/v2.5/reference/glossary/#field-key).

`TOP(field_key,tag_key(s),N)`  
Returns the greatest field value for N tag values of the [tag key](/influxdb/v2.5/reference/glossary/#tag-key).

`TOP(field_key,N),tag_key(s),field_key(s)`  
Returns the greatest N field values associated with the field key in the parentheses and the relevant [tag](/influxdb/v2.5/reference/glossary/#tag) and/or [field](/influxdb/v2.5/reference/glossary/#field).

`TOP()` supports int64 and float64 field value [data types](/influxdb/v2.5/query-data/influxql/explore-data/select/#data-types).

{{% note %}}
**Note:** `TOP()` returns the field value with the earliest timestamp if there's a tie between two or more values for the greatest value.
{{% /note %}}

#### Examples

{{< expand-wrapper >}}

{{% expand "Select the top three field values associated with a field key" %}}

```sql
> SELECT TOP("water_level",3) FROM "h2o_feet"

name: h2o_feet
time                   top
----                   ---
2019-08-28T07:18:00Z   9.957
2019-08-28T07:24:00Z   9.964
2019-08-28T07:30:00Z   9.954
```

Returns the greatest three field values in the `water_level` field key and in the `h2o_feet` [measurement](/influxdb/v2.5/reference/glossary/#measurement).

{{% /expand %}}

{{% expand "Select the top field value associated with a field key for two tags" %}}

```sql
> SELECT TOP("water_level","location",2) FROM "h2o_feet"

name: h2o_feet
time                   top     location
----                   ---     --------
2019-08-28T03:54:00Z   7.205   santa_monica
2019-08-28T07:24:00Z   9.964   coyote_creek
```

Returns the greatest field values in the `water_level` field key for two tag values associated with the `location` tag key.

{{% /expand %}}

{{% expand "Select the top four field values associated with a field key and the relevant tags and fields" %}}

```sql
> SELECT TOP("water_level",4),"location","level description" FROM "h2o_feet"

name: h2o_feet
time                  top    location      level description
----                  ---    --------      -----------------
2019-08-28T07:18:00Z  9.957  coyote_creek  at or greater than 9 feet
2019-08-28T07:24:00Z  9.964  coyote_creek  at or greater than 9 feet
2019-08-28T07:30:00Z  9.954  coyote_creek  at or greater than 9 feet
2019-08-28T07:36:00Z  9.941  coyote_creek  at or greater than 9 feet
```

Returns the greatest four field values in the `water_level` field key and the relevant values of the `location` tag key and the `level description` field key.

{{% /expand %}}

{{% expand "Select the top three field values associated with a field key and include several clauses" %}}

```sql
> SELECT TOP("water_level",3),"location" FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:54:00Z' GROUP BY time(24m) ORDER BY time DESC

name: h2o_feet
time                    top     location
----                    ---     --------
2019-08-18T00:54:00Z    6.982   coyote_creek
2019-08-18T00:54:00Z    2.054   santa_monica
2019-08-18T00:48:00Z    7.110   coyote_creek
2019-08-18T00:36:00Z    7.372   coyote_creek
2019-08-18T00:30:00Z    7.500   coyote_creek
2019-08-18T00:24:00Z    7.635   coyote_creek
2019-08-18T00:12:00Z    7.887   coyote_creek
2019-08-18T00:06:00Z    8.005   coyote_creek
2019-08-18T00:00:00Z    8.120   coyote_creek


```

Returns the greatest three values in the `water_level` field key for each 24-minute [interval](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#basic-group-by-time-syntax) between `2019-08-18T00:00:00Z` and `2019-08-18T00:54:00Z`.
It also returns results in [descending timestamp](/influxdb/v2.5/query-data/influxql/explore-data/order-by/) order.

Notice that the [GROUP BY time() clause](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals) does not override the points’ original timestamps.
See [Issue 1](#top-with-a-group-by-time-clause) in the section below for a more detailed explanation of that behavior.

{{% /expand %}}

{{< /expand-wrapper >}}

### Common issues with `TOP()`

#### `TOP()` with a `GROUP BY time()` clause

Queries with `TOP()` and a `GROUP BY time()` clause return the specified
number of points per `GROUP BY time()` interval.
For
[most `GROUP BY time()` queries](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-time-intervals),
the returned timestamps mark the start of the `GROUP BY time()` interval.
`GROUP BY time()` queries with the `TOP()` function behave differently;
they maintain the timestamp of the original data point.

##### Example

The query below returns two points per 18-minute
`GROUP BY time()` interval.
Notice that the returned timestamps are the points' original timestamps; they
are not forced to match the start of the `GROUP BY time()` intervals.

```sql
> SELECT TOP("water_level",2) FROM "h2o_feet" WHERE time >= '2019-08-18T00:00:00Z' AND time <= '2019-08-18T00:30:00Z' AND "location" = 'santa_monica' GROUP BY time(18m)

name: h2o_feet
time                   top
----                   ------
                           __
2019-08-18T00:00:00Z  2.064 |
2019-08-18T00:06:00Z  2.116 | <------- Greatest points for the first time interval
                           --
                           __
2019-08-18T00:18:00Z  2.126 |
2019-08-18T00:30:00Z  2.051 | <------- Greatest points for the second time interval
                           --
```

#### TOP() and a tag key with fewer than N tag values

Queries with the syntax `SELECT TOP(<field_key>,<tag_key>,<N>)` can return fewer points than expected.
If the tag key has `X` tag values, the query specifies `N` values, and `X` is smaller than `N`, then the query returns `X` points.

##### Example

The query below asks for the greatest field values of `water_level` for three tag values of the `location` tag key.
Because the `location` tag key has two tag values (`santa_monica` and `coyote_creek`), the query returns two points instead of three.

```sql
> SELECT TOP("water_level","location",3) FROM "h2o_feet"

name: h2o_feet
time                  top    location
----                  ---    --------
2019-08-29T03:54:00Z  7.205  santa_monica
2019-08-29T07:24:00Z  9.964  coyote_creek
```

<!--
##### TOP(), tags, and the INTO clause

When combined with an [`INTO` clause](/enterprise_influxdb/v1.9/query_language/explore-data/#the-into-clause) and no [`GROUP BY tag` clause](/influxdb/v2.5/query-data/influxql/explore-data/group-by/#group-by-tags), most InfluxQL functions [convert](/enterprise_influxdb/v1.9/troubleshooting/frequently-asked-questions/#why-are-my-into-queries-missing-data) any tags in the initial data to fields in the newly written data.
This behavior also applies to the `TOP()` function unless `TOP()` includes a tag key as an argument: `TOP(field_key,tag_key(s),N)`.
In those cases, the system preserves the specified tag as a tag in the newly written data.

###### Example

The first query in the codeblock below returns the greatest field values in the `water_level` field key for two tag values associated with the `location` tag key.
It also writes those results to the `top_water_levels` measurement.

The second query [shows](/influxdb/v2.5/query-data/influxql/explore-schema/#show-tag-keys) that InfluxDB preserved the `location` tag as a tag in the `top_water_levels` measurement.

```sql
> SELECT TOP("water_level","location",2) INTO "top_water_levels" FROM "h2o_feet"

name: result
time                 written
----                 -------
1970-01-01T00:00:00Z 2

> SHOW TAG KEYS FROM "top_water_levels"

name: top_water_levels
tagKey
------
location
```
-->
