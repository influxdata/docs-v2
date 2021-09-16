---
title: Monitor InfluxDB Enterprise 
description: Troubleshoot and monitor InfluxDB Enterprise.
aliases:
    - /enterprise_influxdb/v1.9/administration/statistics/
    - /enterprise_influxdb/v1.9/troubleshooting/statistics/
    - /enterprise_influxdb/v1.9/administration/server-monitoring/
menu:
  enterprise_influxdb_1_9:
    name: Monitor Enterprise
    weight: 80
    parent: Monitor InfluxDB
---

Monitoring is the act of proactively observing changes in data over time. There are multiple ways to monitor InfluxDB Enterprise. 

If you want to monitor an Enterprise cluster, do one of the following: 

* [Monitor Enterprise with Cloud](#monitor-enterprise-with-cloud)
* [Monitor Enterprise with OSS](#monitor-enterpprise-with-oss)
* [Monitor Enterprise with internal monitoring](#monitor-enterprise-with-internal-monitoring)
* [Monitor with Insights and Aware](#monitor-with-insights-and-aware)

If you don't want to monitor your data, but view your output data occasionally, do one of the following: 

* [SHOW STATS](#show-stats)
* [SHOW DIAGNOSTICS](#show-diagnostics)
* [Useful performance metric commands]

## Monitor Enterprise

Monitor Enterprise proactively before issues occur with the following platforms. 

### Monitor Enterprise with Cloud 

To monitor Enterprise with Cloud, see [here](/enterprise_influxdb/v1.9/administration/monitor-enterprise/monitor-with-cloud/). 

### Monitor Enterprise with OSS

To monitor Enterprise with Cloud, see [here](/enterprise_influxdb/v1.9/administration/monitor-enterprise/monitor-with-oss/). 

### Monitor Enterprise with internal monitoring 

Enterprise data nodes can monitor by themselves. Learn more about monitoring internally through dashboards [here](/platform/monitoring/influxdata-platform/monitoring-dashboards/). 

{{% note %}}
Monitoring Enterprise through `_internal` is an option, but not recommended since no system should monitor itself. 
{{% /note %}}

1. Make sure your Chronograf is installed and connected to an InfluxDB Enterprise cluster.
2. Do one of the following: 
- [Use prebuilt monitoring dashboards](#use-prebuilt-monitoring-dashboards)
- [Import monitoring dashboards](#import-monitoring-dashboards)

#### Use prebuilt monitoring dashboards 

Chronograf provides prebuilt monitoring dashboards. To use the prebuilt dashboards, do the following:

1. Open Chronograf and click **Host List** in the left-side navigation bar. 
2. Click the monitoring dashboard link in the **Apps** column. The newly imported dashboard will appear in your list of dashboards.

#### Import monitoring dashboards 

To use the InfluxDB Enterprise Monitor dashboard to monitor InfluxDB Enterprise in Chronograf, do the following: 

1. Download the InfluxDB Enterprise Monitor dashboard. 
<a class="btn download" href="/downloads/influxdb-enterprise-monitor-dashboard.json" download target="\_blank">Download InfluxDB Enterprise Monitor dashboard</a>

2. Import the dashboard to Chronograf. 
{{% note %}}
A user must have an Admin or Editor role to import a dashboard. 
{{% /note %}}
    1. Click **Import Dashboard** in the Dashboards page in Chronograf. 
    2. Drag, or drop, or select the JSON export file to import. 
    3. Click **Upload Dashboard**. The newly imported dashboard will appear in your list of dashboards.

### Monitor with Aware and Insights 

To monitor InfluxDB Enterprise by yourself, use Aware. In Aware, Telegraf runs on enterprise nodes and sends information to Cloud, where the user can see their metrics.

To have the support team monitor your InfluxDB Enterprise, use Insights. Telegraf runs enterprise nodes to send information to the Support team who monitors and alerts customers as needed.

To monitor with Aware and Insights, do the following: 

1. Contact [the support team](support@influxdata.com). 
2. Set up a free Cloud 2 account with your email address once you are in contact with the support team. 
{{% note %}}
A group account on your side is preferred because the token the team creates will be owned by that account. If you remove the account (even if others persist) the token will be destroyed.
{{% /note %}}
3. Create a telegraf bucket and a **Write Token** for the telegraf bucket.
4. Work with the support team via a zoom to ensure that the data is being written to your Cloud 2 account. 

## View data at one time

InfluxDB can display statistical and diagnostic information about each node which is used for troubleshooting and performance monitoring. 

To view your data occasionally, with the following nodes:

### SHOW STATS 

For details on this command, see [`SHOW STATS`](/enterprise_influxdb/v1.9/query_language/spec#show-stats) in the InfluxQL specification.

Execute the command `SHOW STATS` in your terminal to see node statistics. 

### SHOW DIAGNOSTICS 

For details on this command, see [`SHOW DIAGNOSTICS`](/enterprise_influxdb/v1.9/query_language/spec#show-diagnostics) in the InfluxQL specification.

Excecute the command `SHOW DIAGNOSTICS` in your terminal to see node diagnostic information. 

