---
title: Write to Percona
list_title: Percona
description: >
  Use [`sql.to()`](/flux/v0.x/stdlib/sql/to/) with the `mysql` driver to write
  data to Percona.
menu:
  flux_0_x:
    name: Percona
    parent: write-to-sql
    identifier: write-percona
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

To write data to [Percona](https://www.percona.com/) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Pipe-forward data into [`sql.to()`](/flux/v0.x/stdlib/sql/to/) and provide
   the following parameters:

    - **driverName**: mysql
    - **dataSourceName**: _See [data source name](#data-source-name)_
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

##### On this page

- [Data source name](#data-source-name)
- [Data type conversion](#data-type-conversion)

## Data source name
The `mysql` driver uses the following data source name (DSN) syntax (also known as a **connection string**):

```
username:password@tcp(localhost:3306)/dbname?param=value
```

## Data type conversion
`sql.to()` converts Flux data types to Percona data types.

| Flux data type                                | Percona data type |
| :-------------------------------------------- | :---------------- |
| [float](/flux/v0.x/spec/types/#numeric-types) | FLOAT             |
| [int](/flux/v0.x/spec/types/#numeric-types)   | BIGINT            |
| [uint](/flux/v0.x/spec/types/#numeric-types)  | BIGINT            |
| [string](/flux/v0.x/spec/types/#string-types) | TEXT(16383)       |
| [bool](/flux/v0.x/spec/types/#boolean-types)  | BOOL (TINYINT)    |
| [time](/flux/v0.x/spec/types/#time-types)     | DATETIME          |

{{% note %}}
#### Percona BOOL types
`BOOL` is a synonym supplied by Percona for convenience.
Percona stores `BOOL` values as `TINYINT` types so looking at the schema shows the
column type as `TINYINT`.
{{% /note %}}
