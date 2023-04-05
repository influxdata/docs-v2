---
title: Regular expressions
list_title: Regular expressions
description: >
  Use `regular expressions` to match patterns in your data.
menu:
  influxdb_2_7:
    name: Regular expressions
    identifier: influxql-regular-expressions
    parent: Explore data
weight: 313
list_code_example: |
  ```sql
  SELECT /<regular_expression_field_key>/ FROM /<regular_expression_measurement>/ WHERE [<tag_key> <operator> /<regular_expression_tag_value>/ | <field_key> <operator> /<regular_expression_field_value>/] GROUP BY /<regular_expression_tag_key>/
  ```
---

InfluxQL supports using regular expressions when specifying:

- [field keys](/influxdb/v2.7/reference/glossary/#field-key) and [tag keys](/influxdb/v2.7/reference/glossary/#tag-key) in the [`SELECT` clause](/influxdb/v2.7/query-data/influxql/explore-data/select/).
- [measurements](/influxdb/v2.7/reference/glossary/#measurement) in the [`FROM` clause](/influxdb/v2.7/query-data/influxql/explore-data/select/#from-clause).
- [tag values](/influxdb/v2.7/reference/glossary/#tag-value) and string [field values](/influxdb/v2.7/reference/glossary/#field-value) in the [`WHERE` clause](/influxdb/v2.7/query-data/influxql/explore-data/where/).
- [tag keys](/influxdb/v2.7/reference/glossary/#tag-key) in the [`GROUP BY` clause](/influxdb/v2.7/query-data/influxql/explore-data/group-by/)

Regular expressions in InfluxQL only support string comparisons and can only evaluate [fields](/influxdb/v2.7/reference/glossary/#field) with string values.

{{% note %}}
**Note:** Regular expression comparisons are more computationally intensive than exact
string comparisons. Queries with regular expressions are not as performant
as those without.
{{% /note %}}

- [Syntax](#syntax)
- [Examples](#examples)

## Syntax

```sql
SELECT /<regular_expression_field_key>/ FROM /<regular_expression_measurement>/ WHERE [<tag_key> <operator> /<regular_expression_tag_value>/ | <field_key> <operator> /<regular_expression_field_value>/] GROUP BY /<regular_expression_tag_key>/
```

Regular expressions are surrounded by `/` characters and use
[Golang's regular expression syntax](http://golang.org/pkg/regexp/syntax/).

## Supported operators

`=~`: matches against
`!~`: doesn't match against

### Examples

{{< expand-wrapper >}}

{{% expand "Use a regular expression to specify field keys and tag keys in the SELECT clause" %}}

```sql
SELECT /l/ FROM "h2o_feet" LIMIT 1
```

Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time | level description | location |  water_level|
| :------------ | :----------------| :--------------| --------------:|
| 2019-08-17T00:00:00Z | below 3 feet | santa_monica |  2.0640000000|

The query selects all field keys and tag keys that include an `l`.
Note that the regular expression in the `SELECT` clause must match at least one
field key in order to return results for a tag key that matches the regular
expression.

Currently, there is no syntax to distinguish between regular expressions for
field keys and regular expressions for tag keys in the `SELECT` clause.
The syntax `/<regular_expression>/::[field | tag]` is not supported.

{{% /expand %}}

{{% expand "Use a regular expression to specify measurements in the FROM clause" %}}

```sql
SELECT MEAN("degrees") FROM /temperature/
```

Output:

{{% influxql/table-meta %}}
Name: average_temperature
{{% /influxql/table-meta %}}

| time   | mean |
| :------------------ | ---------------------:|
| 1970-01-01T00:00:00Z | 79.9847293223 |

{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | mean |
| :------------------ | ---------------------:|
| 1970-01-01T00:00:00Z | 64.9980273540 |

This query uses the InfluxQL [MEAN() function](/influxdb/v2.7/query-data/influxql/functions/aggregates/#mean) to calculate the average `degrees` for every [measurement](/influxdb/v2.7/reference/glossary/#measurement) in the [NOAA sample data] that contains the word `temperature`.

{{% /expand %}}

{{% expand "Use a regular expression to specify tag values in the WHERE clause" %}}

```sql
SELECT MEAN(water_level) FROM "h2o_feet" WHERE "location" =~ /[m]/ AND "water_level" > 3
```

Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | mean |
| :------------------ | ---------------------:|
| 1970-01-01T00:00:00Z | 4.4710766395|

This query uses the InfluxQL [MEAN() function](/influxdb/v2.7/query-data/influxql/functions/aggregates/#mean) to calculate the average `water_level` where the [tag value](/influxdb/v2.7/reference/glossary/#measurement) of `location` includes an `m` and `water_level` is greater than three.

{{% /expand %}}

{{% expand "Use a regular expression to specify a tag with no value in the WHERE clause" %}}

```sql
SELECT * FROM "h2o_feet" WHERE "location" !~ /./
>
```

The query selects all data from the `h2o_feet` measurement where the `location`
[tag](/influxdb/v2.7/reference/glossary/#tag) has no value.
Every data [point](/influxdb/v2.7/reference/glossary/#point) in the [NOAA water sample data](/influxdb/v2.7/reference/sample-data/#noaa-water-sample-data) has a tag value for `location`.
It's possible to perform this same query without a regular expression.
See the [Frequently Asked Questions](/influxdb/v2.7/reference/faq/#how-do-i-query-data-by-a-tag-with-a-null-value)
document for more information.

{{% /expand %}}

{{% expand "Use a regular expression to specify a tag with a value in the WHERE clause" %}}

```sql
SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location" =~ /./
```

Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | mean |
| :------------------ | ---------------------:|
| 1970-01-01T00:00:00Z |  4.4418434585|

This query uses the InfluxQL [MEAN() function](/influxdb/v2.7/query-data/influxql/functions/aggregates/#mean) to calculate the average `water_level` across all data with a tag value for `location`.

{{% /expand %}}

{{% expand "Use a regular expression to specify a field value in the WHERE clause" %}}

```sql
SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND "level description" =~ /between/
```

Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | mean |
| :------------------ | ---------------------:|
| 1970-01-01T00:00:00Z | 4.4713666916


This query uses the InfluxQL [MEAN() function](/influxdb/v2.7/query-data/influxql/functions/aggregates/#mean)
to calculate the average `water_level` for all data where the field value of `level description` includes the word `between`.

{{% /expand %}}

{{% expand "Use a regular expression to specify tag keys in the GROUP BY clause" %}}

```sql
SELECT FIRST("index") FROM "h2o_quality" GROUP BY /l/
```

Output: 
{{% influxql/table-meta %}}
name: h2o_quality  
tags: location=coyote_creek
{{% /influxql/table-meta %}}

| time | mean |
| :------------------ |-------------------:|
| 2019-08-17T00:00:00Z | 41.0000000000 |


{{% influxql/table-meta %}}
name: h2o_quality  
tags: location=santa_monica
{{% /influxql/table-meta %}}

| time | mean |
| :------------------ |-------------------:|
| 2019-08-17T00:00:00Z | 99.0000000000 |

This query uses the InfluxQL [FIRST() function](/influxdb/v2.7/query-data/influxql/functions/selectors/#first)

to select the first value of `index` for every tag that includes the letter `l`
in its tag key.

{{% /expand %}}

{{< /expand-wrapper >}}
