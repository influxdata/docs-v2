---
title: Work with Prometheus gauges
list_title: Gauge
description: >
  Use Flux to query and transform Prometheus **gauge** metrics stored in InfluxDB.
  A gauge is a metric that represents a single numerical value that can
  arbitrarily go up and down.
menu:
  flux_0_x:
    name: Gauge
    parent: Prometheus metric types
weight: 101
flux/v0.x/tags: [prometheus]
---

Use Flux to query and transform Prometheus **gauge** metrics stored in InfluxDB.

> A _gauge_ is a metric that represents a single numerical value that can arbitrarily go up and down.
>
> {{% cite %}}[Prometheus metric types](https://prometheus.io/docs/concepts/metric_types/#gauge){{% /cite %}}

##### Example gauge metric in Prometheus data
```sh
# HELP task_scheduler_current_execution Number of tasks currently being executed
# TYPE task_scheduler_current_execution gauge
task_scheduler_current_execution 128
```

- Users are having problems with units

- Calculate the rate of change
  - derivative
  - aggregate.rate

##### Example gauge metric in Prometheus data
```sh
# HELP go_goroutines Number of goroutines that currently exist.
# TYPE go_goroutines gauge
go_goroutines 1542
```

| _time                     | _measurement  | label | _field | _value |
| :------------------------ | :------------ | :---- | :----- | -----: |
| {{< flux/current-time >}} | go_goroutines | foo   | gauge  |   1542 |

| _time                     | _measurement | label | _field        | _value |
| :------------------------ | :----------- | :---- | :------------ | -----: |
| {{< flux/current-time >}} | prometheus   | foo   | go_goroutines |   1542 |

