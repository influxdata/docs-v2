---
title: Build dashboards
seotitle: Build dashboards with InfluxDB 3 Explorer
description: >
  Create InfluxDB 3 Explorer dashboards, add cells from the Data Explorer,
  arrange them in edit mode, and find, print, and share dashboards.
menu:
  influxdb3_explorer:
    name: Dashboards
weight: 6
related:
  - /influxdb3/explorer/visualize-data/
  - /influxdb3/explorer/data-explorer/
---

A dashboard is a grid of cells, each running a query and drawing the result as
a chart or table.
Click **Dashboards** in the navigation to see yours.

- [Create a dashboard](#create-a-dashboard)
- [Add a cell](#add-a-cell)
- [Change a cell](#change-a-cell)
- [Edit the layout](#edit-the-layout)
- [Find, share, and print](#find-share-and-print)
- [Manage dashboards](#manage-dashboards)

{{< children >}}

## Create a dashboard

On the **Dashboards** page, click **Create New**, enter a
**Dashboard Title**, and click **Create Dashboard**.
To create one from a file, click **Import**; see
[Import and export dashboards](/influxdb3/explorer/dashboards/grafana/).

## Add a cell

1.  On the dashboard, click **Create cell**.
    Explorer opens the [Data Explorer](/influxdb3/explorer/data-explorer/)
    with a bar that reads **Adding a cell to** _dashboard_.
2.  Write and run the query, and choose a chart type and
    [options](/influxdb3/explorer/visualize-data/chart-options/).
3.  Name the cell, and click **Save to dashboard**.

To replace an existing cell instead, choose it under **Save as**.
You can also save any Data Explorer tab with **Save to Dashboard**.

## Change a cell

Hover over a cell and open its menu:

- **Visualization…**: change the chart type and
  [options](/influxdb3/explorer/visualize-data/chart-options/).
- **Open in Data Explorer**: edit the query, and save it back to the cell.
- **Cell settings…**: change the name and description, or
  [give the cell its own time range](/influxdb3/explorer/dashboards/time-and-refresh/#give-a-cell-its-own-time).
- **Duplicate**, **Copy options**, **Paste options**, **Download PNG**,
  **Download CSV**, **Inspect**, and **Delete**.

To undo a deletion, restore an earlier
[version](/influxdb3/explorer/dashboards/versions/).
Click **Expand** on a cell to view it full screen.

## Edit the layout

Dashboards open in view mode, so cells can't be moved by accident.

1.  Click **Edit layout**.
2.  Drag cells to move them and drag their corners to resize them.
    Click **Add row** to [group cells in rows](/influxdb3/explorer/dashboards/organize/#group-cells-in-rows).
3.  Click **Save**, or **Cancel** to discard your changes.

{{< img-hd src="/img/influxdb3/explorer-dashboard-edit-mode.png" alt="Dashboard in edit mode with Add row, Cancel, and Save buttons, resize handles on each cell, and controls to move, rename, or delete each row." />}}

If you leave the page while editing, Explorer keeps your changes and returns
you to edit mode when you come back.

## Find, share, and print

- **Find a cell**: type in **Search cells, series, queries…**.
  Explorer matches cell names, queries, series, units, and more.
- **Share a link**: in the dashboard menu, select **Copy link**.
  See [Share a view](/influxdb3/explorer/dashboards/time-and-refresh/#share-a-view).
- **Full screen**: click **Enter Fullscreen**.
  Move the pointer to the top of the screen to show the toolbar; press
  <kbd>Esc</kbd> to leave.
- **Print**: in the dashboard menu, select **Print…**.

## Manage dashboards

The **Dashboards** page shows when each dashboard was updated and how many
cells it has.
Search titles and cell contents, sort the list, or use a dashboard's menu to
**Duplicate**, **Export…**, or **Delete** it.
Deleted dashboards go to [Recently deleted](/influxdb3/explorer/dashboards/versions/#restore-a-deleted-dashboard).

In **Dashboard settings…**, change the title and description, the
[shared cursor](/influxdb3/explorer/dashboards/organize/#share-the-cursor-across-cells),
and [Color series by name](/influxdb3/explorer/dashboards/organize/#color-series-by-name).
