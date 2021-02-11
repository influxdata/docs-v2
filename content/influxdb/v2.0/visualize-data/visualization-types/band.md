---
title: Band Plot visualization
list_title: Band
list_image: /img/influxdb/2-0-visualizations-Band-example.png
description:
weight: 206
menu:
  influxdb_2_0:
    name: Band Plot
    parent: Visualization types
---

The **Band Plot** visualization displays the upper and lower boundaries for groups of data over time. Boundaries are determined by applying aggregate functions to your data for a specified window period, and then setting the aggregate functions for a specified upper, main, or lower boundary.

## Set up the Band Plot visualization

To see bands (boundaries) in the **Band Plot** visualization, you must set up two or three boundaries for comparison.

### Set up the band plot visualization in the Data Explorer

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

### Set up the band plot visualization in the Script Editor

1. Click the **Data Explorer** icon in the navigation bar.

    {{< nav-icon "data-explorer" >}}

2. Click **Script Editor**.
3. Select the **Band Plot** option from the visualization dropdown in the upper left.
4. Create three aggregate functions: one for the main boundary, one for the upper boundary, and one for the lower boundary. The following example uses the [`mean()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/mean/), [`max()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/max/), and [`min()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/min) functions:

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

5. (Optional) Customize the name of the yielded results for each function by editing the `name` parameter in the [`yield()`](/v2.0/reference/flux/stdlib/built-in/outputs/yield/) function.
For example, to change the name of the first function from  `mean` to `Average`, modify the last line to the following:
  ```js
    |> yield(name: "Average")
  ```
6. Click **Customize** in the upper left.
7. Under **Aggregate Functions**, enter the functions you created to determine each boundary (column) for comparison. If you changed the `yield` name for any of the functions above, enter the modified name here instead of the function name:
   - In the **Upper Column Name** field, enter the result set to use for the upper boundary.
   - In the **Main Column Name** field, enter the result set to use for the main boundary.
   - In the **Lower Column Name** field, enter the function for the lower boundary.
7. (Optional) Continue to customize your visualization, including options such as interpolation, color, hover dimension, and y-axis settings. For more information, see [Options](options) and [Y Axis](y-axis) below.

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
    - `YYYY-MM-DD HH:mm:ss ZZ`
    - `DD/MM/YYYY HH:mm:ss.sss`
    - `MM/DD/YYYY HH:mm:ss.sss`
    - `MM/DD/YYYY HH:mm:ss.SSS`
    - `YYYY/MM/DD HH:mm:ss`
    - `hh:mm a`
    - `HH:mm`
    - `HH:mm:ss`
    - `HH:mm:ss.sss`
    - `MMMM D, YYYY HH:mm:ss`
    - `dddd, MMMM D, YYYY HH:mm:ss`

###### Aggregate functions
- **Upper Column Name**: Aggregate function to display for upper bounds of data.
- **Main Column Name**: Aggregate function to display for main graph line.
- **Lower Column Name**: Aggregate function to display for lower bounds of data.

###### Options
- **Interpolation**:
  - **Line**: Display a time series in a line graph.
  - **Smooth**: Display a time series in a line graph with smooth point interpolation.
  - **Step**: Display a time series in a staircase graph.
- **Line Colors**: Select a color scheme to use for your graph.
- **Hover Dimension**: Select the data to display in the tooltip when you hover over the graph:
  - **auto** or **X Axis**: Show all points with the same x value along the y-axis.
  - **Y Axis**: Show all points with the same y value along the x-axis.
  - **X & Y Axis**: Show only the point being currently hovered over.

###### X Axis
- **Generate X Axis Tick Marks**:
- **Auto**: Automatically generate tick marks.
- **Custom**: Customize how many timestamp ticks appear.
- **Total Tick Marks**: The total number of timestamp ticks to display.
- **Start Tick Marks At**: The time, in RFC3339 format, to start displaying ticks. Use the **Date Picker** field to automatically generate an RFC3339 formatted timestamp for this field.
- **Tick Mark Interval**: The number of milliseconds in between each timestamp tick.

###### Y Axis
- **Y Axis Label**: Label for the y-axis.
- **Y Value Unit Prefix**:
  - **None**: No prefix.
  - **SI**: International System of Units (SI) or metric prefix.
  - **Binary**: Binary multiple prefix.
- **Y Axis Prefix**: Prefix to be added to y-value.
- **Y Axis Suffix**: Suffix to be added to y-value.
- **Generate X Axis Tick Marks**:
- **Auto**: Automatically generate tick marks.
- **Custom**: Customize how many timestamp ticks appear.
- **Total Tick Marks**: The total number of timestamp ticks to display.
- **Start Tick Marks At**: The value to start displaying ticks for our y-axis data.
- **Tick Mark Interval**: The number of milliseconds in between each timestamp tick.
- **Y Axis Domain**: The y-axis value range.
  - **Auto**: Automatically determine the value range based on values in the data set.
  - **Custom**: Manually specify the minimum y-axis value, maximum y-axis value, or range by including both.
      - **Min**: Minimum y-axis value.
      - **Max**: Maximum y-axis value.

###### Legend
- **Legend Orientation**: Determines the orientation of the legend that appears upon hover.
  - **Horizontal**: Display the legend horizontally.
  - **Vertical**: Display the legend vertically.
- **Opacity**: Adjust the legend opacity using the slider.
- **Colorize Rows**: Display legend rows in colors. 
