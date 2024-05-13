---
title: InfluxQL aggregate functions
list_title: Aggregate functions
description: >
  Use InfluxQL aggregate functions to aggregate your time series data.
menu:
  influxdb_cloud_dedicated:
    name: Aggregates
    parent: influxql-functions
weight: 205
related:
  - /influxdb/cloud-dedicated/query-data/influxql/aggregate-select/
---

Use aggregate functions to assess, aggregate, and return values in your data.
Aggregate functions return one row containing the aggregate values from each InfluxQL group.

_Examples use the sample data set provided in the
[Get started with InfluxDB tutorial](/influxdb/cloud-dedicated/get-started/write/#construct-line-protocol)._

- [COUNT()](#count)
- [DISTINCT()](#distinct)
- [MEAN()](#mean)
- [MEDIAN()](#median)
- [MODE()](#mode)
- [SPREAD()](#spread)
- [STDDEV()](#stddev)
- [SUM()](#sum)

<!-- When implemented, place back in alphabetical order -->
<!-- - [INTEGRAL()](#integral) -->

{{% note %}}
#### Missing InfluxQL functions

Some InfluxQL functions are in the process of being rearchitected to work with
the InfluxDB 3.0 storage engine. If a function you need is not here, check the
[InfluxQL feature support page](/influxdb/cloud-dedicated/reference/influxql/feature-support/#function-support)
for more information.
{{% /note %}}

## COUNT()

Returns the number of non-null [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).

```sql
COUNT(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports all field types.

#### Examples

{{< expand-wrapper >}}
{{% expand "Count the number of non-null values in a field" %}}

```sql
SELECT COUNT(temp) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | count |
| :------------------- | ----: |
| 1970-01-01T00:00:00Z |    26 |

{{% /expand %}}

{{% expand "Count the number of non-null values in each field" %}}

```sql
SELECT COUNT(*) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | count_co | count_hum | count_temp |
| :------------------- | -------: | --------: | ---------: |
| 1970-01-01T00:00:00Z |       26 |        26 |         26 |

{{% /expand %}}

{{% expand "Count the number of non-null values in fields where the field key matches a regular expression" %}}

```sql
SELECT COUNT(/^[th]/) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | count_hum | count_temp |
| :------------------- | --------: | ---------: |
| 1970-01-01T00:00:00Z |        26 |         26 |

{{% /expand %}}

{{% expand "Count distinct values for a field" %}}

InfluxQL supports nesting [`DISTINCT()`](#distinct) in `COUNT()`.

```sql
SELECT COUNT(DISTINCT(co)) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | count |
| :------------------- | ----: |
| 1970-01-01T00:00:00Z |    12 |

{{% /expand %}}

{{% expand "Count the number of non-null field values within time windows (grouped by time)" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  COUNT(temp)
FROM home
WHERE
  room = 'Kitchen'
  AND time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
GROUP BY time(6h)
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | count |
| :------------------- | ----: |
| 2022-01-01T06:00:00Z |     4 |
| 2022-01-01T12:00:00Z |     6 |
| 2022-01-01T18:00:00Z |     3 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## DISTINCT()

Returns the list of unique [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).

```sql
DISTINCT(field_key)
```

#### Arguments

- **field_key**: Field key to return distinct values from.
  Supports all field types.

#### Notable behaviors

- InfluxQL supports nesting `DISTINCT()` with [`COUNT()`](#count-distinct-values-for-a-field).

#### Examples

{{< expand-wrapper >}}
{{% expand "List the distinct field values" %}}

```sql
SELECT DISTINCT(co) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | distinct |
| :------------------- | -------: |
| 1970-01-01T00:00:00Z |        0 |
| 1970-01-01T00:00:00Z |        1 |
| 1970-01-01T00:00:00Z |        3 |
| 1970-01-01T00:00:00Z |        4 |
| 1970-01-01T00:00:00Z |        7 |
| 1970-01-01T00:00:00Z |        5 |
| 1970-01-01T00:00:00Z |        9 |
| 1970-01-01T00:00:00Z |       18 |
| 1970-01-01T00:00:00Z |       14 |
| 1970-01-01T00:00:00Z |       22 |
| 1970-01-01T00:00:00Z |       17 |
| 1970-01-01T00:00:00Z |       26 |

{{% /expand %}}
{{< /expand-wrapper >}}

<!-- ## INTEGRAL()

Returns the area under the curve for queried [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value)
and converts those results into the summed area per **unit** of time.

{{% note %}}
`INTEGRAL()` does not support [`fill()`](/influxdb/cloud-dedicated/query-data/influxql/explore-data/group-by/#group-by-time-intervals-and-fill).
`INTEGRAL()` supports int64 and float64 field value [data types](/influxdb/cloud-dedicated/reference/glossary/#data-type).
{{% /note %}}

```sql
INTEGRAL(field_expression[, unit])
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
- **unit**: Unit of time to use when calculating the integral.
  Default is `1s` (one second).

#### Examples

{{< expand-wrapper >}}
{{% expand "Calculate the integral for a field" %}}

```sql
SELECT
  INTEGRAL(co)
FROM home
WHERE room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | integral |
| :------------------- | -------: |
| 1970-01-01T00:00:00Z |   266400 |

{{% /expand %}}

{{% expand "Calculate the integral for a field and specify the unit option" %}}

```sql
SELECT
  INTEGRAL(co, 1h)
FROM home
WHERE room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | integral |
| :------------------- | -------: |
| 1970-01-01T00:00:00Z |       74 |

{{% /expand %}}

{{% expand "Calculate the integral for _each_ field and specify the unit option" %}}

Return the area under the curve (in minutes) for the field values associated
with each field key that stores numeric values in the `h2o_feet` measurement.
The `h2o_feet` measurement has on numeric field: `water_level`.

```sql
SELECT
  INTEGRAL(*, 1h)
FROM home
WHERE room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | integral_co | integral_hum | integral_temp |
| :------------------- | ----------: | -----------: | ------------: |
| 1970-01-01T00:00:00Z |          74 |          435 |        272.25 |

{{% /expand %}}

{{% expand "Calculate the integral for the field keys that matches a regular expression" %}}

```sql
SELECT
  INTEGRAL(/^[th]/, 1h)
FROM home
WHERE room = 'Kitchen'
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | integral_hum | integral_temp |
| :------------------- | -----------: | ------------: |
| 1970-01-01T00:00:00Z |          435 |        272.25 |

{{% /expand %}}

{{% expand "Calculate the integral for a field grouping by time" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  INTEGRAL(co, 1h)
FROM home
WHERE
  room = 'Kitchen'
  AND time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
GROUP BY time(6h)
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | integral |
| :------------------- | -------: |
| 2022-01-01T06:00:00Z |        0 |
| 2022-01-01T12:00:00Z |       30 |
| 2022-01-01T18:00:00Z |       44 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}} -->

## MEAN()

Returns the arithmetic mean (average) of [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).

```sql
MEAN(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports **numeric fields**.

#### Examples

{{< expand-wrapper >}}
{{% expand "Calculate the mean value of a field" %}}

```sql
SELECT MEAN(temp) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 |               mean |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z | 22.396153846153844 |

{{% /expand %}}

{{% expand "Calculate the mean value of each field" %}}

```sql
SELECT MEAN(*) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 |           mean_co | mean_hum |          mean_temp |
| :------------------- | ----------------: | -------: | -----------------: |
| 1970-01-01T00:00:00Z | 5.269230769230769 |    36.15 | 22.396153846153844 |

{{% /expand %}}

{{% expand "Calculate the mean value of fields where the field key matches a regular expression" %}}

```sql
SELECT MEAN(/^[th]/) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | mean_hum |          mean_temp |
| :------------------- | -------: | -----------------: |
| 1970-01-01T00:00:00Z |    36.15 | 22.396153846153844 |

{{% /expand %}}

{{% expand "Calculate the mean value of a field within time windows (grouped by time)" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  MEAN(temp)
FROM home
WHERE
  room = 'Kitchen'
  AND time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
GROUP BY time(6h)
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 |               mean |
| :------------------- | -----------------: |
| 2022-01-01T06:00:00Z |             22.275 |
| 2022-01-01T12:00:00Z | 22.649999999999995 |
| 2022-01-01T18:00:00Z | 23.033333333333335 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## MEDIAN()

Returns the middle value from a sorted list of [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).

```sql
MEDIAN(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports **numeric fields**.

#### Notable behaviors

- `MEDIAN()` is nearly equivalent to
  [`PERCENTILE(field_key, 50)`](/influxdb/cloud-dedicated/reference/influxql/functions/selectors/#percentile),
  except `MEDIAN()` returns the average of the two middle field values if the
  field contains an even number of values.

#### Examples

{{< expand-wrapper >}}
{{% expand "Calculate the median value of a field" %}}

```sql
SELECT MEDIAN(temp) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | median |
| :------------------- | -----: |
| 1970-01-01T00:00:00Z |  22.45 |

{{% /expand %}}

{{% expand "Calculate the median value of each field" %}}

```sql
SELECT MEDIAN(*) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | median_co | median_hum | median_temp |
| :------------------- | --------: | ---------: | ----------: |
| 1970-01-01T00:00:00Z |         1 |      36.05 |       22.45 |

{{% /expand %}}

{{% expand "Calculate the median value of fields where the field key matches a regular expression" %}}


```sql
SELECT MEDIAN(/^[th]/) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | median_hum | median_temp |
| :------------------- | ---------: | ----------: |
| 1970-01-01T00:00:00Z |      36.05 |       22.45 |

{{% /expand %}}

{{% expand "Calculate the median value of a field within time windows (grouped by time)" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  MEDIAN(temp)
FROM home
WHERE
  room = 'Kitchen'
  AND time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
GROUP BY time(6h)
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 |             median |
| :------------------- | -----------------: |
| 2022-01-01T06:00:00Z | 22.549999999999997 |
| 2022-01-01T12:00:00Z |               22.7 |
| 2022-01-01T18:00:00Z |               23.1 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## MODE()

Returns the most frequent value in a list of
[field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).

```sql
MODE(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports all field types.

#### Notable behaviors

- `MODE()` returns the field value with the earliest
  [timestamp](/influxdb/cloud-dedicated/reference/glossary/#timestamp)
  if  there's a tie between two or more values for the maximum number of occurrences.

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the mode value of a field" %}}

```sql
SELECT MODE(co) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | mode |
| :------------------- | ---: |
| 1970-01-01T00:00:00Z |    0 |

{{% /expand %}}

{{% expand "Calculate the mode value of each field" %}}

```sql
SELECT MODE(*) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | mode_co | mode_hum | mode_temp |
| :------------------- | ------: | -------: | --------: |
| 1970-01-01T00:00:00Z |       0 |       36 |      22.7 |

{{% /expand %}}

{{% expand "Calculate the mode of field keys that match a regular expression" %}}

```sql
SELECT MODE(/^[th]/) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | mode_hum | mode_temp |
| :------------------- | -------: | --------: |
| 1970-01-01T00:00:00Z |       36 |      22.7 |

{{% /expand %}}

{{% expand "Calculate the mode a field within time windows (grouped by time)" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  MODE(co)
FROM home
WHERE
  room = 'Kitchen'
  AND time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
GROUP BY time(6h)
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | mode |
| :------------------- | ---: |
| 2022-01-01T06:00:00Z |    0 |
| 2022-01-01T12:00:00Z |    1 |
| 2022-01-01T18:00:00Z |   18 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## SPREAD()

Returns the difference between the minimum and maximum
[field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).

```sql
SPREAD(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports **numeric fields**.

#### Examples

{{< expand-wrapper >}}

{{% expand "Calculate the spread of a field" %}}

```sql
SELECT SPREAD(temp) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 |             spread |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z | 2.3000000000000007 |

{{% /expand %}}

{{% expand "Calculate the spread of each field" %}}

```sql
SELECT SPREAD(*) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | spread_co | spread_hum |        spread_temp |
| :------------------- | --------: | ---------: | -----------------: |
| 1970-01-01T00:00:00Z |        26 |          1 | 2.3000000000000007 |

{{% /expand %}}

{{% expand "Calculate the spread of field keys that match a regular expression" %}}

```sql
SELECT SPREAD(/^[th]/) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | spread_hum |        spread_temp |
| :------------------- | ---------: | -----------------: |
| 1970-01-01T00:00:00Z |          1 | 2.3000000000000007 |

{{% /expand %}}

{{% expand "Calculate the spread of a field within time windows (grouped by time)" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  SPREAD(co)
FROM home
WHERE
  room = 'Kitchen'
  AND time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
GROUP BY time(6h)
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | spread |
| :------------------- | -----: |
| 2022-01-01T06:00:00Z |      0 |
| 2022-01-01T12:00:00Z |      9 |
| 2022-01-01T18:00:00Z |      8 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## STDDEV()

Returns the standard deviation of [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).

```sql
STDDEV(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports **numeric fields**.

#### Examples

{{< expand-wrapper >}}
{{% expand "Calculate the standard deviation of a field" %}}

```sql
SELECT STDDEV(temp) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 |             stddev |
| :------------------- | -----------------: |
| 1970-01-01T00:00:00Z | 0.5553238833191091 |

{{% /expand %}}

{{% expand "Calculate the standard deviation of each field" %}}

```sql
SELECT STDDEV(*) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 |         stddev_co |          stddev_hum |        stddev_temp |
| :------------------- | ----------------: | ------------------: | -----------------: |
| 1970-01-01T00:00:00Z | 7.774613519951676 | 0.25495097567963926 | 0.5553238833191091 |

{{% /expand %}}

{{% expand "Calculate the standard deviation of fields where the field key matches a regular expression" %}}

```sql
SELECT STDDEV(/^[th]/) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 |          stddev_hum |        stddev_temp |
| :------------------- | ------------------: | -----------------: |
| 1970-01-01T00:00:00Z | 0.25495097567963926 | 0.5553238833191091 |

{{% /expand %}}

{{% expand "Calculate the standard deviation of a field within time windows (grouped by time)" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  STDDEV(co)
FROM home
WHERE
  room = 'Kitchen'
  AND time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
GROUP BY time(6h)
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 |             stddev |
| :------------------- | -----------------: |
| 2022-01-01T06:00:00Z |                  0 |
| 2022-01-01T12:00:00Z | 3.6742346141747673 |
| 2022-01-01T18:00:00Z |                  4 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## SUM()

Returns the sum of [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).

```sql
SUM(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports **numeric fields**.

#### Examples

{{< expand-wrapper >}}
{{% expand "Calculate the sum of values in a field" %}}

```sql
SELECT SUM(co) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | sum |
| :------------------- | --: |
| 1970-01-01T00:00:00Z | 137 |

{{% /expand %}}

{{% expand "Calculate the sum of values in each field" %}}

```sql
SELECT SUM(*) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | sum_co | sum_hum | sum_temp |
| :------------------- | -----: | ------: | -------: |
| 1970-01-01T00:00:00Z |    137 |   939.9 |    582.3 |

{{% /expand %}}

{{% expand "Calculate the sum of values for fields where the field key matches a regular expression" %}}

```sql
SELECT SUM(/^[th]/) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | sum_hum | sum_temp |
| :------------------- | ------: | -------: |
| 1970-01-01T00:00:00Z |   939.9 |    582.3 |

{{% /expand %}}

{{% expand "Calculate the sum of values in a field within time windows (grouped by time)" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  SUM(co)
FROM home
WHERE
  room = 'Kitchen'
  AND time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
GROUP BY time(6h)
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | sum |
| :------------------- | --: |
| 2022-01-01T06:00:00Z |   0 |
| 2022-01-01T12:00:00Z |  21 |
| 2022-01-01T18:00:00Z |  66 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}
