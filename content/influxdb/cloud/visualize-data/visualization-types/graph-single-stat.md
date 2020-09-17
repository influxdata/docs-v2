---
title: Graph + Single Stat visualization
list_title: Graph + Single Stat
list_image: /img/influxdb/2-0-visualizations-line-graph-single-stat-example.png
description: >
  The Graph + Single Stat view displays the specified time series in a line graph
  and overlays the single most recent value as a large numeric value.
weight: 202
menu:
  influxdb_cloud:
    name: Graph + Single Stat
    parent: Visualization types
related:
  - /influxdb/cloud/visualize-data/visualization-types/graph
  - /influxdb/cloud/visualize-data/visualization-types/single-stat
---

The **Graph + Single Stat** view displays the specified time series in a line graph
and overlays the single most recent value as a large numeric value.

{{< img-hd src="/img/influxdb/2-0-visualizations-line-graph-single-stat-example-8.png" alt="Line Graph + Single Stat example" />}}

Select the **Graph + Single Stat** option from the visualization dropdown in the upper right.

## Graph + Single Stat behavior
The Graph visualization color codes each table (or series) in the queried data set.
When multiple series are present, it automatically assigns colors based on the selected [Line Colors option](#options).

The Single Stat visualization displays a single numeric data point.
It uses the latest point in the first table (or series) returned by the query.

{{% note %}}
#### Queries should return one table
Flux does not guarantee the order in which tables are returned.
If a query returns multiple tables (or series), the table order can change between query executions
and result in the Single Stat visualization displaying inconsistent data.
For consistent Single Stat results, the query should return a single table.
{{% /note %}}

## Graph + Single Stat Controls
To view **Graph + Single Stat** controls, click **{{< icon "gear" >}} Customize** next to
the visualization dropdown.

###### Data
- **X Column**: Select a column to display on the x-axis.
- **Y Column**: Select a column to display on the y-axis.

###### Options
- **Line Colors**: Select a color scheme to use for your graph.
- **Shade Area Below Lines**: Shade in the area below the graph lines.

###### Y Axis
- **Y Axis Label**: Label for the y-axis.
- **Y Tick Prefix**: Prefix to be added to y-value.
- **Y Tick Suffix**: Suffix to be added to y-value.
- **Y Axis Domain**: The y-axis value range.
  - **Auto**: Automatically determine the value range based on values in the data set.
  - **Custom**: Manually specify the minimum y-axis value, maximum y-axis value, or range by including both.
      - **Min**: Minimum y-axis value.
      - **Max**: Maximum y-axis value.
- **Positioning**:
  - **Overlaid**: Display graph lines overlaid on each other.
  - **Stacked**: Display graph lines stacked on top of each other.

###### Customize Single-Stat  
- **Prefix**: Prefix to be added to the single stat.
- **Suffix**: Suffix to be added to the single stat.
- **Decimal Places**: The number of decimal places to display for the single stat.
  - **Auto** or **Custom**: Enable or disable auto-setting.

###### Colorized Thresholds
- **Base Color**: Select a base or background color from the selection list.
- **Add a Threshold**: Change the color of the single stat based on the current value.
  - **Value is**: Enter the value at which the single stat should appear in the selected color.
    Choose a color from the dropdown menu next to the value.
- **Colorization**: Choose **Text** for the single stat to change color based on the configured thresholds.
  Choose **Background** for the background of the graph to change color based on the configured thresholds.

## Graph + Single Stat examples
The primary use case for the Graph + Single Stat visualization is to show the current or latest
value as well as historical values.

### Show current value and historical values
The following example shows the current percentage of memory used as well as memory usage over time:

###### Query memory usage percentage
```js
from(bucket: "example-bucket")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) =>
      r._measurement == "mem" and
      r._field == "used_percent"
  )
```
###### Memory allocations visualization
{{< img-hd src="/img/influxdb/2-0-visualizations-graph-single-stat-mem-8.png" alt="Graph + Single Stat Memory Usage Example" />}}
