---
title: Create an organization
seotitle: Create an organization in InfluxDB
description: Create an organization in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  v2_0:
    name: Create an organization
    parent: Manage organizations
weight: 101
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to create an organization.

{{% cloud-msg %}}
You cannot currently create additional organizations in {{< cloud-name >}}. Only the default organization is available.
{{% /cloud-msg %}}

## Create an organization in the InfluxDB UI

1. Click the **Influx** icon in the navigation bar.

    {{< nav-icon "admin" >}}

2. Select **Create Organization**.
3. In the window that appears, enter a name for the organization and associated bucket and click **Create**.

## Create an organization using the influx CLI

Use the [`influx org create` command](/v2.0/reference/cli/influx/org/create)
to create a new organization. A new organization requires the following:

- A name for the organization

```sh
# Syntax
influx org create -n <org-name>

# Example
influx org create -n my-org
```
