---
title: geo.shapeData() function
description: >
  The `geo.shapeData()` function renames existing latitude and longitude fields to
  **lat** and **lon** and adds an **s2_cell_id** tag.
  Use `geo.shapeData()` to ensure geo-temporal data meets the requirements of the Geo package.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/geo/shapedata/
  - /influxdb/cloud/reference/flux/stdlib/experimental/geo/shapedata/
menu:
  flux_0_x_ref:
    name: geo.shapeData
    parent: geo
weight: 401
flux/v0.x/tags: [transformations, geotemporal, geo]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/geo/
introduced: 0.65.0
---

The `geo.shapeData()` function renames existing latitude and longitude fields to
**lat** and **lon** and adds an **s2_cell_id** tag.
Use `geo.shapeData()` to ensure geo-temporal data meets the
[requirements of the Geo package](/flux/v0.x/stdlib/experimental/geo/#geo-schema-requirements):

1. Rename existing latitude and longitude fields to `lat` and `lon`.
2. Pivot data into row-wise sets based on `_time`.
3. Generate `s2_cell_id` tags using `lat` and `lon` values and a specified
   [S2 cell level](https://s2geometry.io/resources/s2cell_statistics.html).

```js
import "experimental/geo"

geo.shapeData(
    latField: "latitude",
    lonField: "longitude",
    level: 10,
)
```

## Parameters

### latField {data-type="string"}
Name of the existing field that contains the latitude value in **decimal degrees** (WGS 84).
Field is renamed to `lat`.

### lonField {data-type="string"}
Name of the existing field that contains the longitude value in **decimal degrees** (WGS 84).
Field is renamed to `lon`.

### level {data-type="int"}
[S2 cell level](https://s2geometry.io/resources/s2cell_statistics.html) to use
when generating the S2 cell ID token.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

##### Shape data to meet the requirements of the Geo package
```js
import "experimental/geo"

from(bucket: "example-bucket")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "example-measurement")
    |> geo.shapeData(latField: "latitude", lonField: "longitude", level: 10)
```

### geo.shapeData input and output

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time | _field    | _value |
|:----- |:------:   | ------:|
| 0001  | latitude  | 30.0   |
| 0002  | latitude  | 30.5   |
| 0003  | latitude  | 30.7   |
| 0004  | latitude  | 31.1   |
| • • • |   • • •   | • • •  |
| 0001  | longitude | 20.0   |
| 0002  | longitude | 19.8   |
| 0003  | longitude | 19.2   |
| 0004  | longitude | 19.5   |
{{% /flex-content %}}
{{% flex-content %}}

**The following would output:**

```js
data
    |> geo.shapeData(
        latField: "latitude",
        lonField: "longitude",
        level: 5,
    )
```

| _time | lat      | lon       | s2_cell_id |
|:----- |:--------:|:---------:| ----------:|
| 0001  | 30.0     | 20.0      | 138c       |
| 0002  | 30.5     | 19.8      | 1384       |
| 0003  | 30.7     | 19.2      | 139c       |
| 0004  | 31.1     | 19.5      | 139c       |
{{% /flex-content %}}
{{< /flex >}}
