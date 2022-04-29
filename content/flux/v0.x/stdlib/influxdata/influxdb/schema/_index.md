---
title: Flux InfluxDB schema package
list_title: schema package
description: >
  The Flux InfluxDB `schema` package provides functions for exploring your InfluxDB data schema.
  Import the `influxdata/influxdb/schema` package.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-schema/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-schema/
menu:
  flux_0_x_ref:
    name: schema
    parent: influxdb-pkg
weight: 202
flux/v0.x/tags: [functions, schema, package]
cascade:
  introduced: 0.88.0
  append:
    block: warn
    content: |
      #### Not supported in the Flux REPL
      `schema` functions can retrieve schema information when executed within
      the context of InfluxDB, but not from the [Flux REPL](/influxdb/cloud/tools/repl/).
---

The Flux InfluxDB `schema` package provides functions for exploring your InfluxDB data schema.

Import the `influxdata/influxdb/schema` package:

```js
import "influxdata/influxdb/schema"
```

## Functions
{{< children type="functions" show="pages" >}}
