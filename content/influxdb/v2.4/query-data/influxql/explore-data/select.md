---
title: The SELECT statement
list_title: SELECT statement
description: >
  Use the `SELECT` statement to query data from a particular [measurement](/influxdb/v2.4/reference/glossary/#measurement) or measurements.
menu:
  influxdb_2_4:
    name: SELECT statement
    parent: Explore data
weight: 301
list_code_example: |
  ```sql
  SELECT <field_key>[,<field_key>,<tag_key>] FROM <measurement_name>[,<measurement_name>]
  ```
---

Use the `SELECT` statement to query data from a particular [measurement](/influxdb/v2.4/reference/glossary/#measurement) or measurements.

- [Before you get started](#before-you-get-started)
- [Syntax](#syntax)
- [Examples](#examples)
- [Common issues](#common-issues-with-the-select-statement)
- [Regular expressions](#regular-expressions)
- [Data types and cast operations](#data-types-and-cast-operations)
- [Merge behavior](#merge-behavior)
- [Multiple statements](#multiple-statements)

## Before you get started

InfluxDB 1.x data is stored in databases and retention policies. In InfluxDB 2.x versions, data is stored in **buckets**. Because InfluxQL uses the 1.x data model, a bucket must be mapped to a database and retention policy (DBRP) before it can be queried using InfluxQL.

{{% note %}}
See [Query data with InfluxQL](/influxdb/v2.4/query-data/influxql/) to learn how to verify if buckets have a mapping and how to create DBRP mappings for unmapped buckets.
{{% /note %}}

Note that using the API to query with InfluxQL will return all data in JSON format.

The examples in this document use the `noaa` database to create SELECT queries. 

{{% note %}}
**Note:** If you are using the [InfluxQL shell](/influxdb/v2.4/tools/influxql-shell/) be sure to enter
`USE noaa` before you running the queries below.
{{% /note %}}

### Syntax

```sql
SELECT <field_key>[,<field_key>,<tag_key>] FROM <measurement_name>[,<measurement_name>]
```
{{% note %}}
**Note:** The `SELECT` statement **requires** a `SELECT` clause and a `FROM` clause.
{{% /note %}}

#### `SELECT` clause

The `SELECT` clause supports several formats for specifying data:

  - `SELECT *` - Returns all [fields](/influxdb/v2.4/reference/glossary/#field) and [tags](/influxdb/v2.4/reference/glossary/#tag).
  - `SELECT "<field_key>"` - Returns a specific field.
  - `SELECT "<field_key>","<field_key>"` - Returns more than one field.
  - `SELECT "<field_key>","<tag_key>"` - Returns a specific field and tag. The `SELECT` clause must specify at least one field when it includes a tag.
  - `SELECT "<field_key>"::field,"<tag_key>"::tag` - Returns a specific field and tag.
The `::[field | tag]` syntax specifies the [identifier's](/influxdb/v2.4/reference/syntax/influxql/spec/#identifiers) type.
Use this syntax to differentiate between field keys and tag keys that have the same name.

Other supported features include:
 - [Functions](/influxdb/v2.4/query-data/influxql/view-functions/)
 - [Basic cast operations](#data-types-and-cast-operations)
 - [Regular expressions](/influxdb/v2.4/query-data/influxql/explore-data/regular-expressions/)

{{% note %}}
**Note:** The SELECT statement cannot include an aggregate function **and** a non-aggregate function, field key, or tag key. For more information, see [error about mixing aggregate and non-aggregate queries](/enterprise_influxdb/v1.9/troubleshooting/errors/#error-parsing-query-mixing-aggregate-and-non-aggregate-queries-is-not-supported).
{{% /note %}}

#### `FROM` clause

The `FROM` clause supports several formats for specifying a [measurement(s)](/influxdb/v2.4/reference/glossary/#measurement):

  - `FROM <measurement_name>` - Returns data from a single measurement. 
  - `FROM <measurement_name>,<measurement_name>` - Returns data from more than one measurement.
  - `FROM <database_name>.<retention_policy_name>.<measurement_name>` - Returns data from a fully qualified measurement.
  - `FROM <database_name>..<measurement_name>` - Returns data from a measurement.

#### Quoting

[Identifiers](/influxdb/v2.4/reference/syntax/influxql/spec/#identifiers) **must** be double quoted if they contain characters other than `[A-z,0-9,_]`, if they
begin with a digit, or if they are an [InfluxQL keyword](https://github.com/influxdata/influxql/blob/master/README.md#keywords).
While not always necessary, we recommend that you double quote identifiers.

{{% note %}}
**Note:** The quoting syntax for queries differs from the [line protocol](/influxdb/v2.4/reference/syntax/line-protocol/).
Please review the [rules for single and double-quoting](/influxdb/v2.4/reference/syntax/line-protocol/#quotes) in queries.
{{% /note %}}

#### Timestamps

To specify the format of timestamps returned in results in human readable format, use the precision helper command in the InfluxQL shell.

```bash
precision rfc3339
```

### Examples

{{< expand-wrapper >}}
{{% expand "Select all fields and tags from a single measurement" %}}

```sql
> SELECT * FROM "h2o_feet"
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | level description | location | water_level |
| :-------------- |:----------------------| :-------------------| ------------------:|
| 2019-08-17T00:00:00Z | below 3 feet |santa_monica | 2.0640000000|
| 2019-08-17T00:00:00Z | between 6 and 9 feet | coyote_creek | 8.1200000000|
| 2019-08-17T00:06:00Z | below 3 feet| santa_monica | 2.1160000000|
| 2019- 08-17T00:06:00Z | between 6 and 9 feet |coyote_creek |8.0050000000|
| 2019-08-17T00:12:00Z | below 3 feet | santa_monica | 2.0280000000|
| 2019-08-17T00:12:00Z | between 6 and 9 feet | coyote_creek | 7.8870000000|
| 2019-08-17T00:18:00Z | below 3 feet |santa_monica | 2.1260000000|


The data above is a partial listing of the query output, as the result set is quite large. The query selects all [fields](/influxdb/v2.4/reference/glossary/#field) and
[tags](/influxdb/v2.4/reference/glossary/#tag) from the `h2o_feet`
[measurement](/influxdb/v2.4/reference/glossary/#measurement).

The InfluxQL shell queries the data in the `USE`d database and the
`DEFAULT` [retention policy](/influxdb/v2.4/reference/glossary/#retention-policy-rp).
If you're using the [InfluxDB API](/influxdb/v2.4/reference/api/influxdb-1x//) be sure to set the
`db` [query string parameter](/influxdb/v2.4/reference/api/influxdb-1x/)
to `noaa`. If you do not set the `rp` query string parameter, the InfluxDB API automatically
queries the database's `DEFAULT` retention policy.

{{% /expand %}}

{{% expand "Select specific tags and fields from a single measurement" %}}

```sql
> SELECT "level description","location","water_level" FROM "h2o_feet"
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | level description | location | water_level |
| :-------------- |:----------------------| :-------------------| ------------------:|
| 2019-08-17T00:00:00Z | below 3 feet |santa_monica | 2.0640000000|
| 2019-08-17T00:00:00Z | between 6 and 9 feet | coyote_creek | 8.1200000000|

The query selects the `level description` field, the `location` tag, and the
`water_level` field.

{{% note %}}
**Note:** The `SELECT` clause must specify at least one field when it includes
a tag.
{{% /note %}}

{{% /expand %}}

{{% expand "Select specific tags and fields from a single measurement, and provide their identifier type" %}}

```sql
> SELECT "level description"::field,"location"::tag,"water_level"::field FROM "h2o_feet"
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | level description | location | water_level |
| :-------------- |:----------------------| :-------------------| ------------------:|
| 2019-08-17T00:24:00Z  | between 6 and 9 feet   | coyote_creek  | 7.6350000000|
| 2019-08-17T00:30:00Z  | below 3 feet   | santa_monica   | 2.0510000000|
| 2019-08-17T00:30:00Z | between 6 and 9 feet   | coyote_creek  |  7.5000000000|
| 2019-08-17T00:36:00Z  | below 3 feet   | santa_monica  | 2.0670000000 |
| 2019-08-17T00:36:00Z  | between 6 and 9 feet   |  coyote_creek  | 7.3720000000 |
| 2019-08-17T00:42:00Z   | below 3 feet  | santa_monica   | 2.0570000000 |

The query selects the `level description` field, the `location` tag, and the
`water_level` field from the `h2o_feet` measurement.
The `::[field | tag]` syntax specifies if the
[identifier](/influxdb/v2.4/reference/syntax/influxql/spec/#identifiers) is a field or tag.
Use `::[field | tag]` to differentiate between [an identical field key and tag key ](/v2.4/reference/faq/#how-do-i-query-data-with-an-identical-tag-key-and-field-key).
That syntax is not required for most use cases.

{{% /expand %}}

{{% expand "Select all fields from a single measurement" %}}

```sql
> SELECT *::field FROM "h2o_feet"
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | level description| water_level |
| :-------------- | :-------------------| ------------------:|
| 2019-08-17T00:00:00Z  | below 3 feet | 2.0640000000 | 
| 2019-08-17T00:00:00Z | between 6 and 9 feet | 8.1200000000|
| 2019-08-17T00:06:00Z | below 3 feet  | 2.1160000000|
| 2019-08-17T00:06:00Z  | between 6 and 9 feet | 8.0050000000|
| 2019-08-17T00:12:00Z | below 3 feet | 2.0280000000|
| 2019-08-17T00:12:00Z  | between 6 and 9 feet | 7.8870000000|

The query selects all fields from the `h2o_feet` measurement.
The `SELECT` clause supports combining the `*` syntax with the `::` syntax.

{{% /expand %}}

{{% expand "Select a specific field from a measurement and perform basic arithmetic" %}}

```sql
> SELECT ("water_level" * 2) + 4 FROM "h2o_feet"
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | water_level |
| :-------------- | ------------------:|
| 2019-08-17T00:00:00Z  | 20.2400000000 |
| 2019-08-17T00:00:00Z  | 8.1280000000 |
| 2019-08-17T00:06:00Z  | 20.0100000000 |
| 2019-08-17T00:06:00Z  | 8.2320000000 |
| 2019-08-17T00:12:00Z  | 19.7740000000 |
| 2019-08-17T00:12:00Z  | 8.0560000000 |

The query multiplies `water_level`'s field values by two and adds four to those
values.

{{% note %}}
**Note:** InfluxDB follows the standard order of operations.
See [InfluxQL mathematical operators](/influxdb/v2.4/query-data/influxql/math_operators/)
for more on supported operators.
{{% /note %}}

{{% /expand %}}

{{% expand "Select all data from more than one measurement" %}}

```sql
> SELECT * FROM "h2o_feet","h2o_pH"
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time | level description | location | pH | water_level |
| :-------------- |:-------------| :----------------| :-------------| --------------:|
| 2019-08-17T00:00:00Z | below 3 feet  | santa_monica  | <nil> |  2.0640000000|
| 2019-08-17T00:00:00Z | between 6 and 9 feet  | coyote_creek  | <nil> | 8.1200000000|
| 2019-08-17T00:06:00Z | below 3 feet  | santa_monica  | <nil> | 2.1160000000|
| 2019-08-17T00:06:00Z | between 6 and 9 feet | coyote_creek  | <nil> | 8.0050000000|
| 2019-08-17T00:12:00Z | below 3 feet  | santa_monica | <nil> | 2.0280000000 |
| 2019-08-17T00:12:00Z | between 6 and 9 feet  | coyote_creek | <nil> | 7.8870000000|
| 2019-08-17T00:18:00Z  | below 3 feet  | santa_monica  | <nil> | 2.1260000000|
| 2019-08-17T00:18:00Z  | between 6 and 9 feet | coyote_creek | <nil> | 7.7620000000|

{{% influxql/table-meta %}}
Name: h2o_pH
{{% /influxql/table-meta %}}

| time | level description | location | pH | water_level |
| :-------------- |:-------------| :----------------| :-------------| --------------:|
| 2019-08-17T00:00:00Z  | <nil> | coyote_creek  | 7.00| <nil> |
| 2019-08-17T00:06:00Z  | <nil> |coyote_creek | 8.00 | <nil> |
| 2019-08-17T00:06:00Z  | <nil> |santa_monica  | 6.00 | <nil> |
| 2019-08-17T00:12:00Z  | <nil> |coyote_creek  |8.00 | <nil> |


The query selects all fields and tags from two measurements: `h2o_feet` and
`h2o_pH`.
Separate multiple measurements with a comma (`,`).

{{% /expand %}}

{{% expand "Select all data from a measurement in a particular database" %}}

```sql
> SELECT * FROM noaa.."h2o_feet"
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | level description | location | water_level |
| :-------------- |:----------------------| :-------------------| ------------------:|
| 2019-08-17T00:00:00Z | below 3 feet |santa_monica | 2.0640000000|
| 2019-08-17T00:00:00Z | between 6 and 9 feet | coyote_creek | 8.1200000000|
| 2019-08-17T00:06:00Z | below 3 feet| santa_monica | 2.1160000000|
| 2019- 08-17T00:06:00Z | between 6 and 9 feet |coyote_creek |8.0050000000|
| 2019-08-17T00:12:00Z | below 3 feet | santa_monica | 2.0280000000|
| 2019-08-17T00:12:00Z | between 6 and 9 feet | coyote_creek | 7.8870000000|

The query selects data in the `noaa`and the `h2o_feet` measurement.
The `..` indicates the `DEFAULT` retention policy for the specified database.

{{% /expand %}}

{{< /expand-wrapper >}}

### Common issues with the SELECT statement

#### Selecting tag keys in the SELECT statement

A query requires at least one [field key](/influxdb/v2.4/reference/glossary/#field-key)
in the `SELECT` clause to return data.
If the `SELECT` clause only includes a single [tag key](/influxdb/v2.4/reference/glossary/#tag-key) or several tag keys, the
query returns an empty response.
This behavior is a result of how the system stores data.

##### Example

The following query returns no data because it specifies a single tag key (`location`) in
the `SELECT` clause:

```sql
> SELECT "location" FROM "h2o_feet"
> No results
```
To return any data associated with the `location` tag key, the query's `SELECT`
clause must include at least one field key (`water_level`):

```sql
> SELECT "water_level","location" FROM "h2o_feet"
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time | water_level | location |
| :-------------- | :-------------------| ------------------:|
| 2019-08-17T00:00:00Z  | 8.1200000000  | coyote_creek |
| 2019-08-17T00:00:00Z | 2.0640000000 | santa_monica |
| 2019-08-17T 00:06:00Z  | 8.0050000000 | coyote_creek |
| 2019-08-17T00:06:00Z  | 2.1160000000 | santa_monica |
| 2019-08-17T00:12:00Z  | 7.8870000000 | coyote_creek |
| 2019-08-17T00:12:00Z  | 2.0280000000 | santa_monica |
| 2019-08-17T00:18:00Z  | 7.7620000000 | coyote_creek |
| 2019-08-17T00:18:00Z  | 2.1260000000 | santa_monica |

## Regular expressions

InfluxQL supports using regular expressions when specifying:

* [field keys](/influxdb/v2.4/reference/glossary/#field-key) and [tag keys](/influxdb/v2.4/reference/glossary/#tag-key) in the [`SELECT` clause](/influxdb/v2.4/query-data/influxql/explore-data/select/)
* [measurements](/influxdb/v2.4/reference/glossary/#measurement) in the [`FROM` clause](/influxdb/v2.4/query-data/influxql/explore-data/select/#from-clause)
* [tag values](/influxdb/v2.4/reference/glossary/#tag-value) and string [field values](/influxdb/v2.4/reference/glossary/#field-value) in the [`WHERE` clause](/influxdb/v2.4/query-data/influxql/explore-data/where/).
* [tag keys](/influxdb/v2.4/reference/glossary/#tag-key) in the [`GROUP BY` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/)

Currently, InfluxQL does not support using regular expressions to match
non-string field values in the
`WHERE` clause,
[databases](/influxdb/v2.4/reference/glossary/#database), and
[retention policies](/influxdb/v2.4/reference/glossary/#retention-policy-rp).

{{% note %}}
**Note:** Regular expression comparisons are more computationally intensive than exact
string comparisons; queries with regular expressions are not as performant
as those without.
{{% /note %}}

### Syntax

```sql
SELECT /<regular_expression_field_key>/ FROM /<regular_expression_measurement>/ WHERE [<tag_key> <operator> /<regular_expression_tag_value>/ | <field_key> <operator> /<regular_expression_field_value>/] GROUP BY /<regular_expression_tag_key>/
```

Regular expressions are surrounded by `/` characters and use
[Golang's regular expression syntax](http://golang.org/pkg/regexp/syntax/).

#### Supported operators

`=~`&emsp;matches against
`!~`&emsp;doesn't match against

### Examples

{{< expand-wrapper >}}
{{% expand "Use a regular expression to specify field keys and tag keys in the SELECT statement" %}}
#### Use a regular expression to specify field keys and tag keys in the SELECT statement

```sql
> SELECT /l/ FROM "h2o_feet" LIMIT 1
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

| time   | level description | location | water_level |
| :-------------- |:----------------------| :-------------------| ------------------:|
| 2019-08-17T00:00:00Z | below 3 feet | santa_monica | 2.0640000000 |

The query selects all [field keys](/influxdb/v2.4/reference/glossary/#field-key)
and [tag keys](/influxdb/v2.4/reference/glossary/#tag-key) that include an `l`.
Note that the regular expression in the `SELECT` clause must match at least one
field key in order to return results for a tag key that matches the regular
expression.

Currently, there is no syntax to distinguish between regular expressions for
field keys and regular expressions for tag keys in the `SELECT` clause.
The syntax `/<regular_expression>/::[field | tag]` is not supported.

{{% /expand %}}

{{% expand "Use a regular expression to specify measurements in the FROM clause" %}}

```sql
> SELECT MEAN("degrees") FROM /temperature/
```
Output:
{{% influxql/table-meta %}}
Name: average_temperature    
{{% /influxql/table-meta %}}

| time | mean|
| :-------------- |----------------------:|
| 1970-01-01T00:00:00Z | 79.9847293223


{{% influxql/table-meta %}}
Name: h2o_temperature      
{{% /influxql/table-meta %}}

| time | mean|
| :-------------- |----------------------:|
| 1970-01-01T00:00:00Z | 64.9980273540 |


This query uses the InfluxQL [MEAN() function](/influxdb/v2.4/query-data/influxql/view-functions/aggregates/#mean) to calculate the average `degrees` for every [measurement](/influxdb/v2.4/reference/glossary/#measurement) in the `noaa` database that contains the word `temperature`.

{{% /expand %}}

{{< /expand-wrapper >}}

## Data types and cast operations

The [`SELECT` clause](#the-basic-select-statement) supports specifying a [field's](/influxdb/v2.4/reference/glossary/#field) type and basic cast operations with the `::` syntax.

  - [Data types](#data-types)
  - [Cast operations](#cast-operations)

## Data types

[Field values](/influxdb/v2.4/reference/glossary/#field-value) can be floats, integers, strings, or booleans.
The `::` syntax allows users to specify the field's type in a query.

{{% note %}}
**Note:** Generally, it is not necessary to specify the field value type in the [`SELECT` clause](/influxdb/v2.4/query-data/influxql/explore-data/select/). In most cases, InfluxDB rejects any writes that attempt to write a [field value](/influxdb/v2.4/reference/glossary/#field-value) to a field that previously accepted field values of a different type.
{{% /note %}}

It is possible for field value types to differ across [shard groups](/influxdb/v2.4/reference/glossary/#shard-group).
In these cases, it may be necessary to specify the field value type in the
`SELECT` clause.
Please see the
[Frequently Asked Questions](/influxdb/v2.4/reference/faq/#how-does-influxdb-handle-field-type-discrepancies-across-shards)
document for more information on how InfluxDB handles field value type discrepancies.

### Syntax

```sql
> SELECT_clause <field_key>::<type> FROM_clause
```

`type` can be `float`, `integer`, `string`, or `boolean`.
In most cases, InfluxDB returns no data if the `field_key` does not store data of the specified
`type`. See [Cast Operations](#cast-operations) for more information.

### Example

```sql
> SELECT "water_level"::float FROM "h2o_feet" LIMIT 4
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

|time | water_level |
| :------------------ |-------------------:|
| 2019-08-17T00:00:00Z | 8.1200000000 |
| 2019-08-17T00:00:00Z | 2.0640000000 |
| 2019-08-17T00:06:00Z | 8.0050000000 |
| 2019-08-17T00:06:00Z | 2.1160000000 |

The query returns values of the `water_level` field key that are floats.

## Cast operations

The `::` syntax allows users to perform basic cast operations in queries.
Currently, InfluxDB supports casting [field values](/influxdb/v2.4/reference/glossary/#field-value) from integers to
floats or from floats to integers.

### Syntax

```sql
SELECT_clause <field_key>::<type> FROM_clause
```

`type` can be `float` or `integer`.

InfluxDB returns no data if the query attempts to cast an integer or float to a string or boolean.

### Examples

{{< expand-wrapper >}}

{{% expand "Cast float field values to integers" %}}

```sql
> SELECT "water_level"::integer FROM "h2o_feet" LIMIT 4
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

|time | water_level |
| :------------------ |-------------------:|
| 2019-08-17T00:00:00Z | 8.0000000000 |
| 2019-08-17T00:00:00Z | 2.0000000000 |
| 2019-08-17T00:06:00Z | 8.0000000000 |
| 2019-08-17T00:06:00Z | 2.0000000000 |

The query returns the integer form of `water_level`'s float [field values](/influxdb/v2.4/reference/glossary/#field-value).

{{% /expand %}}

{{% expand "Cast float field values to strings (this functionality is not supported)" %}}

```sql
> SELECT "water_level"::string FROM "h2o_feet" LIMIT 4
> No results
```

The query returns no data as casting a float field value to a string is not yet supported.

{{% /expand %}}

{{< /expand-wrapper >}}

## Merge behavior

In InfluxDB, queries merge [series](/influxdb/v2.4/reference/glossary/#series) automatically.

### Example

{{< expand-wrapper >}}

{{% expand "Merge behavior" %}}

The `h2o_feet` [measurement](/influxdb/v2.4/reference/glossary/#measurement) in the `noaa` is part of two [series](/influxdb/v2.4/reference/glossary/#series).
The first series is made up of the `h2o_feet` measurement and the `location = coyote_creek` [tag](/influxdb/v2.4/reference/glossary/#tag). The second series is made of up the `h2o_feet` measurement and the `location = santa_monica` tag.

The following query automatically merges those two series when it calculates the average `water_level` using the [MEAN() function](/influxdb/v2.4/query-data/influxql/view-functions/aggregates/#mean):

```sql
> SELECT MEAN("water_level") FROM "h2o_feet"
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

|time | mean |
| :------------------ |-------------------:|
| 1970-01-01T00:00:00Z  | 4.4419314021 |

If you want the average `water_level` for the first series only, specify the relevant tag in the [`WHERE` clause](#/influxdb/v2.4/query-data/influxql/explore-data/where/):

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location" = 'coyote_creek'
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

|time | mean |
| :------------------ |-------------------:|
| 1970-01-01T00:00:00Z | 5.3591424203 |

If you want the average `water_level` for each individual series, include a [`GROUP BY` clause](/influxdb/v2.4/query-data/influxql/explore-data/group-by/):

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" GROUP BY "location"
```
Output: 
{{% influxql/table-meta %}}
name: h2o_feet  
tags: location=coyote_creek
{{% /influxql/table-meta %}}

| time | mean |
| :------------------ |-------------------:|
 | 1970-01-01T00:00:00Z | 5.3591424203 |

{{% influxql/table-meta %}}
name: h2o_feet      
tags: location=santa_monica
{{% /influxql/table-meta %}}

| time | mean |
| :------------------ |-------------------:|
| 1970-01-01T00:00:00Z  | 3.5307120942 |

{{% /expand %}}

{{< /expand-wrapper >}}

## Multiple statements

Separate multiple `SELECT` statements in a query with a semicolon (`;`).

### Examples

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxQL shell](#)
[InfluxDB API](#)
{{% /tabs %}}

{{% tab-content %}}

In the [InfluxQL shell](/influxdb/v2.4/tools/influxql-shell/):

```sql
> SELECT MEAN("water_level") FROM "h2o_feet"; SELECT "water_level" FROM "h2o_feet" LIMIT 2
``` 
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

|time | mean |
| :------------------ |-------------------:|
| 1970-01-01T00:00:00Z | 4.4419314021 |


{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

|time | water_level |
| :------------------ |-------------------:|
| 2019-08-17T00:00:00Z | 8.12 |
| 2015-08-18T00:00:00Z | 2.064 |

{{% /tab-content %}}

{{% tab-content %}}

With the [InfluxDB API](/influxdb/v2.4/reference/api/influxdb-1x/):

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
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}
