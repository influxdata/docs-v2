---
title: Manage secrets
description: Manage secrets in InfluxDB with the InfluxDB API.
influxdb/cloud/tags: [secrets, security]
menu:
  influxdb_cloud:
    parent: Store and use secrets
weight: 201
---

Manage secrets using

- the {{< cloud-name "short" >}} UI
- the [`influx` command line interface (CLI)](/influxdb/cloud/reference/cli/influx/) 
- or the InfluxDB API.

All secrets belong to an organization and are stored in your [secret-store](/influxdb/cloud/security/secrets/).

{{< children >}}

---

## Use secrets in a query
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
