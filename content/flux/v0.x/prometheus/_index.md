---
title: Work with Prometheus
description: >
  Flux provides tools for scraping raw [Prometheus-formatted metrics](https://prometheus.io/docs/concepts/data_model/)
  from an HTTP-accessible endpoint, then processing those raw metrics.
menu: flux_0_x
weight: 8
flux/v0.x/tags: [prometheus]
---

[Prometheus](https://prometheus.io/) is an open-source monitoring system designed
to build simple and robust monitoring and alerting systems.
Flux provides tools for scraping raw [Prometheus-formatted metrics](https://prometheus.io/docs/concepts/data_model/)
from an HTTP-accessible endpoint, writing them to InfluxDB, then processing those
raw metrics for visualization in InfluxDB dashboards.

{{< children >}}