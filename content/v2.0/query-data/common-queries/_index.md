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


## Moving Average
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "example-key"
  )
  |> movingAverage()
```

## Increase
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "example-key"
  )
  |> increase()
```

## Rate
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "example-key"
  )
  |> derivative(unit: 1s, nonNegative: true)
```

```js
import "experimental/aggregate"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "example-key"
  )
  |> aggregate.rate(unit: 1s, every: 5m)
```

## Delta (state changes only)


## Window (time buckets)
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "example-key"
  )
  |> window(every: 5m)
```

```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "example-key"
  )
  |> aggreateWindow(every: 5m, fn: mean)
```

## First/Last
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "example-key"
  )
  |> aggreateWindow(every: 5m, fn: first)
```

```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "example-key"
  )
  |> aggreateWindow(every: 5m, fn: last)
```

## Histogram
Histogram docs

```js

```


## Gap filling
Fill gaps in data

```js

```


## Last observation carried forward (need)
```js

```


## Last point (need)
```js

```
