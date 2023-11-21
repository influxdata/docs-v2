---
title: iox.sqlInterval() function
description: >
  `iox.sqlInterval()` converts a duration value to a SQL interval string.
menu:
  flux_v0_ref:
    name: iox.sqlInterval
    parent: experimental/iox
    identifier: experimental/iox/sqlInterval
weight: 201
flux/v0/tags: [sql, type-conversions]
introduced: 0.192.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/iox/iox.flux#L96-L113

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`iox.sqlInterval()` converts a duration value to a SQL interval string.

Duration values must be positive to work as a SQL interval string.

##### Function type signature

```js
(d: A) => string
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### d
({{< req >}})
Duration value to convert to SQL interval string.




## Examples

- [Convert a duration to a SQL interval](#convert-a-duration-to-a-sql-interval)
- [Use a Flux duration to define a SQL interval](#use-a-flux-duration-to-define-a-sql-interval)

### Convert a duration to a SQL interval

```js
import "experimental/iox"

iox.sqlInterval(
    d: 1y2mo3w4d5h6m7s8ms,
)// Returns 1 years 2 months 3 weeks 4 days 5 hours 6 minutes 7 seconds 8 milliseconds


```


### Use a Flux duration to define a SQL interval

```js
import "experimental/iox"

windowInterval = 1d12h
sqlQuery = "
SELECT
  DATE_BIN(INTERVAL '${iox.sqlInterval(
        d: windowInterval,
    )}', time, TIMESTAMP '2023-01-01T00:00:00Z') AS time_bin,
  COUNT(field1)
FROM
  measurement
GROUP BY
  time_bin
"

iox.sql(bucket: "example-bucket", query: sqlQuery)

```

