---
title: Overview 
description: Learn about the different ways to monitor InfluxDB Enterprise. 
menu:
  enterprise_influxdb_1_9:
    name: Overview
    parent: Monitor
weight: 70
draft: true
---

## Monitoring and viewing internal metrics

InfluxDB offers options for both monitoring and for viewing your data at one time. 

Monitoring is the act of proactively observing changes in data over time. However, you can choose to not monitor your data, but to view it occasionally and/or at the time when an issue occurs. There are multiple ways to monitor or look at InfluxDB Enterprise. 

If you want to monitor an Enterprise cluster on your own, do one of the following: 

* [Monitor Enterprise with Cloud](#monitor-enterprise-with-cloud)
* [Monitor Enterprise with OSS](#monitor-enterprise-with-oss)
* [Monitor Enterprise with internal monitoring](#monitor-enterprise-with-internal-monitoring)
* [Monitor with InfluxDB Aware and Influx Insights](#monitor-with-influxdb-aware-and-influx-insights)

If you want to view your data occasionally at a point in time do one of the following: 

* [SHOW STATS](#show-stats)
* [SHOW DIAGNOSTICS](#show-diagnostics)
* [Log and trace InfluxDB Enterprise operations](#log-and-trace-influxdb-enterprise-operations)

### Monitor Enterprise with Cloud 

[InfluxDB Cloud](/influxdb/cloud/) uses the [InfluxDB Enterprise 1.x Template](https://github.com/influxdata/community-templates/tree/master/influxdb-enterprise-1x), and Telegraf to monitor one or more InfluxDB Enterprise instances.

### Monitor Enterprise with OSS 

[InfluxDB OSS](/influxdb/v2.0/) uses [InfluxDB Enterprise 1.x Template](https://github.com/influxdata/community-templates/tree/master/influxdb-enterprise-1x), and Telegraf to monitor one or more InfluxDB Enterprise instances.

### Monitor Enterprise with internal monitoring 

InfluxDB writes statistical and diagnostic information to database named `_internal`, which records metrics on the internal runtime and service performance.

The `_internal` database can be queried and manipulated like any other InfluxDB database.
Check out the [monitor service README](https://github.com/influxdata/influxdb/blob/1.8/monitor/README.md) and the [internal monitoring blog post](https://www.influxdata.com/blog/how-to-use-the-show-stats-command-and-the-_internal-database-to-monitor-influxdb/) for more detail.

### Monitor with InfluxDB Aware and Influx Insights

InfluxDB Aware and Influx Insights is a free Enterprise service that sends your data to a free Cloud account. Aware assists you in monitoring your data by yourself. Insights assists you in monitoring your data with the help of the support team.  

To apply for this service, please contact the [support team](support@influxdata.com). 

### SHOW STATS 

To see node statistics, execute the command `SHOW STATS`.
For details on this command, see [`SHOW STATS`](/enterprise_influxdb/v1.9/query_language/spec#show-stats) in the InfluxQL specification.

The statistics returned by `SHOW STATS` are stored in memory only, and are reset to zero when the node is restarted.

### SHOW DIAGNOSTICS 

To see node diagnostic information, execute the command `SHOW DIAGNOSTICS`.
This returns information such as build information, uptime, hostname, server configuration, memory usage, and Go runtime diagnostics.

For details on this command, see [`SHOW DIAGNOSTICS`](/enterprise_influxdb/v1.9/query_language/spec#show-diagnostics) in the InfluxQL specification.

### Log and trace InfluxDB Enterprise operations

Write log information to other locations, use different service managers, and use different log output formats.
InfluxDB writes log output, by default, to `stderr`.
Depending on your use case, you may opt to write this log information to another location. 
Use different service managers to override this default. 


<!-- 
* [Logging locations](#logging-locations)
* [Redirect HTTP request logging](#redirect-http-access-logging)
* [Structured logging](#structured-logging)
* [Tracing](#tracing)


InfluxDB writes log output, by default, to `stderr`.
Depending on your use case, this log information can be written to another location.
Some service managers may override this default.

## Logging locations

### Run InfluxDB directly

If you run InfluxDB directly, using `influxd`, all logs will be written to `stderr`.
You may redirect this log output as you would any output to `stderr` like so:

```bash
influxdb-meta 2>$HOME/my_log_file # Meta nodes
influxd 2>$HOME/my_log_file # Data nodes
influx-enterprise 2>$HOME/my_log_file # Enterprise Web
```

### Launched as a service

#### sysvinit

If InfluxDB was installed using a pre-built package, and then launched
as a service, `stderr` is redirected to
`/var/log/influxdb/<node-type>.log`, and all log data will be written to
that file.  You can override this location by setting the variable
`STDERR` in the file `/etc/default/<node-type>`.

For example, if on a data node `/etc/default/influxdb` contains:

```bash
STDERR=/dev/null
```

all log data will be discarded.  You can similarly direct output to
`stdout` by setting `STDOUT` in the same file.  Output to `stdout` is
sent to `/dev/null` by default when InfluxDB is launched as a service.

InfluxDB must be restarted to pick up any changes to `/etc/default/<node-type>`.


##### Meta nodes

For meta nodes, the <node-type> is `influxdb-meta`.
The default log file is `/var/log/influxdb/influxdb-meta.log`
The service configuration file is `/etc/default/influxdb-meta`.

##### Data nodes

For data nodes, the <node-type> is `influxdb`.
The default log file is `/var/log/influxdb/influxdb.log`
The service configuration file is `/etc/default/influxdb`.

##### Enterprise Web

For Enterprise Web nodes, the <node-type> is `influx-enterprise`.
The default log file is `/var/log/influxdb/influx-enterprise.log`
The service configuration file is `/etc/default/influx-enterprise`.

#### systemd

Starting with version 1.0, InfluxDB on systemd systems no longer
writes files to `/var/log/<node-type>.log` by default, and now uses the
system configured default for logging (usually `journald`).  On most
systems, the logs will be directed to the systemd journal and can be
accessed with the command:

```
sudo journalctl -u <node-type>.service
```

Please consult the systemd journald documentation for configuring
journald.

##### Meta nodes

For data nodes the <node-type> is `influxdb-meta`.
The default log command is `sudo journalctl -u influxdb-meta.service`
The service configuration file is `/etc/default/influxdb-meta`.

##### Data nodes

For data nodes the <node-type> is `influxdb`.
The default log command is `sudo journalctl -u influxdb.service`
The service configuration file is `/etc/default/influxdb`.

##### Enterprise Web

For data nodes the <node-type> is `influx-enterprise`.
The default log command is `sudo journalctl -u influx-enterprise.service`
The service configuration file is `/etc/default/influx-enterprise`.

### Use logrotate

You can use [logrotate](http://manpages.ubuntu.com/manpages/cosmic/en/man8/logrotate.8.html)
to rotate the log files generated by InfluxDB on systems where logs are written to flat files.
If using the package install on a sysvinit system, the config file for logrotate is installed in `/etc/logrotate.d`.
You can view the file [here](https://github.com/influxdb/influxdb/blob/master/scripts/logrotate).

## Redirect HTTP access logging

InfluxDB 1.5 introduces the option to log HTTP request traffic separately from the other InfluxDB log output. When HTTP request logging is enabled, the HTTP logs are intermingled by default with internal InfluxDB logging. By redirecting the HTTP request log entries to a separate file, both log files are easier to read, monitor, and debug.

See [Redirecting HTTP request logging](/enterprise_influxdb/v1.9/administration/logs/#redirecting-http-access-logging) in the InfluxDB OSS documentation.

## Structured logging

With InfluxDB 1.5, structured logging is supported and enable machine-readable and more developer-friendly log output formats. The two new structured log formats, `logfmt` and `json`, provide easier filtering and searching with external tools and simplifies integration of InfluxDB logs  with Splunk, Papertrail, Elasticsearch, and other third party tools.

See [Structured logging](/enterprise_influxdb/v1.9/administration/logs/#structured-logging) in the InfluxDB OSS documentation.

## Tracing

Logging has been enhanced, starting in InfluxDB 1.5, to provide tracing of important InfluxDB operations. Tracing is useful for error reporting and discovering performance bottlenecks.

See [Tracing](/enterprise_influxdb/v1.9/administration/logs/#tracing) in the InfluxDB OSS documentation.
 -->



<!-- 
---
title: Monitor InfluxDB servers
description: Troubleshoot and mon
**On this page**

* [SHOW STATS](#show-stats)
* [SHOW DIAGNOSTICS](#show-diagnostics)
* [Internal monitoring](#internal-monitoring)
* [Useful performance metrics commands](#useful-performance-metrics-commands)
* [InfluxDB `/metrics` HTTP endpoint](#influxdb-metrics-http-endpoint)


InfluxDB can display statistical and diagnostic information about each node.
This information can be very useful for troubleshooting and performance monitoring.

## SHOW STATS

To see node statistics, execute the command `SHOW STATS`.
For details on this command, see [`SHOW STATS`](/enterprise_influxdb/v1.9/query_language/spec#show-stats) in the InfluxQL specification.

The statistics returned by `SHOW STATS` are stored in memory only, and are reset to zero when the node is restarted.

## SHOW DIAGNOSTICS

To see node diagnostic information, execute the command `SHOW DIAGNOSTICS`.
This returns information such as build information, uptime, hostname, server configuration, memory usage, and Go runtime diagnostics.
For details on this command, see [`SHOW DIAGNOSTICS`](/enterprise_influxdb/v1.9/query_language/spec#show-diagnostics) in the InfluxQL specification.

## Internal monitoring
InfluxDB also writes statistical and diagnostic information to database named `_internal`, which records metrics on the internal runtime and service performance.
The `_internal` database can be queried and manipulated like any other InfluxDB database.
Check out the [monitor service README](https://github.com/influxdata/influxdb/blob/1.8/monitor/README.md) and the [internal monitoring blog post](https://www.influxdata.com/blog/how-to-use-the-show-stats-command-and-the-_internal-database-to-monitor-influxdb/) for more detail.

## Useful performance metrics commands

Below are a collection of commands to find useful performance metrics about your InfluxDB instance.

To find the number of points per second being written to the instance. Must have the `monitor` service enabled:
```bash
$ influx -execute 'select derivative(pointReq, 1s) from "write" where time > now() - 5m' -database '_internal' -precision 'rfc3339'
```

To find the number of writes separated by database since the beginnning of the log file:

```bash
grep 'POST' /var/log/influxdb/influxd.log | awk '{ print $10 }' | sort | uniq -c
```

Or, for systemd systems logging to journald:

```bash
journalctl -u influxdb.service | awk '/POST/ { print $10 }' | sort | uniq -c
```

### InfluxDB `/metrics` HTTP endpoint

> ***Note:*** There are no outstanding PRs for improvements to the `/metrics` endpoint, but we’ll add them to the CHANGELOG as they occur.

The InfluxDB `/metrics` endpoint is configured to produce the default Go metrics in Prometheus metrics format.


#### Example using InfluxDB `/metrics' endpoint

Below is an example of the output generated using the `/metrics` endpoint. Note that HELP is available to explain the Go statistics.

```
# HELP go_gc_duration_seconds A summary of the GC invocation durations.
# TYPE go_gc_duration_seconds summary
go_gc_duration_seconds{quantile="0"} 6.4134e-05
go_gc_duration_seconds{quantile="0.25"} 8.8391e-05
go_gc_duration_seconds{quantile="0.5"} 0.000131335
go_gc_duration_seconds{quantile="0.75"} 0.000169204
go_gc_duration_seconds{quantile="1"} 0.000544705
go_gc_duration_seconds_sum 0.004619405
go_gc_duration_seconds_count 27
# HELP go_goroutines Number of goroutines that currently exist.
# TYPE go_goroutines gauge
go_goroutines 29
# HELP go_info Information about the Go environment.
# TYPE go_info gauge
go_info{version="go1.10"} 1
# HELP go_memstats_alloc_bytes Number of bytes allocated and still in use.
# TYPE go_memstats_alloc_bytes gauge
go_memstats_alloc_bytes 1.581062048e+09
# HELP go_memstats_alloc_bytes_total Total number of bytes allocated, even if freed.
# TYPE go_memstats_alloc_bytes_total counter
go_memstats_alloc_bytes_total 2.808293616e+09
# HELP go_memstats_buck_hash_sys_bytes Number of bytes used by the profiling bucket hash table.
# TYPE go_memstats_buck_hash_sys_bytes gauge
go_memstats_buck_hash_sys_bytes 1.494326e+06
# HELP go_memstats_frees_total Total number of frees.
# TYPE go_memstats_frees_total counter
go_memstats_frees_total 1.1279913e+07
# HELP go_memstats_gc_cpu_fraction The fraction of this program's available CPU time used by the GC since the program started.
# TYPE go_memstats_gc_cpu_fraction gauge
go_memstats_gc_cpu_fraction -0.00014404354379774563
# HELP go_memstats_gc_sys_bytes Number of bytes used for garbage collection system metadata.
# TYPE go_memstats_gc_sys_bytes gauge
go_memstats_gc_sys_bytes 6.0936192e+07
# HELP go_memstats_heap_alloc_bytes Number of heap bytes allocated and still in use.
# TYPE go_memstats_heap_alloc_bytes gauge
go_memstats_heap_alloc_bytes 1.581062048e+09
# HELP go_memstats_heap_idle_bytes Number of heap bytes waiting to be used.
# TYPE go_memstats_heap_idle_bytes gauge
go_memstats_heap_idle_bytes 3.8551552e+07
# HELP go_memstats_heap_inuse_bytes Number of heap bytes that are in use.
# TYPE go_memstats_heap_inuse_bytes gauge
go_memstats_heap_inuse_bytes 1.590673408e+09
# HELP go_memstats_heap_objects Number of allocated objects.
# TYPE go_memstats_heap_objects gauge
go_memstats_heap_objects 1.6924595e+07
# HELP go_memstats_heap_released_bytes Number of heap bytes released to OS.
# TYPE go_memstats_heap_released_bytes gauge
go_memstats_heap_released_bytes 0
# HELP go_memstats_heap_sys_bytes Number of heap bytes obtained from system.
# TYPE go_memstats_heap_sys_bytes gauge
go_memstats_heap_sys_bytes 1.62922496e+09
# HELP go_memstats_last_gc_time_seconds Number of seconds since 1970 of last garbage collection.
# TYPE go_memstats_last_gc_time_seconds gauge
go_memstats_last_gc_time_seconds 1.520291233297057e+09
# HELP go_memstats_lookups_total Total number of pointer lookups.
# TYPE go_memstats_lookups_total counter
go_memstats_lookups_total 397
# HELP go_memstats_mallocs_total Total number of mallocs.
# TYPE go_memstats_mallocs_total counter
go_memstats_mallocs_total 2.8204508e+07
# HELP go_memstats_mcache_inuse_bytes Number of bytes in use by mcache structures.
# TYPE go_memstats_mcache_inuse_bytes gauge
go_memstats_mcache_inuse_bytes 13888
# HELP go_memstats_mcache_sys_bytes Number of bytes used for mcache structures obtained from system.
# TYPE go_memstats_mcache_sys_bytes gauge
go_memstats_mcache_sys_bytes 16384
# HELP go_memstats_mspan_inuse_bytes Number of bytes in use by mspan structures.
# TYPE go_memstats_mspan_inuse_bytes gauge
go_memstats_mspan_inuse_bytes 1.4781696e+07
# HELP go_memstats_mspan_sys_bytes Number of bytes used for mspan structures obtained from system.
# TYPE go_memstats_mspan_sys_bytes gauge
go_memstats_mspan_sys_bytes 1.4893056e+07
# HELP go_memstats_next_gc_bytes Number of heap bytes when next garbage collection will take place.
# TYPE go_memstats_next_gc_bytes gauge
go_memstats_next_gc_bytes 2.38107752e+09
# HELP go_memstats_other_sys_bytes Number of bytes used for other system allocations.
# TYPE go_memstats_other_sys_bytes gauge
go_memstats_other_sys_bytes 4.366786e+06
# HELP go_memstats_stack_inuse_bytes Number of bytes in use by the stack allocator.
# TYPE go_memstats_stack_inuse_bytes gauge
go_memstats_stack_inuse_bytes 983040
# HELP go_memstats_stack_sys_bytes Number of bytes obtained from system for stack allocator.
# TYPE go_memstats_stack_sys_bytes gauge
go_memstats_stack_sys_bytes 983040
# HELP go_memstats_sys_bytes Number of bytes obtained from system.
# TYPE go_memstats_sys_bytes gauge
go_memstats_sys_bytes 1.711914744e+09
# HELP go_threads Number of OS threads created.
# TYPE go_threads gauge
go_threads 16
```
 -->
