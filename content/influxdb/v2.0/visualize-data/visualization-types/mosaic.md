---
title: Mosaic visualization
list_title: Mosaic
list_image: /img/influxdb/2-0-visualizations-mosaic-example.png
description: >
  The Mosaic visualization displays data from two or more qualitative variables.
weight: 206
menu:
  influxdb_2_0:
    name: Mosaic
    parent: Visualization types
---

The **Mosaic** visualization displays data from two or more qualitative variables.

{{< img-hd src="/img/influxdb/2-0-visualizations-mosaic-example.png" alt="mosaic example" />}}

Select the **Mosaic** option from the visualization dropdown in the upper left.

## Mosaic behavior
The mosaic visualization displays string values in a graph.


## Mosaic controls
To view **Mosaic** controls, click **{{< icon "gear" >}} Customize** next to the visualization dropdown.

###### Data
- **Fill Column**: Select a column to fill in the mosaic tiles.
- **X Column**: Select a column to display on the x-axis.
- **Y Column**: Select one or more columns to display on the y-axis.
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
- **Color Scheme**: Select a color scheme to use for your graph.

###### X Axis
- **X Axis Label**: Enter a label for the x-axis.
- **Generate X-Axis Tick Marks**: Select the method to generate x-axis tick marks:
  - **Auto**: Select to automatically generate tick marks.
  - **Custom**: To customize the number of x-axis tick marks, select this option, and then enter the following:
    - **Total Tick Marks**: Enter the total number of timestamp ticks to display.
    - **Start Tick Marks At**: Enter the time, in RFC3339 format, to start displaying ticks. Use the **Date Picker** field to automatically generate an RFC3339 formatted timestamp for this field.
    - **Tick Mark Interval**: Enter the number of milliseconds in between each timestamp tick.

###### Y Axis
- **Y Axis Label**: Enter a label for the y-axis.
- **Y Label Separator**: If there's more than one column on the y-axis, enter a delimiter to separate the label, such as a comma or space. If there's no separator specified, the labels are a continuous string of all y columns.
- **Generate Y-Axis Tick Marks**: Select the method to generate y-axis tick marks:
  - **Auto**: Select to automatically generate tick marks.
  - **Custom**: To customize the number of y-axis tick marks, select this option, and then enter  the following:
    - **Total Tick Marks**: Enter the total number of ticks to display.
    - **Start Tick Marks At**: Enter the value to start ticks at.
    - **Tick Mark Interval**: Enter the interval in between each tick.

###### Legend
- **Legend Orientation**: Select the orientation of the legend that appears upon hover:
  - **Horizontal**: Select to display the legend horizontally.
  - **Vertical**: Select to display the legend vertically.
- **Opacity**: Adjust the legend opacity using the slider.
- **Colorize Rows**: Select to display legend rows in colors.
