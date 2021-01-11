---
title: prometheus.histogramQuantile() function
description: >
  The `prometheus.histogramQuantile()` function calculates quantiles on a set of values
  assuming the given histogram data is scraped or read from a Prometheus data source.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/prometheus/histogramquantile/
  - /influxdb/cloud/reference/flux/stdlib/experimental/prometheus/histogramquantile/
menu:
  influxdb_2_0_ref:
    name: prometheus.histogramQuantile
    parent: Prometheus
weight: 401
introduced: 0.51.0
---

The `prometheus.histogramQuantile()` function calculates quantiles on a set of values
assuming the given histogram data is scraped or read from a Prometheus data source.

_**Function type:** Aggregate_

```js
import "experimental/prometheus"

prometheus.histogramQuantile(
  quantile: 0.99
)
```

## Parameters

### quantile
A value between 0.0 and 1.0 indicating the desired quantile.

_**Data type:** Float_

## Examples

### Calculate the 99th quantile in Prometheus data
```js
import "experimental/prometheus"

prometheus.scrape(url: "https://example-url.com/metrics")
  |> prometheus.histogramQuantile(quantile: 0.99)
```
