---
title: Write to PostgreSQL
list_title: PostgreSQL
description: >
  Use [`sql.to()`](/flux/v0/stdlib/sql/to/) with the `postgres` driver to write
  data to PostgreSQL.
menu:
  flux_v0:
    name: PostgreSQL
    parent: write-to-sql
    identifier: write-postgres
weight: 101
related:
  - /flux/v0/stdlib/sql/to/
list_code_example: |
  ```js
  import "sql"
  
  data
    |> sql.to(
      driverName: "postgres",
      dataSourceName: "postgresql://username:password@localhost:5432",
      table: "example_table"
    )
  ```
---

To write data to [PostgreSQL](https://www.postgresql.org/) with Flux:

1. Import the [`sql` package](/flux/v0/stdlib/sql/).
2. Pipe-forward data into [`sql.to()`](/flux/v0/stdlib/sql/to/) and provide
   the following parameters:

    - **driverName**: postgres
    - **dataSourceName**: _See [data source name](#postgresql-data-source-name)_
    - **table**: Table to write to
    - **batchSize**: Number of parameters or columns that can be queued within
      each call to `Exec` (default is `10000`)

```js
import "sql"
  
data
    |> sql.to(
        driverName: "postgres",
        dataSourceName: "postgresql://username:password@localhost:5432",
        table: "example_table",
    )
```

---

## PostgreSQL data source name
The `postgres` driver uses the following DSN syntax (also known as a **connection string**):

```
postgres://username:password@localhost:5432/dbname?param=value
```

## Flux to PostgreSQL data type conversion
`sql.to()` converts Flux data types to PostgreSQL data types.

| Flux data type                                | PostgreSQL data type |
| :-------------------------------------------- | :------------------- |
| [float](/flux/v0/data-types/basic/float/)   | FLOAT                |
| [int](/flux/v0/data-types/basic/int/)       | BIGINT               |
| [uint](/flux/v0/data-types/basic/uint/)     | BIGINT               |
| [string](/flux/v0/data-types/basic/string/) | TEXT                 |
| [bool](/flux/v0/data-types/basic/bool/)     | BOOL                 |
| [time](/flux/v0/data-types/basic/time/)     | TIMESTAMP            |
