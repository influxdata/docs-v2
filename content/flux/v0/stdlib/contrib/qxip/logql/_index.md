---
title: logql package
description: >
  The `logql` package provides functions for using [LogQL](https://grafana.com/docs/loki/latest/logql/) to query a [Loki](https://grafana.com/oss/loki/) data source.
menu:
  flux_v0_ref:
    name: logql 
    parent: contrib/qxip
    identifier: contrib/qxip/logql
weight: 31
cascade:

  introduced: 0.192.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/qxip/logql/logql.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `logql` package provides functions for using [LogQL](https://grafana.com/docs/loki/latest/logql/) to query a [Loki](https://grafana.com/oss/loki/) data source.
Import the `contrib/qxip/logql` package:

```js
import "contrib/qxip/logql"
```

The primary function in this package is `logql.query_range()`

## Options

```js
option logql.defaultAPI = "/loki/api/v1/query_range"

option logql.defaultURL = "http://127.0.0.1:3100"
```
 
### defaultAPI

`defaultAPI` is the default LogQL Query Range API Path.



### defaultURL

`defaultURL` is the default LogQL HTTP API URL.




## Functions

{{< children type="functions" show="pages" >}}
