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
---

Use Flux to query and transform Prometheus **histogram** metrics stored in InfluxDB.

> A _histogram_ samples observations (usually things like request durations or
> response sizes) and counts them in configurable buckets.
> It also provides a sum of all observed values.
>
> {{% cite %}}[Prometheus metric types](https://prometheus.io/docs/concepts/metric_types/#gauge){{% /cite %}}

##### Example histogram metric in Prometheus data
```sh
# HELP example_histogram_duration Duration of given tasks and example histogram metric
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

## Calculate quantiles from Prometheus histograms