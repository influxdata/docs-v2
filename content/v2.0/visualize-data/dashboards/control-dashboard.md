---
title: Control a dashboard
seotitle: Control an InfluxDB dashboard
description: Control an InfluxDB dashboard in the InfluxDB user interface (UI).
v2.0/tags: [dashboards]
menu:
  v2_0:
    name: Control a dashboard
    parent: Manage dashboards
weight: 203
---

## Control at the dashboard level

Use dashboard controls in the upper right to update your dashboard.

### Add a cell

Click **Add Cell** to open the Data Explorer and configure a new cell for your dashboard.

For details on using the Data Explorer, see [Explore metrics](/v2.0/visualize-data/explore-metrics/).

### Add a note

1. Click **Add Note** to add a note cell to your dashboard.
2. Enter your note in Markdown in the left pane. A preview appears in the right pane.
3. Enable the **Show note when query returns no data** option to show the note only when the query displays no data.
4. Click **Save**.

### Select timezone

Click the timezone dropdown to select a timezone to use for the dashboard. Select either the local time (default) or UTC.

{{< img-hd src="/img/timezone.png" alt="Select timezone" />}}

### Select auto-refresh interval

Select how frequently to refresh the dashboard's data. By default, refreshing is paused.

{{< img-hd src="/img/refresh-interval.png" alt="Select refresh interval" />}}

### Manually refresh dashboard

Click the refresh button ({{< icon "refresh" >}}) to manually refresh the dashboard's data.

### Select time range

1. Select from the time range options in the dropdown menu.

{{< img-hd src="/img/time-range.png" alt="Select time range" />}}

2. Select **Custom Time Range** to enter a custom time range with precision up to nanoseconds.
The default time range is 5m.

### Variables

Click **Variables** to display variables available for your dashboard.
For details, see [Use and manage variables](/v2.0/visualize-data/variables/)

### Presentation mode

Click the fullscreen icon to enter presentation mode.

## Control dashboard cells


### View raw data

### Visualization type selector

See <visualization types>.
