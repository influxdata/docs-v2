---
title: sql.to() function
description: >
  `sql.to()` writes data to an SQL database.
menu:
  flux_v0_ref:
    name: sql.to
    parent: sql
    identifier: sql/to
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/sql/sql.flux#L176-L182

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`sql.to()` writes data to an SQL database.



##### Function type signature

```js
(
    <-tables: stream[A],
    dataSourceName: string,
    driverName: string,
    table: string,
    ?batchSize: int,
) => stream[A]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### driverName
({{< req >}})
Driver used to connect to the SQL database.

**Supported drivers**:
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
Data source name (DNS) or connection string used
to connect to the SQL database.



### table
({{< req >}})
Destination table.



### batchSize

Number of parameters or columns that can be queued within each
call to `Exec`. Default is `10000`.

If writing to SQLite database, set the batchSize to `999` or less.

### tables

Input data. Default is piped-forward data (`<-`).



