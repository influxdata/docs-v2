
Use the `SELECT` statement to query data from a particular [measurement](/influxdb/version/reference/glossary/#measurement) or measurements.

- [Syntax](#syntax)
- [Examples](#examples)
- [Common issues](#common-issues-with-the-select-statement)
- [Regular expressions](#regular-expressions)
- [Data types and cast operations](#data-types-and-cast-operations)
- [Merge behavior](#merge-behavior)
- [Multiple statements](#multiple-statements)

## Syntax

```sql
SELECT <field_key>[,<field_key>,<tag_key>] FROM <measurement_name>[,<measurement_name>]
```
{{% note %}}
**Note:** The `SELECT` statement **requires** a `SELECT` clause and a `FROM` clause.
{{% /note %}}

### `SELECT` clause

The `SELECT` clause supports several formats for specifying data:

- `SELECT *` - Returns all [fields](/influxdb/version/reference/glossary/#field) and [tags](/influxdb/version/reference/glossary/#tag).
- `SELECT "<field_key>"` - Returns a specific field.
- `SELECT "<field_key>","<field_key>"` - Returns more than one field.
- `SELECT "<field_key>","<tag_key>"` - Returns a specific field and tag. The `SELECT` clause must specify at least one field when it includes a tag.
- `SELECT "<field_key>"::field,"<tag_key>"::tag` - Returns a specific field and tag.
The `::[field | tag]` syntax specifies the [identifier's](/influxdb/version/reference/syntax/influxql/spec/#identifiers) type.
Use this syntax to differentiate between field keys and tag keys with the same name.

Other supported features include:

- [Functions](/influxdb/version/query-data/influxql/functions/)
- [Basic cast operations](#data-types-and-cast-operations)
- [Regular expressions](/influxdb/version/query-data/influxql/explore-data/regular-expressions/)

{{% note %}}
**Note:** The SELECT statement cannot include an aggregate function **and** a non-aggregate function, field key, or tag key. For more information, see [error about mixing aggregate and non-aggregate queries](/enterprise_influxdb/v1/troubleshooting/errors/#error-parsing-query-mixing-aggregate-and-non-aggregate-queries-is-not-supported).
{{% /note %}}

### `FROM` clause

The `SELECT` clause specifies the measurement to query.
This clause supports several formats for specifying a [measurement](/influxdb/version/reference/glossary/#measurement):

- `FROM <measurement_name>` - Returns data from a measurement.
- `FROM <measurement_name>,<measurement_name>` - Returns data from more than one measurement.
- `FROM <database_name>.<retention_policy_name>.<measurement_name>` - Returns data from a fully qualified measurement.
- `FROM <database_name>..<measurement_name>` - Returns data from a measurement.

#### Quoting

[Identifiers](/influxdb/version/reference/syntax/influxql/spec/#identifiers) **must** be double quoted if they contain characters other than `[A-z,0-9,_]`,
begin with a digit, or are an [InfluxQL keyword](https://github.com/influxdata/influxql/blob/master/README.md#keywords).
While not always necessary, we recommend that you double quote identifiers.

{{% note %}}
**Note:** InfluxQL quoting guidelines differ from [line protocol quoting guidelines](/influxdb/version/reference/syntax/line-protocol/#quotes).
Please review the [rules for single and double-quoting](/influxdb/version/reference/syntax/line-protocol/#quotes) in queries.
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

The data above is a partial listing of the query output, as the result set is quite large. The query selects all [fields](/influxdb/version/reference/glossary/#field) and
[tags](/influxdb/version/reference/glossary/#tag) from the `h2o_feet`
[measurement](/influxdb/version/reference/glossary/#measurement).

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
[identifier](/influxdb/version/reference/syntax/influxql/spec/#identifiers) is a field or tag.
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
See [InfluxQL mathematical operators](/influxdb/version/query-data/influxql/math-operators/)
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

## Common issues with the SELECT statement

### Selecting tag keys in the SELECT statement

A query requires at least one [field key](/influxdb/version/reference/glossary/#field-key)
in the `SELECT` clause to return data.
If the `SELECT` clause only includes a single [tag key](/influxdb/version/reference/glossary/#tag-key) or several tag keys, the
query returns an empty response.

#### Example

The following query returns no data because it specifies a single tag key (`location`) in
the `SELECT` clause:

```sql
SELECT "location" FROM "h2o_feet"
> No results
```
To return any data associated with the `location` tag key, the query's `SELECT`
clause must include at least one field key (`water_level`):

```sql
SELECT "water_level","location" FROM "h2o_feet"
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

InfluxQL supports using [regular expressions](/influxdb/version/query-data/influxql/explore-data/regular-expressions/) when specifying:
- [field keys](/influxdb/version/reference/glossary/#field-key) and [tag keys](/influxdb/version/reference/glossary/#tag-key) in the [`SELECT` clause](/influxdb/version/query-data/influxql/explore-data/select/)
- [measurements](/influxdb/version/reference/glossary/#measurement) in the [`FROM` clause](/influxdb/version/query-data/influxql/explore-data/select/#from-clause)
- [tag values](/influxdb/version/reference/glossary/#tag-value) and string [field values](/influxdb/version/reference/glossary/#field-value) in the [`WHERE` clause](/influxdb/version/query-data/influxql/explore-data/where/).
- [tag keys](/influxdb/version/reference/glossary/#tag-key) in the [`GROUP BY` clause](/influxdb/version/query-data/influxql/explore-data/group-by/)

## Syntax

```sql
SELECT /<regular_expression_field_key>/ FROM /<regular_expression_measurement>/ WHERE [<tag_key> <operator> /<regular_expression_tag_value>/ | <field_key> <operator> /<regular_expression_field_value>/] GROUP BY /<regular_expression_tag_key>/
```

See [regular expressions](/influxdb/version/query-data/influxql/explore-data/regular-expressions/) for more information.

## Data types and cast operations

The [`SELECT` clause](#select-clause) supports specifying a [field's](/influxdb/version/reference/glossary/#field) type and basic cast operations with the `::` syntax.

  - [Data types](#data-types)
  - [Cast operations](#cast-operations)

### Data types

[Field values](/influxdb/version/reference/glossary/#field-value) can be floats, integers, strings, or booleans.
The `::` syntax allows users to specify the field's type in a query.

{{% note %}}
**Note:** Generally, it is not necessary to specify the field value type in the [`SELECT` clause](/influxdb/version/query-data/influxql/explore-data/select/). In most cases, InfluxDB rejects any writes that attempt to write a [field value](/influxdb/version/reference/glossary/#field-value) to a field that previously accepted field values of a different type.
{{% /note %}}

It is possible for field value types to differ across [shard groups](/influxdb/version/reference/glossary/#shard-group).
In these cases, it may be necessary to specify the field value type in the
`SELECT` clause.
Please see the
[Frequently Asked Questions](/influxdb/version/reference/faq/#how-does-influxdb-handle-field-type-discrepancies-across-shards)
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
Currently, InfluxDB supports casting [field values](/influxdb/version/reference/glossary/#field-value) from integers to
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

The query returns the integer form of `water_level`'s float [field values](/influxdb/version/reference/glossary/#field-value).

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

InfluxQL merges [series](/influxdb/version/reference/glossary/#series) automatically.

### Example

{{< expand-wrapper >}}

{{% expand "Merge behavior" %}}

The `h2o_feet` [measurement](/influxdb/version/reference/glossary/#measurement) in the `noaa` is part of two [series](/influxdb/version/reference/glossary/#series).
The first series is made up of the `h2o_feet` measurement and the `location = coyote_creek` [tag](/influxdb/version/reference/glossary/#tag). The second series is made of up the `h2o_feet` measurement and the `location = santa_monica` tag.

The following query automatically merges those two series when it calculates the average `water_level` using the [MEAN() function](/influxdb/version/query-data/influxql/functions/aggregates/#mean):

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

If you want the average `water_level` for the first series only, specify the relevant tag in the [`WHERE` clause](/influxdb/version/query-data/influxql/explore-data/where/):

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

If you want the average `water_level` for each individual series, include a [`GROUP BY` clause](/influxdb/version/query-data/influxql/explore-data/group-by/):

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

In the [InfluxQL shell](/influxdb/version/tools/influxql-shell/):

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

With the [InfluxDB API](/influxdb/version/reference/api/influxdb-1x/):

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
