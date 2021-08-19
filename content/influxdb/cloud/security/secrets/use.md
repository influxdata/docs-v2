---
title: Use secrets
description: Use secrets in queries with Flux.
influxdb/cloud/tags: [secrets, security]
menu:
  influxdb_cloud:
    parent: Manage secrets
weight: 305
---

Use secrets in a Flux query to pass sensitive data like credentials.

Import the `influxdata/influxd/secrets` package and use the `secrets.get()` function
to populate sensitive data in queries with secrets from your secret store.

```js
import "influxdata/influxdb/secrets"
import "sql"

username = secrets.get(key: "POSTGRES_USERNAME")
password = secrets.get(key: "POSTGRES_PASSWORD")

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://${username}:${password}@localhost",
  query:"SELECT * FROM example-table"
)
```
