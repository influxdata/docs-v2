---
title: Update a scraper
seotitle: Update an InfluxDB scraper
description: Update an InfluxDB scraper that collects data from InfluxDB or a remote endpoint.
aliases:
  - /v2.0/collect-data/scrape-data/manage-scrapers/update-a-scraper
menu:
  v2_0:
    parent: Manage scrapers
weight: 302
---

Update a scraper in the InfluxDB user interface (UI).

{{% note %}}
Scraper **Target URLs** and **BUCKETS** can not be updated.
To modify either, [create a new scraper](/v2.0/write-data/scrape-data/manage-scrapers/create-a-scraper).
{{% /note %}}

## Update a scraper in the InfluxDB UI
1. Click the **Settings** tab in the navigation bar.

    {{< nav-icon "settings" >}}

2. Click the **Scrapers** tab. A list of existing scrapers appears.
3. Hover over the scraper you would like to update and click the **{{< icon "pencil" >}}**
   that appears next to the scraper name.
4. Enter a new name for the scraper. Press Return or click out of the name field to save the change.
