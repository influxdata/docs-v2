---
title: Work with Prometheus metric types
description: >
  Learn how to use Flux to work with Prometheus' four main metric types
  (counter, gauge, histogram, and summary) and process them for visualizations
  in InfluxDB dashboards.
menu:
  flux_0_x:
    name: Prometheus metric types
    parent: Work with Prometheus
weight: 102
cascade:
  related:
    - https://prometheus.io/docs/concepts/metric_types/, Prometheus metric types
flux/v0.x/tags: [prometheus]
---

Learn how to use Flux to work with the four core
[Prometheus metric types](https://prometheus.io/docs/concepts/metric_types/) and
process them for visualizations in InfluxDB dashboards:

{{< children >}}

<!-- 
- Scraped Prometheus metrics are considered "raw" and require some processing
  to be be useful. Generally that processing is done with [Prometheus recording rules](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/#recording-rules).
  When using Flux to work Prometheus metric types, the Flux query should process
  the metrics much like Prometheus recording rules. -->
