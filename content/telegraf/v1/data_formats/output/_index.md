---
title: Telegraf output data formats
list_title: Output data formats
description: Telegraf serializes metrics into output data formats.
menu:
  telegraf_v1_ref:
    name: Output data formats
    weight: 1
    parent: Data formats
related:
  - /telegraf/v1/configure_plugins/output_plugins/
  - /telegraf/v1/configuration/
---

Telegraf uses **serializers** to convert metrics into output data formats.
Many [output plugins](/telegraf/v1/configure_plugins/output_plugins/) support the `data_format` option, which lets you choose
how metrics are formatted before writing.

- [How output plugins use serializers](#how-output-plugins-use-serializers)
- [Choosing an output approach](#choosing-an-output-approach)
- [Available serializers](#available-serializers)

## How output plugins use serializers

When you configure `data_format` in an output plugin, Telegraf uses a **serializer**
to convert metrics into that format before writing.
The output plugin controls *where* data goes; the serializer controls *how* it's formatted.

Some output plugins support `use_batch_format`, which changes how the serializer
processes metrics.
When enabled, the serializer receives all metrics in a batch together rather than
one at a time, enabling more efficient encoding and formats that represent multiple
metrics as a unit (like JSON arrays).

```toml
[[outputs.file]]
  files = ["stdout"]

  ## Output plugin option: process metrics as a batch
  use_batch_format = true

  ## Serializer selection: format metrics as JSON
  data_format = "json"
```

Output plugins that support `use_batch_format`:
`file`, `http`, `amqp`, `kafka`, `nats`, `mqtt`, `exec`, `execd`, `remotefile`

## Choosing an output approach

### By destination

| Destination | Recommended Approach |
|-------------|---------------------|
| **Prometheus scraping** | [`prometheus_client`](/telegraf/v1/output-plugins/prometheus_client/) output plugin (exposes `/metrics` endpoint) |
| **InfluxDB** | [`influxdb`](/telegraf/v1/output-plugins/influxdb/) or [`influxdb_v2`](/telegraf/v1/output-plugins/influxdb_v2/) output plugin (native protocol) |
| **Remote HTTP endpoints** | [`http`](/telegraf/v1/output-plugins/http/) output + serializer |
| **Files** | [`file`](/telegraf/v1/output-plugins/file/) output + serializer |
| **Message queues** | [`kafka`](/telegraf/v1/output-plugins/kafka/), [`nats`](/telegraf/v1/output-plugins/nats/), [`amqp`](/telegraf/v1/output-plugins/amqp/) + serializer |

### By metric type

Some metric types require state across collection intervals:

- **Histograms** accumulate observations into buckets
- **Summaries** track quantiles over a sliding window

Serializers process each batch independently and cannot maintain this state.
When a histogram or summary spans multiple batches, the serializer may produce
incomplete or incorrect output.

For these metric types, use a dedicated output plugin that maintains state--for example:

- **Prometheus metrics**: Use [`prometheus_client`](/telegraf/v1/output-plugins/prometheus_client/)
  instead of the prometheus serializer

## Available serializers

{{< children >}}
