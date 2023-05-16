---
title: SELECT statement
list_title: SELECT statement
description: >
  Use the `SELECT` statement to query data from one or more
  [measurements](/influxdb/cloud-dedicated/reference/glossary/#measurement).
menu:
  influxdb_cloud_dedicated:
    name: SELECT statement
    parent: influxql-reference
weight: 301
list_code_example: |
  ```sql
  SELECT <field_key>[,<field_key>,<tag_key>] FROM <measurement_name>[,<measurement_name>]
  ```
---

Use the `SELECT` statement to query data from one or more
[measurements](/influxdb/cloud-dedicated/reference/glossary/#measurement).
The `SELECT` statement **requires** a [`SELECT` clause](#select-clause) and a
[`FROM` clause](#from-clause).

- [Syntax](#syntax)
  - [SELECT clause](#select-clause)
  - [FROM clause](#from-clause)
- [Examples](#examples)
- [Notable behaviors](#notable-behaviors)
- [Regular expressions](#regular-expressions)
- [Data types and cast operations](#data-types-and-cast-operations)
- [Merge behavior](#merge-behavior)
- [Multiple statements](#multiple-statements)

## Syntax

```sql
SELECT field_expression[, ..., field_expression_n[, tag_expression[, ..., tag_expression_n]]] FROM measurement_expression[, ..., measurement_expression_n]
```

### `SELECT` clause

The `SELECT` clause supports several formats for identifying data to query.
It requires one or more **field expressions** and optional **tag expressions**.

- **field_expression**: Expression to identify one or more fields to return in query results.
  Can be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key),
  constant, [regular expression](/influxdb/cloud-dedicated/reference/influxql/regular-expressions/),
  [wildcard (`*`)](#wildcard-expressions-in-select-clauses), or
  [function](/influxdb/cloud-dedicated/reference/influxql/functions/).
- **tag_expression**: Expression to identify one or more tags to return in query results.
  Can be a [tag key](/influxdb/cloud-dedicated/reference/glossary/#tag-key) or constant.

{{% note %}}
#### Wildcard expression in a SELECT clause

A wildcard expression (`*`) without additional functions applied returns _all
fields and tags_.
InfluxQL functions applied to a wildcard expression return all _fields_ with
the function applied, but not _tags_.
To return specific tags when applying a function to a wildcard expression, include
the tag keys in your `SELECT` clause.
{{% /note %}}

- `SELECT field_key` - Returns a specific field.
- `SELECT field_key1, field_key2` - Returns two specific fields.
- `SELECT field_key, tag_key` - Returns a specific field and tag.
- `SELECT *` - Returns all [fields](/influxdb/cloud-dedicated/reference/glossary/#field)
  and [tags](/influxdb/cloud-dedicated/reference/glossary/#tag).
- `SELECT /^[t]/` - Returns all [fields](/influxdb/cloud-dedicated/reference/glossary/#field)
  and [tags](/influxdb/cloud-dedicated/reference/glossary/#tag) with keys that
  match the regular expression. At least one field key must match the regular
  expression. If no field keys match the regular expression, no results are
  returned.

### `FROM` clause

The `FROM` clause specifies the
[measurement](/influxdb/cloud-dedicated/reference/glossary/#measurement) to query.
It requires one or more **measurement expressions**.

- **measurement_expression**: Expression to identify one or more measurements to query.
  Can be a measurement name, fully-qualified measurement, constant, or
  [regular expression](/influxdb/cloud-dedicated/reference/influxql/regular-expressions/).

- `FROM <measurement_name>` - Returns data from a measurement.
- `FROM <measurement_name>,<measurement_name>` - Returns data from more than one measurement.
- `FROM <database_name>.<retention_policy_name>.<measurement_name>` - Returns data from a fully qualified measurement.
- `FROM <database_name>..<measurement_name>` - Returns data from a measurement.

#### Quoting

[Identifiers](/influxdb/v2.7/reference/syntax/influxql/spec/#identifiers) **must** be double quoted if they contain characters other than `[A-z,0-9,_]`,
begin with a digit, or are an [InfluxQL keyword](https://github.com/influxdata/influxql/blob/master/README.md#keywords).
While not always necessary, we recommend that you double quote identifiers.

{{% note %}}
**Note:** InfluxQL quoting guidelines differ from [line protocol quoting guidelines](/influxdb/v2.7/reference/syntax/line-protocol/#quotes).
Please review the [rules for single and double-quoting](/influxdb/v2.7/reference/syntax/line-protocol/#quotes) in queries.
{{% /note %}}

### Examples

{{< expand-wrapper >}}
{{% expand "Select all fields and tags from a measurement" %}}

```sql
SELECT * FROM "h2o_feet"
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

The data above is a partial listing of the query output, as the result set is quite large. The query selects all [fields](/influxdb/cloud-dedicated/reference/glossary/#field) and
[tags](/influxdb/cloud-dedicated/reference/glossary/#tag) from the `h2o_feet`
[measurement](/influxdb/cloud-dedicated/reference/glossary/#measurement).

{{% /expand %}}

{{% expand "Select specific tags and fields from a measurement" %}}

```sql
SELECT "level description","location","water_level" FROM "h2o_feet"
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

{{% expand "Select specific tags and fields from a measurement and provide their identifier type" %}}

```sql
SELECT "level description"::field,"location"::tag,"water_level"::field FROM "h2o_feet"
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
[identifier](/influxdb/v2.7/reference/syntax/influxql/spec/#identifiers) is a field or tag.
Use `::[field | tag]` to differentiate between [an identical field key and tag key ](/v2.4/reference/faq/#how-do-i-query-data-with-an-identical-tag-key-and-field-key).
That syntax is not required for most use cases.

{{% /expand %}}

{{% expand "Select all fields from a measurement" %}}

```sql
SELECT *::field FROM "h2o_feet"
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
SELECT ("water_level" * 2) + 4 FROM "h2o_feet"
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
See [InfluxQL mathematical operators](/influxdb/v2.7/query-data/influxql/math-operators/)
for more on supported operators.
{{% /note %}}

{{% /expand %}}

{{% expand "Select all data from more than one measurement" %}}

```sql
SELECT * FROM "h2o_feet","h2o_pH"
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
SELECT * FROM noaa.."h2o_feet"
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

The query selects data from the `h2o_feet` measurement in the `noaa` database.
The `..` indicates the `DEFAULT` retention policy for the specified database.

{{% /expand %}}

{{< /expand-wrapper >}}

## Notable behaviors

- [Must query at least one field](#must-query-at-least-one-field)
- [Cannot include both aggregate and non-aggregate field expressions](#cannot-include-both-aggregate-and-non-aggregate-field-expressions)

### Must query at least one field

A query requires at least one [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key)
in the `SELECT` clause to return data.
If the `SELECT` clause includes only [tag keys](/influxdb/cloud-dedicated/reference/glossary/#tag-key),
the query returns an empty result.
When using regular expressions in the `SELECT` clause, if regular expression
matches only tag keys and no field keys, the query returns an empty result.

To return data associated with tag keys, include at least one field key in the
`SELECT` clause.

### Cannot include both aggregate and non-aggregate field expressions

The `SELECT` statement cannot include an aggregate field expression
(one that uses an [aggregate](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates/)
or [selector](/influxdb/cloud-dedicated/reference/influxql/functions/aggregates/)
function) **and** a non-aggregate field expression.
For example, in the following query, an aggregate function is applied to one
field, but not the other:

```sql
SELECT mean(temp), hum FROM home
```

This query returns an error.
For more information, see [error about mixing aggregate and non-aggregate queries](/{{< latest "enterprise_influxdb" >}}/troubleshooting/errors/#error-parsing-query-mixing-aggregate-and-non-aggregate-queries-is-not-supported).

## Data types and cast operations

The [`SELECT` clause](#select-clause) supports specifying a [field's](/influxdb/cloud-dedicated/reference/glossary/#field) type and basic cast operations with the `::` syntax.

  - [Data types](#data-types)
  - [Cast operations](#cast-operations)

### Data types

[Field values](/influxdb/cloud-dedicated/reference/glossary/#field-value) can be floats, integers, strings, or booleans.
The `::` syntax allows users to specify the field's type in a query.

{{% note %}}
**Note:** Generally, it is not necessary to specify the field value type in the [`SELECT` clause](/influxdb/v2.7/query-data/influxql/explore-data/select/). In most cases, InfluxDB rejects any writes that attempt to write a [field value](/influxdb/cloud-dedicated/reference/glossary/#field-value) to a field that previously accepted field values of a different type.
{{% /note %}}

It is possible for field value types to differ across [shard groups](/influxdb/cloud-dedicated/reference/glossary/#shard-group).
In these cases, it may be necessary to specify the field value type in the
`SELECT` clause.
Please see the
[Frequently Asked Questions](/influxdb/v2.7/reference/faq/#how-does-influxdb-handle-field-type-discrepancies-across-shards)
document for more information on how InfluxDB handles field value type discrepancies.

### Syntax

```sql
SELECT_clause <field_key>::<type> FROM_clause
```

`type` can be `float`, `integer`, `string`, or `boolean`.
In most cases, InfluxDB returns no data if the `field_key` does not store data of the specified
`type`. See [Cast Operations](#cast-operations) for more information.

### Example

```sql
SELECT "water_level"::float FROM "h2o_feet" LIMIT 4
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
Currently, InfluxDB supports casting [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value) from integers to
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
SELECT "water_level"::integer FROM "h2o_feet" LIMIT 4
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

The query returns the integer form of `water_level`'s float [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value).

{{% /expand %}}

{{% expand "Cast float field values to strings (this functionality is not supported)" %}}

```sql
SELECT "water_level"::string FROM "h2o_feet" LIMIT 4
> No results
```

The query returns no data as casting a float field value to a string is not yet supported.

{{% /expand %}}

{{< /expand-wrapper >}}

## Merge behavior

InfluxQL merges [series](/influxdb/cloud-dedicated/reference/glossary/#series) automatically.

### Example

{{< expand-wrapper >}}

{{% expand "Merge behavior" %}}

The `h2o_feet` [measurement](/influxdb/cloud-dedicated/reference/glossary/#measurement) in the `noaa` is part of two [series](/influxdb/cloud-dedicated/reference/glossary/#series).
The first series is made up of the `h2o_feet` measurement and the `location = coyote_creek` [tag](/influxdb/cloud-dedicated/reference/glossary/#tag). The second series is made of up the `h2o_feet` measurement and the `location = santa_monica` tag.

The following query automatically merges those two series when it calculates the average `water_level` using the [MEAN() function](/influxdb/v2.7/query-data/influxql/functions/aggregates/#mean):

```sql
SELECT MEAN("water_level") FROM "h2o_feet"
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

|time | mean |
| :------------------ |-------------------:|
| 1970-01-01T00:00:00Z  | 4.4419314021 |

If you want the average `water_level` for the first series only, specify the relevant tag in the [`WHERE` clause](/influxdb/v2.7/query-data/influxql/explore-data/where/):

```sql
SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location" = 'coyote_creek'
```
Output:
{{% influxql/table-meta %}}
Name: h2o_feet
{{% /influxql/table-meta %}}

|time | mean |
| :------------------ |-------------------:|
| 1970-01-01T00:00:00Z | 5.3591424203 |

If you want the average `water_level` for each individual series, include a [`GROUP BY` clause](/influxdb/v2.7/query-data/influxql/explore-data/group-by/):

```sql
SELECT MEAN("water_level") FROM "h2o_feet" GROUP BY "location"
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

In the [InfluxQL shell](/influxdb/v2.7/tools/influxql-shell/):

```sql
SELECT MEAN("water_level") FROM "h2o_feet"; SELECT "water_level" FROM "h2o_feet" LIMIT 2
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

With the [InfluxDB API](/influxdb/v2.7/reference/api/influxdb-1x/):

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
