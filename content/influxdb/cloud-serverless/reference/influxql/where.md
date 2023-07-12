---
title: WHERE clause
description: >
  Use the `WHERE` clause to filter data based on [fields](/influxdb/cloud-serverless/reference/glossary/#field), [tags](/influxdb/cloud-serverless/reference/glossary/#tag), and/or [timestamps](/influxdb/cloud-serverless/reference/glossary/#timestamp).
menu:
  influxdb_cloud_serverless:
    name: WHERE clause
    identifier: influxql-where-clause
    parent: influxql-reference
weight: 202
list_code_example: |
  ```sql
  SELECT_clause FROM_clause WHERE <conditional_expression> [(AND|OR) <conditional_expression> [...]]
  ```
---

Use the `WHERE` clause to filter data based on
[field values](/influxdb/cloud-serverless/reference/glossary/#field),
[tag values](/influxdb/cloud-serverless/reference/glossary/#tag), and
[timestamps](/influxdb/cloud-serverless/reference/glossary/#timestamp).

- [Syntax](#syntax)
- [Operators](#comparison-operators)
  - [Comparison operators](#comparison-operators)
  - [Logical operators](#logical-operators)
- [Time ranges](#time-ranges)
- [Regular expressions](#regular-expressions)
- [WHERE clause examples](#where-clause-examples)
- [Notable behaviors](#notable-behaviors)
  - [Single and double quotes](#single-and-double-quotes)
  - [Cannot query multiple time ranges](#cannot-query-multiple-time-ranges)

## Syntax

```sql
SELECT_clause FROM_clause WHERE <conditional_expression> [(AND|OR) <conditional_expression> [...]]
```

- **conditional_expression**: Comparison between two operands that evaluates to
  `true` or `false`. Comparison logic is determined by
  [operators](#operators) used in the expression.
  These expressions can operate on InfluxDB fields, tags, and timestamps.
  Use logical operators (`AND`, `OR`) to chain multiple conditional expressions
  together.

## Operators

Operators evaluate the relationship between two operands and return
`true` or `false`.

### Comparison operators

| Operator | Meaning                            | Supported data types |
| :------: | :--------------------------------- | :---------------------- |
|   `=`    | Equal to                           | all                     |
|   `<>`   | Not equal to                       | all                     |
|   `!=`   | Not equal to                       | all                     |
|   `>`    | Greater than                       | numeric, timestamp      |
|   `>=`   | Greater than or equal to           | numeric, timestamp      |
|   `<`    | Less than                          | numeric, timestamp      |
|   `<=`   | Less than or equal to              | numeric, timestamp      |
|   `=~`   | Matches a regular expression       | strings                 |
|   `!~`   | Doesn't match a regular expression | strings                 |

### Logical operators

| Operator | Meaning                                                                 |
| :------- | :---------------------------------------------------------------------- |
| `AND`    | Returns `true` if both operands are `true`. Otherwise, returns `false`. |
| `OR`     | Returns `true` if any operand is `true`. Otherwise, returns `false`.    |

## Time ranges

Use the `WHERE` clause to specify a time range to query.
If a time range isn't specified in the `WHERE` clause, the [default time range](/influxdb/cloud-serverless/reference/influxql/#default-time-range) is used.

Timestamps are stored in the `time` column.
Use comparison operators to compare the value of the `time` column to a
timestamp literal, integer (Unix nanosecond timestamp), or [expression](/influxdb/cloud-serverless/reference/glossary/#expression).

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Timestamp](#)
[Integer](#)
[Expression](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
WHERE
  time >= '2023-01-01T00:00:00Z'
  AND time < '2023-07-01T00:00:00Z'
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
WHERE
  time >= 1672531200000000000
  AND time < 1688169600000000000
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
WHERE
  time >= now() - 1d
  AND time < now()
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

See [Time syntax](/influxdb/cloud-serverless/reference/influxql/time-and-timezone/#time-syntax)
for information on how to specify alternative time ranges in the `WHERE` clause.

{{% note %}}
InfluxQL [does not support querying multiple time ranges](#cannot-query-multiple-time-ranges).
{{% /note %}}

## Regular expressions

Regular expressions can be used to evaluate _string_ values in the `WHERE` clause
using regular expression comparison operators:

- `=~`: Matches a regular expression
- `!~`: Doesn't match a regular expression

```sql
SELECT * FROM home WHERE room =~ /^K/
```

For more information about InfluxQL regular expression syntax, see
[InfluxQL regular expressions](/influxdb/cloud-serverless/reference/influxql/regular-expressions/).

## WHERE clause examples

The following examples use the
[Get started home sensor sample dataset](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data).

{{< expand-wrapper >}}
{{% expand "Select data with a specific tag value" %}}

```sql
SELECT * FROM home WHERE room = 'Living Room'
```

{{% influxql/table-meta %}} 
name: home 
{{% /influxql/table-meta %}} 

{{% influxdb/custom-timestamps %}}

| time                 |  co |  hum | room        | temp |
| :------------------- | --: | ---: | :---------- | ---: |
| 2022-01-01T08:00:00Z |   0 | 35.9 | Living Room | 21.1 |
| 2022-01-01T09:00:00Z |   0 | 35.9 | Living Room | 21.4 |
| 2022-01-01T10:00:00Z |   0 |   36 | Living Room | 21.8 |
| 2022-01-01T11:00:00Z |   0 |   36 | Living Room | 22.2 |
| 2022-01-01T12:00:00Z |   0 | 35.9 | Living Room | 22.2 |
| ...                  | ... |  ... | ...         |  ... |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Select data from a specific time range" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT *
FROM home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T10:00:00Z'
```

{{% influxql/table-meta %}} 
name: home
{{% /influxql/table-meta %}}

| time                 |  co |  hum | room        | temp |
| :------------------- | --: | ---: | :---------- | ---: |
| 2022-01-01T08:00:00Z |   0 | 35.9 | Kitchen     |   21 |
| 2022-01-01T08:00:00Z |   0 | 35.9 | Living Room | 21.1 |
| 2022-01-01T09:00:00Z |   0 | 36.2 | Kitchen     |   23 |
| 2022-01-01T09:00:00Z |   0 | 35.9 | Living Room | 21.4 |
| 2022-01-01T10:00:00Z |   0 | 36.1 | Kitchen     | 22.7 |
| 2022-01-01T10:00:00Z |   0 |   36 | Living Room | 21.8 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Select data from a relative time range" %}}

{{% influxdb/custom-timestamps %}}

```sql
SELECT * FROM home WHERE time >= '2022-01-01T20:00:00Z' - 2h
```

{{% influxql/table-meta %}} 
name: home
{{% /influxql/table-meta %}}

| time                 |  co |  hum | room        | temp |
| :------------------- | --: | ---: | :---------- | ---: |
| 2022-01-01T18:00:00Z |  18 | 36.9 | Kitchen     | 23.3 |
| 2022-01-01T18:00:00Z |   9 | 36.2 | Living Room | 22.8 |
| 2022-01-01T19:00:00Z |  22 | 36.6 | Kitchen     | 23.1 |
| 2022-01-01T19:00:00Z |  14 | 36.3 | Living Room | 22.5 |
| 2022-01-01T20:00:00Z |  26 | 36.5 | Kitchen     | 22.7 |
| 2022-01-01T20:00:00Z |  17 | 36.4 | Living Room | 22.2 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Select field values above a threshold" %}}

```sql
SELECT co FROM home WHERE co > 9
```

{{% influxql/table-meta %}} 
name: home
{{% /influxql/table-meta %}} 

{{% influxdb/custom-timestamps %}}

| time                 |  co |
| :------------------- | --: |
| 2022-01-01T18:00:00Z |  18 |
| 2022-01-01T19:00:00Z |  14 |
| 2022-01-01T19:00:00Z |  22 |
| 2022-01-01T20:00:00Z |  17 |
| 2022-01-01T20:00:00Z |  26 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Select specific field values" %}}

```sql
SELECT room, co FROM home WHERE co = 9
```

{{% influxql/table-meta %}} 
name: home
{{% /influxql/table-meta %}} 

{{% influxdb/custom-timestamps %}}

| time                 | room        |  co |
| :------------------- | :---------- | --: |
| 2022-01-01T17:00:00Z | Kitchen     |   9 |
| 2022-01-01T18:00:00Z | Living Room |   9 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Select field values based on arithmetic" %}}

```sql
SELECT room, co FROM home WHERE co - 10 > 5
```

{{% influxql/table-meta %}} 
name: home
{{% /influxql/table-meta %}} 

{{% influxdb/custom-timestamps %}}

| time                 | room        |  co |
| :------------------- | :---------- | --: |
| 2022-01-01T18:00:00Z | Kitchen     |  18 |
| 2022-01-01T19:00:00Z | Kitchen     |  22 |
| 2022-01-01T20:00:00Z | Living Room |  17 |
| 2022-01-01T20:00:00Z | Kitchen     |  26 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Select data with field values above a threshold and a specific tag value" %}}

```sql
SELECT * FROM home WHERE temp > 22.7 AND room = 'Kitchen'
```

{{% influxql/table-meta %}} 
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 |  co |  hum | room    | temp |
| :------------------- | --: | ---: | :------ | ---: |
| 2022-01-01T09:00:00Z |   0 | 36.2 | Kitchen |   23 |
| 2022-01-01T13:00:00Z |   1 | 36.5 | Kitchen | 22.8 |
| 2022-01-01T14:00:00Z |   1 | 36.3 | Kitchen | 22.8 |
| 2022-01-01T18:00:00Z |  18 | 36.9 | Kitchen | 23.3 |
| 2022-01-01T19:00:00Z |  22 | 36.6 | Kitchen | 23.1 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Select data based on the relationship between columns" %}}

```sql
SELECT co, temp FROM home WHERE co > temp
```

{{% influxql/table-meta %}} 
name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 |  co | temp |
| :------------------- | --: | ---: |
| 2022-01-01T20:00:00Z |  26 | 22.7 |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}

## Notable behaviors

- [Single and double quotes](#single-and-double-quotes)
- [Cannot query multiple time ranges](#cannot-query-multiple-time-ranges)

### Single and double quotes

In InfluxQL, single quotation marks (`'`) and double quotation marks (`"`) work
differently and can alter the way a `WHERE` clause functions.
Single quotes are used in [string](/influxdb/cloud-serverless/reference/influxql/#strings)
and [timestamp](/influxdb/cloud-serverless/reference/influxql/#dates--times) literals.
Double quotes are used to quote [identifiers](/influxdb/cloud-serverless/reference/influxql/#identifiers),
(time, field, and tag column names).

For example, the following conditional expression compares the value of the
`location` _column_ to the _literal string_, `London`:

```sql
"location" = 'London'
```

The following conditional expression compares the value of the `location` _column_
to the value of the `London` _column_:

```sql
"location" = "London"
```

Misused double and single quotes in the `WHERE` clause often results in unexpected
empty query results.
For more information about quotation marks, see
[InfluxQL quotation](/influxdb/cloud-serverless/reference/influxql/quoting/).

### Cannot query multiple time ranges

InfluxDB does not support using `OR` in the `WHERE` clause to query multiple time ranges.
For example, the following query returns no results:

{{% influxdb/custom-timestamps %}}

```sql
SELECT *
FROM home
WHERE
  (time >= '2022-01-01T08:00:00Z' AND time <= '2022-01-01T10:00:00Z')
  OR (time >= '2022-01-01T18:00:00Z' AND time <= '2022-01-01T20:00:00Z')
```

{{% /influxdb/custom-timestamps %}}
