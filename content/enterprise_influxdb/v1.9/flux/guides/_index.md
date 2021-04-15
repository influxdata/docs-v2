---
title: Query data with Flux
description: Guides that walk through both common and complex queries and use cases for Flux.
weight: 3
aliases:
    - /flux/latest/
    - /flux/latest/introduction
menu:
  enterprise_influxdb_1_9:
    name: Query with Flux
    parent: Flux
canonical: /{{< latest "influxdb" "v2" >}}/query-data/flux/
v2: /influxdb/v2.0/query-data/flux/
---

The following guides walk through both common and complex queries and use cases for Flux.

{{% note %}}
#### Example data variable
Many of the examples provided in the following guides use a `data` variable,
which represents a basic query that filters data by measurement and field.
`data` is defined as:

```js
data = from(bucket: "db/rp")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "example-measurement" and
    r._field == "example-field"
  )
```
{{% /note %}}

## Flux query guides

{{< children type="anchored-list" pages="all" >}}

---

{{< children pages="all" readmore="true" hr="true" >}}
