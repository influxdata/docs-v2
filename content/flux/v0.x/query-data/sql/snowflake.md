---
title: Query Snowflake
list_title: Snowflake
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) with the `snowflake` driver to query Snowflake.
menu:
  flux_0_x:
    name: Snowflake
    parent: SQL databases
weight: 101
related:
  - /flux/v0.x/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"
  
  sql.from(
    driverName: "snowflake",
    dataSourceName: "user:password@account/db/exampleschema?warehouse=wh",
    query: "SELECT * FROM example_table"
  )
  ```
---

To query [Snowflake](https://www.snowflake.com/) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) and provide the following parameters:

    - **driverName**: snowflake
    - **dataSourceName**: _See [data source name](#data-source-name)_
    - **query**: SQL query to execute

```js
import "sql"

sql.from(
  driverName: "snowflake",
  dataSourceName: "user:password@account/db/exampleschema?warehouse=wh",
  query: "SELECT * FROM example_table"
)
```

##### On this page

- [Data source name](#data-source-name)
- [Data type conversion](#data-type-conversion)

## Data source name
The `snowflake` driver uses the following DSN syntaxes (also known as a **connection string**):

```
username[:password]@accountname/dbname/schemaname?param1=value1&paramN=valueN
username[:password]@accountname/dbname?param1=value1&paramN=valueN
username[:password]@hostname:port/dbname/schemaname?account=<your_account>&param1=value1&paramN=valueN
```

## Data type conversion
`sql.from()` converts Snowflake data types to Flux data types.

| Snowflake data type         | Flux data type                                                                                                           |
| :-------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| FIXED, NUMBER               | [int](/flux/v0.x/spec/types/#numeric-types) or [float](/flux/v0.x/spec/types/#numeric-types) (depending on decimal size) |
| REAL, FLOAT                 | [float](/flux/v0.x/spec/types/#numeric-types)                                                                            |
| TIMESTAMP_TZ, TIMESTAMP_LTZ | [time](/flux/v0.x/spec/types/#time-types)                                                                                |
| BOOLEAN                     | [bool](/flux/v0.x/spec/types/#boolean-types)                                                                             |

{{% caption %}}
All other Snowflake data types (including **TIMESTAMP_NTZ**, **DATE** and **TIME**)
are converted to strings.
{{% /caption %}}
