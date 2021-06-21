---
title: Control a dashboard
seotitle: Control an InfluxDB dashboard
description: Control an InfluxDB dashboard in the InfluxDB user interface (UI).
influxdb/v2.0/tags: [dashboards]
menu:
  influxdb_2_0:
    name: Control a dashboard
    parent: Manage dashboards
weight: 203
---

## Control at the dashboard level

Use dashboard controls in the upper left to update your dashboard.

### Add a cell

Click **{{< icon "add-cell" >}} Add Cell** to open the Data Explorer and configure a new cell for your dashboard.

For details on using the Data Explorer, see [Explore metrics](/influxdb/v2.0/visualize-data/explore-metrics/).

### Add a note

1. Click **{{< icon "note" >}} Add Note** to add a note cell to your dashboard.
2. Enter your note in Markdown in the left pane. A preview appears in the right pane.
3. Enable the **Show note when query returns no data** option to show the note only when the query displays no data.
4. Click **Save**.

### Select timezone

Click the timezone dropdown to select a timezone to use for the dashboard. Select either the local time (default) or UTC.

{{< img-hd src="/img/influxdb/2-0-controls-timezone.png" alt="Select timezone" />}}

### Manually refresh dashboard

Click the refresh button (**{{< icon "refresh" >}}**) to manually refresh the dashboard's data.

#### Manually refresh a single dashboard cell

1. Click the **{{< icon "gear" >}}** on the dashboard cell you want to refresh.
2. Click **{{< icon "refresh" >}} Refresh**.

### Automatically refresh dashboard

Click **Enable Auto Refresh**. In the window that appears, configure the following options:
  - **Until**: Select **Indefinite** to automatically refresh continuously. Select **Custom** to set a time to stop automatically refreshing.
  - **Inactivity Timeout**: Set how long the dashboard should be inactive for to time out and stop automatically refreshing.
  - **Refresh Interval**: Enter how frequently the dashboard should refresh.


### Select time range

1. Select from the time range options in the dropdown menu.

    {{< img-hd src="/img/influxdb/2-0-controls-time-range.png" alt="Select time range" />}}

2. Select **Custom Time Range** to enter a custom time range with precision up to nanoseconds.
The default time range is 5 minutes.

  > The custom time range uses the selected timezone (local time or UTC).

### Add variables

Click **Variables** to display variables available for your dashboard. For details, see [Use and manage variables](/influxdb/v2.0/visualize-data/variables/)

### Presentation mode

Click the fullscreen icon (**{{< icon "fullscreen" >}}**) to enter presentation mode. Presentation mode allows you to view [a dashboard] in full screen, hiding the left and top navigation menus so only the cells appear. This mode might be helpful, for example, for stationary screens dedicated to monitoring visualizations.

### Toggle dark mode and light mode
Click the moon or sun icons to toggle your dashboard between **dark mode** and **light mode.**

{{< img-hd src="/img/influxdb/2-0-controls-dark-light-mode.png" alt="Dark & light mode"/>}}
