---
title: Manage secrets
description: Manage secrets in InfluxDB with the InfluxDB API.
v2.0/tags: [secrets, security]
menu:
  v2_0:
    parent: Store secrets
weight: 201
---


Manage secrets using the InfluxDB `/org/{orgID}/secrets` API endpoint.
All secrets belong to an organization and are stored in your [secret-store](/v2.0/security/secrets/).
Include your [organization ID](/v2.0/organizations/view-orgs/#view-your-organization-id)
and [authentication token](/v2.0/security/tokens/view-tokens/) with each request.

### Add a secret
Use the `PATCH` request method to add a new secret to your organization.
Pass the secret key-value pair in the request body.

```sh
curl -XPATCH http://localhost:9999/api/v2/orgs/<org-id>/secrets \
  -H 'authorization: Token YOURAUTHTOKEN' \
  -H 'Content-type: application/json' \
  --data '{
	"<secret-key>": "<secret-value>"
}'
```

### View secret keys
Use the `GET` request method to view your organization's secrets keys.

```sh
curl -XGET http://localhost:9999/api/v2/orgs/<org-id>/secrets \
  -H 'authorization: Token YOURAUTHTOKEN'
```

### Delete a secret
Use the `POST` request method and the `orgs/{orgID}/secrets/delete` API endpoint
to delete one or more secrets.
Include an array of secret keys to delete in the requests body in the following format.

```bash
curl -XGET http://localhost:9999/api/v2/orgs/<org-id>/secrets/delete \
  --H 'authorization: Token YOURAUTHTOKEN'
  --data '{
  "secrets": [
    "<secret-key>"
  ]
}'
```

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
