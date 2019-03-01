---
title: Update a scraper
seotitle: Update an InfluxDB scraper
description: Update an InfluxDB scraper that collects data from InfluxDB or a remote endpoint.
menu:
  v2_0:
    parent: Manage scrapers
weight: 302
---

Update a scraper in the InfluxDB user interface (UI).

{{% note %}}
Scraper **Target URLs** and **BUCKETS** can not be updated.
To modify either, [create a new scraper](/v2.0/collect-data/scrape-data/manage-scrapers/create-a-scraper).
{{% /note %}}

## Update a scraper in the InfluxDB UI
1. Click **Organizations** in the left navigation menu.

    {{< nav-icon "orgs" >}}

2. In the list of organizations, click the name of your organization.
3. Click the **Scrapers** tab. A listing of any existing scrapers appears with the
   **Name**, **URL**, and **BUCKET** for each scraper.
4. Hover over the scraper you would like to update and click the edit icon (pencil)
   that appears next to the scrape name.
5. Enter a new name for the scraper. Hit return or click out of the name field to save the change.
