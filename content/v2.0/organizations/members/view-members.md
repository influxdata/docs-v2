---
title: View members
seotitle: View members of an organization in InfluxDB
description: Review a lit of members for an organization.
menu:
  v2_0:
    name: View members
    parent: Manage members
    weight: 2
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to view members of an organization.

## View members of organization in the InfluxDB UI

* Click the **Organizations** tab in the navigation bar.

    {{< img-hd src="/img/organizations-icon.png" title="Organizations icon" />}}

* Click on the name of an organization, then select the **Members** tab. The list of organization members appears.


## View members of organization using the influx CLI

Use the [`influx org members list` command](/v2.0/reference/cli/influx/org/members/list)
to list members of an organization. Listing an organization's members requires the following:

- The name or ID of the organization

```sh
# Pattern
influx org members list -n <org-name>

# Example
influx org members list -n my-org
```
