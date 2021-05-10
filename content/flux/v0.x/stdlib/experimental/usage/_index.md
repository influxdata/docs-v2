---
title: Flux Experimental usage package
list_title: usage package
description: >
  The Flux experimental usage package provides tools for collecting usage and usage
  limit data from InfluxDB Cloud.
  Import the `experimental/usage` package.
menu:
  flux_0_x_ref:
    name: usage
    identifier: usage-exp
    parent: experimental
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/usage/
  - /influxdb/cloud/reference/flux/stdlib/experimental/usage/
weight: 301
flux/v0.x/tags: [functions, usage, package]
cascade:
  introduced: 0.114.0
---

The Flux experimental usage package provides tools for collecting usage and usage
limit data from **InfluxDB Cloud**.
Import the `experimental/usage` package:

```js
import "experimental/usage"
```

{{< children type="functions" show="pages" >}}
