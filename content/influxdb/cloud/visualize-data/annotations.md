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

2. Select an existing dashboard to add the annotation to, or [create a new dashboard](/influxdb/cloud/visualize-data/dashboards/create-dashboard/). The **Annotations** option is selected by default.
4. Add an annotation in a dashboard cell by doing one of the following:

   - To add an annotation to a single point in time, press Shift and click the time in the cell.
   - To add an annotation to a time range, press Shift, click the start time in the cell, and then drag your cursor to the end time.
5. On the **Add Annotation** page:

   1. Verify the time or time range, and update if needed.
   2. Enter a message (maximum of 255 characters) to associate with the selected time or time range.
   3. Click **Save Annotation**. The annotation appears in the cell (dotted line lines indicate the selected time or time range).

## Edit an annotation

1.  In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Open the dashboard with the annotation to edit, and then click the annotation to open it.
3. Update the text (maximum of 255 characters) or timestamp, and then click **Save Annotation**.

## View or hide annotations

By default, annotations are visible.
Click the **Annotations** button to hide annotations (click again to show annotations).

1.  In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Open a dashboard with annotations, click **Annotations**, and then do one of the following:
   - To hide annotations, click the **Annotations** button. The button turns grey when 
   - To show annotations, click the **Annotations** button. 

## Delete an annotation

1.  In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}
2. Open a dashboard with the annotation to delete, click the dotted annotation line, and then click **Delete Annotation**.
