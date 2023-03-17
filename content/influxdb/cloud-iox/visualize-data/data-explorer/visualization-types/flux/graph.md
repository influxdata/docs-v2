---
title: Graph visualization
list_title: Graph
list_image: /img/influxdb/2-0-visualizations-line-graph-example.png
description: >
  The Graph view lets you select from multiple graph types such as line graphs and bar graphs *(Coming)*.
weight: 201
menu:
  influxdb_cloud_iox:
    name: Graph
    parent: Visualization types for Flux
---

## Use Graph in the Data Explorer with Flux

The Graph visualization provides several types of graphs, each configured through
the [Graph controls](#graph-controls).

{{< img-hd src="/img/influxdb/2-0-visualizations-line-graph-example-8.png" alt="Line Graph example" />}}

Select the **Graph** option from the visualization dropdown in the upper left.

## Graph behavior
The Graph visualization color codes each table (or series) in the queried data set.
When multiple series are present, it automatically assigns colors based on the selected [Line Colors option](#options).

When using a line graph, all points within a single table are connected. When multiple series are present, it automatically assigns colors based on the selected [Line Colors option](#options).

## Graph controls
To view **Graph** controls, click **{{< icon "gear" >}} Customize** next to
the visualization dropdown.

###### Data
- **X Column**: Select a column to display on the x-axis.
- **Y Column**: Select a column to display on the y-axis.
{{% cloud-only %}}

- **Adaptive Zoom**: Enable this option to zoom in on graphs for a more granular view. Zooming in dynamically updates the window period to re-query the data.
  {{% warn %}}
  If you've hard-coded the window period, we don't recommend enabling this option.
  {{% /warn %}}

{{% /cloud-only %}}

###### Options
- **Time Format**: Select the time format. Options include:
    {{< ui/timestamp-formats >}}
- **Interpolation**: Select from the following options:
  - **Linear**: Display a time series in a line graph
  - **Smooth**: Display a time series in a line graph with smooth point interpolation.
  - **Step**: Display a time series in a staircase graph.
  <!-- - **Bar**: Display the specified time series using a bar chart. -->
  <!-- - **Stacked**: Display multiple time series bars as segments stacked on top of each other. -->
- **Line Colors**: Select a color scheme to use for your graph.
- **Shade Area Below Lines**: Shade in the area below the graph lines.
- **Hover Dimension**: Select the data to display in the tooltip when you hover over the graph:
  - **auto** or **X Axis**: Show all points with the same x value along the y-axis.
  - **Y Axis**: Show all points with the same y value along the x-axis.
  - **X & Y Axis**: Show only the point currently being hovered over.

###### X Axis
- **Generate X-Axis Tick Marks**: Select the method to generate x-axis tick marks:
  - **Auto**: Select to automatically generate tick marks.
  - **Custom**: To customize the number of x-axis tick marks, select this option, and then enter the following:
    - **Total Tick Marks**: Enter the total number of ticks to display.
    - **Start Tick Marks At**: Enter the value to start ticks at.
    - **Tick Mark Interval**: Enter the interval in between each tick.

###### Y Axis
- **Y Axis Label**: Label for the y-axis.
- **Y-Value Unit Prefix**: 
  - **None**: 
  - **SI**: 
  - **Binary**: 
- **Y Axis Prefix**: Prefix to be added to y-value.
- **Y Axis Suffix**: Suffix to be added to y-value.
- **Generate Y-Axis Tick Marks**: Select the method to generate y-axis tick marks:
  - **Auto**: Select to automatically generate tick marks.
  - **Custom**: To customize the number of y-axis tick marks, select this option, and then enter  the following:
    - **Total Tick Marks**: Enter the total number of ticks to display.
    - **Start Tick Marks At**: Enter the value to start ticks at.
    - **Tick Mark Interval**: Enter the interval in between each tick.
- **Y Axis Domain**: The y-axis value range.
  - **Auto**: Automatically determine the value range based on values in the data set.
  - **Custom**: Manually specify the minimum y-axis value, maximum y-axis value, or range by including both.
      - **Min**: Minimum y-axis value.
      - **Max**: Maximum y-axis value.
- **Positioning**:
  - **Overlaid**: Display graph lines overlaid on each other.
  - **Stacked**: Display graph lines stacked on top of each other.

###### Hover Legend 
- **Display Hover Legend**:
  - **Hide**: Hide the legend that appears upon hover.
  - **Show**: Show the legend upon hover.
    - **Orientation**: Select the orientation of the legend:
      - **Horizontal**: Select to display the legend horizontally.
      - **Vertical**: Select to display the legend vertically.
    - **Opacity**: Adjust the hover legend opacity using the slider.
    - **Colorize Rows**: Select to display hover legend rows in colors.

###### Static Legend
  - **Display Static Legend**:
  - **Hide**: Hide the static legend.
  - **Show**: Always show the static legend.
    - **Orientation**: Select the orientation of the legend:
      - **Horizontal**: Select to display the legend horizontally.
      - **Vertical**: Select to display the legend vertically.
    - **Opacity**: Adjust the static legend opacity using the slider.
    - **Colorize Rows**: Select to display static legend rows in colors.
    - **Displayed Value**: Select **Latest Y Axis** or **Latest X Axis** to determine whether the y or x axis appears on the legend.
    - **Height**: Adjust the height of the static legend using the slider.

## Graph Examples

##### Graph with linear interpolation and static legend
{{< img-hd src="/img/influxdb/2-0-visualizations-graph-linear-static.png" alt="Line Graph example" />}}

##### Graph with smooth interpolation and hover legend
{{< img-hd src="/img/influxdb/2-0-visualizations-graph-smooth-hover.png" alt="Step-Plot Graph example" />}}

##### Graph with step interpolation and no visible legend
{{< img-hd src="/img/influxdb/2-0-visualizations-line-graph-step-example-8.png" alt="Step-Plot Graph example" />}}

<!-- ##### Stacked Graph example
{{< img-hd src="/img/2-0-visualizations-stacked-graph-example.png" alt="Stacked Graph example" />}} -->

<!-- ##### Bar Graph example
{{< img-hd src="/img/2-0-visualizations-bar-graph-example.png" alt="Bar Graph example" />}} -->
