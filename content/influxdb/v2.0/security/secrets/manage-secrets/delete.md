---
title: Delete secrets
description: Delete secrets using the `influx` CLI or the InfluxDB API.
influxdb/v2.0/tags: [secrets, security]
menu:
  influxdb_2_0:
    parent: Manage secrets
weight: 304
---

Delete secrets using the `influx` command line interface (CLI) or the InfluxDB API.

## Delete a secret using the influx CLI
Use the [`influx secret delete` command](/influxdb/v2.0/reference/cli/influx/secret/delete/)
to delete a secret key-value pair from your organization.
Provide the secret key to delete with the `-k` or `--key` flag.

```sh
# Syntax
influx secret delete -k <secret-key>

# Example
influx secret delete -k foo
```

## Delete secrets using the InfluxDB API
Use the `POST` request method and the `orgs/{orgID}/secrets/delete` API endpoint
to delete one or more secrets.

**Include the following:**

- Your [organization ID](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id) in the request URL
- Your [authentication token](/influxdb/v2.0/security/tokens/view-tokens/) in the `Authorization` header
- An array of secret keys to delete in the request body

<!-- -->
```bash
curl -XGET http://localhost:9999/api/v2/orgs/<org-id>/secrets/delete \
  --H 'Authorization: Token YOURAUTHTOKEN'
  --data '{
  "secrets": [
    "<secret-key>"
  ]
}'
```
