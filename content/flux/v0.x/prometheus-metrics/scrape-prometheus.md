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
# HELP go_goroutines Number of goroutines that currently exist.
# TYPE go_goroutines gauge
go_goroutines 1263
# HELP go_info Information about the Go environment.
# TYPE go_info gauge
go_info{version="go1.16.3"} 1
# HELP go_memstats_alloc_bytes Number of bytes allocated and still in use.
# TYPE go_memstats_alloc_bytes gauge
go_memstats_alloc_bytes 2.6598832e+07
# HELP go_memstats_alloc_bytes_total Total number of bytes allocated, even if freed.
# TYPE go_memstats_alloc_bytes_total counter
go_memstats_alloc_bytes_total 1.42276424e+09
# HELP go_memstats_buck_hash_sys_bytes Number of bytes used by the profiling bucket hash table.
# TYPE go_memstats_buck_hash_sys_bytes gauge
go_memstats_buck_hash_sys_bytes 5.259247e+06
```

When scraped by Flux, these metrics return the following stream of tables:

| _time                | _measurement | _field        | _value | url                           |
| :------------------- | :----------- | :------------ | -----: | :---------------------------- |
| 2021-01-01T00:00:00Z | prometheus   | go_goroutines |   1263 | http://localhost:8086/metrics |

| _time                | _measurement | _field  | _value | url                           | version  |
| :------------------- | :----------- | :------ | -----: | :---------------------------- | -------- |
| 2021-01-01T00:00:00Z | prometheus   | go_info |      1 | http://localhost:8086/metrics | go1.16.3 |

| _time                | _measurement | _field                  |   _value | url                           |
| :------------------- | :----------- | :---------------------- | -------: | :---------------------------- |
| 2021-01-01T00:00:00Z | prometheus   | go_memstats_alloc_bytes | 26598832 | http://localhost:8086/metrics |

| _time                | _measurement | _field                        |     _value | url                           |
| :------------------- | :----------- | :---------------------------- | ---------: | :---------------------------- |
| 2021-01-01T00:00:00Z | prometheus   | go_memstats_alloc_bytes_total | 1422764240 | http://localhost:8086/metrics |

| _time                | _measurement | _field                          |  _value | url                           |
| :------------------- | :----------- | :------------------------------ | ------: | :---------------------------- |
| 2021-01-01T00:00:00Z | prometheus   | go_memstats_buck_hash_sys_bytes | 5259247 | http://localhost:8086/metrics |

{{% note %}}
#### Different data structures for scraped Prometheus metrics
[Telegraf](/{{< latest "telegraf" >}}/) and [InfluxDB](/{{< latest "influxdb" >}}/) 
provide tools that scrape Prometheus metrics and store them in InfluxDB.
Depending on the tool and and configuration you use to scrape metrics, 
the resulting data structure may differ than the structure returned by `prometheus.scrape()`
described [above](#output-structure).

For information about the different data structures of scraped Prometheus metrics
stored in InfluxDB, see [Scrape Prometheus metrics](#).
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

To scrape Prometheus metrics and write them to InfluxDB at regular intervals,
scrape Prometheus metrics in an [InfluxDB task](/influxdb/cloud/process-data/get-started/).

{{% expand "View example Prometheus scrape task" %}}
```js
import "experimental/prometheus"

option task = {
  name: "Scrape Prometheus metrics",
  every: 1m
}
  
prometheus.scrape(url: "http://example.com/metrics")
  |> to(bucket: "example-bucket")
```
{{% /expand %}}
