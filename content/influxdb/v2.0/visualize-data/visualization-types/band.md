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

The **Band** visualization displays the most recent value for a time series in a Band.

{{< img-hd src="/img/influxdb/2-0-visualizations-Band-example-8.png" alt="Band example" />}}

Select the **Band** option from the visualization dropdown in the upper left.

## Band behavior
The band visualization displays

## Band Controls
To view **Band** controls, click **{{< icon "gear" >}} Customize** next to the visualization dropdown.


###### Data
- **X Column**: The column to select data from.
- **Y Column**: The column to select data from.
- **Time Format**:

###### Options
- **Interpolation**:
- **Line Colors**:
- **Shade Area Below Lines**:
- **Hover Dimension**: Select a color scheme to use for your graph.

###### Y Axis
- **Y Axis Label**: Label for the y-axis.
- **Y-Value Unit Prefix**: None, SI, or Binary.
- 

## Band examples
Band visualizations are useful for showing the current value of a metric and displaying
where it falls within a spectrum.

### Steam pressure Band
The following example queries sensor data that tracks the pressure of steam pipes
in a facility and displays it as a Band.

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

###### Visualization options for pressure Band
{{< img-hd src="/img/influxdb/2-0-visualizations-Band-pressure-8.png" alt="Pressure guage example" />}}
