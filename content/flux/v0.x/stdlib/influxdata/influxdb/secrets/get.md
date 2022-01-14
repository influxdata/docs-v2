---
title: secrets.get() function
description: >
  The `secrets.get()` function retrieves a secret from the InfluxDB secret store.
aliases:
  - /influxdb/v2.0/reference/flux/functions/secrets/get/
  - /influxdb/v2.0/reference/flux/stdlib/secrets/get/
  - /influxdb/cloud/reference/flux/stdlib/secrets/get/
menu:
  flux_0_x_ref:
    name: secrets.get
    parent: secrets
weight: 202
flux/v0.x/tags: [security, secrets]
introduced: 0.41.0
---

The `secrets.get()` function retrieves a secret from the
[InfluxDB secret store](/{{< latest "influxdb" >}}/security/secrets/).

```js
import "influxdata/influxdb/secrets"

secrets.get(key: "KEY_NAME")
```

## Parameters

### key {data-type="string"}
The secret key to retrieve.

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
