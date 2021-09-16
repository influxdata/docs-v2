---
title: Flux alerta package
list_title: alerta package
description: >
  The Flux `alerta` package provides functions that send alerts to
  [Alerta](https://alerta.io/).
menu:
  flux_0_x_ref:
    name: alerta
    parent: bonitoo-io
weight: 202
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/alerta/
  - /influxdb/cloud/reference/flux/stdlib/contrib/alerta/
flux/v0.x/tags: [functions, alerta, package]
introduced: 0.115.0
cascade:
  append:
    block: note
    content: |
      #### Package author and maintainer
      **Github:** [@alespour](https://github.com/alespour), [@bonitoo-io](https://github.com/bonitoo-io)  
      **InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
---

The Flux `alerta` package provides functions that send alerts to
[Alerta](https://alerta.io/).
Import the `contrib/bonitoo-io/alerta` package:

```js
import "contrib/bonitoo-io/alerta"
```

## Functions
{{< children type="functions" show="pages" >}}
