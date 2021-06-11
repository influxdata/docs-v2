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

[InfluxDB Cloud](/influxdb/cloud/) can be leveraged for monitoring one or more InfluxDB OSS instances 
and there is a pre-built [InfluxDB OSS Metrics template](https://github.com/influxdata/community-templates/tree/master/influxdb2_oss_metrics) 
which has been created to make the setup much easier. The template includes the Telegraf configuration described below as well as a dashboard.

The instructions below expect you to have a free InfluxDB Cloud account, which you can [sign up for here](https://cloud2.influxdata.com/signup).  
If you already have an one, please [log into your account](https://cloud2.influxdata.com/) before continuing.

## Architecture overview
Before we dive in, it's helpful to talk a little about the recommended architecture of the setup. For this tutorial, we are going to assume you have at least
one InfluxDB OSS instance running, and that you have access to the machine it's running on. We also assume you have an InfluxDB Cloud account set up
and ready to go.

All the configuration for the data collection agent ([Telegraf](https://docs.influxdata.com/telegraf/latest/) in this case) will be stored in your InfluxDB Cloud account, 
and fetched by the agent when it starts up. Any configuration options specific to the machine will be configured with environment 
variables local to that machine. At the end of all this, you will have something that resembles the imagine below.

{{< img-hd src="/img/influxdb/2-0-monitor-oss-with-cloud.png" />}}

## Requirements before you begin
As mentioned before, you will need the following to successfully complete the setup instructions below:
 - A free InfluxDB Cloud Account ([Sign up for one here](https://cloud2.influxdata.com/signup))
 - Browser-based access to this documentation and for interacting with InfluxDB Cloud
 - Command line access to a machine with an InfluxDB OSS v2.x instance running
 - Sufficient permissions to install a data collection agent on that machine
 - Internet connectivity from the machine running InfluxDB OSS and the agent to InfluxDB Cloud (for requesting the configuration and sending metrics) 

## Installing the InfluxDB OSS Monitoring Template
The first step involves loading a Telegraf agent configuration into your InfluxDB Cloud account and ensuring it is configured so that each remote 
Telegraf agent can access it. This allows the agent to configure itself to scrape the metrics from the local InfluxDB OSS instance and send them 
into your InfluxDB Cloud account.

Open up your favorite browser and [log into your InfluxDB Cloud account](https://cloud2.influxdata.com). Next, install the 
monitoring template by navigating to `Settings > Templates` and pasting the raw URL of the template shown below.

`https://raw.githubusercontent.com/influxdata/community-templates/master/influxdb2_oss_metrics/influxdb2_oss_metrics.yml`

InfluxDB Cloud will import the Template, and give you a summary of what is included. It should look something like this. You can also flip 
over to the included readme for more details.

{{< img-hd src="/img/influxdb/2-0-monitor-oss-template-installer.png" />}}

Once you click "Install Template", you should see the Template show up in the list of Installed Templates on the page. Under the "Installed 
Resources" column, you should be able to expand and click on any of the resources the Template created and instantly jump to that resource.

{{< img-hd src="/img/influxdb/2-0-monitor-oss-template-post-install.png" />}}

## Setting up InfluxDB OSS for Monitoring
By default, InfluxDB OSS v2.x has a `/metrics` endpoint available which exports Prometheus-style metrics about what's happening in the system. 
If you have changed any of the default settings to disable this endpoint, you will need to re-enable them before continuing.

You can see these metrics in your browser at http://hostname:port/metrics (http://localhost:8086/metrics by default if you are using a browser 
on the machine where InfluxDB is hosted) or fetching them via `curl`. Either way, you should see something like this:

{{< img-hd src="/img/influxdb/2-0-monitor-oss-with-cloud-prom.png" />}}

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

Here you will find tons of information about what’s happening in your InfluxDB OSS instance, including memory usage, boltdb accesses, API requests 
and much more. As you refetch the data, you should see these numbers change as your open source instance is being used. This is the data 
that [Telegraf](/telegraf/latest/), the data collection agent, will collect and send to your InfluxDB Cloud account.

Before continuing, you should ensure that you can access the `/metrics` endpoint for each of the InfluxDB OSS instances you plan to 
monitor with your InfluxDB Cloud account.

## Configuring tha Telegraf data collection agent
As mentioned before, the [Telegraf](/telegraf/latest/) agent is used to scrape the Prometheus metrics exposed by the `/metrics` endpoint 
of each InfluxDB OSS instance and send those into InfluxDB Cloud. Telegraf is configured via a TOML formatted text file. That configuration file 
can be stored centrally in your InfluxDB Cloud account and fetched when installing and starting Telegraf next to the local InfluxDB 
OSS instance. As part of installing the InfluxDB OSS Monitoring template, a pre-defined Telegraf configuration was imported into your 
InfluxDB Cloud account.

Navigate to the Telegraf configuration page in your Cloud account by either clicking on the "Installed Resource" link on the Templates page or by 
navigating to `Load Data > Telegraf`. Here, you should see the Telegraf configuration provided by the InfluxDB Template, 
and by clicking on the name of the configuration ("Scrape InfluxDB OSS Metrics"), you can view and edit it.

{{< img-hd src="/img/influxdb/2-0-monitor-oss-telegraf-config.png" />}}

### Edit the Telegraf configuration file
Looking through the Telegraf Configuration file, there are a few different sections that are useful to understand. At the top of the file, 
we have sections for `[global_tags]` and `[agent]`. These sections define the behavior of Telegraf and contain useful settings to control the 
frequency of data collection and many other options. For more information about customizing your Telegraf agent, see the 
full [Telegraf Configuration documentation](/telegraf/latest/administration/configuration/#global-tags).

Next, you will see a section for `[[outputs.influxdb_v2]]`. This contains the information that allows Telegraf to send metrics to your InfluxDB 
Cloud account. There are four configuration parameters listed: URLs, token, organization, and bucket. Most of the parameters here, except 
for bucket, are using environment variables, since this InfluxDB Template is designed to work for everyone.

To simplify the Telegraf agent setup on each machine, you can replace the configuration parameters for your specifc 
InfluxDB Cloud account here. To get that information, exit the Telegraf configuration window and click on 
the `InfluxDB Output Plugin` button on the Telegraf page. This will generate the correct configuration for sending data to your Account.

{{< img-hd src="/img/influxdb/2-0-monitor-oss-load-data.png" />}}
{{< img-hd src="/img/influxdb/2-0-monitor-oss-telegraf-output-example.png" />}}

You'll want to copy the URLs and the organization parameters. Once you've copied those values, close this modal 
and click on the Scape InfluxDB OSS Metrics configuration again. Now, replace the values within the Telegraf configuration 
file for URLs and organization with the appropriate values for your InfluxDB Cloud account that you copied from within the InfluxDB 
Output Plugin panel.

{{% note %}}
You should use the provided parameter value, `oss_metrics`, for the bucket in order to maintain compatibility with the included dasboard 
in the template. Best practices dictate using an environment variable for the API Token rather than embeddeding this value within the 
Telegraf configuration itself.  The API Token required for Telegraf to fetch the configuration and write data to your instance. 
That API Token should be treated just like a password. Set it as an environment variable on each machine you plan to gather metrics 
from using Telegraf.{{% /note %}}

After the InfluxDB Output Plugin options within the Telegraf configuration, there is a section for Input Plugins, specifically `[[inputs.prometheus]]`. 
This is the configuration that tells Telegraf how to scrape metrics from the `/metrics` endpoint of each InfluxDB OSS instance. The default URL 
for InfluxDB OSS is provided here, but if you're using unique URLs or have security set up for your `/metrics` endpoint, you can configure those options 
here and save the updated configuration.

Now we should be all set for installing and configuring Telegraf on each machine right next to our InfluxDB OSS instances. 

## Downloading, installing, and configuring Telegraf
As mentioned above, Telegraf is an open source data collection agent that can be configured to fetch data from almost anywhere. 
It is plugin-based, so you can configure any number of input plugins (there are over 250) and output plugins, and Telegraf handles 
all the fetching, scraping, buffering and retrying for you. 

A Telegraf agent should be deployed to the same machine that InfluxDB OSS is running on. 
See the [download and installation instructions for Telegraf](/telegraf/latest/introduction/) for a full walkthrough of getting it set up on your machine.

You can confirm the Telegraf agent is installed correctly by running the following command on the machine.

```sh
> telegraf --version
Telegraf 1.18.3
```

Now that Telegraf is installed, we can configure it using the setup instructions available in your InfluxDB Cloud account. Back on the Telegraf page 
in your InfluxDB Cloud account, you should see a link for `Setup Instructions` for the "Scrape InfluxDB OSS Metrics" Telegraf configuration. 
Clicking that link opens the instructions needed to start Telegraf and have it remotely fetch the Telegraf configuration from your InfluxDB Cloud account.

{{< img-hd src="/img/influxdb/2-0-monitor-oss-telegraf-setup.png" />}}

In Step 2, it will walk you through setting up an environment variable for your API Token. If you have an All Access Token already, feel free to use that 
here, otherwise, you can Generate a New Token with the correct permissions for fetching the Telegraf configuration and writing to the `oss_metrics` bucket. 
That environment variable will need to be set wherever you are running Telegraf, presumably on the same machine running your InfluxDB OSS instance. 
If you are running Telegraf as a service, ensure this environment variable is set and available to that service by editing your init script.

Once you have set your API Token, you are ready to start Telegraf using the command provided in Step 3.  This provides Telegraf with the unique URL 
for the Telegraf Configuration file hosted on within your InfluxDB Cloud account. If all goes well, you won't see any output from Telegraf, since it's 
designed to run quietly in the background.

These setup steps need to be performed for each InfluxDB OSS instance you wish to monitor.

## Viewing the Monitoring Dashboard
Once you have your Telegraf agents set up and successfully pushing metrics to your InfluxDB Cloud account, you should be ready to view those meterics 
on the dashboard that was installed via the InfluxDB Template from earlier. In your InfluxDB Cloud account, navigate to the `Boards` area of the app and 
click on the `InfluxDB OSS Metrics` dashboard. If metrics are flowing properly, you should see soemthing like this.

{{< img-hd src="/img/influxdb/2-0-monitor-oss-dashboard.png" />}}

## Adding Alerting for when Metrics Stop Reporting
Viewing the dashboard is helpful for seeing data in real time, but to ensure data is always flowing from your InfluxDB OSS instances into your InfluxDB Cloud 
account, it is useful to set up a [Deadman alert](/influxdb/cloud/monitor-alert/checks/create/#deadman-check) to ensure you are notified if there is an issue.

For your conviencence, a Deadman check is also included in the InfluxDB Template you installed earlier. You can view it by navigating to the `Alerts` 
section of your InfluxDB Cloud account. The Monitoring and Alerting system in InfluxDB Cloud is very powerful. For a full explination of how it works, 
see this [Checks and Notifications System](https://www.influxdata.com/blog/influxdbs-checks-and-notifications-system/) post.

{{< img-hd src="/img/influxdb/2-0-monitor-oss-deadman.png" />}}

You'll probably notice that the Deadman check has been running in the background from the time you installed the Template. In order to be notified when 
something is down, you will need to configure a Notification Rule as well as an endpoint. You can 
leverage [Slack Webhooks](https://api.slack.com/messaging/webhooks) to quickly send messages to any Slack channel you look at, or you can 
upgrade your InfluxDB Cloud account to get access to Pagerduty and HTTP post endpoints. See the documentation or more information 
about [configuring a Slack endpoint](/influxdb/cloud/monitor-alert/notification-endpoints/create/). 

Finally, the Slack Endpoint can be used to create a [Notification Rule](/influxdb/cloud/monitor-alert/notification-rules/create/) to send you a 
message whenever there is an outage. Check out the documentation for [creating Notification rules in the UI](/influxdb/cloud/monitor-alert/notification-rules/create/).

## Conclusion
We have walked through the process to set up and configure a Telegraf instance to scrape metrics from your InfluxDB OSS instances into your 
InfluxDB Cloud account. From here, you can customize the dashboard as you need to monitor additional important metrics and also add more alerting to 
let you know when users create new tasks or buckets, or when machine limits are being tested.
