---
title: Query MySQL
list_title: MySQL
description: >
  To query MySQL with Flux, import the [`sql` package](/flux/v0.x/stdlib/sql/)
  and use the [`sql.from()` function](/flux/v0.x/stdlib/sql/from/) with the `mysql` driver.
menu:
  flux_0_x:
    name: MySQL
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

To query MySQL with Flux, import the [`sql` package](/flux/v0.x/stdlib/sql/)
and use the [`sql.from()` function](/flux/v0.x/stdlib/sql/from/) with the `mysql` driver.