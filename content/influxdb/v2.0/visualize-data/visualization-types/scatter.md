---
title: Scatter visualization
list_title: Scatter
list_image: /img/influxdb/2-0-visualizations-scatter-example.png
description: >
  The Scatter view uses a scatter plot to display time series data.
weight: 208
menu:
  influxdb_2_0:
    name: Scatter
    parent: Visualization types
related:
  - /influxdb/v2.0/visualize-data/visualization-types/heatmap
---

The **Scatter** view uses a scatter plot to display time series data.

{{< img-hd src="/img/influxdb/2-0-visualizations-scatter-example.png" alt="Scatter plot example" />}}

Select the **Scatter** option from the visualization dropdown in the upper left.

## Scatter behavior
The scatter visualization maps each data point to X and Y coordinates.
X and Y axes are specified with the [X Column](#data) and [Y Column](#data) visualization options.
Each unique series is differentiated using fill colors and symbols.
Use the [Symbol Column](#data) and [Fill Column](#data) options to select columns
used to differentiate points in the visualization.

## Scatter controls
To view **Scatter** controls, click **{{< icon "gear" >}} Customize** next to
the visualization dropdown.

###### Data
- **Symbol Column**: Define a column containing values that should be differentiated with symbols.
- **Fill Column**: Define a column containing values that should be differentiated with fill color.
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

###### Options
- **Color Scheme**: Select a color scheme to use for your scatter plot.

###### X Axis
- **X Axis Label**: Label for the x-axis.

###### Y Axis
- **Y Axis Label**: Label for the y-axis.
- **Y Tick Prefix**: Prefix to be added to y-value.
- **Y Tick Suffix**: Suffix to be added to y-value.
- **Y Axis Domain**: The y-axis value range.
  - **Auto**: Automatically determine the value range based on values in the data set.
  - **Custom**: Manually specify the minimum y-axis value, maximum y-axis value, or range by including both.
      - **Min**: Minimum y-axis value.
      - **Max**: Maximum y-axis value.

## Scatter examples

### Cross-measurement correlation
The following example explores possible correlation between CPU and Memory usage.
It uses data collected with the Telegraf [Mem](/{{< latest "telegraf" >}}/plugins//#mem)
and [CPU](/{{< latest "telegraf" >}}/plugins//#cpu) input plugins.

###### Query CPU and memory usage
The following query creates a union of CPU and memory usage.
It scales the CPU usage metric to better align with baseline memory usage.

```js
cpu = from(bucket: "example-bucket")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) =>
      r._measurement == "cpu" and
      r._field == "usage_system" and
      r.cpu == "cpu-total"
  )
  // Scale CPU usage
  |> map(fn: (r) => ({
      r with
      _value: r._value + 60.0,
      _time: r._time
      })
  )

mem = from(bucket: "example-bucket")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) =>
      r._measurement == "mem" and
      r._field == "used_percent"
  )

union(tables: [cpu, mem])
```

###### Use a scatter plot to visualize correlation
In the Scatter visualization controls, points are differentiated based on their group keys.

{{< img-hd src="/img/influxdb/2-0-visualizations-scatter-correlation.png" alt="Heatmap correlation example" />}}

## Important notes

### Differences between a scatter plot and a heatmap
Scatter plots and [Heatmaps](/influxdb/v2.0/visualize-data/visualization-types/heatmap/)
both visualize the distribution of data points on X and Y axes.
However, in certain cases, scatterplots can "hide" points if they share the same X and Y coordinates.

For example, the dashboard cells below visualize the same query results:

{{< img-hd src="/img/influxdb/2-0-visualizations-heatmap-vs-scatter.png" alt="Heatmap vs Scatter plot" />}}

The heatmap indicates isolated high point density, which isn't visible in the scatter plot.
In the scatter plot visualization, points that share the same X and Y coordinates
appear as a single point.
