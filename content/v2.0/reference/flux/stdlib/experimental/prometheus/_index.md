---
title: Flux Prometheus package
list_title: Prometheus package
description: >
  The Flux Prometheus package provides functions for working with Prometheus-formatted metrics.
  Import the `experimental/prometheus` package.
menu:
  v2_0_ref:
    name: Prometheus
    parent: Experimental
weight: 201
v2.0/tags: [functions, prometheus, package]
---

Flux Prometheus functions provide tools for working with
[Prometheus-formatted metrics](https://prometheus.io/docs/instrumenting/exposition_formats/).

{{% warn %}}
The Prometheus package is currently experimental and is subject to change at any time.
By using it, you accept the [risks of experimental functions](/v2.0/reference/flux/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

Import the `experimental/prometheus` package:

```js
import "experimental/prometheus"
```

{{< children type="functions" show="pages" >}}
