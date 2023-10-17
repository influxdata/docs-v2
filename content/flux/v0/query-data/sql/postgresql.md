---
title: Query PostgreSQL
list_title: PostgreSQL
description: >
  Use [`sql.from()`](/flux/v0/stdlib/sql/from/) with the `postgres` driver to query PostgreSQL.
menu:
  flux_v0:
    name: PostgreSQL
    parent: SQL databases
weight: 101
related:
  - /flux/v0/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"
  
  sql.from(
      driverName: "postgres",
      dataSourceName: "postgresql://username:password@localhost:5432",
      query: "SELECT * FROM example_table",
  )
  ```
---

To query [PostgreSQL](https://www.postgresql.org/) with Flux:

1. Import the [`sql` package](/flux/v0/stdlib/sql/).
2. Use [`sql.from()`](/flux/v0/stdlib/sql/from/) and provide the following parameters:

    - **driverName**: postgres
    - **dataSourceName**: _See [data source name](#postgresql-data-source-name)_
    - **query**: PSQL query to execute

```js
import "sql"

sql.from(
    driverName: "postgres",
    dataSourceName: "postgresql://username:password@localhost:5432",
    query: "SELECT * FROM example_table",
)
```

---

## PostgreSQL data source name
The `postgres` driver uses the following DSN syntax (also known as a **connection string**):

```
postgres://username:password@localhost:5432/dbname?param=value
```

## PostgreSQL to Flux data type conversion
`sql.from()` converts PostgreSQL data types to Flux data types.

| PostgreSQL data type                                                        | Flux data type                                |
| :-------------------------------------------------------------------------- | :-------------------------------------------- |
| INT, BIGINT, SMALLINT, TINYINT, INT2, INT4, INT8, SERIAL2, SERIAL4, SERIAL8 | [int](/flux/v0/data-types/basic/int/)       |
| FLOAT4, FLOAT8                                                              | [float](/flux/v0/data-types/basic/float/)   |
| DATE, TIME, TIMESTAMP                                                       | [time](/flux/v0/data-types/basic/time/)     |
| BOOL                                                                        | [bool](/flux/v0/data-types/basic/bool/)     |
| TEXT                                                                        | [string](/flux/v0/data-types/basic/string/) |

{{% caption %}}
All other PostgreSQL data types are converted to strings.
{{% /caption %}}
