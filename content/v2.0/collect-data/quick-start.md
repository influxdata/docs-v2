---
title: Quick start to data collection
description: >
  Use the "Quick Start" to create a scraper that collects InfluxDB metrics from InfluxDB's `/metrics` endpoint.
aliases:
  - /v2.0/collect-data/scraper-quickstart
menu:
  v2_0:
    name: Quick start
    parent: Collect data
weight: 101
---

The quickest way to start collecting data with InfluxDB v2.0 is to use the **Quick Start**
option available in the last step of InfluxDB's user interface (UI) initialization process.
The Quick Start creates a data scraper that collects metrics from InfluxDB's own `/metrics` endpoint.
The scraped data provides a robust dataset of internal InfluxDB metrics which you can query, visualize, and process.

## Use Quick Start to collect InfluxDB metrics
After [initializing InfluxDB v2.0](/v2.0/get-started/#setup-influxdb),
the "Let's start collecting data!" page displays options for collecting data.
Click **Quick Start**.

The following message briefly appears in the UI:

{{< img-hd src="/img/2-0-quickstart-confirmation.png" />}}

Behind the scenes, InfluxDB creates and configures a scraper named "InfluxDB Scraper."
The target URL points to the `/metrics` HTTP endpoint of your local InfluxDB instance (e.g. `http://localhost:9999/metrics`),
which outputs internal InfluxDB metrics in the [Prometheus data format](https://prometheus.io/docs/instrumenting/exposition_formats/).
InfluxDB stores the scraped metrics in the bucket created during the [initial setup process](/v2.0/get-started/#setup-influxdb).

{{% note %}}
The Quick Start options is only available in the last step of InfluxDB's initial setup process.
However, if you miss it, you can [manually create a scraper](/v2.0/collect-data/scrape-data) that scrapes data from the `/metrics` endpoint.
{{% /note %}}

## Next steps
Now that you have data ready for exploration, you can:

* **Query data.** To get started querying the data stored in InfluxDB buckets using the InfluxDB user interface (UI) and the `influx` command line interface (CLI), see [Query data in InfluxDB](/v2.0/query-data).

* **Process data.** To learn about creating tasks for processing and analyzing data, see [Process data with InfluxDB tasks](/v2.0/process-data)

* **Visualize data.** To learn how to build dashboards for visualizing your data, see [Visualize data with the InfluxDB UI](/v2.0/visualize-data).
