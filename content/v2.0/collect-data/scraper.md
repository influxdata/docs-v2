---
title: Scrape Prometheus Node Exporter data
seotitle: Scrape Prometheus Node Exporter data
description: >
  Use InfluxDB 2.0 with the Prometheus Node Exporter to scrape, store, and display data.
menu:
  v2_0:
    name: Scrape data using Prometheus node exporter
    parent: Collect data
    weight: 3
---

The [Prometheus Node Exporter](https://github.com/prometheus/node_exporter#node-exporter) and supported collectors capture hardware and OS metrics from third-party systems and translate the data into the popular Prometheus format, which is supported by InfluxDB. You can easily configure Node Exporter-generated output to be scraped into an InfluxDB 2.0 bucket for monitoring in dashboards.

After you have installed the Prometheus Node Exporter, follow the steps below to configure an InfluxDB 2.0 scraper to collect Node Exporter-generated data into an InfluxDB 2.0 bucket.

## Configure an InfluxDB scraper for capturing Prometheus Node Explorer data

Follow the steps here to capture Prometheus format data into an InfluxDB 2.0 bucket.

1. Open a web browser to your InfluxDB 2.0 instance
   [localhost:9999](http://localhost:9999). The login screen for the UI (user interface) appears.
2. Log in using your username and password. The **Getting started with   InfluxDB 2.0** screen appears.
3. In the navigation bar on the left, click **Organizations** and then click the name of your organization. The Organization page appears for your organization.
4. Click the **Scrapers** tab. A listing of existing scrapers appears, listing the **URL** and the **BUCKET** name.
5. Click **Create Scraper**. The **Data Loading** page appears with a for to **Add Scraper Target**.
6. In the **Bucket** listing, select the bucket to be used for collecting data from the Prometheus Node Exporter.
7. Enter the **Target URL** for the Prometheus `/metrics` HTTP endpoint for the Node Explorer. The default URL value for Node Explorer is `http://localhost:9100/metrics`.
8. Click **Finish**. The new scraper for Node Explorer appears as a new row in the listing of scrapers and displays the values for the **URL** and the **BUCKET**.

The new scraper for the Prometheus Node Exporter is now collecting data into the InfluxDB bucket you specified.

For information on creating InfluxDB 2.0 dashboards that use the Node Exporter data, see [Visualize data with InfluxDB](http://v2.dpcs.influxdata.com/v2.0/visualize-data/).
