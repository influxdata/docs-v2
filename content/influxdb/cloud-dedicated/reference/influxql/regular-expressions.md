---
title: Regular expressions
list_title: Regular expressions
description: >
  Use `regular expressions` to match patterns in your data.
menu:
  influxdb_cloud_dedicated:
    name: Regular expressions
    identifier: influxql-regular-expressions
    parent: influxql-reference
weight: 213
list_code_example: |
  ```sql
  SELECT /<regular_expression_field_key>/ FROM /<regular_expression_measurement>/ WHERE [<tag_key> <operator> /<regular_expression_tag_value>/ | <field_key> <operator> /<regular_expression_field_value>/] GROUP BY /<regular_expression_tag_key>/
  ```
---

Regular expressions are a sequence of characters used to identify patterns in
identifiers and string values.
InfluxQL supports regular expressions in the following operations:

- Identifying **fields** and **tags** to query in the
  [`SELECT` clause](/influxdb/cloud-dedicated/reference/influxql/select/).
- Identifying **measurements** to query in the
  [`FROM` clause](/influxdb/cloud-dedicated/reference/influxql/select/#from-clause).
- Testing **tag values** and **string field values** in the
  [`WHERE` clause](/influxdb/cloud-dedicated/reference/influxql/where/).
- Identifying **tag keys** to group by in the
  [`GROUP BY` clause](/influxdb/cloud-dedicated/reference/influxql/group-by/)

{{% note %}}
#### Query performance

Regular expression comparisons are more computationally intensive than exact
string comparisons. Queries with regular expressions are not as performant
as those without.
{{% /note %}}

## Regular expression syntax 

InfluxQL Regular expressions are surrounded by `/` characters and use the
[Go regular expression syntax](http://golang.org/pkg/regexp/syntax/).

```sql
/regular_expression/
```

### Regular expression flags

Regular expression flags modify the pattern matching behavior of the expression.
InfluxQL supports the following regular expression flags:

| Flag | Description                                                                     |
| :--- | :------------------------------------------------------------------------------ |
| i    | case-insensitive                                                                |
| m    | multi-line mode: `^` and `$` match begin/end line in addition to begin/end text |
| s    | let `.` match `\n`                                                              |
| U    | ungreedy: swap meaning of `x*` and `x*?`, `x+` and `x+?`, etc.                  |

Include regular expression flags at the beginning of your regular expression
pattern enclosed in parentheses (`()`) and preceded by a question mark (`?`).

```sql
/(?iU)foo*/
```

## Regular expression operators

InfluxQL provides the following regular expression operators that test if a
string operand matches a regular expression:

- `=~`: Returns true if the string matches the regular expression
- `!~`: Returns true if the string does not match the regular expression

InfluxQL regular expression operators are used to test string column values in
the [`WHERE` clause](/influxdb/cloud-dedicated/reference/influxql/where/).

## Regular expression examples

The examples below use the following sample data sets:

- [NOAA Bay Area weather data](/influxdb/cloud-dedicated/reference/sample-data/#noaa-bay-area-weather-data)
- [Get started home sensor data](/influxdb/cloud-dedicated/reference/sample-data/#get-started-home-sensor-data)

{{< expand-wrapper >}}

{{% expand "Use a regular expression to specify field keys and tag keys in the SELECT clause" %}}

```sql
SELECT /^t/ FROM weather
```

{{% influxql/table-meta %}}
name: weather
{{% /influxql/table-meta %}}

| time                 | temp_avg | temp_max | temp_min |
| :------------------- | -------: | -------: | -------: |
| 2020-01-01T00:00:00Z |       52 |       66 |       44 |
| 2020-01-01T00:00:00Z |       53 |       59 |       47 |
| 2020-01-01T00:00:00Z |       50 |       57 |       44 |
| 2020-01-02T00:00:00Z |       54 |       61 |       49 |
| 2020-01-02T00:00:00Z |       51 |       60 |       44 |
| 2020-01-02T00:00:00Z |       53 |       66 |       42 |
| ...                  |      ... |      ... |      ... |

{{% /expand %}}

{{% expand "Use a regular expression to specify measurements in the FROM clause" %}}

```sql
SELECT /^t/ FROM /^[hw]/
```

{{% influxql/table-meta %}}
name: weather
{{% /influxql/table-meta %}}

| time                 | temp | temp_avg | temp_max | temp_min |
| :------------------- | ---: | -------: | -------: | -------: |
| 2020-01-01T00:00:00Z |      |       52 |       66 |       44 |
| 2020-01-01T00:00:00Z |      |       53 |       59 |       47 |
| 2020-01-01T00:00:00Z |      |       50 |       57 |       44 |
| 2020-01-02T00:00:00Z |      |       54 |       61 |       49 |
| 2020-01-02T00:00:00Z |      |       51 |       60 |       44 |
| 2020-01-02T00:00:00Z |      |       53 |       66 |       42 |
| ...                  |  ... |      ... |      ... |      ... |

{{% /expand %}}

{{% expand "Use a regular expression to specify tag values in the WHERE clause" %}}

```sql
SELECT * FROM weather WHERE location !~ /^[S]/
```

{{% influxql/table-meta %}}
name: weather
{{% /influxql/table-meta %}}

| time                 | location | precip | temp_avg | temp_max | temp_min | wind_avg |
| :------------------- | :------- | -----: | -------: | -------: | -------: | -------: |
| 2020-01-01T00:00:00Z | Concord  |      0 |       52 |       66 |       44 |     3.13 |
| 2020-01-01T00:00:00Z | Hayward  |      0 |       50 |       57 |       44 |     2.24 |
| 2020-01-02T00:00:00Z | Concord  |      0 |       53 |       66 |       42 |     3.13 |
| 2020-01-02T00:00:00Z | Hayward  |      0 |       51 |       60 |       44 |      3.8 |
| 2020-01-03T00:00:00Z | Concord  |      0 |       49 |       60 |       38 |     2.68 |
| 2020-01-03T00:00:00Z | Hayward  |      0 |       50 |       62 |       41 |     3.13 |
| ...                  | ...      |    ... |      ... |      ... |      ... |      ... |

{{% /expand %}}

{{% expand "Use a regular expression to specify a tag with no value in the WHERE clause" %}}

```sql
SELECT * FROM home, weather WHERE location !~ /./
```

{{% influxql/table-meta %}}
name: weather
{{% /influxql/table-meta %}}

| time                 |  co |  hum | location | precip | room        | temp | temp_avg | temp_max | temp_min | wind_avg |
| :------------------- | --: | ---: | -------- | ------ | :---------- | ---: | -------- | -------- | -------- | -------- |
| 2022-01-01T08:00:00Z |   0 | 35.9 |          |        | Kitchen     |   21 |          |          |          |          |
| 2022-01-01T08:00:00Z |   0 | 35.9 |          |        | Living Room | 21.1 |          |          |          |          |
| 2022-01-01T09:00:00Z |   0 | 36.2 |          |        | Kitchen     |   23 |          |          |          |          |
| 2022-01-01T09:00:00Z |   0 | 35.9 |          |        | Living Room | 21.4 |          |          |          |          |
| 2022-01-01T10:00:00Z |   0 | 36.1 |          |        | Kitchen     | 22.7 |          |          |          |          |
| 2022-01-01T10:00:00Z |   0 |   36 |          |        | Living Room | 21.8 |          |          |          |          |
| ...                  | ... |  ... | ...      | ...    | ...         |  ... | ...      | ...      | ...      | ...      |

{{% /expand %}}

{{% expand "Use a regular expression to specify tag keys in the GROUP BY clause" %}}

```sql
SELECT MAX(precip) FROM weather GROUP BY /^l/
```

{{% influxql/table-meta %}}
name: weather  
tags: location=Concord
{{% /influxql/table-meta %}}

| time                 |  max |
| :------------------- | ---: |
| 2021-10-24T00:00:00Z | 4.53 |

{{% influxql/table-meta %}}
name: weather  
tags: location=Hayward
{{% /influxql/table-meta %}}

| time                 |  max |
| :------------------- | ---: |
| 2022-12-31T00:00:00Z | 4.34 |

{{% influxql/table-meta %}}
name: weather  
tags: location=San Francisco
{{% /influxql/table-meta %}}

| time                 |  max |
| :------------------- | ---: |
| 2021-10-24T00:00:00Z | 4.02 |

{{% /expand %}}

{{< /expand-wrapper >}}
