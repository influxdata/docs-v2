---
title: Switch InfluxDB Cloud organizations
seotitle: Switch between InfluxDB Cloud organizations
description: >
  Switch from one InfluxDB Cloud organization to another.  
menu:
  influxdb_cloud:
    name: Switch InfluxDB organizations
    parent: Account management
weight: 105
related:
  - /influxdb/cloud/account-management/switch-account/
alt_engine: /influxdb/cloud-serverless/admin/organizations/switch-org/
---

If you belong to more than one {{< product-name >}} organization with the same email address, you can switch from one organization to another while staying logged in.

To switch {{< product-name "short" >}} organizations:

1. (Optional) To switch to an organization in a different account, [switch accounts](/influxdb/cloud/account-management/switch-account/).
2. In the {{< product-name "short" >}} UI, click the organization name in the header and select **Switch Organizations**.
3. Select the organization you want to switch to from the drop-down list.

{{% note %}}
#### Migrate to IOx

To benefit from IOx's unlimited cardinality and support for SQL, [migrate your data to an InfluxDB Cloud Serverless organization](/influxdb/cloud-serverless/write-data/migrate-data/migrate-tsm-to-iox/).

All InfluxDB Cloud [accounts](/influxdb/cloud-serverless/admin/accounts/) and [organizations](/influxdb/cloud-serverless/admin/organizations/) created through
[cloud2.influxdata.com](https://cloud2.influxdata.com) on or after **January 31, 2023**
are powered by the InfluxDB IOx storage engine.

To see which storage engine your organization uses,
find the **InfluxDB Cloud powered by** link in your
[InfluxDB Cloud organization homepage](https://cloud2.influxdata.com) version information.
If your organization is using TSM, you'll see **TSM** followed by the version number.
If IOx, you'll see
**InfluxDB Cloud Serverless** followed by the version number.
{{% /note %}}
