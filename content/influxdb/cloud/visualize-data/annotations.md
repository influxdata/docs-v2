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

- [Create an annotation](#create-an-annotation)
- [Edit an annotation](#edit-an-annotation)
- [View or hide annotations](#view-or-hide-annotations)
- [Delete an annotation](#delete-an-annotation)

{{% note %}}
Annotations may be useful to highlight operations or anomalies for your team to reference.
{{% /note %}}

<!-- {{< youtube 5NEplCesNAc >}} --->

## Create an annotation

1. In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Select an existing dashboard to add the annotation to, or [create a new dashboard](/influxdb/cloud/visualize-data/dashboards/create-dashboard/), and then click the **Annotations** button.
3. In a dashboard cell, do one of the following:

   - Press Shift and click the graph at the time you want to annotate.
   - To add an annotation to a time range, press Shift, click the start time, and then drag your cursor to the end time.
4. On the **Add Annotation** page:

   1. Verify the time or time range, and update if needed.
   2. Enter a message (maximum of 255 characters) to associate with the selected time or time range.
   3. Click **Save Annotation**. The annotation appears in the cell (dotted lines indicate the selected time or time range).

## Edit an annotation

1.  In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Open the dashboard with the annotation to edit, and then click the annotation to open it.
3. Update the text (maximum of 255 characters) or timestamp, and then click **Save Annotation**.

## View or hide annotations

By default, annotations are visible.

1.  In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Open a dashboard with annotations:
   - To hide annotations, click the **Annotations** button. The button is gray when annotations are hidden.
   - To show annotations, click the **Annotations** button. The button is purple when annotations are visible.

## Delete an annotation

1.  In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}
2. Open a dashboard with the annotation to delete, click the dotted annotation line, and then click **Delete Annotation**.
