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

To monitor the InfluxDB 2.0 platform, see how to monitor [InfluxDB Cloud](/influxdb/cloud/monitor-alert/) and [InfluxDB 2.0](/influxdb/v2.0/monitor-alert/).

To monitor the InfluxData 1.x platform, see the following pages for information about setting up a 1.x TICK stack that monitors
another OSS or Enterprise TICK stack. They cover different potential monitoring strategies
and visualizing the monitoring data in a way that makes it easy to recognize, alert on,
and address anomalies as they happen.

{{< children >}}