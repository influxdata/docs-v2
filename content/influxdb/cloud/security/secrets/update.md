---
title: Update secrets
description: Update secrets using the {{< cloud-name "short" >}}, `influx` CLI, or the InfluxDB API.
influxdb/cloud/tags: [secrets, security]
menu:
  influxdb_cloud:
    parent: Manage secrets
weight: 303
---

Update secrets using the {{< cloud-name "short" >}} UI, `influx` command line interface (CLI) or the InfluxDB API.

- [Update a secret using the InfluxDB Cloud UI](#update-a-secret-using-the-influxdb-cloud-ui)
- [Update a secret using the influx CLI](#update-a-secret-using-the-influx-cli)
- [Update a secret using the InfluxDB API](#update-a-secret-using-the-influxdb-api)

## Update a secret using the InfluxDB Cloud UI

1. In the {{< cloud-name "short" >}} UI, click **Settings**.

    {{< nav-icon "settings" >}}
2. Click the **Secrets** tab.
3. Click on the secret key whose value you want to update.
4. Enter the new value, then click **Edit Secret**.

## Update a secret using the influx CLI
Use the [`influx secret update` command](/influxdb/cloud/reference/cli/influx/secret/update/)
to update a secret in your organization.
Provide the secret key to update with the `-k` or `--key` flag.
You may also provide the secret value with the `-v` or `--value` flag.
If you do not provide the secret value with the `-v` or `--value` flag,
enter the value when prompted.

{{% warn %}}
Providing a secret value with the `-v` or `--value` flag may expose the secret
in your command history.
{{% /warn %}}

```sh
# Syntax
influx secret update -k <secret-key>

# Example
influx secret update -k foo
```

## Update a secret using the InfluxDB API
Use the `PATCH` request method and the InfluxDB `/orgs/{orgID}/secrets` API endpoint
to update a secret in your organization.

**Include the following:**

- Your [organization ID](/influxdb/cloud/organizations/view-orgs/#view-your-organization-id) in the request URL
- Your [API token](/influxdb/cloud/security/tokens/view-tokens/) in the `Authorization` header
- The updated secret key-value pair in the request body

<!-- -->
```sh
curl -XPATCH https://cloud2.influxdata.com/api/v2/orgs/<org-id>/secrets \
  -H 'Authorization: Token YOURAUTHTOKEN' \
  -H 'Content-type: application/json' \
  --data '{
	"<secret-key>": "<secret-value>"
}'
```
