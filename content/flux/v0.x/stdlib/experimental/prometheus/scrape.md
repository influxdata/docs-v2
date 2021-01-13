---
title: prometheus.scrape() function
description: >
  The `prometheus.scrape()` function retrieves Prometheus-formatted metrics
  from a specified URL.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/prometheus/scrape/
  - /influxdb/cloud/reference/flux/stdlib/experimental/prometheus/scrape/
menu:
  flux_0_x_ref:
    name: prometheus.scrape
    parent: prometheus
weight: 401
related:
  - /influxdb/v2.0/write-data/no-code/scrape-data//scrapable-endpoints/
introduced: 0.50.0
---

The `prometheus.scrape()` function retrieves [Prometheus-formatted metrics](https://prometheus.io/docs/instrumenting/exposition_formats/)
from a specified URL.
The function groups metrics (including histogram and summary values) into individual tables.

_**Function type:** Input_

```js
import "experimental/prometheus"

prometheus.scrape(
  url: "http://localhost:8086/metrics"
)
```

## Parameters

### url
The URL to scrape Prometheus-formatted metrics from.

_**Data type:** String_

## Examples

### Scrape Prometheus metrics and write them to InfluxDB
```js
import "experimental/prometheus"

prometheus.scrape(url: "https://example-url.com/metrics")
  |> to(
    org: "example-org",
    bucket: "example-bucket"
  )
```
