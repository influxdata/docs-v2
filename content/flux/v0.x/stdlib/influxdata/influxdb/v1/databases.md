---
title: v1.databases() function
description: The `v1.databases()` function returns a list of databases in an InfluxDB 1.7+ instance.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/databases/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/databases/
menu:
  flux_0_x_ref:
    name: v1.databases
    parent: v1
weight: 301
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema#show-databases, SHOW DATABASES in InfluxQL
introduced: 0.16.0
---

The `v1.databases()` function returns a list of databases in an **InfluxDB 1.7+ instance**.

```js
import "influxdata/influxdb/v1"

v1.databases()
```

Output includes the following columns:

- **databaseName:** Database name _(string)_
- **retentionPolicy:** Retention policy name _(string)_
- **retentionPeriod:** Retention period in nanoseconds _(integer)_
- **default:** Default retention policy for database _(boolean)_
