---
title: Prometheus Remote Write input data format
description: |
  Use the Prometheus Remote Write input data format to write samples directly into Telegraf metrics.
menu:
  telegraf_1_27_ref:

    name: Prometheus Remote Write
    weight: 40
    parent: Input data formats
---

Use the Prometheus Remote Write plugin to convert [Prometheus Remote Write](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write) samples directly into Telegraf metrics.

{{% note %}}
If you are using InfluxDB 1.x and the [Prometheus Remote Write endpoint](https://github.com/influxdata/telegraf/blob/master/plugins/parsers/prometheusremotewrite/README.md
to write in metrics, you can migrate to InfluxDB 2.0 and use this parser.
For the metrics to completely align with the 1.x endpoint, add a Starlark processor as described [here](https://github.com/influxdata/telegraf/blob/master/plugins/processors/starlark/README.md).

{{% /note %}}

### Configuration

Use the [`inputs.http_listener_v2`](/telegraf/v1.27/plugins/#input-http_listener_v2) plug and set `data_format = "prometheusremotewrite"`

```toml
[[inputs.http_listener_v2]]
  ## Address and port to host HTTP listener on
  service_address = ":1234"
  ## Path to listen to.
  path = "/receive"
  ## Data format to consume.
  data_format = "prometheusremotewrite"
```

### Example

**Example Input**
```
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

**Example Output**
```
prometheus_remote_write,instance=localhost:9090,job=prometheus,quantile=0.99 go_gc_duration_seconds=4.63 1614889298859000000
```

[here]: https://github.com/influxdata/telegraf/tree/master/plugins/parsers/prometheusremotewrite#for-alignment-with-the-influxdb-v1x-prometheus-remote-write-spec
