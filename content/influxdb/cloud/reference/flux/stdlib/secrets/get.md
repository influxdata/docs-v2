---
title: secrets.get() function
description: >
  The `secrets.get()` function retrieves a secret from the InfluxDB secret store.
aliases:
  - /influxdb/cloud/reference/flux/functions/secrets/get/
menu:
  influxdb_cloud_ref:
    name: secrets.get
    parent: InfluxDB Secrets
weight: 202
---

The `secrets.get()` function retrieves a secret from the
[InfluxDB secret store](/influxdb/cloud/security/secrets/).

_**Function type:** Miscellaneous_

```js
import "influxdata/influxdb/secrets"

secrets.get(key: "KEY_NAME")
```

## Parameters

### key
The secret key to retrieve.

_**Data type:** String_

## Examples

### Populate sensitive credentials with secrets
```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "POSTGRES_USERNAME")
password = secrets.get(key: "POSTGRES_PASSWORD")

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://${username}:${password}@localhost",
  query:"SELECT * FROM example-table"
)
```
