---
title: Overview 
description: Learn about the different ways to monitor InfluxDB Enterprise. 
menu:
  enterprise_influxdb_1_9:
    name: Overview
    weight: 70
    parent: Monitor InfluxDB
---

## Monitoring and viewing internal metrics

InfluxDB offers options for both monitoring and for viewing your data at one time. 

Monitoring is the act of proactively observing changes in data over time. However, you can choose to not monitor your data, but to view it occasionally and/or at the time when an issue occurs. There are multiple ways to monitor or look at InfluxDB Enterprise. 

If you want to monitor an Enterprise cluster on your own, do one of the following: 

* [Monitor Enterprise with Cloud](#monitor-enterprise-with-cloud)
* [Monitor Enterprise with OSS](#monitor-enterprise-with-oss)
* [Monitor Enterprise with internal monitoring](#monitor-enterprise-with-internal-monitoring)
* [Monitor with Aware](#monitor-with-aware)

If you want the InfluxData team to monitor your data for you, see [Monitor with Insights](#monitor-with-insights). 

If you don't want to monitor your data, but view your output data at a single time, do one of the following: 

* [SHOW STATS](#show-stats)
* [SHOW DIAGNOSTICS](#show-diagnostics)
* [Log and trace InfluxDB Enterprise operations](#log-and-trace-influxdb-enterprise-operations)

## Monitor your data 

### Monitor Enterprise with Cloud 

[InfluxDB Cloud](/influxdb/cloud/) uses the [InfluxDB Enterprise 1.x Template](https://github.com/influxdata/community-templates/tree/master/influxdb-enterprise-1x), and Telegraf to monitor one or more InfluxDB Enterprise instances.

### Monitor Enterprise with OSS 

[InfluxDB OSS](/influxdb/v2.0/) uses [InfluxDB Enterprise 1.x Template](https://github.com/influxdata/community-templates/tree/master/influxdb-enterprise-1x), and Telegraf to monitor one or more InfluxDB Enterprise instances.

### Monitor Enterprise with internal monitoring 

InfluxDB writes statistical and diagnostic information to database named `_internal`, which records metrics on the internal runtime and service performance.

The `_internal` database can be queried and manipulated like any other InfluxDB database.
Check out the [monitor service README](https://github.com/influxdata/influxdb/blob/1.8/monitor/README.md) and the [internal monitoring blog post](https://www.influxdata.com/blog/how-to-use-the-show-stats-command-and-the-_internal-database-to-monitor-influxdb/) for more detail.

### Monitor with Aware

InfluxDB Aware is a free Enterprise service that sends your data to a free Cloud 2 account. Aware assists you in monitoring your data by yourself. 

To apply for this service, please contact the [support team](support@influxdata.com). 

### Monitor with Insights 

InfluxDB Insights is a free Enterprise service that sends your data to a private Cloud account. Insights assists you in monitoring your data with the help of the support team.  

To apply for this service, please contact the [support team](support@influxdata.com). 

## View your data at one time 

### SHOW STATS 

To see node statistics, execute the command `SHOW STATS`.
For details on this command, see [`SHOW STATS`](/enterprise_influxdb/v1.9/query_language/spec#show-stats) in the InfluxQL specification.

The statistics returned by `SHOW STATS` are stored in memory only, and are reset to zero when the node is restarted.

### SHOW DIAGNOSTICS 

To see node diagnostic information, execute the command `SHOW DIAGNOSTICS`.
This returns information such as build information, uptime, hostname, server configuration, memory usage, and Go runtime diagnostics.

For details on this command, see [`SHOW DIAGNOSTICS`](/enterprise_influxdb/v1.9/query_language/spec#show-diagnostics) in the InfluxQL specification.

### Log and trace InfluxDB Enterprise operations

InfluxDB writes log output, by default, to `stderr`.
Depending on your use case, you may opt to write this log information to another location. 
Use different service managers to override this default. 