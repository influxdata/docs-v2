---
title: Use annotations in dashboards
description: >
  Add annotations to your InfluxDB dashboards to provide useful, contextual information about single points in time.
influxdb/cloud/tags: [labels, annotations]
menu:
  influxdb_cloud:
    name: Use annotations
    parent: Visualize data
weight: 104
---

Add annotations to your dashboards to provide useful, contextual information about single points in time. After an annotation is created, edit the annotation by updating the text or timestamp, or delete the annotation.

{{% note %}}
Annotations may be useful to highlight operations or anomalies for your team to reference.
{{% /note %}}

- [Create an annotation](#create-an-annotation)
- [Edit an annotation](#edit-an-annotation)
- [View or hide annotations](#view-or-hide-annotations)
- [Delete an annotation](#delete-an-annotation)

## Create an annotation

1. In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Select an existing dashboard to add the annotation to, or [create a new dashboard](/influxdb/cloud/visualize-data/dashboards/create-dashboard/).
3. Click **Annotations**. The **Show Annotations** option is selected by default.
4. Select the **Enable 1-Click Annotations** option, and then in any dashboard cell, click the point in time to add the annotation.
  {{% note %}}
**Tip:** To move the annotation outside of the selected graph time range, you must first create the annotation, and then [edit the annotation](#edit-an-annotation) to update the timestamp as needed.
  {{% /note %}}
5. On the **Add Annotation** page:

   1. Verify the start time, and update if needed.
   2. Enter a message (maximum of 255 characters) to associate with the selected start time.
   3. Click **Save Annotation**. The annotation appears as a dotted line at the specified start time and includes details associated with the selected point.

## Edit an annotation

1.  In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Open the dashboard with the annotation to edit, and then click the annotation to open it.
3. Update the text (maximum of 255 characters) or timestamp, and then click **Save Annotation**.

## View or hide annotations

By default, annotations are visible.
Select or clear the **Show Annotations** option to hide or show annotations.

1.  In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Open a dashboard with annotations, click **Annotations**, and then do one of the following:
   - To hide annotations, clear the **Show Annotations** option.
   - To show annotations, select the **Show Annotations** option.

## Delete an annotation

1.  In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}
2. Open a dashboard with the annotation to delete, click the dotted annotation line, and then click **Delete Annotation**.
