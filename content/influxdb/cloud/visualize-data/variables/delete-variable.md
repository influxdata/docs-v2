---
title: Delete a variable
seotitle: Delete a dashboard variable
description: Delete a dashboard variable in the InfluxDB user interface.
menu:
  influxdb_cloud:
    parent: Use and manage variables
weight: 205
influxdb/cloud/tags: [variables]
---

Delete an existing variable in the InfluxDB user interface (UI).

### Delete a variable

1. Click the **Settings** icon in the navigation bar.

    {{< nav-icon "settings" >}}

2. Select the **Variables** tab.
3. Hover over a variable, click the **{{< icon "trash" "v2" >}}** icon, and **Delete**.

{{% warn %}}
Once deleted, any dashboards with queries that utilize the variable will no
longer function correctly.
{{% /warn %}}
