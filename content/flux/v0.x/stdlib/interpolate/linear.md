---
title: interpolate.linear() function
description: >
  The `interpolate.linear` function inserts rows at regular intervals using
  **linear interpolation** to determine values for inserted rows.
menu:
  flux_0_x_ref:
    name: interpolate.linear
    parent: interpolate
weight: 101
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/interpolate/linear/
  - /influxdb/cloud/reference/flux/stdlib/interpolate/linear/
introduced: 0.87.0
list_query_example: interpolate_linear
---

The `interpolate.linear` function inserts rows at regular intervals using
[linear interpolation](https://en.wikipedia.org/wiki/Linear_interpolation)
to determine values for inserted rows.

```js
import "interpolate"

interpolate.linear(every: 1m)
```

#### Function requirements
- Input data must have `_time` and `_value` columns.
- **All columns** other than `_time` and `_value` must be part of the group key.

## Parameters

### every {data-type="duration"}
Duration of time between interpolated points.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

### Interpolate missing data by day
```js
import "interpolate"

data
  |> interpolate.linear(every: 1d)
```

{{< flex >}}
{{% flex-content %}}
##### Input
| _time                | _value |
|:-----                | ------:|
| 2021-01-01T00:00:00Z | 10.0   |
| 2021-01-02T00:00:00Z | 20.0   |
| 2021-01-04T00:00:00Z | 40.0   |
| 2021-01-05T00:00:00Z | 50.0   |
| 2021-01-08T00:00:00Z | 80.0   |
| 2021-01-09T00:00:00Z | 90.0   |
{{% /flex-content %}}
{{% flex-content %}}
##### Output
| _time                | _value |
|:-----                | ------:|
| 2021-01-01T00:00:00Z | 10.0   |
| 2021-01-02T00:00:00Z | 20.0   |
| 2021-01-04T00:00:00Z | 40.0   |
| 2021-01-05T00:00:00Z | 50.0   |
| 2021-01-06T00:00:00Z | 60.0   |
| 2021-01-07T00:00:00Z | 70.0   |
| 2021-01-08T00:00:00Z | 80.0   |
| 2021-01-09T00:00:00Z | 90.0   |
{{% /flex-content %}}

{{< /flex >}}

