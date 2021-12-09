---
title: prometheus.histogramQuantile() function
description: >
  The `prometheus.histogramQuantile()` function calculates quantiles on a set of values
  assuming the given histogram data is scraped or read from a Prometheus data source.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/prometheus/histogramquantile/
  - /influxdb/cloud/reference/flux/stdlib/experimental/prometheus/histogramquantile/
menu:
  flux_0_x_ref:
    name: prometheus.histogramQuantile
    parent: prometheus
weight: 401
flux/v0.x/tags: [transformations, prometheus, aggregates]
introduced: 0.51.0
---

The `prometheus.histogramQuantile()` function calculates quantiles on a set of values
assuming the given histogram data is scraped or read from a Prometheus data source.
_`prometheus.histogramQuantile()` is an [aggregate function](/flux/v0.x/function-types/#aggregates)._

```js
import "experimental/prometheus"

prometheus.histogramQuantile(
  quantile: 0.99,
  metricVersion: 2
)
```

## Parameters

### quantile {data-type="float"}
A value between 0.0 and 1.0 indicating the desired quantile.

### metricVersion {data-type="int"}
[Prometheus metric parsing format](/{{< latest "influxdb" >}}/reference/prometheus-metrics/)
used to parse queried Prometheus data.
Available versions are `1` and `2`.
Default is `2`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

### Compute the 0.99 quantile of a Prometheus histogram
{{< keep-url >}}
```js
import "experimental/prometheus"

prometheus.scrape(url: "http://localhost:8086/metrics")
    |> filter(fn: (r) => r._measurement == "prometheus")
    |> filter(fn: (r) => r._field == "qc_all_duration_seconds")
    |> prometheus.histogramQuantile(quantile: 0.99)
```

### Compute the 0.99 quantile of a Prometheus histogram parsed with metric version 1
```js
import "experimental/prometheus"

from(bucket: "example-bucket")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "qc_all_duration_seconds")
    |> prometheus.histogramQuantile(quantile: 0.99, metricVersion: 1)
```
