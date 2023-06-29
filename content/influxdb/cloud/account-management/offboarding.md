---
title: Cancel your InfluxDB Cloud subscription
description: >
  Cancel your InfluxDB Cloud account at any time by stopping all read and write
  requests, and backing up data.
weight: 106
aliases:
  - /influxdb/v2.0/account-management/offboarding
  - /influxdb/v2.0/cloud/account-management/offboarding
menu:
  influxdb_cloud:
    parent: Account management
    name: Cancel InfluxDB Cloud
alt_engine: /influxdb/cloud-serverless/admin/accounts/cancel-account/
---

To cancel your {{< cloud-name >}} subscription, complete the following steps:

1. [Stop reading and writing data](#stop-reading-and-writing-data).
2. [Export data and other artifacts](#export-data-and-other-artifacts).
3. [Cancel service](#cancel-service).

### Stop reading and writing data

To stop being charged for {{< cloud-name "short" >}}, pause all writes and queries.

### Export data and other artifacts

To export data and artifacts, follow the steps below.

{{% note %}}
Exported data and artifacts can be used in an InfluxDB OSS instance.
{{% /note %}}

#### Export tasks

For details, see [Export a task](/influxdb/cloud/process-data/manage-tasks/export-task/).

#### Export dashboards

For details, see [Export a dashboard](/influxdb/cloud/visualize-data/dashboards/export-dashboard/).

#### Save Telegraf configurations

1. Click the **Load Data** icon in the navigation bar.

    {{< nav-icon "load-data" >}}

2. Select the **Telegraf** tab. A list of existing Telegraf configurations appears.
3. Click the name of a Telegraf configuration.
4. Click **Download Config** to save.

#### Export data

To export all your data, query your data out in time-based batches and store it
in to an external system or an InfluxDB OSS instance.

For information about automatically exporting and migrating data from InfluxDB 
Cloud to InfluxDB OSS, see: [Migrate data from InfluxDB Cloud to InfluxDB OSS](/influxdb/cloud/migrate-data/migrate-cloud-to-oss/).

### Cancel service

{{% note %}}
Cancelling your usage-based plan will delete your organization.
{{% /note %}}

1. Click the account name in the header of your {{< cloud-name "short" >}}
   user interface (UI) and select **Billing**.

2. Do one of the following:

  - If you subscribed to an InfluxDB Cloud **Usage-Based Plan** through **AWS Marketplace**, click the **AWS** link, click **Unsubscribe**, and then click **Yes, cancel subscription**.
  - If you subscribed to an InfluxDB Cloud **Usage-Based Plan** through **GCP Marketplace**, click the **GCP** link, click **Unsubscribe**, and then click **Yes, cancel subscription**.
  - If you subscribed to an InfluxDB Cloud **Usage-Based Plan** through **InfluxData**, click **Cancel Service**. Select **I understand and agree to these conditions**, and then click **I understand, Cancel Service.** Click **Confirm and Cancel Service**. Your payment method is charged your final balance immediately upon cancellation of service.
