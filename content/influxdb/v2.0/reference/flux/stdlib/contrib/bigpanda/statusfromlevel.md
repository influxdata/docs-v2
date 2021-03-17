---
title: bigpanda.statusFromLevel() function
description: >
  The `bigpanda.statusFromLevel()` function converts an alert level into a BigPanda status.
menu:
  influxdb_2_0_ref:
    name: bigpanda.statusFromLevel
    parent: BigPanda
weight: 202
---

The `bigpanda.statusFromLevel()` function converts an alert level into a BigPanda status.

```js
import "contrib/rhajek/bigpanda"

bigpanda.statusFromLevel(level: "crit")

// Returns "critical"
```

## Parameters

### level
({{< req >}})
Alert level.

_**Data type:** String_

##### Supported alert levels

| Alert level | BigPanda status |
|:-----------:|:---------------:|
| crit        | critical        |
| warn        | warning         |
| info        | ok              |
| ok          | ok              |

_Default BigPanda status is `critical`._


{{% note %}}
#### Package author and maintainer
**Github:** [@alespour](https://github.com/alespour), [@bonitoo-io](https://github.com/bonitoo-io)  
**InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
{{% /note %}}
