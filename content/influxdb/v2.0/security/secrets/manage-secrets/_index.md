---
title: Manage secrets
description: Manage secrets in InfluxDB with the InfluxDB API.
influxdb/v2.0/tags: [secrets, security]
menu:
  influxdb_2_0:
    parent: Store and use secrets
weight: 201
---

Manage secrets using the [`influx` command line interface (CLI)](/influxdb/v2.0/reference/cli/influx/) or the InfluxDB API.
All secrets belong to an organization and are stored in your [secret-store](/influxdb/v2.0/security/secrets/).

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
