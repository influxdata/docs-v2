---
title: Heatmap visualization
list_title: Heatmap
list_image: /img/2-0-visualizations-heatmap-example.png
description: >
  A Heatmap displays the distribution of data on an x and y axes where color
  represents different concentrations of data points.
weight: 203
menu:
  v2_0:
    name: Heatmap
    parent: Visualization types
---

A **Heatmap** displays the distribution of data on an x and y axes where color
represents different concentrations of data points.

{{< img-hd src="/img/2-0-visualizations-heatmap-example.png" alt="Heatmap example" />}}

To select this view, select the **Heatmap** option from the visualization dropdown in the upper right.

#### Heatmap Controls

To view **Heatmap** controls, click the settings icon ({{< icon "gear" >}})
next to the visualization dropdown in the upper right.

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
