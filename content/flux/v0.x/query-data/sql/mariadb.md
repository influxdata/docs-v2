---
title: Query MariaDB
list_title: MariaDB
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) with the `mysql` driver to query MariaDB.
menu:
  flux_0_x:
    name: MariaDB
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

To query [MariaDB](https://mariadb.org/) with Flux:

1. Import the [`sql` package](/flux/v0.x/stdlib/sql/).
2. Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) and provide the following parameters:

    - **driverName**: mysql
    - **dataSourceName**: _See [data source name](#mariadb-data-source-name)_
    - **query**: SQL query to execute

```js
import "sql"

sql.from(
  driverName: "mysql",
  dataSourceName: "user:password@tcp(localhost:3306)/db",
  query: "SELECT * FROM example_table"
)
```

---

## MariaDB data source name
The `mysql` driver uses the following data source name (DSN) syntax (also known as a **connection string**):

```
username:password@tcp(localhost:3306)/dbname?param=value
```

## MariaDB to Flux data type conversion
`sql.from()` converts MariaDB data types to Flux data types.

| MariaDB data type              | Flux data type                                |
| :----------------------------- | :-------------------------------------------- |
| INT, BIGINT, SMALLINT, TINYINT | [int](/flux/v0.x/data-types/basic/int/)       |
| FLOAT, DOUBLE                  | [float](/flux/v0.x/data-types/basic/float/)   |
| DATETIME                       | [time](/flux/v0.x/data-types/basic/time/)     |
| STRING                         | [string](/flux/v0.x/data-types/basic/string/) |

{{% caption %}}
All other MariaDB data types are converted to strings.
{{% /caption %}}
