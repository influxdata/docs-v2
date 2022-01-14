---
title: Explore data using InfluxQL
description: >
  Explore time series data using InfluxData's SQL-like query language. Understand how to use the SELECT statement to query data from measurements, tags, and fields.
menu:
  influxdb_2_1:
    name: Explore data
    parent: Query with InfluxQL
weight: 202
---

InfluxQL is an SQL-like query language for interacting with data in InfluxDB.
The following sections detail InfluxQL's `SELECT` statement, as well as other key clauses, and useful query syntax
for exploring your data.

{{< children >}}

### Sample data

This document uses publicly available data from the
[National Oceanic and Atmospheric Administration's (NOAA) Center for Operational Oceanographic Products and Services](http://tidesandcurrents.noaa.gov/stations.html?type=Water+Levels).
See the [Sample Data](influxdb/v2.1/reference/sample-data/#noaa-sample-data) page to download
the data and follow along with the example queries in the sections below.

Let's get acquainted with this subsample of the data in the `h2o_feet` measurement:

name: <span class="tooltip" data-tooltip-text="Measurement">h2o_feet</span>

| time                                                                            | <span class ="tooltip" data-tooltip-text ="Field Key">level description</span>      | <span class ="tooltip" data-tooltip-text ="Tag Key">location</span>       | <span class ="tooltip" data-tooltip-text ="Field Key">water_level</span> |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 2015-08-18T00:00:00Z                                                            | between 6 and 9 feet                                                                | coyote_creek                                                              | 8.12                                                                     |
| 2015-08-18T00:00:00Z                                                            | below 3 feet                                                                        | santa_monica                                                              | 2.064                                                                    |
| <span class="tooltip" data-tooltip-text="Timestamp">2015-08-18T00:06:00Z</span> | <span class ="tooltip" data-tooltip-text ="Field Value">between 6 and 9 feet</span> | <span class ="tooltip" data-tooltip-text ="Tag Value">coyote_creek</span> | <span class ="tooltip" data-tooltip-text ="Field Value">8.005</span>     |
| 2015-08-18T00:06:00Z                                                            | below 3 feet                                                                        | santa_monica                                                              | 2.116                                                                    |
| 2015-08-18T00:12:00Z                                                            | between 6 and 9 feet                                                                | coyote_creek                                                              | 7.887                                                                    |
| 2015-08-18T00:12:00Z                                                            | below 3 feet                                                                        | santa_monica                                                              | 2.028                                                                    |

The data in the `h2o_feet` [measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement)
occur at six-minute time intervals.
The measurement has one [tag key](/enterprise_influxdb/v1.9/concepts/glossary/#tag-key)
(`location`) which has two [tag values](/enterprise_influxdb/v1.9/concepts/glossary/#tag-value):
`coyote_creek` and `santa_monica`.
The measurement also has two [fields](/enterprise_influxdb/v1.9/concepts/glossary/#field):
`level description` stores string [field values](/enterprise_influxdb/v1.9/concepts/glossary/#field-value)
and `water_level` stores float field values.
All of these data is in the `NOAA_water_database` [database](/enterprise_influxdb/v1.9/concepts/glossary/#database).

> **Disclaimer:** The `level description` field isn't part of the original NOAA data - we snuck it in there for the sake of having a field key with a special character and string field values.


### Configuring the returned timestamps

The [CLI](/enterprise_influxdb/v1.9/tools/influx-cli/use-influx/) returns timestamps in
nanosecond epoch format by default.
Specify alternative formats with the
[`precision <format>` command](/enterprise_influxdb/v1.9/tools/influx-cli/use-influx/#influx-commands).
The [InfluxDB API](/enterprise_influxdb/v1.9/tools/api/) returns timestamps
in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) format by default.
Specify alternative formats with the
[`epoch` query string parameter](/enterprise_influxdb/v1.9/tools/api/#query-string-parameters).

## Regular expressions

InfluxQL supports using regular expressions when specifying:

* [field keys](/enterprise_influxdb/v1.9/concepts/glossary/#field-key) and [tag keys](/enterprise_influxdb/v1.9/concepts/glossary/#tag-key) in the [`SELECT` clause](#the-basic-select-statement)
* [measurements](/enterprise_influxdb/v1.9/concepts/glossary/#measurement) in the [`FROM` clause](#the-basic-select-statement)
* [tag values](/enterprise_influxdb/v1.9/concepts/glossary/#tag-value) and string [field values](/enterprise_influxdb/v1.9/concepts/glossary/#field-value) in the [`WHERE` clause](#the-where-clause).
* [tag keys](/enterprise_influxdb/v1.9/concepts/glossary/#tag-key) in the [`GROUP BY` clause](#group-by-tags)

Currently, InfluxQL does not support using regular expressions to match
non-string field values in the
`WHERE` clause,
[databases](/enterprise_influxdb/v1.9/concepts/glossary/#database), and
[retention polices](/enterprise_influxdb/v1.9/concepts/glossary/#retention-policy-rp).

> **Note:** Regular expression comparisons are more computationally intensive than exact
string comparisons; queries with regular expressions are not as performant
as those without.

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

#### Use a regular expression to specify field keys and tag keys in the SELECT clause

```sql
> SELECT /l/ FROM "h2o_feet" LIMIT 1

name: h2o_feet
time                   level description      location       water_level
----                   -----------------      --------       -----------
2015-08-18T00:00:00Z   between 6 and 9 feet   coyote_creek   8.12
```

The query selects all [field keys](/enterprise_influxdb/v1.9/concepts/glossary/#field-key)
and [tag keys](/enterprise_influxdb/v1.9/concepts/glossary/#tag-key) that include an `l`.
Note that the regular expression in the `SELECT` clause must match at least one
field key in order to return results for a tag key that matches the regular
expression.

Currently, there is no syntax to distinguish between regular expressions for
field keys and regular expressions for tag keys in the `SELECT` clause.
The syntax `/<regular_expression>/::[field | tag]` is not supported.

#### Use a regular expression to specify measurements in the FROM clause

```sql
> SELECT MEAN("degrees") FROM /temperature/

name: average_temperature
time			mean
----			----
1970-01-01T00:00:00Z   79.98472932232272

name: h2o_temperature
time			mean
----			----
1970-01-01T00:00:00Z   64.98872722506226
```

The query uses an InfluxQL [function](/enterprise_influxdb/v1.9/query_language/functions/)
to calculate the average `degrees` for every [measurement](/enterprise_influxdb/v1.9/concepts/glossary#measurement) in the `NOAA_water_database`
[database](/enterprise_influxdb/v1.9/concepts/glossary#database) that contains the word `temperature`.

#### Use a regular expression to specify tag values in the WHERE clause

```sql
> SELECT MEAN(water_level) FROM "h2o_feet" WHERE "location" =~ /[m]/ AND "water_level" > 3

name: h2o_feet
time                   mean
----                   ----
1970-01-01T00:00:00Z   4.47155532049926
```

The query uses an InfluxQL [function](/enterprise_influxdb/v1.9/query_language/functions/)
to calculate the average `water_level` where the [tag value](/enterprise_influxdb/v1.9/concepts/glossary#tag-value) of `location`
includes an `m` and `water_level` is greater than three.

#### Use a regular expression to specify a tag with no value in the WHERE clause

```sql
> SELECT * FROM "h2o_feet" WHERE "location" !~ /./
>
```

The query selects all data from the `h2o_feet` measurement where the `location`
[tag](/enterprise_influxdb/v1.9/concepts/glossary#tag) has no value.
Every data [point](/enterprise_influxdb/v1.9/concepts/glossary#point) in the `NOAA_water_database` has a tag value for `location`.

It's possible to perform this same query without a regular expression.
See the
[Frequently Asked Questions](/enterprise_influxdb/v1.9/troubleshooting/frequently-asked-questions/#how-do-i-select-data-with-a-tag-that-has-no-value)
document for more information.

#### Use a regular expression to specify a tag with a value in the WHERE clause

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location" =~ /./

name: h2o_feet
time                   mean
----                   ----
1970-01-01T00:00:00Z   4.442107025822523
```

The query uses an InfluxQL [function](/enterprise_influxdb/v1.9/query_language/functions/)
to calculate the average `water_level` across all data that have a tag value for
`location`.

#### Use a regular expression to specify a field value in the WHERE clause

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND "level description" =~ /between/

name: h2o_feet
time                   mean
----                   ----
1970-01-01T00:00:00Z   4.47155532049926
```

The query uses an InfluxQL [function](/enterprise_influxdb/v1.9/query_language/functions/)
to calculate the average `water_level` for all data where the field value of
`level description` includes the word `between`.

#### Use a regular expression to specify tag keys in the GROUP BY clause

```sql
> SELECT FIRST("index") FROM "h2o_quality" GROUP BY /l/

name: h2o_quality
tags: location=coyote_creek
time                   first
----                   -----
2015-08-18T00:00:00Z   41

name: h2o_quality
tags: location=santa_monica
time                   first
----                   -----
2015-08-18T00:00:00Z   99
```

The query uses an InfluxQL [function](/enterprise_influxdb/v1.9/query_language/functions/)
to select the first value of `index` for every tag that includes the letter `l`
in its tag key.

## Data types and cast operations

The [`SELECT` clause](#the-basic-select-statement) supports specifying a [field's](/enterprise_influxdb/v1.9/concepts/glossary/#field) type and basic cast
operations with the `::` syntax.

<table style="width:100%">
  <tr>
    <td><a href="#data-types">Data Types</a></td>
    <td><a href="#cast-operations">Cast Operations</a></td>
  </tr>
</table>

## Data types

[Field values](/enterprise_influxdb/v1.9/concepts/glossary/#field-value) can be floats, integers, strings, or booleans.
The `::` syntax allows users to specify the field's type in a query.

> **Note:**  Generally, it is not necessary to specify the field value
type in the [`SELECT` clause](#the-basic-select-statement).
In most cases, InfluxDB rejects any writes that attempt to write a [field value](/enterprise_influxdb/v1.9/concepts/glossary/#field-value)
to a field that previously accepted field values of a different type.
>
It is possible for field value types to differ across [shard groups](/enterprise_influxdb/v1.9/concepts/glossary/#shard-group).
In these cases, it may be necessary to specify the field value type in the
`SELECT` clause.
Please see the
[Frequently Asked Questions](/enterprise_influxdb/v1.9/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-field-type-discrepancies-across-shards)
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
> SELECT "water_level"::float FROM "h2o_feet" LIMIT 4

name: h2o_feet
--------------
time                   water_level
2015-08-18T00:00:00Z   8.12
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   8.005
2015-08-18T00:06:00Z   2.116
```

The query returns values of the `water_level` field key that are floats.

## Cast operations

The `::` syntax allows users to perform basic cast operations in queries.
Currently, InfluxDB supports casting [field values](/enterprise_influxdb/v1.9/concepts/glossary/#field-value) from integers to
floats or from floats to integers.

### Syntax

```sql
SELECT_clause <field_key>::<type> FROM_clause
```

`type` can be `float` or `integer`.

InfluxDB returns no data if the query attempts to cast an integer or float to a
string or boolean.

### Examples

#### Cast float field values to integers

```sql
> SELECT "water_level"::integer FROM "h2o_feet" LIMIT 4

name: h2o_feet
--------------
time                   water_level
2015-08-18T00:00:00Z   8
2015-08-18T00:00:00Z   2
2015-08-18T00:06:00Z   8
2015-08-18T00:06:00Z   2
```

The query returns the integer form of `water_level`'s float [field values](/enterprise_influxdb/v1.9/concepts/glossary/#field-value).

#### Cast float field values to strings (this functionality is not supported)

```sql
> SELECT "water_level"::string FROM "h2o_feet" LIMIT 4
>
```

The query returns no data as casting a float field value to a string is not
yet supported.

## Merge behavior

In InfluxDB, queries merge [series](/enterprise_influxdb/v1.9/concepts/glossary/#series)
automatically.

### Example

The `h2o_feet` [measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement) in the `NOAA_water_database` is part of two [series](/enterprise_influxdb/v1.9/concepts/glossary/#series).
The first series is made up of the `h2o_feet` measurement and the `location = coyote_creek` [tag](/enterprise_influxdb/v1.9/concepts/glossary/#tag).
The second series is made of up the `h2o_feet` measurement and the `location = santa_monica` tag.

The following query automatically merges those two series when it calculates the [average](/enterprise_influxdb/v1.9/query_language/functions/#mean) `water_level`:

```sql
> SELECT MEAN("water_level") FROM "h2o_feet"

name: h2o_feet
--------------
time                   mean
1970-01-01T00:00:00Z   4.442107025822521
```

If you want the average `water_level` for the first series only, specify the relevant tag in the [`WHERE` clause](#the-where-clause):

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" WHERE "location" = 'coyote_creek'

name: h2o_feet
--------------
time                   mean
1970-01-01T00:00:00Z   5.359342451341401
```

If you want the average `water_level` for each individual series, include a [`GROUP BY` clause](#group-by-tags):

```sql
> SELECT MEAN("water_level") FROM "h2o_feet" GROUP BY "location"

name: h2o_feet
tags: location=coyote_creek
time                   mean
----                   ----
1970-01-01T00:00:00Z   5.359342451341401

name: h2o_feet
tags: location=santa_monica
time                   mean
----                   ----
1970-01-01T00:00:00Z   3.530863470081006
```

## Multiple statements

Separate multiple [`SELECT` statements](#the-basic-select-statement) in a query with a semicolon (`;`).

### Examples

{{< tabs-wrapper >}}
{{% tabs %}}
[Example 1: CLI](#)
[Example 2: InfluxDB API](#)
{{% /tabs %}}

{{% tab-content %}}

In the InfluxDB [CLI](/enterprise_influxdb/v1.9/tools/influx-cli/use-influx/):

```sql
> SELECT MEAN("water_level") FROM "h2o_feet"; SELECT "water_level" FROM "h2o_feet" LIMIT 2

name: h2o_feet
time                   mean
----                   ----
1970-01-01T00:00:00Z   4.442107025822522

name: h2o_feet
time                   water_level
----                   -----------
2015-08-18T00:00:00Z   8.12
2015-08-18T00:00:00Z   2.064
```

{{% /tab-content %}}

{{% tab-content %}}

With the [InfluxDB API](/enterprise_influxdb/v1.9/tools/api/):

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

