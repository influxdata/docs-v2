---
title: Query CockroachDB
list_title: CockroachDB
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) with the `postgres` driver to query CockroachDB.
menu:
  flux_0_x:
    name: CockroachDB
    parent: SQL databases
weight: 101
related:
  - /flux/v0.x/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"
  
  sql.from(
    driverName: "postgres",
    dataSourceName: "postgresql://username:password@localhost:26257/cluster_name.defaultdb?sslmode=verify-full&sslrootcert=certs_dir/cc-ca.crt",
    query: "SELECT * FROM example_table"
  )
  ```
---

To query [CockroachDB](https://www.cockroachlabs.com/) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) and provide the following parameters:

    - **driverName**: postgres
    - **dataSourceName**: _See [data source name](#cockroachdb-data-source-name)_
    - **query**: PSQL query to execute

```js
import "sql"

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://username:password@localhost:26257/cluster_name.defaultdb?sslmode=verify-full&sslrootcert=certs_dir/cc-ca.crt",
  query: "SELECT * FROM example_table"
)
```

---

## CockroachDB data source name
The `postgres` driver uses the following DSN syntax (also known as a **connection string**)
to connect to CockroachDB :

```
postgres://username:password@localhost:26257/cluster_name.defaultdb?sslmode=verify-full&sslrootcert=certs_dir/cc-ca.crt
```

{{% note %}}
The `postgres` driver use the [Go `pq` implementation](https://www.cockroachlabs.com/docs/stable/build-a-go-app-with-cockroachdb-pq)
to interact with CockroachDB.
{{% /note %}}

## CockroachDB to Flux data type conversion
`sql.from()` converts PostgreSQL and CockroachDB data types to Flux data types.

| CockroachDB data type                                                        | Flux data type                                  |
| :-------------------------------------------------------------------------- | :---------------------------------------------- |
| INT, BIGINT, SMALLINT, TINYINT, INT2, INT4, INT8, SERIAL2, SERIAL4, SERIAL8 | [int](/flux/v0.x/spec/types/#numeric-types)     |
| FLOAT4, FLOAT8                                                              | [float](/flux/v0.x/spec/types/#numeric-types)   |
| DATE, TIME, TIMESTAMP                                                       | [time](/flux/v0.x/spec/types/#time-types)       |
| BOOL                                                                        | [bool](/flux/v0.x/spec/types/#boolean-types)    |
| TEXT                                                                        | [string](/flux/v0.x/spec/types/#string-types)   |

{{% caption %}}
All other CockroachDB data types are converted to strings.
{{% /caption %}}
