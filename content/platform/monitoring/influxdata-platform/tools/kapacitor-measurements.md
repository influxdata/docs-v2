---
title: Kapacitor measurements and fields
description: >
  Understand internal Kapacitor measurements and fields and use them to monitor
  Kapacitor servers.
aliases:
  - /platform/monitoring/tools/kapacitor-measurements/
menu:
  platform:
    name: Kapacitor measurements
    parent: Other monitoring tools
    weight: 2
---

Kapacitor exposes internal performance through the `/kacapitor/v1/debug/vars` endpoint.
Use the Telegraf `kapacitor` plugins to capture these metrics and store them in InfluxDB.

Enable the Kapacitor input plugin in your Telegraf configuration file:

```toml
# ...
[[inputs.kapacitor]]
  ## Multiple URLs from which to read Kapacitor-formatted JSON
  ## Default is "http://localhost:9092/kapacitor/v1/debug/vars".
  urls = [
    "http://localhost:9092/kapacitor/v1/debug/vars"
  ]
# ...
```

### Visualize Kapacitor metrics
Use the [Kapacitor Monitor dashboard](/platform/monitoring/influxdata-platform/monitoring-dashboards/#monitor-kapacitor)
to visualize Kapacitor metrics.

## Kapacitor measurements & fields
Kapacitor exposes the following measurements and fields through the
`/kacapitor/v1/debug/vars` endpoint.

- [kapacitor](#kapacitor)
    - [num_enabled_tasks](#num-enabled-tasks)
    - [num_subscriptions](#num-subscriptions)
    - [num_tasks](#num-tasks)
- [kapacitor_edges](#kapacitor-edges)
    - [collected](#collected)
    - [emitted](#emitted)
- [kapacitor_ingress](#kapacitor-ingress)
    - [points_received](#points-received)
- [kapacitor_load](#kapacitor-load)
    - [errors](#errors)
- [kapacitor_memstats](#kapacitor-memstats)
    - [alloc_bytes](#alloc-bytes)
    - [buck_hash_sys_bytes](#buck-hash-sys-bytes)
    - [frees](#frees)
    - [gc_sys_bytes](#gc-sys-bytes)
    - [gcc_pu_fraction](#gcc-pu-fraction)
    - [heap_alloc_bytes](#heap-alloc-bytes)
    - [heap_idle_bytes](#heap-idle-bytes)
    - [heap_in_use_bytes](#heap-in-use-bytes)
    - [heap_objects](#heap-objects)
    - [heap_released_bytes](#heap-released-bytes)
    - [heap_sys_bytes](#heap-sys-bytes)
    - [last_gc_ns](#last-gc-ns)
    - [lookups](#lookups)
    - [mallocs](#mallocs)
    - [mcache_in_use_bytes](#mcache-in-use-bytes)
    - [mcache_sys_bytes](#mcache-sys-bytes)
    - [mspan_in_use_bytes](#mspan-in-use-bytes)
    - [mspan_sys_bytes](#mspan-sys-bytes)
    - [next_gc_ns](#next-gc-ns)
    - [num_gc](#num-gc)
    - [other_sys_bytes](#other-sys-bytes)
    - [pause_total_ns](#pause-total-ns)
    - [stack_in_use_bytes](#stack-in-use-bytes)
    - [stack_sys_bytes](#stack-sys-bytes)
    - [sys_bytes](#sys-bytes)
    - [total_alloc_bytes](#total-alloc-bytes)
- [kapacitor_nodes](#kapacitor-nodes)
    - [alerts_inhibited](#alerts-inhibited)
    - [alerts_triggered](#alerts-triggered)
    - [avg_exec_time_ns](#avg-exec-time-ns)
    - [crits_triggered](#crits-triggered)
    - [errors](#errors)
    - [infos_triggered](#infos-triggered)
    - [oks_triggered](#oks-triggered)
    - [points_written](#points-written)
    - [warns_triggered](#warns-triggered)
    - [write_errors](#write-errors)
- [kapacitor_topics](#kapacitor-topics)
    - [collected](#collected)

---

### kapacitor
The `kapacitor` measurement stores fields with information related to
[Kapacitor tasks](/{{< latest "kapacitor" >}}/introduction/getting-started/#kapacitor-tasks)
and [subscriptions](/{{< latest "kapacitor" >}}/administration/subscription-management/).

#### num_enabled_tasks
The number of enabled Kapacitor tasks.

#### num_subscriptions
The number of Kapacitor/InfluxDB subscriptions.

#### num_tasks
The total number of Kapacitor tasks.

---

### kapacitor_edges
The `kapacitor_edges` measurement stores fields with information related to
[edges](/{{< latest "kapacitor" >}}/tick/introduction/#pipelines)
in Kapacitor TICKscripts.

#### collected
The number of messages collected by TICKscript edges.

#### emitted
The number of messages emitted by TICKscript edges.

---

### kapacitor_ingress
The `kapacitor_ingress` measurement stores fields with information related to data
coming into Kapacitor.

#### points_received
The number of points received by Kapacitor.

---

### kapacitor_load
The `kapacitor_load` measurement stores fields with information related to the
[Kapacitor Load Directory service](/{{< latest "kapacitor" >}}/guides/load_directory/).

#### errors
The number of errors reported from the load directory service.

---

### kapacitor_memstats
The `kapacitor_memstats` measurement stores fields related to Kapacitor memory usage.

#### alloc_bytes
The number of bytes of memory allocated by Kapacitor that are still in use.

#### buck_hash_sys_bytes
The number of bytes of memory used by the profiling bucket hash table.

#### frees
The number of heap objects freed.

#### gc_sys_bytes
The number of bytes of memory used for garbage collection system metadata.

#### gcc_pu_fraction
The fraction of Kapacitor's available CPU time used by garbage collection since
Kapacitor started.

#### heap_alloc_bytes
The number of reachable and unreachable heap objects garbage collection has
not freed.

#### heap_idle_bytes
The number of heap bytes waiting to be used.

#### heap_in_use_bytes
The number of heap bytes in use.

#### heap_objects
The number of allocated objects.

#### heap_released_bytes
The number of heap bytes released to the operating system.

#### heap_sys_bytes
The number of heap bytes obtained from `system`.  

#### last_gc_ns
The nanosecond epoch time of the last garbage collection.

#### lookups
The total number of pointer lookups.

#### mallocs
The total number of mallocs.

#### mcache_in_use_bytes
The number of bytes in use by mcache structures.

#### mcache_sys_bytes
The number of bytes used for mcache structures obtained from `system`.

#### mspan_in_use_bytes
The number of bytes in use by mspan structures.

#### mspan_sys_bytes
The number of bytes used for mspan structures obtained from `system`.

#### next_gc_ns
The nanosecond epoch time of the next garbage collection.

#### num_gc
The number of completed garbage collection cycles.

#### other_sys_bytes
The number of bytes used for other system allocations.

#### pause_total_ns
The total number of nanoseconds spent in garbage collection "stop-the-world"
pauses since Kapacitor started.

#### stack_in_use_bytes
The number of bytes in use by the stack allocator.

#### stack_sys_bytes
The number of bytes obtained from `system` for stack allocator.

#### sys_bytes
The number of bytes of memory obtained from `system`.

#### total_alloc_bytes
The total number of bytes allocated, even if freed.

---

### kapacitor_nodes
The `kapacitor_nodes` measurement stores fields related to events that occur in
[TICKscript nodes](/{{< latest "kapacitor" >}}/nodes/).

#### alerts_inhibited
The total number of alerts inhibited by TICKscripts.

#### alerts_triggered
The total number of alerts triggered by TICKscripts.

#### avg_exec_time_ns
The average execution time of TICKscripts in nanoseconds.

#### crits_triggered
The number of critical (`crit`) alerts triggered by TICKscripts.

#### errors
The number of errors caused caused by TICKscripts.

#### infos_triggered
The number of info (`info`) alerts triggered by TICKscripts.

#### oks_triggered
The number of ok (`ok`) alerts triggered by TICKscripts.

#### points_written
The number of points written to InfluxDB or back to Kapacitor.

#### warns_triggered
The number of warning (`warn`) alerts triggered by TICKscripts.

#### working_cardinality
The total number of unique series processed.

#### write_errors
The number of errors that occurred when writing to InfluxDB or other write endpoints.

---

### kapacitor_topics
The `kapacitor_topics` measurement stores fields related to
[Kapacitor topics](/{{< latest "kapacitor" >}}/working/using_alert_topics/).

#### collected
The number of events collected by Kapacitor topics.  
