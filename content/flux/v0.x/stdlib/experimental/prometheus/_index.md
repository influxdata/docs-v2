---
title: Flux Prometheus package
list_title: prometheus package
description: >
  The Flux Prometheus package provides functions for working with Prometheus-formatted metrics.
  Import the `experimental/prometheus` package.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/prometheus/
  - /influxdb/cloud/reference/flux/stdlib/experimental/prometheus/
menu:
  flux_0_x_ref:
    name: prometheus
    parent: experimental
weight: 301
flux/v0.x/tags: [functions, prometheus, package]
introduced: 0.50.0
---

Flux Prometheus functions provide tools for working with
[Prometheus-formatted metrics](https://prometheus.io/docs/instrumenting/exposition_formats/).
Import the `experimental/prometheus` package:

```js
import "experimental/prometheus"
```

{{< children type="functions" show="pages" >}}
