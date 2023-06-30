---
title: Monitor InfluxDB Enterprise
description: Monitor InfluxDB Enterprise with InfluxDB Cloud or OSS.
menu:
  enterprise_influxdb_1_9:
    name: Monitor
    parent: Administration
    weight: 50
---

Monitoring is the act of observing changes in data over time.
There are multiple ways to monitor your InfluxDB Enterprise cluster.
See the guides below to monitor a cluster using another InfluxDB instance.

Alternatively, to view your output data occasionally (_e.g._, for auditing or diagnostics),
do one of the following:

- [Log and trace InfluxDB Enterprise operations](/enterprise_influxdb/v1.9/administration/monitor/logs/)
- [Use InfluxQL for diagnostics](/enterprise_influxdb/v1.9/administration/monitor/diagnostics/)

{{% note %}}
### Monitor with InfluxDB Insights
For InfluxDB Enterprise customers, Insights is a free services that can monitor your cluster. InfluxDB Insights sends monitoring metrics for your cluster to a private Cloud account. This allows the support team to monitor your cluster health as well as making resource usage statistics available to assist with support tickets that you raise.

To apply for this service, please contact the [support team](https://support.influxdata.com/s/login/).
{{% /note %}}

{{< children >}}
