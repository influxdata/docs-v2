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


* [Graph](#graph)
* [Graph + Single Stat](#graph-single-stat)
* [Histogram](#histogram)
* [Single Stat](#single-stat)
* [Gauge](#gauge)
* [Table](#table)

### Graph

There are several types of graphs you can create.

To select this view, select the **Graph** option from the visualization dropdown in the upper right.

#### Graph Controls

To view **Graph** controls, click the settings icon ({{< icon "gear" >}}) next to the visualization dropdown in the upper right.

* **Geometry**: Select from the following options:
  - **Line**: Display a time series in a line graph.
  - **Stacked**: Display multiple time series bars as segments stacked on top of each other.
  - **Step**: Display a time series in a staircase graph.
  - **Bar**: Display the specified time series using a bar chart.
* **Line Colors**: Select a color scheme to use for your graph.
* **Title**: y-axis title. Enter title, if using a custom title.
* **Min**: Minimum y-axis value.
  - **Auto** or **Custom**: Enable or disable auto-setting.
* **Max**: Maximum y-axis value.  
  - **Auto** or **Custom**: Enable or disable auto-setting.
* **Y-Value's Prefix**: Prefix to be added to y-value.
* **Y-Value's Suffix**: Suffix to be added to y-value.
* **Y-Value's Format**: Select between **K/M/B** (Thousand/Million/Billion), **K/M/G** (Kilo/Mega/Giga), or **Raw**.
* **Scale**: Toggle between **Linear** and **Logarithmic**.

##### Line Graph example

![Line Graph example](/img/chrono-viz-line-graph-example.png)

##### Stacked Graph example

![Stacked Graph example](/img/chrono-viz-stacked-graph-example.png)

#### Step-Plot Graph example

![Step-Plot Graph example](/img/chrono-viz-step-plot-graph-example.png)

##### Bar Graph example

![Bar Graph example](/img/chrono-viz-bar-graph-example.png)

### Graph + Single Stat

The **Graph + Single Stat** view displays the specified time series in a line graph and overlays the single most recent value as a large numeric value.

To select this view, select the **Graph + Single Stat** option from the visualization dropdown in the upper right.

#### Graph + Single Stat Controls

To view **Graph + Single Stat** controls, click the settings icon ({{< icon "gear" >}}) next to the visualization dropdown in the upper right.

* **Line Colors**: Select the a color scheme to use for your graph.

* **Left Y Axis** section:
  * **Title**: y-axis title. Enter title, if using a custom title.
  * **Min**: Minimum y-axis value.
    - **Auto** or **Custom**: Enable or disable auto-setting.
  * **Max**: Maximum y-axis value.  
    - **Auto** or **Custom**: Enable or disable auto-setting.
  * **Y-Value's Prefix**: Prefix to be added to y-value.
  * **Y-Value's Suffix**: Suffix to be added to y-value.
  * **Y-Value's Format**: Select between **K/M/B** (Thousand/Million/Billion), **K/M/G** (Kilo/Mega/Giga), or **Raw**.
  * **Scale**: Toggle between **Linear** and **Logarithmic**.

* **Customize Single-Stat** section:  
  * **Prefix**: Prefix to be added to the single stat.
  * **Suffix**: Suffix to be added to the single stat.
  * **Decimal Places**: The number of decimal places to display for the single stat.
    - **Auto** or **Custom**: Enable or disable auto-setting.

* **Colorized Thresholds** section:
  * **Base Color**: Select a base, or background, color from the selection list.
  * **Add a Threshold**: Change the color of the single stat based on the current value.
    *  **Value is**: Enter the value at which the single stat should appear in the selected color. Choose a color from the dropdown menu next to the value.
  * **Colorization**: Choose **Text** for the single stat to change color based on the configured thresholds. Choose **Background** for the background of the graph to change color based on the configured thresholds.

#### Graph + Single Stat example

![Line Graph + Single Stat example](/img/chrono-viz-line-graph-single-stat-example.png)

### Histogram

A histogram is a way to view the distribution of data. Unlike column charts, histograms have no time axis. The y-axis is dedicated to count, and the x-axis is divided into bins.

To select this view, select the **Histogram** option from the visualization dropdown in the upper right.

#### Histogram Controls

To view **Histogram** controls, click the settings icon ({{< icon "gear" >}}) next to the visualization dropdown in the upper right.

* **Data** section:
  * **Column**: The column to select data from.
  * **Group By**: The tags to sort by.
* **Options** section:
  * **Color Scheme**: Select a color scheme to use for your graph.
  * **Positioning**: Select (**Stacked**) to display data stacked on top of each other for each bin, or select
  * **Bins**: Enter a number of bins to divide data into or select Auto to automatically calculate the number of bins.
    * **Auto** or **Custom**: Enable or disable auto-setting.

#### Histogram example

![Histogram example](/img/histogram_example.png)

### Single Stat

The **Single Stat** view displays the most recent value of the specified time series as a numerical value.

To select this view, select the **Single Stat** option from the visualization dropdown in the upper right.

#### Single Stat Controls

To view **Single Stat** controls, click the settings icon ({{< icon "gear" >}}) next to the visualization dropdown in the upper right.

* **Customize Single-Stat** section:  
  * **Prefix**: Prefix to be added to the single stat.
  * **Suffix**: Suffix to be added to the single stat.
  * **Decimal Places**: The number of decimal places to display for the single stat.
    - **Auto** or **Custom**: Enable or disable auto-setting.

* **Colorized Thresholds** section:
  * **Base Color**: Select a base, or background, color from the selection list.
  * **Add a Threshold**: Change the color of the single stat based on the current value.
    *  **Value is**: Enter the value at which the single stat should appear in the selected color. Choose a color from the dropdown menu next to the value.
  * **Colorization**: Choose **Text** for the single stat to change color based on the configured thresholds. Choose **Background** for the background of the graph to change color based on the configured thresholds.

### Gauge

The **Gauge** view displays the single value most recent value for a time series in a gauge view.

To select this view, select the **Gauge** option from the visualization dropdown in the upper right.

#### Gauge Controls

To view **Gauge** controls, click the settings icon ({{< icon "gear" >}}) next to the visualization dropdown in the upper right.

* **Customize Gauge** section:  
  * **Prefix**: Prefix to be added to the gauge.
  * **Suffix**: Suffix to be added to the gauge.
  * **Decimal Places**: The number of decimal places to display for the the gauge.
    - **Auto** or **Custom**: Enable or disable auto-setting.

* **Colorized Thresholds** section:
  * **Base Color**: Select a base, or background, color from the selection list.
  * **Add a Threshold**: Change the color of the gauge based on the current value.
    *  **Value is**: Enter the value at which the gauge should appear in the selected color. Choose a color from the dropdown menu next to the value.

#### Gauge example

![Gauge example](/img/chrono-viz-gauge-example.png)

### Table

The **Table** option displays the results of queries in a tabular view, which is sometimes easier to analyze than graph views of data.

To select this view, select the **Table** option from the visualization dropdown in the upper right.

#### Table Controls

To view **Table** controls, click the settings icon ({{< icon "gear" >}}) next to the visualization dropdown in the upper right.

* **Customize Table** section:
  * **Default Sort Field**: Select the default sort field. Default is **time**.
  * **Time Format**: Select the time format.
      - Options include: `MM/DD/YYYY HH:mm:ss` (default), `MM/DD/YYYY HH:mm:ss.SSS`, `YYYY-MM-DD HH:mm:ss`, `HH:mm:ss`, `HH:mm:ss.SSS`, `MMMM D, YYYY HH:mm:ss`, `dddd, MMMM D, YYYY HH:mm:ss`, or `Custom`.
      * **Default Sort Field**: Select the default sort field. Default is **time**.
  * **Decimal Places**: Enter the number of decimal places. Default (empty field) is **unlimited**.
    - **Auto** or **Custom**: Enable or disable auto-setting.

* **Column Settings** section:
  * **First Column**: Toggle to **Fixed** to lock the first column so that the listings are always visible. Threshold settings do not apply in the first column when locked.
  * **Table Columns**:
    - Enter a new name to rename any of the columns.
    - Click the eye icon next to a column to hide it.
    - [additional]: Enter name for each additional column.
    - Change the order of the columns by dragging to the desired position.

* **Colorized Thresholds** section:
  * **Base Color**: Select a base, or background, color from the selection list.
  * **Add a Threshold**: Change the color of the table based on the current value.
    *  **Value is**: Enter the value at which the table should appear in the selected color. Choose a color from the dropdown menu next to the value.

#### Table view example

![Table example](/img/chrono-viz-table-example.png)
