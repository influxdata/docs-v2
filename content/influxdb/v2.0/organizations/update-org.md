---
title: Update an organization
seotitle: Update an organization in InfluxDB
description: Update an organization's name and assets in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_2_0:
    name: Update an organization
    parent: Manage organizations
weight: 103
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

1. In the navigation menu on the left, click the **Org (Organization)** > **About**.

    {{< nav-icon "org" >}}

2. Click **{{< icon "edit" >}} Rename**.
3. In the window that appears, review the information and click **I understand, let's rename my organization**.
4. Enter a new name for your organization.
5. Click **Change organization name**.

## Update an organization using the influx CLI

Use the [`influx org update` command](/influxdb/v2.0/reference/cli/influx/org/update)
to update an organization. Updating an organization requires the following:

- The org ID _(provided in the output of `influx org list`)_

##### Update the name of a organization
```sh
# Syntax
influx org update -i <org-id> -n <new-org-name>

# Example
influx org update -i 034ad714fdd6f000 -n my-new-org
```
