---
title: Gauge visualization
list_title: Gauge
list_image: /img/influxdb/2-0-visualizations-gauge-example.png
description: >
  The Gauge view displays the single value most recent value for a time series in a gauge view.
weight: 206
menu:
  influxdb_2_0:
    name: Gauge
    parent: Visualization types
---

The **Gauge** visualization displays the most recent value for a time series in a gauge.

{{< img-hd src="/img/influxdb/2-0-visualizations-gauge-example-8.png" alt="Gauge example" />}}

Select the **Gauge** option from the visualization dropdown in the upper right.

## Gauge behavior
The gauge visualization displays a single numeric data point within a defined spectrum (_default is 0-100_).
It uses the latest point in the first table (or series) returned by the query.

{{% note %}}
#### Queries should return one table
Flux does not guarantee the order in which tables are returned.
If a query returns multiple tables (or series), the table order can change between query executions
and result in the Gauge displaying inconsistent data.
For consistent results, the Gauge query should return a single table.
{{% /note %}}

## Gauge Controls
To view **Gauge** controls, click **{{< icon "gear" >}} Customize** next to
the visualization dropdown.

- **Prefix**: Prefix to add to the gauge.
- **Suffix**: Suffix to add to the gauge.
- **Decimal Places**: The number of decimal places to display for the gauge.
  - **Auto** or **Custom**: Enable or disable auto-setting.

###### Colorized Thresholds
- **Base Color**: Select a base or background color from the selection list.
- **Add a Threshold**: Change the color of the gauge based on the current value.
  - **Value is**: Enter the value at which the gauge should appear in the selected color.
    Choose a color from the dropdown menu next to the value.

## Gauge examples
Gauge visualizations are useful for showing the current value of a metric and displaying
where it falls within a spectrum.

### Steam pressure gauge
The following example queries sensor data that tracks the pressure of steam pipes
in a facility and displays it as a gauge.

###### Query pressure data from a specific sensor
```js
from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) =>
      r._measurement == "steam-sensors" and
      r._field == "psi"
      r.sensorID == "a211i"
  )
```

###### Visualization options for pressure gauge
{{< img-hd src="/img/influxdb/2-0-visualizations-gauge-pressure-8.png" alt="Pressure guage example" />}}
