---
title: Flux Prometheus package
list_title: Prometheus package
description: >
  The Flux Prometheus package provides functions for working with Prometheus-formatted metrics.
  Import the `experimental/prometheus` package.
menu:
  influxdb_2_0_ref:
    name: Prometheus
    parent: Experimental
weight: 301
influxdb/v2.0/tags: [functions, prometheus, package]
---

Flux Prometheus functions provide tools for working with
[Prometheus-formatted metrics](https://prometheus.io/docs/instrumenting/exposition_formats/).
Import the `experimental/prometheus` package:

```js
import "experimental/prometheus"
```

{{< children type="functions" show="pages" >}}
