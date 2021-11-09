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
related:
  - https://prometheus.io/docs/concepts/metric_types/, Prometheus metric types
  - /{{< latest "influxdb" >}}/reference/prometheus-metrics/
flux/v0.x/tags: [prometheus]
---

Use Flux to query and transform Prometheus **gauge** metrics stored in InfluxDB.

> A _gauge_ is a metric that represents a single numerical value that can arbitrarily go up and down.
>
> {{% cite %}}[Prometheus metric types](https://prometheus.io/docs/concepts/metric_types/#gauge){{% /cite %}}

##### Example gauge metric in Prometheus data
```sh
# HELP example_gauge_current Current number of items as example gauge metric
# TYPE example_gauge_current gauge
example_gauge_current 128
```

Generally gauge metrics can be used as they are reported and don't require any
additional processing.

The examples below include example data collected from the **InfluxDB OSS 2.x `/metrics` endpoint**
using `prometheus.scrape()` and stored in InfluxDB.

{{% note %}}
#### Prometheus metric parsing formats
Query structure depends on the [Prometheus metric parsing format](/{{< latest "influxdb" >}}/reference/prometheus-metrics/)
used to scrape the Prometheus metrics.
Select the appropriate metric format version below.
{{% /note %}}

- [Calculate the rate of change in gauge values](#calculate-the-rate-of-change-in-gauge-values)
- [Calculate the average rate of change in specified time windows](#calculate-the-average-rate-of-change-in-specified-time-windows)

## Calculate the rate of change in gauge values

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Metric version 2](#)
[Metric version 1](#)
{{% /tabs %}}
{{% tab-content %}}

1.  Filter results by the `prometheus` measurement and **counter metric name** field.
2.  Use [`derivative()`](/flux/v0.x/stdlib/universe/derivative/) to calculate the rate
    of change between gauge values.
    By default, `derivative()` returns the rate of change per second.
    Use the [`unit` parameter](/flux/v0.x/stdlib/universe/derivative/#unit) to
    customize the rate unit.
    To replace negative derivatives with null values, set the
    [`nonNegative` parameter](/flux/v0.x/stdlib/universe/derivative/#unit) to `true`.

```js
from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) =>
    r._measurement == "prometheus" and
    r._field == "go_goroutines"
  )
  |> increase()
  |> derivative(nonNegative: true)
```

{{< flex >}}
{{< flex-content >}}
{{< img-hd src="/img/flux/0-x-prometheus-gauge-input.png" alt="Raw Prometheus gauge metric in InfluxDB" />}}
{{< /flex-content >}}
{{< flex-content >}}
{{< img-hd src="/img/flux/0-x-prometheus-gauge-derivative-output.png" alt="Derivative of Prometheus gauge metrics in InfluxDB" />}}
{{< /flex-content >}}
{{< /flex >}}

{{< expand-wrapper >}}
{{% expand "View example input and output data" %}}

#### Example normalized counter data
| _time                | _measurement | _field        |  _value |
| :------------------- | :----------- | :------------ | ------: |
| 2021-01-01T00:00:00Z | prometheus   | go_goroutines | 1571.97 |
| 2021-01-01T00:00:10Z | prometheus   | go_goroutines | 1577.35 |
| 2021-01-01T00:00:20Z | prometheus   | go_goroutines | 1591.67 |
| 2021-01-01T00:00:30Z | prometheus   | go_goroutines | 1598.85 |
| 2021-01-01T00:00:40Z | prometheus   | go_goroutines |  1600.0 |
| 2021-01-01T00:00:50Z | prometheus   | go_goroutines | 1598.04 |
| 2021-01-01T00:01:00Z | prometheus   | go_goroutines | 1602.93 |

#### Example difference output
| _time                | _measurement | _field        |             _value |
| :------------------- | :----------- | :------------ | -----------------: |
| 2021-01-01T00:00:10Z | prometheus   | go_goroutines | 0.5379999999999882 |
| 2021-01-01T00:00:20Z | prometheus   | go_goroutines | 1.4320000000000164 |
| 2021-01-01T00:00:30Z | prometheus   | go_goroutines | 0.7179999999999837 |
| 2021-01-01T00:00:40Z | prometheus   | go_goroutines | 0.1150000000000091 |
| 2021-01-01T00:00:50Z | prometheus   | go_goroutines |                    |
| 2021-01-01T00:01:00Z | prometheus   | go_goroutines |   0.48900000000001 |

{{% /expand %}}
{{< /expand-wrapper >}}
{{% /tab-content %}}
{{% tab-content %}}

1.  Filter results by the **counter metric name** measurement and `gauge` field.
2.  Use [`derivative()`](/flux/v0.x/stdlib/universe/derivative/) to calculate the rate
    of change between gauge values.
    By default, `derivative()` returns the rate of change per second.
    Use the [`unit` parameter](/flux/v0.x/stdlib/universe/derivative/#unit) to
    customize the rate unit.
    To replace negative derivatives with null values, set the
    [`nonNegative` parameter](/flux/v0.x/stdlib/universe/derivative/#unit) to `true`.

```js
from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) =>
    r._measurement == "go_goroutines" and
    r._field == "gauge"
  )
  |> increase()
  |> derivative(nonNegative: true)
```

{{< flex >}}
{{< flex-content >}}
{{< img-hd src="/img/flux/0-x-prometheus-gauge-input.png" alt="Raw Prometheus gauge metric in InfluxDB" />}}
{{< /flex-content >}}
{{< flex-content >}}
{{< img-hd src="/img/flux/0-x-prometheus-gauge-derivative-output.png" alt="Derivative of Prometheus gauge metrics in InfluxDB" />}}
{{< /flex-content >}}
{{< /flex >}}

{{< expand-wrapper >}}
{{% expand "View example input and output data" %}}

#### Example gauge data
| _time                | _measurement  | _field |  _value |
| :------------------- | :------------ | :----- | ------: |
| 2021-01-01T00:00:00Z | go_goroutines | gauge  | 1571.97 |
| 2021-01-01T00:00:10Z | go_goroutines | gauge  | 1577.35 |
| 2021-01-01T00:00:20Z | go_goroutines | gauge  | 1591.67 |
| 2021-01-01T00:00:30Z | go_goroutines | gauge  | 1598.85 |
| 2021-01-01T00:00:40Z | go_goroutines | gauge  |  1600.0 |
| 2021-01-01T00:00:50Z | go_goroutines | gauge  | 1598.04 |
| 2021-01-01T00:01:00Z | go_goroutines | gauge  | 1602.93 |

#### Example difference output
| _time                | _measurement  | _field |             _value |
| :------------------- | :------------ | :----- | -----------------: |
| 2021-01-01T00:00:10Z | go_goroutines | gauge  | 0.5379999999999882 |
| 2021-01-01T00:00:20Z | go_goroutines | gauge  | 1.4320000000000164 |
| 2021-01-01T00:00:30Z | go_goroutines | gauge  | 0.7179999999999837 |
| 2021-01-01T00:00:40Z | go_goroutines | gauge  | 0.1150000000000091 |
| 2021-01-01T00:00:50Z | go_goroutines | gauge  |                    |
| 2021-01-01T00:01:00Z | go_goroutines | gauge  |   0.48900000000001 |

{{% /expand %}}
{{< /expand-wrapper >}}
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Calculate the average rate of change in specified time windows

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Metric version 2](#)
[Metric version 1](#)
{{% /tabs %}}
{{% tab-content %}}

1.  Import the [`experimental/aggregate` package](/flux/v0.x/stdlib/experimental/aggregate/).
2.  Filter results by the `prometheus` measurement and **counter metric name** field.
3.  Use [`aggregate.rate()`](/flux/v0.x/stdlib/experimental/aggregate/rate/)
    to calculate the average rate of change per time window.
   
      - Use the [`every` parameter](/flux/v0.x/stdlib/experimental/aggregate/rate/#every)
        to define the time window interval.
      - Use the [`unit` parameter](/flux/v0.x/stdlib/experimental/aggregate/rate/#unit)
        to customize the rate unit. By default, `aggregate.rate()` returns the per second
        (`1s`) rate of change.
      - Use the [`groupColumns` parameter](/flux/v0.x/stdlib/experimental/aggregate/rate/#groupcolumns)
        to specify columns to group by when performing the aggregation.

```js
import "experimental/aggregate"

from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) =>
    r._measurement == "prometheus" and
    r._field == "go_goroutines"
  )
  |> aggregate.rate(every: 10s, unit: 1s)
```

{{< flex >}}
{{< flex-content >}}
{{< img-hd src="/img/flux/0-x-prometheus-gauge-input.png" alt="Raw Prometheus gauge metric in InfluxDB" />}}
{{< /flex-content >}}
{{< flex-content >}}
{{< img-hd src="/img/flux/0-x-prometheus-gauge-aggregate-rate-output.png" alt="Calculate the average rate of change of Prometheus gauge metrics per time window with Flux" />}}
{{< /flex-content >}}
{{< /flex >}}

{{< expand-wrapper >}}
{{% expand "View example input and output data" %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

#### Example gauge data
| _time                | _measurement | _field        |  _value |
| :------------------- | :----------- | :------------ | ------: |
| 2021-01-01T00:00:00Z | prometheus   | go_goroutines | 1571.97 |
| 2021-01-01T00:00:10Z | prometheus   | go_goroutines | 1577.35 |
| 2021-01-01T00:00:20Z | prometheus   | go_goroutines | 1591.67 |
| 2021-01-01T00:00:30Z | prometheus   | go_goroutines | 1598.85 |
| 2021-01-01T00:00:40Z | prometheus   | go_goroutines |  1600.0 |
| 2021-01-01T00:00:50Z | prometheus   | go_goroutines | 1598.04 |
| 2021-01-01T00:01:00Z | prometheus   | go_goroutines | 1602.93 |

#### Example aggregate.rate output

| _time                |             _value |
| :------------------- | -----------------: |
| 2021-01-01T00:00:10Z |                    |
| 2021-01-01T00:00:20Z | 0.5379999999999882 |
| 2021-01-01T00:00:30Z | 1.4320000000000164 |
| 2021-01-01T00:00:40Z | 0.7179999999999837 |
| 2021-01-01T00:00:50Z | 0.1150000000000091 |
| 2021-01-01T00:01:00Z |                    |

{{% /expand %}}
{{< /expand-wrapper >}}
{{% /tab-content %}}
{{% tab-content %}}

1.  Import the [`experimental/aggregate` package](/flux/v0.x/stdlib/experimental/aggregate/).
2.  Filter results by the **counter metric name** measurement and `gauge` field.
3.  Use [`aggregate.rate()`](/flux/v0.x/stdlib/experimental/aggregate/rate/)
    to calculate the average rate of change per time window.
   
      - Use the [`every` parameter](/flux/v0.x/stdlib/experimental/aggregate/rate/#every)
        to define the time window interval.
      - Use the [`unit` parameter](/flux/v0.x/stdlib/experimental/aggregate/rate/#unit)
        to customize the rate unit. By default, `aggregate.rate()` returns the per second
        (`1s`) rate of change.
      - Use the [`groupColumns` parameter](/flux/v0.x/stdlib/experimental/aggregate/rate/#groupcolumns)
        to specify columns to group by when performing the aggregation.

```js
import "experimental/aggregate"

from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) =>
    r._measurement == "go_goroutines" and
    r._field == "gauge"
  )
  |> aggregate.rate(every: 10s, unit: 1s)
```

{{< flex >}}
{{< flex-content >}}
{{< img-hd src="/img/flux/0-x-prometheus-gauge-input.png" alt="Raw Prometheus gauge metric in InfluxDB" />}}
{{< /flex-content >}}
{{< flex-content >}}
{{< img-hd src="/img/flux/0-x-prometheus-gauge-aggregate-rate-output.png" alt="Calculate the average rate of change of Prometheus gauge metrics per time window with Flux" />}}
{{< /flex-content >}}
{{< /flex >}}

{{< expand-wrapper >}}
{{% expand "View example input and output data" %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

#### Example normalized counter data {id="example-normalized-counter-data-2"}
| _time                | _measurement  | _field |  _value |
| :------------------- | :------------ | :----- | ------: |
| 2021-01-01T00:00:00Z | go_goroutines | gauge  | 1571.97 |
| 2021-01-01T00:00:10Z | go_goroutines | gauge  | 1577.35 |
| 2021-01-01T00:00:20Z | go_goroutines | gauge  | 1591.67 |
| 2021-01-01T00:00:30Z | go_goroutines | gauge  | 1598.85 |
| 2021-01-01T00:00:40Z | go_goroutines | gauge  |  1600.0 |
| 2021-01-01T00:00:50Z | go_goroutines | gauge  | 1598.04 |
| 2021-01-01T00:01:00Z | go_goroutines | gauge  | 1602.93 |

#### Example aggregate.rate output
| _time                |             _value |
| :------------------- | -----------------: |
| 2021-01-01T00:00:10Z |                    |
| 2021-01-01T00:00:20Z | 0.5379999999999882 |
| 2021-01-01T00:00:30Z | 1.4320000000000164 |
| 2021-01-01T00:00:40Z | 0.7179999999999837 |
| 2021-01-01T00:00:50Z | 0.1150000000000091 |
| 2021-01-01T00:01:00Z |                    |

{{% /expand %}}
{{< /expand-wrapper >}}
{{% /tab-content %}}
{{< /tabs-wrapper >}}
