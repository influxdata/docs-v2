---
title: View secret keys
description: View secret keys using the `influx` CLI or the InfluxDB API.
influxdb/cloud/tags: [secrets, security]
menu:
  influxdb_cloud:
    parent: Manage secrets
weight: 302
---

View secret keys using the InfluxDB Cloud UI, `influx` command line interface (CLI) or the InfluxDB API.

## View secret keys using the InfluxDB Cloud UI

## View secret keys using the influx CLI
Use the [`influx secret list` command](/influxdb/cloud/reference/cli/influx/secret/list/)
to list your organization's secret keys.

```sh
influx secret list
```

## View secret keys using the InfluxDB API
Use the `GET` request method and the InfluxDB `/orgs/{orgID}/secrets` API endpoint
to view your organization's secrets keys.

**Include the following:**

- Your [organization ID](/influxdb/cloud/organizations/view-orgs/#view-your-organization-id) in the request URL
- Your [authentication token](/influxdb/cloud/security/tokens/view-tokens/) in the `Authorization` header

<!-- -->
```sh
curl -XGET https://cloud2.influxdata.com/api/v2/orgs/<org-id>/secrets \
  -H 'Authorization: Token YOURAUTHTOKEN'
```
