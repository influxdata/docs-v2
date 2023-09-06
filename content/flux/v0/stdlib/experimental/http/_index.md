---
title: http package
description: >
  The `http` package provides functions for transferring data using HTTP protocol.
menu:
  flux_v0_ref:
    name: http 
    parent: experimental
    identifier: experimental/http
weight: 21
cascade:
  flux/v0.x/tags: [http]
  introduced: 0.39.0
  deprecated: 0.173.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/http/http.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `http` package provides functions for transferring data using HTTP protocol.
Import the `experimental/http` package:

```js
import "experimental/http"
```

{{% warn %}}
#### Deprecated
This package is deprecated in favor of [`requests`](/flux/v0/stdlib/http/requests/).
{{% /warn %}}


## Functions

{{< children type="functions" show="pages" >}}

## Packages

{{< children show="sections" >}}
