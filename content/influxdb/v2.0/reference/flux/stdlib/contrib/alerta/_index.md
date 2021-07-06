---
title: Flux Alerta package
list_title: Alerta package
description: >
  The Flux Alerta package provides functions that send alerts to
  [Alerta](https://alerta.io/).
menu:
  influxdb_2_0_ref:
    name: Alerta
    parent: Contributed
weight: 202
influxdb/v2.0/tags: [functions, alerta, package]
cascade:
  append:
    block: note
    content: |
      #### Package author and maintainer
      **Github:** [@alespour](https://github.com/alespour), [@bonitoo-io](https://github.com/bonitoo-io)  
      **InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
---

The Flux Alerta package provides functions that send alerts to
[Alerta](https://alerta.io/).
Import the `contrib/bonitoo-io/alerta` package:

```js
import "contrib/bonitoo-io/alerta"
```

## Functions
{{< children type="functions" show="pages" >}}
