---
title: Create an InfluxDB scraper
list_title: Create a scraper
description: Create an InfluxDB scraper that collects data from InfluxDB or a remote endpoint.
aliases:
  - /influxdb/v2.0/collect-data/scrape-data/manage-scrapers/create-a-scraper
  - /influxdb/v2.0/write-data/scrape-data/manage-scrapers/create-a-scraper
menu:
  influxdb_2_0:
    name: Create a scraper
    parent: Manage scrapers
weight: 301
---

Create a new scraper in the InfluxDB user interface (UI).

## Create a scraper in the InfluxDB UI
1. In the navigation menu on the left, select **Data** (**Load Data**) > **Scrapers**.

    {{< nav-icon "load data" >}}

3. Click **{{< icon "plus" >}} Create Scraper**.
4. Enter a **Name** for the scraper.
5. Select a **Bucket** to store the scraped data.
6. Enter the **Target URL** to scrape.
   The default URL value is `http://localhost:8086/metrics`,
   which provides InfluxDB-specific metrics in the [Prometheus data format](https://prometheus.io/docs/instrumenting/exposition_formats/).
7. Click **Create**.

The new scraper will begin scraping data after approximately 10 seconds,
then continue scraping in 10 second intervals.
