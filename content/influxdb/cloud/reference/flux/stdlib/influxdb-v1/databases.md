---
title: v1.databases() function
description: The `v1.databases()` function returns a list of databases in an InfluxDB 1.7+ instance.
menu:
  influxdb_cloud_ref:
    name: v1.databases
    parent: InfluxDB v1
weight: 301
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/schema_exploration#show-databases, SHOW DATABASES in InfluxQL
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
