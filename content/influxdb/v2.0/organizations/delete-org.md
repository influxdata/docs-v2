---
title: Delete an organization
seotitle: Delete an organization from InfluxDB
description: Delete an existing organization from InfluxDB using the influx CLI.
menu:
  influxdb_2_0:
    name: Delete an organization
    parent: Manage organizations
weight: 104
products: [oss]
---

Use the `influx` command line interface (CLI)
to delete an organization.

<!--
## Delete an organization in the InfluxDB UI

1. In the navigation menu on the left, click the **Account dropdown**.

    {{< nav-icon "account" "v2" >}}

  The list of organizations appears.

2. Hover over an organization's name, click **Delete**, and then **Confirm**.
-->

## Delete an organization using the influx CLI

Use the [`influx org delete` command](/influxdb/v2.0/reference/cli/influx/org/delete)
to delete an organization. Deleting an organization requires the following:

- The organization ID _(provided in the output of `influx org list`)_

```sh
# Syntax
influx org delete -i <org-id>

# Example
influx org delete -i 034ad714fdd6f000
```
