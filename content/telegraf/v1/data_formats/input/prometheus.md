---
title: Prometheus input data format
list_title: Prometheus
description: >
  Use the `prometheus` input data format to parse Prometheus text exposition
  format into Telegraf metrics.
menu:
  telegraf_v1_ref:
    name: Prometheus
    parent: Input data formats
weight: 10
related:
  - /telegraf/v1/input-plugins/prometheus/
  - /telegraf/v1/data_formats/input/openmetrics/
  - /telegraf/v1/data_formats/output/prometheus/
---

Use the `prometheus` input data format to parse
[Prometheus text exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/#text-based-format)
into Telegraf metrics.

The [prometheus input plugin](/telegraf/v1/input-plugins/prometheus/) uses
this parser internally to scrape endpoints.
Use the parser directly with a listener plugin, such as
[http_listener_v2](/telegraf/v1/input-plugins/http_listener_v2/), to accept
pushed Prometheus metrics in the style of a Pushgateway.

## Configuration

```toml
[[inputs.http_listener_v2]]
  service_address = ":8080"
  paths = ["/metrics"]
  data_format = "prometheus"

  ## Use the timestamp from the parsed data (default) or the time of
  ## parsing.
  # prometheus_ignore_timestamp = false

  ## Metric layout to produce (see below).
  # prometheus_metric_version = 2
```

### prometheus_ignore_timestamp

If `true`, the parser discards timestamps included in the source data and
assigns the time of parsing instead.

**Type:** boolean  
**Default:** `false`

### prometheus_metric_version

Controls how Prometheus metrics translate to Telegraf metrics.

**Type:** integer (`1` or `2`)  
**Default:** `2`

- `2`: each Prometheus sample becomes a Telegraf metric named `prometheus`,
  labels become tags, and the field name is the Prometheus metric name.
  Produces sparse metrics that work well with column-oriented destinations.
- `1`: the Prometheus metric name becomes the Telegraf metric name, labels
  become tags, and values become fields named after the sample type.
  Produces dense metrics that work well with row-oriented destinations.

The [OpenMetrics input data format](/telegraf/v1/data_formats/input/openmetrics/)
shows a worked example of both layouts.
For round-tripping metrics back out of Telegraf in Prometheus format, use
`metric_version = 2` with the
[Prometheus output data format](/telegraf/v1/data_formats/output/prometheus/).
