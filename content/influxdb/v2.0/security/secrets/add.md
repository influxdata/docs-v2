---
title: Add secrets
description: Add secrets using the `influx` CLI or the InfluxDB API.
influxdb/v2.0/tags: [secrets, security]
menu:
  influxdb_2_0:
    parent: Manage secrets
weight: 301
---

Add secrets using the `influx` command line interface (CLI) or the InfluxDB API.

## Add a secret using the influx CLI
Use the [`influx secret update` command](/influxdb/v2.0/reference/cli/influx/secret/update/)
to add a new secret to your organization.
Provide the secret key with the `-k` or `--key` flag.
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

## Add a secret using the InfluxDB API
Use the `PATCH` request method and the `/orgs/{orgID}/secrets` API endpoint to
add a new secret to your organization.

**Include the following:**

- Your [organization ID](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id) in the request URL
- Your [API token](/influxdb/v2.0/security/tokens/view-tokens/) in the `Authorization` header
- The secret key-value pair in the request body

<!-- -->
```sh
curl --request PATCH http://localhost:8086/api/v2/orgs/<org-id>/secrets \
  --header 'Authorization: Token YOURAUTHTOKEN' \
  --header 'Content-type: application/json' \
  --data '{
	"<secret-key>": "<secret-value>"
}'
```
