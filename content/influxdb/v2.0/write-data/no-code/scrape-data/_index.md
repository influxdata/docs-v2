---
title: Scrape data
seotitle: Scrape data using InfluxDB scrapers
weight: 103
description: >
  Scrape data from InfluxDB instances or remote endpoints using InfluxDB scrapers.
  Create a scraper in the InfluxDB UI to collect metrics from a specified target.
aliases:
  - /influxdb/v2.0/collect-data/scraper-metrics-endpoint
  - /influxdb/v2.0/collect-data/scrape-data
  - /influxdb/v2.0/write-data/scrape-data
  - /influxdb/v2.0/write-data/scrapable-endpoints
influxdb/v2.0/tags: [scraper]
menu:
  influxdb_2_0:
    name: Scrape data
    parent: No-code solutions
products: [oss]
---

InfluxDB scrapers collect data from specified targets at regular intervals,
then write the scraped data to an InfluxDB bucket.
Scrapers can collect data from any HTTP(S)-accessible endpoint that provides data
in the [Prometheus data format](https://prometheus.io/docs/instrumenting/exposition_formats/).

{{% cloud %}}
Scrapers are not available in {{< cloud-name "short" >}}.
{{% /cloud %}}


The following articles provide information about creating and managing InfluxDB data scrapers:

{{< children >}}
