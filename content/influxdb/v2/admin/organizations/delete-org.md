---
title: Delete an organization
seotitle: Delete an organization from InfluxDB
description: Delete an existing organization from InfluxDB using the influx CLI.
menu:
  influxdb_v2:
    name: Delete an organization
    parent: Manage organizations
weight: 104
aliases:
  - /influxdb/v2/organizations/delete-org/
---

Use the `influx` command line interface (CLI)
to delete an organization.

<!--
## Delete an organization in the InfluxDB UI

1. In the navigation menu on the left, click the **Account dropdown**.

    {{< nav-icon "account" >}}

  The list of organizations appears.

2. Hover over an organization's name, click **Delete**, and then **Confirm**.
-->

## Delete an organization using the influx CLI

Use the [`influx org delete` command](/influxdb/v2/reference/cli/influx/org/delete)
to delete an organization. Provide the following:

- An [operator token](/influxdb/v2/admin/tokens/#operator-token) using your
  [`influx` CLI connection configuration](/influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials),
  `INFLUX_TOKEN` environment variable, or the `--token, -t` flag.
- The [ID of the organization](/influxdb/v2/admin/organizations/view-orgs/#view-your-organization-id)
  to delete

{{% code-placeholders "ORG_ID" %}}
```sh
influx org delete -i ORG_ID
```
{{% /code-placeholders %}}

Replace {{% code-placeholder-key %}}`ORG_ID`{{% /code-placeholder-key %}} with
the ID of the organization to delete.
