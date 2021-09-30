---
title: Work with Prometheus counters
list_title: Counter
description: >
  Use Flux to query and transform Prometheus **counter** metrics stored in InfluxDB.
  A counter is a cumulative metric that represents a single
  [monotonically increasing counter](https://en.wikipedia.org/wiki/Monotonic_function)
  whose value can only increase or be reset to zero on restart.
menu:
  flux_0_x:
    name: Counter
    parent: Prometheus metric types
weight: 101
flux/v0.x/tags: [prometheus]
---

Use Flux to query and transform Prometheus **counter** metrics stored in InfluxDB.

> A _counter_ is a cumulative metric that represents a single
> [monotonically increasing counter](https://en.wikipedia.org/wiki/Monotonic_function)
> whose value can only increase or be reset to zero on restart.
>
> {{% cite %}}[Prometheus metric types](https://prometheus.io/docs/concepts/metric_types/#counter){{% /cite %}}

- [Normalize counter resets](#normalize-counter-resets)
- [Calculate changes between normalized counter values](#calculate-changes-between-normalized-counter-values)
- [Calculate the rate of change in normalized counter values](#calculate-the-rate-of-change-in-normalized-counter-values)

## Normalize counter resets
Because counters can periodically reset to 0, **any query involving counter metrics
should normalize the data to account for counter resets** before further processing.

Use [`increase()`](/flux/v0.x/stdlib/universe/increase/) to normalize counter resets.
`increase()` returns the cumulative sum of positive changes in column values.

{{% note %}}
`increase()` accounts for counter resets, but may lose some precision on reset
depending on your scrape interval.
{{% /note %}}

```js
from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) =>
    r._measurement == "prometheus" and
    r._field == "http_query_request_bytes"
  )
  |> increase()
```

{{< flex >}}
{{< flex-content >}}
{{< img-hd src="/img/flux/0-x-prometheus-counter-increase-input.png" alt="Raw Prometheus counter metric in InfluxDB" />}}
{{< /flex-content >}}
{{< flex-content >}}
{{< img-hd src="/img/flux/0-x-prometheus-counter-increase-output.png" alt="Increase on Prometheus counter metric in InfluxDB" />}}
{{< /flex-content >}}
{{< /flex >}}

{{< expand-wrapper >}}
{{% expand "View example input and output data" %}}

#### Example input
| _time                | _measurement | _field                   | _value |
| :------------------- | :----------- | :----------------------- | -----: |
| 2021-01-01T00:00:00Z | prometheus   | http_query_request_bytes |   4302 |
| 2021-01-01T00:00:10Z | prometheus   | http_query_request_bytes |   4844 |
| 2021-01-01T00:00:20Z | prometheus   | http_query_request_bytes |   5091 |
| 2021-01-01T00:00:30Z | prometheus   | http_query_request_bytes |     13 |
| 2021-01-01T00:00:40Z | prometheus   | http_query_request_bytes |    215 |
| 2021-01-01T00:00:50Z | prometheus   | http_query_request_bytes |    762 |
| 2021-01-01T00:01:00Z | prometheus   | http_query_request_bytes |   1108 |

#### Example output
| _time                | _measurement | _field                   | _value |
| :------------------- | :----------- | :----------------------- | -----: |
| 2021-01-01T00:00:10Z | prometheus   | http_query_request_bytes |    542 |
| 2021-01-01T00:00:20Z | prometheus   | http_query_request_bytes |    789 |
| 2021-01-01T00:00:30Z | prometheus   | http_query_request_bytes |    789 |
| 2021-01-01T00:00:40Z | prometheus   | http_query_request_bytes |    991 |
| 2021-01-01T00:00:50Z | prometheus   | http_query_request_bytes |   1538 |
| 2021-01-01T00:01:00Z | prometheus   | http_query_request_bytes |   1884 |
{{% /expand %}}
{{< /expand-wrapper >}}

## Calculate changes between normalized counter values
Use [`difference()`](/flux/v0.x/stdlib/universe/difference/) with
[normalized counter data](#normalize-counter-resets) to return the actual value
change between points.

```js
from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) =>
    r._measurement == "prometheus" and
    r._field == "http_query_request_bytes"
  )
  |> increase()
  |> difference()
```

{{< flex >}}
{{< flex-content >}}
{{< img-hd src="/img/flux/0-x-prometheus-counter-normalized-input.png" alt="Raw Prometheus counter metric in InfluxDB" />}}
{{< /flex-content >}}
{{< flex-content >}}
{{< img-hd src="/img/flux/0-x-prometheus-counter-difference-output.png" alt="Increase on Prometheus counter metric in InfluxDB" />}}
{{< /flex-content >}}
{{< /flex >}}

{{< expand-wrapper >}}
{{% expand "View example input and output data" %}}

#### Example normalized counter data
| _time                | _measurement | _field                   | _value |
| :------------------- | :----------- | :----------------------- | -----: |
| 2021-01-01T00:00:10Z | prometheus   | http_query_request_bytes |    542 |
| 2021-01-01T00:00:20Z | prometheus   | http_query_request_bytes |    789 |
| 2021-01-01T00:00:30Z | prometheus   | http_query_request_bytes |    789 |
| 2021-01-01T00:00:40Z | prometheus   | http_query_request_bytes |    991 |
| 2021-01-01T00:00:50Z | prometheus   | http_query_request_bytes |   1538 |
| 2021-01-01T00:01:00Z | prometheus   | http_query_request_bytes |   1884 |

#### Example difference output
| _time                | _measurement | _field                   | _value |
| :------------------- | :----------- | :----------------------- | -----: |
| 2021-01-01T00:00:20Z | prometheus   | http_query_request_bytes |    247 |
| 2021-01-01T00:00:30Z | prometheus   | http_query_request_bytes |      0 |
| 2021-01-01T00:00:40Z | prometheus   | http_query_request_bytes |    202 |
| 2021-01-01T00:00:50Z | prometheus   | http_query_request_bytes |    547 |
| 2021-01-01T00:01:00Z | prometheus   | http_query_request_bytes |    346 |

{{% /expand %}}
{{< /expand-wrapper >}}

## Calculate the rate of change in normalized counter values
Use [`derivative()`](/flux/v0.x/stdlib/universe/derivative/) to calculate the rate
of change between [normalized counter values](#normalize-counter-resets).
By default, derivative returns the rate of change per second.
Use the [`unit` parameter](/flux/v0.x/stdlib/universe/derivative/#unit) to
customize the rate unit.

```js
from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) =>
    r._measurement == "prometheus" and
    r._field == "http_query_request_bytes"
  )
  |> increase()
  |> derivative()
```

{{< flex >}}
{{< flex-content >}}
{{< img-hd src="/img/flux/0-x-prometheus-counter-normalized-input.png" alt="Raw Prometheus counter metric in InfluxDB" />}}
{{< /flex-content >}}
{{< flex-content >}}
{{< img-hd src="/img/flux/0-x-prometheus-counter-derivative-output.png" alt="Increase on Prometheus counter metric in InfluxDB" />}}
{{< /flex-content >}}
{{< /flex >}}

{{< expand-wrapper >}}
{{% expand "View example input and output data" %}}

#### Example normalized counter data  {id="example-normalized-counter-data-1"}
| _time                | _measurement | _field                   | _value |
| :------------------- | :----------- | :----------------------- | -----: |
| 2021-01-01T00:00:10Z | prometheus   | http_query_request_bytes |    542 |
| 2021-01-01T00:00:20Z | prometheus   | http_query_request_bytes |    789 |
| 2021-01-01T00:00:30Z | prometheus   | http_query_request_bytes |    789 |
| 2021-01-01T00:00:40Z | prometheus   | http_query_request_bytes |    991 |
| 2021-01-01T00:00:50Z | prometheus   | http_query_request_bytes |   1538 |
| 2021-01-01T00:01:00Z | prometheus   | http_query_request_bytes |   1884 |

#### Example derivative output
| _time                | _measurement | _field                   | _value |
| :------------------- | :----------- | :----------------------- | -----: |
| 2021-01-01T00:00:20Z | prometheus   | http_query_request_bytes |   24.7 |
| 2021-01-01T00:00:30Z | prometheus   | http_query_request_bytes |    0.0 |
| 2021-01-01T00:00:40Z | prometheus   | http_query_request_bytes |   20.2 |
| 2021-01-01T00:00:50Z | prometheus   | http_query_request_bytes |   54.7 |
| 2021-01-01T00:01:00Z | prometheus   | http_query_request_bytes |   34.6 |

{{% /expand %}}
{{< /expand-wrapper >}}

### Calculate the average rate of change in specified time windows
To calculate the average rate of change in [normalized counter values](#normalize-counter-resets)
in specified time windows:

1. Import the [`experimental/aggregate` package](/flux/v0.x/stdlib/experimental/aggregate/).
2. Use [`aggregate.rate()`](/flux/v0.x/stdlib/experimental/aggregate/rate/)
   to calculate the average rate of change per time window.
   
    - Use the [`every` parameter](/flux/v0.x/stdlib/experimental/aggregate/rate/#every)
      to define the time window interval.
    - Use the [`unit` parameter](/flux/v0.x/stdlib/experimental/aggregate/rate/#unit)
      to customize the rate unit.
    - Use the [`groupColumns` parameter](/flux/v0.x/stdlib/experimental/aggregate/rate/#groupcolumns)
      to specify columns to group by when performing the aggregation.

```js
import "experimental/aggregate"

from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) =>
    r._measurement == "prometheus" and
    r._field == "http_query_request_bytes"
  )
  |> increase()
  |> aggregate.rate(every: 10s, unit: 1s)
```

{{< flex >}}
{{< flex-content >}}
{{< img-hd src="/img/flux/0-x-prometheus-counter-normalized-input.png" alt="Raw Prometheus counter metric in InfluxDB" />}}
{{< /flex-content >}}
{{< flex-content >}}
{{< img-hd src="/img/flux/0-x-prometheus-counter-aggregate-rate-output.png" alt="Increase on Prometheus counter metric in InfluxDB" />}}
{{< /flex-content >}}
{{< /flex >}}

{{< expand-wrapper >}}
{{% expand "View example input and output data" %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

#### Example normalized counter data {id="example-normalized-counter-data-2"}
| _time                | _measurement | _field                   | _value |
| :------------------- | :----------- | :----------------------- | -----: |
| 2021-01-01T00:00:10Z | prometheus   | http_query_request_bytes |    542 |
| 2021-01-01T00:00:20Z | prometheus   | http_query_request_bytes |    789 |
| 2021-01-01T00:00:30Z | prometheus   | http_query_request_bytes |    789 |
| 2021-01-01T00:00:40Z | prometheus   | http_query_request_bytes |    991 |
| 2021-01-01T00:00:50Z | prometheus   | http_query_request_bytes |   1538 |
| 2021-01-01T00:01:00Z | prometheus   | http_query_request_bytes |   1884 |

#### Example aggregate.rate output
| _time                | _value |
| :------------------- | -----: |
| 2021-01-01T00:00:15Z |        |
| 2021-01-01T00:01:30Z |   24.7 |
| 2021-01-01T00:01:45Z |   10.1 |
| 2021-01-01T00:01:00Z |   54.7 |

{{% /expand %}}
{{< /expand-wrapper >}}
