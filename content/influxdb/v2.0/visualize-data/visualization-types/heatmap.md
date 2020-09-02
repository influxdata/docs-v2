---
title: Heatmap visualization
list_title: Heatmap
list_image: /img/influxdb/2-0-visualizations-heatmap-example.png
description: >
  A Heatmap displays the distribution of data on an x and y axes where color
  represents different concentrations of data points.
weight: 203
menu:
  influxdb_2_0:
    name: Heatmap
    parent: Visualization types
related:
  - /influxdb/v2.0/visualize-data/visualization-types/scatter
---

A **Heatmap** displays the distribution of data on an x and y axes where color
represents different concentrations of data points.

{{< img-hd src="/img/influxdb/2-0-visualizations-heatmap-example.png" alt="Heatmap example" />}}

Select the **Heatmap** option from the visualization dropdown in the upper right.

## Heatmap behavior
Heatmaps divide data points into "bins" – segments of the visualization with upper
and lower bounds for both [X and Y axes](#data).
The [Bin Size option](#options) determines the bounds for each bin.
The total number of points that fall within a bin determine the its value and color.
Warmer or brighter colors represent higher bin values or density of points within the bin.

## Heatmap Controls
To view **Heatmap** controls, click **{{< icon "gear" >}} Customize** next to
the visualization dropdown.

###### Data
- **X Column**: Select a column to display on the x-axis.
- **Y Column**: Select a column to display on the y-axis.

###### Options
- **Color Scheme**: Select a color scheme to use for your heatmap.
- **Bin Size**: Specify the size of each bin. Default is 10.

###### X Axis
- **X Axis Label**: Label for the x-axis.
- **X Tick Prefix**: Prefix to be added to x-value.
- **X Tick Suffix**: Suffix to be added to x-value.
- **X Axis Domain**: The x-axis value range.
  - **Auto**: Automatically determine the value range based on values in the data set.
  - **Custom**: Manually specify the minimum y-axis value, maximum y-axis value, or range by including both.
      - **Min**: Minimum x-axis value.
      - **Max**: Maximum x-axis value.

###### Y Axis
- **Y Axis Label**: Label for the y-axis.
- **Y Tick Prefix**: Prefix to be added to y-value.
- **Y Tick Suffix**: Suffix to be added to y-value.
- **Y Axis Domain**: The y-axis value range.
  - **Auto**: Automatically determine the value range based on values in the data set.
  - **Custom**: Manually specify the minimum y-axis value, maximum y-axis value, or range by including both.
      - **Min**: Minimum y-axis value.
      - **Max**: Maximum y-axis value.

## Heatmap examples

### Cross-measurement correlation
The following example explores possible correlation between CPU and Memory usage.
It uses data collected with the Telegraf [Mem](/{{< latest "telegraf" >}}/plugins//#mem)
and [CPU](/{{< latest "telegraf" >}}/plugins//#cpu) input plugins.

###### Join CPU and memory usage
The following query joins CPU and memory usage on `_time`.
Each row in the output table contains `_value_cpu` and `_value_mem` columns.

```js
cpu = from(bucket: "example-bucket")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) =>
      r._measurement == "cpu" and
      r._field == "usage_system" and
      r.cpu == "cpu-total"
  )

mem = from(bucket: "example-bucket")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) =>
      r._measurement == "mem" and
      r._field == "used_percent"
  )

join(tables: {cpu: cpu, mem: mem}, on: ["_time"], method: "inner")
```

###### Use a heatmap to visualize correlation
In the Heatmap visualization controls, `_value_cpu` is selected as the [X Column](#data)
and `_value_mem` is selected as the [Y Column](#data).
The domain for each axis is also customized to account for the scale difference
between column values.

{{< img-hd src="/img/influxdb/2-0-visualizations-heatmap-correlation.png" alt="Heatmap correlation example" />}}


## Important notes

### Differences between a heatmap and a scatter plot
Heatmaps and [Scatter plots](/influxdb/v2.0/visualize-data/visualization-types/scatter/)
both visualize the distribution of data points on X and Y axes.
However, in certain cases, heatmaps provide better visibility into point density.

For example, the dashboard cells below visualize the same query results:

{{< img-hd src="/img/influxdb/2-0-visualizations-heatmap-vs-scatter.png" alt="Heatmap vs Scatter plot" />}}

The heatmap indicates isolated high point density, which isn't visible in the scatter plot.
In the scatter plot visualization, points that share the same X and Y coordinates
appear as a single point.
