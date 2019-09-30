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

## Save your query as a dashboard cell or task

**To save your query**:

1. Click **Save as** in the upper right.
2. Click **Dashboard Cell** to add your query to a dashboard.
3. Click **Task** to save your query as a task.
