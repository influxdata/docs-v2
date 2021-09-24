---
title: Write to CockroachDB
list_title: CockroachDB
description: >
  Use [`sql.to()`](/flux/v0.x/stdlib/sql/to/) with the `postgres` driver to
  write data to CockroachDB.
menu:
  flux_0_x:
    name: CockroachDB
    parent: write-to-sql
    identifier: write-cockroachdb
weight: 101
related:
  - /flux/v0.x/stdlib/sql/to/
list_code_example: |
  ```js
  import "sql"
  
  data
    |> sql.to(
      driverName: "postgres",
      dataSourceName: "postgresql://username:password@localhost:26257/cluster_name.defaultdb?sslmode=verify-full&sslrootcert=certs_dir/cc-ca.crt",
      table: "example_table"
    )
  ```
---

To write data to [CockroachDB](https://www.cockroachlabs.com/) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Pipe-forward data into [`sql.to()`](/flux/v0.x/stdlib/sql/to/) and provide
   the following parameters:

    - **driverName**: postgres
    - **dataSourceName**: _See [data source name](#cockroachdb-data-source-name)_
    - **table**: Table to write to
    - **batchSize**: Number of parameters or columns that can be queued within
      each call to `Exec` (default is `10000`)

```js
import "sql"

data
  |> sql.to(
    driverName: "postgres",
    dataSourceName: "postgresql://username:password@localhost:26257/cluster_name.defaultdb?sslmode=verify-full&sslrootcert=certs_dir/cc-ca.crt",
    table: "example_table"
  )
```

---

## CockroachDB data source name
The `postgres` driver uses the following DSN syntax (also known as a **connection string**):

```
postgres://username:password@localhost:26257/cluster_name.defaultdb?sslmode=verify-full&sslrootcert=certs_dir/cc-ca.crt
```

{{% note %}}
The `postgres` driver uses the [Go `pq` implementation](https://www.cockroachlabs.com/docs/stable/build-a-go-app-with-cockroachdb-pq)
to interact with CockroachDB.
{{% /note %}}

## Flux to CockroachDB data type conversion
`sql.to()` converts Flux data types to PostgreSQL and CockroachDB data types.

| Flux data type                                | CockroachDB data type |
| :-------------------------------------------- | :-------------------- |
| [float](/flux/v0.x/data-types/basic/float/)   | FLOAT                 |
| [int](/flux/v0.x/data-types/basic/int/)       | BIGINT                |
| [uint](/flux/v0.x/data-types/basic/uint/)     | BIGINT                |
| [string](/flux/v0.x/data-types/basic/string/) | TEXT                  |
| [bool](/flux/v0.x/data-types/basic/bool/)     | BOOL                  |
| [time](/flux/v0.x/data-types/basic/time/)     | TIMESTAMP             |
