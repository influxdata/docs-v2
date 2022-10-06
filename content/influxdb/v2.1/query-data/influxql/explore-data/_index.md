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

{{< children readmore=true hr=true >}}

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

{{% note %}}
**Disclaimer:** The `level description` field isn't part of the original NOAA data - we snuck it in there for the sake of having a field key with a special character and string field values.
{{% /note %}}

### Configuring the returned timestamps

The [CLI](/enterprise_influxdb/v1.9/tools/influx-cli/use-influx/) returns timestamps in
nanosecond epoch format by default.
Specify alternative formats with the
[`precision <format>` command](/enterprise_influxdb/v1.9/tools/influx-cli/use-influx/#influx-commands).
The [InfluxDB API](/enterprise_influxdb/v1.9/tools/api/) returns timestamps
in [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) format by default.
Specify alternative formats with the
[`epoch` query string parameter](/enterprise_influxdb/v1.9/tools/api/#query-string-parameters).

## Data types and cast operations

The [`SELECT` clause](#the-basic-select-statement) supports specifying a [field's](/enterprise_influxdb/v1.9/concepts/glossary/#field) type and basic cast
operations with the `::` syntax.

- [Data Types](#data-types)
- [Cast Operations](#cast-operations)
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

