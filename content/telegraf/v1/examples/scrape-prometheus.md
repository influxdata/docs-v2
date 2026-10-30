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
  - /influxdb3/core/write-data/best-practices/schema-design/, InfluxDB 3 schema design best practices
  - /influxdb/v2/reference/prometheus-metrics/, InfluxDB v2 Prometheus metric parsing formats
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

  ## Metric layout. Use 1 (the plugin default) when writing to InfluxDB 3.
  metric_version = 1

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

> [!Important]
> #### Use metric version 1 with InfluxDB 3
>
> `metric_version = 2` writes every scraped Prometheus metric into a single
> measurement as its own field.
> In InfluxDB 3, that produces one wide, sparse table in which most columns
> are null in any given row, and queries against it perform poorly.
> Set `metric_version = 1` when writing to any InfluxDB 3 product.
> See [Choose a metric version](#choose-a-metric-version).

## How it works

- **`urls`** lists the endpoints to scrape.
  The plugin requests each one on the collection interval and parses the
  exposition-format response.
- **`metric_version`** selects one of two metric layouts.
  Version `1`, the plugin default, stores each Prometheus metric as its own
  Telegraf metric, with labels as tags and a field named for the sample type
  (`counter`, `gauge`, or `value`).
  Version `2` stores every sample in a single Telegraf metric named
  `prometheus`, with labels as tags and the Prometheus metric name as the
  field key.
  The right choice depends on where you write the data.
  See [Choose a metric version](#choose-a-metric-version).
- **`url_tag`** records which endpoint each metric came from.

## Example output

With `metric_version = 1`, each Prometheus metric becomes its own measurement:

```lp
node_cpu_seconds_total,cpu=cpu0,mode=idle,url=http://node1.example.com:9100/metrics counter=18472.1 1709572230000000000
node_memory_MemAvailable_bytes,url=http://node1.example.com:9100/metrics gauge=5836500992 1709572230000000000
http_requests_total,method=GET,path=/api/orders,status=200,url=http://app1.example.com:8080/metrics counter=84721 1709572230000000000
```

With `metric_version = 2`, the same samples share the `prometheus`
measurement and each Prometheus metric name becomes a field:

```lp
prometheus,cpu=cpu0,mode=idle,url=http://node1.example.com:9100/metrics node_cpu_seconds_total=18472.1 1709572230000000000
prometheus,url=http://node1.example.com:9100/metrics node_memory_MemAvailable_bytes=5836500992 1709572230000000000
prometheus,method=GET,path=/api/orders,status=200,url=http://app1.example.com:8080/metrics http_requests_total=84721 1709572230000000000
```

## Choose a metric version

The two layouts produce different schemas in the destination, so choose the
version that fits the destination you write to.

| Destination | `metric_version` | Why |
| :---------- | :--------------: | :-- |
| InfluxDB 3 (Core, Enterprise, Cloud Dedicated, Cloud Serverless, Clustered) | `1` | Version 2 puts every Prometheus metric name in one measurement as its own field. In InfluxDB 3, that becomes a [wide](/influxdb3/core/write-data/best-practices/schema-design/#avoid-wide-schemas), [sparse](/influxdb3/core/write-data/best-practices/schema-design/#avoid-sparse-schemas) table that slows persistence and queries. Version 1 writes each Prometheus metric to its own measurement, which InfluxDB 3 stores as a narrow table. |
| InfluxDB v2 and InfluxDB Cloud (TSM) | `1` or `2` | Either layout works. Use `2` to match the layout that Flux [`prometheus.scrape()`](/flux/v0/stdlib/experimental/prometheus/scrape/) produces and that the Flux [`experimental/prometheus` package](/flux/v0/stdlib/experimental/prometheus/) expects. See [InfluxDB v2 Prometheus metric parsing formats](/influxdb/v2/reference/prometheus-metrics/). |
| InfluxDB 1.x | `1` or `2` | Either layout works. Version 2 keeps all metrics in one measurement, so a single InfluxQL query can select several metrics. |
| Prometheus, through the [`prometheus_client` output plugin](/telegraf/v1/output-plugins/prometheus_client/) or the [Prometheus output data format](/telegraf/v1/data_formats/output/prometheus/) | Match the output | Set the same `metric_version` in the input and the `prometheus_client` output so metrics round-trip without modification. The Prometheus output data format requires version `2`. |

<!-- TODO: InfluxDB 3 Enterprise with PachaTree storage may handle the
metric version 2 layout better than Parquet-backed storage. Document a
recommendation here after that evaluation is complete. -->

> [!Note]
> #### Input data formats default to version 2
>
> The `prometheus`, `openmetrics`, and `prometheusremotewrite`
> [input data formats](/telegraf/v1/data_formats/input/) default to
> version `2`, and they name the option `prometheus_metric_version` or
> `openmetrics_metric_version`.
> If you accept pushed Prometheus data with
> [`http_listener_v2`](/telegraf/v1/input-plugins/http_listener_v2/) and
> write to InfluxDB 3, set the version to `1` explicitly.

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
  Both default to metric version `2`, so set
  `prometheus_metric_version = 1` when writing to InfluxDB 3.
- Histogram and summary metrics accumulate state.
  If you re-expose scraped metrics for Prometheus to collect, use the
  [prometheus_client output plugin](/telegraf/v1/output-plugins/prometheus_client/).
