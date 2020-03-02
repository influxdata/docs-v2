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


- SELECT-like commands
- Median
- Percentile
- Cumulative Sum
- Moving Average
- Increase
- Rate
- Delta
- Window
- First/Last
- Histogram
- Gap filling
- Last observation carried forward
- Last point

## SELECT-like commands

Query fields from InfluxDB

## Median

##### Median as an aggregate
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "example-key"
  )
  |> aggregateWindow(every: 5m, fn: median)
```

##### Median as a selector
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "example-key"
  )
  |> median(method: "exact_selector")
```

## Percentile

##### Percentile as an aggregate
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "example-key"
  )
  |> aggregateWindow(
      every: 5m,
      fn: (tables=<-, column) => tables |> quantile(q: 0.99)
  )
```

##### Percentile as a selector
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "example-key"
  )
  |> quantile(q: 0.99)
```

## Cumulative Sum
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "example-key"
  )
  |> cumulativeSum()
```

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
