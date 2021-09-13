---
title: Monitor the InfluxData Platform
description: How to use the InfluxData to monitor itself and other instances to identify and alert on anomalies.
menu:
  platform:
    name: Monitor the InfluxData Platform
    identifier: monitor-platform
    weight: 1
    parent: Monitor
---

One of the primary use cases for the InfluxData Platform is as server and infrastructure
monitoring solution. No matter what type of data you're using the platform to collect and
store, it's important to monitor the health of your stack and identify any potential issues.

To **monitor the InfluxDB 2.0 platform**, see [Monitor InfluxDB 2.0](/influxdb/v2.0/monitor-alert/).

To **monitor the InfluxData 1.x platform**, see the following pages for information about setting up a 1.x TICK stack that monitors
another OSS or Enterprise TICK stack. They cover different potential monitoring strategies
and visualizing the monitoring data in a way that makes it easy to recognize, alert on,
and address anomalies as they happen.

Leverage [InfluxDB Cloud](/influxdb/cloud/) and pre-built [InfluxDB templates](/influxdb/cloud/influxdb-templates/)
to monitoring your InfluxDB setup.
Start using InfluxDB Cloud at no cost with the Free Plan.
Use it as much and as long as you like within the plan’s rate-limits.
Limits are designed to let you monitor 5-10 sensors, stacks or servers comfortably.
Monitoring a single InfluxDB OSS instance or even a modest InfluxDB Enterprise
cluster should easily fit within the free plan limits.
If you exceed the plan limits because of high resolution data or longer data retention,
upgrade to the [pay-as-you-go plan](/influxdb/cloud/account-management/pricing-plans/#usage-based-plan).

Start monitoring your InfluxDB instance by signing up for an [InfluxDB Cloud account](https://cloud2.influxdata.com/signup).

{{< children >}}
