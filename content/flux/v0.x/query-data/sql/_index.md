---
title: Query SQL databases
list_title: SQL databases
description: >
  To query SQL databases with Flux, import the [`sql` package](/flux/v0.x/stdlib/sql/)
  and use the [`sql.from()` function](/flux/v0.x/stdlib/sql/from/).
menu:
  flux_0_x:
    name: SQL databases
    parent: Query data sources
weight: 102
related:
  - /flux/v0.x/stdlib/sql/from/
list_code_example: |
  ```js
  import "sql"
  
  sql.from(
    driverName: "postgres",
    dataSourceName: "postgresql://user:password@localhost",
    query:"SELECT * FROM TestTable"
  )
  ```
---

To query SQL databases with Flux, import the [`sql` package](/flux/v0.x/stdlib/sql/)
and use the [`sql.from()` function](/flux/v0.x/stdlib/sql/from/).

`sql.from()` supports the following SQL databases:

{{< children type="list" >}}