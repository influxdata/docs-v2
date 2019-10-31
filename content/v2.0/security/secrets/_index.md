---
title: Store and use secrets
description:
v2.0/tags: [secrets, security]
menu:
  v2_0:
    parent: Security & authorization
weight: 102
---

There are two options for storing secrets with InfluxDB:

- By default, secrets are Base64-encoded and stored in the InfluxDB embedded key value store, [BoltDB](https://github.com/boltdb/bolt).
- You can also set up Vault to store secrets. For details, see [Store secrets in Vault](/v2.0/security/secrets/use-vault).

{{% cloud-msg %}}
By default, all secrets added to InfluxDB Cloud are stored in the InfluxDB Cloud Vault cluster.
{{% /cloud-msg %}}

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

## Add, list, and delete secrets

See [Manage secrets](/v2.0/security/secrets/manage-secrets).
