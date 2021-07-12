---
title: geo.strictFilter() function
description: >
  The geo.strictFilter() function filters data by latitude and longitude.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/geo/strictfilter/
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/strictfilter/
menu:
  flux_0_x_ref:
    name: geo.strictFilter
    parent: geo
weight: 401
flux/v0.x/tags: [transformations, filters, geotemporal, geo]
related:
  - /flux/v0.x/stdlib/experimental/geo/gridfilter/
  - /flux/v0.x/stdlib/experimental/geo/filterRows/
  - /flux/v0.x/stdlib/experimental/geo/toRows/
  - /{{< latest "influxdb" >}}/query-data/flux/geo/
introduced: 0.63.0
---

The `geo.strictFilter()` function filters data by latitude and longitude in a specified region.
This filter is more strict than [`geo.gridFilter()`](/flux/v0.x/stdlib/experimental/geo/gridfilter/),
but for the best performance, use `geo.strictFilter()` **after** `geo.gridFilter()`.
_See [Strict and non-strict filtering](#strict-and-non-strict-filtering) below._

```js
import "experimental/geo"

geo.strictFilter(
  region: {lat: 40.69335938, lon: -73.30078125, radius: 20.0}
)
```

{{% note %}}
`geo.strictFilter()` requires `lat` and `lon` columns in each row.
Use [`geo.toRows()`](/flux/v0.x/stdlib/experimental/geo/gridfilter/)
to pivot `lat` and `lon` fields into each row **before** using `geo.strictFilter()`.
{{% /note %}}

### Strict and non-strict filtering
In most cases, the specified geographic region does not perfectly align with S2 grid cells.

- **Strict filtering** returns only points inside the specified region.
- **Non-strict filtering** returns points that may be outside of the specified region but
  inside S2 grid cells partially covered by the region.

<span class="key-geo-cell"></span> S2 grid cell  
<span class="key-geo-region"></span> Filter region  
<span class="key-geo-point"></span> Returned point

{{< flex >}}
{{% flex-content %}}
**Strict filtering**
{{< svg "/static/svgs/geo-strict.svg" >}}
{{% /flex-content %}}
{{% flex-content %}}
**Non-strict filtering**
{{< svg "/static/svgs/geo-non-strict.svg" >}}
{{% /flex-content %}}
{{< /flex >}}

## Parameters

### region {data-type="record"}
The region containing the desired data points.
Specify record properties for the shape.
_See [Region definitions](/flux/v0.x/stdlib/experimental/geo/#region-definitions)._

## Examples

##### Filter data in a box-shaped region
```js
import "experimental/geo"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.toRows()
  |> geo.strictFilter(
    region: {
      minLat: 40.51757813,
      maxLat: 40.86914063,
      minLon: -73.65234375,
      maxLon: -72.94921875
    }
  )
```

##### Filter data in a circular region
```js
import "experimental/geo"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.toRows()
  |> geo.strictFilter(
    region: {
      lat: 40.69335938,
      lon: -73.30078125,
      radius: 20.0
    }
  )
```

##### Filter data in a custom polygon region
```js
import "experimental/geo"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.toRows()
  |> geo.strictFilter(
    region: {
      points: [
        {lat: 40.671659, lon: -73.936631},
        {lat: 40.706543, lon: -73.749177},
        {lat: 40.791333, lon: -73.880327}
      ]
    }
  )
```
