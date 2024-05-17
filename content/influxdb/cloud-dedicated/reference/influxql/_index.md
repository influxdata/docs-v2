---
title: InfluxQL reference documentation
list_title: InfluxQL
description: InfluxQL is an SQL-like query language for interacting with data in InfluxDB.
menu:
  influxdb_cloud_dedicated:
    parent: Reference
    name: InfluxQL reference
    identifier: influxql-reference
weight: 102
---

InfluxQL (Influx Query Language) is an SQL-like query language used to interact
with InfluxDB and work with times series data.

{{% warn %}}
#### InfluxQL feature support

InfluxQL is being rearchitected to work with the InfluxDB 3.0 storage engine.
This process is ongoing and some InfluxQL features are still being implemented.
For information about the current implementation status of InfluxQL features,
see [InfluxQL feature support](/influxdb/cloud-dedicated/reference/influxql/feature-support/).
{{% /warn %}}

- [Notation](#notation)
- [Query representation](#query-representation)
  - [Characters](#characters)
  - [Letters and digits](#letters-and-digits)
  - [Identifiers](#identifiers)
  - [Keywords](#keywords)
  - [Literals](#literals)
- [Queries](#queries)
- [Statements](#statements)
- [Clauses](#clauses)
- [Expressions](#expressions)
- [Comments](#comments)
- [Other](#other)
- [Result set](#result-set)

<!-- To learn more about InfluxQL, browse the following topics:

- [Explore your data with InfluxQL](/influxdb/v2/query-data/influxql/explore-data/)
- [Explore your schema with InfluxQL](/influxdb/v2/query-data/influxql/explore-schema/)
- [Database management](/influxdb/v2/query-data/influxql/manage-database/)
- [Query engine internals](/influxdb/cloud-dedicated/reference/influxql/internals/) -->

## Notation

The syntax is specified using Extended Backus-Naur Form ("EBNF").
EBNF is the same notation used in the [Go programming language specification](https://golang.org/ref/spec).

```go
Production  = production_name "=" [ Expression ] "." .
Expression  = Alternative { "|" Alternative } .
Alternative = Term { Term } .
Term        = production_name | token [ "…" token ] | Group | Option | Repetition .
Group       = "(" Expression ")" .
Option      = "[" Expression "]" .
Repetition  = "{" Expression "}" .
```

Notation operators in order of increasing precedence:

```
|   alternation
()  grouping
[]  option (0 or 1 times)
{}  repetition (0 to n times)
```

## Query representation

### Characters

InfluxQL is Unicode text encoded in [UTF-8](http://en.wikipedia.org/wiki/UTF-8).

```
newline             = /* the Unicode code point U+000A */ .
unicode_char        = /* an arbitrary Unicode code point except newline */ .
```

### Letters and digits

Letters are the set of ASCII letters and the underscore (`_`, U+005F).

Only decimal digits are supported.

```
letter              = ascii_letter | "_" .
ascii_letter        = "A" … "Z" | "a" … "z" .
digit               = "0" … "9" .
```

### Identifiers

Identifiers are tokens that refer to
[database](/influxdb/cloud-dedicated/reference/glossary/#database) names,
[retention policy](/influxdb/cloud-dedicated/reference/glossary/#retention-policy-rp) names,
[measurement](/influxdb/cloud-dedicated/reference/glossary/#measurement) names,
[tag keys](/influxdb/cloud-dedicated/reference/glossary/#tag-key), and
[field keys](/influxdb/cloud-dedicated/reference/glossary/#field-key).

The rules are as follows:

- Double-quoted identifiers can contain any Unicode character except for a new line.
- Double-quoted identifiers can also contain escaped `"` characters (that is,  `\"`)
- Double-quoted identifiers can include InfluxQL [keywords](#keywords).
- Unquoted identifiers must start with an upper or lowercase ASCII character or "_".
- Unquoted identifiers may contain only ASCII letters, decimal digits, and "_".

```
identifier          = unquoted_identifier | quoted_identifier .
unquoted_identifier = ( letter ) { letter | digit } .
quoted_identifier   = `"` unicode_char { unicode_char } `"` .
```

#### Examples

```
cpu
_cpu_stats
"1h"
"anything really"
"1_Crazy-1337.identifier>NAME👍"
```

### Keywords

```
ALL           ALTER         ANY           AS            ASC           BEGIN
BY            CREATE        CONTINUOUS    DATABASE      DATABASES     DEFAULT
DELETE        DESC          DESTINATIONS  DIAGNOSTICS   DISTINCT      DROP
DURATION      END           EVERY         EXPLAIN       FIELD         FOR
FROM          GRANT         GRANTS        GROUP         GROUPS        IN
INF           INSERT        INTO          KEY           KEYS          KILL
LIMIT         SHOW          MEASUREMENT   MEASUREMENTS  NAME          OFFSET
ON            ORDER         PASSWORD      POLICY        POLICIES      PRIVILEGES
QUERIES       QUERY         READ          REPLICATION   RESAMPLE      RETENTION
REVOKE        SELECT        SERIES        SET           SHARD         SHARDS
SLIMIT        SOFFSET       STATS         SUBSCRIPTION  SUBSCRIPTIONS TAG
TO            USER          USERS         VALUES        WHERE         WITH
WRITE
```

If you use an InfluxQL keyword as an
[identifier](/influxdb/cloud-dedicated/reference/glossary/#identifier),
double-quote the identifier in every query.

The `time` keyword is a special case.
`time` can be a
database name,
[measurement](/influxdb/cloud-dedicated/reference/glossary/#measurement) name,
[retention policy](/influxdb/cloud-dedicated/reference/glossary/#retention-policy-rp) name, and
[user](/influxdb/cloud-dedicated/reference/glossary/#user) name.

In those cases, you don't need to double-quote `time`  in queries.

`time` can't be a [field key](/influxdb/cloud-dedicated/reference/glossary/#field-key) or
[tag key](/influxdb/cloud-dedicated/reference/glossary/#tag-key);
InfluxDB rejects writes with `time` as a field key or tag key and returns an error.
<!--
See [Frequently Asked Questions](/influxdb/v2/reference/faq/) for more information.
-->

### Literals

#### Integers

InfluxQL supports decimal integer literals.
Hexadecimal and octal literals aren't currently supported.

```
int_lit             = ( "1" … "9" ) { digit } .
```

#### Floats

InfluxQL supports floating-point literals.
Exponents aren't currently supported.

```
float_lit           = int_lit "." int_lit .
```

#### Strings

String literals must be surrounded by single quotes.
Strings may contain `'` characters as long as they are escaped (that is, , `\'`)

```
string_lit          = `'` { unicode_char } `'` .
```

#### Durations

Duration literals specify a length of time.
An integer literal followed immediately (with no spaces) by one of the duration units listed below is interpreted as a duration literal.
Durations can be specified with mixed units.

##### Duration units

| Units  | Meaning                                 |
| ------ | --------------------------------------- |
| ns     | nanoseconds (1 billionth of a second)   |
| u or µ | microseconds (1 millionth of a second)  |
| ms     | milliseconds (1 thousandth of a second) |
| s      | second                                  |
| m      | minute                                  |
| h      | hour                                    |
| d      | day                                     |
| w      | week                                    |

```
duration_lit        = int_lit duration_unit .
duration_unit       = "ns" | "u" | "µ" | "ms" | "s" | "m" | "h" | "d" | "w" .
```

#### Dates & Times

Unlike other notations used in InfluxQL, the date and time literal format isn't specified by EBNF.
InfluxQL date and time is specified using Go's time parsing format and
[reference date](https://pkg.go.dev/time#pkg-constants) written in the format required by InfluxQL.
The reference date time is:

InfluxQL reference date time: January 2nd, 2006 at 3:04:05 PM

```
time_lit            = "2006-01-02 15:04:05.999999" | "2006-01-02" .
```

#### Booleans

```
bool_lit            = TRUE | FALSE .
```

#### Regular Expressions

```
regex_lit           = "/" { unicode_char } "/" .
```

**Comparators:**
`=~` matches against
`!~` doesn't match against

{{% note %}}
InfluxQL supports using regular expressions when specifying:

- [field keys](/influxdb/cloud-dedicated/reference/glossary/#field-key) and [tag keys](/influxdb/cloud-dedicated/reference/glossary/#tag-key) in the [`SELECT` clause](/influxdb/cloud-dedicated/reference/influxql/select/)
- [measurements](/influxdb/cloud-dedicated/reference/glossary/#measurement) in the [`FROM` clause](/influxdb/cloud-dedicated/reference/influxql/select/#from-clause)
- [tag values](/influxdb/cloud-dedicated/reference/glossary/#tag-value) and
  string [field values](/influxdb/cloud-dedicated/reference/glossary/#field-value)
  in the [`WHERE` clause](/influxdb/cloud-dedicated/reference/influxql/where/)
- [tag keys](/influxdb/cloud-dedicated/reference/glossary/#tag-key) in the
  [`GROUP BY` clause](/influxdb/cloud-dedicated/reference/influxql/group-by/)

Currently, InfluxQL doesn't support using regular expressions to match non-string
field values in the `WHERE` clause, [databases](/influxdb/cloud-dedicated/reference/glossary/#database),
and [retention polices](/influxdb/cloud-dedicated/reference/glossary/#retention-policy-rp).
{{% /note %}}

## Queries

A query is composed of one or more statements separated by a semicolon (`;`).

```
query               = statement { ";" statement } .

statement           = explain_stmt |
                      explain_analyze_stmt |
                      select_stmt |
                      show_field_keys_stmt |
                      show_measurements_stmt |
                      show_retention_policies_stmt |
                      show_tag_keys_stmt |
                      show_tag_values_with_key = stmt .
```

<!-- FULL TSM INFLUXQL STATEMENT LIST
```
query               = statement { ";" statement } .

statement           = explain_stmt |
                      explain_analyze_stmt |
                      select_stmt |
                      show_databases_stmt |
                      show_field_key_cardinality_stmt |
                      show_field_keys_stmt |
                      show_measurement_exact_cardinality_stmt |
                      show_measurements_stmt |
                      show_series_exact_cardinality_stmt |
                      show_series_stmt |
                      show_tag_key_cardinality_stmt |
                      show_tag_key_exact_cardinality_stmt |
                      show_tag_keys_stmt |
                      show_tag_values_with_key = stmt |
                      show_tag_values_cardinality_stmt .
``` -->

## Statements

### EXPLAIN

Parses and plans the query, and then prints a summary of estimated costs.

Many SQL engines use the `EXPLAIN` statement to show join order, join algorithms, and predicate and expression pushdown.
Since InfluxQL doesn't support joins, the cost of an InfluxQL query is typically a function of the total series accessed, the number of iterator accesses to a TSM file, and the number of TSM blocks that need to be scanned.

A query plan generated by `EXPLAIN` contains the following elements:

- expression
- auxiliary fields
- number of shards
- number of series
- cached values
- number of files
- number of blocks
- size of blocks

```
explain_stmt = "EXPLAIN" select_stmt .
```

#### Example

```sql
> explain select sum(pointReq) from "_internal"."monitor"."write" group by hostname;
> QUERY PLAN
------
EXPRESSION: sum(pointReq::integer)
NUMBER OF SHARDS: 2
NUMBER OF SERIES: 2
CACHED VALUES: 110
NUMBER OF FILES: 1
NUMBER OF BLOCKS: 1
SIZE OF BLOCKS: 931
```

### EXPLAIN ANALYZE

Executes the specified `SELECT` statement and returns data about the query performance and storage during runtime, visualized as a tree. Use this statement to analyze query performance and storage, including [execution time](#execution-time) and [planning time](#planning-time), and the [iterator type](#iterator-type) and [cursor type](#cursor-type).

For example, if you execute the following statement:

```sql
> explain analyze select mean(usage_steal) from cpu where time >= '2018-02-22T00:00:00Z' and time < '2018-02-22T12:00:00Z'
```

The output is similar to the following:

```sql
EXPLAIN ANALYZE
---------------
.
└── select
    ├── execution_time: 2.25823ms
    ├── planning_time: 18.381616ms
    ├── total_time: 20.639846ms
    └── field_iterators
        ├── labels
        │   └── statement: SELECT mean(usage_steal::float) FROM telegraf."default".cpu
        └── expression
            ├── labels
            │   └── expr: mean(usage_steal::float)
            └── create_iterator
                ├── labels
                │   ├── measurement: cpu
                │   └── shard_id: 608
                ├── cursors_ref: 779
                ├── cursors_aux: 0
                ├── cursors_cond: 0
                ├── float_blocks_decoded: 431
                ├── float_blocks_size_bytes: 1003552
                ├── integer_blocks_decoded: 0
                ├── integer_blocks_size_bytes: 0
                ├── unsigned_blocks_decoded: 0
                ├── unsigned_blocks_size_bytes: 0
                ├── string_blocks_decoded: 0
                ├── string_blocks_size_bytes: 0
                ├── boolean_blocks_decoded: 0
                ├── boolean_blocks_size_bytes: 0
                └── planning_time: 14.805277ms```
```

{{% note %}}
`EXPLAIN ANALYZE` ignores query output, so the cost of serialization to JSON or
CSV isn't accounted for.
{{% /note %}}

##### execution_time

Shows the amount of time the query took to execute, including reading the time series data, performing operations as data flows through iterators, and draining processed data from iterators. Execution time doesn't include the time taken to serialize the output into JSON or other formats.

##### planning_time

Shows the amount of time the query took to plan.
Planning a query in InfluxDB requires a number of steps. Depending on the complexity of the query, planning can require more work and consume more CPU and memory resources than executing the query. For example, the number of series keys required to execute a query affects how quickly the query is planned and how much memory the planning requires.

First, InfluxDB determines the effective time range of the query and selects the shards to access.
Next, for each shard and each measurement, InfluxDB performs the following steps:

1. Select matching series keys from the index, filtered by tag predicates in the `WHERE` clause.
2. Group filtered series keys into tag sets based on the `GROUP BY` dimensions.
3. Enumerate each tag set and create a cursor and iterator for each series key.
4. Merge iterators and return the merged result to the query executor.

##### iterator type

`EXPLAIN ANALYZE` supports the following iterator types:

- `create_iterator` node represents work done by the local influxd instance──a complex composition of nested iterators combined and merged to produce the final query output.
- (InfluxDB Enterprise only) `remote_iterator` node represents work done on remote machines.

For more information about iterators, see [Understanding iterators](#understanding-iterators).

##### cursor type

`EXPLAIN ANALYZE` distinguishes 3 cursor types. While the cursor types have the same data structures and equal CPU and I/O costs, each cursor type is constructed for a different reason and separated in the final output. Consider the following cursor types when tuning a statement:

- cursor_ref:	Reference cursor created for `SELECT` projections that include a function, such as `last()` or `mean()`.
- cursor_aux:	Auxiliary cursor created for simple expression projections (not selectors or an aggregation). For example, `SELECT foo FROM m` or `SELECT foo+bar FROM m`, where `foo` and `bar` are fields.
- cursor_cond: Condition cursor created for fields referenced in a `WHERE` clause.

For more information about cursors, see [Understanding cursors](#understanding-cursors).

##### block types

`EXPLAIN ANALYZE` separates storage block types, and reports the total number of
blocks decoded and their size (in bytes) on disk. The following block types are supported:

| Type       | Description                           |
| :--------- | :------------------------------------ |
| `float`    | 64-bit IEEE-754 floating-point number |
| `integer`  | 64-bit signed integer                 |
| `unsigned` | 64-bit unsigned integer               |
| `boolean`  | 1-bit, LSB encoded                    |
| `string`   | UTF-8 string                          |

### SELECT

```
select_stmt = "SELECT" fields from_clause [ where_clause ]
              [ group_by_clause ] [ order_by_clause ] [ limit_clause ]
              [ offset_clause ] [ slimit_clause ] [ soffset_clause ] [ timezone_clause ] .
```

#### Example

Select from measurements grouped by the day with a timezone

```sql
SELECT mean("value") FROM "cpu" GROUP BY region, time(1d) fill(0) tz('America/Chicago')
```

<!-- ### SHOW CARDINALITY

Refers to the group of commands used to estimate or count exactly the cardinality of measurements, series, tag keys, tag key values, and field keys.

The SHOW CARDINALITY commands are available in two variations: _estimated_ and _exact_. Estimated values are calculated using sketches and are a safe default for all cardinality sizes. Exact values are counts directly from TSM (Time-Structured Merge Tree) data, but are expensive to run for high cardinality data.  Unless required, use the estimated variety.

Filtering by `time` is only supported when Time Series Index (TSI) is enabled on a database.

See the specific SHOW CARDINALITY commands for details:

- [SHOW FIELD KEY CARDINALITY](#show-field-key-cardinality)
- [SHOW SERIES CARDINALITY](#show-series-cardinality)
- [SHOW TAG KEY CARDINALITY](#show-tag-key-cardinality)
- [SHOW TAG VALUES CARDINALITY](#show-tag-values-cardinality) -->

<!-- ### SHOW DATABASES

```
show_databases_stmt = "SHOW DATABASES" .
```

#### Example

```sql
-- show all databases
SHOW DATABASES
``` -->

<!-- ### SHOW FIELD KEY CARDINALITY

Estimates or counts exactly the cardinality of the field key set for the current
database unless a database is specified using the `ON <database>` option.

{{% note %}}
**Note:** `ON <database>`, `FROM <sources>`, `WITH KEY = <key>`,
`WHERE <condition>`, `GROUP BY <dimensions>`, and `LIMIT/OFFSET` clauses are optional.
When using these query clauses, the query falls back to an exact count.
{{% /note %}}

```sql
show_field_key_cardinality_stmt = "SHOW FIELD KEY CARDINALITY" [ on_clause ] [ from_clause ] [ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ]

show_field_key_exact_cardinality_stmt = "SHOW FIELD KEY EXACT CARDINALITY" [ on_clause ] [ from_clause ] [ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ]
```

#### Examples

```sql
-- show estimated cardinality of the field key set of current database
SHOW FIELD KEY CARDINALITY
-- show exact cardinality on field key set of specified database
SHOW FIELD KEY EXACT CARDINALITY ON mydb
``` -->

### SHOW FIELD KEYS

```
show_field_keys_stmt = "SHOW FIELD KEYS" [on_clause] [ from_clause ] .
```

#### Examples

```sql
-- show field keys and field value data types from all measurements
SHOW FIELD KEYS

-- show field keys and field value data types from specified measurement
SHOW FIELD KEYS FROM "cpu"
```

### SHOW MEASUREMENTS

```
show_measurements_stmt = "SHOW MEASUREMENTS" [on_clause] [ with_measurement_clause ] [ where_clause ] [ limit_clause ] [ offset_clause ] .
```

#### Examples

```sql
-- show all measurements
SHOW MEASUREMENTS

-- show measurements where region tag = 'uswest' AND host tag = 'serverA'
SHOW MEASUREMENTS WHERE "region" = 'uswest' AND "host" = 'serverA'

-- show measurements that start with 'h2o'
SHOW MEASUREMENTS WITH MEASUREMENT =~ /h2o.*/
```

<!-- ### SHOW SERIES

```
show_series_stmt = "SHOW SERIES" [on_clause] [ from_clause ] [ where_clause ] [ limit_clause ] [ offset_clause ] .
```

#### Example

```sql
SHOW SERIES FROM "telegraf"."autogen"."cpu" WHERE cpu = 'cpu8'
``` -->

<!-- ### SHOW SERIES EXACT CARDINALITY

Estimates or counts exactly the cardinality of the series for the current
database unless a database is specified using the `ON database` option.

#### Example

SHOW SERIES EXACT CARDINALITY" [ on_clause ] [ from_clause ] 
[ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ]

```sql
SHOW SERIES EXACT CARDINALITY ON mydb
```

{{% note %}}
**NOTE:** `ON <database>`, `FROM <sources>`, `WITH KEY = <key>`,
`WHERE <condition>`, `GROUP BY <dimensions>`, and `LIMIT/OFFSET` clauses are optional.
When using these query clauses, the query falls back to an exact count.
Filtering by `time` is not supported in the `WHERE` clause.
{{% /note %}} -->

<!-- ### SHOW TAG KEY CARDINALITY

Estimates or counts exactly the cardinality of tag key set on the current
database unless a database is specified using the `ON <database>` option.

{{% note %}}
`ON <database>`, `FROM <sources>`, `WITH KEY = <key>`, `WHERE <condition>`,
`GROUP BY <dimensions>`, and `LIMIT/OFFSET` clauses are optional.
When using these query clauses, the query falls back to an exact count.
Filtering by `time` is only supported when TSI (Time Series Index) is enabled
and `time` is not supported in the `WHERE` clause.
{{% /note %}}

```
show_tag_key_cardinality_stmt = "SHOW TAG KEY CARDINALITY" [ on_clause ] [ from_clause ] [ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ]

show_tag_key_exact_cardinality_stmt = "SHOW TAG KEY EXACT CARDINALITY" [ on_clause ] [ from_clause ] [ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ]
```

#### Examples

```sql
-- show estimated tag key cardinality
SHOW TAG KEY CARDINALITY
-- show exact tag key cardinality
SHOW TAG KEY EXACT CARDINALITY
``` -->

### SHOW TAG KEYS

```
show_tag_keys_stmt = "SHOW TAG KEYS" [on_clause] [ from_clause ] [ where_clause ]
                     [ limit_clause ] [ offset_clause ] .
```

#### Examples

```sql
-- show all tag keys
SHOW TAG KEYS

-- show all tag keys from the cpu measurement
SHOW TAG KEYS FROM "cpu"

-- show all tag keys from the cpu measurement where the region key = 'uswest'
SHOW TAG KEYS FROM "cpu" WHERE "region" = 'uswest'

-- show all tag keys where the host key = 'serverA'
SHOW TAG KEYS WHERE "host" = 'serverA'
```

### SHOW TAG VALUES

```
show_tag_values_stmt = "SHOW TAG VALUES" [on_clause] [ from_clause ] with_tag_clause [ where_clause ]
                       [ limit_clause ] [ offset_clause ] .
```

#### Examples

```sql
-- show all tag values across all measurements for the region tag
SHOW TAG VALUES WITH KEY = "region"

-- show tag values from the cpu measurement for the region tag
SHOW TAG VALUES FROM "cpu" WITH KEY = "region"

-- show tag values across all measurements for all tag keys that do not include the letter c
SHOW TAG VALUES WITH KEY !~ /.*c.*/

-- show tag values from the cpu measurement for region & host tag keys where service = 'redis'
SHOW TAG VALUES FROM "cpu" WITH KEY IN ("region", "host") WHERE "service" = 'redis'
```

<!-- ### SHOW TAG VALUES CARDINALITY

Estimates or counts exactly the cardinality of tag key values for the specified
tag key on the current database unless a database is specified using the
`ON database` option.

{{% note %}}
**Note:** `ON <database>`, `FROM <sources>`, `WITH KEY = <key>`,
`WHERE <condition>`, `GROUP BY <dimensions>`, and `LIMIT/OFFSET` clauses are optional.
When using these query clauses, the query falls back to an exact count.
Filtering by `time` is only supported when TSI (Time Series Index) is enabled.
{{% /note %}}

```
show_tag_values_cardinality_stmt = "SHOW TAG VALUES CARDINALITY" [ on_clause ] [ from_clause ] [ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ] with_key_clause

show_tag_values_exact_cardinality_stmt = "SHOW TAG VALUES EXACT CARDINALITY" [ on_clause ] [ from_clause ] [ where_clause ] [ group_by_clause ] [ limit_clause ] [ offset_clause ] with_key_clause
```

#### Examples

```sql
-- show estimated tag key values cardinality for a specified tag key
SHOW TAG VALUES CARDINALITY WITH KEY = "myTagKey"
-- show estimated tag key values cardinality for a specified tag key
SHOW TAG VALUES CARDINALITY WITH KEY = "myTagKey"
-- show exact tag key values cardinality for a specified tag key
SHOW TAG VALUES EXACT CARDINALITY WITH KEY = "myTagKey"
-- show exact tag key values cardinality for a specified tag key
SHOW TAG VALUES EXACT CARDINALITY WITH KEY = "myTagKey"
``` -->

## Clauses

```
from_clause     = "FROM" measurements .

group_by_clause = "GROUP BY" dimensions fill(fill_option).

limit_clause    = "LIMIT" int_lit .

offset_clause   = "OFFSET" int_lit .

slimit_clause   = "SLIMIT" int_lit .

soffset_clause  = "SOFFSET" int_lit .

timezone_clause = tz(string_lit) .

on_clause       = "ON" db_name .

order_by_clause = "ORDER BY" sort_fields .

where_clause    = "WHERE" expr .

with_measurement_clause = "WITH MEASUREMENT" ( "=" measurement | "=~" regex_lit ) .

with_tag_clause = "WITH KEY" ( "=" tag_key | "!=" tag_key | "=~" regex_lit | "IN (" tag_keys ")"  ) .
```

## Expressions

```
binary_op        = "+" | "-" | "*" | "/" | "%" | "&" | "|" | "^" | "AND" |
                   "OR" | "=" | "!=" | "<>" | "<" | "<=" | ">" | ">=" .

expr             = unary_expr { binary_op unary_expr } .

unary_expr       = "(" expr ")" | var_ref | time_lit | string_lit | int_lit |
                   float_lit | bool_lit | duration_lit | regex_lit .
```

## Default time range

The default time range is the Unix epoch (`1970-01-01T00:00:00Z`) to _now_.

## Comments

Use comments with InfluxQL statements to describe your queries.

- A single line comment begins with two hyphens (`--`) and ends where InfluxDB detects a line break.
  This comment type cannot span several lines.
- A multi-line comment begins with `/*` and ends with `*/`. This comment type can span several lines.
  Multi-line comments do not support nested multi-line comments.

## Other

```
alias            = "AS" identifier .

back_ref         = ( policy_name ".:MEASUREMENT" ) |
                   ( db_name "." [ policy_name ] ".:MEASUREMENT" ) .

db_name          = identifier .

dimension        = expr .

dimensions       = dimension { "," dimension } .

field_key        = identifier .

field            = expr [ alias ] .

fields           = field { "," field } .

fill_option      = "null" | "none" | "previous" | int_lit | float_lit | "linear" .

host             = string_lit .

measurement      = measurement_name |
                   ( policy_name "." measurement_name ) |
                   ( db_name "." [ policy_name ] "." measurement_name ) .

measurements     = measurement { "," measurement } .

measurement_name = identifier | regex_lit .

policy_name      = identifier .

retention_policy = identifier .

retention_policy_name = "NAME" identifier .

series_id        = int_lit .

sort_field       = field_key [ ASC | DESC ] .

sort_fields      = sort_field { "," sort_field } .

tag_key          = identifier .

tag_keys         = tag_key { "," tag_key } .

var_ref          = measurement .
```
