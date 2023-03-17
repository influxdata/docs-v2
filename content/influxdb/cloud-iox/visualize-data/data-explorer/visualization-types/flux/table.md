---
title: Table visualization
list_title: Table
list_image: /img/influxdb/2-0-visualizations-table-example.png
description: >
  The Table option displays the results of queries in a tabular view, which is
  sometimes easier to analyze than graph views of data.
weight: 202
menu:
  influxdb_cloud_iox:
    name: Table
    parent: Visualization types for Flux
---

## Use Table in the Data Explorer with Flux

The **Table** option displays the results of queries in a tabular view, which is
sometimes easier to analyze than graph views of data.

{{< img-hd src="/img/influxdb/2-0-visualizations-table-example.png" alt="Table example" />}}

Select the **Table** option from the visualization dropdown in the upper left.

## Table behavior
The table visualization renders queried data in structured, easy-to-read tables.
Columns and rows match those in the query output.
If query results contain multiple tables, only one table is shown at a time.
Select other output tables in the far left column of the table visualization.
Tables are identified by their [group key](/{{< latest "flux" >}}/get-started/data-model/#group-key).

## Table Controls
To view **Table** controls, click **{{< icon "gear" >}} Customize** next to
the visualization dropdown.

###### Formatting
- **Default Sort Field**: Select the default sort field. Default is **time**.
- **Time Format**: Select the time format. Options include:
    {{< ui/timestamp-formats >}}

- **Decimal Places**: Enter the number of decimal places. Default (empty field) is **unlimited**.
    - **Auto** or **Custom**: Enable or disable auto-setting.

###### Colorized Thresholds
- **Base Color**: Select a base or background color from the selection list.
- **Add a Threshold**: Change the color of the table based on the current value.
  - **Value is**: Enter the value at which the table should appear in the selected color.
    Choose a color from the dropdown menu next to the value.

###### Column Settings
- **First Column**: Toggle to **Fixed** to lock the first column so that the listings are always visible.
  Threshold settings do not apply in the first column when locked.
- **Table Columns**:
  - Enter a new name to rename any of the columns.
  - Click the eye icon next to a column to hide it.
  - [additional]: Enter name for each additional column.
  - Change the order of the columns by dragging to the desired position.

## Table examples
Tables are helpful when displaying many human-readable metrics in a dashboard
such as cluster statistics or log messages.

### Human-readable cluster metrics
The following example queries the latest reported memory usage from a cluster of servers.

###### Query the latest memory usage from each host
```js
from(bucket: "example-bucket")
    |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
    |> filter(fn: (r) => r._measurement == "mem" and r._field == "used_percent")
    |> group(columns: ["host"])
    |> last()
    |> group()
    |> keep(columns: ["_value", "host"])
```

###### Cluster metrics in a table
{{< img-hd src="/img/influxdb/2-0-visualizations-table-human-readable.png" alt="Human readable metrics in a table" />}}
