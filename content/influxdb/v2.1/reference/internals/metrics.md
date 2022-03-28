---
title: InfluxDB OSS metrics
description: >
 Get metrics about the workload performance of an InfluxDB OSS instance.
menu:
 influxdb_2_1_ref:
   parent: InfluxDB internals
   name: Metrics
influxdb/v2.1/tags: [cpu, memory, metrics, performance, Prometheus, usage]
---
Get metrics about the workload performance of an InfluxDB OSS instance.

InfluxDB OSS exposes a `/metrics` endpoint that returns
performance, resource, and usage metrics formatted in the [Prometheus plain-text exposition format](https://prometheus.io/docs/instrumenting/exposition_formats).

[{{< api-endpoint method="GET" endpoint="http://localhost:8086/metrics" >}}](/influxdb/v2.1/api/#operation/GetMetrics)

Metrics contain a name, an optional set of key-value pairs, and a value.

The following descriptors precede each metric:

- `HELP`: description of the metric
- `TYPE`: [Prometheus metric type](https://prometheus.io/docs/concepts/metric_types/) (`counter`, `gauge`, `histogram`, or `summary`)

#### Example

```sh
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
- [InfluxDB tasks](#influxdb-task-statistics)

## Boltdb statistics

### Reads total

Total number of boltdb reads.

#### Example

```sh
# HELP boltdb_reads_total Total number of boltdb reads
# TYPE boltdb_reads_total counter
boltdb_reads_total 75129
```
### Writes total

Total number of boltdb writes.

#### Example

```sh
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

```sh
# HELP go_gc_duration_seconds A summary of the pause duration of garbage collection cycles.
# TYPE go_gc_duration_seconds summary
go_gc_duration_seconds{quantile="0"} 5.1467e-05
--
```

### Goroutines

Number of goroutines that currently exist.

#### Example

```sh
# HELP go_goroutines Number of goroutines that currently exist.
# TYPE go_goroutines gauge
go_goroutines 1566
```

### Info

Information about the Go environment.

#### Example

```sh
# HELP go_info Information about the Go environment.
# TYPE go_info gauge
go_info{version="go1.17"} 1
```

### Memory allocated bytes

Number of bytes allocated and still in use.

#### Example

```sh
# HELP go_memstats_alloc_bytes Number of bytes allocated and still in use.
# TYPE go_memstats_alloc_bytes gauge
go_memstats_alloc_bytes 2.27988488e+08
```

### Memory allocated bytes total

Total number of bytes allocated, even if freed.

#### Example

```sh
# HELP go_memstats_alloc_bytes_total Total number of bytes allocated, even if freed.
# TYPE go_memstats_alloc_bytes_total counter
go_memstats_alloc_bytes_total 9.68016566648e+11
```

### Memory bucket hash system bytes

Number of bytes used by the profiling bucket hash table.

#### Example

```sh
# HELP go_memstats_buck_hash_sys_bytes Number of bytes used by the profiling bucket hash table.
# TYPE go_memstats_buck_hash_sys_bytes gauge
go_memstats_buck_hash_sys_bytes 1.0067613e+07
```

### Memory frees total

Total number of frees.

#### Example

```sh
# HELP go_memstats_frees_total Total number of frees.
# TYPE go_memstats_frees_total counter
go_memstats_frees_total 1.3774541795e+10
```

### Memory GC (garbage collection) CPU fraction

Fraction of this program's available CPU time used by the GC since the program started.

#### Example

```sh
# HELP go_memstats_gc_cpu_fraction The fraction of this program's available CPU time used by the GC since the program started.
# TYPE go_memstats_gc_cpu_fraction gauge
go_memstats_gc_cpu_fraction 0.011634918451016558
```

### Memory GC (garbage collection) system bytes

Number of bytes used for garbage collection system metadata.

#### Example

```sh
# HELP go_memstats_gc_sys_bytes Number of bytes used for garbage collection system metadata.
# TYPE go_memstats_gc_sys_bytes gauge
go_memstats_gc_sys_bytes 4.63048016e+08
```

### Memory heap allocated bytes

Number of heap bytes allocated and still in use.

#### Example

```sh
# HELP go_memstats_heap_alloc_bytes Number of heap bytes allocated and still in use.
# TYPE go_memstats_heap_alloc_bytes gauge
go_memstats_heap_alloc_bytes 2.27988488e+08
```

### Memory heap idle bytes

Number of heap bytes waiting to be used.

#### Example

```sh
# HELP go_memstats_heap_idle_bytes Number of heap bytes waiting to be used.
# TYPE go_memstats_heap_idle_bytes gauge
go_memstats_heap_idle_bytes 1.0918273024e+10
```

### Memory heap in use bytes

Number of heap bytes that are in use.

#### Example

```sh
# HELP go_memstats_heap_inuse_bytes Number of heap bytes that are in use.
# TYPE go_memstats_heap_inuse_bytes gauge
go_memstats_heap_inuse_bytes 3.5975168e+08
```

### Memory heap objects

Number of allocated objects.
_Allocated_ heap objects include all reachable objects, as
well as unreachable objects that the garbage collector has not yet freed.

#### Example

```sh
# HELP go_memstats_heap_objects Number of allocated objects.
# TYPE go_memstats_heap_objects gauge
go_memstats_heap_objects 2.404017e+06
```

### Memory heap released bytes

Number of heap bytes released to the OS.

#### Example

```sh
# HELP go_memstats_heap_released_bytes Number of heap bytes released to OS.
# TYPE go_memstats_heap_released_bytes gauge
go_memstats_heap_released_bytes 2.095038464e+09
```

### Memory heap system bytes

Number of heap bytes obtained from the system.

#### Example

```sh
# HELP go_memstats_heap_sys_bytes Number of heap bytes obtained from system.
# TYPE go_memstats_heap_sys_bytes gauge
go_memstats_heap_sys_bytes 1.1278024704e+10
```

### Memory last GC (garbage collection) time seconds

Number of seconds since 1970 of the last garbage collection.

#### Example

```sh
# HELP go_memstats_last_gc_time_seconds Number of seconds since 1970 of last garbage collection.
# TYPE go_memstats_last_gc_time_seconds gauge
go_memstats_last_gc_time_seconds 1.64217120199452e+09
```

### Memory lookups total

Total number of pointer lookups.

#### Example

```sh
# HELP go_memstats_lookups_total Total number of pointer lookups.
# TYPE go_memstats_lookups_total counter
go_memstats_lookups_total 0
```

### Memory allocations total

Cumulative count of heap objects allocated.

#### Example

```sh
# HELP go_memstats_mallocs_total Total number of mallocs.
# TYPE go_memstats_mallocs_total counter
go_memstats_mallocs_total 1.3776945812e+10
```

### Memory mcache in use bytes

Number of bytes in use by mcache structures.

#### Example

```sh
# HELP go_memstats_mcache_inuse_bytes Number of bytes in use by mcache structures.
# TYPE go_memstats_mcache_inuse_bytes gauge
go_memstats_mcache_inuse_bytes 9600
```

### Memory mcache system bytes

Number of bytes used for mcache structures obtained from system.

#### Example

```sh
# HELP go_memstats_mcache_sys_bytes Number of bytes used for mcache structures obtained from system.
# TYPE go_memstats_mcache_sys_bytes gauge
go_memstats_mcache_sys_bytes 16384
```

### Memory mspan in use bytes

Number of bytes of allocated mspan structures.

#### Example

```sh
# HELP go_memstats_mspan_inuse_bytes Number of bytes in use by mspan structures.
# TYPE go_memstats_mspan_inuse_bytes gauge
go_memstats_mspan_inuse_bytes 4.199e+06
```

### Memory mspan system bytes

Bytes of memory obtained from the OS for mspan structures.

#### Example

```sh
# HELP go_memstats_mspan_sys_bytes Number of bytes used for mspan structures obtained from system.
# TYPE go_memstats_mspan_sys_bytes gauge
go_memstats_mspan_sys_bytes 1.65609472e+08
```

### Memory next GC (garbage collection) bytes

Number of heap bytes when next garbage collection will take place.

#### Example

```sh
# HELP go_memstats_next_gc_bytes Number of heap bytes when next garbage collection will take place.
# TYPE go_memstats_next_gc_bytes gauge
go_memstats_next_gc_bytes 4.45628016e+08
```

### Memory other system bytes

Number of bytes used for other system allocations.

#### Example

```sh
# HELP go_memstats_other_sys_bytes Number of bytes used for other system allocations.
# TYPE go_memstats_other_sys_bytes gauge
go_memstats_other_sys_bytes 8.1917722e+07
```

### Memory stack in use bytes

Number of bytes in use by the stack allocator.

#### Example

```sh
# HELP go_memstats_stack_inuse_bytes Number of bytes in use by the stack allocator.
# TYPE go_memstats_stack_inuse_bytes gauge
go_memstats_stack_inuse_bytes 8.84736e+06
```

### Memory stack system bytes

Number of bytes obtained from system for stack allocator.

#### Example

```sh
# HELP go_memstats_stack_sys_bytes Number of bytes obtained from system for stack allocator.
# TYPE go_memstats_stack_sys_bytes gauge
go_memstats_stack_sys_bytes 8.84736e+06
```

### Memory system bytes

Number of bytes obtained from system.

#### Example

```sh
# HELP go_memstats_sys_bytes Number of bytes obtained from system.
# TYPE go_memstats_sys_bytes gauge
go_memstats_sys_bytes 1.2007531271e+10
```

### Threads

Number of OS threads created.

#### Example

```sh
# HELP go_threads Number of OS threads created.
# TYPE go_threads gauge
go_threads 27
```

## HTTP API statistics

### API request duration seconds

How long InfluxDB took to respond to the HTTP request.

#### Example

```sh
# HELP http_api_request_duration_seconds Time taken to respond to HTTP request
# TYPE http_api_request_duration_seconds histogram
http_api_request_duration_seconds_bucket{handler="platform",method="DELETE",path="/api/v2/authorizations/:id",response_code="204",status="2XX",user_agent="Chrome",le="0.005"} 0
--
```

### API requests total

Number of HTTP requests received.

#### Example

```sh
# HELP http_api_requests_total Number of http requests received
# TYPE http_api_requests_total counter
http_api_requests_total{handler="platform",method="DELETE",path="/api/v2/authorizations/:id",response_code="204",status="2XX",user_agent="Chrome"} 1
--
```

### Query request bytes

Count of bytes received.

#### Example

```sh
# HELP http_query_request_bytes Count of bytes received
# TYPE http_query_request_bytes counter
http_query_request_bytes{endpoint="/api/v2/query",org_id="48c88459ee424a04",status="200"} 727
```

### Query request count

Total number of query requests.

#### Example

```sh
# HELP http_query_request_count Total number of query requests
# TYPE http_query_request_count counter
http_query_request_count{endpoint="/api/v2/query",org_id="48c88459ee424a04",status="200"} 2
```

### Query response bytes

Count of bytes returned by the query endpoint.

#### Example

```sh
# HELP http_query_response_bytes Count of bytes returned
# TYPE http_query_response_bytes counter
http_query_response_bytes{endpoint="/api/v2/query",org_id="48c88459ee424a04",status="200"} 103
```

## InfluxDB object and query statistics

### Buckets total

Total number of buckets on the server.

#### Example

```sh
# HELP influxdb_buckets_total Number of total buckets on the server
# TYPE influxdb_buckets_total counter
influxdb_buckets_total 9
```

### Dashboards total

Total number of dashboards on the server.

#### Example

```sh
# HELP influxdb_dashboards_total Number of total dashboards on the server
# TYPE influxdb_dashboards_total counter
influxdb_dashboards_total 2
```

### Info

Information about the InfluxDB environment.

#### Example

```sh
# HELP influxdb_info Information about the influxdb environment.
# TYPE influxdb_info gauge
influxdb_info{arch="amd64",build_date="2021-12-28T22:12:40Z",commit="657e1839de",cpus="8",os="darwin",version="v2.1.1"} 1
```

### Organizations total

Total number of organizations on the server.

#### Example

```sh
# HELP influxdb_organizations_total Number of total organizations on the server
# TYPE influxdb_organizations_total counter
influxdb_organizations_total 2
```

### Scrapers total

Total number of scrapers on the server.

#### Example

```sh
# HELP influxdb_scrapers_total Number of total scrapers on the server
# TYPE influxdb_scrapers_total counter
influxdb_scrapers_total 0
```

### Telegrafs total

Total number of Telegraf configurations on the server.

#### Example

```sh
# HELP influxdb_telegrafs_total Number of total telegraf configurations on the server
# TYPE influxdb_telegrafs_total counter
influxdb_telegrafs_total 0
```

### Token services total

Total number of API tokens on the server.

#### Example

```sh
# HELP influxdb_tokens_total Number of total tokens on the server
# TYPE influxdb_tokens_total counter
influxdb_tokens_total 23
```

### Uptime seconds

InfluxDB process uptime in seconds.

#### Example

```sh
# HELP influxdb_uptime_seconds influxdb process uptime in seconds
# TYPE influxdb_uptime_seconds gauge
influxdb_uptime_seconds{id="077238f9ca108000"} 343354.914499305
```

### Users total

Total number of users on the server.

#### Example

```sh
# HELP influxdb_users_total Number of total users on the server
# TYPE influxdb_users_total counter
influxdb_users_total 84
```

## QC (query controller) statistics

### All active

Number of queries in all states.

#### Example

```sh
# HELP qc_all_active Number of queries in all states
# TYPE qc_all_active gauge
qc_all_active{org="48c88459ee424a04"} 0
--
```

### All duration seconds

Total time spent in all query states.

#### Example

```sh
# HELP qc_all_duration_seconds Histogram of total times spent in all query states
# TYPE qc_all_duration_seconds histogram
qc_all_duration_seconds_bucket{org="48c88459ee424a04",le="0.001"} 0
--
```

### Compiling active

Number of queries actively compiling.

#### Example

```sh
# HELP qc_compiling_active Number of queries actively compiling
# TYPE qc_compiling_active gauge
qc_compiling_active{compiler_type="ast",org="ed32b47572a0137b"} 0
--
```

### Compiling duration seconds

Histogram of times spent compiling queries.

#### Example

```sh
# HELP qc_compiling_duration_seconds Histogram of times spent compiling queries
# TYPE qc_compiling_duration_seconds histogram
qc_compiling_duration_seconds_bucket{compiler_type="ast",org="ed32b47572a0137b",le="0.001"} 999
--
```

### Executing active

Number of queries actively executing.

#### Example

```sh
# HELP qc_executing_active Number of queries actively executing
# TYPE qc_executing_active gauge
qc_executing_active{org="48c88459ee424a04"} 0
--
```

### Executing duration seconds

Histogram of times spent executing queries.

#### Example

```sh
# HELP qc_executing_duration_seconds Histogram of times spent executing queries
# TYPE qc_executing_duration_seconds histogram
qc_executing_duration_seconds_bucket{org="48c88459ee424a04",le="0.001"} 0
--
```

### Memory unused bytes

Free memory as seen by the internal memory manager.

#### Example

```sh
# HELP qc_memory_unused_bytes The free memory as seen by the internal memory manager
# TYPE qc_memory_unused_bytes gauge
qc_memory_unused_bytes{org="48c88459ee424a04"} 0
--
```

### Queueing active

Number of queries actively queueing.

#### Example

```sh
# HELP qc_queueing_active Number of queries actively queueing
# TYPE qc_queueing_active gauge
qc_queueing_active{org="48c88459ee424a04"} 0
--
```

### Queueing duration seconds

Histogram of times spent queueing queries.

#### Example

```sh
# HELP qc_queueing_duration_seconds Histogram of times spent queueing queries
# TYPE qc_queueing_duration_seconds histogram
qc_queueing_duration_seconds_bucket{org="48c88459ee424a04",le="0.001"} 2
--
```

### Requests total

Count of the query requests.

#### Example

```sh
# HELP qc_requests_total Count of the query requests
# TYPE qc_requests_total counter
qc_requests_total{org="48c88459ee424a04",result="success"} 2
--
```

### Read request duration

Histogram of times spent in read requests.

#### Example

```sh
# HELP query_influxdb_source_read_request_duration_seconds Histogram of times spent in read requests
# TYPE query_influxdb_source_read_request_duration_seconds histogram
query_influxdb_source_read_request_duration_seconds_bucket{op="readTagKeys",org="48c88459ee424a04",le="0.001"} 0
--
```

## InfluxDB service statistics

### Bucket service new call total

Number of calls to the bucket creation service.

#### Example

```sh
# HELP service_bucket_new_call_total Number of calls
# TYPE service_bucket_new_call_total counter
service_bucket_new_call_total{method="find_bucket"} 6177
--
```

### Bucket service new duration

Duration of calls to the bucket creation service.

#### Example

```sh
# HELP service_bucket_new_duration Duration of calls
# TYPE service_bucket_new_duration histogram
service_bucket_new_duration_bucket{method="find_bucket",le="0.005"} 5876
--
```

### Bucket service new error total

Number of errors encountered by the bucket creation service.

#### Example

```sh
# HELP service_bucket_new_error_total Number of errors encountered
# TYPE service_bucket_new_error_total counter
service_bucket_new_error_total{code="not found",method="find_bucket_by_id"} 76
```

### Onboard service new call total

Number of calls to the onboarding service.

#### Example

```sh
# HELP service_onboard_new_call_total Number of calls
# TYPE service_onboard_new_call_total counter
service_onboard_new_call_total{method="is_onboarding"} 11
```

### Onboard service new duration

Duration of calls to the onboarding service.

#### Example

```sh
# HELP service_onboard_new_duration Duration of calls
# TYPE service_onboard_new_duration histogram
service_onboard_new_duration_bucket{method="is_onboarding",le="0.005"} 11
--
```

### Organization service call total

Number of calls to the organization service.

#### Example

```sh
# HELP service_org_call_total Number of calls
# TYPE service_org_call_total counter
service_org_call_total{method="find_labels_for_resource"} 10
```

### Organization service duration

Duration of calls to the organization service.

#### Example

```sh
# HELP service_org_duration Duration of calls
# TYPE service_org_duration histogram
service_org_duration_bucket{method="find_labels_for_resource",le="0.005"} 10
--
```

### Organization service new call total

Number of calls to the organization creation service.

#### Example

```sh
# HELP service_org_new_call_total Number of calls
# TYPE service_org_new_call_total counter
service_org_new_call_total{method="find_org"} 1572
--
```

### Organization service new duration

Duration of calls to the organization creation service.

#### Example

```sh
# HELP service_org_new_duration Duration of calls
# TYPE service_org_new_duration histogram
service_org_new_duration_bucket{method="find_org",le="0.005"} 1475
--
```

### Organization service new error total

Number of errors encountered by the organization creation service.

#### Example

```sh
# HELP service_org_new_error_total Number of errors encountered
# TYPE service_org_new_error_total counter
service_org_new_error_total{code="not found",method="find_orgs"} 1
```

### Password service new call total

Number of calls to the password creation service.

#### Example

```sh
# HELP service_password_new_call_total Number of calls
# TYPE service_password_new_call_total counter
service_password_new_call_total{method="compare_password"} 4
```

### Password service new duration

Duration of calls to the password creation service.

#### Example

```sh
# HELP service_password_new_duration Duration of calls
# TYPE service_password_new_duration histogram
service_password_new_duration_bucket{method="compare_password",le="0.005"} 0
--
```

### Password service new error total

Number of errors encountered by the password creation service.

#### Example

```sh
# HELP service_password_new_error_total Number of errors encountered
# TYPE service_password_new_error_total counter
service_password_new_error_total{code="forbidden",method="compare_password"} 1
```

### Pkger service call total

Number of calls to the `pkger` service.

#### Example

```sh
# HELP service_pkger_call_total Number of calls
# TYPE service_pkger_call_total counter
service_pkger_call_total{method="export"} 3
```

### Pkger service duration

Duration of calls to the `pkger` service.

#### Example

```sh
# HELP service_pkger_duration Duration of calls
# TYPE service_pkger_duration histogram
service_pkger_duration_bucket{method="export",le="0.005"} 0
--
```

### Pkger service template export

Metrics for exported resources.

#### Example

```sh
# HELP service_pkger_template_export Metrics for resources being exported
# TYPE service_pkger_template_export counter
service_pkger_template_export{buckets="0",by_stack="false",checks="0",dashboards="0",endpoints="0",label_mappings="0",labels="0",method="export",num_org_ids="1",rules="0",tasks="0",telegraf_configs="0",variables="0"} 3
```

### Session service call total

Number of calls to the session service.

#### Example

```sh
# HELP service_session_call_total Number of calls
# TYPE service_session_call_total counter
service_session_call_total{method="create_session"} 3
--
```

### Session service duration

Duration of calls to the session service.

#### Example

```sh
# HELP service_session_duration Duration of calls
# TYPE service_session_duration histogram
service_session_duration_bucket{method="create_session",le="0.005"} 3
--
```

### Session service error total

Number of errors encountered by the session service.

#### Example

```sh
# HELP service_session_error_total Number of errors encountered
# TYPE service_session_error_total counter
service_session_error_total{code="not found",method="find_session"} 4
```

### Token service call total

Number of calls to the token service.

#### Example

```sh
# HELP service_token_call_total Number of calls
# TYPE service_token_call_total counter
service_token_call_total{method="delete_authorization"} 3
--
```

### Token service duration

Duration of calls to the token service.

#### Example

```sh
# HELP service_token_duration Duration of calls
# TYPE service_token_duration histogram
service_token_duration_bucket{method="delete_authorization",le="0.005"} 1
--
```

### Token service error total

Number of errors encountered by the token service.

#### Example

```sh
# HELP service_token_error_total Number of errors encountered
# TYPE service_token_error_total counter
service_token_error_total{code="not found",method="delete_authorization"} 1
```

### URM new call total
Number of calls to the URM (unified resource management) creation service.

#### Example

```sh
# HELP service_urm_new_call_total Number of calls
# TYPE service_urm_new_call_total counter
service_urm_new_call_total{method="find_urms"} 6451
```

### urm new duration
Duration of calls to the URM creation service.

#### Example

```sh
# HELP service_urm_new_duration Duration of calls
# TYPE service_urm_new_duration histogram
service_urm_new_duration_bucket{method="find_urms",le="0.005"} 6198
--
```

### User new call total
Number of calls to the user creation service.

#### Example

```sh
# HELP service_user_new_call_total Number of calls
# TYPE service_user_new_call_total counter
service_user_new_call_total{method="find_permission_for_user"} 4806
--
```

### User new duration
Duration of calls  to the user creation service.

#### Example

```sh
# HELP service_user_new_duration Duration of calls
# TYPE service_user_new_duration histogram
service_user_new_duration_bucket{method="find_permission_for_user",le="0.005"} 4039
--
```

## InfluxDB task statistics

### Task executor errors counter

Number of errors thrown by the executor with the type of error (ex. Invalid, Internal, etc.)

#### Example

```sh
# HELP task_executor_errors_counter The number of errors thrown by the executor with the type of error (ex. Invalid, Internal, etc.)
# TYPE task_executor_errors_counter counter
task_executor_errors_counter{errorType="internal error",task_type="system"} 1183
--
```

### Task executor promise queue usage

Percent of the promise queue that is currently full.

#### Example

```sh
# HELP task_executor_promise_queue_usage Percent of the promise queue that is currently full
# TYPE task_executor_promise_queue_usage gauge
task_executor_promise_queue_usage 0
```

### Task executor run duration

Duration (in seconds) between a task run starting and finishing.

#### Example

```sh
# HELP task_executor_run_duration The duration in seconds between a run starting and finishing.
# TYPE task_executor_run_duration summary
task_executor_run_duration{taskID="08017725990f6000",task_type="",quantile="0.5"} NaN
--
```

### Task executor run latency seconds

Latency between the task run's scheduled start time and the execution time, by task type.

#### Example

```sh
# HELP task_executor_run_latency_seconds Records the latency between the time the run was due to run and the time the task started execution, by task type
# TYPE task_executor_run_latency_seconds histogram
task_executor_run_latency_seconds_bucket{task_type="system",le="0.005"} 0
--
```

### Task executor run queue delta

Duration (in seconds) between the task run's scheduled start time and the execution time.

#### Example

```sh
# HELP task_executor_run_queue_delta The duration in seconds between a run being due to start and actually starting.
# TYPE task_executor_run_queue_delta summary
task_executor_run_queue_delta{taskID="08017725990f6000",task_type="",quantile="0.5"} NaN
--
```

### Task executor total runs active

Total number of workers currently running tasks.

#### Example

```sh
# HELP task_executor_total_runs_active Total number of workers currently running tasks
# TYPE task_executor_total_runs_active gauge
task_executor_total_runs_active 0
```

### Task executor total runs complete

Total number of task runs completed across all tasks, split out by success or failure.

#### Example

```sh
# HELP task_executor_total_runs_complete Total number of runs completed across all tasks, split out by success or failure.
# TYPE task_executor_total_runs_complete counter
task_executor_total_runs_complete{status="failed",task_type="system"} 1384
--
```

### Task executor workers busy

Percent of total available workers that are currently busy.

#### Example

```sh
# HELP task_executor_workers_busy Percent of total available workers that are currently busy
# TYPE task_executor_workers_busy gauge
task_executor_workers_busy 0
```

### Task scheduler current execution

Number of tasks currently being executed.

#### Example

```sh
# HELP task_scheduler_current_execution Number of tasks currently being executed
# TYPE task_scheduler_current_execution gauge
task_scheduler_current_execution 128
```

### Task scheduler execute delta

Duration (in seconds) between a task run starting and finishing.

#### Example

```sh
# HELP task_scheduler_execute_delta The duration in seconds between a run starting and finishing.
# TYPE task_scheduler_execute_delta summary
task_scheduler_execute_delta{quantile="0.5"} NaN
--
```

### Task scheduler schedule delay

Delay between when a task is scheduled to run and when it is told to execute.

#### Example

```sh
# HELP task_scheduler_schedule_delay The duration between when a Item should be scheduled and when it is told to execute.
# TYPE task_scheduler_schedule_delay summary
task_scheduler_schedule_delay{quantile="0.5"} NaN
--
```

### Task scheduler total execute failure

Total number of times a scheduled task execution has failed.

#### Example

```sh
# HELP task_scheduler_total_execute_failure Total number of times an execution has failed.
# TYPE task_scheduler_total_execute_failure counter
task_scheduler_total_execute_failure 0
```

### Task scheduler total execution calls

Total number of scheduled executions across all tasks.

#### Example

```sh
# HELP task_scheduler_total_execution_calls Total number of executions across all tasks.
# TYPE task_scheduler_total_execution_calls counter
task_scheduler_total_execution_calls 4806
```

### Task scheduler total release calls

Total number of release requests.

#### Example

```sh
# HELP task_scheduler_total_release_calls Total number of release requests.
# TYPE task_scheduler_total_release_calls counter
task_scheduler_total_release_calls 0
```

### Task scheduler total schedule calls

Total number of schedule requests.

#### Example

```sh
# HELP task_scheduler_total_schedule_calls Total number of schedule requests.
# TYPE task_scheduler_total_schedule_calls counter
task_scheduler_total_schedule_calls 6
```

### Task scheduler total schedule fails

Total number of schedule requests that fail to schedule.

#### Example

```sh
# HELP task_scheduler_total_schedule_fails Total number of schedule requests that fail to schedule.
# TYPE task_scheduler_total_schedule_fails counter
task_scheduler_total_schedule_fails 0
```
