---
title: Write to Vertica
list_title: Vertica
description: >
  Use [`sql.to()`](/flux/v0.x/stdlib/sql/to/) with the `vertica` driver to write
  data to Vertica.
menu:
  flux_0_x:
    name: Vertica
    parent: write-to-sql
    identifier: write-vertica
weight: 101
related:
  - /flux/v0.x/stdlib/sql/to/
  - /flux/v0.x/query-data/sql/vertica/
list_code_example: |
  ```js
  import "sql"
  
  data
    |> sql.to(
      driverName: "vertica",
      dataSourceName: "vertica://username:password@localhost:5433/dbname",
      table: "public.example_table"
    )
  ```
---

To write data to [Vertica](https://www.vertica.com/) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Pipe-forward data into [`sql.to()`](/flux/v0.x/stdlib/sql/to/) and provide
   the following parameters:

    - **driverName**: vertica or vertigo
    - **dataSourceName**: _See [data source name](#vertica-data-source-name)_
    - **table**: Table to write to
    - **batchSize**: Number of parameters or columns that can be queued within
      each call to `Exec` (default is `10000`)

```js
import "sql"
  
data
  |> sql.to(
    driverName: "vertica",
    dataSourceName: "vertica://username:password@localhost:5433/dbname",
    table: "public.example_table"
  )
```

---

## Vertica data source name
The `vertica` and `vertigo` drivers use the following DSN syntax (also known as a **connection string**):

```
vertica://<user>:<password>@<host>:<port>/<database>?<queryArgs>
```

The `vertica` and `vertigo` drivers use the `vertica/vertica-sql-go` implementation.
For information about supported DSN query arguments, see the
[`vertica/vertica-sql-go` documentation](https://github.com/vertica/vertica-sql-go#creating-a-connection).

## Flux to Vertica data type conversion
`sql.to()` converts Flux data types to Vertica data types.

| Flux data type                                | Vertica data type |
| :-------------------------------------------- | :---------------- |
| [float](/flux/v0.x/data-types/basic/float/)   | FLOAT             |
| [int](/flux/v0.x/data-types/basic/int/)       | INTEGER           |
| [uint](/flux/v0.x/data-types/basic/uint/)     | INTEGER           |
| [string](/flux/v0.x/data-types/basic/string/) | VARCHAR           |
| [bool](/flux/v0.x/data-types/basic/bool/)     | BOOL              |
| [time](/flux/v0.x/data-types/basic/time/)     | TIMESTAMP         |
