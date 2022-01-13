---
title: Use the SELECT statement
list_title: SELECT statement
description: >
  ...
menu:
  influxdb_2_1:
    name: SELECT statement
    parent: Explore data
weight: 301
---
## The basic SELECT statement

The `SELECT` statement queries data from a particular [measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement) or measurements.

### Syntax

```sql
SELECT <field_key>[,<field_key>,<tag_key>] FROM <measurement_name>[,<measurement_name>]
```

The `SELECT` statement requires a `SELECT` clause and a `FROM` clause.

#### `SELECT` clause

The `SELECT` clause supports several formats for specifying data:

`SELECT *`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns all [fields](/enterprise_influxdb/v1.9/concepts/glossary/#field) and [tags](/enterprise_influxdb/v1.9/concepts/glossary/#tag).

`SELECT "<field_key>"`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns a specific field.

`SELECT "<field_key>","<field_key>"`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns more than one field.

`SELECT "<field_key>","<tag_key>"`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns a specific field and tag.
The `SELECT` clause must specify at least one field when it includes a tag.

`SELECT "<field_key>"::field,"<tag_key>"::tag`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Returns a specific field and tag.
The `::[field | tag]` syntax specifies the [identifier's](/enterprise_influxdb/v1.9/concepts/glossary/#identifier) type.
Use this syntax to differentiate between field keys and tag keys that have the same name.

Other supported features:
[Arithmetic operations](/enterprise_influxdb/v1.9/query_language/math_operators/),
[Functions](/enterprise_influxdb/v1.9/query_language/functions/),
[Basic cast operations](#data-types-and-cast-operations),
[Regular expressions](#regular-expressions)

> **Note:** The SELECT statement cannot include an aggregate function **and** a non-aggregate function, field key, or tag key. For more information, see [error about mixing aggregate and non-aggregate queries](/enterprise_influxdb/v1.9/troubleshooting/errors/#error-parsing-query-mixing-aggregate-and-non-aggregate-queries-is-not-supported).

#### `FROM` clause

The `FROM` clause supports several formats for specifying a [measurement(s)](/enterprise_influxdb/v1.9/concepts/glossary/#measurement):

`FROM <measurement_name>`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Returns data from a single measurement.
If you're using the [CLI](/enterprise_influxdb/v1.9/tools/influx-cli/use-influx/) InfluxDB queries the measurement in the
[`USE`d](/enterprise_influxdb/v1.9/tools/influx-cli/use-influx/#commands)
[database](/enterprise_influxdb/v1.9/concepts/glossary/#database) and the `DEFAULT` [retention policy](/enterprise_influxdb/v1.9/concepts/glossary/#retention-policy-rp).
If you're using the [InfluxDB API](/enterprise_influxdb/v1.9/tools/api/) InfluxDB queries the
measurement in the database specified in the [`db` query string parameter](/enterprise_influxdb/v1.9/tools/api/#query-string-parameters)
and the `DEFAULT` retention policy.

`FROM <measurement_name>,<measurement_name>`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Returns data from more than one measurement.

`FROM <database_name>.<retention_policy_name>.<measurement_name>`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Returns data from a fully qualified measurement.
Fully qualify a measurement by specifying its database and retention policy.

`FROM <database_name>..<measurement_name>`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Returns data from a measurement in a user-specified [database](/enterprise_influxdb/v1.9/concepts/glossary/#database) and the `DEFAULT`
[retention policy](/enterprise_influxdb/v1.9/concepts/glossary/#retention-policy-rp).

Other supported features:
[Regular Expressions](#regular-expressions)

#### Quoting

[Identifiers](/enterprise_influxdb/v1.9/concepts/glossary/#identifier) **must** be double quoted if they contain characters other than `[A-z,0-9,_]`, if they
begin with a digit, or if they are an [InfluxQL keyword](https://github.com/influxdata/influxql/blob/master/README.md#keywords).
While not always necessary, we recommend that you double quote identifiers.

> **Note:** The quoting syntax for queries differs from the [line protocol](/enterprise_influxdb/v1.9/concepts/glossary/#influxdb-line-protocol).
Please review the [rules for single and double-quoting](/enterprise_influxdb/v1.9/troubleshooting/frequently-asked-questions/#when-should-i-single-quote-and-when-should-i-double-quote-in-queries) in queries.

### Examples

#### Select all fields and tags from a single measurement

```sql
> SELECT * FROM "h2o_feet"

name: h2o_feet
--------------
time                   level description      location       water_level
2015-08-18T00:00:00Z   below 3 feet           santa_monica   2.064
2015-08-18T00:00:00Z   between 6 and 9 feet   coyote_creek   8.12
[...]
2015-09-18T21:36:00Z   between 3 and 6 feet   santa_monica   5.066
2015-09-18T21:42:00Z   between 3 and 6 feet   santa_monica   4.938
```

The query selects all [fields](/enterprise_influxdb/v1.9/concepts/glossary/#field) and
[tags](/enterprise_influxdb/v1.9/concepts/glossary/#tag) from the `h2o_feet`
[measurement](/enterprise_influxdb/v1.9/concepts/glossary/#measurement).

If you're using the [CLI](/enterprise_influxdb/v1.9/tools/influx-cli/use-influx/) be sure to enter
`USE NOAA_water_database` before you run the query.
The CLI queries the data in the `USE`d database and the
`DEFAULT` [retention policy](/enterprise_influxdb/v1.9/concepts/glossary/#retention-policy-rp).
If you're using the [InfluxDB API](/enterprise_influxdb/v1.9/tools/api/) be sure to set the
`db` [query string parameter](/enterprise_influxdb/v1.9/tools/api/#query-string-parameters)
to `NOAA_water_database`.
If you do not set the `rp` query string parameter, the InfluxDB API automatically
queries the database's `DEFAULT` retention policy.

#### Select specific tags and fields from a single measurement

```sql
> SELECT "level description","location","water_level" FROM "h2o_feet"

name: h2o_feet
--------------
time                   level description      location       water_level
2015-08-18T00:00:00Z   below 3 feet           santa_monica   2.064
2015-08-18T00:00:00Z   between 6 and 9 feet   coyote_creek   8.12
[...]
2015-09-18T21:36:00Z   between 3 and 6 feet   santa_monica   5.066
2015-09-18T21:42:00Z   between 3 and 6 feet   santa_monica   4.938
```

The query selects the `level description` field, the `location` tag, and the
`water_level` field.
Note that the `SELECT` clause must specify at least one field when it includes
a tag.

#### Select specific tags and fields from a single measurement, and provide their identifier type

```sql
> SELECT "level description"::field,"location"::tag,"water_level"::field FROM "h2o_feet"

name: h2o_feet
--------------
time                   level description      location       water_level
2015-08-18T00:00:00Z   below 3 feet           santa_monica   2.064
2015-08-18T00:00:00Z   between 6 and 9 feet   coyote_creek   8.12
[...]
2015-09-18T21:36:00Z   between 3 and 6 feet   santa_monica   5.066
2015-09-18T21:42:00Z   between 3 and 6 feet   santa_monica   4.938
```

The query selects the `level description` field, the `location` tag, and the
`water_level` field from the `h2o_feet` measurement.
The `::[field | tag]` syntax specifies if the
[identifier](/enterprise_influxdb/v1.9/concepts/glossary/#identifier) is a field or tag.
Use `::[field | tag]` to differentiate between [an identical field key and tag key ](/enterprise_influxdb/v1.9/troubleshooting/frequently-asked-questions/#how-do-i-query-data-with-an-identical-tag-key-and-field-key).
That syntax is not required for most use cases.

#### Select all fields from a single measurement

```sql
> SELECT *::field FROM "h2o_feet"

name: h2o_feet
--------------
time                   level description      water_level
2015-08-18T00:00:00Z   below 3 feet           2.064
2015-08-18T00:00:00Z   between 6 and 9 feet   8.12
[...]
2015-09-18T21:36:00Z   between 3 and 6 feet   5.066
2015-09-18T21:42:00Z   between 3 and 6 feet   4.938
```

The query selects all fields from the `h2o_feet` measurement.
The `SELECT` clause supports combining the `*` syntax with the `::` syntax.

#### Select a specific field from a measurement and perform basic arithmetic

```sql
> SELECT ("water_level" * 2) + 4 FROM "h2o_feet"

name: h2o_feet
--------------
time                   water_level
2015-08-18T00:00:00Z   20.24
2015-08-18T00:00:00Z   8.128
[...]
2015-09-18T21:36:00Z   14.132
2015-09-18T21:42:00Z   13.876
```

The query multiplies `water_level`'s field values by two and adds four to those
values.
Note that InfluxDB follows the standard order of operations.
See [Mathematical Operators](/enterprise_influxdb/v1.9/query_language/math_operators/)
for more on supported operators.

#### Select all data from more than one measurement

```sql
> SELECT * FROM "h2o_feet","h2o_pH"

name: h2o_feet
--------------
time                   level description      location       pH   water_level
2015-08-18T00:00:00Z   below 3 feet           santa_monica        2.064
2015-08-18T00:00:00Z   between 6 and 9 feet   coyote_creek        8.12
[...]
2015-09-18T21:36:00Z   between 3 and 6 feet   santa_monica        5.066
2015-09-18T21:42:00Z   between 3 and 6 feet   santa_monica        4.938

name: h2o_pH
------------
time                   level description   location       pH   water_level
2015-08-18T00:00:00Z                       santa_monica   6
2015-08-18T00:00:00Z                       coyote_creek   7
[...]
2015-09-18T21:36:00Z                       santa_monica   8
2015-09-18T21:42:00Z                       santa_monica   7
```

The query selects all fields and tags from two measurements: `h2o_feet` and
`h2o_pH`.
Separate multiple measurements with a comma (`,`).

#### Select all data from a fully qualified measurement

```sql
> SELECT * FROM "NOAA_water_database"."autogen"."h2o_feet"

name: h2o_feet
--------------
time                   level description      location       water_level
2015-08-18T00:00:00Z   below 3 feet           santa_monica   2.064
2015-08-18T00:00:00Z   between 6 and 9 feet   coyote_creek   8.12
[...]
2015-09-18T21:36:00Z   between 3 and 6 feet   santa_monica   5.066
2015-09-18T21:42:00Z   between 3 and 6 feet   santa_monica   4.938
```

The query selects data in the `NOAA_water_database`, the `autogen` retention
policy, and the measurement `h2o_feet`.

In the CLI, fully qualify a measurement to query data in a database other
than the `USE`d database and in a retention policy other than the
`DEFAULT` retention policy.
In the InfluxDB API, fully qualify a measurement in place of using the `db`
and `rp` query string parameters if desired.

#### Select all data from a measurement in a particular database

```sql
> SELECT * FROM "NOAA_water_database".."h2o_feet"

name: h2o_feet
--------------
time                   level description      location       water_level
2015-08-18T00:00:00Z   below 3 feet           santa_monica   2.064
2015-08-18T00:00:00Z   between 6 and 9 feet   coyote_creek   8.12
[...]
2015-09-18T21:36:00Z   between 3 and 6 feet   santa_monica   5.066
2015-09-18T21:42:00Z   between 3 and 6 feet   santa_monica   4.938
```

The query selects data in the `NOAA_water_database`, the `DEFAULT` retention
policy, and the `h2o_feet` measurement.
The `..` indicates the `DEFAULT` retention policy for the specified database.

In the CLI, specify the database to query data in a database other than the
`USE`d database.
In the InfluxDB API, specify the database in place of using the `db` query
string parameter if desired.

### Common issues with the SELECT statement

#### Selecting tag keys in the SELECT clause

A query requires at least one [field key](/enterprise_influxdb/v1.9/concepts/glossary/#field-key)
in the `SELECT` clause to return data.
If the `SELECT` clause only includes a single [tag key](/enterprise_influxdb/v1.9/concepts/glossary/#tag-key) or several tag keys, the
query returns an empty response.
This behavior is a result of how the system stores data.

##### Example

The following query returns no data because it specifies a single tag key (`location`) in
the `SELECT` clause:

```sql
> SELECT "location" FROM "h2o_feet"
>
```

To return any data associated with the `location` tag key, the query's `SELECT`
clause must include at least one field key (`water_level`):

```sql
> SELECT "water_level","location" FROM "h2o_feet"
name: h2o_feet
time                   water_level  location
----                   -----------  --------
2015-08-18T00:00:00Z   8.12         coyote_creek
2015-08-18T00:00:00Z   2.064        santa_monica
[...]
2015-09-18T21:36:00Z   5.066        santa_monica
2015-09-18T21:42:00Z   4.938        santa_monica
```
