---
title: Flux TICKscript package
list_title: tickscript package
description: >
  The Flux TICKscript package provides functions to help migrate Kapacitor TICKscripts to Flux tasks.
  Import the `contrib/bonitoo-io/tickscript` package.
menu:
  flux_0_x_ref:
    name: tickscript
    parent: bonitoo-io
weight: 202
flux/v0.x/tags: [functions, tickscript, package]
cascade:
  introduced: 0.111.0
  append:
    block: note
    content: |
      #### Package author and maintainer
      **Github:** [@bonitoo-io](https://github.com/bonitoo-io), [@alespour](https://github.com/alespour)  
      **InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
---

The Flux TICKscript package provides functions to help migrate Kapacitor TICKscripts to Flux tasks.
Import the `contrib/bonitoo-io/tickscript` package:

```js
import "contrib/bonitoo-io/tickscript"
```

## Functions
{{< children type="functions" show="pages" >}}
