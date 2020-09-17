---
title: Create a template
seotitle: Create an InfluxDB dashboard template
description: Create an InfluxDB dashboard template in the InfluxDB user interface (UI).
influxdb/cloud/tags: [templates]
menu:
  influxdb_cloud:
    name: Create a template
    parent: Manage dashboard templates
weight: 201
---

## Create a template from an existing dashboard

1. In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Hover over the dashboard you want to use to create the template and click **{{< icon "gear" >}}**.
3. Click **Export**. The dashboard JSON appears in a new window.
4. Click **Save as template**.


## Clone a dashboard template

{{% note %}}
Only [user templates](/influxdb/cloud/visualize-data/templates/#dashboard-template-types) can be cloned.
{{% /note %}}

1. In the navigation menu on the left, select **Settings** > **Templates**.

    {{< nav-icon "settings" >}}

3. Select **User Templates**.

    {{< img-hd src="/img/influxdb/2-0-templates-type-select.png" alt="Select User Templates" />}}

4. Hover over the template you want to clone and click **{{< icon "clone" >}}**.
5. Click **Clone** to confirm. The cloned template appears in your list.

## Import an existing dashboard template

1. In the navigation menu on the left, select **Settings** > **Templates**.

    {{< nav-icon "settings" >}}

3. Click **Import Template** in the upper right.
4. In the window that appears:
  * Select **Upload File** to drag-and-drop or select a file.
  * Select **Paste JSON** to paste in JSON.
5. Click **Import JSON as Template**.
