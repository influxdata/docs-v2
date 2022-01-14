---
title: Use the WHERE clause
list_title: WHERE clause
description: >
  ...
menu:
  influxdb_2_1:
    name: WHERE clause
    parent: Explore data
weight: 302
---


## The `WHERE` clause

The `WHERE` filters data based on
[fields](/enterprise_influxdb/v1.9/concepts/glossary/#field),
[tags](/enterprise_influxdb/v1.9/concepts/glossary/#tag), and/or
[timestamps](/enterprise_influxdb/v1.9/concepts/glossary/#timestamp).

Tired of reading? Check out this InfluxQL Short:
<br>
<br>
<iframe src="https://player.vimeo.com/video/195058724?title=0&byline=0&portrait=0" width="60%" height="250px" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

### Syntax

```
SELECT_clause FROM_clause WHERE <conditional_expression> [(AND|OR) <conditional_expression> [...]]
```

The `WHERE` clause supports `conditional_expression`s on fields, tags, and
timestamps.

>**Note** InfluxDB does not support using OR in the WHERE clause to specify multiple time ranges. For example, InfluxDB returns an empty response for the following query:

`> SELECT * FROM "absolutismus" WHERE time = '2016-07-31T20:07:00Z' OR time = '2016-07-31T23:07:17Z'`

#### Fields

```
field_key <operator> ['string' | boolean | float | integer]
```

The `WHERE` clause supports comparisons against string, boolean, float,
and integer [field values](/enterprise_influxdb/v1.9/concepts/glossary/#field-value).

Single quote string field values in the `WHERE` clause.
Queries with unquoted string field values or double quoted string field values
will not return any data and, in most cases,
[will not return an error](#common-issues-with-the-where-clause).

##### Supported operators

| Operator | Meaning                  |
|:--------:|:--------                 |
| `=`      | equal to                 |
| `<>`     | not equal to             |
| `!=`     | not equal to             |
| `>`      | greater than             |
| `>=`     | greater than or equal to |
| `<`      | less than                |
| `<=`     | less than or equal to    |

Other supported features:
[Arithmetic Operations](/enterprise_influxdb/v1.9/query_language/math_operators/),
[Regular Expressions](#regular-expressions)

#### Tags

```sql
tag_key <operator> ['tag_value']
```

Single quote [tag values](/enterprise_influxdb/v1.9/concepts/glossary/#tag-value) in
the `WHERE` clause.
Queries with unquoted tag values or double quoted tag values will not return
any data and, in most cases,
[will not return an error](#common-issues-with-the-where-clause).

##### Supported operators

| Operator | Meaning      |
|:--------:|:-------      |
| `=`      | equal to     |
| `<>`     | not equal to |
| `!=`     | not equal to |

Other supported features:
[Regular Expressions](#regular-expressions)

#### Timestamps

For most `SELECT` statements, the default time range is between [`1677-09-21 00:12:43.145224194` and `2262-04-11T23:47:16.854775806Z` UTC](/enterprise_influxdb/v1.9/troubleshooting/frequently-asked-questions/#what-are-the-minimum-and-maximum-timestamps-that-influxdb-can-store).
For `SELECT` statements with a [`GROUP BY time()` clause](#group-by-time-intervals), the default time
range is between `1677-09-21 00:12:43.145224194` UTC and [`now()`](/enterprise_influxdb/v1.9/concepts/glossary/#now).

The [Time Syntax](#time-syntax) section on this page
details how to specify alternative time ranges in the `WHERE` clause.

### Examples

#### Select data that have specific field key-values

```sql
> SELECT * FROM "h2o_feet" WHERE "water_level" > 8

name: h2o_feet
--------------
time                   level description      location       water_level
2015-08-18T00:00:00Z   between 6 and 9 feet   coyote_creek   8.12
2015-08-18T00:06:00Z   between 6 and 9 feet   coyote_creek   8.005
[...]
2015-09-18T00:12:00Z   between 6 and 9 feet   coyote_creek   8.189
2015-09-18T00:18:00Z   between 6 and 9 feet   coyote_creek   8.084
```

The query returns data from the `h2o_feet`
[measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement) with
[field values](/enterprise_influxdb/v1.9/concepts/glossary/#field-value) of `water_level`
that are greater than eight.

#### Select data that have a specific string field key-value

```sql
> SELECT * FROM "h2o_feet" WHERE "level description" = 'below 3 feet'

name: h2o_feet
--------------
time                   level description   location       water_level
2015-08-18T00:00:00Z   below 3 feet        santa_monica   2.064
2015-08-18T00:06:00Z   below 3 feet        santa_monica   2.116
[...]
2015-09-18T14:06:00Z   below 3 feet        santa_monica   2.999
2015-09-18T14:36:00Z   below 3 feet        santa_monica   2.907
```

The query returns data from the `h2o_feet` measurement with field values of
`level description` that equal the `below 3 feet` string.
InfluxQL requires single quotes around string field values in the `WHERE`
clause.

#### Select data that have a specific field key-value and perform basic arithmetic

```sql
> SELECT * FROM "h2o_feet" WHERE "water_level" + 2 > 11.9

name: h2o_feet
--------------
time                   level description           location       water_level
2015-08-29T07:06:00Z   at or greater than 9 feet   coyote_creek   9.902
2015-08-29T07:12:00Z   at or greater than 9 feet   coyote_creek   9.938
2015-08-29T07:18:00Z   at or greater than 9 feet   coyote_creek   9.957
2015-08-29T07:24:00Z   at or greater than 9 feet   coyote_creek   9.964
2015-08-29T07:30:00Z   at or greater than 9 feet   coyote_creek   9.954
2015-08-29T07:36:00Z   at or greater than 9 feet   coyote_creek   9.941
2015-08-29T07:42:00Z   at or greater than 9 feet   coyote_creek   9.925
2015-08-29T07:48:00Z   at or greater than 9 feet   coyote_creek   9.902
2015-09-02T23:30:00Z   at or greater than 9 feet   coyote_creek   9.902
```

The query returns data from the `h2o_feet` measurement with field values of
`water_level` plus two that are greater than 11.9.
Note that InfluxDB follows the standard order of operations
See [Mathematical Operators](/enterprise_influxdb/v1.9/query_language/math_operators/)
for more on supported operators.

#### Select data that have a specific tag key-value

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica'

name: h2o_feet
--------------
time                   water_level
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   2.116
[...]
2015-09-18T21:36:00Z   5.066
2015-09-18T21:42:00Z   4.938
```

The query returns data from the `h2o_feet` measurement where the
[tag key](/enterprise_influxdb/v1.9/concepts/glossary/#tag-key) `location` is set to `santa_monica`.
InfluxQL requires single quotes around tag values in the `WHERE` clause.

#### Select data that have specific field key-values and tag key-values

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" <> 'santa_monica' AND (water_level < -0.59 OR water_level > 9.95)

name: h2o_feet
--------------
time                   water_level
2015-08-29T07:18:00Z   9.957
2015-08-29T07:24:00Z   9.964
2015-08-29T07:30:00Z   9.954
2015-08-29T14:30:00Z   -0.61
2015-08-29T14:36:00Z   -0.591
2015-08-30T15:18:00Z   -0.594
```

The query returns data from the `h2o_feet` measurement where the tag key
`location` is not set to `santa_monica` and where the field values of
`water_level` are either less than -0.59 or greater than 9.95.
The `WHERE` clause supports the operators `AND` and `OR`, and supports
separating logic with parentheses.

#### Select data that have specific timestamps

```sql
> SELECT * FROM "h2o_feet" WHERE time > now() - 7d
```

The query returns data from the `h2o_feet` measurement that have [timestamps](/enterprise_influxdb/v1.9/concepts/glossary/#timestamp)
within the past seven days.
The [Time Syntax](#time-syntax) section on this page
offers in-depth information on supported time syntax in the `WHERE` clause.

### Common issues with the `WHERE` clause

#### A `WHERE` clause query unexpectedly returns no data

In most cases, this issue is the result of missing single quotes around
[tag values](/enterprise_influxdb/v1.9/concepts/glossary/#tag-value)
or string [field values](/enterprise_influxdb/v1.9/concepts/glossary/#field-value).
Queries with unquoted or double quoted tag values or string field values will
not return any data and, in most cases, will not return an error.

The first two queries in the code block below attempt to specify the tag value
`santa_monica` without any quotes and with double quotes.
Those queries return no results.
The third query single quotes `santa_monica` (this is the supported syntax)
and returns the expected results.

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = santa_monica

> SELECT "water_level" FROM "h2o_feet" WHERE "location" = "santa_monica"

> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica'

name: h2o_feet
--------------
time                   water_level
2015-08-18T00:00:00Z   2.064
[...]
2015-09-18T21:42:00Z   4.938
```

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

ERR: error parsing query: found than, expected ; at line 1, char 86

> SELECT "level description" FROM "h2o_feet" WHERE "level description" = "at or greater than 9 feet"

> SELECT "level description" FROM "h2o_feet" WHERE "level description" = 'at or greater than 9 feet'

name: h2o_feet
--------------
time                   level description
2015-08-26T04:00:00Z   at or greater than 9 feet
[...]
2015-09-15T22:42:00Z   at or greater than 9 feet
```
