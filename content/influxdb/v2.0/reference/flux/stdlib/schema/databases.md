---
title: schema.databases() function
description: The `schema.databases()` function returns a list of databases in an InfluxDB 1.7+ instance.
menu:
  influxdb_2_0_ref:
    name: schema.databases
    parent: InfluxDB Schema
weight: 301
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/schema_exploration#show-databases, SHOW DATABASES in InfluxQL
---

The `schema.databases()` function returns a list of databases in an **InfluxDB 1.7+ instance**.

```js
import "influxdata/influxdb/schema"

schema.databases()
```

Output includes the following columns:

- **databaseName:** Database name _(string)_
- **retentionPolicy:** Retention policy name _(string)_
- **retentionPeriod:** Retention period in nanoseconds _(integer)_
- **default:** Default retention policy for database _(boolean)_
