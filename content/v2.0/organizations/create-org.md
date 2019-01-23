---
title: Create an organization
seotitle: Create an organization in InfluxDB
description: Create an organization in InfluxDB.
menu:
  v2_0:
    name: Create an organization
    parent: Manage organizations
    weight: 1
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to create an organization.

## Create an organization in the InfluxDB UI

1. Click the **Organizations** tab in the navigation bar.

    {{< img-hd src="/img/organizations-icon.png" title="Organizations icon" />}}

_Complete content coming soon_

## Create an organization using the influx CLI

Use the the [`influx org create` command](/v2.0/reference/cli/influx/org/create)
to create a new organization. A new organization requires the following:

- A name for the organization

```sh
# Pattern
influx org create -n <org-name>

# Example
influx org create -n my-org
```
