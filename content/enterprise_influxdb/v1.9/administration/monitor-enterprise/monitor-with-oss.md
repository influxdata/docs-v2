---
title: Monitor InfluxDB Enterprise using OSS 
description: >
  Monitor your InfluxDB Enterprise instance using InfluxDB OSS and
  a pre-built InfluxDB template.
menu:
  enterprise_influxdb_1_9:
    parent: Monitor InfluxDB
    name: Monitor with OSS
weight: 102
---

Use [InfluxDB OSS](/influxdb/v2.0/), the [InfluxDB Enterprise 1.x Template](https://github.com/influxdata/community-templates/tree/master/influxdb-enterprise-1x), and Telegraf to monitor one or more InfluxDB Enterprise instances.

Do the following:

1. [Review requirements](#review-requirements)
2. [Install the InfluxDB Enterprise Monitoring template](#install-the-influxdb-enterprise-monitoring-template)
3. [Set up InfluxDB Enterprise for monitoring](#set-up-influxdb-enterprise-for-monitoring)
4. [Set up Telegraf](#set-up-telegraf)
5. [View the Monitoring dashboard](#view-the-monitoring-dashboard)
6. (Optional) [Alert when metrics stop reporting](#alert-when-metrics-stop-reporting)
7. (Optional) [Create a notification endpoint and rule](#create-a-notification-endpoint-and-rule)
8. (Optional) [Monitor with InfluxDB Insights and Aware](#monitor-with-influxdb-insights-and-aware)

## Review requirements

Before you begin, make sure you have access to the following:

 - Self-hosted OSS 2.x instance ([get started for free here](/influxdb/v2.0/get-started/))
 - Command line access to a machine [running InfluxDB Enterprise 1.x](/enterprise_influxdb/v1.9/introduction/install-and-deploy/) and permissions to install Telegraf on this machine
 - Internet connectivity from the machine running InfluxDB Enterprise 1.x and Telegraf to InfluxDB OSS
 - Sufficient resource availability to install the template. InfluxDB Cloud Free Plan accounts include [resource limits](/influxdb/cloud/account-management/pricing-plans/#resource-limits/influxdb/cloud/account-management/pricing-plans/#resource-limits)

## Install the InfluxDB Enterprise Monitoring template

The InfluxDB Enterprise Monitoring template includes a Telegraf configuration that sends InfluxDB Enterprise metrics to an InfluxDB endpoint and a dashboard that visualizes the metrics.

1. [Log into your InfluxDB Cloud account](https://cloud2.influxdata.com/), go to **Settings > Templates**, and enter the following template URL:

    ```
     https://raw.githubusercontent.com/influxdata/community-templates/master/influxdb-enterprise-1x/enterprise.yml
    ```

2. Click **Lookup Template**, and then click **Install Template**. InfluxDB Cloud imports the template, which includes the following resources:
   - Telegraf Configuration `monitoring-enterprise-1x`
   - Dashboard `InfluxDB 1.x Enterprise`
   - Label `enterprise`
   - Variables `influxdb_host` and `bucket`

## Set up InfluxDB Enterprise for monitoring

By default, InfluxDB Enterprise 1.x has a `/metrics` endpoint available, which exports Prometheus-style system metrics.

1. Make sure the `/metrics` endpoint is [enabled](/{{< latest "influxdb" >}}/reference/config-options/#metrics-disabled). If you've changed the default settings to disable the `/metrics` endpoint, [re-enable these settings](/{{< latest "influxdb" >}}/reference/config-options/#metrics-disabled).
2. Navigate to the `/metrics` endpoint of your InfluxDB Enterprise instance to view the InfluxDB Enterprise system metrics in your browser: 

    ```
    http://localhost:8086/metrics
    ```

    Or use `curl` to fetch metrics:

      ```sh
      curl http://localhost:8086/metrics
      # HELP boltdb_reads_total Total number of boltdb reads
      # TYPE boltdb_reads_total counter
      boltdb_reads_total 41
      # HELP boltdb_writes_total Total number of boltdb writes
      # TYPE boltdb_writes_total counter
      boltdb_writes_total 28
      # HELP go_gc_duration_seconds A summary of the pause duration of garbage collection cycles.
      ...
      ```
3. Add your **InfluxDB Cloud** account information (URL and organization) to your Telegraf configuration by doing the following:
   1. Go to **Load Data > Telegraf** [in your InfluxDB Cloud account](https://cloud2.influxdata.com/), and click **InfluxDB Output Plugin** at the top-right corner.
   2. Copy the `urls`, `token`, `organization`, and `bucket` and close the window. 
   3. Click **monitoring-enterprise-1.x**. 
   4. Replace `urls`, `token`, `organization`, and `bucket` under `outputs.influxdb_v2` with your InfluxDB Cloud account information. Alternatively, store this information in your environment variables and include the environment variables in your configuration.

      {{% note %}}
To ensure the InfluxDB Enterprise monitoring dashboard can display the recorded metrics, set the destination bucket name to `enterprise_metrics` in your `telegraf.conf`.
      {{% /note %}}

   5. Add the [Prometheus input plugin](https://github.com/influxdata/telegraf/blob/release-1.19/plugins/inputs/prometheus/README.md) to your `telegraf.conf`. Specify your your InfluxDB Enterprise URL(s) in the `urls` parameter. For example:
   
    {{< keep-url >}}
     ```toml
     [[inputs.prometheus]]
       urls = ["http://localhost:8086/metrics"]
       username = "$INFLUX_USER"
       password = "$INFLUX_PASSWORD"
     ``` 
     
     If you're using unique URLs or have security set up for your `/metrics` endpoint, configure those options here and save the updated configuration.

      For more information about customizing Telegraf, see [Configure Telegraf](/{{< latest "telegraf" >}}/administration/configuration/#global-tags).
4. Click **Save Changes**.

## Set up Telegraf

Set up Telegraf to scrape metrics from InfluxDB Enterprise to send to your InfluxDB Cloud account.

On each InfluxDB Enterprise instance you want to monitor, do the following:

1. Go to **Load Data > Telegraf** [in your InfluxDB Cloud account](https://cloud2.influxdata.com/).
2. Click **Setup Instructions** under **monitoring-enterprise-1.x**. 
3. Complete the Telegraf Setup instructions. If you are using environment variables, set them up now. 

      {{% note %}}
For your API token, generate a new token or use an existing All Access token. If you run Telegraf as a service, edit your init script to set the environment variable and ensure its available to the service.
      {{% /note %}}

Telegraf runs quietly in the background (no immediate output appears), and Telegraf begins pushing metrics to your InfluxDB Cloud account.

## View the Monitoring dashboard

To see your data in real time, view the Monitoring dashboard.

1. Select **Boards** (**Dashboards**) in your **InfluxDB Cloud** account.

    {{< nav-icon "dashboards" >}}

2. Click **InfluxDB Enterprise Metrics**. Metrics appear in your dashboard.
3. Customize your monitoring dashboard as needed. For example, send an alert in the following cases:
   - Users create a new task or bucket
   - You're testing machine limits
   - [Metrics stop reporting](#alert-when-metrics-stop-reporting)

## Alert when metrics stop reporting

The Monitoring template includes a [deadman check](/influxdb/cloud/monitor-alert/checks/create/#deadman-check) to verify metrics are reported at regular intervals.

To alert when data stops flowing from InfluxDB OSS instances to your InfluxDB Cloud account, do the following:

1. [Customize the deadman check](#customize-the-deadman-check) to identify the fields you want to monitor.
2. [Create a notification endpoint and rule](#create-a-notification-endpoint-and-rule) to receive notifications when your deadman check is triggered.

### Customize the deadman check

1.  To view the deadman check, click **Alerts** in the navigation bar of your **InfluxDB Cloud** account.

    {{< nav-icon "alerts" >}}

2. Choose a InfluxDB OSS field or create a new OSS field for your deadman alert:
   1. Click **{{< icon "plus" >}} Create** and select **Deadman Check** in the dropown menu.
   2. Define your query with at least one field.
   3. Click **Submit** and **Configure Check**.
   When metrics stop reporting, you'll receive an alert.
3. Start under **Schedule Every**, set the amount of time to check for data.
4. Set the amount of time to wait before switching to a critical alert.
5. Save the Check and click on **View History** of the Check under the gear icon to verify it is running.  

## Create a notification endpoint and rule

To receive a notification message when your deadman check is triggered, create a [notification endpoint](#create-a-notification-endpoint) and [rule](#create-a-notification-rule). 

### Create a notification endpoint 

InfluxData supports different endpoints: Slack, PagerDuty, and HTTP. Slack is free for all users, while PagerDuty and HTTP are exclusive to the Usage-Based Plan. 

#### Send a notification to Slack

1. Create a [Slack Webhooks](https://api.slack.com/messaging/webhooks). 
2. Go to **Alerts > Notification Endpoint** and click **{{< icon "plus" >}} Create**, and enter a name and description for your Slack endpoint. 
3. Enter your Slack Webhook under **Incoming Webhook URL** and click **Create Notification Endpoint**. 

#### Send a notification to PagerDuty or HTTP 

Send a notification to PagerDuty or HTTP endpoints (other webhooks) by [upgrading your InfluxDB Cloud account](/influxdb/cloud/account-management/billing/#upgrade-to-usage-based-plan).

### Create a notification rule 

[Create a notification rule](/influxdb/cloud/monitor-alert/notification-rules/create/) to set rules for when to send a deadman alert message to your notification endpoint. 

1. Go to **Alerts > Notification Rules** and click **{{< icon "plus" >}} Create**. 
2. Fill out the **About** and **Conditions** section then click **Create Notification Rule**. 