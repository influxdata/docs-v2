---
title: Prometheus Remote Write input data format
description: |
  Use the Prometheus Remote Write input data format to write samples directly into Telegraf metrics.
menu:
  telegraf_1_19:
    name: Prometheus Remote Write
    weight: 40
    parent: Input data formats
---

Use this plugin to convert [Prometheus Remote Write](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write) samples directly into Telegraf metrics.
It can be used with [`http_listener_v2`](/plugins/inputs/http_listener_v2).
<!-- There are no additional configuration options for Prometheus Remote Write Samples. -->

Can be used with `inputs.http_listener_v2` and setting `data format = "prometheusremotewrite"`

{{% note %}}
InfluxDB 1.x users that had been using the [Prometheus Remote Write endpoint](https://github.com/react-monaco-editor/react-monaco-editor/) to write in metrics
can migrate to 2.0 and use this parser to collect their Prometheus metrics.
For the metrics to completely align with the 1.x endpoint,
they must add a Starlark processor as described [here][]
{{% /note %}}

### Configuration

```toml
[[inputs.http_listener_v2]]
  ## Address and port to host HTTP listener on
  service_address = ":1234"
  ## Path to listen to.
  path = "/recieve"
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
