---
title: prometheus.histogramQuantile() function
description: >
  `prometheus.histogramQuantile()` calculates a quantile on a set of Prometheus histogram values.
menu:
  flux_v0_ref:
    name: prometheus.histogramQuantile
    parent: experimental/prometheus
    identifier: experimental/prometheus/histogramQuantile
weight: 201
flux/v0/tags: [transformations, aggregates, prometheus]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/prometheus/prometheus.flux#L83-L112

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`prometheus.histogramQuantile()` calculates a quantile on a set of Prometheus histogram values.

This function supports [Prometheus metric parsing formats](/influxdb/latest/reference/prometheus-metrics/)
used by `prometheus.scrape()`, the Telegraf `promtheus` input plugin, and
InfluxDB scrapers available in InfluxDB OSS.

##### Function type signature

```js
(<-tables: stream[{B with le: D, _field: C}], quantile: float, ?metricVersion: A, ?onNonmonotonic: string) => stream[E] where A: Equatable, C: Equatable, E: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### quantile
({{< req >}})
Quantile to compute. Must be a float value between 0.0 and 1.0.



### metricVersion

[Prometheus metric parsing format](/influxdb/latest/reference/prometheus-metrics/)
used to parse queried Prometheus data.
Available versions are `1` and `2`.
Default is `2`.



### tables

Input data. Default is piped-forward data (`<-`).



### onNonmonotonic

Describes behavior when counts are not monotonically increasing
when sorted by upper bound. Default is `error`.

**Supported values**:
- **error**: Produce an error.
- **force**: Force bin counts to be monotonic by adding to each bin such that it
is equal to the next smaller bin.
- **drop**: When a nonmonotonic table is encountered, produce no output.


## Examples

- [Compute the 0.99 quantile of a Prometheus histogram](#compute-the-099-quantile-of-a-prometheus-histogram)
- [Compute the 0.99 quantile of a Prometheus histogram parsed with metric version 1](#compute-the-099-quantile-of-a-prometheus-histogram-parsed-with-metric-version-1)

### Compute the 0.99 quantile of a Prometheus histogram

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

