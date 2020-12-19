---
title: Mosaic visualization
list_title: Mosaic
list_image: /img/influxdb/2-0-visualizations-mosaic-example.png
description: >
  The Mosaic view displays the single value most recent value for a time series in a mosaic view.
weight: 206
menu:
  influxdb_2_0:
    name: Mosaic
    parent: Visualization types
---

The **Mosaic** visualization displays data from two or more qualitative variables.

{{< img-hd src="/img/influxdb/2-0-visualizations-mosaic-example.png" alt="mosaic example" />}}

Select the **Mosaic** option from the visualization dropdown in the upper left.

## Mosaic behavior
The mosaic visualization displays


### Set up the mosaic visualization in the Data Explorer

1. Click the **Data Explorer** icon in the navigation bar.

    {{< nav-icon "data-explorer" >}}

2. Enter your query (see [Explore data with Flux and the Data Explorer](/influxdb/v2.0/visualize-data/explore-metrics/#explore-data-with-flux-and-the-data-explorer)). You must include the aggregate functions used to determine the Band Plot visualization boundaries in your query.
3. Select the **Band Plot** option from the visualization dropdown in the upper left, and then click **Customize**.
4. Under **Data**, select the following:
   - For **X Column** and **Y Column**, select the columns to display for the x- and y- axes.
   - For **Time Format**, select the timestamp format to display in the visualization.
5. Under **Aggregate Functions**, select a function to determine each boundary (column) for comparison (select two or three):
   - In the **Upper Column Name** field, select a function for the upper boundary.
   - In the **Main Column Name** field, select a function for the main boundary.
   - In the **Lower Column Name** field, select a function for the lower boundary.
6. (Optional) Continue to customize your visualization, including options such as interpolation, color, hover dimension, and y-axis settings. For more information, see [Options](options) and [Y Axis](y-axis) below.

    **Tip:** If you do not see shaded boundaries in the **Band Plot** visualization, verify the query window period includes a sufficient number of data points for the selected aggregate function. By default, the window period is automatically set to ten seconds (`10s`). To adjust your window period, select **Custom**, and then enter a supported time unit (for example nanoseconds (`ns`), microseconds (`us`), milliseconds (`ms`), seconds (`s`), or hours (`h`).

{{< img-hd src="/img/influxdb/2-0-visualizations-Band-example.png" alt="Band example" />}}


## Mosaic Controls
To view **Mosaic** controls, click **{{< icon "gear" >}} Customize** next to the visualization dropdown.

###### Data
- **FILL Column**:
- **X Column**: The column to select data from.
- **Y Column**: The column to select data from.
- **Time Format**:

###### Options
- **Color Scheme**: Select a color scheme to use for your graph.

###### X Axis
- **X Axis Label**: Label for the x-axis.

###### Y Axis
- **Y Axis Label**: Label for the y-axis.
