---
title: Mosaic visualization
list_title: Mosaic
list_image: /img/influxdb/2-0-visualizations-mosaic-example.png
description: >
  The Mosaic visualization displays state changes in your time series data.
  This visualization type is useful when you want to show changes in string-based states over time.
weight: 206
menu:
  influxdb_cloud:
    name: Mosaic
    parent: Visualization types
---

The **Mosaic** visualization displays state changes in your time series data.
This visualization type is useful when you want to show changes in string-based states over time.

{{< img-hd src="/img/influxdb/2-0-visualizations-mosaic-example.png" alt="Mosaic data visualization" />}}

Select the **Mosaic** option from the visualization dropdown in the upper left.

## Mosaic behavior
The mosaic visualization displays colored tiles based on string values in a specified column.
Each unique string value is represented by a different color.

## Mosaic controls
To view **Mosaic** controls, click **{{< icon "gear" >}} Customize** next to the visualization dropdown.

###### Data
- **Fill Column**: Select a column to fill in the mosaic tiles.
- **X Column**: Select a column to display on the x-axis.
- **Y Column**: Select one or more columns to display on the y-axis.
- **Time Format**: Select the time format. Options include:
    {{< ui/timestamp-formats >}}

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
  - **Custom**: To customize the number of y-axis tick marks, select this option, and then enter the following:
    - **Total Tick Marks**: Enter the total number of ticks to display.
    - **Start Tick Marks At**: Enter the value to start ticks at.
    - **Tick Mark Interval**: Enter the interval in between each tick.

###### Legend
- **Legend Orientation**: Select the orientation of the legend that appears upon hover:
  - **Horizontal**: Select to display the legend horizontally.
  - **Vertical**: Select to display the legend vertically.
- **Opacity**: Adjust the legend opacity using the slider.
- **Colorize Rows**: Select to display legend rows in colors.

## Example query
The following query uses the [Website Monitoring demo data](/influxdb/cloud/reference/sample-data/#influxdb-cloud-demo-data)
to display changes in response times for monitored URLs.
The query assigns a `responseTimeSummary` string value based on the response time range.
Use `responseTimeSummary` as the **Fill Column** in the [visualization controls](#data).

```js
from(bucket: "Website Monitoring Bucket")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r._measurement == "http_response")
  |> filter(fn: (r) => r._field == "response_time")
  |> aggregateWindow(every: v.windowPeriod, fn: max, createEmpty: false)
  |> map(fn: (r) => ({
    r with responseTimeSummary:
      if r._value > 0.6 then "high"
      else if r._value > 0.4 then "medium"
      else "ok"
  }))
```
