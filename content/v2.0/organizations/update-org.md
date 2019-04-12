---
title: Update an organization
seotitle: Update an organization in InfluxDB
description: Update an organization's name and assets in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  v2_0:
    name: Update an organization
    parent: Manage organizations
weight: 103
---

Use the `influx` command line interface (CLI) to update an organization.

<!---
## Update an organization in the InfluxDB UI

1. Click the **Influx** icon in the navigation bar.

    {{< nav-icon "admin" >}}

2. Click on the organization you want to update in the list.
3. To update the organization's name, select the **Options** tab.
4. To manage the organization's members, buckets, dashboards, and tasks, click on the corresponding tabs.
-->
## Update an organization using the influx CLI

Use the [`influx org update` command](/v2.0/reference/cli/influx/org/update)
to update an organization. Updating an organization requires the following:

- The org ID _(provided in the output of `influx org find`)_

##### Update the name of a organization
```sh
# Pattern
influx org update -i <org-id> -n <new-org-name>

# Example
influx org update -i 034ad714fdd6f000 -n my-new-org
```
