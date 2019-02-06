---
title: Quick start to data collection
seotitle: Quick start to data collection
description: >
  Use Quick Start to create a scraper to collect InfluxDB metrics into a bucket.
menu:
  v2_0:
    name: Quick start to data collection
    parent: Collect data
    weight: 1
---

>**Note:** The steps below only apply during your initial configuration and usage of your InfluxDB 2.0 instance. The page described below is not available after clicking one of the three options. For steps on configuring a scraper yourself, see [Scrape data using the /metrics endpoint](influxdb/v2.0/scraper-endpoint/).

## Use **Quick Start** to collect InfluxDB metrics

When you start InfluxDB 2.0 for the first time, you are guided to configure a user, organization, and a bucket.
After you complete this initial configuration, the next page includes "Let's start collecting data!" and three options.  
This page guides you on using the **Quick Start** option.

On the page that includes "Let's start collecting data!" and three options, click **Quick Start**. The following message appears in a popup alert:

`The InfluxDB Scraper has been configured for http://localhost:9999/metrics.`

Behind the scenes, here's what happened:

* InfluxDB 2.0 configured a scraper named "InfluxDB Scraper"
  - The target URL points to the `/metrics` HTTP endpoint of your
  local InfluxDB instance: http://localhost:9999/metrics. The `/metrics` HTTP endpoint monitors your InfluxDB instance, collects metrics from it, and provides the data in the [Prometheus data format](https://prometheus.io/docs/instrumenting/exposition_formats/).
  - The bucket configured to collect the scraped data is the initial
  bucket you named on the previous page.
* The InfluxDB Scraper immediately started collecting InfluxDB data and
   writing it into your bucket.

To see a sample of the data being collected in Prometheus format, you can use one of the following methods to display a sample of the exposed InfluxDB metrics in the Prometheus text-based format:

* Open the InfluxDB Scraper URL (http://localhost:9999/metrics) in a web browser. A sample of the data appears in a text file, with the data in the Prometheus format.

* In a terminal window, run the following cURL command: `curl  http://localhost:9999/metrics`.


## Next steps

Now that you have a bucket of data ready for exploration, you can:

* **Query data.** To get started querying the data stored in InfluxDB buckets using the InfluxDB user interface (UI) and the `influx` command line interface (CLI), see [Query data in InfluxDB](/v2.0/query-data).

* **Visualize data.** To learn how to build dashboards for visualizing your data, see [Visualize data with the InfluxDB UI](/v2.0/visualize-data).
