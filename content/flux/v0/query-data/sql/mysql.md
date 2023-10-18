---
title: Query MySQL
list_title: MySQL
description: >
  Use [`sql.from()`](/flux/v0/stdlib/sql/from/) with the `mysql` driver to query MySQL.
menu:
  flux_v0:
    name: MySQL
    parent: SQL databases
weight: 101
related:
  - /flux/v0/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"
  
  sql.from(
      driverName: "mysql",
      dataSourceName: "user:password@tcp(localhost:3306)/db",
      query: "SELECT * FROM example_table",
  )
  ```
---

To query [MySQL](https://www.mysql.com/) with Flux:

1. Import the [`sql` package](/flux/v0/stdlib/sql/).
2. Use [`sql.from()`](/flux/v0/stdlib/sql/from/) and provide the following parameters:

    - **driverName**: mysql
    - **dataSourceName**: _See [data source name](#mysql-data-source-name)_
    - **query**: SQL query to execute

```js
import "sql"

sql.from(
    driverName: "mysql",
    dataSourceName: "user:password@tcp(localhost:3306)/db",
    query: "SELECT * FROM example_table",
)
```

---

## MySQL data source name
The `mysql` driver uses the following data source name (DSN) syntax (also known as a **connection string**):

```
username:password@tcp(localhost:3306)/dbname?param=value
```

## MySQL to Flux data type conversion
`sql.from()` converts MySQL data types to Flux data types.

| MySQL data type                | Flux data type                                |
| :----------------------------- | :-------------------------------------------- |
| INT, BIGINT, SMALLINT, TINYINT | [int](/flux/v0/data-types/basic/int/)       |
| FLOAT, DOUBLE                  | [float](/flux/v0/data-types/basic/float/)   |
| DATETIME                       | [time](/flux/v0/data-types/basic/time/)     |
| STRING                         | [string](/flux/v0/data-types/basic/string/) |

{{% caption %}}
All other MySQL data types are converted to strings.
{{% /caption %}}
