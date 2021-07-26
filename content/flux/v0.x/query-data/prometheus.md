---
title: Query Prometheus
list_title: Prometheus
description: >
  Use [`prometheus.scrape`](/flux/v0.x/stdlib/experimental/prometheus/scrape) to
  query Prometheus-formatted metrics from an HTTP endpoint using Flux.
menu:
  flux_0_x:
    name: Prometheus
    parent: Query data sources
weight: 104
list_code_example: |
  ```js
  import "experimental/prometheus"
  
  prometheus.scrape(url: "http://example.com/metrics")
  ```
---

To query Prometheus-formatted metrics from an HTTP endpoint using Flux
import the [`experimental/prometheus` package](/flux/v0.x/stdlib/experimental/prometheus/)
and use [`prometheus.scrape`](/flux/v0.x/stdlib/experimental/prometheus/scrape).
Use the **url** parameter to provide the URL to scrape metrics from.

{{< keep-url >}}
```js
import "experimental/prometheus"

prometheus.scrape(url: "http://localhost:8086/metrics")
```

## Results structure
`prometheus.scrape()` returns a [stream of tables](/flux/v0.x/get-started/data-structure/#stream-of-tables)
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
The following are example Prometheus metrics scraped from the InfluxDB OSS 2.x `/metrics` endpoint:

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
