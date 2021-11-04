---
title: Manage labels in the InfluxDB UI
description: >
  Labels are a way to add visual metadata to dashboards, tasks, and other items
  in the InfluxDB UI. View and manage labels in the InfluxDB user interface.
influxdb/cloud/tags: [labels]
menu:
  influxdb_cloud:
    name: Manage labels
    parent: Visualize data
weight: 104
---

Labels are a way to add visual metadata to dashboards, tasks, and other items in the InfluxDB UI.
To manage labels:

- In the navigation menu on the left, select **Settings** > **Labels**.

    {{< nav-icon "settings" >}}


#### Create a label
1. Click **{{< icon "plus" >}} Create Label**.
2. Enter a **Name** for the label.
3. Enter a description for the label _(Optional)_.
4. Select a **Color** for the label.
5. Click **Create Label**.

#### Edit a label
1. In the label list view, click the name of the label you would like to edit.
   The **Edit Label** overlay will appear.
2. Make the desired changes to the label.
3. Click **Save Changes**.

#### Delete a label
1. In the label list view, hover over the label you would like to delete and click **{{< icon "trash" >}}**.
2. Click **Delete**.

### Add labels to dashboard items
1. In the list view of dashboards, tasks, or other assets, hover over the item to which you would like to add a label.
2. Click the {{< icon "add-label" >}} icon that appears below the name.
   The **Add Labels** overlay will appear.
3. Type the name of the label you would like to add to filter the list of available labels.
   Click the label you would like to add.
