---
title: Quick start to data collection
list_title: Quick start
description: >
  Start collecting data right away with demo data or scrapers.
aliases:
  - /v2.0/collect-data/scraper-quickstart
  - /v2.0/collect-data/quick-start
  - /v2.0/write-data/sample-data/demo-data/
menu:
  v2_0:
    name: Quick start
    parent: Write data
weight: 101
---
Familiarize yourself with querying, visualizing, and processing data in InfluxDB Cloud and InfluxDB OSS by collecting data right away. The following options are available:

- [Demo data for InfluxDB Cloud](#demo-data-for-influxdb-cloud)
- [Quick Start for InfluxDB OSS](#quick-start-for-influxdb-oss)


## Demo data for InfluxDB Cloud
Use **InfluxDB Cloud** demo data buckets for quick and easy access to different
types of demo data that let you explore and familiarize yourself with InfluxDB Cloud.

- [Add a demo data bucket](#add-a-demo-data-bucket)
- [Explore demo data](#explore-demo-data)
- [View demo data dashboards](#view-demo-data-dashboards)

{{% note %}}
#### Free to use and read-only
- InfluxDB Cloud demo data buckets are **free to use** and are **_not_ subject to
  [Free Plan](/v2.0/account-management/pricing-plans/#free-plan) rate limits**.
- Demo data buckets are **read-only**. You cannot write data into demo data buckets.
{{% /note %}}

## Demo data sets
Choose from the following demo data sets:

- **Website Monitoring**  
  Explore, visualize, and monitor HTTP response metrics from InfluxData websites.


## Add a demo data bucket
1.  In the navigation menu on the left, click **Data (Load Data)** > **Buckets**.

    {{< nav-icon "data" >}}

2.  Click **{{< icon "plus" >}} Add Demo Data**, and then select the demo data bucket to add.
3.  The Demo Data bucket appears in your list of buckets.

## Explore demo data
Use the [Data Explorer](https://v2.docs.influxdata.com/v2.0/visualize-data/explore-metrics/)
to query and visualize data in demo data buckets.

In the navigation menu on the left, click **Explore (Data Explorer)**.

{{< nav-icon "explore" >}}

## View demo data dashboards
After adding a demo data bucket, view the pre-built dashboard specific to the demo data set:

1. In the navigation menu on the left, click **Boards (Dashboards)**.

    {{< nav-icon "dashboards" >}}

2. Click the name of the dashboard that corresponds to your demo data bucket.

{{% note %}}
#### Other sample data sets
See [Sample data](/v2.0/write-data/sample-data) for more sample InfluxDB data sets.
{{% /note %}}

## Quick Start for InfluxDB OSS

Select **Quick Start** in the last step of the InfluxDB user interface's (UI)
[setup process](/v2.0/get-started/#set-up-influxdb) to quickly start collecting data with InfluxDB.
Quick Start creates a data scraper that collects metrics from the InfluxDB `/metrics` endpoint.
The scraped data provides a robust dataset of internal InfluxDB metrics that you can query, visualize, and process.

### Use Quick Start to collect InfluxDB metrics
After [setting up InfluxDB v2.0](/v2.0/get-started/#set-up-influxdb),
the "Let's start collecting data!" page displays options for collecting data.
Click **Quick Start**.

InfluxDB creates and configures a new [scraper](/v2.0/write-data/scrape-data/).
The target URL points to the `/metrics` HTTP endpoint of your local InfluxDB instance
(for example, `http://localhost:9999/metrics`), which outputs internal InfluxDB
metrics in the [Prometheus data format](https://prometheus.io/docs/instrumenting/exposition_formats/).
The scraper stores the scraped metrics in the bucket created during the
[initial setup process](/v2.0/get-started/#set-up-influxdb).

{{% note %}}
Quick Start is only available in the last step of the setup process.
If you missed the Quick Start option, you can [manually create a scraper](/v2.0/write-data/scrape-data)
that scrapes data from the `/metrics` endpoint.
{{% /note %}}

## Next steps
Now with data to explore, you can:

- [Query data in InfluxDB](/v2.0/query-data)
- [Process data with InfluxDB tasks](/v2.0/process-data)
- [Visualize data with the InfluxDB UI](/v2.0/visualize-data)
