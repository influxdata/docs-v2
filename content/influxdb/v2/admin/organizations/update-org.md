---
title: Update an organization
seotitle: Update an organization in InfluxDB
description: Update an organization's name and assets in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_v2:
    name: Update an organization
    parent: Manage organizations
weight: 103
aliases:
  - /influxdb/v2/organizations/update-org/
---

Use the `influx` command line interface (CLI) or the InfluxDB user interface (UI) to update an organization.

Note that updating an organization's name will affect any assets that reference the organization by name, including the following:

  - Queries
  - Dashboards
  - Tasks
  - Telegraf configurations
  - Templates

If you change an organization name, be sure to update the organization in the above places as well.

## Update an organization in the InfluxDB UI

1. In the navigation menu on the left, click the user icon > **About**.

    {{< nav-icon "account" >}}

2. Click **{{< icon "edit" >}} Rename**. A verification window appears.
3. Review the information, and then click **I understand, let's rename my organization**.
4. Enter a new name for your organization, and then click **Change organization name**.

## Update an organization using the influx CLI

Use the [`influx org update` command](/influxdb/v2/reference/cli/influx/org/update)
to update an organization. Provide the following:

- An [operator token](/influxdb/v2/admin/tokens/#operator-token) using your
  [`influx` CLI connection configuration](/influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials),
  `INFLUX_TOKEN` environment variable, or the `--token, -t` flag.
- The [ID of the organization](/influxdb/v2/admin/organizations/view-orgs/#view-your-organization-id)
  to update using the `--org-id, -i` flag.
- _Optional:_ The updated name for the organization with the `--name, -n` flag.
- _Optional:_ The updated description for the organization with the
  `--description, -d` flag.

##### Update the name of an organization

{{% code-placeholders "ORG_ID|NEW_ORG_(NAME|DESCRIPTION)" %}}
```sh
influx org update \
  --org-id ORG_ID \
  --name NEW_ORG_NAME \
  --description NEW_ORG_DESCRIPTION \
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`ORG_ID`{{% /code-placeholder-key %}}:
  The ID of the organization to update.
- {{% code-placeholder-key %}}`NEW_ORG_NAME`{{% /code-placeholder-key %}}:
  The new name for the organization.
- {{% code-placeholder-key %}}`NEW_ORG_DESCRIPTION`{{% /code-placeholder-key %}}:
  The new description for the organization.
