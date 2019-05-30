---
title: Visualization types
description: >
  InfluxDB dashboards support multiple visualization types including line graphs,
  gauges, tables, and more.
menu:
  v2_0:
    name: Visualization types
    parent: Visualize data
weight: 101
---
The InfluxDB's user interface's (UI) dashboard views support the following visualization types,
which can be selected in the **Visualization Type** selection view of the
[Data Explorer](/v2.0/visualize-data/explore-metrics).

Each of the available visualization types and available user controls are described below.


- [Graph](#graph)
- [Graph + Single Stat](#graph-single-stat)
- [Heatmap](#heatmap)
- [Histogram](#histogram)
- [Single Stat](#single-stat)
- [Gauge](#gauge)
- [Table](#table)
- [Scatter](#scatter)

### Graph

There are several types of graphs you can create.

To select this view, select the **Graph** option from the visualization dropdown
in the upper right.

{{< img-hd src="/img/2-0-visualizations-line-graph-example.png" alt="Line Graph example" />}}

#### Graph controls

To view **Graph** controls, click the settings icon ({{< icon "gear" >}}) next
to the visualization dropdown in the upper right.

###### Options
- **Interpolation**: Select from the following options:
  - **Line**: Display a time series in a line graph
  - **Smooth**: Display a time series in a line graph with smooth point interpolation.
  - **Step**: Display a time series in a staircase graph.
  <!-- - **Bar**: Display the specified time series using a bar chart. -->
  <!-- - **Stacked**: Display multiple time series bars as segments stacked on top of each other. -->
- **Line Colors**: Select a color scheme to use for your graph.

###### Y Axis
- **Y Axis Label**: Label for the y-axis.
- **Y Tick Prefix**: Prefix to be added to y-value.
- **Y Tick Suffix**: Suffix to be added to y-value.
- **Y Axis Domain**: The y-axis value range.
  - **Auto**: Automatically determine the value range based on values in the data set.
  - **Custom**: Manually specify the value range of the y-axis.
      - **Min**: Minimum y-axis value.
      - **Max**: Maximum y-axis value.

##### Graph with linear interpolation

{{< img-hd src="/img/2-0-visualizations-line-graph-example.png" alt="Line Graph example" />}}

##### Graph with smooth interpolation

{{< img-hd src="/img/2-0-visualizations-line-graph-smooth-example.png" alt="Step-Plot Graph example" />}}

##### Graph with step interpolation

{{< img-hd src="/img/2-0-visualizations-line-graph-step-example.png" alt="Step-Plot Graph example" />}}

<!-- ##### Stacked Graph example

{{< img-hd src="/img/2-0-visualizations-stacked-graph-example.png" alt="Stacked Graph example" />}} -->

<!-- ##### Bar Graph example

{{< img-hd src="/img/2-0-visualizations-bar-graph-example.png" alt="Bar Graph example" />}} -->

### Graph + Single Stat

The **Graph + Single Stat** view displays the specified time series in a line graph
and overlays the single most recent value as a large numeric value.

{{< img-hd src="/img/2-0-visualizations-line-graph-single-stat-example.png" alt="Line Graph + Single Stat example" />}}

To select this view, select the **Graph + Single Stat** option from the visualization
dropdown in the upper right.

#### Graph + Single Stat Controls

To view **Graph + Single Stat** controls, click the settings icon ({{< icon "gear" >}})
next to the visualization dropdown in the upper right.

###### Options
- **Line Colors**: Select a color scheme to use for your graph.

###### Y Axis
- **Y Axis Label**: Label for the y-axis.
- **Y Tick Prefix**: Prefix to be added to y-value.
- **Y Tick Suffix**: Suffix to be added to y-value.
- **Y Axis Domain**: The y-axis value range.
  - **Auto**: Automatically determine the value range based on values in the data set.
  - **Custom**: Manually specify the value range of the y-axis.
      - **Min**: Minimum y-axis value.
      - **Max**: Maximum y-axis value.

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

### Heatmap

A **Heatmap** displays the distribution of data on an x and y axes where color
represents different concentrations of data points.

{{< img-hd src="/img/2-0-visualizations-heatmap-example.png" alt="Heatmap example" />}}

To select this view, select the **Heatmap** option from the visualization dropdown in the upper right.

#### Heatmap Controls

To view **Heatmap** controls, click the settings icon ({{< icon "gear" >}})
next to the visualization dropdown in the upper right.

###### Data
- **X Column**: Select the column to use for the x-axis.
- **Y Column**: Select the column to use for the y-axis.

###### Options
- **Color Scheme**: Select a color scheme to use for your heatmap.
- **Bin Size**: Specify the size of each bin. Default is 10.

###### X Axis
- **X Axis Label**: Label for the x-axis.
- **X Tick Prefix**: Prefix to be added to x-value.
- **X Tick Suffix**: Suffix to be added to x-value.
- **X Axis Domain**: The x-axis value range.
  - **Auto**: Automatically determine the value range based on values in the data set.
  - **Custom**: Manually specify the value range of the x-axis.
      - **Min**: Minimum x-axis value.
      - **Max**: Maximum x-axis value.

###### Y Axis
- **Y Axis Label**: Label for the y-axis.
- **Y Tick Prefix**: Prefix to be added to y-value.
- **Y Tick Suffix**: Suffix to be added to y-value.
- **Y Axis Domain**: The y-axis value range.
  - **Auto**: Automatically determine the value range based on values in the data set.
  - **Custom**: Manually specify the value range of the y-axis.
      - **Min**: Minimum y-axis value.
      - **Max**: Maximum y-axis value.

### Histogram

A histogram is a way to view the distribution of data. Unlike column charts, histograms have no time axis.
The y-axis is dedicated to count, and the x-axis is divided into bins.

{{< img-hd src="/img/2-0-visualizations-histogram-example.png" alt="Histogram example" />}}

To select this view, select the **Histogram** option from the visualization dropdown in the upper right.

#### Histogram Controls

To view **Histogram** controls, click the settings icon ({{< icon "gear" >}}) next
to the visualization dropdown in the upper right.

###### Data
- **Column**: The column to select data from.
- **Group By**: The column to group by.

###### Options
- **Color Scheme**: Select a color scheme to use for your graph.
- **Positioning**: Select **Stacked** to stack groups in a bin on top of each other.
  Select **Overlaid** to overlay groups in each bin.
- **Bins**: Enter a number of bins to divide data into or select Auto to automatically
  calculate the number of bins.
  - **Auto** or **Custom**: Enable or disable auto-setting.

###### X Axis
- **X Axis Label**: Label for the x-axis.
- **X Axis Domain**: The x-axis value range.
  - **Auto**: Automatically determine the value range based on values in the data set.
  - **Custom**: Manually specify the value range of the x-axis.
      - **Min**: Minimum x-axis value.
      - **Max**: Maximum x-axis value.

### Single Stat

The **Single Stat** view displays the most recent value of the specified time series as a numerical value.

{{< img-hd src="/img/2-0-visualizations-single-stat-example.png" alt="Single stat example" />}}

To select this view, select the **Single Stat** option from the visualization dropdown in the upper right.

#### Single Stat Controls

To view **Single Stat** controls, click the settings icon ({{< icon "gear" >}})
next to the visualization dropdown in the upper right.

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

### Gauge

The **Gauge** view displays the single value most recent value for a time series in a gauge view.

{{< img-hd src="/img/2-0-visualizations-gauge-example.png" alt="Gauge example" />}}

To select this view, select the **Gauge** option from the visualization dropdown in the upper right.

#### Gauge Controls

To view **Gauge** controls, click the settings icon ({{< icon "gear" >}}) next to
the visualization dropdown in the upper right.

- **Prefix**: Prefix to add to the gauge.
- **Suffix**: Suffix to add to the gauge.
- **Decimal Places**: The number of decimal places to display for the the gauge.
  - **Auto** or **Custom**: Enable or disable auto-setting.

###### Colorized Thresholds
- **Base Color**: Select a base or background color from the selection list.
- **Add a Threshold**: Change the color of the gauge based on the current value.
  - **Value is**: Enter the value at which the gauge should appear in the selected color.
    Choose a color from the dropdown menu next to the value.

### Table

The **Table** option displays the results of queries in a tabular view, which is
sometimes easier to analyze than graph views of data.

{{< img-hd src="/img/2-0-visualizations-table-example.png" alt="Table example" />}}

To select this view, select the **Table** option from the visualization dropdown in the upper right.

#### Table Controls

To view **Table** controls, click the settings icon ({{< icon "gear" >}}) next to
the visualization dropdown in the upper right.

- **Default Sort Field**: Select the default sort field. Default is **time**.
- **Time Format**: Select the time format. Options include:
    - `MM/DD/YYYY HH:mm:ss` (default)
    - `MM/DD/YYYY HH:mm:ss.SSS`
    - `YYYY-MM-DD HH:mm:ss`
    - `HH:mm:ss`
    - `HH:mm:ss.SSS`
    - `MMMM D, YYYY HH:mm:ss`
    - `dddd, MMMM D, YYYY HH:mm:ss`
    - `Custom`
- **Decimal Places**: Enter the number of decimal places. Default (empty field) is **unlimited**.
    - **Auto** or **Custom**: Enable or disable auto-setting.

###### Column Settings
- **First Column**: Toggle to **Fixed** to lock the first column so that the listings are always visible.
  Threshold settings do not apply in the first column when locked.
- **Table Columns**:
  - Enter a new name to rename any of the columns.
  - Click the eye icon next to a column to hide it.
  - [additional]: Enter name for each additional column.
  - Change the order of the columns by dragging to the desired position.

###### Colorized Thresholds
- **Base Color**: Select a base or background color from the selection list.
- **Add a Threshold**: Change the color of the table based on the current value.
  - **Value is**: Enter the value at which the table should appear in the selected color.
    Choose a color from the dropdown menu next to the value.

### Scatter
The **Scatter** option uses a scatter plot to display time series data.

{{< img-hd src="/img/2-0-visualizations-scatter-example.png" alt="Scatter plot example" />}}

To select this view, select the **Scatter** option from the visualization dropdown in the upper right.

#### Scatter controls
To view **Scatter** controls, click the settings icon ({{< icon "gear" >}}) next
to the visualization dropdown in the upper right.

###### Data
- **Symbol column**: Define a column containing values that should be differentiated with symbols.
- **Fill column**: Define a column containing values that should be differentiated with fill color.

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
  - **Custom**: Manually specify the value range of the y-axis.
      - **Min**: Minimum y-axis value.
      - **Max**: Maximum y-axis value.
