---
title: OpenMetrics input data format
list_title: OpenMetrics
description: >
  Use the `openmetrics` input data format to parse OpenMetrics text format
  into Telegraf metrics.
menu:
  telegraf_v1_ref:
    name: OpenMetrics
    parent: Input data formats
weight: 10
related:
  - /telegraf/v1/input-plugins/prometheus/
  - /telegraf/v1/data_formats/input/prometheus/
---

Use the `openmetrics` input data format to parse
[OpenMetrics text format](https://github.com/prometheus/OpenMetrics/blob/v1.0.0/specification/OpenMetrics.md)
into Telegraf metrics.

The [prometheus input plugin](/telegraf/v1/input-plugins/prometheus/) uses
this parser internally when an endpoint serves OpenMetrics.
Use the parser directly with a listener plugin, such as
[http_listener_v2](/telegraf/v1/input-plugins/http_listener_v2/), to accept
pushed OpenMetrics data in the style of a Pushgateway.

## Configuration

```toml
[[inputs.http_listener_v2]]
  service_address = ":8080"
  paths = ["/metrics"]
  data_format = "openmetrics"

  ## Use the timestamp from the parsed data (default) or the time of
  ## parsing.
  # openmetrics_ignore_timestamp = false

  ## Metric layout to produce (see below).
  # openmetrics_metric_version = 2
```

### openmetrics_ignore_timestamp

If `true`, the parser discards timestamps included in the source data and
assigns the time of parsing instead.

**Type:** boolean  
**Default:** `false`

### openmetrics_metric_version

Controls how OpenMetrics metrics translate to Telegraf metrics.

**Type:** integer (`1` or `2`)  
**Default:** `2`

## Metric layouts

Given the following OpenMetrics input:

```text
# TYPE go_goroutines gauge
# HELP go_goroutines Number of goroutines that currently exist.
go_goroutines 69
# TYPE process_cpu_seconds counter
# UNIT process_cpu_seconds seconds
# HELP process_cpu_seconds Total user and system CPU time spent in seconds.
process_cpu_seconds_total 4.20072246e+06
# EOF
```

### Version 2 (default)

Each OpenMetrics MetricPoint becomes a Telegraf metric named `prometheus`.
Labels become tags and the field name is based on the OpenMetrics metric
name:

```text
prometheus go_goroutines=69
prometheus,unit=seconds process_cpu_seconds=4200722.46
```

The resulting metrics are sparse, but often easier to process and query for
destinations that are more efficient with column-oriented data.
To change the `prometheus` metric name, use the `name_override` plugin
option.
To produce multiple metric names, use multiple instances of the input
plugin, each with its own `name_override`.

Histograms use the same format as the
[histogram aggregator](/telegraf/v1/aggregator-plugins/histogram/).

### Version 1

The OpenMetrics metric-family name becomes the Telegraf metric name, labels
become tags, values become fields, and field names are based on the type of
the OpenMetrics metric:

```text
go_goroutines gauge=69
process_cpu_seconds,unit=seconds counter=4200722.46
```

The resulting metrics are dense, which is efficient for destinations with
row-oriented data models.
