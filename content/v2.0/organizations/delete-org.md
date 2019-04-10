---
title: Delete an organization
seotitle: Delete an organization from InfluxDB
description: Delete an existing organization from InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  v2_0:
    name: Delete an organization
    parent: Manage organizations
weight: 104
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to create an organization.

## Delete an organization in the InfluxDB UI

1.  Click the **Influx** icon in the navigation bar.

    {{< nav-icon "admin" >}}

  The list of organizations appears.

2. Hover over an organization's name, click **Delete**, and then **Confirm**.

## Delete an organization using the influx CLI

Use the [`influx org delete` command](/v2.0/reference/cli/influx/org/delete)
to delete an organization. Deleting an organization requires the following:

- The organization ID _(provided in the output of `influx org find`)_

```sh
# Pattern
influx org delete -i <org-id>

# Example
influx org delete -i 034ad714fdd6f000
```
