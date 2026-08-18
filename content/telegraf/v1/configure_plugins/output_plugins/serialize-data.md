---
title: Serialize outgoing data
description: >
  Choose and configure a Telegraf serializer to convert metrics into an
  output format such as InfluxDB line protocol, JSON, or Prometheus
  exposition format.
menu:
  telegraf_v1:
    name: Serialize outgoing data
    parent: Output plugins
weight: 201
related:
  - /telegraf/v1/data_formats/output/
  - /telegraf/v1/configure_plugins/input_plugins/parse-data/
  - /telegraf/v1/concepts/metrics/
---

A **serializer** converts Telegraf metrics into the format your destination
expects.
Serializers are the output-side counterpart of
[parsers](/telegraf/v1/configure_plugins/input_plugins/parse-data/).

- [Choose a serializer](#choose-a-serializer)
- [Serialize to InfluxDB line protocol](#serialize-to-influxdb-line-protocol)
- [Serialize to JSON](#serialize-to-json)
- [Serialize to Prometheus format](#serialize-to-prometheus-format)

## Choose a serializer

Output plugins that write generic payloads, such as
[file](/telegraf/v1/output-plugins/file/),
[http](/telegraf/v1/output-plugins/http/),
[kafka](/telegraf/v1/output-plugins/kafka/), and
[mqtt](/telegraf/v1/output-plugins/mqtt/), support the `data_format` option,
which selects one of the
[output data formats](/telegraf/v1/data_formats/output/).

Output plugins that write to a specific service, such as
`influxdb_v3` and `prometheus_client`, use a fixed format and don't support
`data_format`.

The examples below serialize the following metric:

```text
cpu,cpu=cpu0,host=node1 usage_idle=92.4,usage_user=4.2 1709572232000000000
```

## Serialize to InfluxDB line protocol

The [`influx` serializer](/telegraf/v1/data_formats/output/influx/) produces
[InfluxDB line protocol](/telegraf/v1/concepts/metrics/).
This is the default format for most generic outputs, and the recommended
format unless your destination requires another:

```toml
[[outputs.file]]
  files = ["stdout"]
  data_format = "influx"
```

Output:

```text
cpu,cpu=cpu0,host=node1 usage_idle=92.4,usage_user=4.2 1709572232000000000
```

Line protocol serialization is direct, with a few limitations.
Float fields that are `NaN` or `Inf` are skipped, and tags with an empty
key or value are skipped.

## Serialize to JSON

The [`json` serializer](/telegraf/v1/data_formats/output/json/) converts
each metric into a JSON document:

```toml
[[outputs.file]]
  files = ["stdout"]
  data_format = "json"

  ## Timestamp resolution: truncated to the nearest power of 10
  ## below the specified units.
  json_timestamp_units = "1s"
```

Output:

```json
{
    "fields": {
        "usage_idle": 92.4,
        "usage_user": 4.2
    },
    "name": "cpu",
    "tags": {
        "cpu": "cpu0",
        "host": "node1"
    },
    "timestamp": 1709572232
}
```

When an output plugin sends multiple metrics at once, the serializer can use
a batch form instead, with all metrics collected in a top-level `metrics`
array.
Whether batch form is used depends on the output plugin.

To reshape the JSON beyond the standard form, the serializer supports
[JSONata](https://jsonata.org/) transformations through the
`json_transformation` option.
For examples, including flattening metrics and combining batched metrics,
see the [JSON output data format](/telegraf/v1/data_formats/output/json/).

## Serialize to Prometheus format

The [`prometheus` serializer](/telegraf/v1/data_formats/output/prometheus/)
converts metrics into the Prometheus text exposition format:

```toml
[[outputs.file]]
  files = ["stdout"]
  use_batch_format = true
  data_format = "prometheus"
```

Output:

```text
# HELP cpu_usage_idle Telegraf collected metric
# TYPE cpu_usage_idle gauge
cpu_usage_idle{cpu="cpu0",host="node1"} 92.4
# HELP cpu_usage_user Telegraf collected metric
# TYPE cpu_usage_user gauge
cpu_usage_user{cpu="cpu0",host="node1"} 4.2
```

The serializer maps Telegraf metrics to Prometheus conventions:

- Metric names join the measurement name and field key, for example
  `cpu_usage_idle`.
- Tags become labels.
- A metric is created for each integer, float, boolean, and unsigned field.
  Boolean values convert to `1.0` for true and `0.0` for false.
- String fields are ignored unless `prometheus_string_as_label = true`,
  which outputs them as labels.

> [!Important]
> Histogram and summary types might serialize incorrectly when a metric
> spans multiple batches.
> When working with histograms and summaries, use the
> [prometheus_client](/telegraf/v1/output-plugins/prometheus_client/)
> output plugin instead of the `prometheus` serializer.

## Next steps

- For all serializers and their options, see
  [output data formats](/telegraf/v1/data_formats/output/).
- To understand how outputs batch and buffer metrics, see
  [Write data with output plugins](/telegraf/v1/configure_plugins/output_plugins/).
