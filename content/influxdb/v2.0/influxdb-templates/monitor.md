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

[InfluxDB Cloud](/influxdb/cloud/) can be leveraged to monitoring one or more InfluxDB 2.x OSS instances 
and there is a pre-built [InfluxDB template](https://github.com/influxdata/community-templates/tree/master/influxdb2_oss_metrics) 
which has been created to help.  The template includes Telegraf configuration and a Dashboard.  Start using InfluxDB Cloud at no cost with 
the Free Plan. Use it as much and as long as you like within the plan’s rate-limits. Limits are designed to let you monitor 5-10 sensors, 
stacks or servers comfortably. So monitoring a single InfluxDB OSS instance or even a modest InfluxDB Enterprise cluster should easily fit 
within the free plan limits.  Of course, if you exceed the plan-limits because you want finer grained resolution or longer data retention you can always 
upgrade to the [pay-as-you-go plan](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan).

Start monitoring your InfluxDB instance by signing up for an [InfluxDB Cloud account here](https://cloud2.influxdata.com/signup).  If you already have 
an InfluxDB Cloud account, please log into your account before continuing.

## Architecture overview
The InfluxDB template leverages a Telegraf agent that sits next to your InfluxDB instance. 
It will scrape Prometheus metrics from each instance you wish to monitor and push them to your InfluxDB Cloud account.
Don’t worry if you don’t know what [Telegraf](/telegraf/) is or how to read Prometheus metrics, it all happens for you with just a few lines of configuration. 
If you follow the instructions below, you will have something that looks like this.

{{< img-hd src="/img/influxdb/2-0-monitor-oss-with-cloud.png" />}}

## Setting up InfluxDB OSS Monitoring
By default, InfluxDB OSS has a /metrics endpoint available which exports Prometheus-style metrics. 
If you have changed any of the default settings to disable this endpoint, you will need to re-enable them for this setup to work.

If you open up http://hostname:port/metrics (http://localhost:8086/metrics by default) in your browser, you should see something like this:

{{< img-hd src="/img/influxdb/2-0-monitor-oss-with-cloud-prom.png" />}}

Here you will find tons of information about what’s happening in your InfluxDB instance, including memory usage, boltdb accesses, API requests 
and much more. As you refresh, you should see these numbers change as your open source instance is being used. This is the data that Telegraf collects
and sends to your InfluxDB Cloud account. 

## Installing the InfluxDB OSS Monitoring Template
The InfluxDB OSS Monitoring template can be found [here](https://github.com/influxdata/community-templates/tree/master/influxdb2_oss_metrics).

### Browser-based instructions
Using a browser where the first InfluxDB OSS instance is hosted, 
log in to your **InfluxDB Cloud account** and navigate to `Settings > Templates` and enter the raw URL of the template shown below

`https://raw.githubusercontent.com/influxdata/community-templates/master/influxdb2_oss_metrics/influxdb2_oss_metrics.yml`

to quickly import this into your InfluxDB Cloud account.

### CLI-based instructions
If your host does not have a browser installed, you can also complete this step using the InfluxDB CLI. 
Makes sure that you have two configuration profiles setup. Once for the local InfluxDB OSS instance and one for your InfluxDB Cloud account. You can see
the existing set of configuration profiles by executing the following command from the command line:
`influx config list`

If you haven't created configuration profiles before, please review the [InfluxDB CLI tooling documentation](influxdb/v2.0/reference/cli/influx/config/). 

Make sure the InfluxDB Cloud configuration profile is active. You can use the `influx config set -a -config-name <your_config_name>` command to 
change the active configuration profile.

Once the InfluxDB CLI is setup to access your InfluxDB Cloud account, you can apply the
InfluxDB OSS Monitoring template using the [apply command](/influxdb/v2.0/influxdb-templates/use/#apply-a-template-from-a-url/):

`influx apply -u https://raw.githubusercontent.com/influxdata/community-templates/master/influxdb2_oss_metrics/influxdb2_oss_metrics.yml`


## Downloading, installing, and configuring Telegraf
As mentioned above, Telegraf is an open source data collection agent that can be configured to fetch data from almost anywhere. 
It is plugin-based, so you can configure any number of input plugins (there are over 250) and output plugins, and Telegraf handles 
all the fetching, scraping, buffering and retrying for you. 

A Telegraf agent should be deployed to the same machine that InfluxDB OSS is running on. 
The download and installation instructions for Telegraf can be found [here](/telegraf/latest/introduction/).

Once you've downloads and installed Telegraf, you need to complete the configuration setup process.  The InfluxDB OSS Monitoring template contained the
Telegraf configuration however, you need to generate a token to grant your Telegraf instance permissions to read this configuration and 
write data into the bucket defined within the template. Once you've generated the token, there are a couple of environment variables required on
the Telegraf host to complete the configuration process.

### Generate Token

#### Browser-based instructions
Using the broswer, access your **InfluxDB Cloud account** and navigate to `Data > Telegraf` and find the Telegraf configuration called Scrape InfluxDB OSS Metrics. 
Next click the `Setup Instructions` for that configuration.

A three step set of instructions appear and you should have already completed step 1 which is downloading and installing Telegraf.
For step 2, click the `Generate New Token` button.  A new token is generated which you can now use to access this configuration and also 
provides the necessary write permissions for Telegraf to write the InfluxDB 2.x OSS metrics to the `oss_metrics` bucket.

