---
title: Flux TICKscript package
list_title: TICKscript package
description: >
  The Flux TICKscript package provides functions to help migrate Kapacitor TICKscripts to Flux tasks.
  Import the `contrib/bonitoo-io/tickscript` package.
menu:
  influxdb_2_0_ref:
    name: TICKscript
    parent: Contributed
weight: 202
influxdb/v2.0/tags: [functions, tickscript, package]
cascade:
  introduced: 0.111.0
---

The Flux TICKscript package provides functions to help migrate Kapacitor TICKscripts to Flux tasks.
Import the `contrib/bonitoo-io/tickscript` package:

```js
import "contrib/bonitoo-io/tickscript"
```

## Functions
{{< children type="functions" show="pages" >}}

{{% note %}}
#### Package author and maintainer
**Github:** [@bonitoo-io](https://github.com/bonitoo-io), [@alespour](https://github.com/alespour)  
**InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
{{% /note %}}
