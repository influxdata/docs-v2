---
title: Prometheus Remote Write input data format
list_title: Prometheus Remote Write
description: 
  Use the `prometheusremotewrite` input data format to parse Prometheus Remote Write samples into Telegraf metrics.
menu:
  telegraf_v1_ref:
    name: Prometheus Remote Write
    weight: 10
    parent: Input data formats
---

Use the `prometheusremotewrite` input data format to parse [Prometheus Remote Write](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write) samples into Telegraf metrics.

{{% note %}}
If you are using InfluxDB 1.x and the [Prometheus Remote Write endpoint](https://github.com/influxdata/telegraf/blob/master/plugins/parsers/prometheusremotewrite/README.md
to write in metrics, you can migrate to InfluxDB 2.0 and use this parser.
For the metrics to completely align with the 1.x endpoint, add a Starlark processor as described [here](https://github.com/influxdata/telegraf/blob/master/plugins/processors/starlark/README.md).

{{% /note %}}

Converts prometheus remote write samples directly into Telegraf metrics. It can
be used with [http_listener_v2](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/http_listener_v2). There are no
additional configuration options for Prometheus Remote Write Samples.

## Configuration

```toml
[[inputs.http_listener_v2]]
  ## Address and port to host HTTP listener on
  service_address = ":1234"

  ## Paths to listen to.
  paths = ["/receive"]

  ## Data format to consume.
  data_format = "prometheusremotewrite"
```

## Example Input

```json
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

## Example Output

```text
prometheus_remote_write,instance=localhost:9090,job=prometheus,quantile=0.99 go_gc_duration_seconds=4.63 1614889298859000000
```

## For alignment with the [InfluxDB v1.x Prometheus Remote Write Spec](/influxdb/v1/supported_protocols/prometheus/#how-prometheus-metrics-are-parsed-in-influxdb)

- Use the [Starlark processor rename prometheus remote write script](https://github.com/influxdata/telegraf/blob/master/plugins/processors/starlark/testdata/rename_prometheus_remote_write.star) to rename the measurement name to the fieldname and rename the fieldname to value.
