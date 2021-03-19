---
title: Use annotations in dashboards
description: >
  Add annotations to your dashboards to provide useful, contextual information about single points in time or time intervals. Use annotations to correlate the effects of important events, such as system changes or outages across multiple metrics.
influxdb/v2.0/tags: [labels]
menu:
  influxdb_2_0:
    name: Use annotations
    parent: Visualize data
weight: 104
---

Add annotations to your dashboards to provide useful, contextual information about single points in time or time intervals. Use annotations to correlate the effects of important events, such as system changes or outages across multiple metrics.

#### Create an annotation

1. In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Select the dashboard to add the annotation to. Or [create a new dashboard](/influxdb/v2.0/visualize-data/dashboards/create-dashboard/).
3. Click **Annotations**, and then search for an annotation stream (find out more/clarify).
3. _(Optional)_ Select **Enable 1-Click Annotations** to (find out more/clarify).
4. Click the gear <insert graphic> to open the Annotations tab on the Settings page.
5. Click **Create Label**.

#### Edit an annotation

1. In the label list view, click the name of the label you would like to edit.
   The **Edit Label** overlay will appear.
2. Make the desired changes to the label.
3. Click **Save Changes**.

#### View annotations

1. In the navigation menu on the left, select **Settings** > **Annotations**.
Click **{{< icon "plus" >}} Create Label**.
2. Enter a **Name** for the label.
3. Enter a description for the label _(Optional)_.
4. Select a **Color** for the label.
5. Click **Create Label**.

#### Delete an annotation

1. In the label list view, hover over the label you would like to delete and click **{{< icon "trash" >}}**.
2. Click **Delete**.

### Add annotations to a dashboard

1. In the list view of dashboards, tasks, or other assets, hover over the item to which you would like to add a label.
2. Click the {{< icon "add-label" >}} icon that appears below the name.
   The **Add Labels** overlay will appear.
3. Type the name of the label you would like to add to filter the list of available labels.
   Click the label you would like to add.
