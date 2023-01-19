---
title: SQL data types
description: >
  The InfluxDB SQL implementation supports a number of data types including 64-bit integers,
  double-precision floating point numbers, strings, and more.
menu:
  influxdb_cloud_iox:
    name: SQL data types
    parent: Query data with SQL
weight: 105
---

InfluxDB Cloud backed by InfluxDB IOx uses the [Apache Arrow DataFusion](https://arrow.apache.org/datafusion/) implementation of SQL.
Data types define the type of values that can be stored in table columns.
In InfluxDB's SQL implementation, a **measurement** is structured as a table,
and  **tags**, **fields** and **timestamps** are exposed as columns.

DataFusion uses the [Arrow](https://arrow.apache.org/) type system for query execution.
Data types stored in InfluxDB's storage engine are mapped to SQL data types at query time. 

{{% note %}}
When performing casting operations, cast to the **name** of the data type, not the actual data type. 
Names and indentifiers in SQL are _case-insensitive_ by default. For example:

```sql
SELECT
  '99'::BIGINT, 
  '2019-09-18T00:00:00Z'::timestamp
```
{{% /note %}}

## Character types

| Name    | Data type | Description                       |
| :------ | :-------- | --------------------------------- |
| CHAR    | UTF8      | Character string, fixed-length    |
| VARCHAR | UTF8      | Character string, variable-length |
| TEXT    | UTF8      | Variable unlimited length         |

##### Example character types

```sql
abcdefghijk
time
"h2o_temperature"
```

## Numeric types

The following numeric types are supported:

| Name            | Data type | Description                  |
| :-------------- | :-------- | :--------------------------- |
| BIGINT          | INT64     | 64-bit signed integer        |
| BIGINT UNSIGNED | UINT64    | 64-bit unsigned integer      |
| DOUBLE          | FLOAT64   | 64-bit floating-point number |


Minimum signed integer:` -9223372036854775808`  
Maximum signed integer: `9223372036854775807`

Minimum unsigned integer (uinteger): `0`  
Maximum unsigned integer (uinteger): `18446744073709551615`  

Floats can be a decimal point, decimal integer, or decimal fraction.

##### Example float types

```sql
23.8
-446.89
5.00
0.033
```

## Date and time data types

InfluxDB SQL supports the following DATE/TIME data types:

| Name      | Data type | Description                                                          |
| :-------- | :-------- | :------------------------------------------------------------------- |
| TIMESTAMP | TIMESTAMP | TimeUnit::Nanosecond, None                                           |
| INTERVAL  | INTERVAL  | Interval(IntervalUnit::YearMonth) or Interval(IntervalUnit::DayTime) |


### Timestamp

A time type is a single point in time using nanosecond precision.  

The following date and time formats are supported:

```sql
-- Examples
YYYY-MM-DDT00:00:00.000Z 
YYYY-MM-DDT00:00:00.000-00:00 
YYYY-MM-DD 00:00:00.000-00:00 
YYYY-MM-DDT00:00:00Z
YYYY-MM-DD 00:00:00.000
YYYY-MM-DD 00:00:00
```

### Interval 

The INTERVAL data type can be used with the following precision: 

- year
- month
- day
- hour
- minute
- second

```sql
-- Examples
WHERE time > now() - interval'10 minutes' 
time >= now() - interval'1 year'
```

## Boolean types

Booleans store TRUE or FALSE values. 

| Name    | Data type | Description                                                           |
| :------ | :-------- | :-------------------------------------------------------------------- |
| BOOLEAN | BOOLEAN   | TRUE or FALSE for strings, 0 and 1 for integers, uintegers and floats |

Booleans are parsed in the following manner:

- string: `TRUE` or `FALSE`
- integer: 0 is false, non-zero is true
- uinteger: 0 is false, non-zero is true
- float: 0.0 is false, non-zero is true

##### Example boolean types

```sql
true
TRUE
false
FALSE
```

## Unsupported SQL types

The following SQL types are not currently supported:

- UUID
- BLOB
- CLOB
- BINARY
- VARBINARY
- REGCLASS
- NVARCHAR
- CUSTOM
- ARRAY
- ENUM
- SET
- DATETIME
- BYTEA
