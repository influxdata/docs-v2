---
title: Delete an organization
seotitle: Delete an organization from InfluxDB
description: placeholder
menu:
  v2_0:
    name: Delete an organization
    parent: Manage organizations
    weight: 4
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to create an organization.

## Delete an organization in the InfluxDB UI

1. Click the **Organizations** tab in the navigation bar.

    {{< img-hd src="/img/organizations-icon.png" title="Organizations icon" />}}

_Complete content coming soon_

## Delete an organization using the influx CLI

Use the the [`influx org delete` command](/v2.0/reference/cli/influx/org/delete)
to delete an organization. Deleting a organization requires the following:

- The organization ID _(provided in the output of `influx org find`)_

```sh
# Pattern
influx org delete -i <org-id>

# Example
influx org delete -i 034ad714fdd6f000
```
