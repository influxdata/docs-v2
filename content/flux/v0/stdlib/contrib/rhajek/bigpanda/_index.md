---
title: bigpanda package
description: >
  The `bigpanda` package provides functions for sending alerts to [BigPanda](https://www.bigpanda.io/).
menu:
  flux_v0_ref:
    name: bigpanda 
    parent: contrib/rhajek
    identifier: contrib/rhajek/bigpanda
weight: 31
cascade:

  introduced: 0.108.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/rhajek/bigpanda/bigpanda.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `bigpanda` package provides functions for sending alerts to [BigPanda](https://www.bigpanda.io/).
Import the `contrib/rhajek/bigpanda` package:

```js
import "contrib/rhajek/bigpanda"
```



## Options

```js
option bigpanda.defaultTokenPrefix = "Bearer"

option bigpanda.defaultUrl = "https://api.bigpanda.io/data/v2/alerts"
```
 
### defaultTokenPrefix

`defaultTokenPrefix` is the default HTTP authentication scheme to use when authenticating with BigPanda.
Default is `Bearer`.



### defaultUrl

`defaultUrl` is the default [BigPanda alerts API URL](https://docs.bigpanda.io/reference#alerts-how-it-works)
for functions in the `bigpanda` package.
Default is `https://api.bigpanda.io/data/v2/alerts`.




## Functions

{{< children type="functions" show="pages" >}}
