---
title: geo.gridFilter() function
description: >
  The geo.gridFilter() function filters data by a specified geographic region.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/geo/gridfilter/
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/gridfilter/
menu:
  flux_0_x_ref:
    name: geo.gridFilter
    parent: geo
weight: 401
flux/v0.x/tags: [transformations, geotemporal, geo]
related:
  - /flux/v0.x/stdlib/experimental/geo/strictfilter/
  - /flux/v0.x/stdlib/experimental/geo/filterRows/
  - /{{< latest "influxdb" >}}/query-data/flux/geo/
introduced: 0.63.0
---

The `geo.gridFilter()` function filters data by a specified geographic region.
It compares input data to a set of S2 Cell ID tokens located in the specified [region](#region).

{{% note %}}
S2 Grid cells may not perfectly align with the defined region, so results may include
data with coordinates outside the region, but inside S2 grid cells partially covered by the region.
Use [`toRows()`](/flux/v0.x/stdlib/experimental/geo/torows/) and
[`geo.strictFilter()`](/flux/v0.x/stdlib/experimental/geo/strictfilter/)
after `geo.gridFilter()` to precisely filter points.
_See [Non-strict and strict filtering](#non-strict-and-strict-filtering) below._
{{% /note %}}

```js
import "experimental/geo"

geo.gridFilter(
  region: {lat: 40.69335938, lon: -73.30078125, radius: 20.0}
  minSize: 24,
  maxSize: -1,
  level: -1,
  s2cellIDLevel: -1
)
```

{{% note %}}
#### s2_cell_id must be part of the group key
To filter geo-temporal data with `geo.gridFilter()`, `s2_cell_id` must be part
of the [group key](/influxdb/v2.0/reference/glossary/#group-key).
To add `s2_cell_id` to the group key, use [`experimental.group`](/flux/v0.x/stdlib/experimental/group/):

```js
import "experimental"

// ...
  |> experimental.group(columns: ["s2_cell_id"], mode: "extend")
```
{{% /note %}}

### Non-strict and strict filtering
In most cases, the specified geographic region does not perfectly align with S2 grid cells.

- **Non-strict filtering** returns points that may be outside of the specified region but
  inside S2 grid cells partially covered by the region.
- **Strict filtering** returns only points inside the specified region.

<span class="key-geo-cell"></span> S2 grid cell  
<span class="key-geo-region"></span> Filter region  
<span class="key-geo-point"></span> Returned point

{{< flex >}}
{{% flex-content %}}
**Non-strict filtering**
{{< svg "/static/svgs/geo-non-strict.svg" >}}
{{% /flex-content %}}
{{% flex-content %}}
**Strict filtering**
{{< svg "/static/svgs/geo-strict.svg" >}}
{{% /flex-content %}}
{{< /flex >}}

## Parameters

### region {data-type="record"}
The region containing the desired data points.
Specify record properties for the shape.
_See [Region definitions](/flux/v0.x/stdlib/experimental/geo/#region-definitions)._

### minSize {data-type="int"}
Minimum number of cells that cover the specified region.
Default is `24`.

### maxSize {data-type="int"}
Maximum number of cells that cover the specified region.
Default is `-1`.

### level {data-type="int"}
[S2 cell level](https://s2geometry.io/resources/s2cell_statistics.html) of grid cells.
Default is `-1`.

{{% warn %}}
`level` is mutually exclusive with `minSize` and `maxSize` and must be less than
or equal to `s2cellIDLevel`.
{{% /warn %}}

### s2cellIDLevel {data-type="int"}
[S2 Cell level](https://s2geometry.io/resources/s2cell_statistics.html) used in `s2_cell_id` tag.
Default is `-1`.

{{% note %}}
When set to `-1`, `gridFilter()` attempts to automatically detect the S2 Cell ID level.
{{% /note %}}

## Examples

##### Filter data in a box-shaped region
```js
import "experimental/geo"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.gridFilter(
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
  |> geo.gridFilter(
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
  |> geo.gridFilter(
    region: {
      points: [
        {lat: 40.671659, lon: -73.936631},
        {lat: 40.706543, lon: -73.749177},
        {lat: 40.791333, lon: -73.880327}
      ]
    }
  )
```
