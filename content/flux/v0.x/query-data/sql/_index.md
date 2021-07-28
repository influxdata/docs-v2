---
title: Query SQL databases
list_title: SQL databases
description: >
  Use [`sql.from()`](/flux/v0.x/stdlib/sql/from/) to query SQL databases with Flux.
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

{{< children type="anchored-list" >}}

{{< children readmore=true hr=true >}}