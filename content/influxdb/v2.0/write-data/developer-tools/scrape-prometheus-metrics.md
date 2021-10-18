---
title: Scrape Prometheus metrics
seotitle: Scape Prometheus metrics into InfluxDB
weight: 205
description: >
  Use Telegraf, InfluxDB scrapers, or the `prometheus.scrape` Flux function to
  scrape Prometheus-formatted metrics from an HTTP-accessible endpoint and store
  them in InfluxDB.
menu:
  influxdb_2_0:
    name: Scrape Prometheus metrics
    parent: Developer tools
related:
  - /{{< latest "telegraf" >}}/plugins/#prometheus, Telegraf Prometheus input plugin
  - /{{< latest "flux" >}}/prometheus/scrape-prometheus/, Scrape Prometheus metrics with Flux
  - /{{< latest "flux" >}}/stdlib/experimental/prometheus/scrape/
  - /{{< latest "flux" >}}/prometheus/metric-types/
  - /influxdb/v2.0/reference/prometheus-metrics/
  - /influxdb/v2.0/write-data/no-code/scrape-data/
influxdb/v2.0/tags: [prometheus, scraper]
---

Use [Telegraf](/{{< latest "telegraf" >}}/){{% oss-only %}}, [InfluxDB scrapers](/influxdb/v2.0/write-data/no-code/scrape-data/),{{% /oss-only %}}
or the [`prometheus.scrape` Flux function](/{{< latest "flux" >}}/stdlib/experimental/prometheus/scrape/)
to scrape Prometheus-formatted metrics from an HTTP-accessible endpoint and store them in InfluxDB.

{{% oss-only %}}

- [Use Telegraf](#use-telegraf)
- [Use an InfluxDB scraper](#use-an-influxdb-scraper)
- [Use prometheus.scrape()](#use-prometheusscrape)

{{% /oss-only %}}
{{% cloud-only %}}

- [Use Telegraf](#use-telegraf)
- [Use prometheus.scrape()](#use-prometheusscrape)

{{% /cloud-only %}}

## Use Telegraf
To use Telegraf to scrape Prometheus-formatted metrics from an HTTP-accessible
endpoint and write them to InfluxDB{{% cloud-only %}} Cloud{{% /cloud-only %}}, follow these steps:

1. Add the [Prometheus input plugin](/{{< latest "telegraf" >}}/plugins/#prometheus) to your Telegraf configuration file.
    1. Set the `urls` to scrape metrics from.
    2. Set the `metric_version` configuration option to specify which
      [metric parsing version](/influxdb/v2.0/reference/prometheus-metrics/) to use
      _(version `2` is recommended)_.
2. Add the [InfluxDB v2 output plugin](/{{< latest "telegraf" >}}/plugins/#influxdb_v2)
   to your Telegraf configuration file and configure it to to write to
   InfluxDB{{% cloud-only %}} Cloud{{% /cloud-only %}}.
  
##### Example telegraf.conf
```toml
# ...

## Collect Prometheus formatted metrics
[[inputs.prometheus]]
  urls = ["http://example.com/metrics"]
  metric_version = 2

## Write Prometheus formatted metrics to InfluxDB
[[outputs.influxdb_v2]]
  urls = ["http://localhost:8086"]
  token = "$INFLUX_TOKEN"
  organization = "example-org"
  bucket = "example-bucket"

# ...
```

{{% oss-only %}}

## Use an InfluxDB scraper
InfluxDB scrapers automatically scrape Prometheus-formatted metrics from an 
HTTP-accessible endpoint at a regular interval.
For information about setting up an InfluxDB scraper, see
[Scrape data using InfluxDB scrapers](/influxdb/v2.0/write-data/no-code/scrape-data/).

{{% /oss-only %}}

## Use prometheus.scrape()
To use the [`prometheus.scrape()` Flux function](/{{< latest "flux" >}}/stdlib/experimental/prometheus/scrape/)
to scrape Prometheus-formatted metrics from an HTTP-accessible endpoint and write
them to InfluxDB{{% cloud-only %}} Cloud{{% /cloud-only %}}, do the following in your Flux script:

1. Import the [`experimental/prometheus` package](/{{< latest "flux" >}}/stdlib/experimental/prometheus/).
2. Use `prometheus.scrape()` and provide the URL to scrape metrics from.
3. Use [`to()`](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/to/) and specify the  InfluxDB{{% cloud-only %}} Cloud{{% /cloud-only %}} bucket to write
  the scraped metrics to.

##### Example Flux script
```js
import "experimental/prometheus"

prometheus.scrape(url: "http://example.com/metrics")
  |> to(bucket: "example-bucket")
```

4. (Optional) To scrape Prometheus metrics at regular intervals using Flux, add your Flux
scraping script as an [InfluxDB task](/{{< latest "influxdb" >}}/process-data/).

_For information about scraping Prometheus-formatted metrics with `prometheus.scrape()`,
see [Scrape Prometheus metrics with Flux](/{{< latest "flux" >}}/prometheus/scrape-prometheus/)._
