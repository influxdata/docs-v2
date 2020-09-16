---
title: Export a dashboard
seotitle: Export an InfluxDB dashboard
description: >
  Export a dashboard using the InfluxDB user interface (UI).
influxdb/v2.0/tags: [dashboards]
menu:
  influxdb_2_0:
    name: Export a dashboard
    parent: Manage dashboards
weight: 203
---

InfluxDB lets you export dashboards from the InfluxDB user interface (UI).

1. In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Hover over a dashboard and click the gear icon (**{{< icon "gear" >}}**),
   and then select **Export**.
3. Review the JSON in the window that appears.
4. Select one of the following options:
  * **Download JSON**: Download the dashboard as a JSON file.
  * **Save as template**: Save the JSON as a dashboard template.
  * **Copy to Clipboard**: Copy the JSON to your clipboard.
