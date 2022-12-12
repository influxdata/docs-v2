---
title: SQL data types
description: >
  SQL data types
menu:
  influxdb_cloud_iox:
    name: SQL data types
weight: 105
---

## Data types

DataFusion uses the Arrow type system for query execution. The SQL types from sqlparser-rs are mapped to Arrow data types according to the following tables. This mapping occurs when defining the schema in a CREATE EXTERNAL TABLE command or when performing a SQL CAST operation.

### Character types

| Name    | Data type | Description                       |
| ------- | :-------- | --------------------------------- |
| CHAR    | UTF8      | fixed-length, blank padded        |
| VARCHAR | UTF8      | variable-length with length limit |
| TEXT    | UTF8      | variable unlimited length         |

### Numeric types

| Name              | Data type  | Description                                |
| ----------------- | :--------- | :----------------------------------------- |
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
| decimal           | DECIMAL128 | Decimal support is currently experimental. |

### Date and time types

| Name      | Data type | Description                |
| --------- | :-------- | :-------------------------- |
| Date      | DATE32    |                            |
| Time      | TIME64    | TimeUnit::Nanosecond       |
| Timestamp | timestamp | TimeUnit::Nanosecond, None |


### Boolean types

| Name    | Data type | Description   |
| ------- | :-------- | :------------ |
| BOOLEAN | Bollean   | TRUE or FALSE |


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
