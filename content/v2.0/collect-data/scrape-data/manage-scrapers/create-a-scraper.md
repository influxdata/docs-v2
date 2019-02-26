---
title: Create a scraper
seotitle: Create an InfluxDB scraper
description: Create an InfluxDB scraper that collects data from InfluxDB or a remote endpoint.
menu:
  v2_0:
    parent: Manage scrapers
weight: 301
---

Create a new scraper in the InfluxDB user interface (UI).

## Create a scraper in the InfluxDB UI
1. Click **Organizations** in the left navigation menu.

    {{< img-hd src="/img/organizations-icon.png" />}}

2. In the list of organizations, click the name of your organization.
3. Click the **Scrapers** tab.
4. Click **+ Create Scraper**.
5. Provide a **Name** for the scraper.
5. Select a **Bucket** in which to store the scraped data.
6. Enter the **Target URL** to scrape. The default URL value is `http://localhost:9999/metrics`
   which provides InfluxDB-specific metrics in the [Prometheus data format](https://prometheus.io/docs/instrumenting/exposition_formats/).
7. Click **Finish**.

The new scraper will begin scraping data after approximately 10 seconds,
then continue scraping in 10 second intervals.
