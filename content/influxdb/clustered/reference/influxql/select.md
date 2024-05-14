---
title: SELECT statement
list_title: SELECT statement
description: >
  Use the `SELECT` statement to query data from one or more
  [measurements](/influxdb/clustered/reference/glossary/#measurement).
menu:
  influxdb_clustered:
    name: SELECT statement
    identifier: influxql-select-statement
    parent: influxql-reference
weight: 201
list_code_example: |
  ```sql
  SELECT <field_key>[,<field_key>,<tag_key>] FROM <measurement_name>[,<measurement_name>]
  ```
---

Use the `SELECT` statement to query data from one or more
[measurements](/influxdb/clustered/reference/glossary/#measurement).
The `SELECT` statement **requires** a [`SELECT` clause](#select-clause) and a
[`FROM` clause](#from-clause).

- [Syntax](#syntax)
  - [SELECT clause](#select-clause)
  - [FROM clause](#from-clause)
- [Notable SELECT statement behaviors](#notable-select-statement-behaviors)
- [Data types and casting operations](#data-types-and-casting-operations)
- [SELECT statement examples](#select-statement-examples)
<!-- - [Multiple statements](#multiple-statements) -->

## Syntax

```sql
SELECT field_expression[, ..., field_expression_n[, tag_expression[, ..., tag_expression_n]]] FROM measurement_expression[, ..., measurement_expression_n]
```

### SELECT clause

The `SELECT` clause supports several formats for identifying data to query.
It requires one or more **field expressions** and optional **tag expressions**.

- **field_expression**: Expression to identify one or more fields to return in query results.
  Can be a [field key](/influxdb/clustered/reference/glossary/#field-key),
  constant, [regular expression](/influxdb/clustered/reference/influxql/regular-expressions/),
  [wildcard (`*`)](#wildcard-expressions-in-select-clauses), or
  [function expression](/influxdb/clustered/reference/influxql/functions/) and any
  combination of arithmetic operators.
- **tag_expression**: Expression to identify one or more tags to return in query results.
  Can be a [tag key](/influxdb/clustered/reference/glossary/#tag-key) or constant.

#### Select clause behaviors

- `SELECT field_key` - Returns a specific field.
- `SELECT field_key1, field_key2` - Returns two specific fields.
- `SELECT field_key, tag_key` - Returns a specific field and tag.
- `SELECT *` - Returns all [fields](/influxdb/clustered/reference/glossary/#field)
  and [tags](/influxdb/clustered/reference/glossary/#tag).
  _See [Wildcard expressions](#wildcard-expressions)._
- `SELECT /^[t]/` - Returns all [fields](/influxdb/clustered/reference/glossary/#field)
  and [tags](/influxdb/clustered/reference/glossary/#tag) with keys that
  match the regular expression. At least one field key must match the regular
  expression. If no field keys match the regular expression, no results are
  returned.

### FROM clause

The `FROM` clause specifies the
[measurement](/influxdb/clustered/reference/glossary/#measurement) or
[subquery](/influxdb/clustered/reference/influxql/subqueries/) to query.
It requires one or more comma-delimited
[measurement expressions](#measurement_expression) or [subqueries](#subquery).

#### measurement_expression

A measurement expression identifies a measurement to query.
It can be a measurement name, fully-qualified measurement, constant, or
a [regular expression](/influxdb/clustered/reference/influxql/regular-expressions/).

- **Measurement name**: When using just the measurement name, InfluxQL assumes
  the default retention policy of the database specified in the query request.

  ```sql
  FROM measurement
  ```

- **Fully-qualified measurement**: A fully qualified measurement includes a
  database name, retention policy name, and measurement name, each separated by
  a period (`.`). If the retention policy is not specified, InfluxQL uses the
  default retention policy for the specified database.

```sql
FROM database.retention_policy.measurement

-- Fully-qualified measurement with default retention policy
FROM database..measurement
```

{{% note %}}
#### InfluxQL retention policies

In {{< product-name >}}, **retention policies** are not part of the data model
like they are in InfluxDB 1.x.
Each {{< product-name >}} database has a **retention period** which defines the
maximum age of data to retain in the database. To use fully-qualified
measurements in InfluxQL queries, use the following naming convention when
[creating a database](/influxdb/clustered/admin/databases/create/):

```
database_name/retention_policy
```
{{% /note %}}

#### Subquery

An InfluxQL subquery is a query nested in the `FROM` clause of an InfluxQL query.
The outer query queries results returned by the inner query (subquery).

For more information, see [InfluxQL subqueries](/influxdb/clustered/reference/influxql/subqueries/).

## Notable SELECT statement behaviors

- [Must query at least one field](#must-query-at-least-one-field)
- [Wildcard expressions](#wildcard-expressions)
- [Cannot include both aggregate and non-aggregate field expressions](#cannot-include-both-aggregate-and-non-aggregate-field-expressions)

### Must query at least one field

A query requires at least one [field key](/influxdb/clustered/reference/glossary/#field-key)
in the `SELECT` clause to return data.
If the `SELECT` clause includes only [tag keys](/influxdb/clustered/reference/glossary/#tag-key),
the query returns an empty result.
When using regular expressions in the `SELECT` clause, if regular expression
matches only tag keys and no field keys, the query returns an empty result.

To return data associated with tag keys, include at least one field key in the
`SELECT` clause.

### Wildcard expressions

When using a wildcard expression (`*`) in the `SELECT` clause, the query returns
all tags and fields.
If a [function](/influxdb/clustered/reference/influxql/functions/) is
applied to a wildcard expression, the query returns all _fields_ with
the function applied, but does not return _tags_ unless they are included in
the `SELECT` clause.

### Cannot include both aggregate and non-aggregate field expressions

The `SELECT` statement cannot include an aggregate field expression
(one that uses an [aggregate](/influxdb/clustered/reference/influxql/functions/aggregates/)
or [selector](/influxdb/clustered/reference/influxql/functions/aggregates/)
function) **and** a non-aggregate field expression.
For example, in the following query, an aggregate function is applied to one
field, but not the other:

```sql
SELECT mean(temp), hum FROM home
```

This query returns an error.
For more information, see [error about mixing aggregate and non-aggregate queries](/enterprise_influxdb/v1/troubleshooting/errors/#error-parsing-query-mixing-aggregate-and-non-aggregate-queries-is-not-supported).

## Data types and casting operations

The [`SELECT` clause](#select-clause) supports specifying a
[field's](/influxdb/clustered/reference/glossary/#field) type and basic
casting operations with the `::` syntax.

```sql
SELECT field_expression::type FROM measurement_expression
```

The `::` syntax allows users to perform basic cast operations in queries.
Currently, InfluxQL supports casting _numeric_ [field values](/influxdb/clustered/reference/glossary/#field-value)
to other numeric types.
Casting to an **identifier type** acts as a filter on results and returns only
columns of that specific identifier type along with the `time` column.

{{< flex >}}
{{% flex-content "third" %}}

##### Numeric types

- `float`
- `integer`
- `unsigned`

{{% /flex-content %}}
{{% flex-content "third" %}}

##### Non-numeric types

- `string`
- `boolean`

{{% /flex-content %}}
{{% flex-content "third" %}}

##### Identifier types

- `field`
- `tag`

{{% /flex-content %}}
{{< /flex >}}

{{% note %}}
InfluxQL returns no data if the query attempts to cast a numeric value to a
non-numeric type and vice versa.
{{% /note %}}

When casting a float value to an integer or unsigned integer, the float value
is truncated at the decimal point. No rounding is performed.

## SELECT statement examples

The examples below use the following sample data sets:

- [Get started home sensor data](/influxdb/clustered/reference/sample-data/#get-started-home-sensor-data)
- [NOAA Bay Area weather data](/influxdb/clustered/reference/sample-data/#noaa-bay-area-weather-data)

{{< expand-wrapper >}}
{{% expand "Select all fields and tags from a measurement" %}}

```sql
SELECT * FROM home
```

{{% influxql/table-meta %}}
Name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 |  co |  hum | room        | temp |
| :------------------- | --: | ---: | :---------- | ---: |
| 2022-01-01T08:00:00Z |   0 | 35.9 | Kitchen     |   21 |
| 2022-01-01T08:00:00Z |   0 | 35.9 | Living Room | 21.1 |
| 2022-01-01T09:00:00Z |   0 | 36.2 | Kitchen     |   23 |
| 2022-01-01T09:00:00Z |   0 | 35.9 | Living Room | 21.4 |
| 2022-01-01T10:00:00Z |   0 | 36.1 | Kitchen     | 22.7 |
| 2022-01-01T10:00:00Z |   0 |   36 | Living Room | 21.8 |
| ...                  | ... |  ... | ...         |  ... |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Select specific tags and fields from a measurement" %}}

```sql
SELECT temp, hum, room FROM home
```

{{% influxql/table-meta %}}
Name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 | temp |  hum | room        |
| :------------------- | ---: | ---: | :---------- |
| 2022-01-01T08:00:00Z |   21 | 35.9 | Kitchen     |
| 2022-01-01T08:00:00Z | 21.1 | 35.9 | Living Room |
| 2022-01-01T09:00:00Z |   23 | 36.2 | Kitchen     |
| 2022-01-01T09:00:00Z | 21.4 | 35.9 | Living Room |
| 2022-01-01T10:00:00Z | 22.7 | 36.1 | Kitchen     |
| 2022-01-01T10:00:00Z | 21.8 |   36 | Living Room |
| ...                  |  ... |  ... | ...         |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Select all fields from a measurement" %}}

```sql
SELECT *::field FROM home
```

{{% influxql/table-meta %}}
Name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 |  co |  hum | temp |
| :------------------- | --: | ---: | ---: |
| 2022-01-01T08:00:00Z |   0 | 35.9 |   21 |
| 2022-01-01T08:00:00Z |   0 | 35.9 | 21.1 |
| 2022-01-01T09:00:00Z |   0 | 36.2 |   23 |
| 2022-01-01T09:00:00Z |   0 | 35.9 | 21.4 |
| 2022-01-01T10:00:00Z |   0 | 36.1 | 22.7 |
| 2022-01-01T10:00:00Z |   0 |   36 | 21.8 |
| ...                  | ... |  ... |  ... |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{% expand "Select a field from a measurement and perform basic arithmetic" %}}

```sql
SELECT (temp * (9 / 5)) + 32 FROM home
```

{{% influxql/table-meta %}}
Name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 |              temp |
| :------------------- | ----------------: |
| 2022-01-01T08:00:00Z | 69.80000000000001 |
| 2022-01-01T08:00:00Z |             69.98 |
| 2022-01-01T09:00:00Z |              73.4 |
| 2022-01-01T09:00:00Z |             70.52 |
| 2022-01-01T10:00:00Z |             72.86 |
| 2022-01-01T10:00:00Z | 71.24000000000001 |
| ...                  |               ... |

{{% /influxdb/custom-timestamps %}}

{{% note %}}
**Note:** InfluxDB follows the standard order of operations.
See [InfluxQL mathematical operators](/influxdb/clustered/reference/influxql/math-operators/)
for more on supported operators.
{{% /note %}}

{{% /expand %}}

{{% expand "Select all data from more than one measurement" %}}

```sql
SELECT * FROM home, weather
```

{{% influxql/table-meta %}}
Name: weather
{{% /influxql/table-meta %}}

| time                 |  co | hum | location      | precip | room | temp | temp_avg | temp_max | temp_min | wind_avg |
| :------------------- | --: | --: | :------------ | -----: | :--- | ---: | -------: | -------: | -------: | -------: |
| 2020-01-01T00:00:00Z |     |     | Concord       |      0 |      |      |       52 |       66 |       44 |     3.13 |
| 2020-01-01T00:00:00Z |     |     | San Francisco |      0 |      |      |       53 |       59 |       47 |    14.32 |
| 2020-01-01T00:00:00Z |     |     | Hayward       |      0 |      |      |       50 |       57 |       44 |     2.24 |
| 2020-01-02T00:00:00Z |     |     | San Francisco |      0 |      |      |       54 |       61 |       49 |     5.82 |
| 2020-01-02T00:00:00Z |     |     | Hayward       |      0 |      |      |       51 |       60 |       44 |      3.8 |
| 2020-01-02T00:00:00Z |     |     | Concord       |      0 |      |      |       53 |       66 |       42 |     3.13 |
| ...                  | ... | ... | ...           |    ... | ...  |  ... |      ... |      ... |      ... |      ... |

{{% /expand %}}

{{% expand "Select all data from a fully-qualified measurement (with default retention policy)" %}}

```sql
SELECT * FROM "get-started"..home
```

{{% influxql/table-meta %}}
Name: home
{{% /influxql/table-meta %}}

{{% influxdb/custom-timestamps %}}

| time                 |  co |  hum | room        | temp |
| :------------------- | --: | ---: | :---------- | ---: |
| 2022-01-01T08:00:00Z |   0 | 35.9 | Kitchen     |   21 |
| 2022-01-01T08:00:00Z |   0 | 35.9 | Living Room | 21.1 |
| 2022-01-01T09:00:00Z |   0 | 36.2 | Kitchen     |   23 |
| 2022-01-01T09:00:00Z |   0 | 35.9 | Living Room | 21.4 |
| 2022-01-01T10:00:00Z |   0 | 36.1 | Kitchen     | 22.7 |
| 2022-01-01T10:00:00Z |   0 |   36 | Living Room | 21.8 |
| ...                  | ... |  ... | ...         |  ... |

{{% /influxdb/custom-timestamps %}}
{{% /expand %}}

{{< /expand-wrapper >}}

### Type-casting examples

{{< expand-wrapper >}}

{{% expand "Cast an integer field to a float" %}}

```sql
SELECT co::float FROM home
```

{{% /expand %}}

{{% expand "Cast a float field to an integer" %}}

```sql
SELECT temp::integer FROM home
```

{{% /expand %}}

{{% expand "Cast a float field to an unsigned integer" %}}

```sql
SELECT temp::unsigned FROM home
```

{{% /expand %}}

{{< /expand-wrapper >}}

<!-- ## Multiple statements

Separate multiple `SELECT` statements in a query with a semicolon (`;`).

### Examples

The **InfluxDB v1 query API** returns a JSON response with a `statement_id`
field for each `SELECT` statement.

```json
{
    "results": [
        {
            "statement_id": 0,
            "series": [
                {
                    "name": "h2o_feet",
                    "columns": [
                        "time",
                        "mean"
                    ],
                    "values": [
                        [
                            "1970-01-01T00:00:00Z",
                            4.442107025822522
                        ]
                    ]
                }
            ]
        },
        {
            "statement_id": 1,
            "series": [
                {
                    "name": "h2o_feet",
                    "columns": [
                        "time",
                        "water_level"
                    ],
                    "values": [
                        [
                            "2015-08-18T00:00:00Z",
                            8.12
                        ],
                        [
                            "2015-08-18T00:00:00Z",
                            2.064
                        ]
                    ]
                }
            ]
        }
    ]
}
``` -->
