---
title: Manage sources
description: InfluxDB offers a complete dashboard solution for visualizing your data and monitoring your infrastructure.
v2.0/tags: [sources]
menu:
  v2_0:
    name: Manage sources
    parent: Visualize data
weight: 101
---

Like dashboards and buckets, data sources are scoped by organization. When you first access the user interface, you'll be prompted to add a data source. You can also do so anytime using the steps below.


**To add data to a bucket**:

1. Click in the **Organizations** icon in the navigation bar.

    {{< nav-icon "orgs" >}}

2. Select the **Buckets** tab.
3. Next to the name of a bucket, click **Add Data**.
4. Select **Streaming**, **Line Protocol**, or **Scraping** from the data source options.
5. Click **Continue**.
6. Follow the prompts add your data source.

**To manage Telegraf configurations**:

1. Click in the **Organizations** icon in the navigation bar.

    {{< nav-icon "orgs" >}}

2. Select the **Telegraf** tab. A list of existing Telegraf configurations appears.
3. To add a new Telegraf configuration:
  * Click **Create Configuration** in the upper right.
  * Select the Telegraf plugins you want to use to collect data.
  * Click **Continue**.
  * Follow the instructions on the **Listen for Streaming Data** page that appears to complete your configuration.
4. To delete a Telegraf configuration, hover over its name in the list and click **Delete**.
5. To view details of a Telegraf configuration, hover over its name in the list and click **Download Config**.
