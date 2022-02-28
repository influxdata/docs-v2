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

## Set up the Map visualization

To view geo-temporal data on a geographic map, set up a Map visualization.

### Set up the Map visualization

1.  Do one of the following:

    - Click  **Data Explorer** in the navigation bar.

        {{< nav-icon "data-explorer" >}}

    - Click **Dashboards** in the navigation bar:

        {{< nav-icon "dashboards" >}}

        Click the name of the dashboard to update and then do one of the following:

        - **To edit an existing cell**, click the **{{< icon "cog" >}}** icon on
          the cell and then **{{< icon "edit" >}} Configure**.
        - **To create a new cell**, click **{{< icon "add-cell" >}} Add Cell**.

2.  Use the **Query Builder** or the **Script Editor** to enter your query.
    To determine the location of points on a geographic map, query results must
    include the following **fields**:

    - **lat**: latitude in decimal degrees (WGS 84)
    - **lon**: longitude in decimal degrees (WGS 84)

    _**Or**_ the  `s2_cell_id` **tag**  ([S2 Cell ID](https://s2geometry.io/devguide/s2cell_hierarchy.html#s2cellid-numbering) as a token)

    {{% note %}}
If query results include `lat` and `lon` fields _and_ an `s2_cell_id` tag,
the map uses the `lat` and `lon` fields to determine point locations.
If results only include the `s2_cell_id`, the map uses the center of the S2 cell
as the point location.
    {{% /note %}}

    _See [Example queries](#example-queries)._

<!-- 3.  Select the **Map** option from the visualization drop-down list in the upper left,
    and then select one of the following:

    - **Point**: Display each geo-temporal point on the map using a map pin icon
        {{< img-hd src="/img/influxdb/2-0-visualizations-map-point-example.png" alt="Map data visualization" />}}
    - **Circle**: Display each geo-temporal point on the map using a circle icon.
        {{< img-hd src="/img/influxdb/2-0-visualizations-map-circle-example.png" alt="Map data visualization" />}}
    - **Heat**: Display the density of geo-temporal points on the map. More points near a location will appear brighter on the map.
        {{< img-hd src="/img/influxdb/2-0-visualizations-map-heat-example.png" alt="Map data visualization" />}}

4.  Set the following custom options for the map:

    - **Allow Pan and Zoom**: Select this check box to enable panning and zooming on the map.
    - **Latitude**: Slide to set the default latitude to center the map on.
    - **Longitude**: Slide to set the default longitude to center the map on.
    - **Zoom**: Slide to set the default zoom level on the map.
    - **Radius**: _(Heat map only)_ Slide to adjust the bloom radius for geo-temporal points on the map. -->

## Example queries

- [View a bird's migration path](#view-a-birds-migration-path)
- [View earthquakes reported by USGS](#view-earthquakes-reported-by-usgs)

### View a bird's migration path
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

### View earthquakes reported by USGS
The following query uses the [United States Geological Survey (USGS) earthquake data](/influxdb/cloud/reference/sample-data/#usgs-earthquake-data) to display the locations of earthquakes.

```js
from(bucket: "usgs")
    |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
    |> filter(fn: (r) => r._measurement == "earthquakes")
    |> filter(fn: (r) => r._field == "lat" or r._field == "lon")
```

