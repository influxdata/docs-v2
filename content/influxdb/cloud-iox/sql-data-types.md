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

InfluxDB Cloud backed by InfluxDB IOx uses the Apache Arrow DataFusion implementation of SQL. Data types define the type of value that can be stored in table column. In InfluxDB's SQL implementation, a `measurement` is a table, and columns are comprised of `tags`, `fields` and `timestamps`. 

DataFusion uses the Arrow type system for query execution. Data types stored in InfluxDB's storage engine are mapped to SQL data types according to the following tables. 

{{% note %}}
When performing casting operations, cast to the **name** of the data type, not the actual data type.  Names are not case sensitive. 

```sql
--Examples
SELECT
'99'::BIGINT
'2019-09-18T00:00:00Z'::timestamp
```
{{% /note %}}

## Character types

| Name    | Data type | Description                       |
| :------ | :-------- | --------------------------------- |
| CHAR    | UTF8      | Character string, fixed-length    |
| VARCHAR | UTF8      | Character string, variable-length |
| TEXT    | UTF8      | Variable unlimited length         |

```sql
--Examples
abcdefghijk
time
"h2o_temperature"
```

## Numeric types

InfluxDB stores all integers as signed 64bit integers. The following numeric types are supported:

| Name            | Data type | Description                  |
| :-------------- | :-------- | :--------------------------- |
| BIGINT          | INT64     | large-range integer          |
| BIGINT UNSIGNED | INT64     | large-range unsigned integer |
| DOUBLE          | FLOAT64   | 64-bit floating-point number |


Minimum integer:` -9223372036854775808`  
Maximum integer: `9223372036854775807`

Minimum unsigned integer (uinteger): `0`  
Maximum unsigned integer (uinteger): `18446744073709551615`  

Floats can be a decimal point, decimal integer or decimal fraction.

```sql
--Examples
23.8
-446.89
5.00
0.033
```

## Time types

A time type is a single point in time using nanosecond precision.  

| Name      | Data type | Description                |
| :-------- | :-------- | :------------------------- |
| TIMESTAMP | TIMESTAMP | TimeUnit::Nanosecond, None |


The following date and time formats are supported:

```sql
--Examples
YYYY-MM-DDT00:00:00.000Z 
YYYY-MM-DDT00:00:00.000-00:00 
YYYY-MM-DD 00:00:00.000-00:00 
YYYY-MM-DDT00:00:00Z
YYYY-MM-DD 00:00:00.000
YYYY-MM-DD 00:00:00
1567296000000000000 
1566176400 
```

## Boolean types

Booleans store TRUE or FALSE values. 

| Name    | Data type | Description                                                           |
| :------ | :-------- | :-------------------------------------------------------------------- |
| BOOLEAN | BOOLEAN   | TRUE or FALSE for strings, 0 and 1 for integers, uintegers and floats |

Booleans are parsed in the following manner:

- string: `TRUE` or `FALSE`
- integer: 0 is false, 1 is true
- uinteger: 0 is false, 1 is true
- float: 0.0 is false, 1.0 is true

Note that zero vaules are parsed as `false` and non zero negative values are parsed as `true`. 

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
- INTERVAL
- DATETIME
- BYTEA
