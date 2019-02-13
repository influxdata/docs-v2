---
title: Manage InfluxDB dashboards
description: Create, edit, and manage custom dashboards in the InfluxDB user interface (UI).
v2.0/tags: [dashboards]
menu:
  v2_0:
    name: Manage dashboards
    parent: Visualize data
weight: 101
---

Create, edit, and manage dashboards from the **Dashboards** tab in the left navigation.

{{< img-hd src="/img/dashboards-icon.png" title="Dashboard icon" />}}

Variable names changed--instead of dashboard time, it's time range start/time range end (double-check).
Window interval replaces interval
Save as somewhere--same as send to dashboard
Also save as dashboard/save as tasks
Multiple tabs, hide/show tabs, rename tabs


## Create a dashboard

**To create a dashboard**:

1. Click the **Dashboards** icon in the navigation bar.
2. Click the **+Create Dashboard** button in the upper right.
3. Enter a name for your dashboard in the **Name this dashboard** field in the upper left.

#### Add data to your dashboard

1. From your dashboard, click **Add Cell** in the upper right. The Data Explorer overlay opens.
2. Create a query in the Data Explorer following the instructions in [Exlpore metrics](/v2.0/visualize-data/explore-metrics).
3. Enter a name for your cell in the upper left.
4. Click the checkmark icon to save the cell to your dashboard.

You can also send data to your dashboard directly from the Data Explorer. For details, see <<link to data explorer article>>.

#### Add a note to your dashboard
1. From your dashboard, click **Add Note** in the upper right.
2. Enter your note in the window that appears. You can use Markdown syntax to format your note.
3. To preview your Markdown formatting, click the **Preview** option.
4. Click **Save**.


## Modify a dashboard

#### Delete a dashboard
1. Hover over the dashboard name in the list of dashboards to show options.
2. Click **Delete**.    
3. Click **Confirm** to continue deleting your dashboard.

    ![Delete a dashboard](/img/dashboard-delete.png)

#### Clone a dashboard
1. Hover over the dashbaord name in the list of dashboard to show options.
2. Click **Clone**. The cloned dashboard opens.

    ![Clone a dashboard](/img/dashboard-clone.png)
