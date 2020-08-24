---
title: Cancel your InfluxDB Cloud subscription
description: >
  Cancel your InfluxDB Cloud 2.0 account at any time by stopping all read and write
  requests, backing up data, and contacting InfluxData Support.
weight: 104
aliases:
    - /v2.0/cloud/account-management/offboarding
    - /v2.0/account-management/offboarding
menu:
  influxdb_2_0:
    parent: Account management
    name: Cancel InfluxDB Cloud
products: [cloud]
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

For details, see [Export a task](/v2.0/process-data/manage-tasks/export-task/).

#### Export dashboards

For details, see [Export a dashboard](/v2.0/visualize-data/dashboards/export-dashboard/).

#### Save Telegraf configurations

1. Click the **Load Data** icon in the navigation bar.

    {{< nav-icon "load-data" >}}

2. Select the **Telegraf** tab. A list of existing Telegraf configurations appears.
3. Click the name of a Telegraf configuration.
4. Click **Download Config** to save.

#### Request a data backup

To request a backup of data in your {{< cloud-name "short" >}} instance, contact [InfluxData Support](mailto:support@influxdata.com).

### Cancel service

1. Click the **user avatar** in the top right corner of your {{< cloud-name "short" >}}
   user interface (UI) and select **Billing**.

2. Do one of the following:

  - If you subscribed to an InfluxDB Cloud 2.0 **Usage-Based Plan** through **AWS Marketplace**, click the **AWS** link, click **Unsubscribe**, and then click **Yes, cancel subscription**.
  - If you subscribed to an InfluxDB Cloud 2.0 **Usage-Based Plan** through **GCP Marketplace**, click the **GCP** link, click **Unsubscribe**, and then click **Yes, cancel subscription**.
  - If you subscribed to an InfluxDB Cloud 2.0 **Usage-Based Plan** through **InfluxData**, click **Cancel Service**. Select **I understand and agree to these conditions**, and then click **I understand, Cancel Service.** Click **Confirm and Cancel Service**. Your payment method is charged your final balance immediately upon cancellation of service.
