---
title: InfluxQL aggregate functions
list_title: Aggregate functions
description: >
  Aggregate data with InfluxQL aggregate functions.
menu:
  influxdb_cloud_dedicated:
    name: Aggregates
    parent: influxql-functions
weight: 205
---

Use aggregate functions to assess, aggregate, and return values in your data.
Aggregate functions return one row containing the aggregate values from each InfluxQL group.

Each aggregate function below covers **syntax** including parameters to pass to the function, and **examples** of how to use the function. Examples use [NOAA water sample data](/influxdb/v2.7/reference/sample-data/#noaa-water-sample-data).

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

Returns the number of non-null [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).
Supports all field value [data types](/influxdb/cloud-dedicated/reference/glossary/#data-type).

```sql
COUNT(field_expression)
```

##### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).

#### Examples

{{< expand-wrapper >}}
{{% expand "Count values for a field" %}}

Return the number of non-null field values in the `water_level` field key in the `h2o_feet` measurement.

```sql
SELECT COUNT("water_level") FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |            count |
| :------------------- | ---------------: |
| 1970-01-01T00:00:00Z | 61026.0000000000 |

{{% /expand %}}

{{% expand "Count values for each field in a measurement" %}}

Return the number of non-null field values for each field key associated with the `h2o_feet` measurement.
The `h2o_feet` measurement has two field keys: `level description` and `water_level`.

```sql
SELECT COUNT(*) FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | count_level description | count_water_level |
| :------------------- | ----------------------: | ----------------: |
| 1970-01-01T00:00:00Z |        61026.0000000000 |  61026.0000000000 |

{{% /expand %}}

{{% expand "Count values for fields that match a regular expression" %}}

Return the number of non-null field values for every field key that contains the
word `water` in the `h2o_feet` measurement.

```sql
SELECT COUNT(/water/) FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | count_water_level |
| :------------------- | ----------------: |
| 1970-01-01T00:00:00Z |  61026.0000000000 |

{{% /expand %}}

{{% expand "Count distinct values for a field" %}}

Return the number of unique field values for the `level description` field key
and the `h2o_feet` measurement.
InfluxQL supports nesting [DISTINCT()](#distinct) in `COUNT()`.

```sql
SELECT COUNT(DISTINCT("level description")) FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |        count |
| :------------------- | -----------: |
| 1970-01-01T00:00:00Z | 4.0000000000 |

{{% /expand %}}

{{< /expand-wrapper >}}

## DISTINCT()

Returns the list of unique [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).
Supports all field value [data types](/influxdb/cloud-dedicated/reference/glossary/#data-type).
_InfluxQL supports nesting `DISTINCT()` with [`COUNT()`](#count)_.

```sql
DISTINCT(field_key)
```

##### Arguments

- **field_key**: Field key to return distinct values from.

#### Examples

{{< expand-wrapper >}}
{{% expand "List the distinct field values associated with a field key" %}}

Return a tabular list of the unique field values in the `level description`
field key in the `h2o_feet` measurement.

```sql
SELECT DISTINCT("level description") FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | distinct                  |
| :------------------- | :------------------------ |
| 1970-01-01T00:00:00Z | between 6 and 9 feet      |
| 1970-01-01T00:00:00Z | below 3 feet              |
| 1970-01-01T00:00:00Z | between 3 and 6 feet      |
| 1970-01-01T00:00:00Z | at or greater than 9 feet |

{{% /expand %}}
{{< /expand-wrapper >}}

## INTEGRAL()

Returns the area under the curve for queried [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value)
and converts those results into the summed area per **unit** of time.

{{% note %}}
`INTEGRAL()` does not support [`fill()`](/influxdb/cloud-dedicated/query-data/influxql/explore-data/group-by/#group-by-time-intervals-and-fill).
`INTEGRAL()` supports int64 and float64 field value [data types](/influxdb/cloud-dedicated/reference/glossary/#data-type).
{{% /note %}}

```sql
INTEGRAL(field_expression[, unit])
```

##### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
- **unit**: Unit of time to use when calculating the integral.
  Default is `1s` (one second).

#### Examples

{{< expand-wrapper >}}
{{% expand "Calculate the integral for the field values associated with a field key" %}}

Return the area under the curve (in seconds) for the field values associated
with the `water_level` field key and in the `h2o_feet` measurement.

```sql
SELECT INTEGRAL("water_level")
FROM "h2o_feet"
WHERE
  "location" = 'santa_monica'
  AND time >= '2019-08-18T00:00:00Z'
  AND time <= '2019-08-18T00:30:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |        integral |
| :------------------- | --------------: |
| 1970-01-01T00:00:00Z | 4184.8200000000 |

{{% /expand %}}

{{% expand "Calculate the integral for the field values associated with a field key and specify the unit option" %}}

Return the area under the curve (in minutes) for the field values associated
with the `water_level` field key and in the `h2o_feet` measurement.

```sql
SELECT INTEGRAL("water_level", 1m)
FROM "h2o_feet"
WHERE
  "location" = 'santa_monica'
  AND time >= '2019-08-18T00:00:00Z'
  AND time <= '2019-08-18T00:30:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |      integral |
| :------------------- | ------------: |
| 1970-01-01T00:00:00Z | 69.7470000000 |

{{% /expand %}}

{{% expand "Calculate the integral for the field values associated with each field key in a measurement and specify the unit option" %}}

Return the area under the curve (in minutes) for the field values associated
with each field key that stores numeric values in the `h2o_feet` measurement.
The `h2o_feet` measurement has on numeric field: `water_level`.

```sql
SELECT INTEGRAL(*, 1m)
FROM "h2o_feet"
WHERE
  "location" = 'santa_monica'
  AND time >= '2019-08-18T00:00:00Z'
  AND time <= '2019-08-18T00:30:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | integral_water_level |
| :------------------- | -------------------: |
| 1970-01-01T00:00:00Z |        69.7470000000 |

{{% /expand %}}

{{% expand "Calculate the integral for the field values associated with each field key that matches a regular expression and specify the unit option" %}}

Return the area under the curve (in minutes) for the field values associated
with each field key that stores numeric values includes the word `water` in
the `h2o_feet` measurement.

```sql
SELECT INTEGRAL(/water/, 1m)
FROM "h2o_feet"
WHERE
  "location" = 'santa_monica'
  AND time >= '2019-08-18T00:00:00Z'
  AND time <= '2019-08-18T00:30:00Z'
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | integral_water_level |
| :------------------- | -------------------: |
| 1970-01-01T00:00:00Z |        69.7470000000 |

{{% /expand %}}

{{% expand "Calculate the integral for the field values associated with a field key and include several clauses" %}}

Return the area under the curve (in minutes) for the field values associated
with the `water_level` field key and in the `h2o_feet` measurement in the
[time range](/influxdb/v2.7/query-data/influxql/explore-data/time-and-timezone/#time-syntax) between
`2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z`, [grouped](/influxdb/v2.7/query-data/influxql/explore-data/group-by/#group-by-time-intervals) results into 12-minute intervals, and
[limit](/influxdb/influxdb/v2.7/query-data/influxql/explore-data/limit-and-slimit/)
the number of results returned to one.

```sql
SELECT INTEGRAL("water_level", 1m)
FROM "h2o_feet"
WHERE
  "location" = 'santa_monica'
  AND time >= '2019-08-18T00:00:00Z'
  AND time <= '2019-08-18T00:30:00Z'
GROUP BY time(12m)
LIMIT 1
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | integral      |
| :------------------- | -------------: |
| 2019-08-18T00:00:00Z | 28.3590000000 |

{{% /expand %}}
{{< /expand-wrapper >}}

## MEAN()

Returns the arithmetic mean (average) of [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).
`MEAN()` supports int64 and float64 field value [data types](/influxdb/cloud-dedicated/reference/glossary/#data-type).

```sql
MEAN(field_expression)
```

##### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).

#### Examples

{{< expand-wrapper >}}
{{% expand "Calculate the mean field value associated with a field key" %}}

Return the average field value in the `water_level` field key in the `h2o_feet` measurement.

```sql
SELECT MEAN("water_level") FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |         mean |
| :------------------- | -----------: |
| 1970-01-01T00:00:00Z | 4.4418674882 |

{{% /expand %}}

{{% expand "Calculate the mean field value associated with each field key in a measurement" %}}

Return the average field value for every field key that stores numeric values
in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT MEAN(*) FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | mean_water_level |
| :------------------- | ---------------: |
| 1970-01-01T00:00:00Z |     4.4418674882 |

{{% /expand %}}

{{% expand "Calculate the mean field value associated with each field key that matches a regular expression" %}}

Return the average field value for each field key that stores numeric values and
includes the word `water` in the `h2o_feet` measurement.

```sql
SELECT MEAN(/water/) FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | mean_water_level |
| :------------------- | ---------------: |
| 1970-01-01T00:00:00Z |     4.4418674882 |

{{% /expand %}}

{{% expand "Calculate the mean field value associated with a field key and include several clauses" %}}

Return the average of the values in the `water_level` field key in the
[time range](/influxdb/v2.7/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` and
[group](/influxdb/v2.7/query-data/influxql/explore-data/group-by/)
results into 12-minute time intervals and per tag.
Then [fill](/influxdb/v2.7/query-data/influxql/explore-data/group-by/#group-by-time-intervals-and-fill)
empty time intervals with `9.01` and
[limit](/influxdb/influxdb/v2.7/query-data/influxql/explore-data/limit-and-slimit/)
the number of points and series returned to seven and one.

```sql
SELECT MEAN("water_level")
FROM "h2o_feet"
WHERE
  time >= '2019-08-18T00:00:00Z'
  AND time <= '2019-08-18T00:30:00Z'
GROUP BY time(12m),* fill(9.01)
LIMIT 7
SLIMIT 1
```

{{% influxql/table-meta %}}
name: h2o_feet
tags: location=coyote_creek
{{% /influxql/table-meta %}}

| time                 |         mean |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 8.4615000000 |
| 2019-08-18T00:12:00Z | 8.2725000000 |
| 2019-08-18T00:24:00Z | 8.0710000000 |

{{% /expand %}}
{{< /expand-wrapper >}}

## MEDIAN()

Returns the middle value from a sorted list of [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).
`MEDIAN()` supports int64 and float64 field value [data types](/influxdb/cloud-dedicated/reference/glossary/#data-type).

{{% note %}}
**Note:** `MEDIAN()` is nearly equivalent to [`PERCENTILE(field_key, 50)`](/influxdb/v2.7/query-data/influxql/functions/selectors/#percentile), except `MEDIAN()` returns the average of the two middle field values if the field contains an even number of values.
{{% /note %}}

```sql
MEDIAN(field_expression)
```

##### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).

#### Examples

{{< expand-wrapper >}}
{{% expand "Calculate the median field value associated with a field key" %}}

Return the middle field value in the `water_level` field key and in the `h2o_feet` measurement.

```sql
SELECT MEDIAN("water_level") FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |       median |
| :------------------- | -----------: |
| 1970-01-01T00:00:00Z | 4.1240000000 |

{{% /expand %}}

{{% expand "Calculate the median field value associated with each field key in a measurement" %}}

Return the middle field value for every field key that stores numeric values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT MEDIAN(*) FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | median_water_level |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z |       4.1240000000 |

{{% /expand %}}

{{% expand "Calculate the median field value associated with each field key that matches a regular expression" %}}

Return the middle field value for every field key that stores numeric values and
includes the word `water` in the `h2o_feet` measurement.

```sql
SELECT MEDIAN(/water/) FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | median_water_level |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z |       4.1240000000 |

{{% /expand %}}

{{% expand "Calculate the median field value associated with a field key and include several clauses" %}}

Return the middle field value in the `water_level` field key in the
[time range](/influxdb/v2.7/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` and
[group](/influxdb/v2.7/query-data/influxql/explore-data/group-by/)
results into 12-minute time intervals and per tag.
Then [fill](/influxdb/v2.7/query-data/influxql/explore-data/group-by/#group-by-time-intervals-and-fill)
empty time intervals with `700 `, [limit](/influxdb/influxdb/v2.7/query-data/influxql/explore-data/limit-and-slimit/)
the number of points and series returned to seven and one, and [offset](/influxdb/v2.7/query-data/influxql/explore-data/limit-and-slimit/) the series returned by one.

```sql
SELECT MEDIAN("water_level")
FROM "h2o_feet"
WHERE
  time >= '2019-08-18T00:00:00Z'
  AND time <= '2019-08-18T00:30:00Z'
GROUP BY time(12m),* fill(700)
LIMIT 7
SLIMIT 1
SOFFSET 1
```

{{% influxql/table-meta %}}
name: h2o_feet
tags: location=santa_monica
{{% /influxql/table-meta %}}

| time                 |       median |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 2.3655000000 |
| 2019-08-18T00:12:00Z | 2.3360000000 |
| 2019-08-18T00:24:00Z | 2.2655000000 |

{{% /expand %}}
{{< /expand-wrapper >}}

## MODE()

Returns the most frequent value in a list of [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).
`MODE()` supports all field value [data types](/influxdb/cloud-dedicated/reference/glossary/#data-type).

{{% note %}}
**Note:** `MODE()` returns the field value with the earliest [timestamp](/influxdb/v2.7/reference/glossary/#timestamp)
if  there's a tie between two or more values for the maximum number of occurrences.
{{% /note %}}

```sql
MODE(field_expression)
```

##### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the mode field value associated with a field key" %}}

Return the most frequent field value in the `level description` field key and in
the `h2o_feet` measurement.

```sql
SELECT MODE("level description") FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | mode                 |
| :------------------- | :------------------- |
| 1970-01-01T00:00:00Z | between 3 and 6 feet |

{{% /expand %}}

{{% expand "Calculate the mode field value associated with each field key in a measurement" %}}

Return the most frequent field value for every field key in the `h2o_feet` measurement.
The `h2o_feet` measurement has two field keys: `level description` and `water_level`.

```sql
SELECT MODE(*) FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | mode_level description | mode_water_level |
| :------------------- | :--------------------- | ---------------: |
| 1970-01-01T00:00:00Z | between 3 and 6 feet   |     2.6900000000 |

{{% /expand %}}

{{% expand "Calculate the mode field value associated with each field key that matches a regular expression" %}}

Return the most frequent field value for every field key that includes the word
`/water/` in the `h2o_feet` measurement.

```sql
SELECT MODE(/water/) FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | mode_water_level |
| :------------------- | ---------------: |
| 1970-01-01T00:00:00Z |     2.6900000000 |

{{% /expand %}}

{{% expand "Calculate the mode field value associated with a field key and include several clauses" %}}

Return the mode of the values associated with the `water_level` field key in the
[time range](/influxdb/v2.7/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` and
[group](/influxdb/v2.7/query-data/influxql/explore-data/group-by/)
results into 12-minute time intervals and per tag.
Then [limis](/influxdb/influxdb/v2.7/query-data/influxql/explore-data/limit-and-slimit/)
the number of points and series retu
ned tothree and one, and it [offsets](/influxdb/v2.7/query-data/influxql/explore-data
#the-offset-and-soffset-clauses) the series returned by one.

```sql
SELECT MODE("level description")
FROM "h2o_feet"
WHERE
  time >= '2019-08-18T00:00:00Z'
  AND time <= '2019-08-18T00:30:00Z'
GROUP BY time(12m),*
LIMIT 3
SLIMIT 1
SOFFSET 1
```

{{% influxql/table-meta %}}
name: h2o_feet
tags: location=santa_monica
{{% /influxql/table-meta %}}

| time                 | mode         |
| :------------------- | :----------- |
| 2019-08-18T00:00:00Z | below 3 feet |
| 2019-08-18T00:12:00Z | below 3 feet |
| 2019-08-18T00:24:00Z | below 3 feet |

{{% /expand %}}
{{< /expand-wrapper >}}

## SPREAD()

Returns the difference between the minimum and maximum [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).
`SPREAD()` supports int64 and float64 field value [data types](/influxdb/cloud-dedicated/reference/glossary/#data-type).

```sql
SPREAD(field_expression)
```

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the spread for the field values associated with a field key" %}}

Return the difference between the minimum and maximum field values in the
`water_level` field key and in the `h2o_feet` measurement.

```sql
SELECT SPREAD("water_level") FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |        spread |
| :------------------- | ------------: |
| 1970-01-01T00:00:00Z | 10.5740000000 |

{{% /expand %}}

{{% expand "Calculate the spread for the field values associated with each field key in a measurement" %}}

Return the difference between the minimum and maximum field values for every
field key that stores numeric values in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT SPREAD(*) FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | spread_water_level |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z |      10.5740000000 |

{{% /expand %}}

{{% expand "Calculate the spread for the field values associated with each field key that matches a regular expression" %}}

Return the difference between the minimum and maximum field values for every
field key that stores numeric values and includes the word `water` in the `h2o_feet` measurement.

```sql
SELECT SPREAD(/water/) FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | spread_water_level |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z |      10.5740000000 |

{{% /expand %}}

{{% expand "Calculate the spread for the field values associated with a field key and include several clauses" %}}

Return the difference between the minimum and maximum field values in the `water_level` field key in the
[time range](/influxdb/v2.7/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` and
[group](/influxdb/v2.7/query-data/influxql/explore-data/group-by/)
results into 12-minute time intervals and per tag.
Then [fill](/influxdb/v2.7/query-data/influxql/explore-data/group-by/#group-by-time-intervals-and-fill)
empty time intervals with `18`, [lim
ts](/ifluxdb/influxdb/v2.7/query-data/influxql/explore-data/limit-and-slimit/)
the number of points and series returned to three and one, and [offsets](/influxdb/v2.7/query-data/influxql/explore-data/limit-and-slimit/) the series returned by one.

```sql
SELECT SPREAD("water_level")
FROM "h2o_feet"
WHERE
  time >= '2019-08-18T00:00:00Z'
  AND time <= '2019-08-18T00:30:00Z'
GROUP BY time(12m),* fill(18)
LIMIT 3
SLIMIT 1
SOFFSET 1
```

{{% influxql/table-meta %}}
name: h2o_feet
tags: location=santa_monica
{{% /influxql/table-meta %}}

| time                 |       spread |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 0.0270000000 |
| 2019-08-18T00:12:00Z | 0.0140000000 |
| 2019-08-18T00:24:00Z | 0.0030000000 |

{{% /expand %}}
{{< /expand-wrapper >}}

## STDDEV()

Returns the standard deviation of [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).
`STDDEV()` supports int64 and float64 field value [data types](/influxdb/cloud-dedicated/reference/glossary/#data-type).

```sql
STDDEV(field_expression)
```

##### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).

#### Examples

{{< expand-wrapper >}}
{{% expand "Calculate the standard deviation for the field values associated with a field key" %}}

Return the standard deviation of the field values in the `water_level` field key
and in the `h2o_feet` measurement.

```sql
SELECT STDDEV("water_level") FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |       stddev |
| :------------------- | -----------: |
| 1970-01-01T00:00:00Z | 2.2789744110 |

{{% /expand %}}

{{% expand "Calculate the standard deviation for the field values associated with each field key in a measurement" %}}

Return the standard deviation of numeric fields in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT STDDEV(*) FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | stddev_water_level |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z |       2.2789744110 |

{{% /expand %}}

{{% expand "Calculate the standard deviation for the field values associated with each field key that matches a regular expression" %}}

Return the standard deviation of numeric fields with `water` in the field key in the `h2o_feet` measurement.

```sql
SELECT STDDEV(/water/) FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 | stddev_water_level |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z |       2.2789744110 |

{{% /expand %}}

{{% expand "Calculate the standard deviation for the field values associated with a field key and include several clauses" %}}

Return the standard deviation of the field values in the `water_level` field key in the
[time range](/influxdb/v2.7/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` and
[group](/influxdb/v2.7/query-data/influxql/explore-data/group-by/)
results into 12-minute time intervals and per tag.
Then [fill](/influxdb/v2.7/query-data/influxql/explore-data/group-by/#group-by-time-intervals-and-fill)
empty time intervals with `18000`, [limit](/influxdb/influxdb/v2.7/query-data/influxql/explore-data/limit-and-slimit/)
the number of points and series returned to two and one, and [offsets](/influxdb/v2.7/query-data/influxql/explore-data/limit-and-slimit/) the series returned by one.

```sql
SELECT STDDEV("water_level")
FROM "h2o_feet"
WHERE
  time >= '2019-08-18T00:00:00Z'
  AND time <= '2019-08-18T00:30:00Z'
GROUP BY time(12m),* fill(18000)
LIMIT 2
SLIMIT 1
SOFFSET 1
```

{{% influxql/table-meta %}}
name: h2o_feet
tags: location=santa_monica
{{% /influxql/table-meta %}}

| time                 |       stddev |
| :------------------- | -----------: |
| 2019-08-18T00:00:00Z | 0.0190918831 |
| 2019-08-18T00:12:00Z | 0.0098994949 |

{{% /expand %}}
{{< /expand-wrapper >}}

## SUM()

Returns the sum of [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).
`SUM()` supports int64 and float64 field value [data types](/influxdb/cloud-dedicated/reference/glossary/#data-type).

```sql
SUM(field_expression)
```

##### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).

#### Examples

{{< expand-wrapper >}}
{{% expand "Calculate the sum of the field values associated with a field key" %}}

Return the summed total of the field values in the `water_level` field key and
in the `h2o_feet` measurement.

```sql
SELECT SUM("water_level") FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |               sum |
| :------------------- | ----------------: |
| 1970-01-01T00:00:00Z | 271069.4053333958 |

{{% /expand %}}

{{% expand "Calculate the sum of the field values associated with each field key in a measurement" %}}

Return the summed total of numeric fields in the `h2o_feet` measurement.
The `h2o_feet` measurement has one numeric field: `water_level`.

```sql
SELECT SUM(*) FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |   sum_water_level |
| :------------------- | ----------------: |
| 1970-01-01T00:00:00Z | 271069.4053333958 |

{{% /expand %}}

{{% expand "Calculate the sum of the field values associated with each field key that matches a regular expression" %}}

Return the summed total of numeric fields with `water` in the field key in the `h2o_feet` measurement.

```sql
SELECT SUM(/water/) FROM "h2o_feet"
```

{{% influxql/table-meta %}}
name: h2o_feet
{{% /influxql/table-meta %}}

| time                 |   sum_water_level |
| :------------------- | ----------------: |
| 1970-01-01T00:00:00Z | 271069.4053333958 |

{{% /expand %}}

{{% expand "Calculate the sum of the field values associated with a field key and include several clauses" %}}

Return the summed total of the field values in the `water_level` field key in the
[time range](/influxdb/v2.7/query-data/influxql/explore-data/time-and-timezone/#time-syntax)
between `2019-08-18T00:00:00Z` and `2019-08-18T00:30:00Z` and
[group](/influxdb/v2.7/query-data/influxql/explore-data/group-by/)
results into 12-minute time intervals and per tag. 
Then [fill](/influxdb/v2.7/query-data/influxql/explore-data/group-by/#group-by-time-intervals-and-fill)
empty time intervals with 18000, and [limit](/influxdb/influxdb/v2.7/query-data/influxql/explore-data/limit-and-slimit/)
the number of points and series returned to four and one.

```sql
SELECT SUM("water_level")
FROM "h2o_feet"
WHERE
  time >= '2019-08-18T00:00:00Z'
  AND time <= '2019-08-18T00:30:00Z'
GROUP BY time(12m),* fill(18000)
LIMIT 4
SLIMIT 1
```

{{% influxql/table-meta %}}
name: h2o_feet
tags: location=coyote_creek
{{% /influxql/table-meta %}}

| time                 |           sum |
| :------------------- | ------------: |
| 2019-08-18T00:00:00Z | 16.9230000000 |
| 2019-08-18T00:12:00Z | 16.5450000000 |
| 2019-08-18T00:24:00Z | 16.1420000000 |

{{% /expand %}}
{{< /expand-wrapper >}}
