---
title: Update an organization
seotitle: Update an organization in InfluxDB
description: >
  Update an organization's name and assets in InfluxDB using the InfluxDB UI or
  the influx CLI.
menu:
  influxdb3_cloud_serverless:
    name: Update an organization
    parent: Manage organizations
weight: 103
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to update an organization.

> [!Note]
> If you change an organization name, be sure to update the organization connection
> credential in clients that connect to your {{< product-name >}} organization.

## Update an organization in the InfluxDB UI

1. In the top navigation menu, click the drop-down menu with the same of your
    organization.
2. Click **{{% icon "cog" %}} Settings**.
2. Click **{{< icon "edit" >}} Rename**. A verification window appears.
3. Review the information, and then click **I understand, let's rename my organization**.
4. Enter a new name for your organization, and then click **Change organization name**.

## Update an organization using the influx CLI

Use the [`influx org update` command](/influxdb/cloud/reference/cli/influx/org/update)
to update an organization. Updating an organization requires the following:

- The org ID _(provided in the output of `influx org list`)_

##### Update the name of a organization

```sh
# Syntax
influx org update -i <org-id> -n <new-org-name>

# Example
influx org update -i 034ad714fdd6f000 -n my-new-org
```
