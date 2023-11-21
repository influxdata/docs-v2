---
title: prometheus package
description: >
  The `prometheus` package provides tools for working with
  [Prometheus-formatted metrics](https://prometheus.io/docs/instrumenting/exposition_formats/).
menu:
  flux_v0_ref:
    name: prometheus 
    parent: experimental
    identifier: experimental/prometheus
weight: 21
cascade:
  flux/v0/tags: [prometheus]
  introduced: 0.50.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/prometheus/prometheus.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `prometheus` package provides tools for working with
[Prometheus-formatted metrics](https://prometheus.io/docs/instrumenting/exposition_formats/).
Import the `experimental/prometheus` package:

```js
import "experimental/prometheus"
```




## Functions

{{< children type="functions" show="pages" >}}
