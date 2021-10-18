---
title: Work with Prometheus summaries
list_title: Summary
description: >
  Use Flux to query and transform Prometheus **summary** metrics stored in InfluxDB.
  A summary samples observations, e.g. request durations and response sizes.
  While it also provides a total count of observations and a sum of all observed
  values, it calculates configurable quantiles over a sliding time window.
menu:
  flux_0_x:
    name: Summary
    parent: Prometheus metric types
weight: 101
flux/v0.x/tags: [prometheus]
related:
  - https://prometheus.io/docs/concepts/metric_types/, Prometheus metric types
  - /{{< latest "influxdb" >}}/reference/prometheus-metrics/
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

The examples below include example data collected from the **InfluxDB OSS 2.x `/metrics` endpoint**
and stored in InfluxDB.

{{% note %}}
#### Prometheus metric parsing formats
Query structure depends on the [Prometheus metric parsing format](/{{< latest "influxdb" >}}/reference/prometheus-metrics/)
used to scrape the Prometheus metrics.
Select the appropriate metric format version below.
{{% /note %}}

- [Visualize summary metric quantile values](#visualize-summary-metric-quantile-values)  
- [Derive average values from a summary metric](#derive-average-values-from-a-summary-metric)

## Visualize summary metric quantile values
Prometheus summary metrics provide quantile values that can be visualized without modification.

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Metric version 2](#)
[Metric version 1](#)
{{% /tabs %}}
{{% tab-content %}}

1.  Filter by the `prometheus` measurement.
2.  Filter by your **Prometheus metric name** field.

```js
from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "prometheus")
  |> filter(fn: (r) => r._field == "go_gc_duration_seconds")
```
{{% /tab-content %}}
{{% tab-content %}}

1.  Filter by your **Prometheus metric name** measurement.
2.  Filter out the `sum` and `count` fields.

```js
from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "go_gc_duration_seconds")
  |> filter(fn: (r) => r._field != "count" and r._field != "sum")
```
{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{< img-hd src="/img/flux/0-x-prometheus-summary-quantiles.png" alt="Visualize Prometheus summary quantiles" />}}

## Derive average values from a summary metric
Use the **sum** and **count** values provided in Prometheus summary metrics to
derive an average summary value.

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Metric version 2](#)
[Metric version 1](#)
{{% /tabs %}}
{{% tab-content %}}

1.  Filter by the `prometheus` measurement.
2.  Filter by the `<metric_name>_count` and `<metric_name>_sum` fields.
3.  Use [`pivot()`](/flux/v0.x/stdlib/universe/pivot/) to pivot fields into
    columns based on time. Each row then contains a `<metric_name>_count` and
    `<metric_name>_sum` column.
4.  Divide the `<metric_name>_sum` column by the `<metric_name>_count` column to
    produce a new `_value`.

```js
from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "prometheus")
  |> filter(fn: (r) =>
    r._field == "go_gc_duration_seconds_count" or
    r._field == "go_gc_duration_seconds_sum"
  )
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> map(fn: (r) => ({ r with
    _value: r.go_gc_duration_seconds_sum / r.go_gc_duration_seconds_count
  }))
```
{{% /tab-content %}}
{{% tab-content %}}

1.  Filter by your **Prometheus metric name** measurement.
2.  Filter by the `count` and `sum` fields.
3.  Use [`pivot()`](/flux/v0.x/stdlib/universe/pivot/) to pivot fields into columns.
    Each row then contains a `count` and `sum` column.
4.  Divide the `sum` column by the `count` column to produce a new `_value`.

```js
from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "go_gc_duration_seconds")
  |> filter(fn: (r) => r._field == "count" or r._field == "sum")
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> map(fn: (r) => ({ r with _value: r.sum / r.count }))
```
{{% /tab-content %}}
{{< /tabs-wrapper >}}