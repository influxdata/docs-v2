---
title: Manage InfluxDB dashboards
description: Create, edit, and manage custom dashboards in the InfluxDB user interface (UI).
influxdb/v2/tags: [dashboards]
menu:
  influxdb_v2:
    name: Manage dashboards
    parent: Visualize data
weight: 102
---

Create, edit, and manage dashboards from the **Dashboards** tab in the left navigation.

{{< children >}}


## View your dashboard ID

Use the InfluxDB UI or `influx` CLI to view your dashboard ID.

### Dashboard ID in the UI

When viewing a dashboard in the InfluxDB UI, your dashboard ID appears in the URL.

{{< code-callout "04b6b15034cc000" >}}
```sh
http://localhost:8086/orgs/03a2bbf46249a000/dashboards/04b6b15034cc000/...
```
{{< /code-callout >}}

### Dashboard ID in the CLI
Use [`influx dashboards`](/influxdb/v2/reference/cli/influx/dashboards/) to view a list of dashboards and IDs.

```sh
> influx dashboards
ID                  Name
03a2bbf46249a000    dashboard-1
03ace3a859669000    dashboard-2
```
