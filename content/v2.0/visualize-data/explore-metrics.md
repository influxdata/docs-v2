---
title: Explore metrics with InfluxDB
description:
menu:
  v2_0:
    name: Explore metrics
    parent: Visualize data
    weight: 1
    parent: Placeholder parent
---

Explore and visualize your data in the **Data Explorer**. The user interface allows you to move seamlessly between using the builder or templates and manually editing the query; when possible, the interface automatically populates the builder with the information from your raw query. Choose between [visualization types](/chronograf/latest/guides/visualization-types/) for your query.

To open the **Data Explorer**, click the **Explore** icon in the navigation bar:

<img src="/img/chronograf/v1.7/data-explorer-icon.png" style="width:100%; max-width:400px; margin:2em 0; display: block;">

## Explore data with Flux

Flux is InfluxData's new functional data scripting language designed for querying, analyzing, and acting on time series data. To learn more about Flux, see [Getting started with Flux](/flux/v0.7/introduction/getting-started).

1. Click the **Data Explorer** icon in the sidebar.
2. Use the builder to select from your existing data and have the query automatically formatted for you.
Alternatively, click **Edit Query As Flux** to manually edit the query. To switch back to the query builder, click **Visual Query Builder**.
3. Use the **Functions** pane to review the available Flux functions. Click on a function from the list to add it to your query.
4. Click **Submit** to run your query. You can then preview your graph in the above pane.

## Visualize your query

**To visualize your query**:

* Select a visualization type from the dropdown menu in the upper-left.
<<SCREENSHOT>>
* Select the **Visualization** tab at the bottom of the **Data Explorer**. For details about all of the available visualization options, see [Visualization types](/chronograf/latest/guides/visualization-types/).

## Save your query as a dashboard cell or task

**To save your query**:

1. Click **Save as** in the upper right.
2. Click **Dashboard Cell** to add your query to a dashboard.
3. Click **Task** to save your query as a task.
