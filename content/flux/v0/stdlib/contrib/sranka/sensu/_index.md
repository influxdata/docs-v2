---
title: sensu package
description: >
  The `sensu` package provides functions for sending events to [Sensu Go](https://docs.sensu.io/sensu-go/latest/).
menu:
  flux_v0_ref:
    name: sensu 
    parent: contrib/sranka
    identifier: contrib/sranka/sensu
weight: 31
cascade:

  introduced: 0.90.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/sensu/sensu.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `sensu` package provides functions for sending events to [Sensu Go](https://docs.sensu.io/sensu-go/latest/).
Import the `contrib/sranka/sensu` package:

```js
import "contrib/sranka/sensu"
```

## Sensu API Key authentication

The Flux Sensu package only supports [Sensu API key authentication](https://docs.sensu.io/sensu-go/latest/api/#authenticate-with-an-api-key).
All `sensu` functions require an `apiKey` parameter to successfully authenticate with your Sensu service.
For information about managing Sensu API keys, see the [Sensu APIKeys API documentation](https://docs.sensu.io/sensu-go/latest/api/apikeys/).


## Functions

{{< children type="functions" show="pages" >}}
