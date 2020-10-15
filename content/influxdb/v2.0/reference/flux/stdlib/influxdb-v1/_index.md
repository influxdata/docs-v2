---
title: Flux InfluxDB v1 package
list_title: InfluxDB v1 package
description: >
  The Flux InfluxDB v1 package provides functions for managing data from an InfluxDB v1.x
  database or structured using the InfluxDB v1 data structure.
  Import the `influxdata/influxdb/v1` package.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/
menu:
  influxdb_2_0_ref:
    name: InfluxDB v1
    parent: Flux standard library
weight: 202
influxdb/v2.0/tags: [functions, influxdb-v1, package]
---

{{% note %}}
Functions from the `v1` package have moved to [`schema`](/influxdb/v2.0/reference/flux/stdlib/schema).
These functions are still available through `v1` for backwards compatibility, but are now deprecated in favor of `schema`.
{{% /note %}}

InfluxDB v1 Flux functions provide tools for managing data from an InfluxDB v1.x
database or structured using the InfluxDB v1 data structure.
Import the `influxdata/influxdb/v1` package:

```js
import "influxdata/influxdb/v1"
```

{{< children type="functions" show="pages" >}}
