---
title: Query demo data
description: >
  Explore InfluxDB Cloud with our demo data buckets.
menu:
  influxdb_cloud:
    name: Query with demo data
    parent: Execute queries
weight: 110
draft: true
aliases:
  - /influxdb/cloud/write-data/#demo-data-for-influxdb-cloud
  - /influxdb/cloud/query-data/query-demo-data/
---

Use **InfluxDB Cloud** demo data buckets for quick and easy access to different
types of demo data that let you explore and familiarize yourself with InfluxDB Cloud.

{{< youtube GSaByPC1Bdc >}}

- [Add a demo data bucket](#add-a-demo-data-bucket)
- [Explore demo data](#explore-demo-data)
- [View demo data dashboards](#view-demo-data-dashboards)

{{% note %}}
#### Free to use and read-only
- InfluxDB Cloud demo data buckets are **free to use** and are **_not_ subject to
  [Free Plan rate limits](influxdb/cloud/account-management/limits/#free-plan-rate-limits) rate limits**.
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
Use the [Data Explorer](/influxdb/cloud/visualize-data/explore-metrics/)
to query and visualize data in demo data buckets.

In the navigation menu on the left, click **Data Explorer**.

{{< nav-icon "explore" >}}

## View demo data dashboards
After adding a demo data bucket, view the pre-built dashboard specific to the demo data set:

1. In the navigation menu on the left, click **Boards (Dashboards)**.

    {{< nav-icon "dashboards" >}}

2. Click the name of the dashboard that corresponds to your demo data bucket.

{{% note %}}
#### Other sample data sets
See [Sample data](/influxdb/cloud/reference/sample-data) for more sample InfluxDB data sets.
{{% /note %}}
