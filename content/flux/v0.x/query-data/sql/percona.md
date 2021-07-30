---
title: Query Percona
list_title: Percona
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) with the `mysql` driver to query Percona.
menu:
  flux_0_x:
    name: Percona
    parent: SQL databases
weight: 101
related:
  - /flux/v0.x/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"
  
  sql.from(
    driverName: "mysql",
    dataSourceName: "user:password@tcp(localhost:3306)/db",
    query: "SELECT * FROM example_table"
  )
  ```
---

To query [Percona](https://www.percona.com/) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) and provide the following parameters:

    - **driverName**: mysql
    - **dataSourceName**: _See [data source name](#data-source-name)_
    - **query**: SQL query to execute

```js
import "sql"

sql.from(
  driverName: "mysql",
  dataSourceName: "user:password@tcp(localhost:3306)/db",
  query: "SELECT * FROM example_table"
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
`sql.from()` converts Percona data types to Flux data types.

| Percona data type              | Flux data type                                |
| :----------------------------- | :-------------------------------------------- |
| INT, BIGINT, SMALLINT, TINYINT | [int](/flux/v0.x/spec/types/#numeric-types)   |
| FLOAT, DOUBLE                  | [float](/flux/v0.x/spec/types/#numeric-types) |
| DATETIME                       | [time](/flux/v0.x/spec/types/#time-types)     |
| STRING                         | [string](/flux/v0.x/spec/types/#string-types) |

{{% caption %}}
All other Percona data types are converted to strings.
{{% /caption %}}
