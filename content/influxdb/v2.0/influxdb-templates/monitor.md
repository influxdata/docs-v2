---
title: Monitor InfluxDB OSS using a template
description: >
  Monitor your InfluxDB OSS instance using InfluxDB Cloud and
  a pre-built InfluxDB template.
menu:
  influxdb_2_0:
    parent: Monitor with templates
    name: Monitor InfluxDB OSS
weight: 102
influxdb/v2.0/tags: [templates, monitor]
related:
  - /influxdb/v2.0/reference/cli/influx/apply/
  - /influxdb/v2.0/reference/cli/influx/template/
---

Use [InfluxDB Cloud](/influxdb/cloud/), the [InfluxDB Open Source (OSS) Metrics template](https://github.com/influxdata/community-templates/tree/master/influxdb2_oss_metrics), and Telegraf to monitor one or more InfluxDB OSS instances.

Do the following:

1. [Review requirements](#review-requirements)
2. [Install the InfluxDB OSS Monitoring template](#install-the-influxdb-oss-monitoring-template)
3. [Set up InfluxDB OSS for monitoring](#set-up-influxdb-oss-for-monitoring)
4. [Set up Telegraf](#set-up-telegraf)
5. [View the Monitoring dashboard](#view-the-monitoring-dashboard)
6. (Optional) [Alert when metrics stop reporting](#alert-when-metrics-stop-reporting)
7. (Optional) [Create a notification rule and endpoint](#create-a-notification-rule-and-endpoint)

## Review requirements

Before you begin, make sure you have access to the following:

 - InfluxDB Cloud account ([sign up for free here](https://cloud2.influxdata.com/signup))
 - Command line access to a machine [running InfluxDB OSS 2.x](/influxdb/v2.0/install/) and permissions to install Telegraf on this machine
 - Internet connectivity from the machine running InfluxDB OSS 2.x and Telegraf to InfluxDB Cloud
 - Sufficient resource availability to install the template. InfluxDB Cloud Free Plan accounts include [resource limits](/influxdb/cloud/account-management/pricing-plans/#resource-limits/influxdb/cloud/account-management/pricing-plans/#resource-limits)

## Install the InfluxDB OSS Monitoring template

The InfluxDB OSS Monitoring template includes a Telegraf configuration that sends InfluxDB OSS metrics to an InfluxDB endpoint and a dashboard that visualizes the metrics.

1. [Log into your InfluxDB Cloud account](https://cloud2.influxdata.com/), go to **Settings > Templates**, and enter the following template URL:

    ```
    https://raw.githubusercontent.com/influxdata/community-templates/master/influxdb2_oss_metrics/influxdb2_oss_metrics.yml
    ```

2. Click **Lookup Template**, and then click **Install Template**. InfluxDB Cloud imports the template, which includes the following resources:
   - Dashboard `InfluxDB OSS Metrics`
   - Telegraf configuration `scrape-influxdb-oss-telegraf`
   - Bucket `oss_metrics`
   - Check `InfluxDB OSS Deadman`
   - Labels `influxdb2` and `prometheus`

## Set up InfluxDB OSS for monitoring

By default, InfluxDB OSS 2.x has a `/metrics` endpoint available, which exports Prometheus-style system metrics.

1. Make sure the `/metrics` endpoint is [enabled](/{{< latest "influxdb" >}}/reference/config-options/#metrics-disabled). If you've changed the default settings to disable the `/metrics` endpoint, [re-enable these settings](/{{< latest "influxdb" >}}/reference/config-options/#metrics-disabled).
2. Navigate to the `/metrics` endpoint of your InfluxDB OSS instance to view the InfluxDB OSS system metrics in your browser: 

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
3. Verify the [Telegraf](/{{< latest "telegraf" >}}/) agent has network access to the `/metrics` endpoint for each monitored InfluxDB OSS instance.

4. Add your **InfluxDB Cloud** account information (URL and organization) to your Telegraf configuration by doing the following:
   1. Go to **Load Data > Telegraf** [in your InfluxDB Cloud account](https://cloud2.influxdata.com/), and click **InfluxDB Output Plugin**.
   2. Copy the URL, token, organization, and bucket, close the window, and then click **Scrape InfluxDB OSS Metrics**.
   3. Replace `URL`, `token', `organization`, and `bucket` under `outputs.influxdb_v2` with your InfluxDB Cloud account information. Alternatively, store this information in your environment variables and include the environment variables in your configuration.

      {{% note %}}
To ensure the InfluxDB OSS monitoring dashboard can display the recorded metrics, set the destination bucket name to `oss_metrics` in your `telegraf.conf`.
      {{% /note %}}

   4. Add the [Prometheus input plugin](https://github.com/influxdata/telegraf/blob/release-1.19/plugins/inputs/prometheus/README.md) to your `telegraf.conf`. Specify your your InfluxDB OSS URL(s) in the `urls` parameter. For example:
   
    {{< keep-url >}}
     ```toml
     [[inputs.prometheus]]
       urls = ["http://localhost:8086/metrics"]
     ``` 
     
     If you're using unique URLs or have security set up for your `/metrics` endpoint, configure those options here and save the updated configuration.

      For more information about customizing Telegraf, see [Configure Telegraf](/{{< latest "telegraf" >}}/administration/configuration/#global-tags).
5. Click **Save Changes**.

## Set up Telegraf

Set up Telegraf to scrape metrics from InfluxDB OSS to send to your InfluxDB Cloud account.

On each InfluxDB OSS instance you want to monitor, do the following:

1. Go to **Load Data > Telegraf** [in your InfluxDB Cloud account](https://cloud2.influxdata.com/).
2. Click **Setup Instructions** under **Scrape InfluxDB OSS Metrics**. 
3. Complete the Telegraf Setup instructions.

      {{% note %}}
For your API token, generate a new token or use an existing All Access token. If you run Telegraf as a service, edit your init script to set the environment variable and ensure its available to the service.
      {{% /note %}}

Telegraf runs quietly in the background (no immediate output appears), and Telegraf begins pushing metrics to your InfluxDB Cloud account.

## View the Monitoring dashboard

To see your data in real time, view the Monitoring dashboard.

1. Select **Boards** (**Dashboards**) in your **InfluxDB Cloud** account.

    {{< nav-icon "dashboards" >}}

2. Click **InfluxDB OSS Metrics**. Metrics appear in your dashboard.

Customize your monitoring dashboard as needed. For example, send an alert in the following cases:
- Users create a new task or bucket
- You're testing machine limits
- [Metrics stop reporting](#alert-when-metrics-stop-reporting)

## Alert when metrics stop reporting

The Monitoring template includes a [deadman check](/influxdb/cloud/monitor-alert/checks/create/#deadman-check) to verify metrics are reported at regular intervals.

To alert when data stops flowing from InfluxDB OSS instances to your InfluxDB Cloud account, do the following:

1. [Customize the deadman check](#customize-the-deadman-check) to identify the fields you want to monitor.
2. [Create a notification rule and endpoint](#create-a-notification-rule-and-endpoint) to receive notifications when your deadman check is triggered.

### Customize the deadman check

1.  To view the deadman check, click **Alerts** in the navigation bar of your **InfluxDB Cloud** account.

    {{< nav-icon "alerts" >}}

      {{< img-hd src="/img/influxdb/2-0-monitor-oss-deadman.png" />}}
2. Choose a InfluxDB OSS field or create a new OSS field for your deadman alert:
   1. Click **Create** and select **Deadman Check** in the dropown menu.
   2. Define your query with at least one field.
   3. Click **Submit** and **Configure Check**.
   When metrics stop reporting, you'll receive an alert.
3. Start under **Schedule Every**, set the amount of time to check for data.
4. Set the amount of time to wait before switching to a critical alert.
5. Save the Check and click on **View History** of the Check under the gear icon to verify it is running.  

## Create a notification rule and endpoint

To receive a notification message when your deadman check is triggered, create a notification rule and endpoint.

1. Do one of the following:
   - Send a notification to Slack:
     1. Create a [Slack Webhooks](https://api.slack.com/messaging/webhooks). 
     2. Go to **Alerts > Notification Endpoint** and click **Create**, and enter a name and description for your Slack endpoint. 
     3. Enter your Slack Webhook under **Incoming Webhook URL** and click **Edit Notification Endpoint**. 
   - Send a notification to PagerDuty or HTTP endpoints (other webhooks) by [upgrading your InfluxDB Cloud account](/influxdb/cloud/account-management/billing/#upgrade-to-usage-based-plan).
2. Go to **Alerts > Notification Rules** and [Create a notification rule](/influxdb/cloud/monitor-alert/notification-rules/create/) to set rules for when to send a deadman alert message to your notification endpoint. 
3. Fill out the **About** and **Conditions** section then click **Create Notification Rule**. 
