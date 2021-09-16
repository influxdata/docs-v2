---
title: Write to MySQL
list_title: MySQL
description: >
  Use [`sql.to()`](/flux/v0.x/stdlib/sql/to/) with the `mysql` driver to write
  data to MySQL.
menu:
  flux_0_x:
    name: MySQL
    parent: write-to-sql
    identifier: write-mysql
weight: 101
related:
  - /flux/v0.x/stdlib/sql/to/
list_code_example: |
  ```js
  import "sql"
  
  data
    |> sql.to(
      driverName: "mysql",
      dataSourceName: "user:password@tcp(localhost:3306)/db",
      table: "example_table"
    )
  ```
---

To write data to [MySQL](https://www.mysql.com/) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Pipe-forward data into [`sql.to()`](/flux/v0.x/stdlib/sql/to/) and provide
   the following parameters:

    - **driverName**: mysql
    - **dataSourceName**: _See [data source name](#mysql-data-source-name)_
    - **table**: Table to write to
    - **batchSize**: Number of parameters or columns that can be queued within
      each call to `Exec` (default is `10000`)

```js
import "sql"

data
  |> sql.to(
    driverName: "mysql",
    dataSourceName: "user:password@tcp(localhost:3306)/db",
    table: "example_table"
  )
```

---

## MySQL data source name
The `mysql` driver uses the following data source name (DSN) syntax (also known as a **connection string**):

```
username:password@tcp(localhost:3306)/dbname?param=value
```

## Flux to MySQL data type conversion
`sql.to()` converts Flux data types to MySQL data types.

| Flux data type                                | MySQL data type |
| :-------------------------------------------- | :-------------- |
| [float](/flux/v0.x/data-types/basic/float/)   | FLOAT           |
| [int](/flux/v0.x/data-types/basic/int/)       | BIGINT          |
| [uint](/flux/v0.x/data-types/basic/uint/)     | BIGINT          |
| [string](/flux/v0.x/data-types/basic/string/) | TEXT(16383)     |
| [bool](/flux/v0.x/data-types/basic/bool/)     | BOOL (TINYINT)  |
| [time](/flux/v0.x/data-types/basic/time/)     | DATETIME        |

{{% note %}}
#### MySQL BOOL types
`BOOL` is a synonym supplied by MySQL for convenience.
MySQL stores `BOOL` values as `TINYINT` types so looking at the schema shows the
column type as `TINYINT`.
{{% /note %}}
