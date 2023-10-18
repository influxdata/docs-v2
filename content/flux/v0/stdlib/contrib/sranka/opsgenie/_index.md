---
title: opsgenie package
description: >
  The `opsgenie` package provides functions that send alerts to
  [Atlassian Opsgenie](https://www.atlassian.com/software/opsgenie)
  using the [Opsgenie v2 API](https://docs.opsgenie.com/docs/alert-api#create-alert).
menu:
  flux_v0_ref:
    name: opsgenie 
    parent: contrib/sranka
    identifier: contrib/sranka/opsgenie
weight: 31
cascade:

  introduced: 0.84.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/sranka/opsgenie/opsgenie.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `opsgenie` package provides functions that send alerts to
[Atlassian Opsgenie](https://www.atlassian.com/software/opsgenie)
using the [Opsgenie v2 API](https://docs.opsgenie.com/docs/alert-api#create-alert).
Import the `contrib/sranka/opsgenie` package:

```js
import "contrib/sranka/opsgenie"
```




## Functions

{{< children type="functions" show="pages" >}}
