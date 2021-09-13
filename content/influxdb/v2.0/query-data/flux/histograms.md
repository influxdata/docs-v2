---
title: Create histograms with Flux
list_title: Histograms
description: >
  Use the [`histogram()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/histogram/)
  to create cumulative histograms with Flux.
influxdb/v2.0/tags: [histogram]
menu:
  influxdb_2_0:
    name: Histograms
    parent: Query with Flux
weight: 210
aliases:
  - /influxdb/v2.0/query-data/guides/histograms/
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/histogram
list_query_example: histogram
---

Histograms provide valuable insight into the distribution of your data.
This guide walks through using Flux's `histogram()` function to transform your data into a **cumulative histogram**.

If you're just getting started with Flux queries, check out the following:

- [Get started with Flux](/influxdb/v2.0/query-data/get-started/) for a conceptual overview of Flux and parts of a Flux query.
- [Execute queries](/influxdb/v2.0/query-data/execute-queries/) to discover a variety of ways to run your queries.

## histogram() function

The [`histogram()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/histogram) approximates the
cumulative distribution of a dataset by counting data frequencies for a list of "bins."
A **bin** is simply a range in which a data point falls.
All data points that are less than or equal to the bound are counted in the bin.
In the histogram output, a column is added (`le`) that represents the upper bounds of of each bin.
Bin counts are cumulative.

```js
from(bucket:"example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> histogram(bins: [0.0, 10.0, 20.0, 30.0])
```

{{% note %}}
Values output by the `histogram` function represent points of data aggregated over time.
Since values do not represent single points in time, there is no `_time` column in the output table.
{{% /note %}}

## Bin helper functions
Flux provides two helper functions for generating histogram bins.
Each generates an array of floats designed to be used in the `histogram()` function's `bins` parameter.

### linearBins()
The [`linearBins()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/misc/linearbins) generates a list of linearly separated floats.

```js
linearBins(start: 0.0, width: 10.0, count: 10)

// Generated list: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, +Inf]
```

### logarithmicBins()
The [`logarithmicBins()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/misc/logarithmicbins) generates a list of exponentially separated floats.

```js
logarithmicBins(start: 1.0, factor: 2.0, count: 10, infinity: true)

// Generated list: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, +Inf]
```

## Histogram visualization
The [Histogram visualization type](/influxdb/v2.0/visualize-data/visualization-types/histogram/)
automatically converts query results into a binned and segmented histogram.

{{< img-hd src="/img/influxdb/2-0-visualizations-histogram-example.png" alt="Histogram visualization" />}}

Use the [Histogram visualization controls](/influxdb/v2.0/visualize-data/visualization-types/histogram/#histogram-controls)
to specify the number of bins and define groups in bins.

### Histogram visualization data structure
Because the Histogram visualization uses visualization controls to creates bins and groups,
**do not** structure query results as histogram data.

{{% note %}}
Output of the [`histogram()` function](#histogram-function) is **not** compatible
with the Histogram visualization type.
View the example [below](#visualize-errors-by-severity).
{{% /note %}}

## Examples

### Generate a histogram with linear bins
```js
from(bucket:"example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> histogram(
    bins: linearBins(
      start:65.5,
      width: 0.5,
      count: 20,
      infinity:false
    )
  )
```

###### Output table
```
Table: keys: [_start, _stop, _field, _measurement, host]
                   _start:time                      _stop:time           _field:string     _measurement:string               host:string                      le:float                  _value:float
------------------------------  ------------------------------  ----------------------  ----------------------  ------------------------  ----------------------------  ----------------------------
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                          65.5                             5
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                            66                             6
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                          66.5                             8
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                            67                             9
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                          67.5                             9
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                            68                            10
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                          68.5                            12
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                            69                            12
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                          69.5                            15
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                            70                            23
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                          70.5                            30
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                            71                            30
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                          71.5                            30
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                            72                            30
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                          72.5                            30
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                            73                            30
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                          73.5                            30
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                            74                            30
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                          74.5                            30
2018-11-07T22:19:58.423358000Z  2018-11-07T22:24:58.423358000Z            used_percent                     mem  Scotts-MacBook-Pro.local                            75                            30
```

### Generate a histogram with logarithmic bins
```js
from(bucket:"example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> histogram(
    bins: logarithmicBins(
      start:0.5,
      factor: 2.0,
      count: 10,
      infinity:false
    )
  )
```

###### Output table
```
Table: keys: [_start, _stop, _field, _measurement, host]
                   _start:time                      _stop:time           _field:string     _measurement:string               host:string                      le:float                  _value:float
------------------------------  ------------------------------  ----------------------  ----------------------  ------------------------  ----------------------------  ----------------------------
2018-11-07T22:23:36.860664000Z  2018-11-07T22:28:36.860664000Z            used_percent                     mem  Scotts-MacBook-Pro.local                           0.5                             0
2018-11-07T22:23:36.860664000Z  2018-11-07T22:28:36.860664000Z            used_percent                     mem  Scotts-MacBook-Pro.local                             1                             0
2018-11-07T22:23:36.860664000Z  2018-11-07T22:28:36.860664000Z            used_percent                     mem  Scotts-MacBook-Pro.local                             2                             0
2018-11-07T22:23:36.860664000Z  2018-11-07T22:28:36.860664000Z            used_percent                     mem  Scotts-MacBook-Pro.local                             4                             0
2018-11-07T22:23:36.860664000Z  2018-11-07T22:28:36.860664000Z            used_percent                     mem  Scotts-MacBook-Pro.local                             8                             0
2018-11-07T22:23:36.860664000Z  2018-11-07T22:28:36.860664000Z            used_percent                     mem  Scotts-MacBook-Pro.local                            16                             0
2018-11-07T22:23:36.860664000Z  2018-11-07T22:28:36.860664000Z            used_percent                     mem  Scotts-MacBook-Pro.local                            32                             0
2018-11-07T22:23:36.860664000Z  2018-11-07T22:28:36.860664000Z            used_percent                     mem  Scotts-MacBook-Pro.local                            64                             2
2018-11-07T22:23:36.860664000Z  2018-11-07T22:28:36.860664000Z            used_percent                     mem  Scotts-MacBook-Pro.local                           128                            30
2018-11-07T22:23:36.860664000Z  2018-11-07T22:28:36.860664000Z            used_percent                     mem  Scotts-MacBook-Pro.local                           256                            30
```

### Visualize errors by severity
Use the [Telegraf Syslog plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/syslog)
to collect error information from your system.
Query the `severity_code` field in the `syslog` measurement:

```js
from(bucket: "example-bucket")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) =>
      r._measurement == "syslog" and
      r._field == "severity_code"
  )
```

In the Histogram visualization options, select `_time` as the **X Column**
and `severity` as the **Group By** option:

{{< img-hd src="/img/influxdb/2-0-visualizations-histogram-errors.png" alt="Logs by severity histogram" />}}

### Use Prometheus histograms in Flux

Use InfluxDB and Telegraf to monitor a service instrumented with an endpoint that outputs [prometheus-formatted metrics](https://prometheus.io/docs/concepts/data_model/). This example demonstrates how to use Telegraf to scrape metrics from the InfluxDB 2.0 OSS `/metrics` endpoint at regular intervals (10s by default), and then store those metrics in InfluxDB.

Use Prometheus histograms to measure the distribution of a variable, for example, the time it takes a server to respond to a request. Prometheus represents histograms as many sets of buckets (notably, different from an InfluxDB bucket).
Each unique set of labels corresponds to one set of buckets; within that set, each bucket is labeled with an upper bound.
In this example, the upper bound label is `le`, which stands for *less than or equal to*.
In the example `/metrics` endpoint output below, there is a bucket for requests that take less-than-or-equal-to 0.005s, 0.01s, and so on, up to 10s and then +Inf. Note that the buckets are cumulative, so if a request takes 7.5s, Prometheus increments the counters in the buckets for 10s as well as +Inf.

{{< expand-wrapper >}}
{{% expand "View sample histogram data from the /metrics endpoint" %}}
Sample histogram metrics from the `/metrics` endpoint on an instance of InfluxDB OSS 2.0, including two histograms for requests served by the `/api/v2/write` and `/api/v2/query` endpoints.

```js
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/write",response_code="204",status="2XX",user_agent="Telegraf",le="0.005"} 0
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/write",response_code="204",status="2XX",user_agent="Telegraf",le="0.01"} 1
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/write",response_code="204",status="2XX",user_agent="Telegraf",le="0.025"} 13
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/write",response_code="204",status="2XX",user_agent="Telegraf",le="0.05"} 14
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/write",response_code="204",status="2XX",user_agent="Telegraf",le="0.1"} 16
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/write",response_code="204",status="2XX",user_agent="Telegraf",le="0.25"} 16
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/write",response_code="204",status="2XX",user_agent="Telegraf",le="0.5"} 16
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/write",response_code="204",status="2XX",user_agent="Telegraf",le="1"} 16
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/write",response_code="204",status="2XX",user_agent="Telegraf",le="2.5"} 16
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/write",response_code="204",status="2XX",user_agent="Telegraf",le="5"} 16
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/write",response_code="204",status="2XX",user_agent="Telegraf",le="10"} 16
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/write",response_code="204",status="2XX",user_agent="Telegraf",le="+Inf"} 16
http_api_request_duration_seconds_sum{handler="platform",method="POST",path="/api/v2/write",response_code="204",status="2XX",user_agent="Telegraf"} 0.354163124
http_api_request_duration_seconds_count{handler="platform",method="POST",path="/api/v2/write",response_code="204",status="2XX",user_agent="Telegraf"} 16
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="0.005"} 0
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="0.01"} 16
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="0.025"} 68
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="0.05"} 70
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="0.1"} 70
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="0.25"} 70
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="0.5"} 70
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="1"} 71
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="2.5"} 71
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="5"} 71
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="10"} 71
http_api_request_duration_seconds_bucket{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome",le="+Inf"} 71
http_api_request_duration_seconds_sum{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome"} 1.4840353630000003
http_api_request_duration_seconds_count{handler="platform",method="POST",path="/api/v2/query",response_code="200",status="2XX",user_agent="Chrome"} 71
```
{{% /expand %}}
{{< /expand-wrapper >}}

Use the [histogramQuantile()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/histogramquantile/) function to convert a Prometheus histogram to a specified quantile.
This function expects a stream of input tables where each table has the following form:

- Each row represents one bucket of a histogram, where the upper bound of the bucket is defined by the
argument `upperBoundColumn` (by default, `le`).
- A value column represents the number of items (requests, events, etc.) in the bucket (by default, `_value`).
- Buckets are strictly cumulative, so for example, if for some reason the `+Inf` bucket had a count of `9`,
but the `10s` bucket had a count of 10, the following error would occur: "histogram records counts are not monotonic".
Given Prometheus increments the counts in each bucket continually as the process runs, whatever is most recently scraped from `/metrics` is a histogram of all the requests (events, etc) since the process started (maybe days, weeks, or longer). To be more useful, Telegraf scrapes at regular intervals, and we can subtract adjacent samples from the same bucket to discover the number of new items in that bucket for a given interval.

To transform a set of cumulative histograms collected over time and visualize that as some quantile (such as the 50th percentile or 99th percentile) and show change over time, complete the following high-level transformations:

1. Use `aggregateWindow()` to downsample the data to a specified time resolution to improve query performance. For example, to see how the 50th percentile changes over a month, downsample to a resolution of `1h`.

    ```js
    // ...
      |> aggregateWindow(every: 1h, fn: last)
    ```
2. Use `difference()` to subtract adjacent samples so that buckets contain only the new counts for each period.
3. Sum data across the dimensions that we aren't interested in. For example, in the Prometheus data from above, there is a label for path, but we may not care to break out http requests by path. If this is the case, we would ungroup the path dimension, and then add corresponding buckets together.
4. Reshape the data so all duration buckets for the same period are in their own tables, with an upper bound column that describes the bucket represented by each row.
5. Transform each table from a histogram to a quantile with the `histogramQuantile()` function.

The following query performs the above steps.

```js
import "experimental"

// The "_field" is necessary. Any columns following "_field" will be used
// to create quantiles for each unique value in that column.
// E.g., put "path" in here to see quantiles for each unique value of "path".
groupCols = ["_field"]

// This is a helper function that takes a stream of tables,
// each containing "le" buckets for one window period.
// It uses histogramQuantile to transform the bin counts
// to a quantile defined in the "q" parameter.
// The windows are then reassembled to produce a single table for each
// unique group key.
doQuantile = (tables=<-, q) => tables
  |> histogramQuantile(quantile: q)
  |> duplicate(as: "_time", column: "_stop")
  |> window(every: inf)
  |> map(fn: (r) => ({r with _measurement: "quantile", _field: string(v: q)}))
  |> experimental.group(mode: "extend", columns: ["_measurement", "_field"])

histograms =
  from(bucket: "telegraf")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r._measurement == "http_api_request_duration_seconds"
    and r._field != "count" and r._field != "sum")
  // Downsample the data. This helps a lot with performance!
  |> aggregateWindow(fn: last, every: v.windowPeriod)
  // Calling difference() transforms the cumulative count of requests
  // to the number of new requests per window period.
  |> difference(nonNegative: true)
  // Counters may be reset when a server restarts.
  // When this happens there will be null values produced by difference().
  |> filter(fn: (r) => exists r._value)
  // Group data on the requested dimensions, window it, and sum within those dimensions, for each window.
  |> group(columns: groupCols)
  |> window(every: v.windowPeriod)
  |> sum()
  // Fields will have names like "0.001", etc. Change _field to a float column called "le".
  // This also has the effect of ungrouping by _field, so bucket counts for each period
  // will be within the same table.
  |> map(fn: (r) => ({r with le: float(v: r._field)}))
  |> drop(columns: ["_field"])

// Compute the 50th and 95th percentile for duration of http requests.
union(tables: [
  histograms |> doQuantile(q:  0.95),
  histograms |> doQuantile(q:  0.5)
])
```

The tables piped-forward into `histogramQuantile()` should look similar to those returned by the `histograms` variable in the example above. Note, that rows are sorted by `le` to be clear that the counts increase for larger upper bounds.
