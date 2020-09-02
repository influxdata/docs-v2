---
title: Create a dashboard
seotitle: Create an InfluxDB dashboard
description: >
  Create a new dashboard or import an existing dashboard in the
  InfluxDB user interface (UI).
influxdb/v2.0/tags: [dashboards]
menu:
  influxdb_2_0:
    name: Create a dashboard
    parent: Manage dashboards
weight: 201
---

## Create a new dashboard

1. In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Click the **{{< icon "plus" >}} Create Dashboard** menu in the upper right and select **New Dashboard**.
3. Enter a name for your dashboard in the **Name this dashboard** field in the upper left.


**To import an existing dashboard**:

1. In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Click the **Create Dashboard** menu in the upper right and select **Import Dashboard**.
3. In the window that appears:
  * Select **Upload File** to drag-and-drop or select a file.
  * Select **Paste JSON** to paste in JSON.
4. Click **Import JSON as Dashboard**.

## Create dashboards with templates

**To create a dashboard from a template in the dashboards page**:

1. In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Click the **+Create Dashboard** menu in the upper right and select **From a Template**.
3. In the window that appears, select a template and review the template's variables and cells.
4. Click **Create Dashboard**.

**To create a dashboard from a template in the templates UI**:

1. Click the **Settings** icon in the left navigation.

    {{< nav-icon "settings" >}}

2. Select the **Templates** tab.

  - In the **Static Templates** tab, a list of pre-created templates appears.
  - In the **User Templates** tab, a list of custom user-created templates appears.

3. Hover over the name of the template you want to create a dashboard from, then click **Create**.


## Clone a dashboard

1. In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Hover over the dashboard and click **{{< icon "copy" >}}**.
3. Click **Clone**. The cloned dashboard opens.


#### Add data to your dashboard

1. From your dashboard, click **{{< icon "add-cell" >}} Add Cell**.
2. Create a query in the Data Explorer following the instructions in [Explore metrics](/influxdb/v2.0/visualize-data/explore-metrics).
3. Enter a name for your cell in the upper left.
4. Click the checkmark icon (**{{< icon "checkmark" >}}**) to save the cell to your dashboard.
You can also send data to your dashboard directly from the Data Explorer. For details, [Explore metrics](/influxdb/v2.0/visualize-data/explore-metrics).

#### Add a note to your dashboard
1. From your dashboard, click **{{< icon "note" >}} Add Note** in the upper left.
2. Enter your note in the window that appears. You can use Markdown syntax to format your note.
3. To preview your Markdown formatting, click the **Preview** option.
4. Click **Save**.
