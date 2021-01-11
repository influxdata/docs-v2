---
title: Flux InfluxDB package
list_title: InfluxDB package
description: >
  The Flux InfluxDB package provides additional functions for querying data from InfluxDB.
  Import the `contrib/jsternberg/influxdb` package.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/influxdb/
  - /influxdb/cloud/reference/flux/stdlib/contrib/influxdb/
menu:
  influxdb_2_0_ref:
    name: InfluxDB
    identifier: contrib_influxdb
    parent: Contributed
weight: 202
influxdb/v2.0/tags: [functions, package, query]
---

The Flux InfluxDB package provides additional functions for querying data from InfluxDB.
Import the `contrib/jsternberg/influxdb` package:

```js
import "contrib/jsternberg/influxdb"
```

{{< children type="functions" show="pages" >}}

{{% note %}}
#### Package author and maintainer
**Github:** [@jsternberg](https://github.com/jsternberg)  
**InfluxDB Slack:** [@Jonathan Sternberg](https://influxdata.com/slack)
{{% /note %}}
