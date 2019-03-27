---
title: Create a dashboard
seotitle: Create an InfluxDB dashboard
description: >
  Create a new dashboard or import an existing dashboard in the
  InfluxDB user interface (UI).
v2.0/tags: [dashboards]
menu:
  v2_0:
    name: Create a dashboard
    parent: Manage dashboards
weight: 201
---

## Create a dashboard

**To create a new dashboard**:

1. Click the **Dashboards** icon in the navigation bar.

  {{< nav-icon "dashboards" >}}

2. Click the **+Create Dashboard** menu in the upper right and select **New Dashboard**.
3. Enter a name for your dashboard in the **Name this dashboard** field in the upper left.

**To import an existing dashboard**:

1. Click the **Dashboards** icon in the navigation bar.

  {{< nav-icon "dashboards" >}}

2. Click the **Create Dashboard** menu in the upper right and select **Import Dashboard**.
3. In the window that appears:
  * Select **Upload File** to drag-and-drop or select a file.
  * Select **Paste JSON** to paste in JSON, then click **Import JSON as Dashboard**.
4.

## Clone a dashboard

1. Hover over the dashbaord name in the list of dashboard to show options.
2. Click **Clone**. The cloned dashboard opens.

    ![Clone a dashboard](/img/2-0-dashboard-clone.png)

<!-- ## Import a dashboard -->

#### Add data to your dashboard

1. From your dashboard, click **Add Cell** (**{{< icon "add-cell" >}}**) in the upper right. The Data Explorer overlay opens.
2. Create a query in the Data Explorer following the instructions in [Explore metrics](/v2.0/visualize-data/explore-metrics).
3. Enter a name for your cell in the upper left.
4. Click the checkmark icon (**{{< icon "checkmark" >}}**) to save the cell to your dashboard.
You can also send data to your dashboard directly from the Data Explorer. For details, [Explore metrics](/v2.0/visualize-data/explore-metrics).

#### Add a note to your dashboard
1. From your dashboard, click **Add Note** in the upper right.
2. Enter your note in the window that appears. You can use Markdown syntax to format your note.
3. To preview your Markdown formatting, click the **Preview** option.
4. Click **Save**.
