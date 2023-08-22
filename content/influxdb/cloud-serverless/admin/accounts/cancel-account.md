---
title: Cancel your InfluxDB Cloud Serverless subscription
description: >
  Cancel your InfluxDB Cloud account at any time by stopping all read and write
  requests, backing up data, and contacting InfluxData Support.
weight: 106
aliases:
  - /influxdb/v2.0/account-management/offboarding
  - /influxdb/v2.0/cloud/account-management/offboarding
  - /influxdb/cloud-serverless/admin/accounts/offboarding
menu:
  influxdb_cloud_serverless:
    parent: Manage accounts
    name: Cancel InfluxDB Cloud
alt_engine: /influxdb/cloud/account-management/offboarding/
---

To cancel your InfluxDB Cloud Serverless subscription, complete the following steps:

1. [Stop reading and writing data](#stop-reading-and-writing-data).
2. [Export data and other artifacts](#export-data-and-other-artifacts).
3. [Cancel service](#cancel-service).

## Stop reading and writing data

To stop being charged for InfluxDB Cloud Serverless, pause all writes and queries.

## Export data and other artifacts

- [Save Telegraf configurations](#save-telegraf-configurations)
- [Export data](#export-data)

### Save Telegraf configurations

1. Click the **Load Data** icon in the navigation bar.

    {{< nav-icon "load-data" >}}

2. Select the **Telegraf** tab. A list of existing Telegraf configurations appears.
3. Click the name of a Telegraf configuration.
4. Click **Download Config** to save.

### Export data

To export all your data, query your data out in _time-based batches_ and store it
in to an external system or an InfluxDB OSS instance.

<!-- For information about automatically exporting and migrating data from InfluxDB 
Cloud to InfluxDB OSS, see: [Migrate data from InfluxDB Cloud to InfluxDB OSS](/influxdb/cloud-serverless/migrate-data/migrate-cloud-to-oss/). -->

## Cancel service

1. Click the account name in the header of your InfluxDB Cloud Serverless
   user interface (UI) and select **Billing**.

2. Do one of the following:

  - If you subscribed to an InfluxDB Cloud **Usage-Based Plan** through
    **AWS Marketplace**, click the **AWS** link, click **Unsubscribe**, and then
    click **Yes, cancel subscription**.
  - If you subscribed to an InfluxDB Cloud **Usage-Based Plan** through
    **GCP Marketplace**, click the **GCP** link, click **Unsubscribe**, and then
    click **Yes, cancel subscription**.
  - If you subscribed to an InfluxDB Cloud **Usage-Based Plan** through
    **InfluxData**, click **Cancel Service**.
    Select **I understand and agree to these conditions**, and then click
    **I understand, Cancel Service.** Click **Confirm and Cancel Service**.
    Your payment method is charged your final balance immediately upon
    cancellation of service.
