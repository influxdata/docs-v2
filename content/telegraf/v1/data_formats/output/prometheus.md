---
title: Prometheus output data format
list_title: Prometheus
description: Use the `prometheus` output data format (serializer) to convert Telegraf metrics into Prometheus text exposition format.
menu:
  telegraf_v1_ref:
    name: Prometheus
    weight: 10
    parent: Output data formats
    identifier: output-data-format-prometheus
---

Use the `prometheus` output data format (serializer) to convert Telegraf metrics into the [Prometheus text exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/).

When used with the `prometheus` input plugin, set `metric_version = 2` in the input to properly round-trip metrics.

> [!Warning]
> When generating histogram and summary types, and the metric spans multiple batches, this plugin's output may be incorrect.
> To mitigate this issue, use outputs that support `use_batch_format = true`.
> For histogram and summary types, use the `prometheus_client` output.

## Configuration

```toml
[[outputs.file]]
  files = ["stdout"]

  ## Enable batch format for correct histogram/summary output.
  use_batch_format = true

  ## Data format to output.
  data_format = "prometheus"

  ## Include the metric timestamp on each sample.
  # prometheus_export_timestamp = false

  ## Sort prometheus metric families and samples (useful for debugging).
  # prometheus_sort_metrics = false

  ## Output string fields as metric labels.
  ## When false, string fields are discarded.
  # prometheus_string_as_label = false

  ## Encode metrics without HELP metadata to reduce payload size.
  # prometheus_compact_encoding = false

  ## Specify metric types explicitly (overrides Telegraf metric types).
  ## Supports glob patterns.
  # [outputs.file.prometheus_metric_types]
  #   counter = ["*_total", "*_count"]
  #   gauge = ["*_current", "*_ratio"]
```

### Configuration options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prometheus_export_timestamp` | boolean | `false` | Include timestamp on each sample |
| `prometheus_sort_metrics` | boolean | `false` | Sort metric families and samples |
| `prometheus_string_as_label` | boolean | `false` | Convert string fields to labels |
| `prometheus_compact_encoding` | boolean | `false` | Omit HELP metadata |
| `prometheus_metric_types` | object | `{}` | Explicit metric type mappings |

## Metric naming

Prometheus metric names are created by joining the measurement name with the field key.

**Special case:** When the measurement name is `prometheus`, it is not included in the final metric name.

## Metric types

Use `prometheus_metric_types` to explicitly set metric types:

```toml
[outputs.file.prometheus_metric_types]
  counter = ["requests_total", "errors_total"]
  gauge = ["temperature", "memory_*"]
```

## Labels

Prometheus labels are created from Telegraf tags.

> [!Note]
> String fields are ignored by default and do not produce Prometheus metrics.
> Set `prometheus_string_as_label = true` to convert string fields to labels.
> Set `log_level = "trace"` to see serialization issues.
