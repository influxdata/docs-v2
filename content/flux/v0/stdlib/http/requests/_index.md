---
title: requests package
description: >
  The `requests` package provides functions for transferring data using the HTTP protocol.
menu:
  flux_v0_ref:
    name: requests 
    parent: http
    identifier: http/requests
weight: 21
cascade:
  flux/v0.x/tags: [http]
  introduced: 0.173.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/http/requests/requests.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `requests` package provides functions for transferring data using the HTTP protocol.
Import the `http/requests` package:

```js
import "http/requests"
```



## Options

```js
option requests.defaultConfig = {
    // Timeout on the request. If the timeout is zero no timeout is applied
    timeout: 0s,
    // insecureSkipVerify If true, TLS verification will not be performed. This is insecure.
    insecureSkipVerify: false,
}
```
 
### defaultConfig

`defaultConfig` is the global default for all http requests using the requests package.
Changing this config will affect all other packages using the requests package.
To change the config for a single request, pass a new config directly into the corresponding function.




## Functions

{{< children type="functions" show="pages" >}}
