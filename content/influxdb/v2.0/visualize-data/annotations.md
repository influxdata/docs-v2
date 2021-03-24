---
title: Use annotations in dashboards
description: >
  Add annotations to your dashboards to provide useful, contextual information about single points in time.
influxdb/v2.0/tags: [labels]
menu:
  influxdb_2_0:
    name: Use annotations
    parent: Visualize data
weight: 104
---

Add annotations to your dashboards to provide useful, contextual information about single points in time.

#### Create an annotation

1. In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Select an existing dashboard to add the annotation to, or [create a new dashboard](/influxdb/v2.0/visualize-data/dashboards/create-dashboard/).
3. Click **Annotations**. The **Show Annotations** and **Enable 1-Click Annotations** options appear selected. To add an annotation, the **Enable 1-Click Annotations** option must be selected.
4. In any dashboard cell, click the point in time to add the annotation.
5. On the **Add Annotation** page:
   - Verify the start time, and update if needed.
   - Enter a message to associate with the selected start time.

5. Click **Save Annotation**. The annotation appears as a line at the specified start time in all dashboard cells.

<!-->
TBD not yet implemented
#### Edit an annotation

1.  In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Open the dashboard with the annotation to edit, and then click the annotation to open it.
3. Update the text (or timestamp?), and then click **Save Annotation**.
-->

#### View or hide annotations

By default, annotations are visible.
Select or clear the **Show Annotations** option to hide or show annotations.

1.  In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Open a dashboard with annotations, click **Annotations**, and then do one of the following:
   - To hide annotations, clear the **Show Annotations** option.
   - To show annotations, select the **Show Annotations** option.

<!-->

TBD not yet implemented
#### Delete an annotation

1.  In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}
2. Open a dashboard with the annotation to delete, click **Annotations**, and select the **Show Annotations** option.
3. Click the annotation line to delete, and then click **Delete**.

-->
