---
title: Write to SQLite
list_title: SQLite
description: >
  Use [`sql.to()`](/flux/v0.x/stdlib/sql/to/) with the `sqlite3` driver to write
  data to SQLite.
menu:
  flux_0_x:
    name: SQLite
    parent: write-to-sql
    identifier: write-sqlite
weight: 101
related:
  - /flux/v0.x/stdlib/sql/to/
list_code_example: |
  ```js
  import "sql"

  data
    |> sql.to(
      driverName: "sqlite3",
      dataSourceName: "file:/path/to/example.db?cache=shared&mode=ro",
      table: "example_table"
    )
  ```
---

To write data to [SQLite](https://www.sqlite.org/index.html) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Pipe-forward data into [`sql.to()`](/flux/v0.x/stdlib/sql/to/) and provide
   the following parameters:

    - **driverName**: sqlite3
    - **dataSourceName**: _See [data source name](#sqlite-data-source-name)_
    - **table**: Table to write to
    - **batchSize**: Number of parameters or columns that can be queued within 
      each call to `Exec` ({{< req "set to `999` or less" >}})

```js
import "sql"

data
  |> sql.to(
    driverName: "sqlite3",
    dataSourceName: "file:/path/to/example.db?cache=shared&mode=ro",
    table: "example_table"
  )
```

{{% note %}}
#### Requires file system access
To query SQLite, Flux must have access to the filesystem.
If Flux does not have access to the file system, the query will return an error
similar to one of the following:

- `Error: unable to open database file`
- `failed to read file: filesystem service is uninitialized`
- `An internal error has occurred`

If using **InfluxDB Cloud** or **InfluxDB OSS**, the Flux process **does not**
have access to the filesystem.
{{% /note %}}

---

## SQLite data source name
The `sqlite3` driver uses the following DSN syntax (also known as a **connection string**):

```
file:/path/to/example.db?param=value
```

## Flux to SQLite data type conversion
`sql.to()` converts Flux data types to SQLite data types.

| Flux data type                                | SQLite data type |
| :-------------------------------------------- | :--------------- |
| [float](/flux/v0.x/data-types/basic/float/)   | FLOAT            |
| [int](/flux/v0.x/data-types/basic/int/)       | INT              |
| [uint](/flux/v0.x/data-types/basic/uint/)     | INT              |
| [string](/flux/v0.x/data-types/basic/string/) | TEXT             |
| [time](/flux/v0.x/data-types/basic/time/)     | DATETIME         |
