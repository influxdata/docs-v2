---
title: Control a dashboard
seotitle: Control an InfluxDB dashboard
description: Control an InfluxDB dashboard in the InfluxDB user interface (UI).
influxdb/cloud/tags: [dashboards]
menu:
  influxdb_cloud:
    name: Control a dashboard
    parent: Manage dashboards
weight: 203
---

1. In the navigation menu on the left, select **Boards** (**Dashboards**).

    {{< nav-icon "dashboards" >}}

2. Double-click a dashboard name to open it, and then do any of the following:
   - [Add a cell](#add-a-cell)
   - [Add a note](#add-a-note)
   - [Select a timezone](#select-a-timezone)
   - [Manually refresh a dashboard](#manually-refresh-a-dashboard)
   - [Automatically refresh a dashboard](#automatically-refresh-a-dashboard)
   - [Select the time range](#select-the-time-range)
   - [Add variables](#add-variables)
   - [View in presentation mode](#view-in-presentation-mode)
   - [Toggle dark mode and light mode](#toggle-dark-mode-and-light-mode)

### Add a cell

1. Click **{{< icon "add-cell" >}} Add Cell** in the upper left hand corner to open the Data Explorer and configure a new cell for your dashboard.
2. Click **Name this cell** , and enter a cell name.
3. Create and submit your query.
4. Click the **{{< icon "checkmark" >}} check mark** in the upper right hand corner to add the cell to the dashboard.

For details on using the Data Explorer, see [Explore metrics](/influxdb/cloud/visualize-data/explore-metrics/).

### Add a note

1. Click **{{< icon "note" >}} Add Note** to add a note cell to your dashboard.
2. Enter your note in Markdown in the left pane. A preview appears in the right pane.
3. Click **Save**.

### Select a timezone

- From the timezone drop-down list, select the timezone to use for the dashboard--**Local** (default) or **UTC**.

  {{< img-hd src="/img/influxdb/2-0-controls-timezone.png" alt="Select timezone" />}}

### Manually refresh a dashboard

- Click the refresh button (**{{< icon "refresh" >}}**) to manually refresh the dashboard's data.

### Automatically refresh a dashboard

1. Click **Set Auto Refresh**, and then configure the following options:
   - Select **Indefinite** to automatically refresh continuously, or select **Custom** to set a time to stop automatically refreshing.
   -  **Refresh Interval**: Enter how frequently the dashboard should refresh.
   -  **Inactivity Timeout**: Set how long the user should be inactive for the dashboard to time out and stop automatically refreshing.
2. Click **Confirm** to save your changes.
### Select the time range

1. Select from the time range options from the list.
2. Select **Custom Time Range** to enter a custom time range with precision up to nanoseconds.
The default time range is 5 minutes.

   {{% note %}} The custom time range uses the selected timezone (local time or UTC).
   {{% /note %}}

### Add variables

- Click **Show Variables** to display variables available for your dashboard. For details, see [Use and manage variables](/influxdb/cloud/visualize-data/variables/).

### View in presentation mode

- Click the ellipsis button, and then select **Presentation Mode** to enter presentation mode. Presentation mode lets you view a dashboard in full screen, hiding the left and top navigation menus so only the cells appear. This mode might be helpful, for example, for stationary screens dedicated to monitoring visualizations.

### Toggle dark mode and light mode

- Click the ellipsis button, and then select the moon or sun icons to toggle your dashboard between **dark mode** and **light mode.**

  {{< img-hd src="/img/influxdb/2-0-controls-dark-light-mode.png" alt="Dark & light mode"/>}}
