---
title: The WHERE clause
list_title: WHERE clause
description: >
  Use the `WHERE` clause to filter data based on [fields](/influxdb/v2.4/reference/glossary/#field), [tags](/influxdb/v2.4/reference/glossary/#tag), and/or [timestamps](/influxdb/v2.4/reference/glossary/#timestamp).
menu:
  influxdb_2_4:
    name: WHERE clause
    parent: Explore data
weight: 302
list_code_example: |
  ```sql
  SELECT_clause FROM_clause WHERE <conditional_expression> [(AND|OR) <conditional_expression> [...]]
  ```
---

Use the `WHERE` clause to filter data based on
[fields](/influxdb/v2.4/reference/glossary/#field),
[tags](/influxdb/v2.4/reference/glossary/#tag), and/or
[timestamps](/influxdb/v2.4/reference/glossary/#timestamp).

- [Syntax](#syntax)
- [Examples](#examples)
- [Common issues](#common-issues-with-the-where-clause)

### Syntax

```sql
SELECT_clause FROM_clause WHERE <conditional_expression> [(AND|OR) <conditional_expression> [...]]
```

The `WHERE` clause supports `conditional_expressions` on fields, tags, and timestamps.

{{% note %}}
**Note:** InfluxDB does not support using OR in the WHERE clause to specify multiple time ranges. For example, InfluxDB returns an empty response for the following query:

```sql
> SELECT * FROM "mydb" WHERE time = '2020-07-31T20:07:00Z' OR time = '2020-07-31T23:07:17Z'`
```
{{% /note %}}

#### Fields

```
field_key <operator> ['string' | boolean | float | integer]
```

The `WHERE` clause supports comparisons against string, boolean, float, and integer [field values](/influxdb/v2.4/reference/glossary/#field-value).

Single quote string field values in the `WHERE` clause.
Queries with unquoted string field values or double quoted string field values will not return any data and, in most cases,
[will not return an error](#common-issues-with-the-where-clause).

#### Supported operators

| Operator | Meaning                  |
|:--------:|:--------                 |
| `=`      | equal to                 |
| `<>`     | not equal to             |
| `!=`     | not equal to             |
| `>`      | greater than             |
| `>=`     | greater than or equal to |
| `<`      | less than                |
| `<=`     | less than or equal to    |

InfluxQL also supports [Regular Expressions](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/).

#### Tags

```sql
tag_key <operator> ['tag_value']
```

Single quote [tag values](/influxdb/v2.4/reference/glossary/#tag-value) in
the `WHERE` clause.
Queries with unquoted tag values or double quoted tag values will not return
any data and, in most cases,
[will not return an error](#common-issues-with-the-where-clause).

#### Supported operators

| Operator | Meaning      |
|:--------:|:-------      |
| `=`      | equal to     |
| `<>`     | not equal to |
| `!=`     | not equal to |

#### Timestamps

For most `SELECT` statements, the default time range is between [`1677-09-21 00:12:43.145224194` and `2262-04-11T23:47:16.854775806Z` UTC](/influxdb/v2.4/reference/faq/#what-are-the-minimum-and-maximum-integers-that-influxdb-can-store).
For `SELECT` statements with a [`GROUP BY time()` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/), the default time
range is between `1677-09-21 00:12:43.145224194` UTC and [`now()`](/influxdb/v2.4/reference/glossary/#now).

See [Time Syntax](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) for information on how to specify alternative time ranges in the `WHERE` clause.

### Examples

{{< expand-wrapper >}}
{{% expand "Select data that have specific field key-values" %}}


```sql
> SELECT * FROM "h2o_feet" WHERE "water_level" > 9
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time | level description  | location | water_level |
| :-------------- | :-------------------| :------------------| -------: |
| 2019-08-25T04:00:00Z  | at or greater than 9 feet | coyote_creek | 9.0320000000|
| 2019-08-25T04:06:00Z  | at or greater than 9 feet | coyote_creek | 9.0780000000|
| 2019-08-25T04:12:00Z  | at or greater than 9 feet | coyote_creek | 9.1110000000|
| 2019-08-25T04:18:00Z  | at or greater than 9 feet | coyote_creek | 9.1500000000|
| 2019-08-25T04:24:00Z  | at or greater than 9 feet | coyote_creek | 9.1800000000|

The query returns data from the `h2o_feet` measurement with field values of `water_level` that are greater than nine. 
This is a partial data set.

{{% /expand %}}

{{% expand "Select data that have a specific string field key-value" %}}

```sql
> SELECT * FROM "h2o_feet" WHERE "level description" = 'below 3 feet'
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time | level description  | location | water_level |
| :-------------- | :-------------------| :------------------| :------------------ |
| 2019-08-17T00:00:00Z | below 3 feet | santa_monica | 2.0640000000|
| 2019-08-17T00:06:00Z | below 3 feet | santa_monica | 2.1160000000|
| 2019-08-17T00:12:00Z | below 3 feet | santa_monica | 2.0280000000|
| 2019-08-17T00:18:00Z | below 3 feet | santa_monica | 2.1260000000|
| 2019-08-17T00:24:00Z | below 3 feet | santa_monica | 2.0410000000|
| 2019-08-17T00:30:00Z | below 3 feet | santa_monica | 2.0510000000|

The query returns data from the `h2o_feet` measurement with field values of `level description` that equal the `below 3 feet` string. InfluxQL requires single quotes around string field values in the `WHERE` clause.

{{% /expand %}}

{{% expand "Select data that have a specific field key-value and perform basic arithmetic" %}}

```sql
> SELECT * FROM "h2o_feet" WHERE "water_level" + 2 > 11.9
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time | level description  | location | water_level |
| :-------------- | :-------------------| :------------------|---------------: |
| 2019-08-28T07:06:00Z | at or greater than 9 feet | coyote_creek | 9.9020000000|
| 2019-08-28T07:12:00Z | at or greater than 9 feet | coyote_creek | 9.9380000000|
| 2019-08-28T07:18:00Z | at or greater than 9 feet | coyote_creek | 9.9570000000|
| 2019-08-28T07:24:00Z | at or greater than 9 feet | coyote_creek | 9.9640000000|
| 2019-08-28T07:30:00Z | at or greater than 9 feet | coyote_creek | 9.9540000000|
| 2019-08-28T07:36:00Z | at or greater than 9 feet | coyote_creek | 9.9410000000|
| 2019-08-28T07:42:00Z | at or greater than 9 feet | coyote_creek | 9.9250000000|
| 2019-08-28T07:48:00Z | at or greater than 9 feet | coyote_creek | 9.9020000000|
| 2019-09-01T23:30:00Z | at or greater than 9 feet | coyote_creek | 9.9020000000|

The query returns data from the `h2o_feet` measurement with field values of
`water_level` plus two that are greater than 11.9. Note that InfluxDB follows the standard order of operations.

See [Mathematical operators](/influxdb/v2.4/query-data/influxql/math_operators/)
for more on supported operators.

{{% /expand %}}

{{% expand "Select data that have a specific tag key-value" %}}

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica'
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet 
{{% /influxql/table-meta %}} 

| time | water_level |
| :-------------- | -------------------:|
| 2019-08-17T00:00:00Z | 2.0640000000|
| 2019-08-17T00:06:00Z | 2.1160000000|
| 2019-08-17T00:12:00Z | 2.0280000000|
| 2019-08-17T00:18:00Z | 2.1260000000|
| 2019-08-17T00:24:00Z | 2.0410000000|

<!-- name: h2o_feet
--------------
time                   water_level
2019-08-18T00:00:00Z   2.064
2019-08-18T00:06:00Z   2.116
[...]
2019-09-18T21:36:00Z   5.066
2019-09-18T21:42:00Z   4.938 -->

The query returns data from the `h2o_feet` measurement where the
[tag key](/influxdb/v2.4/reference/glossary/#tag-key) `location` is set to `santa_monica`.
InfluxQL requires single quotes around tag values in the `WHERE` clause.

{{% /expand %}}

{{% expand "Select data that have specific field key-values and tag key-valuest" %}}

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" <> 'santa_monica' AND (water_level < -0.59 OR water_level > 9.95)
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet
{{% /influxql/table-meta %}} 

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-28T07:18:00Z | 9.9570000000|
| 2019-08-28T07:24:00Z | 9.9640000000|
| 2019-08-28T07:30:00Z | 9.9540000000|
| 2019-08-28T14:30:00Z | -0.6100000000|
| 2019-08-28T14:36:00Z | -0.5910000000|
| 2019-08-29T15:18:00Z | -0.5940000000|

The query returns data from the `h2o_feet` measurement where the tag key
`location` is not set to `santa_monica` and where the field values of
`water_level` are either less than -0.59 or greater than 9.95.
The `WHERE` clause supports the operators `AND` and `OR`, and supports
separating logic with parentheses.

{{% /expand %}}


{{< /expand-wrapper >}}

```sql
> SELECT * FROM "h2o_feet" WHERE time > now() - 7d
```

The query returns data from the `h2o_feet` measurement that have [timestamps](/influxdb/v2.4/reference/glossary/#timestamp)
within the past seven days. See [Time Syntax](/influxdb/v2.4/query-data/influxql/explore-data/time-and-timezone/#time-syntax) for more in-depth information on supported time syntax in the `WHERE` clause.

### Common issues with the `WHERE` clause

#### A `WHERE` clause query unexpectedly returns no data

In most cases, this issue is the result of missing single quotes around
tag values or string field values.
Queries with unquoted or double quoted tag values or string field values will
not return any data and, in most cases, will not return an error.

The first two queries in the code block below attempt to specify the tag value
`santa_monica` without any quotes and with double quotes.
Those queries return no results.
The third query single quotes `santa_monica` (this is the supported syntax)
and returns the expected results.

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = santa_monica
No results

> SELECT "water_level" FROM "h2o_feet" WHERE "location" = "santa_monica"
No results

> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica'
```
Output:
{{% influxql/table-meta %}} 
Name: h2o_feet
{{% /influxql/table-meta %}} 

| time                 |  water_level |
| :------------------- | -----------: |
| 2019-08-17T00:00:00Z | 2.0640000000 |
| 2019-08-17T00:06:00Z | 2.1160000000 |
| 2019-08-17T00:12:00Z | 2.0280000000 |
| 2019-08-17T00:18:00Z | 2.1260000000 |
| 2019-08-17T00:24:00Z | 2.0410000000 |
| 2019-08-17T00:30:00Z | 2.0510000000 |

The first two queries in the code block below attempt to specify the string
field value `at or greater than 9 feet` without any quotes and with double
quotes.
The first query returns an error because the string field value includes
white spaces.
The second query returns no results.
The third query single quotes `at or greater than 9 feet` (this is the
supported syntax) and returns the expected results.

```sql
> SELECT "level description" FROM "h2o_feet" WHERE "level description" = at or greater than 9 feet
ERR: 400 Bad Request: failed to parse query: found than, expected ; at line 1, char 86

> SELECT "level description" FROM "h2o_feet" WHERE "level description" = "at or greater than 9 feet"
No results

> SELECT "level description" FROM "h2o_feet" WHERE "level description" = 'at or greater than 9 feet'
```

Output:
{{% influxql/table-meta %}} 
Name: h2o_feet
{{% /influxql/table-meta %}} 

| time                        | level_description |
| :---------------------------| ------: |
| 2019-08-25T04:00:00Z | at or greater than 9 feet |
| 2019-08-25T04:06:00Z | at or greater than 9 feet |
| 019-08-25T04:12:00Z  | at or greater than 9 feet |
| 2019-08-25T04:18:00Z | at or greater than 9 feet | 
| 2019-08-25T04:24:00Z | at or greater than 9 feet |