---
title: v1.fieldsAsCols() function
description: The v1.fieldsAsCols() function pivots a table to automatically align fields within each input table that have the same timestamp.
aliases:
  - /influxdb/v2.0/reference/flux/functions/inputs/fromrows
  - /influxdb/v2.0/reference/flux/functions/transformations/influxfieldsascols
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/fieldsascols/
  - /influxdb/v2.0/reference/flux/functions/influxdb-schema/fieldsascols/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/fieldsascols/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/fieldsascols/
menu:
  flux_0_x_ref:
    name: v1.fieldsAsCols
    parent: v1
weight: 301
flux/v0.x/tags: [transformations]
introduced: 0.16.0
deprecated: 0.88.0
---

{{% warn %}}
`v1.fieldsAsCols()` was deprecated in **Flux v0.88.0** in favor of
[`schema.fieldsAsCols()`](/flux/v0.x/stdlib/influxdata/influxdb/schema/fieldsascols/).
{{% /warn %}}

The `v1.fieldsAsCols()` function is a special application of the
[`pivot()`](/flux/v0.x/stdlib/universe/pivot/)
function that pivots on `_field` and `_time` columns to aligns fields within each
input table that have the same timestamp. and resemble InfluxDB 1.x query output.

```js
import "influxdata/influxdb/v1"

v1.fieldsAsCols()
```

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
```js
import "influxdata/influxdb/v1"

from(bucket:"example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "cpu")
  |> v1.fieldsAsCols()
```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

_`_start` and `_stop` columns have been omitted._

##### Example input data
| _measurement | _host | _time                | _field  | _value |
| :----------- | :---- | :------------------- | :------ | -----: |
| example      | h1    | 2021-01-01T00:00:00Z | resp_ms |     43 |
| example      | h1    | 2021-01-01T00:00:30Z | resp_ms |     52 |
| example      | h1    | 2021-01-01T00:01:00Z | resp_ms |  30000 |
| example      | h1    | 2021-01-01T00:01:30Z | resp_ms |     49 |

| _measurement | _host | _time                | _field    | _value |
| :----------- | :---- | :------------------- | :-------- | -----: |
| example      | h1    | 2021-01-01T00:00:00Z | resp_code |    200 |
| example      | h1    | 2021-01-01T00:00:30Z | resp_code |    200 |
| example      | h1    | 2021-01-01T00:01:00Z | resp_code |    500 |
| example      | h1    | 2021-01-01T00:01:30Z | resp_code |    200 |

##### Example output data
| _measurement | _host | _time                | resp_ms | resp_code |
| :----------- | :---- | :------------------- | ------: | --------: |
| example      | h1    | 2021-01-01T00:00:00Z |      43 |       200 |
| example      | h1    | 2021-01-01T00:00:30Z |      52 |       200 |
| example      | h1    | 2021-01-01T00:01:00Z |   30000 |       500 |
| example      | h1    | 2021-01-01T00:01:30Z |      49 |       200 |

{{% /expand %}}
{{< /expand-wrapper >}}

## Function definition
```js
package v1

fieldsAsCols = (tables=<-) =>
  tables
    |> pivot(
      rowKey:["_time"],
      columnKey: ["_field"],
      valueColumn: "_value"
    )
```
