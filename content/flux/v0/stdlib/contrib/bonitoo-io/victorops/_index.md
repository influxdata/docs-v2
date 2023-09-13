---
title: victorops package
description: >
  The `victorops` package provides functions that send events to [VictorOps](https://victorops.com/).
menu:
  flux_v0_ref:
    name: victorops 
    parent: contrib/bonitoo-io
    identifier: contrib/bonitoo-io/victorops
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

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/victorops/victorops.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `victorops` package provides functions that send events to [VictorOps](https://victorops.com/).
Import the `contrib/bonitoo-io/victorops` package:

```js
import "contrib/bonitoo-io/victorops"
```

**Note**: VictorOps is now Splunk On-Call


## Set up VictorOps
To send events to VictorOps with Flux:

1. [Enable the VictorOps REST Endpoint Integration](https://help.victorops.com/knowledge-base/rest-endpoint-integration-guide/).
2. [Create a REST integration routing key](https://help.victorops.com/knowledge-base/routing-keys/).
3. [Create a VictorOps API key](https://help.victorops.com/knowledge-base/api/).


## Functions

{{< children type="functions" show="pages" >}}
