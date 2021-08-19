---
title: View secret keys
description: View secret keys using the `influx` CLI or the InfluxDB API.
influxdb/v2.0/tags: [secrets, security]
menu:
  influxdb_2_0:
    parent: Manage secrets
weight: 302
---

View secret keys using the `influx` command line interface (CLI) or the InfluxDB API.

## View secret keys using the influx CLI
Use the [`influx secret list` command](/influxdb/v2.0/reference/cli/influx/secret/list/)
to list your organization's secret keys.

```sh
influx secret list
```

## View secret keys using the InfluxDB API
Use the `GET` request method and the InfluxDB `/orgs/{orgID}/secrets` API endpoint
to view your organization's secrets keys.

**Include the following:**

- Your [organization ID](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id) in the request URL
- Your [API token](/influxdb/v2.0/security/tokens/view-tokens/) in the `Authorization` header

<!-- -->
```sh
curl --request GET http://localhost:8086/api/v2/orgs/<org-id>/secrets \
  --header 'Authorization: Token YOURAUTHTOKEN'
```
