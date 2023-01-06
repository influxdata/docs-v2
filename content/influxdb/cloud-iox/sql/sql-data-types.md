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

## SQL Data types

InfluxDB Cloud backed by InfluxDB IOx uses the Apache Arrow DataFusion implementation of SQL. Data types define the type of data a column can contain. DataFusion uses the Arrow type system for query execution. Data types stored in InfluxDB's storage engine are mapped to SQL data types according to the following tables. When performing casting operations, cast to the name of the data type, not the actual data type.

### Character types

| Name    | Data type | Description                      |
| :------ | :-------- | -------------------------------- |
| CHAR    | UTF8      | fixed-length, blank padded       |
| VARCHAR | UTF8      | variable-length character string |
| TEXT    | UTF8      | variable unlimited length        |

### Numeric types

| Name              | Data type  | Description                                |
| :---------------- | :--------- | :----------------------------------------- |
| tinyint           | INT8       |                                            |
| smallint          | INT16      |                                            |
| integer           | INT32      |                                            |
| bigint            | INT64      |                                            |
| tinyint unsigned  | UINT8      |                                            |
| smallint unsigned | INT16      |                                            |
| int unsigned      | INT32      |                                            |
| bigint unsigned   | INT64      |                                            |
| float             | FLOAT32    |                                            |
| real              | FLOAT32    |                                            |
| double            | FLOAT64    |                                            |


### Time type

The time type is a single point in time using nanosecond precision.  

| Name      | Data type | Description                |
| :-------- | :-------- | :------------------------- |
| timestamp | TIMESTAMP | TimeUnit::Nanosecond, None |

Unix epoch timestamps must be cast with `::timestamp` as show in the example below:

```sql
1672933793::TIMESTAMP
## or
1672933793::timestamp
```



### Boolean types

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
