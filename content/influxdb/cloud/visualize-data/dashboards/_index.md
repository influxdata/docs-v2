---
title: Manage InfluxDB dashboards
description: Create, edit, and manage custom dashboards in the InfluxDB user interface (UI).
influxdb/cloud/tags: [dashboards]
menu:
  influxdb_cloud:
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

<pre class="highlight">
https://cloud2.influxdata.com/orgs/03a2bbf46249a000/dashboards/<span class="bp" style="font-weight:bold;margin:0 .15rem">04b6b15034cc000</span>/...
</pre>

### Dashboard ID in the CLI
Use [`influx dashboards`](/influxdb/cloud/reference/cli/influx/dashboards/) to view a list of dashboards and IDs.

```sh
> influx dashboards
ID                  Name
03a2bbf46249a000    dashboard-1
03ace3a859669000    dashboard-2
```
