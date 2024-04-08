---
title: sql.from() function
description: >
  `sql.from()` retrieves data from a SQL data source.
menu:
  flux_v0_ref:
    name: sql.from
    parent: sql
    identifier: sql/from
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/sql/sql.flux#L142-L142

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`sql.from()` retrieves data from a SQL data source.



##### Function type signature

```js
(dataSourceName: string, driverName: string, query: string) => stream[A]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### driverName
({{< req >}})
Driver to use to connect to the SQL database.

**Supported drivers**:
- awsathena
- bigquery
- hdb
- mysql
- postgres
- snowflake
- sqlite3 _(Does not work with InfluxDB OSS or InfluxDB Cloud)_
- sqlserver
- vertica, vertigo

### dataSourceName
({{< req >}})
Data source name (DNS) or connection string used to connect
to the SQL database.



### query
({{< req >}})
Query to run against the SQL database.



