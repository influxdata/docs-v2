---
title: clickhouse package
description: >
  The `clickhouse` package provides functions to query [ClickHouse](https://clickhouse.com/) using the ClickHouse HTTP API.
menu:
  flux_v0_ref:
    name: clickhouse 
    parent: contrib/qxip
    identifier: contrib/qxip/clickhouse
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

https://github.com/influxdata/flux/blob/master/stdlib/contrib/qxip/clickhouse/clickhouse.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `clickhouse` package provides functions to query [ClickHouse](https://clickhouse.com/) using the ClickHouse HTTP API.
Import the `contrib/qxip/clickhouse` package:

```js
import "contrib/qxip/clickhouse"
```



## Options

```js
option clickhouse.defaultURL = "http://127.0.0.1:8123"
```
 
### defaultURL

`defaultURL` is the default ClickHouse HTTP API URL.




## Functions

{{< children type="functions" show="pages" >}}
