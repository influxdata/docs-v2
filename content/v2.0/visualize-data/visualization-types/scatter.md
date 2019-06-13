---
title: Scatter visualization
list_title: Scatter
description: >
  The Scatter view uses a scatter plot to display time series data.
weight: 208
menu:
  v2_0:
    name: Scatter
    parent: Visualization types
---

The **Scatter** view uses a scatter plot to display time series data.

{{< img-hd src="/img/2-0-visualizations-scatter-example.png" alt="Scatter plot example" />}}

To select this view, select the **Scatter** option from the visualization dropdown in the upper right.

#### Scatter controls
To view **Scatter** controls, click the settings icon ({{< icon "gear" >}}) next
to the visualization dropdown in the upper right.

###### Data
- **Symbol column**: Define a column containing values that should be differentiated with symbols.
- **Fill column**: Define a column containing values that should be differentiated with fill color.
- **X Column**: Select a column to display on the x-axis.
- **Y Column**: Select a column to display on the y-axis.

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
