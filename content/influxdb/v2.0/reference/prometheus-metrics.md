---
title: Prometheus metric parsing formats
description: >
  ...
menu:
  influxdb_2_0_ref:
    name: Prometheus metrics
weight: 8
influxdb/v2.0/tags: [prometheus]
related:
  - https://prometheus.io/docs/concepts/data_model/, Prometheus data model
  - /influxdb/v2.0/write-data/developer-tools/scrape-prometheus-metrics/
  - /{{< latest "flux" >}}/stdlib/experimental/prometheus/scrape/
---

When scraping [Prometheus-formatted metrics](https://prometheus.io/docs/concepts/data_model/)
and writing them to InfluxDB, metrics are parsed and stored in InfluxDB in different formats.
The following formats are available:

- [Format version 1](#version-1)
- [Format version 2](#version-2)

The format used depends on the tool and associated configuration used to scrape the metrics.

{{% oss-only %}}

| Scraping mechanism                                                                     |   Format version |
| :------------------------------------------------------------------------------------- | ---------------: |
| **Telegraf Prometheus plugin** with `metric_version = 1`                               | Format version 1 |
| **Telegraf Prometheus plugin** with `metric_version = 2`                               | Format version 2 |
| **InfluxDB scraper**                                                                   | Format version 1 |
| [`prometheus.scrape()`]({{< latest "flux" >}}/stdlib/experimental/prometheus/scrape/): | Format version 2 |

{{% /oss-only %}}
{{% cloud-only %}}

- **Telegraf** with `metric_version = 1`: Format version 1
- **Telegraf** with `metric_version = 2`: Format version 2
- [`prometheus.scrape()`]({{< latest "flux" >}}/stdlib/experimental/prometheus/scrape/):
  Format version 2

{{% /cloud-only %}}

## Metrics format version 1

- **_time**: timestamp
- **_measurement**: [Prometheus metric name](https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels)
  _(`_bucket`, `_sum`, and `_count` are trimmed from histogram and summary metric names)_
- **\_field**: _depends on the [Prometheus metric type](https://prometheus.io/docs/concepts/metric_types/)_
  - Counter: `counter`
  - Gauge: `gauge`
  - Histogram: _histogram bucket upper limits_, `count`, `sum`
  - Summary: _summary quantiles_, `count`, `sum`
- **_value**: [Prometheus metric value](https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels)
- **tags**: A tag for each [Prometheus label](https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels)
  _(except for histogram bucket upper limits (`le`) or summary quantiles (`quantile`))_.
  The label name is the tag key and the label value is the tag value.

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

#### Resulting line protocol
```
go_memstats_alloc_bytes_total counter=1.42276424e+09
go_memstats_buck_hash_sys_bytes gauge=5.259247e+06
task_executor_run_latency_seconds,task_type=system 0.25=4413,0.5=11901,1=12565,2.5=12823,5=12844,10=12864,+Inf=74429,sum=4.256783538679698e+11,count=74429
task_executor_run_duration,taskID=00xx0Xx0xx00XX0x0,task_type=threshold 0.5=5.178160855,0.9=5.178160855,0.99=5.178160855,sum=2121.9758301650004,count=570
```

{{< expand-wrapper >}}
{{% expand "View tables when queried from InfluxDB" %}}
| _time                     | _measurement                  | _field  |       _value |
| :------------------------ | :---------------------------- | :------ | -----------: |
| {{< flux/current-time >}} | go_memstats_alloc_bytes_total | counter | 1422764240.0 |

| _time                     | _measurement                    | _field |    _value |
| :------------------------ | :------------------------------ | :----- | --------: |
| {{< flux/current-time >}} | go_memstats_buck_hash_sys_bytes | gauge  | 5259247.0 |

| _time                     | _measurement                      | task_type | _field | _value |
| :------------------------ | :-------------------------------- | :-------- | :----- | -----: |
| {{< flux/current-time >}} | task_executor_run_latency_seconds | system    | 0.25   | 4413.0 |

| _time                     | _measurement                      | task_type | _field |  _value |
| :------------------------ | :-------------------------------- | :-------- | :----- | ------: |
| {{< flux/current-time >}} | task_executor_run_latency_seconds | system    | 0.5    | 11901.0 |

| _time                     | _measurement                      | task_type | _field |  _value |
| :------------------------ | :-------------------------------- | :-------- | :----- | ------: |
| {{< flux/current-time >}} | task_executor_run_latency_seconds | system    | 1      | 12565.0 |

| _time                     | _measurement                      | task_type | _field |  _value |
| :------------------------ | :-------------------------------- | :-------- | :----- | ------: |
| {{< flux/current-time >}} | task_executor_run_latency_seconds | system    | 2.5    | 12823.0 |

| _time                     | _measurement                      | task_type | _field |  _value |
| :------------------------ | :-------------------------------- | :-------- | :----- | ------: |
| {{< flux/current-time >}} | task_executor_run_latency_seconds | system    | 5      | 12844.0 |

| _time                     | _measurement                      | task_type | _field |  _value |
| :------------------------ | :-------------------------------- | :-------- | :----- | ------: |
| {{< flux/current-time >}} | task_executor_run_latency_seconds | system    | +Inf   | 74429.0 |

| _time                     | _measurement                      | task_type | _field |            _value |
| :------------------------ | :-------------------------------- | :-------- | :----- | ----------------: |
| {{< flux/current-time >}} | task_executor_run_latency_seconds | system    | sum    | 425678353867.9698 |

| _time                     | _measurement                      | task_type | _field | _value |
| :------------------------ | :-------------------------------- | :-------- | :----- | -----: |
| {{< flux/current-time >}} | task_executor_run_latency_seconds | system    | count  |  74429.0 |

| _time                     | _measurement               | task_type | _field |      _value |
| :------------------------ | :------------------------- | :-------- | :----- | ----------: |
| {{< flux/current-time >}} | task_executor_run_duration | threshold | 0.5    | 5.178160855 |

| _time                     | _measurement               | task_type | _field |      _value |
| :------------------------ | :------------------------- | :-------- | :----- | ----------: |
| {{< flux/current-time >}} | task_executor_run_duration | threshold | 0.9    | 5.178160855 |

| _time                     | _measurement               | task_type | _field |      _value |
| :------------------------ | :------------------------- | :-------- | :----- | ----------: |
| {{< flux/current-time >}} | task_executor_run_duration | threshold | 0.99   | 5.178160855 |

| _time                     | _measurement               | task_type | _field |             _value |
| :------------------------ | :------------------------- | :-------- | :----- | -----------------: |
| {{< flux/current-time >}} | task_executor_run_duration | threshold | sum    | 2121.9758301650004 |

| _time                     | _measurement               | task_type | _field | _value |
| :------------------------ | :------------------------- | :-------- | :----- | -----: |
| {{< flux/current-time >}} | task_executor_run_duration | threshold | count  |  570.0 |
{{% /expand %}}
{{< /expand-wrapper >}}

## Metrics format version 2

- **_time**: timestamp
- **_measurement**: `prometheus`
- **_field**: [Prometheus metric name](https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels)
  _(`_bucket` is trimmed from histogram metric names)_
- **_value**: [Prometheus metric value](https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels)
- **url**: URL metrics were scraped from
- **tags**: A tag for each [Prometheus label](https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels).
  The label name is the tag key and the label value is the tag value.

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

#### Resulting line protocol
```
prometheus,url=http://localhost:8086/metrics go_memstats_alloc_bytes_total=1.42276424e+09
prometheus,url=http://localhost:8086/metrics go_memstats_buck_hash_sys_bytes=5.259247e+06
prometheus,url=http://localhost:8086/metrics,task_type=system,le=0.25 task_executor_run_latency_seconds=4413
prometheus,url=http://localhost:8086/metrics,task_type=system,le=0.5 task_executor_run_latency_seconds=11901
prometheus,url=http://localhost:8086/metrics,task_type=system,le=1 task_executor_run_latency_seconds=12565
prometheus,url=http://localhost:8086/metrics,task_type=system,le=2.5 task_executor_run_latency_seconds=12823
prometheus,url=http://localhost:8086/metrics,task_type=system,le=5 task_executor_run_latency_seconds=12844
prometheus,url=http://localhost:8086/metrics,task_type=system,le=10 task_executor_run_latency_seconds=12864
prometheus,url=http://localhost:8086/metrics,task_type=system,le=+Inf task_executor_run_latency_seconds=74429
prometheus,url=http://localhost:8086/metrics,task_type=system task_executor_run_latency_seconds_sum=4.256783538679698e+11
prometheus,url=http://localhost:8086/metrics,task_type=system task_executor_run_latency_seconds_count=74429
prometheus,url=http://localhost:8086/metrics,taskID=00xx0Xx0xx00XX0x0,task_type=threshold quantile=0.5 task_executor_run_duration=5.178160855
prometheus,url=http://localhost:8086/metrics,taskID=00xx0Xx0xx00XX0x0,task_type=threshold quantile=0.9 task_executor_run_duration=5.178160855
prometheus,url=http://localhost:8086/metrics,taskID=00xx0Xx0xx00XX0x0,task_type=threshold quantile=0.99 task_executor_run_duration=5.178160855
prometheus,url=http://localhost:8086/metrics,taskID=00xx0Xx0xx00XX0x0,task_type=threshold task_executor_run_duration_sum=2121.9758301650004
prometheus,url=http://localhost:8086/metrics,taskID=00xx0Xx0xx00XX0x0,task_type=threshold task_executor_run_duration_count=570
```

{{< expand-wrapper >}}
{{% expand "View tables when queried from InfluxDB" %}}
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
{{% /expand %}}
{{< /expand-wrapper >}}
