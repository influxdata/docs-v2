---
title: Prometheus Remote Write output data format
list_title: Prometheus Remote Write
description: Use the `prometheusremotewrite` output data format (serializer) to convert Telegraf metrics into Prometheus protobuf format for remote write endpoints.
menu:
  telegraf_v1_ref:
    name: Prometheus Remote Write
    weight: 10
    parent: Output data formats
    identifier: output-data-format-prometheusremotewrite
---

Use the `prometheusremotewrite` output data format (serializer) to convert Telegraf metrics into the Prometheus protobuf exposition format for [remote write](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write) endpoints.

> [!Warning]
> When generating histogram and summary types, output may not be correct if the metric spans multiple batches.
> Use outputs that support batch format to mitigate this issue.
> For histogram and summary types, the `prometheus_client` output is recommended.

## Configuration

```toml
[[outputs.http]]
  ## URL of the remote write endpoint.
  url = "https://cortex/api/prom/push"

  ## Optional TLS configuration.
  # tls_ca = "/etc/telegraf/ca.pem"
  # tls_cert = "/etc/telegraf/cert.pem"
  # tls_key = "/etc/telegraf/key.pem"

  ## Data format to output.
  data_format = "prometheusremotewrite"

  ## Required headers for Prometheus remote write.
  [outputs.http.headers]
    Content-Type = "application/x-protobuf"
    Content-Encoding = "snappy"
    X-Prometheus-Remote-Write-Version = "0.1.0"
```

## Metrics

A Prometheus metric is created for each integer, float, boolean, or unsigned field:
- Boolean values convert to `1.0` (true) or `0.0` (false)
- String fields are ignored (set `log_level = "trace"` to see serialization issues)

### Metric naming

Prometheus metric names are created by joining the measurement name with the field key.

**Special case:** When the measurement name is `prometheus`, it is not included in the final metric name.

### Labels

Prometheus labels are created from Telegraf tags.

## Example

**Input metric:**
```
cpu,host=server01 usage_idle=98.5,usage_user=1.2 1640000000000000000
```

**Resulting Prometheus metrics:**
```
cpu_usage_idle{host="server01"} 98.5
cpu_usage_user{host="server01"} 1.2
```
