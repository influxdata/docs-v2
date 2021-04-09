---
title: Flux InfluxDB schema package
list_title: InfluxDB schema package
description: >
  The Flux InfluxDB schema package provides functions for exploring your InfluxDB data schema.
  Import the `influxdata/influxdb/schema` package.
aliases:
  - /influxdb/cloud/reference/flux/functions/influxdb-v1/
menu:
  influxdb_cloud_ref:
    name: InfluxDB Schema
    parent: Flux standard library
weight: 202
influxdb/v2.0/tags: [functions, schema, package]
introduced: 0.88.0
cascade:
  append:
    block: cloud
    content: |
      #### Supported in the InfluxDB Cloud UI
           The `schema` package can retrieve schema information from the InfluxDB Cloud user interface (UI), but **not** from the [Flux REPL](/influxdb/cloud/tools/repl/).
---

The Flux InfluxDB schema package provides functions for exploring your InfluxDB data schema.

Import the `influxdata/influxdb/schema` package:

```js
import "influxdata/influxdb/schema"
```

{{< children type="functions" show="pages" >}}
