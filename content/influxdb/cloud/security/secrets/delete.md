---
title: Delete secrets
description: Delete secrets using the {{< cloud-name "short" >}}, UI `influx` CLI, or the InfluxDB API.
influxdb/cloud/tags: [secrets, security]
menu:
  influxdb_cloud:
    parent: Manage secrets
weight: 304
aliases:
  - /influxdb/cloud/security/secrets/manage-secrets/delete/
---

Delete secrets using the {{< cloud-name "short" >}} UI, `influx` command line interface (CLI) or the InfluxDB API.

- [Delete a secret using the InfluxDB Cloud UI](#delete-a-secret-using-the-influxdb-cloud-ui)
- [Delete a secret using the influx CLI](#delete-a-secret-using-the-influx-cli)
- [Delete secrets using the InfluxDB API](#delete-secrets-using-the-influxdb-api)

## Delete a secret using the InfluxDB Cloud UI

1. In the {{< cloud-name "short" >}} UI, click **Settings**.

    {{< nav-icon "settings" >}}
2. Click the **Secrets** tab.
3. Hover over the secret you want to delete.
4. Click the {{< icon "delete" >}} button.

## Delete a secret using the influx CLI
Use the [`influx secret delete` command](/influxdb/cloud/reference/cli/influx/secret/delete/)
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

- Your [organization ID](/influxdb/cloud/organizations/view-orgs/#view-your-organization-id) in the request URL
- Your [API token](/influxdb/cloud/security/tokens/view-tokens/) in the `Authorization` header
- An array of secret keys to delete in the request body

<!-- -->
```bash
curl -XGET https://cloud2.influxdata.com/api/v2/orgs/<org-id>/secrets/delete \
  --H 'Authorization: Token YOURAUTHTOKEN'
  --data '{
  "secrets": [
    "<secret-key>"
  ]
}'
```
