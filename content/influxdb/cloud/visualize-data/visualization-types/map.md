---
title: Map visualization
list_title: Map
list_image: /img/influxdb/2-0-visualizations-map-point-example.png
description: >
  The Map visualization displays geo-temporal data on a geographic map.
weight: 206
menu:
  influxdb_cloud:
    name: Map
    parent: Visualization types
---

The **Map** visualization displays geo-temporal data on a geographic map.

{{< img-hd src="/img/influxdb/2-0-visualizations-map-point-example.png" alt="Map data visualization" />}}

Select the **Map** option from the visualization dropdown in the upper left.

## Map behavior
The map visualization displays geo-temporal data using **lat** and **lon** field values in query results.
Input data must have the following **fields**:

- **lat:** latitude in **decimal degrees** (WGS 84)
- **lon:** longitude in **decimal degrees** (WGS 84)

The visualization associates latitude and longitude values using the timestamps and tag set of each point.
Latitude and longitude field values that share a common timestamp and tag set are mapped as a single geo-temporal point.

## Map controls
To view **Map** controls, click **{{< icon "gear" >}} Customize** next to the visualization dropdown.

### Map visualization modes
Choose from the following map visualization modes:

- [Point](#point)
- [Circle](#circle)
- [Heat](#heat)
- [Track](#track)

#### Point
The **Point** mode displays each geo-temporal point on the map using a map pin icon.

<!-- insert image -->

##### Customize Geo Options
- **Allow pan and zoom**: Toggle users' ability to pan and zoom the map.
- **Latitude**: Default latitude to center the map on.
- **Longitude**: Default longitude to center the map on.
- **Zoom**: Zoom level.

#### Circle
The **Circle** mode displays... <!-- NEED CONTENT -->

<!-- insert image -->

##### Customize Geo Options
- **Allow pan and zoom**: Toggle users' ability to pan and zoom the map.
- **Latitude**: Default latitude to center the map on.
- **Longitude**: Default longitude to center the map on.
- **Zoom**: Zoom level.

#### Heat
The **Heat** mode displays... <!-- NEED CONTENT -->

<!-- insert image -->

##### Customize Geo Options
- **Allow pan and zoom**: Toggle users' ability to pan and zoom the map.
- **Latitude**: Default latitude to center the map on.
- **Longitude**: Default longitude to center the map on.
- **Zoom**: Zoom level.
- **Radius**:

#### Track
The **Track** mode displays... <!-- NEED CONTENT -->

<!-- insert image -->

##### Customize Geo Options
- **Allow pan and zoom**: Toggle users' ability to pan and zoom the map.
- **Latitude**: Default latitude to center the map on.
- **Longitude**: Default longitude to center the map on.
- **Zoom**: Zoom level.

## Example query
The following query uses the [Bird migration sample data](/influxdb/cloud/reference/sample-data/#bird-migration-sample-data)
to display the migration path of a specific bird.

```js
from(bucket: "migration")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r._measurement == "migration")
  |> filter(fn: (r) => r._field == "lat" or r._field == "lon")
  |> filter(fn: (r) => r.id == "91864A")  
  |> aggregateWindow(every: v.windowPeriod, fn: last)
```
