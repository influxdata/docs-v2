---
title: InfluxDB OSS metrics
description: >
 Get metrics about the workload performance of an InfluxDB OSS instance.
menu:
 influxdb_v2:
   parent: InfluxDB internals
   name: Metrics
influxdb/v2/tags: [cpu, memory, metrics, performance, Prometheus, storage, usage]
---
Get metrics about the workload performance of an InfluxDB OSS instance.

InfluxDB OSS exposes a `/metrics` endpoint that returns
performance, resource, and usage metrics formatted in the [Prometheus plain-text exposition format](https://prometheus.io/docs/instrumenting/exposition_formats).

{{< api-endpoint method="GET" endpoint="http://localhost:8086/metrics" api-ref="/influxdb/v2/api/#get-/metrics" >}}

Metrics contain a name, an optional set of key-value pairs, and a value.

The following descriptors precede each metric:

- `HELP`: description of the metric
- `TYPE`: [Prometheus metric type](https://prometheus.io/docs/concepts/metric_types/) (`counter`, `gauge`, `histogram`, or `summary`)

#### Example

```text
# HELP go_info Information about the Go environment.
# TYPE go_info gauge
go_info{version="go1.17"} 1
# HELP go_memstats_alloc_bytes Number of bytes allocated and still in use.
# TYPE go_memstats_alloc_bytes gauge
go_memstats_alloc_bytes 2.27988488e+08
# HELP go_memstats_alloc_bytes_total Total number of bytes allocated, even if freed.
# TYPE go_memstats_alloc_bytes_total counter
go_memstats_alloc_bytes_total 9.68016566648e+11
```

The InfluxDB `/metrics` endpoint returns metrics associated with the following categories:

- [Boltdb](#boltdb-statistics)
- [Go runtime](#go-runtime-statistics)
- [HTTP API](#http-api-statistics)
- [InfluxDB objects and queries](#influxdb-object-and-query-statistics)
  - [QC (query controller)](#qc-query-controller-statistics)
- [InfluxDB services](#influxdb-service-statistics)
- [InfluxDB storage](#influxdb-storage-statistics)
- [InfluxDB tasks](#influxdb-task-statistics)

## Boltdb statistics

### Reads total

Total number of boltdb reads.

#### Example

```text
# HELP boltdb_reads_total Total number of boltdb reads
# TYPE boltdb_reads_total counter
boltdb_reads_total 75129
```
### Writes total

Total number of boltdb writes.

#### Example

```text
# HELP boltdb_writes_total Total number of boltdb writes
# TYPE boltdb_writes_total counter
boltdb_writes_total 201591
```

## Go runtime statistics

For more detail about Go runtime statistics, see the following:
- [Go diagostics documentation](https://go.dev/doc/diagnostics)
- [Go mstats](https://github.com/golang/go/blob/master/src/runtime/mstats.go)

### GC (garbage collection) duration seconds

Summary of the pause duration of garbage collection cycles.

#### Example

```text
# HELP go_gc_duration_seconds A summary of the pause duration of garbage collection cycles.
# TYPE go_gc_duration_seconds summary
go_gc_duration_seconds{quantile="0"} 5.1467e-05
--
```

### Goroutines

Number of goroutines that currently exist.

#### Example

```text
# HELP go_goroutines Number of goroutines that currently exist.
# TYPE go_goroutines gauge
go_goroutines 1566
```

### Info

Information about the Go environment.

#### Example

```text
# HELP go_info Information about the Go environment.
# TYPE go_info gauge
go_info{version="go1.17"} 1
```

### Memory allocated bytes

Number of bytes allocated and still in use.

#### Example

```text
# HELP go_memstats_alloc_bytes Number of bytes allocated and still in use.
# TYPE go_memstats_alloc_bytes gauge
go_memstats_alloc_bytes 2.27988488e+08
```

### Memory allocated bytes total

Total number of bytes allocated, even if freed.

#### Example

```text
# HELP go_memstats_alloc_bytes_total Total number of bytes allocated, even if freed.
# TYPE go_memstats_alloc_bytes_total counter
go_memstats_alloc_bytes_total 9.68016566648e+11
```

### Memory bucket hash system bytes

Number of bytes used by the profiling bucket hash table.

#### Example

```text
# HELP go_memstats_buck_hash_sys_bytes Number of bytes used by the profiling bucket hash table.
# TYPE go_memstats_buck_hash_sys_bytes gauge
go_memstats_buck_hash_sys_bytes 1.0067613e+07
```

### Memory frees total

Total number of frees.

#### Example

```text
# HELP go_memstats_frees_total Total number of frees.
# TYPE go_memstats_frees_total counter
go_memstats_frees_total 1.3774541795e+10
```

### Memory GC (garbage collection) CPU fraction

Fraction of this program's available CPU time used by the GC since the program started.

#### Example

```text
# HELP go_memstats_gc_cpu_fraction The fraction of this program's available CPU time used by the GC since the program started.
# TYPE go_memstats_gc_cpu_fraction gauge
go_memstats_gc_cpu_fraction 0.011634918451016558
```

### Memory GC (garbage collection) system bytes

Number of bytes used for garbage collection system metadata.

#### Example

```text
# HELP go_memstats_gc_sys_bytes Number of bytes used for garbage collection system metadata.
# TYPE go_memstats_gc_sys_bytes gauge
go_memstats_gc_sys_bytes 4.63048016e+08
```

### Memory heap allocated bytes

Number of heap bytes allocated and still in use.

#### Example

```text
# HELP go_memstats_heap_alloc_bytes Number of heap bytes allocated and still in use.
# TYPE go_memstats_heap_alloc_bytes gauge
go_memstats_heap_alloc_bytes 2.27988488e+08
```

### Memory heap idle bytes

Number of heap bytes waiting to be used.

#### Example

```text
# HELP go_memstats_heap_idle_bytes Number of heap bytes waiting to be used.
# TYPE go_memstats_heap_idle_bytes gauge
go_memstats_heap_idle_bytes 1.0918273024e+10
```

### Memory heap in use bytes

Number of heap bytes that are in use.

#### Example

```text
# HELP go_memstats_heap_inuse_bytes Number of heap bytes that are in use.
# TYPE go_memstats_heap_inuse_bytes gauge
go_memstats_heap_inuse_bytes 3.5975168e+08
```

### Memory heap objects

Number of allocated objects.
_Allocated_ heap objects include all reachable objects, as
well as unreachable objects that the garbage collector has not yet freed.

#### Example

```text
# HELP go_memstats_heap_objects Number of allocated objects.
# TYPE go_memstats_heap_objects gauge
go_memstats_heap_objects 2.404017e+06
```

### Memory heap released bytes

Number of heap bytes released to the OS.

#### Example

```text
# HELP go_memstats_heap_released_bytes Number of heap bytes released to OS.
# TYPE go_memstats_heap_released_bytes gauge
go_memstats_heap_released_bytes 2.095038464e+09
```

### Memory heap system bytes

Number of heap bytes obtained from the system.

#### Example

```text
# HELP go_memstats_heap_sys_bytes Number of heap bytes obtained from system.
# TYPE go_memstats_heap_sys_bytes gauge
go_memstats_heap_sys_bytes 1.1278024704e+10
```

### Memory last GC (garbage collection) time seconds

Number of seconds since 1970 of the last garbage collection.

#### Example

```text
# HELP go_memstats_last_gc_time_seconds Number of seconds since 1970 of last garbage collection.
# TYPE go_memstats_last_gc_time_seconds gauge
go_memstats_last_gc_time_seconds 1.64217120199452e+09
```

### Memory lookups total

Total number of pointer lookups.

#### Example

```text
# HELP go_memstats_lookups_total Total number of pointer lookups.
# TYPE go_memstats_lookups_total counter
go_memstats_lookups_total 0
```

### Memory allocations total

Cumulative count of heap objects allocated.

#### Example

```text
# HELP go_memstats_mallocs_total Total number of mallocs.
# TYPE go_memstats_mallocs_total counter
go_memstats_mallocs_total 1.3776945812e+10
```

### Memory mcache in use bytes

Number of bytes in use by mcache structures.

#### Example

```text
# HELP go_memstats_mcache_inuse_bytes Number of bytes in use by mcache structures.
# TYPE go_memstats_mcache_inuse_bytes gauge
go_memstats_mcache_inuse_bytes 9600
```

### Memory mcache system bytes

Number of bytes used for mcache structures obtained from system.

#### Example

```text
# HELP go_memstats_mcache_sys_bytes Number of bytes used for mcache structures obtained from system.
# TYPE go_memstats_mcache_sys_bytes gauge
go_memstats_mcache_sys_bytes 16384
```

### Memory mspan in use bytes

Number of bytes of allocated mspan structures.

#### Example

```text
# HELP go_memstats_mspan_inuse_bytes Number of bytes in use by mspan structures.
# TYPE go_memstats_mspan_inuse_bytes gauge
go_memstats_mspan_inuse_bytes 4.199e+06
```

### Memory mspan system bytes

Bytes of memory obtained from the OS for mspan structures.

#### Example

```text
# HELP go_memstats_mspan_sys_bytes Number of bytes used for mspan structures obtained from system.
# TYPE go_memstats_mspan_sys_bytes gauge
go_memstats_mspan_sys_bytes 1.65609472e+08
```

### Memory next GC (garbage collection) bytes

Number of heap bytes when next garbage collection will take place.

#### Example

```text
# HELP go_memstats_next_gc_bytes Number of heap bytes when next garbage collection will take place.
# TYPE go_memstats_next_gc_bytes gauge
go_memstats_next_gc_bytes 4.45628016e+08
```

### Memory other system bytes

Number of bytes used for other system allocations.

#### Example

```text
# HELP go_memstats_other_sys_bytes Number of bytes used for other system allocations.
# TYPE go_memstats_other_sys_bytes gauge
go_memstats_other_sys_bytes 8.1917722e+07
```

### Memory stack in use bytes

Number of bytes in use by the stack allocator.

#### Example

```text
# HELP go_memstats_stack_inuse_bytes Number of bytes in use by the stack allocator.
# TYPE go_memstats_stack_inuse_bytes gauge
go_memstats_stack_inuse_bytes 8.84736e+06
```

### Memory stack system bytes

Number of bytes obtained from system for stack allocator.

#### Example

```text
# HELP go_memstats_stack_sys_bytes Number of bytes obtained from system for stack allocator.
# TYPE go_memstats_stack_sys_bytes gauge
go_memstats_stack_sys_bytes 8.84736e+06
```

### Memory system bytes

Number of bytes obtained from system.

#### Example

```text
# HELP go_memstats_sys_bytes Number of bytes obtained from system.
# TYPE go_memstats_sys_bytes gauge
go_memstats_sys_bytes 1.2007531271e+10
```

### Threads

Number of OS threads created.

#### Example

```text
# HELP go_threads Number of OS threads created.
# TYPE go_threads gauge
go_threads 27
```

## HTTP API statistics

### API request duration seconds

How long InfluxDB took to respond to the HTTP request.

#### Example

```text
# HELP http_api_request_duration_seconds Time taken to respond to HTTP request
# TYPE http_api_request_duration_seconds histogram
http_api_request_duration_seconds_bucket{handler="platform",method="DELETE",path="/api/v2/authorizations/:id",response_code="204",status="2XX",user_agent="Chrome",le="0.005"} 0
--
```

### API requests total

Number of HTTP requests received.

#### Example

```text
# HELP http_api_requests_total Number of http requests received
# TYPE http_api_requests_total counter
http_api_requests_total{handler="platform",method="DELETE",path="/api/v2/authorizations/:id",response_code="204",status="2XX",user_agent="Chrome"} 1
--
```

### Query request bytes

Count of bytes received.

#### Example

```text
# HELP http_query_request_bytes Count of bytes received
# TYPE http_query_request_bytes counter
http_query_request_bytes{endpoint="/api/v2/query",org_id="48c88459ee424a04",status="200"} 727
```

### Query request count

Total number of query requests.

#### Example

```text
# HELP http_query_request_count Total number of query requests
# TYPE http_query_request_count counter
http_query_request_count{endpoint="/api/v2/query",org_id="48c88459ee424a04",status="200"} 2
```

### Query response bytes

Count of bytes returned by the query endpoint.

#### Example

```text
# HELP http_query_response_bytes Count of bytes returned
# TYPE http_query_response_bytes counter
http_query_response_bytes{endpoint="/api/v2/query",org_id="48c88459ee424a04",status="200"} 103
```

## InfluxDB object and query statistics

### Buckets total

Total number of buckets on the server.

#### Example

```text
# HELP influxdb_buckets_total Number of total buckets on the server
# TYPE influxdb_buckets_total counter
influxdb_buckets_total 9
```

### Dashboards total

Total number of dashboards on the server.

#### Example

```text
# HELP influxdb_dashboards_total Number of total dashboards on the server
# TYPE influxdb_dashboards_total counter
influxdb_dashboards_total 2
```

### Info

Information about the InfluxDB environment.

#### Example

```text
# HELP influxdb_info Information about the influxdb environment.
# TYPE influxdb_info gauge
influxdb_info{arch="amd64",build_date="2021-12-28T22:12:40Z",commit="657e1839de",cpus="8",os="darwin",version="v2.1.1"} 1
```

### Organizations total

Total number of organizations on the server.

#### Example

```text
# HELP influxdb_organizations_total Number of total organizations on the server
# TYPE influxdb_organizations_total counter
influxdb_organizations_total 2
```

### Replications total

Total number of replication configurations on the server

#### Example

```text
# HELP influxdb_replications_total Number of total replication configurations on the server
# TYPE influxdb_replications_total counter
influxdb_replications_total 1
```

### Scrapers total

Total number of scrapers on the server.

#### Example

```text
# HELP influxdb_scrapers_total Number of total scrapers on the server
# TYPE influxdb_scrapers_total counter
influxdb_scrapers_total 0
```

### Telegrafs total

Total number of Telegraf configurations on the server.

#### Example

```text
# HELP influxdb_telegrafs_total Number of total telegraf configurations on the server
# TYPE influxdb_telegrafs_total counter
influxdb_telegrafs_total 0
```

### Token services total

Total number of API tokens on the server.

#### Example

```text
# HELP influxdb_tokens_total Number of total tokens on the server
# TYPE influxdb_tokens_total counter
influxdb_tokens_total 23
```

### Uptime seconds

InfluxDB process uptime in seconds.

#### Example

```text
# HELP influxdb_uptime_seconds influxdb process uptime in seconds
# TYPE influxdb_uptime_seconds gauge
influxdb_uptime_seconds{id="077238f9ca108000"} 343354.914499305
```

### Users total

Total number of users on the server.

#### Example

```text
# HELP influxdb_users_total Number of total users on the server
# TYPE influxdb_users_total counter
influxdb_users_total 84
```

## QC (query controller) statistics

### All active

Number of queries in all states.

#### Example

```text
# HELP qc_all_active Number of queries in all states
# TYPE qc_all_active gauge
qc_all_active{org="48c88459ee424a04"} 0
--
```

### All duration seconds

Total time spent in all query states.

#### Example

```text
# HELP qc_all_duration_seconds Histogram of total times spent in all query states
# TYPE qc_all_duration_seconds histogram
qc_all_duration_seconds_bucket{org="48c88459ee424a04",le="0.001"} 0
--
```

### Compiling active

Number of queries actively compiling.

#### Example

```text
# HELP qc_compiling_active Number of queries actively compiling
# TYPE qc_compiling_active gauge
qc_compiling_active{compiler_type="ast",org="ed32b47572a0137b"} 0
--
```

### Compiling duration seconds

Histogram of times spent compiling queries.

#### Example

```text
# HELP qc_compiling_duration_seconds Histogram of times spent compiling queries
# TYPE qc_compiling_duration_seconds histogram
qc_compiling_duration_seconds_bucket{compiler_type="ast",org="ed32b47572a0137b",le="0.001"} 999
--
```

### Executing active

Number of queries actively executing.

#### Example

```text
# HELP qc_executing_active Number of queries actively executing
# TYPE qc_executing_active gauge
qc_executing_active{org="48c88459ee424a04"} 0
--
```

### Executing duration seconds

Histogram of times spent executing queries.

#### Example

```text
# HELP qc_executing_duration_seconds Histogram of times spent executing queries
# TYPE qc_executing_duration_seconds histogram
qc_executing_duration_seconds_bucket{org="48c88459ee424a04",le="0.001"} 0
--
```

### Memory unused bytes

Free memory as seen by the internal memory manager.

#### Example

```text
# HELP qc_memory_unused_bytes The free memory as seen by the internal memory manager
# TYPE qc_memory_unused_bytes gauge
qc_memory_unused_bytes{org="48c88459ee424a04"} 0
--
```

### Queueing active

Number of queries actively queueing.

#### Example

```text
# HELP qc_queueing_active Number of queries actively queueing
# TYPE qc_queueing_active gauge
qc_queueing_active{org="48c88459ee424a04"} 0
--
```

### Queueing duration seconds

Histogram of times spent queueing queries.

#### Example

```text
# HELP qc_queueing_duration_seconds Histogram of times spent queueing queries
# TYPE qc_queueing_duration_seconds histogram
qc_queueing_duration_seconds_bucket{org="48c88459ee424a04",le="0.001"} 2
--
```

### Requests total

Count of the query requests.

#### Example

```text
# HELP qc_requests_total Count of the query requests
# TYPE qc_requests_total counter
qc_requests_total{org="48c88459ee424a04",result="success"} 2
--
```

### Read request duration

Histogram of times spent in read requests.

#### Example

```text
# HELP query_influxdb_source_read_request_duration_seconds Histogram of times spent in read requests
# TYPE query_influxdb_source_read_request_duration_seconds histogram
query_influxdb_source_read_request_duration_seconds_bucket{op="readTagKeys",org="48c88459ee424a04",le="0.001"} 0
--
```

## InfluxDB service statistics

### Bucket service new call total

Number of calls to the bucket creation service.

#### Example

```text
# HELP service_bucket_new_call_total Number of calls
# TYPE service_bucket_new_call_total counter
service_bucket_new_call_total{method="find_bucket"} 6177
--
```

### Bucket service new duration

Duration of calls to the bucket creation service.

#### Example

```text
# HELP service_bucket_new_duration Duration of calls
# TYPE service_bucket_new_duration histogram
service_bucket_new_duration_bucket{method="find_bucket",le="0.005"} 5876
--
```

### Bucket service new error total

Number of errors encountered by the bucket creation service.

#### Example

```text
# HELP service_bucket_new_error_total Number of errors encountered
# TYPE service_bucket_new_error_total counter
service_bucket_new_error_total{code="not found",method="find_bucket_by_id"} 76
```

### Onboard service new call total

Number of calls to the onboarding service.

#### Example

```text
# HELP service_onboard_new_call_total Number of calls
# TYPE service_onboard_new_call_total counter
service_onboard_new_call_total{method="is_onboarding"} 11
```

### Onboard service new duration

Duration of calls to the onboarding service.

#### Example

```text
# HELP service_onboard_new_duration Duration of calls
# TYPE service_onboard_new_duration histogram
service_onboard_new_duration_bucket{method="is_onboarding",le="0.005"} 11
--
```

### Organization service call total

Number of calls to the organization service.

#### Example

```text
# HELP service_org_call_total Number of calls
# TYPE service_org_call_total counter
service_org_call_total{method="find_labels_for_resource"} 10
```

### Organization service duration

Duration of calls to the organization service.

#### Example

```text
# HELP service_org_duration Duration of calls
# TYPE service_org_duration histogram
service_org_duration_bucket{method="find_labels_for_resource",le="0.005"} 10
--
```

### Organization service new call total

Number of calls to the organization creation service.

#### Example

```text
# HELP service_org_new_call_total Number of calls
# TYPE service_org_new_call_total counter
service_org_new_call_total{method="find_org"} 1572
--
```

### Organization service new duration

Duration of calls to the organization creation service.

#### Example

```text
# HELP service_org_new_duration Duration of calls
# TYPE service_org_new_duration histogram
service_org_new_duration_bucket{method="find_org",le="0.005"} 1475
--
```

### Organization service new error total

Number of errors encountered by the organization creation service.

#### Example

```text
# HELP service_org_new_error_total Number of errors encountered
# TYPE service_org_new_error_total counter
service_org_new_error_total{code="not found",method="find_orgs"} 1
```

### Password service new call total

Number of calls to the password creation service.

#### Example

```text
# HELP service_password_new_call_total Number of calls
# TYPE service_password_new_call_total counter
service_password_new_call_total{method="compare_password"} 4
```

### Password service new duration

Duration of calls to the password creation service.

#### Example

```text
# HELP service_password_new_duration Duration of calls
# TYPE service_password_new_duration histogram
service_password_new_duration_bucket{method="compare_password",le="0.005"} 0
--
```

### Password service new error total

Number of errors encountered by the password creation service.

#### Example

```text
# HELP service_password_new_error_total Number of errors encountered
# TYPE service_password_new_error_total counter
service_password_new_error_total{code="forbidden",method="compare_password"} 1
```

### Pkger service call total

Number of calls to the `pkger` service.

#### Example

```text
# HELP service_pkger_call_total Number of calls
# TYPE service_pkger_call_total counter
service_pkger_call_total{method="export"} 3
```

### Pkger service duration

Duration of calls to the `pkger` service.

#### Example

```text
# HELP service_pkger_duration Duration of calls
# TYPE service_pkger_duration histogram
service_pkger_duration_bucket{method="export",le="0.005"} 0
--
```

### Pkger service template export

Metrics for exported resources.

#### Example

```text
# HELP service_pkger_template_export Metrics for resources being exported
# TYPE service_pkger_template_export counter
service_pkger_template_export{buckets="0",by_stack="false",checks="0",dashboards="0",endpoints="0",label_mappings="0",labels="0",method="export",num_org_ids="1",rules="0",tasks="0",telegraf_configs="0",variables="0"} 3
```

### Replication service call total

Number of calls to the replication service.

#### Example

```text
# HELP service_replication_call_total Number of calls
# TYPE service_replication_call_total counter
service_replication_call_total{method="find_replications"} 1
```

### Replication service call duration

Duration of calls to the replication service.

#### Example

```text
# HELP service_replication_duration Duration of calls
# TYPE service_replication_duration histogram
service_replication_duration_bucket{method="create_replication",le="0.005"} 0
service_replication_duration_bucket{method="find_replications",le="0.005"} 1
```

### Replication queue total points queued

Sum of all points that have been successfully added to the replication stream queue.

#### Example

```text
# HELP replications_queue_total_points_queued Sum of all points
# TYPE replications_queue_total_points_queued Counter
replications_queue_total_points_queued
```

### Replications queue total bytes queued

Sum of all bytes that have been successfully added to the replication stream queue.

#### Example

```text
# HELP replications_queue_total_bytes_queued Sum of all bytes that have been successfully added to the replication stream queue
# TYPE replications_queue_total_bytes_queued counter
replications_queue_total_bytes_queued{replicationID="0cd2cd54e9fe9000"} 289
```

### Replications queue current bytes queued

Current number of bytes in the replication stream queue remaining to be processed.

#### Example

```text
# HELP replications_queue_current_bytes_queued Current number of bytes in the replication stream queue remaining to be processed
# TYPE replications_queue_current_bytes_queued gauge
replications_queue_current_bytes_queued{replicationID="0cd2cd54e9fe9000"} 297
```

### Replications queue remote write errors

Error codes returned from attempted remote writes.

#### Example

```text
# HELP replications_queue_remote_write_errors Error codes returned from attempted remote writes
# TYPE replications_queue_remote_write_errors counter
replications_queue_remote_write_errors{code="404",replicationID="0cd2cd54e9fe9000"} 11
```

### Replications queue remote write bytes sent

Bytes of data successfully sent to the remote by the replication stream.

#### Example

```text
# HELP replications_queue_remote_write_bytes_sent Bytes of data successfully sent to the remote by the replication stream
# TYPE replications_queue_remote_write_bytes_sent counter
replications_queue_remote_write_bytes_sent{...}
```

### Replications queue

Bytes of data dropped due to remote write failures.

#### Example

```text
# HELP replications_queue_remote_write_bytes_dropped Bytes of data dropped due to remote write failures
# TYPE replications_queue_remote_write_bytes_dropped counter
replications_queue_remote_write_bytes_dropped{...}
```

### Replications queue

Sum of all points that could not be added to the local replication queue.

#### Example

```text
# HELP replications_queue_points_failed_to_queue
# TYPE replications_queue_points_failed_to_queue
replications_queue_points_failed_to_queue{...}
```

### Replications queue

Sum of all bytes that could not be added to the local replication queue.

#### Example

```text
# HELP replications_queue_bytes_failed_to_queue Sum of all bytes that could not be added to the local replication queue
# TYPE replications_queue_bytes_failed_to_queue counter
replications_queue_bytes_failed_to_queue{...}
```

### Session service call total

Number of calls to the session service.

#### Example

```text
# HELP service_session_call_total Number of calls
# TYPE service_session_call_total counter
service_session_call_total{method="create_session"} 3
--
```

### Session service duration

Duration of calls to the session service.

#### Example

```text
# HELP service_session_duration Duration of calls
# TYPE service_session_duration histogram
service_session_duration_bucket{method="create_session",le="0.005"} 3
--
```

### Session service error total

Number of errors encountered by the session service.

#### Example

```text
# HELP service_session_error_total Number of errors encountered
# TYPE service_session_error_total counter
service_session_error_total{code="not found",method="find_session"} 4
```

### Token service call total

Number of calls to the token service.

#### Example

```text
# HELP service_token_call_total Number of calls
# TYPE service_token_call_total counter
service_token_call_total{method="delete_authorization"} 3
--
```

### Token service duration

Duration of calls to the token service.

#### Example

```text
# HELP service_token_duration Duration of calls
# TYPE service_token_duration histogram
service_token_duration_bucket{method="delete_authorization",le="0.005"} 1
--
```

### Token service error total

Number of errors encountered by the token service.

#### Example

```text
# HELP service_token_error_total Number of errors encountered
# TYPE service_token_error_total counter
service_token_error_total{code="not found",method="delete_authorization"} 1
```

### URM new call total
Number of calls to the URM (unified resource management) creation service.

#### Example

```text
# HELP service_urm_new_call_total Number of calls
# TYPE service_urm_new_call_total counter
service_urm_new_call_total{method="find_urms"} 6451
```

### urm new duration
Duration of calls to the URM creation service.

#### Example

```text
# HELP service_urm_new_duration Duration of calls
# TYPE service_urm_new_duration histogram
service_urm_new_duration_bucket{method="find_urms",le="0.005"} 6198
--
```

### User new call total
Number of calls to the user creation service.

#### Example

```text
# HELP service_user_new_call_total Number of calls
# TYPE service_user_new_call_total counter
service_user_new_call_total{method="find_permission_for_user"} 4806
--
```

### User new duration
Duration of calls to the user creation service.

#### Example

```text
# HELP service_user_new_duration Duration of calls
# TYPE service_user_new_duration histogram
service_user_new_duration_bucket{method="find_permission_for_user",le="0.005"} 4039
--
```

## InfluxDB storage statistics

To learn how InfluxDB writes, stores, and caches data, see [InfluxDB storage engine](/influxdb/v2/reference/internals/storage-engine/).

### Bucket measurement number

Number of measurements in a bucket.

#### Example

```text
# HELP storage_bucket_measurement_num Gauge of measurement cardinality per bucket
# TYPE storage_bucket_measurement_num gauge
storage_bucket_measurement_num{bucket="0c3dd7d2d97f4b23"} 4
--
```

### Bucket series number

Number of series in a bucket.

#### Example

```text
# HELP storage_bucket_series_num Gauge of series cardinality per bucket
# TYPE storage_bucket_series_num gauge
storage_bucket_series_num{bucket="0c3dd7d2d97f4b23"} 38
--
```

### Cache disk bytes

Size (in bytes) of the most recent [snapshot](/influxdb/v2/reference/internals/storage-engine/#cache).

#### Example

```text
# HELP storage_cache_disk_bytes Gauge of size of most recent snapshot
# TYPE storage_cache_disk_bytes gauge
storage_cache_disk_bytes{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 0
--
```

### Cache in use bytes

Current memory consumption (in bytes) of the [cache](/influxdb/v2/reference/internals/storage-engine/#cache).

#### Example

```text
# HELP storage_cache_inuse_bytes Gauge of current memory consumption of cache
# TYPE storage_cache_inuse_bytes gauge
storage_cache_inuse_bytes{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 0
--
```

### Cache latest snapshot

[Unix time](/influxdb/v2/reference/glossary/#unix-timestamp) of the most recent [snapshot](/influxdb/v2/reference/internals/storage-engine/#cache).

#### Example

```text
# HELP storage_cache_latest_snapshot Unix time of most recent snapshot
# TYPE storage_cache_latest_snapshot gauge
storage_cache_latest_snapshot{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 1.644269658196893e+09
--
```

### Cache writes with dropped points

Cumulative number of [cached](/influxdb/v2/reference/internals/storage-engine/#cache) writes that had [rejected points](/influxdb/v2/reference/glossary/#rejected-point). Writes with rejected points also increment the [write errors counter (`storage_cache_writes_err`)](#cache-writes-failed).

#### Example

```text
# HELP storage_cache_writes_dropped Counter of writes to cache with some dropped points
# TYPE storage_cache_writes_dropped counter
storage_cache_writes_dropped{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 0
--
```

### Cache writes failed

Cumulative number of  [cached](/influxdb/v2/reference/internals/storage-engine/#cache) writes that [failed](/influxdb/v2/write-data/troubleshoot/#troubleshoot-failures), inclusive of [cache writes with dropped points (`storage_cache_writes_dropped`)](#cache-writes-with-dropped-points).

#### Example

```text
# HELP storage_cache_writes_err Counter of failed writes to cache
# TYPE storage_cache_writes_err counter
storage_cache_writes_err{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 0
--
```

### Cache writes total

Cumulative number of  writes to [cache](/influxdb/v2/reference/internals/storage-engine/#cache).

#### Example

```text
# HELP storage_cache_writes_total Counter of all writes to cache
# TYPE storage_cache_writes_total counter
storage_cache_writes_total{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 0
--
```

### Compactions active

Currently running [TSM](/influxdb/v2/reference/internals/storage-engine/#time-structured-merge-tree-tsm) compactions (by level).

#### Example

```text
# HELP storage_compactions_active Gauge of compactions (by level) currently running
# TYPE storage_compactions_active gauge
storage_compactions_active{bucket="ec3f82d1de90eddf",engine="tsm1",id="565",level="1",path="/Users/me/.influxdbv2/engine/data/ec3f82d1de90eddf/autogen/565",walPath="/Users/me/.influxdbv2/engine/wal/ec3f82d1de90eddf/autogen/565"} 0
--
```

### Compactions since startup

[TSM](/influxdb/v2/reference/internals/storage-engine/#time-structured-merge-tree-tsm) compactions (by level) since startup.

#### Example

```text
# HELP storage_compactions_duration_seconds Histogram of compactions by level since startup
# TYPE storage_compactions_duration_seconds histogram
storage_compactions_duration_seconds_bucket{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="567",level="cache",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/567",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/567",le="60"} 1
storage_compactions_duration_seconds_bucket{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="567",level="cache",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/567",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/567",le="600"} 1
storage_compactions_duration_seconds_bucket{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="567",level="cache",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/567",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/567",le="6000"} 1
storage_compactions_duration_seconds_bucket{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="567",level="cache",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/567",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/567",le="+Inf"} 1
storage_compactions_duration_seconds_sum{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="567",level="cache",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/567",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/567"} 0.167250668
storage_compactions_duration_seconds_count{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="567",level="cache",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/567",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/567"} 1
--
```

### Compactions failed

Failed [TSM](/influxdb/v2/reference/internals/storage-engine/#time-structured-merge-tree-tsm) compactions (by level).

#### Example

```text
# HELP storage_compactions_failed Counter of TSM compactions (by level) that have failed due to error
# TYPE storage_compactions_failed counter
storage_compactions_failed{bucket="ec3f82d1de90eddf",engine="tsm1",id="565",level="1",path="/Users/me/.influxdbv2/engine/data/ec3f82d1de90eddf/autogen/565",walPath="/Users/me/.influxdbv2/engine/wal/ec3f82d1de90eddf/autogen/565"} 0
--
```

### Compactions queued

Queued [TSM](/influxdb/v2/reference/internals/storage-engine/#time-structured-merge-tree-tsm) compactions (by level).

#### Example

```text
# HELP storage_compactions_queued Counter of TSM compactions (by level) that are currently queued
# TYPE storage_compactions_queued gauge
storage_compactions_queued{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="567",level="1",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/567",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/567"} 0
--
```

### Retention check duration

Retention policy check duration (in seconds).

#### Example

```text
# HELP storage_retention_check_duration Histogram of duration of retention check (in seconds)
# TYPE storage_retention_check_duration histogram
storage_retention_check_duration_bucket{le="0.005"} 1
storage_retention_check_duration_bucket{le="0.01"} 1
storage_retention_check_duration_bucket{le="0.025"} 1
storage_retention_check_duration_bucket{le="0.05"} 1
storage_retention_check_duration_bucket{le="0.1"} 1
storage_retention_check_duration_bucket{le="0.25"} 1
storage_retention_check_duration_bucket{le="0.5"} 1
storage_retention_check_duration_bucket{le="1"} 1
storage_retention_check_duration_bucket{le="2.5"} 1
storage_retention_check_duration_bucket{le="5"} 1
storage_retention_check_duration_bucket{le="10"} 1
storage_retention_check_duration_bucket{le="+Inf"} 1
storage_retention_check_duration_sum 0.000351857
storage_retention_check_duration_count 1
--
```

### Shard disk size

Disk size (in bytes) of the [shard](/influxdb/v2/reference/internals/shards/).

#### Example

```text
# HELP storage_shard_disk_size Gauge of the disk size for the shard
# TYPE storage_shard_disk_size gauge
storage_shard_disk_size{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 4.188743e+06
--
```

### Shard fields created

Number of [shard](/influxdb/v2/reference/internals/shards/) fields created.

#### Example

```text
# HELP storage_shard_fields_created Counter of the number of fields created
# TYPE storage_shard_fields_created counter
storage_shard_fields_created{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 0
--
```

### Shard series

Number of series in the [shard](/influxdb/v2/reference/internals/shards/) index.

#### Example

```text
# HELP storage_shard_series Gauge of the number of series in the shard index
# TYPE storage_shard_series gauge
storage_shard_series{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 38
--
```

### Shard writes

Number of [shard write](/influxdb/v2/reference/internals/shards/#shard-writes) requests.

#### Example

```text
# HELP storage_shard_write_count Count of the number of write requests
# TYPE storage_shard_write_count counter
storage_shard_write_count{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 0
--
```

### Shard dropped points

Number of [rejected points](/influxdb/v2/reference/glossary/#rejected-point) in [shard writes](/influxdb/v2/reference/internals/shards/#shard-writes).

#### Example

```text
# HELP storage_shard_write_dropped_sum Counter of the number of points dropped
# TYPE storage_shard_write_dropped_sum counter
storage_shard_write_dropped_sum{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 0
--
```

### Shard writes with errors

Number of [shard write](/influxdb/v2/reference/internals/shards/#shard-writes) requests with errors.

#### Example

```text
# HELP storage_shard_write_err_count Count of the number of write requests with errors
# TYPE storage_shard_write_err_count counter
storage_shard_write_err_count{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 0
--
```

### Points in shard writes with errors

Number of points in [shard write](/influxdb/v2/reference/internals/shards/#shard-writes) requests with errors.

#### Example

```text
# HELP storage_shard_write_err_sum Counter of the number of points for write requests with errors
# TYPE storage_shard_write_err_sum counter
storage_shard_write_err_sum{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 0
--
```

### Points in shard writes

Number of points in [shard write](/influxdb/v2/reference/internals/shards/#shard-writes) requests.

#### Example

```text
# HELP storage_shard_write_sum Counter of the number of points for write requests
# TYPE storage_shard_write_sum counter
storage_shard_write_sum{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 0
--
```

### Shard data size

Gauge of the data size (in bytes) for each [shard](/influxdb/v2/reference/internals/shards/).

#### Example

```text
# HELP storage_tsm_files_disk_bytes Gauge of data size in bytes for each shard
# TYPE storage_tsm_files_disk_bytes gauge
storage_tsm_files_disk_bytes{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 4.188743e+06
--
```

### Shard files

Number of files per [shard](/influxdb/v2/reference/internals/shards/).

#### Example

```text
# HELP storage_tsm_files_total Gauge of number of files per shard
# TYPE storage_tsm_files_total gauge
storage_tsm_files_total{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 1
--
```

### WAL size

[WAL](/influxdb/v2/reference/internals/storage-engine/#write-ahead-log-wal) size (in bytes).

#### Example

```text
# HELP storage_wal_size Gauge of size of WAL in bytes
# TYPE storage_wal_size gauge
storage_wal_size{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 0
--
```

## WAL write attempts

Cumulative number of write attempts to the [WAL](/influxdb/v2/reference/internals/storage-engine/#write-ahead-log-wal).

#### Example

```text
# HELP storage_wal_writes Number of write attempts to the WAL
# TYPE storage_wal_writes counter
storage_wal_writes{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 0
--
```

## WAL failed write attempts

Cumulative number of failed write attempts to the [WAL](/influxdb/v2/reference/internals/storage-engine/#write-ahead-log-wal).

#### Example

```text
# HELP storage_wal_writes_err Number of failed write attempts to the WAL
# TYPE storage_wal_writes_err counter
storage_wal_writes_err{bucket="0c3dd7d2d97f4b23",engine="tsm1",id="561",path="/Users/me/.influxdbv2/engine/data/0c3dd7d2d97f4b23/autogen/561",walPath="/Users/me/.influxdbv2/engine/wal/0c3dd7d2d97f4b23/autogen/561"} 0
--
```

## Points dropped due to partial writes

Number of points dropped due to partial writes.

#### Example

```text
# HELP storage_writer_dropped_points Histogram of number of points dropped due to partial writes
# TYPE storage_writer_dropped_points histogram
storage_writer_dropped_points_bucket{path="/Users/me/.influxdbv2/engine",le="10"} 0
storage_writer_dropped_points_bucket{path="/Users/me/.influxdbv2/engine",le="100"} 0
storage_writer_dropped_points_bucket{path="/Users/me/.influxdbv2/engine",le="1000"} 0
storage_writer_dropped_points_bucket{path="/Users/me/.influxdbv2/engine",le="10000"} 0
storage_writer_dropped_points_bucket{path="/Users/me/.influxdbv2/engine",le="100000"} 0
storage_writer_dropped_points_bucket{path="/Users/me/.influxdbv2/engine",le="+Inf"} 0
storage_writer_dropped_points_sum{path="/Users/me/.influxdbv2/engine"} 0
storage_writer_dropped_points_count{path="/Users/me/.influxdbv2/engine"} 0
--
```

## Points in shard write requests with errors

Number of points in [shard write](/influxdb/v2/reference/internals/shards/#shard-writes) requests with errors.

#### Example

```text
# HELP storage_writer_err_points Histogram of number of points in errored shard write requests
# TYPE storage_writer_err_points histogram
storage_writer_err_points_bucket{path="/Users/me/.influxdbv2/engine",le="10"} 0
storage_writer_err_points_bucket{path="/Users/me/.influxdbv2/engine",le="100"} 0
storage_writer_err_points_bucket{path="/Users/me/.influxdbv2/engine",le="1000"} 0
storage_writer_err_points_bucket{path="/Users/me/.influxdbv2/engine",le="10000"} 0
storage_writer_err_points_bucket{path="/Users/me/.influxdbv2/engine",le="100000"} 0
storage_writer_err_points_bucket{path="/Users/me/.influxdbv2/engine",le="+Inf"} 0
storage_writer_err_points_sum{path="/Users/me/.influxdbv2/engine"} 0
storage_writer_err_points_count{path="/Users/me/.influxdbv2/engine"} 0
--
```

## Points in successful shard write requests

Number of points in successful [shard write](/influxdb/v2/reference/internals/shards/#shard-writes) requests.

#### Example

```text
# HELP storage_writer_ok_points Histogram of number of points in successful shard write requests
# TYPE storage_writer_ok_points histogram
storage_writer_ok_points_bucket{path="/Users/me/.influxdbv2/engine",le="10"} 6
storage_writer_ok_points_bucket{path="/Users/me/.influxdbv2/engine",le="100"} 6
storage_writer_ok_points_bucket{path="/Users/me/.influxdbv2/engine",le="1000"} 8
storage_writer_ok_points_bucket{path="/Users/me/.influxdbv2/engine",le="10000"} 20
storage_writer_ok_points_bucket{path="/Users/me/.influxdbv2/engine",le="100000"} 24
storage_writer_ok_points_bucket{path="/Users/me/.influxdbv2/engine",le="+Inf"} 24
storage_writer_ok_points_sum{path="/Users/me/.influxdbv2/engine"} 125787
storage_writer_ok_points_count{path="/Users/me/.influxdbv2/engine"} 24
--
```

## Points in write requests

Number of points in write requests.

#### Example

```text
# HELP storage_writer_req_points Histogram of number of points requested to be written
# TYPE storage_writer_req_points histogram
storage_writer_req_points_bucket{path="/Users/me/.influxdbv2/engine",le="10"} 6
storage_writer_req_points_bucket{path="/Users/me/.influxdbv2/engine",le="100"} 6
storage_writer_req_points_bucket{path="/Users/me/.influxdbv2/engine",le="1000"} 6
storage_writer_req_points_bucket{path="/Users/me/.influxdbv2/engine",le="10000"} 14
storage_writer_req_points_bucket{path="/Users/me/.influxdbv2/engine",le="100000"} 18
storage_writer_req_points_bucket{path="/Users/me/.influxdbv2/engine",le="+Inf"} 18
storage_writer_req_points_sum{path="/Users/me/.influxdbv2/engine"} 125787
storage_writer_req_points_count{path="/Users/me/.influxdbv2/engine"} 18
--
```

## Shard write request timeouts

Cumulative number of [shard write](/influxdb/v2/reference/internals/shards/#shard-writes) request timeouts.

#### Example

```text
# HELP storage_writer_timeouts Number of shard write request timeouts
# TYPE storage_writer_timeouts counter
storage_writer_timeouts{path="/Users/me/.influxdbv2/engine"} 0
--
```

## InfluxDB task statistics

### Task executor errors

Number of errors thrown by the executor with the type of error (ex. Invalid, Internal, etc.)

#### Example

```text
# HELP task_executor_errors_counter The number of errors thrown by the executor with the type of error (ex. Invalid, Internal, etc.)
# TYPE task_executor_errors_counter counter
task_executor_errors_counter{errorType="internal error",task_type="system"} 1183
--
```

### Task executor promise queue usage

Percent of the promise queue that is currently full.

#### Example

```text
# HELP task_executor_promise_queue_usage Percent of the promise queue that is currently full
# TYPE task_executor_promise_queue_usage gauge
task_executor_promise_queue_usage 0
```

### Task executor run duration

Duration (in seconds) between a task run starting and finishing.

#### Example

```text
# HELP task_executor_run_duration The duration in seconds between a run starting and finishing.
# TYPE task_executor_run_duration summary

task_executor_run_duration{taskID="08017725990f6000",task_type="",quantile="0.5"} 0.865043855
task_executor_run_duration{taskID="08017725990f6000",task_type="",quantile="0.9"} 0.865043855
task_executor_run_duration{taskID="08017725990f6000",task_type="",quantile="0.99"} 0.865043855
task_executor_run_duration_sum{taskID="08017725990f6000",task_type=""} 1.524920552
task_executor_run_duration_count{taskID="08017725990f6000",task_type=""} 2
--
```

### Task executor run latency seconds

Latency between the task run's scheduled start time and the execution time, by task type.

#### Example

```text
# HELP task_executor_run_latency_seconds Records the latency between the time the run was due to run and the time the task started execution, by task type
# TYPE task_executor_run_latency_seconds histogram
task_executor_run_latency_seconds_bucket{task_type="system",le="0.005"} 0
task_executor_run_latency_seconds_bucket{task_type="system",le="0.01"} 0
task_executor_run_latency_seconds_bucket{task_type="system",le="0.025"} 0
task_executor_run_latency_seconds_bucket{task_type="system",le="0.05"} 0
task_executor_run_latency_seconds_bucket{task_type="system",le="0.1"} 0
task_executor_run_latency_seconds_bucket{task_type="system",le="0.25"} 2
task_executor_run_latency_seconds_bucket{task_type="system",le="0.5"} 6
task_executor_run_latency_seconds_bucket{task_type="system",le="1"} 6
task_executor_run_latency_seconds_bucket{task_type="system",le="2.5"} 6
task_executor_run_latency_seconds_bucket{task_type="system",le="5"} 6
task_executor_run_latency_seconds_bucket{task_type="system",le="10"} 6
task_executor_run_latency_seconds_bucket{task_type="system",le="+Inf"} 6
task_executor_run_latency_seconds_sum{task_type="system"} 2.237636
task_executor_run_latency_seconds_count{task_type="system"} 6
--
```

### Task executor run queue delta

Duration (in seconds) between the task run's scheduled start time and the execution time.

#### Example

```text
# HELP task_executor_run_queue_delta The duration in seconds between a run being due to start and actually starting.
# TYPE task_executor_run_queue_delta summary
task_executor_run_queue_delta{taskID="08017725990f6000",task_type="",quantile="0.5"} 0.324742
task_executor_run_queue_delta{taskID="08017725990f6000",task_type="",quantile="0.9"} 0.324742
task_executor_run_queue_delta{taskID="08017725990f6000",task_type="",quantile="0.99"} 0.324742
task_executor_run_queue_delta_sum{taskID="08017725990f6000",task_type=""} 0.674875
task_executor_run_queue_delta_count{taskID="08017725990f6000",task_type=""} 2
--
```

### Task executor total runs active

Number of workers currently running tasks.

#### Example

```text
# HELP task_executor_total_runs_active Total number of workers currently running tasks
# TYPE task_executor_total_runs_active gauge
task_executor_total_runs_active 0
```

### Task executor total runs complete

Number of task runs completed across all tasks, split out by success or failure.

#### Example

```text
# HELP task_executor_total_runs_complete Total number of runs completed across all tasks, split out by success or failure.
# TYPE task_executor_total_runs_complete counter
task_executor_total_runs_complete{status="failed",task_type="system"} 1384
task_executor_total_runs_complete{status="success",task_type="system"} 6
--
```

### Task executor workers busy

Percent of total available workers that are currently busy.

#### Example

```text
# HELP task_executor_workers_busy Percent of total available workers that are currently busy
# TYPE task_executor_workers_busy gauge
task_executor_workers_busy 0
```

### Task scheduler current execution

Number of tasks currently being executed.

#### Example

```text
# HELP task_scheduler_current_execution Number of tasks currently being executed
# TYPE task_scheduler_current_execution gauge
task_scheduler_current_execution 128
```

### Task scheduler execute delta

Duration (in seconds) between a task run starting and finishing.

#### Example

```text
# HELP task_scheduler_execute_delta The duration in seconds between a run starting and finishing.
# TYPE task_scheduler_execute_delta summary
task_scheduler_execute_delta{quantile="0.5"} NaN
--
```

### Task scheduler schedule delay

Summary of the delay between when a task is scheduled to run and when it is told to execute.

#### Example

```text
# HELP task_scheduler_schedule_delay The duration between when a Item should be scheduled and when it is told to execute.
# TYPE task_scheduler_schedule_delay summary
task_scheduler_schedule_delay{quantile="0.5"} 120.001036
task_scheduler_schedule_delay{quantile="0.9"} 120.001074
task_scheduler_schedule_delay{quantile="0.99"} 120.001074
task_scheduler_schedule_delay_sum 720.0033010000001
task_scheduler_schedule_delay_count 6
--
```

### Task scheduler total execute failure

Number of times a scheduled task execution has failed.

#### Example

```text
# HELP task_scheduler_total_execute_failure Total number of times an execution has failed.
# TYPE task_scheduler_total_execute_failure counter
task_scheduler_total_execute_failure 0
```

### Task scheduler total execution calls

Number of scheduled executions across all tasks.

#### Example

```text
# HELP task_scheduler_total_execution_calls Total number of executions across all tasks.
# TYPE task_scheduler_total_execution_calls counter
task_scheduler_total_execution_calls 4806
```

### Task scheduler total release calls

Number of release requests.

#### Example

```text
# HELP task_scheduler_total_release_calls Total number of release requests.
# TYPE task_scheduler_total_release_calls counter
task_scheduler_total_release_calls 0
```

### Task scheduler total schedule calls

Number of schedule requests.

#### Example

```text
# HELP task_scheduler_total_schedule_calls Total number of schedule requests.
# TYPE task_scheduler_total_schedule_calls counter
task_scheduler_total_schedule_calls 6
```

### Task scheduler total schedule fails

Number of schedule requests that fail to schedule.

#### Example

```text
# HELP task_scheduler_total_schedule_fails Total number of schedule requests that fail to schedule.
# TYPE task_scheduler_total_schedule_fails counter
task_scheduler_total_schedule_fails 0
```
