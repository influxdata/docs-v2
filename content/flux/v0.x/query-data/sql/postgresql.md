---
title: Query PostgreSQL
list_title: PostgreSQL
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) with the `postgres` driver to query PostgreSQL.
menu:
  flux_0_x:
    name: PostgreSQL
    parent: SQL databases
weight: 101
related:
  - /flux/v0.x/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"
  
  sql.from(
    driverName: "postgres",
    dataSourceName: "postgresql://username:password@localhost:5432",
    query: "SELECT * FROM example_table"
  )
  ```
---

To query [PostgreSQL](https://www.postgresql.org/) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) and provide the following parameters:

    - **driverName**: postgres
    - **dataSourceName**: _See [data source name](#postgresql-data-source-name)_
    - **query**: PSQL query to execute

```js
import "sql"

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://username:password@localhost:5432",
  query: "SELECT * FROM example_table"
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
| INT, BIGINT, SMALLINT, TINYINT, INT2, INT4, INT8, SERIAL2, SERIAL4, SERIAL8 | [int](/flux/v0.x/data-types/basic/int/)       |
| FLOAT4, FLOAT8                                                              | [float](/flux/v0.x/data-types/basic/float/)   |
| DATE, TIME, TIMESTAMP                                                       | [time](/flux/v0.x/data-types/basic/time/)     |
| BOOL                                                                        | [bool](/flux/v0.x/data-types/basic/bool/)     |
| TEXT                                                                        | [string](/flux/v0.x/data-types/basic/string/) |

{{% caption %}}
All other PostgreSQL data types are converted to strings.
{{% /caption %}}

## Results structure
`sql.from()` returns a [stream of tables](/flux/v0.x/get-started/data-model/#stream-of-tables)
with no grouping (all rows in a single table).
For more information about table grouping, see
[Flux data model - Restructure tables](/flux/v0.x/get-started/data-model/#restructure-tables).
