# Telegraf Batch Format Documentation Design

**Date:** 2025-12-22
**Branch:** `jts-telegraf-batch-format`
**Related PR:** [#6660](https://github.com/influxdata/docs-v2/pull/6660)

## Problem Statement

The current documentation for `use_batch_format` and Telegraf serializers conflates two different concepts:

1. `use_batch_format` - an **output plugin option** (found in `file`, `http`, `amqp`, `nats`, etc.)
2. Serializer behavior - **data format configuration** that controls how metrics are encoded

PR #6660 attempted to clarify this but created confusion by documenting an output plugin option within a serializer doc without explaining the relationship.

Additionally, users need clear guidance on:
- When to use serializers vs dedicated output plugins
- Why histogram and summary metrics require special handling
- How to choose the right output approach for different use cases

## Design Goals

1. **Architectural clarity**: Make the output plugin → serializer relationship clear
2. **Practical guidance**: Help users choose the right output approach
3. **Technical accuracy**: Explain why histograms/summaries need stateful output plugins
4. **Minimal callouts**: Use structured content; reserve callouts for critical warnings

## Files to Modify

| File | Purpose |
|------|---------|
| `content/telegraf/v1/data_formats/output/_index.md` | Foundational explanation of serializers |
| `content/telegraf/v1/data_formats/output/prometheus.md` | Prometheus serializer with histogram/summary guidance |
| `content/telegraf/v1/output-plugins/prometheus_client/_index.md` | When to use this plugin vs serializer |
| `content/telegraf/v1/configuration.md` | Brief data formats reference |
| `content/telegraf/v1/configure_plugins/output_plugins/_index.md` | Output plugin → serializer relationship |

---

## Section 1: Output Data Formats Index

**File:** `content/telegraf/v1/data_formats/output/_index.md`

### 1.1 Add "How output plugins use serializers" section

Add after intro, before `{{< children >}}`:

```markdown
## How output plugins use serializers

When you configure `data_format` in an output plugin, Telegraf uses a **serializer**
to convert metrics into that format before writing. The output plugin controls
*where* data goes; the serializer controls *how* it's formatted.

Some output plugins support `use_batch_format`, which changes how the serializer
processes metrics. When enabled, the serializer receives all metrics in a batch
together rather than one at a time, enabling more efficient encoding and formats
that represent multiple metrics as a unit (like JSON arrays).

```toml
[[outputs.file]]
  files = ["stdout"]

  ## Output plugin option: process metrics as a batch
  use_batch_format = true

  ## Serializer selection: format metrics as JSON
  data_format = "json"
```

Output plugins that support `use_batch_format`:
- `file`, `http`, `amqp`, `kafka`, `nats`, `mqtt`, `exec`, `execd`, `remotefile`
```

### 1.2 Add "Choosing an output approach" section

```markdown
## Choosing an output approach

### By destination

| Destination | Recommended Approach |
|-------------|---------------------|
| **Prometheus scraping** | [`prometheus_client`](/telegraf/v1/output-plugins/prometheus_client/) output plugin (exposes `/metrics` endpoint) |
| **InfluxDB** | [`influxdb`](/telegraf/v1/output-plugins/influxdb/) or [`influxdb_v2`](/telegraf/v1/output-plugins/influxdb_v2/) output plugin (native protocol) |
| **Remote HTTP endpoints** | [`http`](/telegraf/v1/output-plugins/http/) output + serializer |
| **Files** | [`file`](/telegraf/v1/output-plugins/file/) output + serializer |
| **Message queues** | [`kafka`](/telegraf/v1/output-plugins/kafka/), [`nats`](/telegraf/v1/output-plugins/nats/), [`amqp`](/telegraf/v1/output-plugins/amqp/) + serializer |

### Stateful metrics

Some metric types require state across collection intervals:

- **Histograms** accumulate observations into buckets
- **Summaries** track quantiles over a sliding window

Serializers process each batch independently and cannot maintain this state.
When a histogram or summary spans multiple batches, the serializer may produce
incomplete or incorrect output.

For these metric types, use a dedicated output plugin that maintains state:

- **Prometheus metrics**: Use [`prometheus_client`](/telegraf/v1/output-plugins/prometheus_client/)
  instead of the prometheus serializer
```

---

## Section 2: Prometheus Serializer

**File:** `content/telegraf/v1/data_formats/output/prometheus.md`

### 2.1 Restructure configuration section

```markdown
---
title: Prometheus output data format
...
---

Use the `prometheus` output data format (serializer) to convert Telegraf metrics
into the [Prometheus text exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/).

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
| `prometheus_sort_metrics` | boolean | `false` | Sort metric families and samples |
| `prometheus_string_as_label` | boolean | `false` | Convert string fields to labels |
| `prometheus_compact_encoding` | boolean | `false` | Omit HELP metadata |
```

### 2.2 Add histogram and summary guidance

```markdown
## Histograms and summaries

Histogram and summary metrics require special consideration. These metric types
accumulate state across observations:

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

For counters and gauges, the prometheus serializer works well. Enable
`use_batch_format = true` in your output plugin for more efficient output.
```

---

## Section 3: Prometheus Client Output Plugin

**File:** `content/telegraf/v1/output-plugins/prometheus_client/_index.md`

Add after intro paragraph, before "Global configuration options":

```markdown
## When to use this plugin

Use `prometheus_client` when:

- **Prometheus scrapes your Telegraf instance** - This plugin exposes a `/metrics`
  endpoint that Prometheus can poll directly
- **You collect histogram or summary metrics** - This plugin maintains metric state
  in memory, ensuring correct output even when metrics arrive across multiple
  collection intervals

### Comparison with prometheus serializer

| Use Case | Recommended Approach |
|----------|---------------------|
| Prometheus scrapes Telegraf | `prometheus_client` output plugin |
| Counters and gauges to file/HTTP | Prometheus serializer + `file` or `http` output |
| Histograms and summaries | `prometheus_client` output plugin |
| Remote write to Prometheus-compatible endpoint | `http` output + `prometheusremotewrite` serializer |

### Why histograms and summaries need this plugin

Histogram and summary metrics accumulate observations over time. The prometheus
serializer processes each batch independently and cannot maintain this state.
When metric data spans multiple batches, the serializer produces incomplete output.

This plugin keeps metrics in memory until they expire or are scraped, ensuring
complete and correct histogram buckets and summary quantiles.
```

---

## Section 4: Configuration Reference

**File:** `content/telegraf/v1/configuration.md`

Add after existing output options list (after line ~509):

```markdown
### Data formats

Some output plugins support the `data_format` option, which specifies a serializer
to convert metrics before writing. Common serializers include `json`, `influx`,
`prometheus`, and `csv`.

Output plugins that support serializers may also offer `use_batch_format`, which
controls whether the serializer receives metrics individually or as a batch.
Batch mode enables more efficient encoding for formats like JSON arrays.

```toml
[[outputs.file]]
  files = ["stdout"]
  data_format = "json"
  use_batch_format = true
```

For available serializers and configuration options, see
[output data formats](/telegraf/v1/data_formats/output/).
```

---

## Section 5: Output Plugins Index

**File:** `content/telegraf/v1/configure_plugins/output_plugins/_index.md`

Replace existing content:

```markdown
---
title: Write data with output plugins
description: |
  Output plugins define where Telegraf will deliver the collected metrics.
menu:
  telegraf_v1:
     name: Output plugins
     weight: 20
     parent: Configure plugins
related:
  - /telegraf/v1/output-plugins/
---

Output plugins define where Telegraf delivers collected metrics. Send metrics to
InfluxDB or to a variety of other datastores, services, and message queues,
including Graphite, OpenTSDB, Datadog, Kafka, MQTT, and NSQ.

For a complete list of output plugins and links to their detailed configuration
options, see [output plugins](/telegraf/v1/output-plugins/).

## Output plugins and data formats

Output plugins control *where* metrics go. Many output plugins also support
*data formats* (serializers) that control how metrics are formatted before
writing.

Configure a serializer using the `data_format` option in your output plugin:

```toml
[[outputs.http]]
  url = "http://example.com/metrics"
  data_format = "json"
```

Some output plugins (like `influxdb_v2` or `prometheus_client`) use a fixed
format and don't support `data_format`. Others (like `file`, `http`, `kafka`)
support multiple serializers.

For available serializers and their options, see
[output data formats](/telegraf/v1/data_formats/output/).
```

---

## Future Work (Out of Scope)

- **Update `influxdata/telegraf` repo**: Align README documentation for data formats (especially prometheus serializer) with these docs-v2 changes. This ensures generated content stays consistent when we sync from Telegraf READMEs.

---

## Implementation Order

1. `data_formats/output/_index.md` - Foundation (serializer concept + choosing output)
2. `data_formats/output/prometheus.md` - Prometheus-specific guidance
3. `output-plugins/prometheus_client/_index.md` - When to use this plugin
4. `configuration.md` - Brief reference addition
5. `configure_plugins/output_plugins/_index.md` - Output plugin overview

## Testing

- Build Hugo site and verify all new internal links resolve
- Review rendered pages for clarity and consistency
- Verify code examples are syntactically correct TOML
