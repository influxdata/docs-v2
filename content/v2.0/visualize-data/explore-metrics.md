---
title: Explore metrics with InfluxDB
description: >
  Explore and visualize your data in InfluxDB's Data Explorer.
  The InfluxDB user interface (UI) allows you to move seamlessly between using the
  Flux builder and manually editing the query.
menu:
  v2_0:
    name: Explore metrics
    parent: Visualize data
weight: 101
---

Explore and visualize your data in the **Data Explorer**.
The InfluxDB user interface (UI) allows you to move seamlessly between using the
Flux builder or templates and manually editing the query.
Choose between [visualization types](/v2.0/visualize-data/visualization-types/) for your query.

To open the **Data Explorer**, click the **Data Explorer** icon in the navigation bar:

{{< nav-icon "data-explorer" >}}

## Explore data with Flux

Flux is InfluxData's functional data scripting language designed for querying,
analyzing, and acting on time series data.
See [Get started with Flux](/v2.0/query-data/get-started) to learn more about Flux.

1. Click the **Data Explorer** icon in the sidebar.

    {{< nav-icon "data-explorer" >}}

2. Use the Flux builder in the bottom panel to select a bucket and filters such as measurement, field or tag.
   Alternatively, click **Script Editor** to manually edit the query.
   To switch back to the query builder, click **Query Builder**. Note that your updates from the Script Editor will not be saved.
3. Use the **Functions** list to review the available Flux functions.
   Click on a function from the list to add it to your query.
4. Click **Submit** to run your query. You can then preview your graph in the above pane.
5. To work on multiple queries at once, click the {{< icon "plus" >}} to add another tab.
  * Click the eye icon on a tab to hide or show a query's visualization.
  * Click on the name of the query in the tab to rename it.

## Visualize your query

Select from available [visualization types](/v2.0/visualize-data/visualization-types/) or enable the **View Raw Data** option to view all of your query's results.

1. Select a visualization type from the dropdown menu in the upper-left.

    {{< img-hd src="/img/2-0-visualization-dropdown.png" title="Visualization dropdown" />}}

2. Select the **Visualization** tab at the bottom of the **Data Explorer**.
   For details about all of the available visualization options, see
   [Visualization types](/v2.0/visualize-data/visualization-types/).

## Control your dashboard cell

From the cell editor overlay, use the controls in the lower pane to control your dashboard.

### View raw data

Toggle the **View Raw data** {{< icon "toggle" >}} option to see your data in table format instead of a graph. Use this option when data can't be visualized using a visualization type.

 {{< img-hd src="/img/view-raw-data.png" alt="View raw data" />}}

### Save as CSV

Click the CSV icon to save the cells contents as a CSV file.

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

### Query Builder or Script Editor

Click **Query Builder** to use the builder to create a Flux query. Click **Script Editor** to manually edit the query.

## Save your query as a dashboard cell or task

**To save your query**:

Click **Save as** in the upper right, then:
- To add your query to a dashboard, click **Dashboard Cell**.
- To save your query as a task, click **Task**.
- To save your query as a variable, click **Variable**.
