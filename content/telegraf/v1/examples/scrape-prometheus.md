---
title: Scrape Prometheus endpoints
description: >
  Use the Telegraf prometheus input plugin to scrape Prometheus metrics
  endpoints and write the metrics to InfluxDB 3.
menu:
  telegraf_v1:
    name: Scrape Prometheus endpoints
    parent: Configuration examples
weight: 110
related:
  - /telegraf/v1/input-plugins/prometheus/
  - /telegraf/v1/data_formats/input/prometheus/
  - /telegraf/v1/data_formats/output/prometheus/
---

Scrape applications and exporters that expose Prometheus `/metrics`
endpoints, and write the metrics to InfluxDB 3.
This example scrapes a [node_exporter](https://github.com/prometheus/node_exporter)
instance and an application endpoint.

## Configuration

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[[inputs.prometheus]]
  ## Endpoints to scrape on each collection interval.
  urls = [
    "http://node1.example.com:9100/metrics",
    "http://app1.example.com:8080/metrics"
  ]

  ## Metric layout. The plugin default is 1. Version 2 is recommended.
  metric_version = 2

  ## Tag metrics with the scraped URL.
  url_tag = "url"

[[outputs.influxdb_v3]]
  urls = ["http://localhost:8181"]
  token = "AUTH_TOKEN"
  database = "DATABASE_NAME"
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your InfluxDB authorization token
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the database to write to

## How it works

- **`urls`** lists the endpoints to scrape.
  The plugin requests each one on the collection interval and parses the
  exposition-format response.
- **`metric_version = 2`** stores each Prometheus sample as a metric named
  `prometheus`, with labels as tags and the Prometheus metric name as the
  field key.
  This layout is sparse, works well with column-oriented destinations
  like InfluxDB 3, and round-trips cleanly if you later re-serialize
  metrics with the
  [Prometheus output data format](/telegraf/v1/data_formats/output/prometheus/).
  The plugin's default is `1` (dense layout: metric name as measurement,
  `counter`/`gauge` field names), kept for backward compatibility.
- **`url_tag`** records which endpoint each metric came from.

## Example output

```text
prometheus,cpu=cpu0,mode=idle,url=http://node1.example.com:9100/metrics node_cpu_seconds_total=18472.1 1709572230000000000
prometheus,url=http://node1.example.com:9100/metrics node_memory_MemAvailable_bytes=5836500992 1709572230000000000
prometheus,method=GET,path=/api/orders,status=200,url=http://app1.example.com:8080/metrics http_requests_total=84721 1709572230000000000
```

## Extend this example

- In Kubernetes, scrape dynamically instead of listing URLs: set
  `monitor_kubernetes_pods = true` to discover pods by annotation, or
  `kubernetes_services` for service endpoints.
  See the [plugin documentation](/telegraf/v1/input-plugins/prometheus/).
- To accept pushed Prometheus data instead of scraping, pair
  [http_listener_v2](/telegraf/v1/input-plugins/http_listener_v2/) with
  the [Prometheus input data format](/telegraf/v1/data_formats/input/prometheus/)
  or the
  [Prometheus Remote Write input data format](/telegraf/v1/data_formats/input/prometheus-remote-write/).
- Histogram and summary metrics accumulate state.
  If you re-expose scraped metrics for Prometheus to collect, use the
  [prometheus_client output plugin](/telegraf/v1/output-plugins/prometheus_client/).
