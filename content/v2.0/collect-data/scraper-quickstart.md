---
title: Quick start to data collection
weight: 101
seotitle: Quick start to data collection
description: >
  Use Quick Start to create a scraper to collect InfluxDB metrics into a bucket.
menu:
  v2_0:
    name: Quick start
    parent: Collect data
---

{{% note %}}
The steps below are available on a page that appears after you complete the initial configuration described in [Set up InfluxDB](/v2.0/get-started/#setup-influxdb). After clicking one of the three options, the page is no longer available.

If you missed the change to select Quick Start or you want to learn how to configure a scraper yourself, see [Scrape data using the /metrics endpoint](/v2.0/collect-data/scraper-metrics-endpoint/).
{{% /note %}}

## Use Quick Start to collect InfluxDB metrics

When you start InfluxDB 2.0 for the first time, you are guided to configure a user, an organization, and a bucket (see [Set up InfluxDB](/v2.0/get-started/#setup-influxdb)). After completing the setup, the next page displays "Let's start collecting data!" and three options.

On this page, click **Quick Start**.
The following message briefly appears in a pop-up alert:

"The InfluxDB Scraper has been configured for http://localhost:9999/metrics."

Behind the scenes, here's what happened:

1. InfluxDB 2.0 configured a scraper named "InfluxDB Scraper."

  * The target URL points to the `/metrics` HTTP endpoint of your
  local InfluxDB instance: `http://localhost:9999/metrics`. The `/metrics` HTTP endpoint monitors your InfluxDB instance, collects metrics from it, and provides the data in the [Prometheus data format](https://prometheus.io/docs/instrumenting/exposition_formats/).
  * InfluxDB stores the scraped data in the default bucket created in [the initial setup procedure](/v2.0/get-started/#setup-influxdb).

2. The InfluxDB Scraper immediately started collecting InfluxDB data and
   writing it into your bucket.

To see a sample of the data being collected in Prometheus format, you can use one of the following methods to display a sample of the exposed InfluxDB metrics in the Prometheus text-based format:

* In a web browser, open the InfluxDB Scraper URL (http://localhost:9999/metrics).

* In a terminal window, run the following cURL command:
```
curl  http://localhost:9999/metrics
```

## Next steps

Now that you have data ready for exploration, you can:

* **Query data.** To get started querying the data stored in InfluxDB buckets using the InfluxDB user interface (UI) and the `influx` command line interface (CLI), see [Query data in InfluxDB](/v2.0/query-data).

* **Process data.** To learn about creating tasks for processing and analyzing data, see [Process data with InfluxDB tasks](/v2.0/process-data)

* **Visualize data.** To learn how to build dashboards for visualizing your data, see [Visualize data with the InfluxDB UI](/v2.0/visualize-data).
