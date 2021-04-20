---
title: Use annotations in dashboards
description: >
  Add annotations to your dashboards to provide useful, contextual information about single points in time.
influxdb/cloud/tags: [labels]
menu:
  influxdb_cloud:
    name: Use annotations
    parent: Visualize data
weight: 104
---

Add annotations to your dashboards to provide useful, contextual information about single points in time. For example, highlight maintenance, such as sensor calibrations, or other operations for your team to reference. After an annotation is created, edit the annotation by updating the text or timestamp, or delete the annotation.

- [Create an annotation](#create-an-annotation)
- [Edit an annotation](#edit-an-annotation)
- [Delete an annotation](#delete-an-annotation)

#### Create an annotation

1. In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Select an existing dashboard to add the annotation to, or [create a new dashboard](/influxdb/v2.0/visualize-data/dashboards/create-dashboard/).
3. Click **Annotations**. The **Show Annotations** and **Enable 1-Click Annotations** options appear selected. To add an annotation, the **Enable 1-Click Annotations** option must be selected.
4. In any dashboard cell, click the point in time (within the selected graph range) to add the annotation.
  {{% note %}}
**Tip:** To move the annotation outside of the selected graph time range, you must first create the annotation, and then edit the annotation to update the timestamp as needed.
{{% /note %}}
5. On the **Add Annotation** page:
   - Verify the start time, and update if needed.
   - Enter a message (maximum of 255 characters) to associate with the selected start time.

5. Click **Save Annotation** (or press **Enter**). The annotation appears as a line at the specified start time in all dashboard cells.

#### Edit an annotation

1.  In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Open the dashboard with the annotation to edit, and then click the annotation to open it.
3. Update the text (maximum of 255 characters) or timestamp, and then click **Save Annotation** (or press **Enter**).

#### View or hide annotations

By default, annotations are visible.
Select or clear the **Show Annotations** option to hide or show annotations.

1.  In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Open a dashboard with annotations, click **Annotations**, and then do one of the following:
   - To hide annotations, clear the **Show Annotations** option.
   - To show annotations, select the **Show Annotations** option.

#### Delete an annotation

1.  In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}
2. Open a dashboard with the annotation to delete, click **Annotations**, and select the **Show Annotations** option.
3. Click the annotation line to delete, and then click **Delete**.
