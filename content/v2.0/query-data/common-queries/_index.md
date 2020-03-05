---
title: Common Flux queries
description: >
  placeholder
weight: 103
menu:
  v2_0:
    parent: Query data
    name: Common queries
v2.0/tags: [query]
---


{{% note %}}
#### Example data variable
Many of the examples provided in the following guides use a `data` variable,
which represents a basic query which filters data by measurement and field.
`data` is defined as:

```js
data = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "example-measurement" and
    r._field == "example-field"
  )
```
{{% /note %}}

{{< children >}}

---

- [x] SELECT-like commands
- [x] Median
- [x] Percentile
- [ ] Cumulative Sum
- [ ] Moving Average
- [ ] Increase
- [ ] Rate
- [ ] Delta
- [ ] Window
- [ ] First/Last
- [ ] Histogram
- [ ] Gap filling
- [ ] Last observation carried forward
- [ ] Last point
