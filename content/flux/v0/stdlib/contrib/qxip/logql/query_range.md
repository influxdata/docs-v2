---
title: logql.query_range() function
description: >
  `logql.query_range()` queries data from a specified LogQL query within given time bounds,
  filters data by query, timerange, and optional limit expressions.
  All values are returned as string values (using `raw` mode in `csv.from`)
menu:
  flux_v0_ref:
    name: logql.query_range
    parent: contrib/qxip/logql
    identifier: contrib/qxip/logql/query_range
weight: 301
flux/v0/tags: [inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/qxip/logql/logql.flux#L66-L96

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`logql.query_range()` queries data from a specified LogQL query within given time bounds,
filters data by query, timerange, and optional limit expressions.
All values are returned as string values (using `raw` mode in `csv.from`)



##### Function type signature

```js
(
    query: string,
    ?end: A,
    ?limit: B,
    ?orgid: string,
    ?path: string,
    ?start: C,
    ?step: D,
    ?url: string,
) => stream[E] where A: Timeable, B: Stringable, C: Timeable, D: Stringable, E: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url

LogQL/qryn URL and port. Default is `http://qryn:3100`.



### path

LogQL query_range API path.



### limit

Query limit. Default is 100.



### query
({{< req >}})
LogQL query to execute.



### start

Earliest time to include in results. Default is `-1h`.

Results include points that match the specified start time.
Use a relative duration or absolute time.
For example, `-1h` or `2022-01-01T22:00:00.801064Z`.

### end

Latest time to include in results. Default is `now()`.

Results exclude points that match the specified stop time.
Use a relative duration or absolute time.
For example, `-1h` or `2022-01-01T22:00:00.801064Z`.

### step

Query resolution step width in seconds. Default is 10.

Only applies to query types which produce a matrix response.

### orgid

Optional Loki organization ID for partitioning. Default is `""`.




## Examples

### Query specific fields in a measurement from LogQL/qryn

```js
import "contrib/qxip/logql"

option logql.defaultURL = "http://qryn:3100"

logql.query_range(query: "{job=\"dummy-server\"}", start: -1h, end: now(), limit: 100)

```

