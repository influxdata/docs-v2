---
title: Write to Snowflake
list_title: Snowflake
description: >
  Use [`sql.to()`](/flux/v0.x/stdlib/sql/to/) with the `snowflake` driver to 
  write data to Snowflake.
menu:
  flux_0_x:
    name: Snowflake
    parent: write-to-sql
    identifier: write-snowflake
weight: 101
related:
  - /flux/v0.x/stdlib/sql/to/
list_code_example: |
  ```js
  import "sql"
  
  data
    |> sql.to(
      driverName: "snowflake",
      dataSourceName: "user:password@account/db/exampleschema?warehouse=wh",
      table: "example_table"
    )
  ```
---

To write data to [Snowflake](https://www.snowflake.com/) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Pipe-forward data into [`sql.to()`](/flux/v0.x/stdlib/sql/to/) and provide
   the following parameters:

    - **driverName**: snowflake
    - **dataSourceName**: _See [data source name](#data-source-name)_
    - **table**: Table to write to
    - **batchSize**: Number of parameters or columns that can be queued within
      each call to `Exec` (default is `10000`)

```js
import "sql"
  
data
  |> sql.to(
    driverName: "snowflake",
    dataSourceName: "user:password@account/db/exampleschema?warehouse=wh",
    table: "example_table"
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
`sql.to()` converts Flux data types to Snowflake data types.

| Flux data type                                | Snowflake data type |
| :-------------------------------------------- | :------------------ |
| [float](/flux/v0.x/spec/types/#numeric-types) | FLOAT               |
| [int](/flux/v0.x/spec/types/#numeric-types)   | NUMBER              |
| [string](/flux/v0.x/spec/types/#string-types) | TEXT                |
| [bool](/flux/v0.x/spec/types/#boolean-types)  | BOOLEAN             |
| [time](/flux/v0.x/spec/types/#time-types)     | TIMESTAMP_LTZ       |
