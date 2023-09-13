---
title: requests package
description: >
  The `requests` package provides functions for transferring data using the HTTP protocol.
menu:
  flux_v0_ref:
    name: requests 
    parent: experimental/http
    identifier: experimental/http/requests
weight: 31
cascade:
  flux/v0.x/tags: [http]
  introduced: 0.152.0
  deprecated: 0.173.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/http/requests/requests.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `requests` package provides functions for transferring data using the HTTP protocol.
Import the `experimental/http/requests` package:

```js
import "experimental/http/requests"
```

{{% warn %}}
#### Deprecated
This package is deprecated in favor of [`requests`](/flux/v0/stdlib/http/requests/).
Do not mix usage of this experimental package with the `requests` package as the `defaultConfig` is not shared between the two packages.
This experimental package is completely superceded by the `requests` package so there should be no need to mix them.
{{% /warn %}}

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

**Deprecated**: Experimental `requests.defaultConfig` is deprecated in favor of
[`requests.defaultConfig`](/flux/v0/stdlib/http/requests/#options).
Do not mix usage of this experimental package with the `requests` package as the `defaultConfig` is not shared between the two packages.


## Functions

{{< children type="functions" show="pages" >}}
