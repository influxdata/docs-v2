---
title: Band visualization
list_title: Band
list_image: /img/influxdb/2-0-visualizations-Band-example.png
description: >
  The Band view displays the single value most recent value for a time series in a Band view.
weight: 206
menu:
  influxdb_2_0:
    name: band
    parent: Visualization types
---

The **Band** visualization displays the upper and lower boundaries for groups of data over time.

{{< img-hd src="/img/influxdb/2-0-visualizations-Band-example.png" alt="Band example" />}}

Select the **Band** option from the visualization dropdown in the upper left.

## Band behavior

The band visualization displays

## Band controls

To view **Band** controls, click **{{< icon "gear" >}} Customize** next to the visualization dropdown.


###### Data
- **X Column**: Select a column to display on the x-axis.
- **Y Column**: Select a column to display on the y-axis.
- **Time Format**: Select the time format. Options include:
    - `MM/DD/YYYY HH:mm:ss` (default)
    - `MM/DD/YYYY HH:mm:ss.SSS`
    - `YYYY-MM-DD HH:mm:ss`
    - `HH:mm:ss`
    - `HH:mm:ss.SSS`
    - `MMMM D, YYYY HH:mm:ss`
    - `dddd, MMMM D, YYYY HH:mm:ss`
    - `Custom`

###### Aggregate Functions
- **Upper Column Name**: Aggregate function to display for upper bounds of data.
- **Main Column Name**: Aggregate function to display for main graph line.
- **Lower Column Name**: Aggregate function to display for lower bounds of data.


###### Options
- **Interpolation**:
  - **Line**: Display a time series in a line graph
  - **Smooth**: Display a time series in a line graph with smooth point interpolation.
  - **Step**: Display a time series in a staircase graph.
- **Line Colors**: Select a color scheme to use for your graph.
- **Hover Dimension**: Select the data to display in the tooltip when you hover over the graph:
  - **auto** or **X Axis**: Show all points with the same x value along the y-axis.
  - **Y Axis**: Show all points with the same y value along the x-axis.
  - **X & Y Axis**: Show only the point currently being hovered over.


###### Y Axis
- **Y Axis Label**: Label for the y-axis.
- **Y-Value Unit Prefix**: None, SI, or Binary.
- **Y Axis Prefix**:
- **Y Axis Suffix**:
- **Y Axis Domain**:

## Band examples
- **Y Axis Domain**: The y-axis value range.
  - **Auto**: Automatically determine the value range based on values in the data set.
  - **Custom**: Manually specify the minimum y-axis value, maximum y-axis value, or range by including both.
      - **Min**: Minimum y-axis value.
      - **Max**: Maximum y-axis value.
