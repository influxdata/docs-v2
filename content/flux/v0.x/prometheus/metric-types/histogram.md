---
title: Work with Prometheus histograms
list_title: Histogram
description: >
  Use Flux to query and transform Prometheus **histogram** metrics stored in InfluxDB.
  A histogram samples observations (usually things like request durations or
  response sizes) and counts them in configurable buckets.
  It also provides a sum of all observed values.
menu:
  flux_0_x:
    name: Histogram
    parent: Prometheus metric types
weight: 101
flux/v0.x/tags: [prometheus]
related:
  - https://prometheus.io/docs/concepts/metric_types/, Prometheus metric types
  - /{{< latest "influxdb" >}}/reference/prometheus-metrics/
  - /flux/v0.x/stdlib/experimental/prometheus/histogramquantile/
---

Use Flux to query and transform Prometheus **histogram** metrics stored in InfluxDB.

> A _histogram_ samples observations (usually things like request durations or
> response sizes) and counts them in configurable buckets.
> It also provides a sum of all observed values.
>
> {{% cite %}}[Prometheus metric types](https://prometheus.io/docs/concepts/metric_types/#histogram){{% /cite %}}

##### Example histogram metric in Prometheus data
```sh
# HELP example_histogram_duration Duration of given tasks as example histogram metric
# TYPE example_histogram_duration histogram
example_histogram_duration_bucket{le="0.1"} 80
example_histogram_duration_bucket{le="0.25"} 85
example_histogram_duration_bucket{le="0.5"} 85
example_histogram_duration_bucket{le="1"} 87
example_histogram_duration_bucket{le="2.5"} 87
example_histogram_duration_bucket{le="5"} 88
example_histogram_duration_bucket{le="+Inf"} 88
example_histogram_duration_sum 6.833441910000001
example_histogram_duration_count 88
```

The examples below include example data collected from the **InfluxDB OSS 2.x `/metrics` endpoint**
and stored in InfluxDB.

{{% note %}}
#### Prometheus metric parsing formats
Query structure depends on the [Prometheus metric parsing format](/{{< latest "influxdb" >}}/reference/prometheus-metrics/)
used to scrape the Prometheus metrics.
Select the appropriate metric format version below.
{{% /note %}}

- [Calculate quantile values from Prometheus histograms](#calculate-quantile-values-from-prometheus-histograms)
- [Calculate multiple quantiles from Prometheus histograms](#calculate-multiple-quantiles-from-prometheus-histograms)

## Visualize Prometheus histograms in InfluxDB
_InfluxDB does not currently support visualizing Prometheus histogram metrics
as a traditional histogram. The existing [InfluxDB histogram visualization](/influxdb/cloud/visualize-data/visualization-types/histogram/)
is **not compatible** with the format of Prometheus histogram data stored in InfluxDB._

## Calculate quantile values from Prometheus histograms

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Metric version 2](#)
[Metric version 1](#)
{{% /tabs %}}
{{% tab-content %}}
1.  Import the [`experimental/prometheus` package](/flux/v0.x/stdlib/experimental/prometheus/).
2.  Filter results by the `prometheus` measurement and **histogram metric name** field.
3.  _(Recommended)_ Use [`aggregateWindow()`](/flux/v0.x/stdlib/universe/aggregatewindow/)
    to downsample data and optimize the query.
4.  Use [`prometheus.histogramQuantile()`](/flux/v0.x/stdlib/experimental/prometheus/histogramquantile/)
    to calculate a specific quantile.

```js
import "experimental/prometheus"

from(bucket: "example-bucket")
  |> start(range: -1h)
  |> filter(fn: (r) => r._measurement == "prometheus")
  |> filter(fn: (r) => r._field == "qc_all_duration_seconds")
  |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
  |> prometheus.histogramQuantile(quantile: 0.99)
```
{{% /tab-content %}}

{{% tab-content %}}
1.  Import the [`experimental/prometheus` package](/flux/v0.x/stdlib/experimental/prometheus/).
2.  Filter results by the **histogram metric name** measurement.
3.  _(Recommended)_ Use [`aggregateWindow()`](/flux/v0.x/stdlib/universe/aggregatewindow/)
    to downsample data and optimize the query.
    **Set the `createEmpty` parameter to `false`.**
4.  Use [`prometheus.histogramQuantile()`](/flux/v0.x/stdlib/experimental/prometheus/histogramquantile)
    to calculate a specific quantile. Specify the `metricVersion` as `1`.

```js
import "experimental/prometheus"

from(bucket: "example-bucket")
  |> start(range: -1h)
  |> filter(fn: (r) => r._measurement == "qc_all_duration_seconds")
  |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
  |> prometheus.histogramQuantile(quantile: 0.99, metricVersion: 1)
```
{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{< img-hd src="/img/flux/0-x-prometheus-histogram-quantile.png" alt="Calculate a quantile from Prometheus histogram metrics" />}}

{{% note %}}
#### Set createEmpty to false
When using `aggregateWindow()` to downsample data for `prometheus.histogramQuantile`,
**set the `createEmpty` parameter to `false`**.
Empty tables produced from `aggregateWindow()` result in the following error.

```
histogramQuantile: unexpected null in the countColumn
```
{{% /note %}}

## Calculate multiple quantiles from Prometheus histograms

1. Query histogram data using [steps 1-2 (optionally 3) from above](#calculate-quantiles-from-prometheus-histograms).
2. Use [`union()`](/flux/v0.x/stdlib/universe/union/) to union multiple
    streams of tables that calculate unique quantiles.

{{< code-tabs-wrapper >}}
{{% code-tabs "small" %}}
[Metric version 2](#)
[Metric version 1](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
import "experimental/prometheus"

data = from(bucket: "example-bucket")
  |> start(range: -1h)
  |> filter(fn: (r) => r._measurement == "prometheus")
  |> filter(fn: (r) => r._field == "qc_all_duration_seconds")
  |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
  
union(tables: [
  data |> prometheus.histogramQuantile(quantile: 0.99),
  data |> prometheus.histogramQuantile(quantile: 0.5),
  data |> prometheus.histogramQuantile(quantile: 0.25)
])
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
import "experimental/prometheus"

data = from(bucket: "example-bucket")
  |> start(range: -1h)
  |> filter(fn: (r) => r._measurement == "qc_all_duration_seconds")
  |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)

union(tables: [
  data |> prometheus.histogramQuantile(quantile: 0.99, metricVersion: 1),
  data |> prometheus.histogramQuantile(quantile: 0.5, metricVersion: 1),
  data |> prometheus.histogramQuantile(quantile: 0.25, metricVersion: 1)
])
  
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{< img-hd src="/img/flux/0-x-prometheus-histogram-multiple-quantiles.png" alt="Calculate multiple quantiles from Prometheus histogram metrics" />}}
