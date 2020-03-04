---
title: geo.filterRows() function
description: >
  The geo.filterRows() function filters data by a specified geographic region with
  the option of strict filtering.
menu:
  v2_0_ref:
    name: geo.filterRows
    parent: Geo
weight: 301
v2.0/tags: [functions, geo]
related:
  - /v2.0/reference/flux/stdlib/experimental/geo/gridfilter/
  - /v2.0/reference/flux/stdlib/experimental/geo/strictfilter/
---

The `geo.filterRows()` function filters data by a specified geographic region with
the option of strict filtering.
This function is a combination of [`geo.gridFilter()`](/v2.0/reference/flux/stdlib/experimental/geo/gridfilter/)
and [`geo.strictFilter()`](/v2.0/reference/flux/stdlib/experimental/geo/strictfilter/).

_**Function type:** Transformation_

```js
import "experimental/geo"

geo.filterRows(
  region: {lat: 40.69335938, lon: -73.30078125, radius: 20.0}
  minSize: 24,
  maxSize: -1,
  level: -1,
  s2cellIDLevel: -1,
  correlationKey: ["_time"],
  strict: true
)
```

## Parameters

The region containing the desired data points.
_See [Region definitions](/v2.0/reference/flux/stdlib/experimental/geo/#region-definitions)._

_**Data type:** Object_

### minSize
Minimum number of tiles that cover the specified region.
Default is `24`.

_**Data type:** Integer_

### maxSize
Maximum number of tiles that cover the specified region.
Default is `-1`.

_**Data type:** Integer_

### level
Desired [cell level](https://s2geometry.io/resources/s2cell_statistics.html) of grid tiles.
Default is `-1`.

_**Data type:** Integer_

{{% warn %}}
`level` is mutually exclusive with `minSize` and `maxSize` and must be less than
or equal to `s2cellIDLevel`.
{{% /warn %}}

### s2cellIDLevel
[S2 Cell level](https://s2geometry.io/resources/s2cell_statistics.html) in `s2_cell_id` tag.
Default is `-1`.

_**Data type:** Integer_

{{% note %}}
When set to `-1`, `geo.filterRows()` attempts to automatically detect the S2 Cell ID level.
{{% /note %}}

### correlationKey
List of columns used to uniquely identify a row for output.
Default is `["_time"]`.

_**Data type:** Array of strings_

### strict
Enable strict geographic data filtering.
Default is `true`.

_**Data type:** Boolean_

## Examples

##### Strictly filter data in a box-shaped region
```js
import "experimental/geo"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.filterRows(
    region: {
      minLat: 40.51757813,
      maxLat: 40.86914063,
      minLon: -73.65234375,
      maxLon: -72.94921875
    }
  )
```

##### Approximately filter data in a circular region
```js
import "experimental/geo"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.filterRows(
    region: {
      lat: 40.69335938,
      lon: -73.30078125,
      radius: 20.0
    }
    strict: false
  )
```

##### Filter data in a custom polygon region
```js
import "experimental/geo"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.filterRows(
    region: {
      points: [
        {lat: 40.671659, lon: -73.936631},
        {lat: 40.706543, lon: -73.749177},
        {lat: 40.791333, lon: -73.880327}
      ]
    }
  )
```

## Function definition
{{% truncate %}}
```js
filterRows = (
  tables=<-,
  region,
  minSize=24,
  maxSize=-1,
  level=-1,
  s2cellIDLevel=-1,
  correlationKey=["_time"],
  strict=true
) => {
  _rows =
    tables
      |> gridFilter(
        region,
        minSize: minSize,
        maxSize: maxSize,
        level: level,
        s2cellIDLevel: s2cellIDLevel
      )
      |> toRows(correlationKey)
  _result =
    if strict then
      _rows
        |> strictFilter(region)
    else
      _rows
  return _result
}
```
{{% /truncate %}}
