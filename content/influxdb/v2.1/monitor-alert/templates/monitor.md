---
title: Monitor InfluxDB OSS using a template
description: >
  Monitor your InfluxDB OSS instance using InfluxDB Cloud and
  a pre-built InfluxDB template.
menu:
  influxdb_2_1:
    parent: Monitor with templates
    name: Monitor InfluxDB OSS
weight: 102
influxdb/v2.1/tags: [templates, monitor]
aliases:
  - /influxdb/v2.1/influxdb-templates/monitor/
related:
  - /influxdb/v2.1/reference/cli/influx/apply/
  - /influxdb/v2.1/reference/cli/influx/template/
---

Use [InfluxDB Cloud](/influxdb/cloud/), the [InfluxDB Open Source (OSS) Metrics template](https://github.com/influxdata/community-templates/tree/master/influxdb2_oss_metrics),
and [Telegraf](/{{< latest "telegraf" >}}/) to monitor one or more InfluxDB OSS instances.

Do the following:

1. [Review requirements](#review-requirements)
2. [Install the InfluxDB OSS Monitoring template](#install-the-influxdb-oss-monitoring-template)
3. [Set up InfluxDB OSS for monitoring](#set-up-influxdb-oss-for-monitoring)
4. [Set up Telegraf](#set-up-telegraf)
5. [View the Monitoring dashboard](#view-the-monitoring-dashboard)
6. (Optional) [Alert when metrics stop reporting](#alert-when-metrics-stop-reporting)
7. (Optional) [Create a notification endpoint and rule](#create-a-notification-endpoint-and-rule)

## Review requirements

Before you begin, make sure you have access to the following:

- InfluxDB Cloud account ([sign up for free here](https://cloud2.influxdata.com/signup))
- Command line access to a machine [running InfluxDB OSS 2.x](/influxdb/v2.1/install/) and permissions to install Telegraf on this machine
- Internet connectivity from the machine running InfluxDB OSS 2.x and Telegraf to InfluxDB Cloud
- Sufficient resource availability to install the template (InfluxDB Cloud Free
  Plan accounts include [resource limits](/influxdb/cloud/account-management/pricing-plans/#resource-limits/influxdb/cloud/account-management/pricing-plans/#resource-limits))

## Install the InfluxDB OSS Monitoring template

The InfluxDB OSS Monitoring template includes a Telegraf configuration that sends
InfluxDB OSS metrics to an InfluxDB endpoint and a dashboard that visualizes the metrics.

1.  [Log into your InfluxDB Cloud account](https://cloud2.influxdata.com/).
2.  Go to **Settings > Templates** in the navigation bar on the left

    {{< nav-icon "Settings" >}}

3.  Under **Paste the URL of the Template's resource manifest file**, enter the
    following template URL:

    ```
    https://raw.githubusercontent.com/influxdata/community-templates/master/influxdb2_oss_metrics/influxdb2_oss_metrics.yml
    ```

4.  Click **{{< caps >}}Lookup Template{{< /caps >}}**, and then click **{{< caps >}}Install Template{{< /caps >}}**.
    InfluxDB Cloud imports the template, which includes the following resources:

    - Dashboard `InfluxDB OSS Metrics`
    - Telegraf configuration `scrape-influxdb-oss-telegraf`
    - Bucket `oss_metrics`
    - Check `InfluxDB OSS Deadman`
    - Labels `influxdb2` and `prometheus`

## Set up InfluxDB OSS for monitoring

By default, InfluxDB OSS 2.x has a `/metrics` endpoint available, which exports 
internal InfluxDB metrics in [Prometheus format](https://prometheus.io/docs/concepts/data_model/).

1. Ensure the `/metrics` endpoint is [enabled](/{{< latest "influxdb" >}}/reference/config-options/#metrics-disabled).
   If you've changed the default settings to disable the `/metrics` endpoint,
   [re-enable these settings](/{{< latest "influxdb" >}}/reference/config-options/#metrics-disabled).
2. Navigate to the `/metrics` endpoint of your InfluxDB OSS instance to view the InfluxDB OSS system metrics in your browser: 

## Set up Telegraf

Set up Telegraf to scrape metrics from InfluxDB OSS to send to your InfluxDB Cloud account.

On each InfluxDB OSS instance you want to monitor, do the following:

1. [Install Telegraf](/{{< latest "telegraf" >}}/introduction/installation/).
2. Set the following environment variables in your Telegraf environment:
    
    - `INFLUX_URL`: Your [InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/)
    - `INFLUX_ORG`: Your InfluxDB Cloud organization name

1. [In the InfluxDB Cloud UI](https://cloud2.influxdata.com/), go to **Load Data > Telegraf** in the left navigation.

    {{< nav-icon "load-data" >}}

2. Click **Setup Instructions** under **Scrape InfluxDB OSS Metrics**. 
3. Complete the Telegraf Setup instructions to start Telegraf using the Scrape InfluxDB OSS Metrics
   Telegraf configuration stored in InfluxDB Cloud.

      {{% note %}}
For your API token, generate a new token or use an existing All Access token. If you run Telegraf as a service, edit your init script to set the environment variable and ensure its available to the service.
      {{% /note %}}

Telegraf runs quietly in the background (no immediate output appears), and begins
pushing metrics to the `oss_metrics` bucket in your InfluxDB Cloud account.

## View the Monitoring dashboard

To see your data in real time, view the Monitoring dashboard.

1. Select **Dashboards** in your **InfluxDB Cloud** account.

    {{< nav-icon "dashboards" >}}

2. Click **InfluxDB OSS Metrics**. Metrics appear in your dashboard.
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
    1.  Click **{{< caps >}}{{< icon "plus" >}} Create{{< /caps >}}** and select **Deadman Check** in the dropdown menu.
    2.  Define your query with at least one field.
    3.  Click **{{< caps >}}Submit{{< /caps >}}** and **{{< caps >}}Configure Check{{< /caps >}}**.
        When metrics stop reporting, you'll receive an alert.
3. Start under **Schedule Every**, set the amount of time to check for data.
4. Set the amount of time to wait before switching to a critical alert.
5. Click **{{< icon "check" >}}** to save the check.

## Create a notification endpoint and rule

To receive a notification message when your deadman check is triggered, create a [notification endpoint](#create-a-notification-endpoint) and [rule](#create-a-notification-rule). 

### Create a notification endpoint 

InfluxData supports different endpoints: Slack, PagerDuty, and HTTP. Slack is free for all users, while PagerDuty and HTTP are exclusive to the Usage-Based Plan. 

#### Send a notification to Slack

1.  Create a [Slack Webhooks](https://api.slack.com/messaging/webhooks). 
2.  Go to **Alerts > Alerts** in the left navigation menu and then click **{{< caps >}}Notification Endpoints{{< /caps >}}**.

    {{< nav-icon "alerts" >}}

4.  Click **{{< caps >}}{{< icon "plus" >}} Create{{< /caps >}}**, and enter a name and description for your Slack endpoint. 
3.  Enter your Slack Webhook under **Incoming Webhook URL** and click **{{< caps >}}Create Notification Endpoint{{< /caps >}}**. 

#### Send a notification to PagerDuty or HTTP 

Send a notification to PagerDuty or HTTP endpoints (other webhooks) by [upgrading your InfluxDB Cloud account](/influxdb/cloud/account-management/billing/#upgrade-to-usage-based-plan).

### Create a notification rule 

[Create a notification rule](/influxdb/cloud/monitor-alert/notification-rules/create/) to set rules for when to send a deadman alert message to your notification endpoint. 

1.  Go to **Alerts > Alerts** in the left navigation menu and then click **{{< caps >}}Notification Rules{{< /caps >}}**.

    {{< nav-icon "alerts" >}}

4.  Click **{{< caps >}}{{< icon "plus" >}} Create{{< /caps >}}**, and then provide
    the required information. 
3.  Click **{{< caps >}}Create Notification Rule{{< /caps >}}**. 
