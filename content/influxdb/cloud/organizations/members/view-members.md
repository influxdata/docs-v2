---
draft: true
title: View members
seotitle: View members of an organization in InfluxDB
description: Review a list of members for an organization.
menu:
  influxdb_cloud:
    name: View members
    parent: Manage members
weight: 202
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to view members of an organization.

## View members of organization in the InfluxDB UI

In the navigation menu on the left, select **Org (Organization)** > **Members**.

{{< nav-icon "org" >}}


## View members of organization using the influx CLI

Use the [`influx org members list` command](/influxdb/cloud/reference/cli/influx/org/members/list)
to list members of an organization. Listing an organization's members requires the following:

- The name or ID of the organization

```sh
# Syntax
influx org members list -n <org-name>

# Example
influx org members list -n my-org
```
