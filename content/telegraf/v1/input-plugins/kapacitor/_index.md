---
description: "Telegraf plugin for collecting metrics from Kapacitor"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Kapacitor
    identifier: input-kapacitor
tags: [Kapacitor, "input-plugins", "configuration"]
related:
  - /telegraf/v1/configure_plugins/
---

# Kapacitor Input Plugin

The Kapacitor plugin collects metrics from the given Kapacitor instances.

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Read Kapacitor-formatted JSON metrics from one or more HTTP endpoints
[[inputs.kapacitor]]
  ## Multiple URLs from which to read Kapacitor-formatted JSON
  ## Default is "http://localhost:9092/kapacitor/v1/debug/vars".
  urls = [
    "http://localhost:9092/kapacitor/v1/debug/vars"
  ]

  ## Time limit for http requests
  timeout = "5s"

  ## Optional TLS Config
  # tls_ca = "/etc/telegraf/ca.pem"
  # tls_cert = "/etc/telegraf/cert.pem"
  # tls_key = "/etc/telegraf/key.pem"
  ## Use TLS but skip chain & host verification
  # insecure_skip_verify = false
```

## Metrics

### Measurements and fields

- kapacitor
  - num_enabled_tasks_
  - num_subscriptions_
  - num_tasks_
- kapacitor_alert
  - notification_dropped_
  - primary-handle-count_
  - secondary-handle-count kapacitor_cluster_
  - dropped_member_events_
  - dropped_user_events_
  - query_handler_errors_
- kapacitor_edges
  - collected_
  - emitted_
- kapacitor_ingress
  - points_received_
- kapacitor_load
  - errors_
- kapacitor_memstats
  - alloc_bytes_
  - buck_hash_sys_bytes_
  - frees_
  - gc_sys_bytes_
  - gc_cpu_fraction_
  - heap_alloc_bytes_
  - heap_idle_bytes_
  - heap_in_use_bytes_
  - heap_objects_
  - heap_released_bytes_
  - heap_sys_bytes_
  - last_gc_ns_
  - lookups_
  - mallocs_
  - mcache_in_use_bytes_
  - mcache_sys_bytes_
  - mspan_in_use_bytes_
  - mspan_sys_bytes_
  - next_gc_ns_
  - num_gc_
  - other_sys_bytes_
  - pause_total_ns_
  - stack_in_use_bytes_
  - stack_sys_bytes_
  - sys_bytes_
  - total_alloc_bytes_
- kapacitor_nodes
  - alerts_inhibited_
  - alerts_triggered_
  - avg_exec_time_ns_
  - crits_triggered_
  - errors_
  - infos_triggered_
  - oks_triggered_
  - points_written_
  - warns_triggered_
  - write_errors_
- kapacitor_topics
  - collected_

---

## kapacitor

The `kapacitor` measurement stores fields with information related to
[Kapacitor tasks](https://docs.influxdata.com/kapacitor/latest/introduction/getting-started/#kapacitor-tasks) and [subscriptions](https://docs.influxdata.com/kapacitor/latest/administration/subscription-management/).

[tasks]: https://docs.influxdata.com/kapacitor/latest/introduction/getting-started/#kapacitor-tasks

[subs]: https://docs.influxdata.com/kapacitor/latest/administration/subscription-management/

### num_enabled_tasks

The number of enabled Kapacitor tasks.

### num_subscriptions

The number of Kapacitor/InfluxDB subscriptions.

### num_tasks

The total number of Kapacitor tasks.

---

## kapacitor_alert

The `kapacitor_alert` measurement stores fields with information related to
[Kapacitor alerts](https://docs.influxdata.com/kapacitor/v1.5/working/alerts/).

### notification-dropped

The number of internal notifications dropped because they arrive too late from
another Kapacitor node.  If this count is increasing, Kapacitor Enterprise nodes
aren't able to communicate fast enough to keep up with the volume of alerts.

### primary-handle-count

The number of times this node handled an alert as the primary. This count should
increase under normal conditions.

### secondary-handle-count

The number of times this node handled an alert as the secondary. An increase in
this counter indicates that the primary is failing to handle alerts in a timely
manner.

---

## kapacitor_cluster

The `kapacitor_cluster` measurement reflects the ability of [Kapacitor nodes to
communicate]() with one another. Specifically, these metrics track the
gossip communication between the Kapacitor nodes.

[cluster]: https://docs.influxdata.com/enterprise_kapacitor/v1.5/administration/configuration/#cluster-communications

### dropped_member_events

The number of gossip member events that were dropped.

### dropped_user_events

The number of gossip user events that were dropped.

### query_handler_errors

The number of errors from event handlers.

---

## kapacitor_edges

The `kapacitor_edges` measurement stores fields with information related to
[edges](https://docs.influxdata.com/kapacitor/latest/tick/introduction/#pipelines) in Kapacitor TICKscripts.

[edges]: https://docs.influxdata.com/kapacitor/latest/tick/introduction/#pipelines

### collected

The number of messages collected by TICKscript edges.

### emitted

The number of messages emitted by TICKscript edges.

---

## kapacitor_ingress

The `kapacitor_ingress` measurement stores fields with information related to
data coming into Kapacitor.

### points_received

The number of points received by Kapacitor.

---

## kapacitor_load

The `kapacitor_load` measurement stores fields with information related to the
[Kapacitor Load Directory service](https://docs.influxdata.com/kapacitor/latest/guides/load_directory/).

[load-dir]: https://docs.influxdata.com/kapacitor/latest/guides/load_directory/

### errors

The number of errors reported from the load directory service.

---

## kapacitor_memstats

The `kapacitor_memstats` measurement stores fields related to Kapacitor memory
usage.

### alloc_bytes

The number of bytes of memory allocated by Kapacitor that are still in use.

### buck_hash_sys_bytes

The number of bytes of memory used by the profiling bucket hash table.

### frees

The number of heap objects freed.

### gc_sys_bytes

The number of bytes of memory used for garbage collection system metadata.

### gc_cpu_fraction

The fraction of Kapacitor's available CPU time used by garbage collection since
Kapacitor started.

### heap_alloc_bytes

The number of reachable and unreachable heap objects garbage collection has
not freed.

### heap_idle_bytes

The number of heap bytes waiting to be used.

### heap_in_use_bytes

The number of heap bytes in use.

### heap_objects

The number of allocated objects.

### heap_released_bytes

The number of heap bytes released to the operating system.

### heap_sys_bytes

The number of heap bytes obtained from `system`.

### last_gc_ns

The nanosecond epoch time of the last garbage collection.

### lookups

The total number of pointer lookups.

### mallocs

The total number of mallocs.

### mcache_in_use_bytes

The number of bytes in use by mcache structures.

### mcache_sys_bytes

The number of bytes used for mcache structures obtained from `system`.

### mspan_in_use_bytes

The number of bytes in use by mspan structures.

### mspan_sys_bytes

The number of bytes used for mspan structures obtained from `system`.

### next_gc_ns

The nanosecond epoch time of the next garbage collection.

### num_gc

The number of completed garbage collection cycles.

### other_sys_bytes

The number of bytes used for other system allocations.

### pause_total_ns

The total number of nanoseconds spent in garbage collection "stop-the-world"
pauses since Kapacitor started.

### stack_in_use_bytes

The number of bytes in use by the stack allocator.

### stack_sys_bytes

The number of bytes obtained from `system` for stack allocator.

### sys_bytes

The number of bytes of memory obtained from `system`.

### total_alloc_bytes

The total number of bytes allocated, even if freed.

---

## kapacitor_nodes

The `kapacitor_nodes` measurement stores fields related to events that occur in
[TICKscript nodes](https://docs.influxdata.com/kapacitor/latest/nodes/).

### alerts_inhibited

The total number of alerts inhibited by TICKscripts.

### alerts_triggered

The total number of alerts triggered by TICKscripts.

### avg_exec_time_ns

The average execution time of TICKscripts in nanoseconds.

### crits_triggered

The number of critical (`crit`) alerts triggered by TICKscripts.

### errors (from TICKscripts)

The number of errors caused caused by TICKscripts.

### infos_triggered

The number of info (`info`) alerts triggered by TICKscripts.

### oks_triggered

The number of ok (`ok`) alerts triggered by TICKscripts.

#### points_written

The number of points written to InfluxDB or back to Kapacitor.

#### warns_triggered

The number of warning (`warn`) alerts triggered by TICKscripts.

#### working_cardinality

The total number of unique series processed.

#### write_errors

The number of errors that occurred when writing to InfluxDB or other write
endpoints.

---

### kapacitor_topics

The `kapacitor_topics` measurement stores fields related to Kapacitor
topics][topics].

[topics]: https://docs.influxdata.com/kapacitor/latest/working/using_alert_topics/

#### collected (kapacitor_topics)

The number of events collected by Kapacitor topics.

---

__Note:__ The Kapacitor variables `host`, `cluster_id`, and `server_id`
are currently not recorded due to the potential high cardinality of
these values.

## Example Output

```text
kapacitor_memstats,host=hostname.local,kap_version=1.1.0~rc2,url=http://localhost:9092/kapacitor/v1/debug/vars alloc_bytes=6974808i,buck_hash_sys_bytes=1452609i,frees=207281i,gc_sys_bytes=802816i,gc_cpu_fraction=0.00004693548939673313,heap_alloc_bytes=6974808i,heap_idle_bytes=6742016i,heap_in_use_bytes=9183232i,heap_objects=23216i,heap_released_bytes=0i,heap_sys_bytes=15925248i,last_gc_ns=1478791460012676997i,lookups=88i,mallocs=230497i,mcache_in_use_bytes=9600i,mcache_sys_bytes=16384i,mspan_in_use_bytes=98560i,mspan_sys_bytes=131072i,next_gc_ns=11467528i,num_gc=8i,other_sys_bytes=2236087i,pause_total_ns=2994110i,stack_in_use_bytes=1900544i,stack_sys_bytes=1900544i,sys_bytes=22464760i,total_alloc_bytes=35023600i 1478791462000000000
kapacitor,host=hostname.local,kap_version=1.1.0~rc2,url=http://localhost:9092/kapacitor/v1/debug/vars num_enabled_tasks=5i,num_subscriptions=5i,num_tasks=5i 1478791462000000000
kapacitor_edges,child=stream0,host=hostname.local,parent=stream,task=deadman-test,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_ingress,database=_internal,host=hostname.local,measurement=shard,retention_policy=monitor,task_master=main points_received=120 1478791462000000000
kapacitor_ingress,database=_internal,host=hostname.local,measurement=subscriber,retention_policy=monitor,task_master=main points_received=60 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=http_out,node=http_out3,task=sys-stats,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_edges,child=window6,host=hostname.local,parent=derivative5,task=deadman-test,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=from,node=from1,task=sys-stats,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=stream,node=stream0,task=test,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=window,node=window6,task=deadman-test,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_ingress,database=_internal,host=hostname.local,measurement=cq,retention_policy=monitor,task_master=main points_received=10 1478791462000000000
kapacitor_edges,child=http_out3,host=hostname.local,parent=window2,task=sys-stats,type=batch collected=0,emitted=0 1478791462000000000
kapacitor_edges,child=mean4,host=hostname.local,parent=log3,task=deadman-test,type=batch collected=0,emitted=0 1478791462000000000
kapacitor_ingress,database=_kapacitor,host=hostname.local,measurement=nodes,retention_policy=autogen,task_master=main points_received=207 1478791462000000000
kapacitor_edges,child=stream0,host=hostname.local,parent=stream,task=sys-stats,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_edges,child=log6,host=hostname.local,parent=sum5,task=derivative-test,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_edges,child=from1,host=hostname.local,parent=stream0,task=sys-stats,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=alert,node=alert2,task=test,type=stream alerts_triggered=0,avg_exec_time_ns=0i,crits_triggered=0,infos_triggered=0,oks_triggered=0,warns_triggered=0 1478791462000000000
kapacitor_edges,child=log3,host=hostname.local,parent=derivative2,task=derivative-test,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_ingress,database=_kapacitor,host=hostname.local,measurement=runtime,retention_policy=autogen,task_master=main points_received=9 1478791462000000000
kapacitor_ingress,database=_internal,host=hostname.local,measurement=tsm1_filestore,retention_policy=monitor,task_master=main points_received=120 1478791462000000000
kapacitor_edges,child=derivative2,host=hostname.local,parent=from1,task=derivative-test,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=stream,node=stream0,task=derivative-test,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_ingress,database=_internal,host=hostname.local,measurement=queryExecutor,retention_policy=monitor,task_master=main points_received=10 1478791462000000000
kapacitor_ingress,database=_internal,host=hostname.local,measurement=tsm1_wal,retention_policy=monitor,task_master=main points_received=120 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=log,node=log6,task=derivative-test,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_edges,child=stream,host=hostname.local,parent=stats,task=task_master:main,type=stream collected=598,emitted=598 1478791462000000000
kapacitor_ingress,database=_internal,host=hostname.local,measurement=write,retention_policy=monitor,task_master=main points_received=10 1478791462000000000
kapacitor_edges,child=stream0,host=hostname.local,parent=stream,task=derivative-test,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=log,node=log3,task=deadman-test,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=from,node=from1,task=deadman-test,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_ingress,database=_kapacitor,host=hostname.local,measurement=ingress,retention_policy=autogen,task_master=main points_received=148 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=eval,node=eval4,task=derivative-test,type=stream avg_exec_time_ns=0i,eval_errors=0 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=derivative,node=derivative2,task=derivative-test,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_ingress,database=_internal,host=hostname.local,measurement=runtime,retention_policy=monitor,task_master=main points_received=10 1478791462000000000
kapacitor_ingress,database=_internal,host=hostname.local,measurement=httpd,retention_policy=monitor,task_master=main points_received=10 1478791462000000000
kapacitor_edges,child=sum5,host=hostname.local,parent=eval4,task=derivative-test,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_ingress,database=_kapacitor,host=hostname.local,measurement=kapacitor,retention_policy=autogen,task_master=main points_received=9 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=from,node=from1,task=test,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_ingress,database=_internal,host=hostname.local,measurement=tsm1_engine,retention_policy=monitor,task_master=main points_received=120 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=window,node=window2,task=deadman-test,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=stream,node=stream0,task=deadman-test,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_edges,child=influxdb_out4,host=hostname.local,parent=http_out3,task=sys-stats,type=batch collected=0,emitted=0 1478791462000000000
kapacitor_edges,child=window2,host=hostname.local,parent=from1,task=deadman-test,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=from,node=from1,task=derivative-test,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_edges,child=from1,host=hostname.local,parent=stream0,task=deadman-test,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_ingress,database=_internal,host=hostname.local,measurement=database,retention_policy=monitor,task_master=main points_received=40 1478791462000000000
kapacitor_edges,child=stream,host=hostname.local,parent=write_points,task=task_master:main,type=stream collected=750,emitted=750 1478791462000000000
kapacitor_edges,child=log7,host=hostname.local,parent=window6,task=deadman-test,type=batch collected=0,emitted=0 1478791462000000000
kapacitor_edges,child=window2,host=hostname.local,parent=from1,task=sys-stats,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=log,node=log7,task=deadman-test,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_ingress,database=_kapacitor,host=hostname.local,measurement=edges,retention_policy=autogen,task_master=main points_received=225 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=derivative,node=derivative5,task=deadman-test,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_edges,child=from1,host=hostname.local,parent=stream0,task=test,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_edges,child=alert2,host=hostname.local,parent=from1,task=test,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=log,node=log3,task=derivative-test,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=influxdb_out,node=influxdb_out4,task=sys-stats,type=stream avg_exec_time_ns=0i,points_written=0,write_errors=0 1478791462000000000
kapacitor_edges,child=stream0,host=hostname.local,parent=stream,task=test,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_edges,child=log3,host=hostname.local,parent=window2,task=deadman-test,type=batch collected=0,emitted=0 1478791462000000000
kapacitor_edges,child=derivative5,host=hostname.local,parent=mean4,task=deadman-test,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=stream,node=stream0,task=sys-stats,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=window,node=window2,task=sys-stats,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=mean,node=mean4,task=deadman-test,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_edges,child=from1,host=hostname.local,parent=stream0,task=derivative-test,type=stream collected=0,emitted=0 1478791462000000000
kapacitor_ingress,database=_internal,host=hostname.local,measurement=tsm1_cache,retention_policy=monitor,task_master=main points_received=120 1478791462000000000
kapacitor_nodes,host=hostname.local,kind=sum,node=sum5,task=derivative-test,type=stream avg_exec_time_ns=0i 1478791462000000000
kapacitor_edges,child=eval4,host=hostname.local,parent=log3,task=derivative-test,type=stream collected=0,emitted=0 1478791462000000000
```
