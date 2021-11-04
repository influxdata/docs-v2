---
title: Flux sql package
list_title: sql package
description: >
  The Flux `sql` package provides tools for working with data in SQL databases such
  as MySQL, PostgreSQL, Snowflake, SQLite, Microsoft SQL Server, Amazon Athena,
  Google BigQuery, and more.
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
introduced: 0.34.0
---

The Flux `sql` package provides functions for working with SQL databases such as:

- Amazon RDS
- Athena
- Google BigQuery
- CockroachDB
- MariaDB
- MySQL
- Percona
- PostgreSQL
- SAP HANA
- Snowflake
- Microsoft SQL Server
- SQLite
- Vertica

Import the `sql` package:

```js
import "sql"
```

## Functions
{{< children type="functions" show="pages" >}}
