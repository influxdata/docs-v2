---
title: bigpanda.statusFromLevel() function
description: >
  The `bigpanda.statusFromLevel()` function converts an alert level into a BigPanda status.
menu:
  flux_0_x_ref:
    name: bigpanda.statusFromLevel
    parent: bigpanda
weight: 202
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/bigpanda/statusfromlevel/
  - /influxdb/cloud/reference/flux/stdlib/contrib/bigpanda/statusfromlevel/
introduced: 0.108.0
---

The `bigpanda.statusFromLevel()` function converts an alert level into a BigPanda status.

```js
import "contrib/rhajek/bigpanda"

bigpanda.statusFromLevel(level: "crit")

// Returns "critical"
```

## Parameters

### level {data-type="string"}
({{< req >}})
Alert level.

##### Supported alert levels

| Alert level | BigPanda status |
|:-----------:|:---------------:|
| crit        | critical        |
| warn        | warning         |
| info        | ok              |
| ok          | ok              |

_All other alert levels return a `critical` BigPanda status._
