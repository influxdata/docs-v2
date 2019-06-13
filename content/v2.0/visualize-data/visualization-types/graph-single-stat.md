---
title: Graph + Single Stat visualization
list_title: Graph + Single Stat
list_image: /img/2-0-visualizations-line-graph-single-stat-example.png
description: >
  The Graph + Single Stat view displays the specified time series in a line graph
  and overlays the single most recent value as a large numeric value.
weight: 202
menu:
  v2_0:
    name: Graph + Single Stat
    parent: Visualization types
---

The **Graph + Single Stat** view displays the specified time series in a line graph
and overlays the single most recent value as a large numeric value.

{{< img-hd src="/img/2-0-visualizations-line-graph-single-stat-example.png" alt="Line Graph + Single Stat example" />}}

To select this view, select the **Graph + Single Stat** option from the visualization
dropdown in the upper right.

#### Graph + Single Stat Controls

To view **Graph + Single Stat** controls, click the settings icon ({{< icon "gear" >}})
next to the visualization dropdown in the upper right.

###### Data
- **X Column**: Select a column to display on the x-axis.
- **Y Column**: Select a column to display on the y-axis.

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
