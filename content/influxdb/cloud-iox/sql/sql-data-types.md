---
title: SQL data types
description: >
  SQL data types
menu:
  influxdb_cloud_iox:
    name: SQL data types
    parent: Query data with SQL
weight: 105
---

## InfluxDB SQL Data types

InfluxDB Cloud backed by InfluxDB IOx uses the Apache Arrow DataFusion implementation of SQL. Data types define the type of data a column can contain. DataFusion uses the Arrow type system for query execution. Data types stored in InfluxDB's storage engine are mapped to SQL data types according to the following tables. When performing casting operations, cast to the **name** of the data type, not the actual data type.

### Character types

| Name    | Data type | Description                       |
| :------ | :-------- | --------------------------------- |
| CHAR    | UTF8      | Character string, fixed-length    |
| VARCHAR | UTF8      | Character string, variable-length |
| TEXT    | UTF8      | Variable unlimited length         |

### Numeric types

InfluxDB stores all integers as signed 64bit integers. The following numeric types are supported:

| Name            | Data type | Description                  |
| :-------------- | :-------- | :--------------------------- |
| bigint          | INT64     | large-range integer          |
| bigint unsigned | INT64     | large-range unsigned integer |
| double          | FLOAT64   | 64-bit floating-point number |


Minimum integer:` -9223372036854775808`  
Maximum integer: `9223372036854775807`

Minimum unsigned integer (uinteger): `0`
Maximum unsigned integer (uinteger): `18446744073709551615`

Floats can be a decimal point, decimal integer or decimal fraction.

```sql
23.8
0.0
-23.987
```

### Time type

A time type is a single point in time using nanosecond precision.  

| Name      | Data type | Description                |
| :-------- | :-------- | :------------------------- |
| timestamp | TIMESTAMP | TimeUnit::Nanosecond, None |


The following date and time formats are supported:

 - YYYY-MM-DDT00:00:00.000Z 
 - YYYY-MM-DDT00:00:00.000-00:00 
 - YYYY-MM-DD 00:00:00.000-00:00 
 - YYYY-MM-DDT00:00:00Z
 - YYYY-MM-DD 00:00:00.000
 - YYYY-MM-DD 00:00:00
 - 1567296000000000000 
-  1566176400 

### Boolean types

Booleans store TRUE or FALSE values. 

| Name    | Data type | Description                                                           |
| :------ | :-------- | :-------------------------------------------------------------------- |
| boolean | BOOLEAN   | TRUE or FALSE for strings, 0 and 1 for integers, uintegers and floats |

Booleans are parsed in the following manner:

- string: `TRUE` or `FALSE`
- integer: 0 is flase, 1 is true
- uinteger: 0 is flase, 1 is true
- float: 0.0 is false, 1.0 is true

Note that zero vaules are parsed as `false` and non zero negative values are parsed as `true`. 

### Unsupported types

The following types are not currently supported:
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
