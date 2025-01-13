---
title: Manage organizations
seotitle: Manage organizations in InfluxDB
description: Manage organizations in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_cloud:
    name: Manage organizations
    parent: Administer InfluxDB Cloud
weight: 10
influxdb/cloud/tags: [organizations]
aliases:
  - /influxdb/cloud/organizations/
related:
  - /influxdb/cloud/account-management/
alt_links:
  cloud-serverless: /influxdb3/cloud-serverless/admin/organizations/
---

An **organization** is a workspace for a group of users.
All dashboards, tasks, buckets, members, etc., belong to an organization.
An **account** can contain multiple organizations.
You can use organizations to separate data, environments (dev, staging, prod), teams, providers, and regions within the same account.

The following articles provide information about managing organizations:

{{< children >}}

{{% note %}}
#### Migrate to InfluxDB Cloud Serverless

To unlock the benefits of the InfluxDB 3 storage engine, including unlimited
cardinality and SQL, [migrate your data to an InfluxDB Cloud Serverless organization](/influxdb3/cloud-serverless/write-data/migrate-data/migrate-tsm-to-serverless/).

All InfluxDB Cloud [accounts](/influxdb3/cloud-serverless/admin/accounts/) and
[organizations](/influxdb3/cloud-serverless/admin/organizations/) created through
[cloud2.influxdata.com](https://cloud2.influxdata.com) on or after **January 31, 2023**
are on InfluxDB Cloud Serverless and are powered by the InfluxDB 3 storage engine.

To see which storage engine your organization uses, find the **InfluxDB Cloud powered by**
link in your [InfluxDB Cloud organization homepage](https://cloud2.influxdata.com)
version information. If your organization is using TSM, you'll see **TSM**
followed by the version number. If Serverless, you'll see **InfluxDB Cloud Serverless**
followed by the version number.
{{% /note %}}
