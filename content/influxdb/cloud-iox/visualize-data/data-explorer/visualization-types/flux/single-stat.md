---
title: Single Stat visualization
list_title: Single stat
list_image: /img/influxdb/2-0-visualizations-single-stat-example.png
description: >
  The Single Stat view displays the most recent value of the specified time series as a numerical value.
weight: 202
menu:
  influxdb_cloud_iox:
    name: Single Stat
    parent: Visualization types for Flux
---

## Use Single Stat in the Data Explorer with Flux

The **Single Stat** view displays the most recent value of the specified time series as a numerical value.

{{< img-hd src="/img/influxdb/2-0-visualizations-single-stat-example-8.png" alt="Single stat example" />}}

Select the **Single Stat** option from the visualization dropdown in the upper left.

## Single Stat behavior
The Single Stat visualization displays a single numeric data point.
It uses the latest point in the first table (or series) returned by the query.

{{% note %}}
#### Queries should return one table
Flux does not guarantee the order in which tables are returned.
If a query returns multiple tables (or series), the table order can change between query executions
and result in the Single Stat visualization displaying inconsistent data.
For consistent results, the Single Stat query should return a single table.
{{% /note %}}

## Single Stat Controls
To view **Single Stat** controls, click **{{< icon "gear" >}} Customize** next to
the visualization dropdown.

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

## Single Stat examples

### Show human-readable current value
The following example shows the current memory usage displayed has a human-readable percentage:

###### Query memory usage percentage
```js
from(bucket: "example-bucket")
    |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
    |> filter(fn: (r) => r._measurement == "mem" and r._field == "used_percent")
```

###### Memory usage as a single stat
{{< img-hd src="/img/influxdb/2-0-visualizations-single-stat-example-8.png" alt="Graph + Single Stat Memory Usage Example" />}}
