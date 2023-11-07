---
title: clickhouse.query() function
description: >
  `clickhouse.query()` queries data from ClickHouse using specified parameters.
menu:
  flux_v0_ref:
    name: clickhouse.query
    parent: contrib/qxip/clickhouse
    identifier: contrib/qxip/clickhouse/query
weight: 301
flux/v0/tags: [inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/qxip/clickhouse/clickhouse.flux#L42-L66

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`clickhouse.query()` queries data from ClickHouse using specified parameters.



##### Function type signature

```js
(
    query: string,
    ?cors: string,
    ?format: string,
    ?limit: A,
    ?max_bytes: B,
    ?url: string,
) => stream[C] where A: Stringable, B: Stringable, C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url

ClickHouse HTTP API URL. Default is `http://127.0.0.1:8123`.



### query
({{< req >}})
ClickHouse query to execute.



### limit

Query rows limit. Defaults is `100`.



### cors

Request remote CORS headers. Defaults is `1`.



### max_bytes

Query bytes limit. Default is `10000000`.



### format

Query format. Default is `CSVWithNames`.

_For information about available formats, see [ClickHouse formats](https://clickhouse.com/docs/en/interfaces/formats/)._


## Examples

### Query ClickHouse

```js
import "contrib/qxip/clickhouse"

option clickhouse.defaultURL = "https://play@play.clickhouse.com"

clickhouse.query(query: "SELECT version()")

```

