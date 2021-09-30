---
title: Work with Prometheus summaries
list_title: Summary
description: >
  Use Flux to query and transform Prometheus **summary** metrics stored in InfluxDB.
  A summary samples observations (usually things like request durations and response sizes).
  While it also provides a total count of observations and a sum of all observed
  values, it calculates configurable quantiles over a sliding time window.
menu:
  flux_0_x:
    name: Summary
    parent: Prometheus metric types
weight: 101
flux/v0.x/tags: [prometheus]
---

Use Flux to query and transform Prometheus **summary** metrics stored in InfluxDB.

> A _summary_ samples observations (usually things like request durations and response sizes).
> While it also provides a total count of observations and a sum of all observed
> values, it calculates configurable quantiles over a sliding time window.
>
> {{% cite %}}[Prometheus metric types](https://prometheus.io/docs/concepts/metric_types/#summary){{% /cite %}}

##### Example summary metric in Prometheus data
```sh
# HELP task_executor_run_duration The duration in seconds between a run starting and finishing.
# TYPE task_executor_run_duration summary
example_summary_duration{label="foo",quantile="0.5"} 4.147907251
example_summary_duration{label="foo",quantile="0.9"} 4.147907251
example_summary_duration{label="foo",quantile="0.99"} 4.147907251
example_summary_duration_sum{label="foo"} 2701.367126714001
example_summary_duration_count{label="foo"} 539
```

| _time                     | _measurement | label | quantile | _field                   |      _value |
| :------------------------ | :----------- | :---- | :------- | :----------------------- | ----------: |
| {{< flux/current-time >}} | prometheus   | foo   | 0.5      | example_summary_duration | 4.147907251 |

| _time                     | _measurement | label | quantile | _field                   |      _value |
| :------------------------ | :----------- | :---- | :------- | :----------------------- | ----------: |
| {{< flux/current-time >}} | prometheus   | foo   | 0.9      | example_summary_duration | 4.147907251 |

| _time                     | _measurement | label | quantile | _field                   |      _value |
| :------------------------ | :----------- | :---- | :------- | :----------------------- | ----------: |
| {{< flux/current-time >}} | prometheus   | foo   | 0.99     | example_summary_duration | 4.147907251 |

| _time                     | _measurement | label | _field                       |            _value |
| :------------------------ | :----------- | :---- | :--------------------------- | ----------------: |
| {{< flux/current-time >}} | prometheus   | foo   | example_summary_duration_sum | 2701.367126714001 |

| _time                     | _measurement | label | _field                       | _value |
| :------------------------ | :----------- | :---- | :--------------------------- | -----: |
| {{< flux/current-time >}} | prometheus   | foo   | example_summary_duration_sum |    539 |
