---
title: Arrow Flight SQL
description: >
  The InfluxDB SQL implementation uses **Arrow Flight SQL** to query InfluxDB
  and return results.
menu:
  influxdb_clustered:
    parent: InfluxDB internals
weight: 101
related:
  - /influxdb/clustered/reference/sql/
  - /influxdb/clustered/reference/client-libraries/flight/
---

The InfluxDB SQL implementation uses [Arrow Flight SQL](https://arrow.apache.org/docs/format/FlightSql.html)
to query InfluxDB and return results.

> Arrow Flight SQL is a protocol for interacting with SQL databases using the
> Arrow in-memory format and the [Flight RPC](https://arrow.apache.org/docs/format/Flight.html)
> framework.
>
> {{% cite %}}-- [Arrow Flight SQL documentation](https://arrow.apache.org/docs/format/FlightSql.html){{% /cite %}}

Flight SQL uses the RPC methods defined in the in Flight RPC framework and provides
various commands that pair those methods with request and response messages.
The InfluxDB Flight SQL implementation supports the following Flight SQL commands:

### Flight SQL metadata commands

{{% caption %}}
_For command descriptions, see the
[Arrow Flight SQL RPC methods documentation](https://arrow.apache.org/docs/format/FlightSql.html#sql-metadata)_.
{{% /caption %}}

| Message                  |        Supported         |
| :----------------------- | :----------------------: |
| CommandGetCatalogs       | **{{% icon "check" %}}** |
| CommandGetDbSchemas      | **{{% icon "check" %}}** |
| CommandGetTables         | **{{% icon "check" %}}** |
| CommandGetTableTypes     | **{{% icon "check" %}}** |
| CommandGetSqlInfo        | **{{% icon "check" %}}** |
| CommandGetPrimaryKeys    | **{{% icon "check" %}}** |
| CommandGetExportedKeys   | **{{% icon "check" %}}** |
| CommandGetImportedKeys   | **{{% icon "check" %}}** |
| CommandGetCrossReference | **{{% icon "check" %}}** |
| CommandGetXdbcTypeInfo   |                          |

### Flight SQL query execution commands

{{% caption %}}
_For command descriptions, see the
[Arrow Flight SQL RPC methods documentation](https://arrow.apache.org/docs/format/FlightSql.html#query-execution)_.
{{% /caption %}}

| Message                                  |        Supported         |
| :--------------------------------------- | :----------------------: |
| ActionCreatePreparedStatementRequest     |                          |
| ActionCreatePreparedSubstraitPlanRequest |                          |
| ActionClosePreparedStatementRequest      |                          |
| ActionBeginTransactionRequest            |                          |
| ActionBeginSavepointRequest              |                          |
| ActionBeginSavepointResult               |                          |
| ActionEndTransactionRequest              |                          |
| ActionEndSavepointRequest                |                          |
| CommandStatementQuery                    | **{{% icon "check" %}}** |
| CommandStatementSubstraitPlan            |                          |
| CommandPreparedStatementQuery            | **{{% icon "check" %}}** |
| CommandPreparedStatementUpdate           |                          |
| ActionCancelQueryRequest                 |                          |
