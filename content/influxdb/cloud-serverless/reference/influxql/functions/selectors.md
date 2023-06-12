---
title: InfluxQL selector functions
list_title: Selector functions
description: >
  Use InfluxQL selector functions to select specific points from your time series data.
menu:
  influxdb_cloud_serverless:
    name: Selectors
    parent: influxql-functions
weight: 205
---

Use selector functions to assess, select, and return values in your data.
Selector functions return one or more rows with the selected values from each
InfluxQL group.

_Examples use the sample data set provided in the
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

- [FIRST()](#first)
- [LAST()](#last)
- [MAX()](#max)
- [MIN()](#min)
<!-- - [BOTTOM()](#bottom) -->
<!-- - [PERCENTILE()](#percentile) -->
<!-- - [SAMPLE()](#sample) -->
<!-- - [TOP()](#top) -->
- [Notable behaviors of selector functions](#notable-behaviors-of-selector-functions)

{{% note %}}
#### Missing InfluxQL functions

Some InfluxQL functions are in the process of being rearchitected to work with
the InfluxDB IOx storage engine. If a function you need is not here, check the
[InfluxQL feature support page](/influxdb/cloud-serverless/reference/influxql/feature-support/#function-support)
for more information.
{{% /note %}}

<!-- ## BOTTOM()

Returns the smallest `N` [field values](/influxdb/cloud-serverless/reference/glossary/#field-value).
`BOTTOM()` supports int64 and float64 field value [data types](/influxdb/v2.7/query-data/influxql/explore-data/select/#data-types).

```sql
BOTTOM(field_expression[, tag_expression_1[, ..., tag_expression_n]], N)
```

{{% note %}}
**Note:** `BOTTOM()` returns the field value with the earliest timestamp if
there's a tie between two or more values for the smallest value.
{{% /note %}}

#### Arguments

- **field_expression**: Expression to identify the field to operate on.
  Can be a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key)
  or constant.
- **tag_expression**: Expression to identify a tag key to segment by.
  Can be a [tag key](/influxdb/cloud-serverless/reference/glossary/#tag-key)
  or constant. Comma-delimit multiple tags.
- **N**: Number of results to return from each InfluxQL group or specified tag segment.

#### Notable behaviors

- `BOTTOM()` [maintains original timestamps when grouping by time](#timestamps-when-grouping-by-time).
- `BOTTOM()` [may return fewer points than expected](#selector-functions-may-return-fewer-points-than-expected).

#### Examples

{{< expand-wrapper >}}
{{% expand "Select the bottom three values of a field" %}}

```sql
SELECT BOTTOM(temp, 3) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}
{{% influxdb/custom-timestamps %}}

| time                 | bottom |
| :------------------- | -----: |
| 2022-01-01T08:00:00Z |     21 |
| 2022-01-01T08:00:00Z |   21.1 |
| 2022-01-01T09:00:00Z |   21.4 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Select the bottom field value for two unique tag values" %}}

```sql
SELECT BOTTOM(temp, room, 2) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}
{{% influxdb/custom-timestamps %}}

| time                 | bottom | room        |
| :------------------- | -----: | :---------- |
| 2022-01-01T08:00:00Z |     21 | Kitchen     |
| 2022-01-01T08:00:00Z |   21.1 | Living Room |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Select the bottom three field values and the tag value associated with each" %}}

```sql
SELECT BOTTOM(temp, 3), room FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}
{{% influxdb/custom-timestamps %}}

| time                 | bottom | room        |
| :------------------- | -----: | ----------- |
| 2022-01-01T08:00:00Z |     21 | Kitchen     |
| 2022-01-01T08:00:00Z |   21.1 | Living Room |
| 2022-01-01T09:00:00Z |   21.4 | Living Room |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Select the bottom field values for unique tag values and within time windows (grouped by time)" %}}

{{% influxdb/custom-timestamps %}}
```sql
SELECT
  BOTTOM(temp, room, 2)
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T12:00:00Z'
GROUP BY time(2h)
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | bottom | room        |
| :------------------- | -----: | :---------- |
| 2022-01-01T08:00:00Z |     21 | Kitchen     |
| 2022-01-01T08:00:00Z |   21.1 | Living Room |
| 2022-01-01T10:00:00Z |   21.8 | Living Room |
| 2022-01-01T11:00:00Z |   22.4 | Kitchen     |
| 2022-01-01T12:00:00Z |   22.2 | Living Room |
| 2022-01-01T12:00:00Z |   22.5 | Kitchen     |

{{% /influxdb/custom-timestamps %}}

Notice that when grouping by time, `BOTTOM()`
[maintains the point's original timestamp](#timestamps-when-grouping-by-time).

{{% /expand %}}
{{< /expand-wrapper >}} -->

## FIRST()

Returns the [field value](/influxdb/cloud-serverless/reference/glossary/#field-value) with the oldest timestamp.

```sql
FIRST(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports all field [data types](/influxdb/v2.7/query-data/influxql/explore-data/select/#data-types).

#### Notable behaviors

- `FIRST()` [overrides original timestamps when grouping by time](#timestamps-when-grouping-by-time)

#### Examples

{{< expand-wrapper >}}
{{% expand "Select the first value for a field" %}}

```sql
SELECT FIRST(temp) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | first |
| :------------------- | ----: |
| 2022-01-01T08:00:00Z |  21.1 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}

{{% expand "Select the first value from each field" %}}

```sql
SELECT FIRST(*) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | first_co | first_hum | first_temp |
| :------------------- | -------: | --------: | ---------: |
| 1970-01-01T00:00:00Z |        0 |      35.9 |       21.1 |

{{% /expand %}}

{{% expand "Select the first value from field keys that match a regular expression" %}}

```sql
SELECT FIRST(/^[th]/) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | first_hum | first_temp |
| :------------------- | --------: | ---------: |
| 1970-01-01T00:00:00Z |      35.9 |       21.1 |

{{% /expand %}}

{{% expand "Select the first value from a field within time windows (grouped by time)" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  FIRST(temp)
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

| time                 | first |
| :------------------- | ----: |
| 2022-01-01T06:00:00Z |    21 |
| 2022-01-01T12:00:00Z |  22.5 |
| 2022-01-01T18:00:00Z |  23.3 |

{{% /influxdb/custom-timestamps %}}

Notice that when grouping by time, `FIRST()`
[overrides the point's original timestamp](#timestamps-when-grouping-by-time).

{{% /expand %}}
{{< /expand-wrapper >}}

## LAST()

Returns the [field value](/influxdb/cloud-serverless/reference/glossary/#field-value) with the most recent timestamp.

```sql
LAST(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports all field [data types](/influxdb/v2.7/query-data/influxql/explore-data/select/#data-types).

#### Notable behaviors

- `LAST()` [overrides original timestamps when grouping by time](#timestamps-when-grouping-by-time)

#### Examples

{{< expand-wrapper >}}

{{% expand "Select the last value for a field" %}}

```sql
SELECT LAST(temp) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | last |
| :------------------- | ---: |
| 2022-01-01T20:00:00Z | 22.7 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}

{{% expand "Select the last value from each field" %}}

```sql
SELECT LAST(*) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | last_co | last_hum | last_temp |
| :------------------- | ------: | -------: | --------: |
| 1970-01-01T00:00:00Z |      26 |     36.5 |      22.7 |

{{% /expand %}}

{{% expand "Select the last value from field keys that match a regular expression" %}}

```sql
SELECT LAST(/^[th]/) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | last_hum | last_temp |
| :------------------- | -------: | --------: |
| 1970-01-01T00:00:00Z |     36.5 |      22.7 |

{{% /expand %}}

{{% expand "Select the last value from a field within time windows (grouped by time)" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  LAST(temp)
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

| time                 | last |
| :------------------- | ---: |
| 2022-01-01T06:00:00Z | 22.4 |
| 2022-01-01T12:00:00Z | 22.7 |
| 2022-01-01T18:00:00Z | 22.7 |

{{% /influxdb/custom-timestamps %}}

Notice that when grouping by time, `LAST()`
[overrides the point's original timestamp](#timestamps-when-grouping-by-time).

{{% /expand %}}
{{< /expand-wrapper >}}

## MAX()

Returns the greatest [field value](/influxdb/cloud-serverless/reference/glossary/#field-value).

```sql
MAX(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports **numeric fields**.

#### Notable behaviors

- `MAX()` [overrides original timestamps when grouping by time](#timestamps-when-grouping-by-time).

#### Examples

{{< expand-wrapper >}}

{{% expand "Select the maximum value from a field" %}}

```sql
SELECT MAX(co) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | max |
| :------------------- | --: |
| 2022-01-01T20:00:00Z |  26 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}

{{% expand "Select the maximum value from each field" %}}

```sql
SELECT MAX(*) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | max_co | max_hum | max_temp |
| :------------------- | -----: | ------: | -------: |
| 1970-01-01T00:00:00Z |     26 |    36.9 |     23.3 |

{{% /expand %}}

{{% expand "Select the maximum value from field keys that match a regular expression" %}}

```sql
SELECT MAX(/^[th]/) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | max_hum | max_temp |
| :------------------- | ------: | -------: |
| 1970-01-01T00:00:00Z |    36.9 |     23.3 |

{{% /expand %}}

{{% expand "Select the maximum value from a field within time windows (grouped by time)" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  MAX(temp)
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

| time                 |  max |
| :------------------- | ---: |
| 2022-01-01T06:00:00Z |   23 |
| 2022-01-01T12:00:00Z | 22.8 |
| 2022-01-01T18:00:00Z | 23.3 |

{{% /influxdb/custom-timestamps %}}

Notice that when grouping by time, `MAX()`
[overrides the point's original timestamp](#timestamps-when-grouping-by-time).

{{% /expand %}}
{{< /expand-wrapper >}}

## MIN()

Returns the lowest [field value](/influxdb/cloud-serverless/reference/glossary/#field-value).

```sql
MIN(field_expression)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports **numeric fields**.

#### Notable behaviors

- `MIN()` [overrides original timestamps when grouping by time](#timestamps-when-grouping-by-time).

#### Examples

{{< expand-wrapper >}}

{{% expand "Select the minimum value from a field" %}}

```sql
SELECT MIN(temp) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | min |
| :------------------- | --: |
| 2022-01-01T08:00:00Z |  21 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}

{{% expand "Select the minimum value from each field" %}}

```sql
SELECT MIN(*) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | min_co | min_hum | min_temp |
| :------------------- | -----: | ------: | -------: |
| 1970-01-01T00:00:00Z |      0 |    35.9 |       21 |

{{% /expand %}}

{{% expand "Select the minimum value from field keys that match a regular expression" %}}

```sql
SELECT MIN(/^[th]/) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | min_hum | min_temp |
| :------------------- | ------: | -------: |
| 1970-01-01T00:00:00Z |    35.9 |       21 |

{{% /expand %}}

{{% expand "Select the minimum value from a field within time windows (grouped by time)" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  MIN(temp)
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

| time                 |  min |
| :------------------- | ---: |
| 2022-01-01T06:00:00Z |   21 |
| 2022-01-01T12:00:00Z | 22.4 |
| 2022-01-01T18:00:00Z | 22.7 |

{{% /influxdb/custom-timestamps %}}

Notice that when grouping by time, `MIN()`
[overrides the point's original timestamp](#timestamps-when-grouping-by-time).

{{% /expand %}}
{{< /expand-wrapper >}}

<!-- ## PERCENTILE()

Returns the `N`th percentile [field value](/influxdb/cloud-serverless/reference/glossary/#field-value).

```sql
PERCENTILE(field_expression, N)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
  Supports **numeric fields**.
- **N**: Percentile to return.
  Must be an integer or float value **greater than 0 and less than or equal to 100**.

#### Notable behaviors

- `PERCENTILE()` [overrides original timestamps when grouping by time](#timestamps-when-grouping-by-time).
- `PERCENTILE(example_field, 100)` is equivalent to [`MAX(example_field)`](#max).
- `PERCENTILE(example_field, 50)` is nearly equivalent to
  [`MEDIAN(example_field)`](/influxdb/cloud-serverless/reference/influxql/functions/aggregates/#median),
  except `MEDIAN()` returns the average of the two middle values if the field
  contains an even number of values.
- `PERCENTILE(example_field, 0)` returns _null_.

#### Examples

{{< expand-wrapper >}}

{{% expand "Select the 50th percentile value from a field" %}}

```sql
SELECT PERCENTILE(temp, 50) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | percentile |
| :------------------- | ---------: |
| 2022-01-01T11:00:00Z |       22.4 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}

{{% expand "Select the 50th percentile value from each field" %}}

```sql
SELECT PERCENTILE(*, 50) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | percentile_co | percentile_hum | percentile_temp |
| :------------------- | ------------: | -------------: | --------------: |
| 1970-01-01T00:00:00Z |             1 |             36 |            22.4 |

{{% /expand %}}

{{% expand "Select the 50th percentile value from field keys that match a regular expression" %}}

```sql
SELECT PERCENTILE(/^[th]/, 50) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 | percentile_hum | percentile_temp |
| :------------------- | -------------: | --------------: |
| 1970-01-01T00:00:00Z |             36 |            22.4 |

{{% /expand %}}

{{% expand "Select the 50th percentile value from a field within time windows (grouped by time)" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  PERCENTILE(temp, 50)
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

| time                 | percentile |
| :------------------- | ---------: |
| 2022-01-01T06:00:00Z |       22.4 |
| 2022-01-01T12:00:00Z |       22.7 |
| 2022-01-01T18:00:00Z |       23.1 |

{{% /influxdb/custom-timestamps %}}

Notice that when grouping by time, `PERCENTILE()`
[overrides the point's original timestamp](#timestamps-when-grouping-by-time).

{{% /expand %}}
{{< /expand-wrapper >}} -->

<!-- ## SAMPLE()

Returns a random sample of `N` [field values](/influxdb/cloud-serverless/reference/glossary/#field-value).
`SAMPLE()` supports all field value [data types](/influxdb/v2.7/query-data/influxql/explore-data/select/#data-types)
and uses [reservoir sampling](https://en.wikipedia.org/wiki/Reservoir_sampling)
to select random points.

```sql
SAMPLE(field_expression, N)
```

#### Arguments

- **field_expression**: Expression to identify one or more fields to operate on.
  Can be a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key),
  constant, regular expression, or wildcard (`*`).
- **N**: Number of results to return from each InfluxQL group.

#### Notable behaviors

- `SAMPLE()` [maintains original timestamps when grouping by time](#timestamps-when-grouping-by-time).
- `SAMPLE()` [may return fewer points than expected](#selector-functions-may-return-fewer-points-than-expected).

#### Examples

{{< expand-wrapper >}}

{{% expand "Select a sample of values in a field" %}}

```sql
SELECT SAMPLE(temp, 3) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | sample |
| :------------------- | -----: |
| 2022-01-01T11:00:00Z |   22.2 |
| 2022-01-01T17:00:00Z |   22.7 |
| 2022-01-01T18:00:00Z |   23.3 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}

{{% expand "Select a sample of values in each field" %}}

```sql
SELECT SAMPLE(*, 2) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | sample_co | sample_hum | sample_temp |
| -------------------- | --------- | ---------- | ----------- |
| 2022-01-01T10:00:00Z |           |            | 22.7        |
| 2022-01-01T12:00:00Z |           |            | 22.5        |
| 2022-01-01T13:00:00Z | 0         |            |             |
| 2022-01-01T15:00:00Z |           | 36.2       |             |
| 2022-01-01T16:00:00Z | 4         |            |             |
| 2022-01-01T17:00:00Z |           | 36         |             |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}

{{% expand "Select a sample of values from field keys that match a regular expression" %}}

```sql
SELECT SAMPLE(/^[th]/, 2) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

 | time                 | sample_hum | sample_temp |
 | -------------------- | ---------- | ----------- |
 | 2022-01-01T08:00:00Z | 35.9       |             |
 | 2022-01-01T10:00:00Z | 36.1       |             |
 | 2022-01-01T18:00:00Z |            | 23.3        |
 | 2022-01-01T19:00:00Z |            | 22.5        |

 {{% /influxdb/custom-timestamps %}}

{{% /expand %}}

{{% expand "Select a sample of values in a field when grouping by time" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT
  SAMPLE(temp, 2)
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

| time                 | sample |
| :------------------- | -----: |
| 2022-01-01T08:00:00Z |     21 |
| 2022-01-01T11:00:00Z |   22.4 |
| 2022-01-01T12:00:00Z |   22.5 |
| 2022-01-01T17:00:00Z |   22.7 |
| 2022-01-01T18:00:00Z |   23.3 |
| 2022-01-01T19:00:00Z |   23.1 |

{{% /influxdb/custom-timestamps %}}

Notice that when grouping by time, `SAMPLE()`
[maintains the points' original timestamps](#timestamps-when-grouping-by-time).

{{% /expand %}}
{{< /expand-wrapper >}} -->

<!-- ## TOP()

Returns the greatest `N` [field values](/influxdb/cloud-serverless/reference/glossary/#field-value).
`TOP()` supports int64 and float64 field value [data types](/influxdb/v2.7/query-data/influxql/explore-data/select/#data-types).

```sql
TOP(field_expression[, tag_expression_1[, ..., tag_expression_n]], N)
```

{{% note %}}
**Note:** `TOP()` returns the field value with the earliest timestamp if there's
a tie between two or more values for the greatest value.
{{% /note %}}

#### Arguments

- **field_expression**: Expression to identify the field to operate on.
  Can be a [field key](/influxdb/cloud-serverless/reference/glossary/#field-key)
  or constant.
- **tag_expression**: Expression to identify a tag key to segment by.
  Can be a [tag key](/influxdb/cloud-serverless/reference/glossary/#tag-key)
  or constant. Comma-delimit multiple tags.
- **N**: Number of results to return from each InfluxQL group or specified tag segment.

#### Notable behaviors

- `TOP()` [maintains original timestamps when grouping by time](#timestamps-when-grouping-by-time).
- `TOP()` [may return fewer points than expected](#selector-functions-may-return-fewer-points-than-expected).

#### Examples

{{< expand-wrapper >}}
{{% expand "Select the top three values of a field" %}}

```sql
SELECT TOP(temp, 3) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}
{{% influxdb/custom-timestamps %}}

| time                 |  top |
| :------------------- | ---: |
| 2022-01-01T09:00:00Z |   23 |
| 2022-01-01T18:00:00Z | 23.3 |
| 2022-01-01T19:00:00Z | 23.1 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Select the top field value for two unique tag values" %}}

```sql
SELECT TOP(temp, room, 2) FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}
{{% influxdb/custom-timestamps %}}

| time                 |  top | room        |
| :------------------- | ---: | :---------- |
| 2022-01-01T18:00:00Z | 23.3 | Kitchen     |
| 2022-01-01T18:00:00Z | 22.8 | Living Room |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Select the top three field values and the tag value associated with each" %}}

```sql
SELECT TOP(temp, 3), room FROM home
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}
{{% influxdb/custom-timestamps %}}

| time                 |  top | room    |
| :------------------- | ---: | :------ |
| 2022-01-01T09:00:00Z |   23 | Kitchen |
| 2022-01-01T18:00:00Z | 23.3 | Kitchen |
| 2022-01-01T19:00:00Z | 23.1 | Kitchen |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Select the top field values for unique tag values and within time windows (grouped by time)" %}}

{{% influxdb/custom-timestamps %}}
```sql
SELECT
  TOP(temp, room, 2)
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T12:00:00Z'
GROUP BY time(2h)
```

{{% influxql/table-meta %}}
name: home
{{% /influxql/table-meta %}}

| time                 |  top | room        |
| :------------------- | ---: | :---------- |
| 2022-01-01T09:00:00Z |   23 | Kitchen     |
| 2022-01-01T09:00:00Z | 21.4 | Living Room |
| 2022-01-01T10:00:00Z | 22.7 | Kitchen     |
| 2022-01-01T11:00:00Z | 22.2 | Living Room |
| 2022-01-01T12:00:00Z | 22.5 | Kitchen     |
| 2022-01-01T12:00:00Z | 22.2 | Living Room |

{{% /influxdb/custom-timestamps %}}

Notice that when grouping by time, `TOP()`
[maintains the point's original timestamp](#timestamps-when-grouping-by-time).

{{% /expand %}}
{{< /expand-wrapper >}} -->

## Notable behaviors of selector functions

- [Timestamps when grouping by time](#timestamps-when-grouping-by-time)
<!-- - [Selector functions may return fewer points than expected](#selector-functions-may-return-fewer-points-than-expected) -->

### Timestamps when grouping by time

When using selector functions with a `GROUP BY time()` clause, most selector
functions return the timestamp of the starting boundary for each time interval.
However functions with an `N` argument that specifies the number of results to
return per group maintain the original timestamp of each returned point.

{{< flex >}}
{{% flex-content %}}

###### Return the start time of each time interval

- [FIRST()](#first)
- [LAST()](#last)
- [MAX()](#max)
- [MIN()](#min)
<!-- - [PERCENTILE()](#percentile) -->

{{% /flex-content %}}
{{% flex-content %}}

<!-- ###### Maintain the original timestamp

- [BOTTOM()](#bottom)
- [SAMPLE()](#sample)
- [TOP()](#top) -->

{{% /flex-content %}}
{{< /flex >}}

<!-- ### Selector functions may return fewer points than expected

Queries that use the following selector functions with an `N` argument may
return fewer points than expected.

- [BOTTOM()](#bottom)
- [SAMPLE()](#sample)
- [TOP()](#top)

If the InfluxQL group or specified tag key contains `X` points or unique tag
values and `X` is less than `N`, the function returns `X` results instead of `N`
for each group or tag value.

{{< expand-wrapper >}}
{{% expand "View example for `FN(field_key, N)`" %}}

The example below selects the bottom 5 temperatures from the Kitchen between
{{% influxdb/custom-timestamps-span %}}2022-01-01T08:00:00Z{{% /influxdb/custom-timestamps-span %}}
and {{% influxdb/custom-timestamps-span %}}2022-01-01T10:00:00Z{{% /influxdb/custom-timestamps-span %}}.
There are only 3 points recorded for the Kitchen during the queried time range,
so the query returns 3 points instead of 5.

{{% influxdb/custom-timestamps %}}

```sql
SELECT BOTTOM(temp, 5)
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T10:00:00Z'
  AND room = 'Kitchen'
```

| time                 | bottom |
| :------------------- | -----: |
| 2022-01-01T08:00:00Z |     21 |
| 2022-01-01T09:00:00Z |     23 |
| 2022-01-01T10:00:00Z |   22.7 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{% expand "View example for `FN(field_key, tag_key, N)`" %}}

The example below selects the top temperature from 3 unique values of the `room` tag.
However, the `room` tag only has 2 unique values, so results only contain 2 values.

```sql
SELECT TOP(temp, room, 3) FROM home
```

{{% influxdb/custom-timestamps %}}

| time                 |  top | room        |
| :------------------- | ---: | :---------- |
| 2022-01-01T18:00:00Z | 23.3 | Kitchen     |
| 2022-01-01T18:00:00Z | 22.8 | Living Room |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}} -->
