---
title: Prometheus Remote Write input data format
list_title: Prometheus Remote Write
description: >
  Use the `prometheusremotewrite` input data format to parse Prometheus
  Remote Write samples into Telegraf metrics.
menu:
  telegraf_v1_ref:
    name: Prometheus Remote Write
    parent: Input data formats
weight: 10
related:
  - /telegraf/v1/data_formats/input/prometheus/
  - /telegraf/v1/data_formats/output/prometheusremotewrite/
---

Use the `prometheusremotewrite` input data format to parse
[Prometheus Remote Write](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write)
samples into Telegraf metrics.
Use it with a listener plugin, such as
[http_listener_v2](/telegraf/v1/input-plugins/http_listener_v2/), to
receive metrics pushed by Prometheus.

## Configuration

```toml
[[inputs.http_listener_v2]]
  ## Address and port to host HTTP listener on
  service_address = ":1234"

  ## Paths to listen to.
  paths = ["/receive"]

  ## Data format to consume.
  data_format = "prometheusremotewrite"

  ## Metric layout to produce (see below).
  # prometheus_metric_version = 2
```

### prometheus_metric_version

Controls how Prometheus samples translate to Telegraf metrics.

**Type:** integer (`1` or `2`)  
**Default:** `2`

- `2`: each sample becomes a Telegraf metric named
  `prometheus_remote_write`, labels become tags, and the field name is the
  Prometheus metric name.
- `1`: the Prometheus metric name becomes the Telegraf metric name, labels
  become tags, and the field is named `value`.

## Example Input

```go
prompb.WriteRequest{
        Timeseries: []*prompb.TimeSeries{
            {
                Labels: []*prompb.Label{
                    {Name: "__name__", Value: "go_gc_duration_seconds"},
                    {Name: "instance", Value: "localhost:9090"},
                    {Name: "job", Value: "prometheus"},
                    {Name: "quantile", Value: "0.99"},
                },
                Samples: []prompb.Sample{
                    {Value: 4.63, Timestamp: time.Date(2020, 4, 1, 0, 0, 0, 0, time.UTC).UnixNano()},
                },
            },
        },
    }

```

## Example Output (version 2, default)

```text
prometheus_remote_write,instance=localhost:9090,job=prometheus,quantile=0.99 go_gc_duration_seconds=4.63 1614889298859000000
```

## Example Output (version 1)

```text
go_gc_duration_seconds,instance=localhost:9090,job=prometheus,quantile=0.99 value=4.63 1614889298859000000
```

## Align with the InfluxDB v1.x Prometheus Remote Write spec

To align the output with the
[InfluxDB v1.x Prometheus Remote Write spec](/influxdb/v1/supported_protocols/prometheus/#how-prometheus-metrics-are-parsed-in-influxdb),
use the
[Starlark processor rename prometheus remote write script](https://github.com/influxdata/telegraf/blob/master/plugins/processors/starlark/testdata/rename_prometheus_remote_write.star)
to rename the measurement name to the field name and rename the field name
to `value`.
