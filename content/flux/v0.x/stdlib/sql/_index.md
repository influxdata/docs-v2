---
title: Flux SQL package
list_title: SQL package
description: >
  The Flux SQL package provides tools for working with data in SQL databases such
  as MySQL, PostgreSQL, Snowflake, SQLite, Microsoft SQL Server, Amazon Athena,
  and Google BigQuery.
  Import the `sql` package.
aliases:
  - /influxdb/v2.0/reference/flux/functions/sql/
  - /influxdb/v2.0/reference/flux/stdlib/sql/
  - /influxdb/cloud/reference/flux/stdlib/sql/
menu:
  flux_0_x_ref:
    name: sql
    parent: Standard library
weight: 11
flux/v0.x/tags: [functions, sql, package, mysql, postgres]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/sql/
---

SQL Flux functions provide tools for working with data in SQL databases such as:

- Amazon Athena
- Google BigQuery
- Microsoft SQL Server
- MySQL
- PostgreSQL
- Snowflake
- SQLite

Import the `sql` package:

```js
import "sql"
```

## Functions
{{< children type="functions" show="pages" >}}
