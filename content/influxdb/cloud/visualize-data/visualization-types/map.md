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

1.  Configure map visualizations in either the **Data Explorer** or a **Dashboard**:

    {{< tabs-wrapper >}}
{{% tabs %}}
[Data Explorer](#)
[Dashboards](#)
{{% /tabs %}}
{{% tab-content %}}
{{< nav-icon "data-explorer" >}}

Click the **Data Explorer** icon in the navigation bar.
{{% /tab-content %}}
{{% tab-content %}}
{{< nav-icon "dashboards" >}}

1.  Click the **Dashboards** icon in the navigation bar.
2.  Click the name the dashboard to update.
3.  **To edit an existing cell**, click the **<span class="inline icon-cog-thick middle small"></span>**
    icon on the cell and then **<span class="inline icon-pencil middle small"></span> Configure**.  
    **To create a new cell**, click **<span class="inline icon-add-cell small"></span> Add Cell**.

{{% /tab-content %}}
    {{< /tabs-wrapper >}}

2.  Use the **Query Builder** or the **Script Editor** to enter your query.
    To determine the location of data points on a geographic map,
    you must include the following fields with your input data:

    - **lat**: latitude in decimal degrees (WGS 84)
    - **lon**: longitude in decimal degrees (WGS 84)

    _See [Example queries](#example-queries)._

3.  Select the **Map** option from the visualization drop-down list in the upper left,
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
    - **Radius**: _(Heat map only)_ Slide to adjust the bloom radius for geo-temporal points on the map.

## Example query

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
