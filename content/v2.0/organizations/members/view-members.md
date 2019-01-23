---
title: View members
seotitle: View members of an organization in InfluxDB
description: placeholder
menu:
  v2_0:
    name: View members
    parent: Manage members
    weight: 2
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to view members of an organization.

## View members of organization in the InfluxDB UI

1. Click the **Organizations** tab in the navigation bar.

    {{< img-hd src="/img/organizations-icon.png" title="Organizations icon" />}}

2. Click on the name of an organization, then select the **Members** tab.

_Complete content coming soon_

## View members of organization using the influx CLI

Use the the [`influx org members list` command](/v2.0/reference/cli/influx/org/members/list)
to list members of an organization. Listing an organization's members requires the following:

- The name or ID of the organization

```sh
# Pattern
influx org members list -n <org-name>

# Example
influx org members list -n my-org
```
