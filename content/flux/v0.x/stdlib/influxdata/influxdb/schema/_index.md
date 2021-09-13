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
    block: cloud
    content: |
      #### Supported in the InfluxDB Cloud UI
      The `schema` package can retrieve schema information from the InfluxDB
      Cloud user interface (UI), but **not** from the [Flux REPL](/influxdb/cloud/tools/repl/).
---

The Flux InfluxDB `schema` package provides functions for exploring your InfluxDB data schema.

Import the `influxdata/influxdb/schema` package:

```js
import "influxdata/influxdb/schema"
```

## Functions
{{< children type="functions" show="pages" >}}
