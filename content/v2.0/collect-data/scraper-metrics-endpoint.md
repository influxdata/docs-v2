---
title: Scrape data using the /metrics endpoint
seotitle: Scrape data using the /metrics endpoint
description: >
  Use the InfluxDB UI to configure a scraper with a /metrics endpoint for collecting metrics from InfluxDB instances or third-party systems.
menu:
  v2_0:
    name: Scrape data using the /metrics endpoint
    parent: Collect data
    weight: 1
---

An InfluxDB scraper collects data from specified targets at regular intervals and then writes the scraped data to a bucket. Scrapers can capture hardware and OS metrics from third-party systems or even from InfluxDB instances. In InfluxDB 2.0, the metrics are scraped from
`/metrics` HTTP endpoints, in the [Prometheus data format](https://prometheus.io/docs/instrumenting/exposition_formats/), which is supported by InfluxDB.

To quickly create a scraper in InfluxDB 2.0, you can use the InfluxDB 2.0 user interface (UI) to specify the target URL and the bucket to store the data. The scraped data is collected in the [Prometheus data format](https://prometheus.io/docs/instrumenting/exposition_formats/) and then transformed to match the InfluxDB data structure in the buckets.

## Use the InfluxDB UI to configure a scraper for data collection

Follow the steps below to configure an InfluxDB scraper that uses an
`/metrics` HTTP endpoint for collecting metrics and loading the scraped data into a bucket.

1. Open a web browser to access the InfluxDB 2.0 user interface
   ([localhost:9999](http://localhost:9999)). The **Getting started with InfluxDB 2.0** screen appears.
2. In the navigation bar on the left, click **Organizations** and then click the name of your organization. The **Organization** page appears for the selected organization.
3. Click the **Scrapers** tab. A listing of any existing scrapers appears, listing the **URL** and the **BUCKET** name.
4. Click **Create Scraper**. The **Data Loading** page appears with **Add Scraper Target** options to define a scraper.
5. From the **Bucket** listing, select the bucket for collecting the data.
6. Enter the **Target URL** to use for the Prometheus `/metrics` HTTP endpoint. The default URL value is `http://localhost:9999/metrics`.
7. Click **Finish**. Your new scraper appears in the scraper listing, displaying the values you specified for the **URL** and the **BUCKET**.

The new scraper is now collecting data into the InfluxDB bucket you specified.

## Next steps

Now that you have a bucket of data ready for exploration, you can:

* **Query data.** To get started querying the data stored in InfluxDB buckets using the InfluxDB user interface (UI) and the `influx` command line interface (CLI), see [Query data in InfluxDB](/v2.0/query-data).

* **Process data.** To learn about creating tasks for processing and analyzing data, see [Process data with InfluxDB tasks](/v2.0/process-data)

* **Visualize data.** To learn how to build dashboards for visualizing your data, see [Visualize data with the InfluxDB UI](/v2.0/visualize-data).
