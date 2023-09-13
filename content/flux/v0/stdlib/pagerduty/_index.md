---
title: pagerduty package
description: >
  The `pagerduty` package provides functions for sending data to PagerDuty.
menu:
  flux_v0_ref:
    name: pagerduty 
    parent: stdlib
    identifier: pagerduty
weight: 11
cascade:

  introduced: 0.43.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/pagerduty/pagerduty.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `pagerduty` package provides functions for sending data to PagerDuty.
Import the `pagerduty` package:

```js
import "pagerduty"
```



## Options

```js
option pagerduty.defaultURL = "https://events.pagerduty.com/v2/enqueue"
```
 
### defaultURL

`defaultURL` is the default PagerDuty URL used by functions in the `pagerduty` package.




## Functions

{{< children type="functions" show="pages" >}}
