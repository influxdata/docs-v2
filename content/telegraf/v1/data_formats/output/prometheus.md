---
title: Prometheus output data format
list_title: Prometheus
description: >
  Use the `prometheus` output data format (serializer) to convert Telegraf
  metrics into Prometheus text exposition format.
menu:
  telegraf_v1_ref:
    name: Prometheus
    weight: 10
    parent: Output data formats
    identifier: output-data-format-prometheus
related:
  - /telegraf/v1/output-plugins/prometheus_client/
  - /telegraf/v1/data_formats/output/
  - /telegraf/v1/input-plugins/prometheus/
---

Use the `prometheus` output data format (serializer) to convert Telegraf metrics
into the [Prometheus text exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/).

When used with the `prometheus` input plugin, set `metric_version = 2` in the
input to properly round-trip metrics.

## Configuration

```toml
[[outputs.file]]
  files = ["stdout"]
  data_format = "prometheus"

  ## Optional: Enable batch serialization for improved efficiency.
  ## This is an output plugin option that affects how the serializer
  ## receives metrics.
  # use_batch_format = false

  ## Serializer options (prometheus-specific)
  # prometheus_export_timestamp = false
  # prometheus_sort_metrics = false
  # prometheus_string_as_label = false
  # prometheus_compact_encoding = false
```

### Serializer options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prometheus_export_timestamp` | boolean | `false` | Include timestamp on each sample |
| `prometheus_sort_metrics` | boolean | `false` | Sort metric families and samples (useful for debugging) |
| `prometheus_string_as_label` | boolean | `false` | Convert string fields to labels |
| `prometheus_compact_encoding` | boolean | `false` | Omit HELP metadata to reduce payload size |

### Metric type mappings

Use `prometheus_metric_types` to explicitly set metric types, overriding
Telegraf's automatic type detection.
Supports glob patterns.

```toml
[[outputs.file]]
  files = ["stdout"]
  data_format = "prometheus"

  [outputs.file.prometheus_metric_types]
    counter = ["*_total", "*_count"]
    gauge = ["*_current", "*_ratio"]
```

## Metric naming

Prometheus metric names are created by joining the measurement name with the
field key.

**Special case:** When the measurement name is `prometheus`, it is not included
in the final metric name.

## Labels

Prometheus labels are created from Telegraf tags.
String fields are ignored by default and do not produce Prometheus metrics.
Set `prometheus_string_as_label = true` to convert string fields to labels.

## Histograms and summaries

Histogram and summary metrics require special consideration.
These metric types accumulate state across observations:

- **Histograms** count observations in configurable buckets
- **Summaries** calculate quantiles over a sliding time window

### Use prometheus_client for histograms and summaries

Serializers process metrics in batches and have no memory of previous batches.
When histogram or summary data arrives across multiple batches, the serializer
cannot combine them correctly.

For example, a histogram with 10 buckets might arrive as:

- Batch 1: buckets 1-5
- Batch 2: buckets 6-10

The serializer outputs each batch independently, producing two incomplete
histograms instead of one complete histogram.

The [`prometheus_client` output plugin](/telegraf/v1/output-plugins/prometheus_client/)
maintains metric state in memory and produces correct output regardless of
batch boundaries.

```toml
# Recommended for histogram/summary metrics
[[outputs.prometheus_client]]
  listen = ":9273"
```

### Use the serializer for counters and gauges

For counters and gauges, the prometheus serializer works well.
Enable `use_batch_format = true` in your output plugin for more efficient output.

```toml
[[outputs.file]]
  files = ["stdout"]
  data_format = "prometheus"
  use_batch_format = true
```
