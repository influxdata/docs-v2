---
title: Flux InfluxDB secrets package
list_title: secrets package
description: >
  The Flux InfluxDB `secrets` package provides functions for working with sensitive secrets managed by InfluxDB.
  Import the `influxdata/influxdb/secrets` package.
aliases:
  - /influxdb/v2.0/reference/flux/functions/secrets/
  - /influxdb/v2.0/reference/flux/stdlib/secrets/
  - /influxdb/cloud/reference/flux/stdlib/secrets/
menu:
  flux_0_x_ref:
    name: secrets
    parent: influxdb-pkg
weight: 202
flux/v0.x/tags: [functions, secrets, package, security]
---

InfluxDB `secrets` Flux functions provide tools for working with sensitive secrets managed by InfluxDB.
Import the `influxdata/influxdb/secrets` package:

```js
import "influxdata/influxdb/secrets"
```

## Functions
{{< children type="functions" show="pages" >}}
