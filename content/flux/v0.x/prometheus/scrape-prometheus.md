---
title: Scrape Prometheus metrics
description: >
  Use [`prometheus.scrape`](/flux/v0.x/stdlib/experimental/prometheus/scrape) to
  scrape Prometheus-formatted metrics from an HTTP-accessible endpoint using Flux.
menu:
  flux_0_x:
    parent: Work with Prometheus
weight: 101
flux/v0.x/tags: [prometheus]
related:
  - https://prometheus.io/docs/concepts/data_model/, Prometheus data model
  - /flux/v0.x/stdlib/experimental/prometheus/scrape/
  - /influxdb/cloud/process-data/manage-tasks/create-task/, Create an InfluxDB task
  - /{{< latest "influxdb" >}}/reference/prometheus-metrics/, InfluxDB Prometheus metric parsing formats
  - /influxdb/cloud/write-data/developer-tools/scrape-prometheus-metrics, Scrape Prometheus metrics with InfluxDB Cloud
  - /{{< latest "influxdb" >}}/write-data/developer-tools/scrape-prometheus-metrics, Scrape Prometheus metrics with InfluxDB OSS
---

To scrape [Prometheus-formatted metrics](https://prometheus.io/docs/concepts/data_model/) 
from an HTTP-accessible endpoint using Flux:

1. Import the [`experimental/prometheus` package](/flux/v0.x/stdlib/experimental/prometheus/).
2. Use [`prometheus.scrape`](/flux/v0.x/stdlib/experimental/prometheus/scrape/) and
   specify the **url** to scrape metrics from.

{{< keep-url >}}
```js
import "experimental/prometheus"

prometheus.scrape(url: "http://localhost:8086/metrics")
```

## Output structure
`prometheus.scrape()` returns a [stream of tables](/flux/v0.x/get-started/data-model/#stream-of-tables)
with the following columns:

- **_time**: Data timestamp
- **_measurement**: `prometheus`
- **_field**: [Prometheus metric name](https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels)
  _(`_bucket` is trimmed from histogram metric names)_
- **_value**: [Prometheus metric value](https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels)
- **url**: URL metrics were scraped from
- **Label columns**: A column for each [Prometheus label](https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels).
  The column label is the label name and the column value is the label value.

Tables are grouped by **_measurement**, **_field**, and **Label columns**.

{{% note %}}
#### Columns with the underscore prefix
Columns with the underscore (`_`) prefix are considered "system" columns.
Some Flux functions require these columns to function properly.
{{% /note %}}

### Example Prometheus query results
The following are example Prometheus metrics scraped from the **InfluxDB OSS 2.x `/metrics`** endpoint:

```sh
# HELP go_memstats_alloc_bytes_total Total number of bytes allocated, even if freed.
# TYPE go_memstats_alloc_bytes_total counter
go_memstats_alloc_bytes_total 1.42276424e+09
# HELP go_memstats_buck_hash_sys_bytes Number of bytes used by the profiling bucket hash table.
# TYPE go_memstats_buck_hash_sys_bytes gauge
go_memstats_buck_hash_sys_bytes 5.259247e+06
# HELP task_executor_run_latency_seconds Records the latency between the time the run was due to run and the time the task started execution, by task type
# TYPE task_executor_run_latency_seconds histogram
task_executor_run_latency_seconds_bucket{task_type="system",le="0.25"} 4413
task_executor_run_latency_seconds_bucket{task_type="system",le="0.5"} 11901
task_executor_run_latency_seconds_bucket{task_type="system",le="1"} 12565
task_executor_run_latency_seconds_bucket{task_type="system",le="2.5"} 12823
task_executor_run_latency_seconds_bucket{task_type="system",le="5"} 12844
task_executor_run_latency_seconds_bucket{task_type="system",le="10"} 12864
task_executor_run_latency_seconds_bucket{task_type="system",le="+Inf"} 74429
task_executor_run_latency_seconds_sum{task_type="system"} 4.256783538679698e+11
task_executor_run_latency_seconds_count{task_type="system"} 74429
# HELP task_executor_run_duration The duration in seconds between a run starting and finishing.
# TYPE task_executor_run_duration summary
task_executor_run_duration{taskID="00xx0Xx0xx00XX0x0",task_type="threshold",quantile="0.5"} 5.178160855
task_executor_run_duration{taskID="00xx0Xx0xx00XX0x0",task_type="threshold",quantile="0.9"} 5.178160855
task_executor_run_duration{taskID="00xx0Xx0xx00XX0x0",task_type="threshold",quantile="0.99"} 5.178160855
task_executor_run_duration_sum{taskID="00xx0Xx0xx00XX0x0",task_type="threshold"} 2121.9758301650004
task_executor_run_duration_count{taskID="00xx0Xx0xx00XX0x0",task_type="threshold"} 570
```

When scraped by Flux, these metrics return the following stream of tables:

| _time                     | _measurement | url                           | _field                        |       _value |
| :------------------------ | :----------- | :---------------------------- | :---------------------------- | -----------: |
| {{< flux/current-time >}} | prometheus   | http://localhost:8086/metrics | go_memstats_alloc_bytes_total | 1422764240.0 |

| _time                     | _measurement | url                           | _field                          |    _value |
| :------------------------ | :----------- | :---------------------------- | :------------------------------ | --------: |
| {{< flux/current-time >}} | prometheus   | http://localhost:8086/metrics | go_memstats_buck_hash_sys_bytes | 5259247.0 |

| _time                     | _measurement | task_type | url                           | le   | _field                            | _value |
| :------------------------ | :----------- | :-------- | :---------------------------- | :--- | :-------------------------------- | -----: |
| {{< flux/current-time >}} | prometheus   | system    | http://localhost:8086/metrics | 0.25 | task_executor_run_latency_seconds |   4413 |

| _time                     | _measurement | task_type | url                           | le  | _field                            | _value |
| :------------------------ | :----------- | :-------- | :---------------------------- | :-- | :-------------------------------- | -----: |
| {{< flux/current-time >}} | prometheus   | system    | http://localhost:8086/metrics | 0.5 | task_executor_run_latency_seconds |  11901 |

| _time                     | _measurement | task_type | url                           | le  | _field                            | _value |
| :------------------------ | :----------- | :-------- | :---------------------------- | :-- | :-------------------------------- | -----: |
| {{< flux/current-time >}} | prometheus   | system    | http://localhost:8086/metrics | 1   | task_executor_run_latency_seconds |  12565 |

| _time                     | _measurement | task_type | url                           | le  | _field                            | _value |
| :------------------------ | :----------- | :-------- | :---------------------------- | :-- | :-------------------------------- | -----: |
| {{< flux/current-time >}} | prometheus   | system    | http://localhost:8086/metrics | 2.5 | task_executor_run_latency_seconds |  12823 |

| _time                     | _measurement | task_type | url                           | le  | _field                            | _value |
| :------------------------ | :----------- | :-------- | :---------------------------- | :-- | :-------------------------------- | -----: |
| {{< flux/current-time >}} | prometheus   | system    | http://localhost:8086/metrics | 5   | task_executor_run_latency_seconds |  12844 |

| _time                     | _measurement | task_type | url                           | le   | _field                            | _value |
| :------------------------ | :----------- | :-------- | :---------------------------- | :--- | :-------------------------------- | -----: |
| {{< flux/current-time >}} | prometheus   | system    | http://localhost:8086/metrics | +Inf | task_executor_run_latency_seconds |  74429 |

| _time                     | _measurement | task_type | url                           | _field                                |            _value |
| :------------------------ | :----------- | :-------- | :---------------------------- | :------------------------------------ | ----------------: |
| {{< flux/current-time >}} | prometheus   | system    | http://localhost:8086/metrics | task_executor_run_latency_seconds_sum | 425678353867.9698 |

| _time                     | _measurement | task_type | url                           | _field                                  | _value |
| :------------------------ | :----------- | :-------- | :---------------------------- | :-------------------------------------- | -----: |
| {{< flux/current-time >}} | prometheus   | system    | http://localhost:8086/metrics | task_executor_run_latency_seconds_count |  74429 |

| _time                     | _measurement | task_type | taskID            | url                           | quantile | _field                     |      _value |
| :------------------------ | :----------- | :-------- | :---------------- | :---------------------------- | :------- | :------------------------- | ----------: |
| {{< flux/current-time >}} | prometheus   | threshold | 00xx0Xx0xx00XX0x0 | http://localhost:8086/metrics | 0.5      | task_executor_run_duration | 5.178160855 |

| _time                     | _measurement | task_type | taskID            | url                           | quantile | _field                     |      _value |
| :------------------------ | :----------- | :-------- | :---------------- | :---------------------------- | :------- | :------------------------- | ----------: |
| {{< flux/current-time >}} | prometheus   | threshold | 00xx0Xx0xx00XX0x0 | http://localhost:8086/metrics | 0.9      | task_executor_run_duration | 5.178160855 |

| _time                     | _measurement | task_type | taskID            | url                           | quantile | _field                     |      _value |
| :------------------------ | :----------- | :-------- | :---------------- | :---------------------------- | :------- | :------------------------- | ----------: |
| {{< flux/current-time >}} | prometheus   | threshold | 00xx0Xx0xx00XX0x0 | http://localhost:8086/metrics | 0.99     | task_executor_run_duration | 5.178160855 |

| _time                     | _measurement | task_type | taskID            | url                           | _field                         |             _value |
| :------------------------ | :----------- | :-------- | :---------------- | :---------------------------- | :----------------------------- | -----------------: |
| {{< flux/current-time >}} | prometheus   | threshold | 00xx0Xx0xx00XX0x0 | http://localhost:8086/metrics | task_executor_run_duration_sum | 2121.9758301650004 |

| _time                     | _measurement | task_type | taskID            | url                           | _field                           | _value |
| :------------------------ | :----------- | :-------- | :---------------- | :---------------------------- | :------------------------------- | -----: |
| {{< flux/current-time >}} | prometheus   | threshold | 00xx0Xx0xx00XX0x0 | http://localhost:8086/metrics | task_executor_run_duration_count |    570 |

{{% note %}}
#### Different data structures for scraped Prometheus metrics
[Telegraf](/{{< latest "telegraf" >}}/) and [InfluxDB](/{{< latest "influxdb" >}}/) 
provide tools that scrape Prometheus metrics and store them in InfluxDB.
Depending on the tool and and configuration you use to scrape metrics, 
the resulting data structure may differ than the structure returned by `prometheus.scrape()`
described [above](#output-structure).

For information about the different data structures of scraped Prometheus metrics
stored in InfluxDB, see [InfluxDB Prometheus metric parsing formats](/{{< latest "influxdb" >}}/reference/prometheus-metrics/).
{{% /note %}}

## Write Prometheus metrics to InfluxDB
To write scraped Prometheus metrics to InfluxDB:

1. Use [`prometheus.scrape`](/flux/v0.x/stdlib/experimental/prometheus/scrape)
   to scrape Prometheus metrics.
2. Use [`to()`](/flux/v0.x/stdlib/influxdata/influxdb/to/) to write the scraped
   metrics to InfluxDB.

```js
import "experimental/prometheus"
  
prometheus.scrape(url: "http://example.com/metrics")
  |> to(
    bucket: "example-bucket",
    host: "http://localhost:8086",
    org: "example-org",
    token: "mYsuP3R5eCR37t0K3n"  
  )
```

### Write Prometheus metrics to InfluxDB at regular intervals
To scrape Prometheus metrics and write them to InfluxDB at regular intervals,
scrape Prometheus metrics in an [InfluxDB task](/influxdb/cloud/process-data/get-started/).

```js
import "experimental/prometheus"

option task = {
  name: "Scrape Prometheus metrics",
  every: 10s
}
  
prometheus.scrape(url: "http://example.com/metrics")
  |> to(bucket: "example-bucket")
```
