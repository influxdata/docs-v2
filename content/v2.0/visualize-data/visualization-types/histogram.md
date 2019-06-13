---
title: Histogram visualization
list_title: Histogram
list_image: /img/2-0-visualizations-histogram-example.png
description: >
  A histogram is a way to view the distribution of data. Unlike column charts, histograms have no time axis.
  The y-axis is dedicated to count, and the x-axis is divided into bins.
weight: 204
menu:
  v2_0:
    name: Histogram
    parent: Visualization types
---

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
