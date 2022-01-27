---
title: View secret keys
description: View secret keys using the InfluxDB Cloud UI, `influx` CLI, or the InfluxDB API.
influxdb/cloud/tags: [secrets, security]
menu:
  influxdb_cloud:
    parent: Manage secrets
weight: 302
aliases:
  - /influxdb/cloud/security/secrets/manage-secrets/view/
---

View secret keys using the {{< cloud-name "short" >}} UI, `influx` command line interface (CLI) or the InfluxDB API.

- [View secret keys using the InfluxDB Cloud UI](#view-secret-keys-using-the-influxdb-cloud-ui)
- [View secret keys using the influx CLI](#view-secret-keys-using-the-influx-cli)
- [View secret keys using the InfluxDB API](#view-secret-keys-using-the-influxdb-api)

## View secret keys using the InfluxDB Cloud UI

Follow the steps below to view a list of secret keys.
Only the keys will be shown, not the values.

1. In the {{< cloud-name "short" >}} UI, click **Settings**.

    {{< nav-icon "settings" >}}
2. Click on the **Secrets** tab.

From here, you can [add](/influxdb/cloud/security/secrets/manage-secrets/add/#add-a-secret-using-the-influxdb-cloud-ui),
[update](/influxdb/cloud/security/secrets/manage-secrets/update/#update-a-secret-using-the-influxdb-cloud-ui), 
and [delete](/influxdb/cloud/security/secrets/manage-secrets/delete/#delete-a-secret-using-the-influxdb-cloud-ui) secrets.

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
- Your [API token](/influxdb/cloud/security/tokens/view-tokens/) in the `Authorization` header

<!-- -->
```sh
curl -XGET https://cloud2.influxdata.com/api/v2/orgs/<org-id>/secrets \
  -H 'Authorization: Token YOUR_API_TOKEN'
```
