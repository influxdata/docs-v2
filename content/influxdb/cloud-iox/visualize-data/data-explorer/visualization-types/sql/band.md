---
title: Band visualization
list_title: Band
list_image: /img/influxdb/2-0-visualizations-Band-example.png
description:
weight: 201
menu:
  influxdb_cloud_iox:
    name: Band
    parent: Visualization types for SQL
---

## Use Band in the Data Explorer with SQL

The **Band** visualization displays the upper and lower boundaries for groups of data over time. Boundaries are determined by applying aggregate functions to your data for a specified window period, and then setting the aggregate functions for a specified upper, main, or lower boundary.

## Set up the Band visualization

To see bands (boundaries) in the **Band Plot** visualization, you must set up two or three boundaries for comparison.

### Set up the band visualization in the Data Explorer

1. Click the **Data Explorer** icon in the navigation bar.

    {{< nav-icon "data-explorer" >}}

2. Enter your query (see [Query with Data Explorer](/influxdb/cloud-iox/query-data/execute-queries/data-explorer/)).
   - Your query must include [aggregate functions](/influxdb/cloud-iox/query-data/sql/aggregate-select/) that calculate values for Band Plot visualization boundaries.
3. In the **Data Explorer** results pane header, select the following:
  1. Select {{< caps >}}Graph{{< /caps >}}.
  2. Select the **Band** option from the visualization dropdown, and then click **Customize**.
4. Under **Data**, select the following:
   - For **X Column** and **Y Column**, select the columns to display for the x- and y- axes.
5. Under **Aggregate Functions**, select a function to determine each boundary (column) for comparison (select two or three):
<!-- Stuck, don't see my functions listed -->
   - In the **Upper Column** field, select a function for the upper boundary.
   - In the **Main Column** field, select a function for the main boundary.
   - In the **Lower Column** field, select a function for the lower boundary.
6. Under **Options**, select the following:
  - For **Time Format**, select the timestamp format to display in the visualization.

7. (Optional) Continue to customize your visualization, including options such as interpolation, color, hover dimension, and y-axis settings. For more information, see [Options](#options) and [Y Axis](#y-axis) below.

    **Tip:** If you do not see shaded boundaries in the **Band Plot** visualization, verify the query window period includes a sufficient number of data points for the selected aggregate function. By default, the window period is automatically set to ten seconds (`10s`). To adjust your window period, select **Custom**, and then enter a supported time unit (for example nanoseconds (`ns`), microseconds (`us`), milliseconds (`ms`), seconds (`s`), or hours (`h`).

{{< img-hd src="/img/influxdb/2-0-visualizations-Band-example.png" alt="Band example" />}}

### Set up the band plot visualization in the Script Editor

1. Click the **Data Explorer** icon in the navigation bar.

    {{< nav-icon "data-explorer" >}}

2. Click **Script Editor**.
3. Select the **Band Plot** option from the visualization dropdown in the upper left.
4. Create three aggregate functions: one for the main boundary, one for the upper boundary, and one for the lower boundary. The following example uses the [`mean()`](/{{< latest "flux" >}}/stdlib/universe/mean/), [`max()`](/{{< latest "flux" >}}/stdlib/universe/max/), and [`min()`](/{{< latest "flux" >}}/stdlib/universe/min) functions:

```js
from(bucket: "bucket_1")
    |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
    |> filter(fn: (r) => r["_measurement"] == "cpu")
    |> filter(fn: (r) => r["_field"] == "usage_system")
    |> filter(fn: (r) => r["cpu"] == "cpu0" or r["cpu"] == "cpu1")
    |> aggregateWindow(every: 15s, fn: mean, createEmpty: false)
    |> yield(name: "mean")

from(bucket: "bucket_1")
    |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
    |> filter(fn: (r) => r["_measurement"] == "cpu")
    |> filter(fn: (r) => r["_field"] == "usage_system")
    |> filter(fn: (r) => r["cpu"] == "cpu0" or r["cpu"] == "cpu1")
    |> aggregateWindow(every: 15s, fn: max, createEmpty: false)
    |> yield(name: "max")

from(bucket: "bucket_1")
    |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
    |> filter(fn: (r) => r["_measurement"] == "cpu")
    |> filter(fn: (r) => r["_field"] == "usage_system")
    |> filter(fn: (r) => r["cpu"] == "cpu0" or r["cpu"] == "cpu1")
    |> aggregateWindow(every: 15s, fn: min, createEmpty: false)
    |> yield(name: "min")
```

5. (Optional) Customize the name of the yielded results for each function by editing the `name` parameter in the [`yield()`](/{{< latest "flux" >}}/stdlib/universe/yield/) function.
For example, to change the name of the first function from  `mean` to `Average`, modify the last line to the following:
  ```js
  |> yield(name: "Average")
  ```
6. Click **Customize** in the upper left.
7. Under **Aggregate Functions**, enter the functions you created to determine each boundary (column) for comparison. If you changed the `yield` name for any of the functions above, enter the modified name here instead of the function name:
   - In the **Upper Column Name** field, enter the result set to use for the upper boundary.
   - In the **Main Column Name** field, enter the result set to use for the main boundary.
   - In the **Lower Column Name** field, enter the function for the lower boundary.
7. (Optional) Continue to customize your visualization, including options such as interpolation, color, hover dimension, static legend, and y-axis settings. For more information, see [Options](#options) and [Y Axis](#y-axis) below.

### Customize column names

## Band behavior

Like a line graph, the band visualization shows how values change over time. Additionally, it displays upper and lower "bands" for the measurements.

For example, in the band chart above, the lines represent the mean `usage_system` values for the `cpu` measurement for `cpu0` and `cpu1`. The upper and lower limits of the bands are defined by the `max` and `min` aggregate functions, respectively.

## Band controls

To view **Band** controls, click **{{< icon "gear" >}} Customize** next to the visualization dropdown.

###### Data

- **X Column**: Select a column to display on the x-axis.
- **Y Column**: Select a column to display on the y-axis.
- **Time Format**: Select the time format. Options include:
    {{< ui/timestamp-formats >}}

###### Aggregate functions

- **Upper Column**: Aggregate function to display for upper bounds of data.
- **Main Column**: Aggregate function to display for main graph line.
- **Lower Column**: Aggregate function to display for lower bounds of data.

###### Options

- **Interpolation**:
  - **Linear**: Display a time series in a line graph.
  - **Smooth**: Display a time series in a line graph with smooth point interpolation.
  - **Step**: Display a time series in a staircase graph.
- **Line Colors**: Select a color scheme to use for your graph.
- **Hover Dimension**: Select the data to display in the tooltip when you hover over the graph:
  - **auto** or **X-Axis**: Show all points with the same x value along the y-axis.
  - **Y-Axis**: Show all points with the same y value along the x-axis.
  - **X-Y Axis**: Show only the point being currently hovered over.

###### X-Axis

- **Generate X-Axis Tick Marks**: Select the method to generate x-axis tick marks:
  - **Auto**: Select to automatically generate tick marks.
  - **Custom**: To customize the number of x-axis tick marks, select this option, and then enter the following:
    - **Total Tick Marks**: Enter the total number of timestamp ticks to display.
    - **Start Tick Marks At**: Enter the time, in RFC3339 format, to start displaying ticks. Use the **Date Picker** field to automatically generate an RFC3339 formatted timestamp for this field.
    - **Tick Mark Interval**: Enter the number of milliseconds in between each timestamp tick.

###### Y-Axis

- **Y Axis Label**: Enter the label for the y-axis.
- **Y-Value Unit Prefix**: Select the prefix to add to the y-value:
  - **None**: Select to add no prefix.
  - **SI**: (default) Select to add an International System of Units (SI) or metric prefix.
  - **Binary**: Select to add a binary multiple prefix.
- **Y Axis Prefix**: Enter the prefix to add to the y-value.
- **Y Axis Suffix**: Enter the suffix to add to the y-value.
- **Generate Y-Axis Tick Marks**: Select the method to generate y-axis tick marks:
  - **Auto**: Select to automatically generate tick marks.
  - **Custom**: To customize the number of y-axis tick marks, select this option, and then enter  the following:
    - **Total Tick Marks**: Enter the total number of ticks to display.
    - **Start Tick Marks At**: Enter the value to start ticks at.
    - **Tick Mark Interval**: Enter the interval in between each tick.
- **Y Axis Domain**: Select the method to generate the y-axis value range:
  - **Auto**: Select to automatically determine the value range based on values in the data set.
  - **Custom**: To customize the y-axis domain, manually specify the minimum y-axis value, maximum y-axis value, or range by including both.
    - **Min**: Enter the minimum y-axis value.
    - **Max**: Enter the maximum y-axis value.

###### Legend

- **Hover Legend**:
  - **Hide**: Hide the legend that appears upon hover.
  - **Show**: Show the legend upon hover.
    - **Orientation**: Select the orientation of the legend:
      - **Horizontal**: Select to display the legend horizontally.
      - **Vertical**: Select to display the legend vertically.
    - **Opacity**: Adjust the hover legend opacity using the slider.
    - **Colorize Rows**: Select to display hover legend rows in colors.
- **Static Legend**:
  - **Hide**: Hide the static legend.
  - **Show**: Always show the static legend.
    - **Orientation**: Select the orientation of the legend:
      - **Horizontal**: Select to display the legend horizontally.
      - **Vertical**: Select to display the legend vertically.
    - **Opacity**: Adjust the static legend opacity using the slider.
    - **Colorize Rows**: Select to display static legend rows in colors.
    - **Displayed Value**: Select **Latest Y Axis** or **Latest X Axis** to determine whether the y or x axis appears on the legend.
    - **Height**: Adjust the height of the static legend using the slider.
