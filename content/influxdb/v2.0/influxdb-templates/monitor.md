---
title: Monitor InfluxDB OSS using a template
description: >
  Monitor your InfluxDB OSS instance using InfluxDB Cloud and
  a pre-built InfluxDB template.
menu:
  influxdb_2_0:
    parent: InfluxDB templates
    name: Monitor InfluxDB OSS
weight: 102
influxdb/v2.0/tags: [templates, monitor]
related:
  - /influxdb/v2.0/reference/cli/influx/apply/
  - /influxdb/v2.0/reference/cli/influx/template/
---

Use [InfluxDB Cloud](/influxdb/cloud/) and the [InfluxDB Open Source (OSS) Metrics template](https://github.com/influxdata/community-templates/tree/master/influxdb2_oss_metrics) to monitor one or more InfluxDB OSS instances. Do the following:

1. [Review requirements](#review-requirements)
2. [Install the InfluxDB OSS Monitoring template](#install-the-influxdb-oss-monitoring-template)
3. [Set up InfluxDB OSS for monitoring](#set-up-influxdb-oss-for-monitoring)
4. [Download, install, and configure Telegraf](#download-install-and-configure-telegraf)
5. [View the Monitoring dashboard](#view-the-monitoring-dashboard)
6. (Optional) [Alert when metrics stop reporting](#alert-when-metrics-stop-reporting)

## Review requirements

Before you begin, make sure you have access to the following:

 - Browser access to an InfluxDB Cloud account ([sign up for free here](https://cloud2.influxdata.com/signup))
 - Command line access to a machine running InfluxDB OSS 2.x and permissions to install a data collection agent on this machine
 - Internet connectivity from the machine running InfluxDB OSS and the agent to InfluxDB Cloud (for requesting the configuration and sending metrics)
 - Sufficient resource availability to install the template. InfluxDB Cloud Free Plan accounts include [resource limits](/influxdb/cloud/account-management/pricing-plans/#resource-limits/influxdb/cloud/account-management/pricing-plans/#resource-limits).

## Install the InfluxDB OSS Monitoring template

The InfluxDB OSS Monitoring template includes a Telegraf configuration and a dashboard, making it easy to set up and monitor OSS.

1. [Log into your InfluxDB Cloud account](https://cloud2.influxdata.com/), go to **Settings > Templates**, and enter the following template URL:

    `https://raw.githubusercontent.com/influxdata/community-templates/master/influxdb2_oss_metrics/influxdb2_oss_metrics.yml`

2. Click **Lookup Template**, and then click **Install Template**. InfluxDB Cloud imports the template, which includes the following resources:
   - Dashboard `InfluxDB OSS Metrics`
   - Telegraf configuration `scrape-infludb-oss-telegraf`
   - Bucket `oss_metrics`
   - Check `InfluxDB OSS Deadman`
   - Labels `influxdb2` and `prometheus`

## Set up InfluxDB OSS for monitoring

By default, InfluxDB OSS 2.x has a `/metrics` endpoint available, which exports Prometheus-style system metrics.

1. If you've changed the default settings to disable the `/metrics` endpoint, re-enable these settings.
2. To view InfluxDB OSS system metrics in your browser, go to **http://hostname:port/metrics** (by default, the hostname and port is **http://localhost:8086/metrics** if you're on the machine where InfluxDB is hosted).
    {{< img-hd src="/img/influxdb/2-0-monitor-oss-with-cloud-prom.png" />}}
   Alternatively, use `curl`to fetch metrics:
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
3. Verify you have access to the `/metrics` endpoint for each monitored InfluxDB OSS instance so [Telegraf](/telegraf/latest/) can collect metrics.

1. To simplify the Telegraf agent setup on each machine, replace the configuration parameters for your specific InfluxDB Cloud account here.
[In your InfluxDB Cloud account](https://cloud2.influxdata.com/), go to **Load Data > Telegraf**, and then click the **InfluxDB Output Plugin** button.
2. Copy the URLs and the organization parameters, close the window, and then click the **Scrape InfluxDB OSS Metrics** link.
      {{< img-hd src="/img/influxdb/2-0-monitor-oss-telegraf-output-example.png" />}}
3. Under `outputs.influxdb_v2`, replace the URLs and organization with your InfluxDB Cloud account information.

**Scrape InfluxDB OSS Metrics** to view and edit the Telegraf configuration.


 contains the information that allows Telegraf to send metrics to your InfluxDB Cloud account. There are four configuration parameters listed: URLs, token, organization, and bucket. Most of the parameters except for bucket use environment variables.


{{% note %}}
Use the provided parameter value, `oss_metrics`, for the bucket to maintain compatibility with the included dashboard in the template. Best practices dictate using an environment variable for the API Token rather than embedding this value within the Telegraf configuration itself. The API token required for Telegraf to fetch the configuration and write data to your instance. That API Token should be treated just like a password. Set it as an environment variable on each machine you plan to gather metrics from using Telegraf.{{% /note %}}

After the InfluxDB Output Plugin options within the Telegraf configuration, there is a section for Input Plugins, specifically `[[inputs.prometheus]]`. This is the configuration that tells Telegraf how to scrape metrics from the `/metrics` endpoint of each InfluxDB OSS instance. The default URL for InfluxDB OSS is provided here, but if you're using unique URLs or have security set up for your `/metrics` endpoint, you can configure those options here and save the updated configuration.

For more information about customizing Telegraf, see [Telegraf configuration documentation](/telegraf/latest/administration/configuration/#global-tags).

## Download, install, and configure Telegraf

Install and configure Telegraf to scrape metrics from each InfluxDB OSS instance to your InfluxDB Cloud account.

Telegraf is plugin-based, so you can configure any number of input plugins (there are over 250) and output plugins, and Telegraf handles all the fetching, scraping, buffering and retrying for you.

1. On each machine that InfluxDB OSS is running on, [deploy Telegraf](/telegraf/latest/introduction/).

2. Confirm Telegraf is installed correctly by running the following command:

  ```sh
  > telegraf --version
  Telegraf 1.18.3
  ```

3. Configure Telegraf using the setup instructions available in your InfluxDB Cloud account. Back on the Telegraf page in your InfluxDB Cloud account, you should see a link for `Setup Instructions` for the "Scrape InfluxDB OSS Metrics" Telegraf configuration.
Click that link opens the instructions needed to start Telegraf and have it remotely fetch the Telegraf configuration from your InfluxDB Cloud account.

{{< img-hd src="/img/influxdb/2-0-monitor-oss-telegraf-setup.png" />}}

In Step 2, it will walk you through setting up an environment variable for your API Token. If you have an All Access Token already, feel free to use that 
here, otherwise, you can Generate a New Token with the correct permissions for fetching the Telegraf configuration and writing to the `oss_metrics` bucket. 
That environment variable will need to be set wherever you are running Telegraf, presumably on the same machine running your InfluxDB OSS instance. 
If you are running Telegraf as a service, ensure this environment variable is set and available to that service by editing your init script.

Once you have set your API Token, you are ready to start Telegraf using the command provided in Step 3.  This provides Telegraf with the unique URL 
for the Telegraf Configuration file hosted on within your InfluxDB Cloud account. If all goes well, you won't see any output from Telegraf, since it's 
designed to run quietly in the background.

These setup steps need to be performed for each InfluxDB OSS instance you wish to monitor.

## View the Monitoring dashboard

Once you have your Telegraf agents set up and successfully pushing metrics to your InfluxDB Cloud account, you should be ready to view those metrics
on the dashboard. Viewing the dashboard is helpful for seeing data in real time. In your InfluxDB Cloud account, navigate to the `Boards` area of the app, and then click the `InfluxDB OSS Metrics` dashboard. If metrics are flowing properly, you should see something like this.

{{< img-hd src="/img/influxdb/2-0-monitor-oss-dashboard.png" />}}

Customize your monitoring dashboard as needed. Add new metrics to monitor and alert on, for example when a user creates a new task or bucket, or when machine limits are being tested.

## Alert when metrics stop reporting

To ensure data is always flowing from your InfluxDB OSS instances into your InfluxDB Cloud account, create an alert.

1. The Monitoring template includes a [deadman check](/influxdb/cloud/monitor-alert/checks/create/#deadman-check); to view it by navigating to the `Alerts` section of your InfluxDB Cloud account.

{{< img-hd src="/img/influxdb/2-0-monitor-oss-deadman.png" />}}

The deadman check has been running in the background from the time you installed the template. To alert when something is down, configure a notification rule and endpoint. Use [Slack Webhooks](https://api.slack.com/messaging/webhooks) to quickly send messages to any Slack channel you look at, or upgrade your InfluxDB Cloud account to get access to Pagerduty and HTTP post endpoints. For more information, see how to [configure a Slack endpoint](/influxdb/cloud/monitor-alert/notification-endpoints/create/).

Finally, the Slack Endpoint can be used to create a [Notification Rule](/influxdb/cloud/monitor-alert/notification-rules/create/) to send you a 
message whenever there is an outage. Check out the documentation for [creating Notification rules in the UI](/influxdb/cloud/monitor-alert/notification-rules/create/).
