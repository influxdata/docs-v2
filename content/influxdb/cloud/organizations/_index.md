---
title: Manage organizations
seotitle: Manage organizations in InfluxDB
description: Manage organizations in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_cloud:
    name: Manage organizations
weight: 10
influxdb/cloud/tags: [organizations]
related:
  - /influxdb/cloud/account-management/
alt_links:
  cloud-serverless: /influxdb/cloud-serverless/admin/organizations/
---

An **organization** is a workspace for a group of users.
All dashboards, tasks, buckets, members, etc., belong to an organization.
An **account** can contain multiple organizations.
You can use organizations to separate data, environments (dev, staging, prod), teams, providers, and regions within the same account.

The following articles provide information about managing organizations:

{{< children >}}

{{% note %}}
#### Migrate to IOx

To benefit from IOx's unlimited cardinality and support for SQL, [migrate your data to an InfluxDB Cloud Serverless organization](/influxdb/cloud-serverless/write-data/migrate-data/migrate-tsm-to-iox/).

All InfluxDB Cloud [accounts](/influxdb/cloud-serverless/admin/accounts/) and [organizations](/influxdb/cloud-serverless/admin/organizations/) created through
[cloud2.influxdata.com](https://cloud2.influxdata.com) on or after **January 31, 2023**
are powered by the InfluxDB IOx storage engine.

To see which storage engine your organization is using,
find the **InfluxDB Cloud powered by** link in your
[InfluxDB Cloud organization homepage](https://cloud2.influxdata.com) version information.
If your organization is using TSM, you'll see **TSM** followed by the version number.
If IOx, you'll see
**InfluxDB Cloud Serverless** followed by the version number.
{{% /note %}}