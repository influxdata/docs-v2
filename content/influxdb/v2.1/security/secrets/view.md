---
title: View secret keys
description: View secret keys using the `influx` CLI or the InfluxDB API.
influxdb/v2.1/tags: [secrets, security]
menu:
  influxdb_2_1:
    parent: Manage secrets
weight: 302
aliases:
  - /influxdb/v2.1/security/secrets/manage-secrets/view/
---

View secret keys using the `influx` command line interface (CLI) or the InfluxDB API.

- [View secret keys using the influx CLI](#view-secret-keys-using-the-influx-cli)
- [View secret keys using the InfluxDB API](#view-secret-keys-using-the-influxdb-api)

## View secret keys using the influx CLI
Use the [`influx secret list` command](/influxdb/v2.1/reference/cli/influx/secret/list/)
to list your organization's secret keys.

```sh
influx secret list
```

## View secret keys using the InfluxDB API
Use the `GET` request method and the InfluxDB `/orgs/{orgID}/secrets` API endpoint
to view your organization's secrets keys.

**Include the following:**

- Your [organization ID](/influxdb/v2.1/organizations/view-orgs/#view-your-organization-id) in the request URL
- Your [API token](/influxdb/v2.1/security/tokens/view-tokens/) in the `Authorization` header

<!-- -->
```sh
curl --request GET http://localhost:8086/api/v2/orgs/<org-id>/secrets \
  --header 'Authorization: Token YOURAUTHTOKEN'
```
