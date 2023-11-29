---
title: InfluxDB Cloud Serverless documentation
description: >
  InfluxDB Cloud Serverless is a hosted and managed version of InfluxDB v3, the
  time series platform designed to handle high write and query loads.
  Learn how to use and leverage InfluxDB Cloud Serverless in use cases such as
  monitoring metrics, IoT data, and events.
menu:
  influxdb_cloud_serverless:
    name: InfluxDB Cloud Serverless
weight: 1
---

{{% note %}}
This InfluxDB Cloud documentation applies to all [organizations](/influxdb/cloud-serverless/admin/organizations/) created through
**cloud2.influxdata.com** on or after **January 31, 2023** that are powered by
the InfluxDB v3 storage engine. If your organization was created before this
date or through the Google Cloud Platform (GCP) or Azure marketplaces, see the
[InfluxDB Cloud (TSM) documentation](/influxdb/cloud/).

To see which storage engine your organization is using,
find the **InfluxDB Cloud powered by** link in your
[InfluxDB Cloud organization homepage](https://cloud2.influxdata.com) version information.
If your organization is using InfluxDB 3.0, you'll see
**InfluxDB Cloud Serverless** followed by the version number.
{{% /note %}}

InfluxDB Cloud Serverless is a hosted and managed version of InfluxDB backed
by InfluxDB 3.0, the time series platform designed to handle high write and query loads.
Learn how to use and leverage InfluxDB Cloud Serverless in use cases such as monitoring
metrics, IoT data, and event monitoring.

<a class="btn" href="/influxdb/cloud-serverless/get-started/">Get started with InfluxDB Cloud Serverless</a>

## InfluxDB 3.0

**InfluxDB 3.0** is InfluxDB's next generation that unlocks series
limitations present in the Time Structured Merge Tree (TSM) storage engine and
allows infinite series cardinality without any impact on overall database performance.
It also brings native **SQL support** and improved InfluxQL performance.

View the following video for more information about InfluxDB 3.0:

{{< youtube "uwqLWpmlQHM" >}}

## How do you use InfluxDB 3.0?

All InfluxDB Cloud [accounts](/influxdb/cloud-serverless/admin/accounts/) and [organizations](/influxdb/cloud-serverless/admin/organizations/) created through
[cloud2.influxdata.com](https://cloud2.influxdata.com) on or after **January 31, 2023**
are powered by the InfluxDB 3.0.

To see which storage engine your organization is using,
find the **InfluxDB Cloud powered by** link in your
[InfluxDB Cloud organization homepage](https://cloud2.influxdata.com) version information.
If your organization is using InfluxDB 3.0, you'll see
**InfluxDB Cloud Serverless** followed by the version number.
