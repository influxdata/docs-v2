---
title: Quick start to data collection
list_title: Quick start
description: >
  Use "Quick Start" in the initial InfluxDB setup process to create a scraper
  that collects InfluxDB metrics from the InfluxDB `/metrics` endpoint.
aliases:
  - /v2.0/collect-data/scraper-quickstart
menu:
  v2_0:
    name: Quick start
    parent: Collect data
weight: 101
---

Select **Quick Start** in the last step of the InfluxDB user interface's (UI)
[setup process](/v2.0/get-started/#set-up-influxdb) to quickly start collecting data with InfluxDB.
Quick Start creates a data scraper that collects metrics from the InfluxDB `/metrics` endpoint.
The scraped data provides a robust dataset of internal InfluxDB metrics that you can query, visualize, and process.

## Use Quick Start to collect InfluxDB metrics
After [setting up InfluxDB v2.0](/v2.0/get-started/#set-up-influxdb),
the "Let's start collecting data!" page displays options for collecting data.
Click **Quick Start**.

InfluxDB creates and configures a new [scraper](/v2.0/collect-data/scrape-data/).
The target URL points to the `/metrics` HTTP endpoint of your local InfluxDB instance (e.g. `http://localhost:9999/metrics`),
which outputs internal InfluxDB metrics in the [Prometheus data format](https://prometheus.io/docs/instrumenting/exposition_formats/).
It stores the scraped metrics in the bucket created during the [initial setup process](/v2.0/get-started/#set-up-influxdb).

The following message briefly appears in the UI:

{{< ui-message text="The InfluxDB scraper has been configured for http://localhost:9999/metrics" >}}

{{% note %}}
Quick Start is available only in the last step of the setup process.
If you missed the Quick Start option, you can [manually create a scraper](/v2.0/collect-data/scrape-data)
that scrapes data from the `/metrics` endpoint.
{{% /note %}}

## Next steps
Now with data to explore, you can:

- [Query data in InfluxDB](/v2.0/query-data)
- [Process data with InfluxDB tasks](/v2.0/process-data)
- [Visualize data with the InfluxDB UI](/v2.0/visualize-data)
