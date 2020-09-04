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
menu:
  influxdb_2_0_ref:
    name: SQL
    parent: Flux standard library
weight: 202
influxdb/v2.0/tags: [functions, sql, package, mysql, postgres]
related:
  - /influxdb/v2.0/query-data/flux/sql/
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

{{< children type="functions" show="pages" >}}
