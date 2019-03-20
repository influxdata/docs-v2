---
title: Manage labels in the InfluxDB UI
description: >
  Labels are a way to add visual metadata to dashboards, tasks, and other items
  in the InfluxDB UI. View and manage labels in the InfluxDB user interface.
v2.0/tags: [labels]
menu:
  v2_0:
    name: Manage labels
    parent: Visualize data
weight: 101
---

Labels are a way to add visual metadata to dashboards, tasks, and other items in the InfluxDB UI.
To manage labels, click the **Configuration** icon in the navigation bar and select **Labels**.

{{< img-hd src="/img/2-0-labels-nav-link.png" title="Labels configuration" />}}

#### Create a label
1. Click **+ Create Label**.
2. Enter a **Name** for the label.
3. Select a **Color** for the lable.
4. Enter a description for the label _(Optional)_.
5. Click **Create label**.

#### Edit a label
1. In the label list view, click the name of the label you would like to edit.
   The **Edit Label** overlay will appear.
2. Make the desired changes to the label.
3. Click **Save Changes**.

#### Delete a label
1. In the label list view, hover over the label you would like to delete.
2. Click **Delete** in the far right of the label row.

### Add labels to dashboards and tasks
1. In the list view of dashboards or tasks, hover over the item to which you would like to add a label.
2. Click the {{< icon "add-label" >}} icon that appears to the right of the name.
   The **Manage Labels** overlay will appear.
3. Type the name of the label you would like to add to filter the list of available labels.
   Click the label you would like to add. More than one label can be added.
4. Click **Save Changes**.
