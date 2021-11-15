---
title: Update an InfluxDB scraper
list_title: Update a scraper
description: Update an InfluxDB scraper that collects data from InfluxDB or a remote endpoint.
aliases:
  - /influxdb/v2.0/collect-data/scrape-data/manage-scrapers/update-a-scraper
  - /influxdb/v2.0/write-data/scrape-data/manage-scrapers/update-a-scraper
menu:
  influxdb_2_0:
    name: Update a scraper
    parent: Manage scrapers
weight: 302
---

Update a scraper in the InfluxDB user interface (UI).

{{% note %}}
Scraper **Target URLs** and **Buckets** cannot be updated.
To modify either, [create a new scraper](/influxdb/v2.0/write-data/no-code/scrape-data/manage-scrapers/create-a-scraper).
{{% /note %}}

## Update a scraper in the InfluxDB UI
1. In the navigation menu on the left, select **Data** (**Load Data**) > **Scrapers**.

    {{< nav-icon "load data" >}}

3. Hover over the scraper you would like to update and click the **{{< icon "pencil" "v2" >}}** that appears next to the scraper name.
4. Enter a new name for the scraper. Press Return or click out of the name field to save the change.
