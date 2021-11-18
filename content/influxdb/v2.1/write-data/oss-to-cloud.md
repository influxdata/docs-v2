---
title: Write data from InfluxDB OSS to InfluxDB Cloud
description: >
  ...
menu:
  influxdb_2_1:
    name: Write from OSS to Cloud
    parent: Write data
weight: 107
influxdb/v2.1/tags: [write, ]
---

To write data from InfluxDB OSS to InfluxDB Cloud, use the Flux
[`to()`](/flux/v0.x/stdlib/influxdata/influxdb/to/) or
[`experimental.to()`](/flux/v0.x/stdlib/experimental/to/) functions.
Write data per once with a single query execution or use [InfluxDB tasks](/influxdb/v2.1/process-data/)
to routinely write data to InfluxDB Cloud.

1. Query data from InfluxDB OSS.
2. _(Optional)_ Filter or process data to write to InfluxDB Cloud.
3. Use `to` or `experimental.to` to write data to InfluxDB Cloud. 
    _See [Identify which to() function to use](#identify-which-to-function-to-use)_.  
    
    Provide the following parameters to either function:

    - **bucket**: InfluxDB Cloud bucket to write to
    - **host**: InfluxDB Cloud region URL
    - **org**: InfluxDB Cloud organization
    - **token**: InfluxDB Cloud API Token
      
      {{% note %}}
({{< req "Recommended" >}})
To keep your raw API token out of queries, store your InfluxDB Cloud API token
as an [InfluxDB secret](/influxdb/v2.1/security/secrets/) in your InfluxDB OSS
instance and use [`secrets.get()`](/flux/v0.x/stdlib/influxdata/influxdb/secrets/get/)
to retrieve the secret value.
      {{% /note %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[to()](#)
[experimental.to()](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
import "influxdata/influxdb/secrets"

cloudToken = secrets.get(key: "INFLUX_CLOUD_API_TOKEN")

from(bucket: "example-oss-bucket")
    |> range(start: -10m)
    |> filter(fn: (r) => r._measurement == "example-measurement")
    |> to(
        bucket: "example-cloud-bucket",
        host: "https://cloud2.influxdata.com",
        org: "example-org",
        token: cloudToken,
    )
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
import "experimental"
import "influxdata/influxdb/secrets"

cloudToken = secrets.get(key: "INFLUX_CLOUD_API_TOKEN")

from(bucket: "example-oss-bucket")
    |> range(start: -10m)
    |> filter(fn: (r) => r._measurement == "example-measurement")
    |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> experimental.to(
        bucket: "example-cloud-bucket",
        host: "https://cloud2.influxdata.com",
        org: "example-org",
        token: cloudToken,
    )
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% cloud %}}
### InfluxDB Cloud rate limits
All write requests to InfluxDB Cloud, including those from InfluxDB OSS, are
subject to the rate limits associated with your
[InfluxDB Cloud pricing plan](/influxdb/cloud/account-management/pricing-plans/).
{{% /cloud %}}

## Identify which to() function to use
The structure of data piped-forward into the `to()` function determines which
function use–`to()` or `experimental.to()`.

### Use to()
Use `to()` to write data that is structured with the field key in the `_field`
column and the field value in the `_value` column.

{{< expand-wrapper >}}
{{% expand "View example `to()` data" %}}
**Input data**
| _time                | _measurement | exampleTag | _field | _value |
| :------------------- | :----------- | :--------: | :----- | -----: |
| 2021-01-01T00:00:00Z | example-m    |     A      | temp   |   80.0 |
| 2021-01-01T00:01:00Z | example-m    |     A      | temp   |   80.3 |
| 2021-01-01T00:02:00Z | example-m    |     A      | temp   |   81.1 |

| _time                | _measurement | exampleTag | _field | _value |
| :------------------- | :----------- | :--------: | :----- | -----: |
| 2021-01-01T00:00:00Z | example-m    |     A      | rpm    |   4023 |
| 2021-01-01T00:01:00Z | example-m    |     A      | rpm    |   4542 |
| 2021-01-01T00:02:00Z | example-m    |     A      | rpm    |   4901 |

**Output line protocol**
```
example-m,exampleTag=A temp=80.0,rpm=4023i 1609459200000000000
example-m,exampleTag=A temp=80.3,rpm=4542i 1609459260000000000
example-m,exampleTag=A temp=81.1,rpm=4901i 1609459320000000000
```
{{% /expand %}}
{{< /expand-wrapper >}}

#### Use experimental.to()
Use `experimental.to()` to write data with column names that should be used as
field keys and column values that should be used as field values.

- `experimental.to()` requires `_time` and `_measurement` columns.
- Columns **in** the [group key](/flux/v0.x/get-started/data-model/#grouop-key)
  (other than `_measurement`) are parsed as tags where the column name is the
  tag key and the column value is the tag value.
- Columns **not in** the group key are parsed as fields where the column name is 
  the field key and the column value is the field value.

{{< expand-wrapper >}}
{{% expand "View example `experimental.to()` data" %}}
**Input data**
{{< flux/group-key "[_measurement, exampleTag]">}}
| _time                | _measurement | exampleTag | temp |  rpm |
| :------------------- | :----------- | :--------: | ---: | ---: |
| 2021-01-01T00:00:00Z | example-m    |     A      | 80.0 | 4023 |
| 2021-01-01T00:01:00Z | example-m    |     A      | 80.3 | 4542 |
| 2021-01-01T00:02:00Z | example-m    |     A      | 81.1 | 4901 |

**Output line protocol**
```
example-m,exampleTag=A temp=80.0,rpm=4023i 1609459200000000000
example-m,exampleTag=A temp=80.3,rpm=4542i 1609459260000000000
example-m,exampleTag=A temp=81.1,rpm=4901i 1609459320000000000
```
{{% /expand %}}
{{< /expand-wrapper >}}

## Selectively write data to InfluxDB Cloud
`to()` and `experimental.to()` write data as it is pipe-forwarded.
To selective write data to InfluxDB, use `filter()` to filter points and 
pipe-forward the filtered data into `to()`.

```js
import "influxdata/influxdb/secrets"

cloudToken = secrets.get(key: "INFLUX_CLOUD_API_TOKEN")

from(bucket: "example-oss-bucket")
    |> range(start: -10m)
    |> filter(fn: (r) => r._measurement == "example-measurement")
    |> filter(fn: (r) => r.exampleTag == "someTagValue")
    |> filter(fn: (r) => r._field == "example-field")
    |> filter(fn: (r) => r._value >= 80.0)
    |> to(
        bucket: "example-cloud-bucket",
        host: "https://cloud2.influxdata.com",
        org: "example-org",
        token: cloudToken,
    )
```

## Process data and write it to InfluxDB Cloud
`to()` and `experimental.to()` write data as it is pipe-forwarded.
Use [`map()`](/flux/v0.x/stdlib/universe/map/), [`set()`](/flux/v0.x/stdlib/universe/set/),
[`aggregateWindow()`](/flux/v0.x/stdlib/universe/aggregatewindow/)
[aggregate](/flux/v0.x/function-types/#aggregates) or
[selector functions](/flux/v0.x/function-types/#selectors), or other Flux
functions to process and shape data as needed.

{{% note %}}
The shape of the processed data determines which `to()` function to use.
_See [Identify which to() function to use](#identify-which-to-function-to-use)_. 
{{% /note %}}

### Examples

- [Downsample and write data to InfluxDB Cloud](#downsample-and-write-data-to-influxdb-cloud)
- [Write min, max, and mean values to InfluxDB Cloud](#write-min-max-and-mean-values-to-influxdb-cloud)

#### Downsample and write data to InfluxDB Cloud
```js
import "influxdata/influxdb/secrets"

cloudToken = secrets.get(key: "INFLUX_CLOUD_API_TOKEN")

from(bucket: "example-oss-bucket")
    |> range(start: -10m)
    |> filter(fn: (r) => r._measurement == "example-measurement")
    |> aggregateWindow(every: 1m, fn: last)
    |> to(
        bucket: "example-cloud-bucket",
        host: "https://cloud2.influxdata.com",
        org: "example-org",
        token: cloudToken,
    )
```

#### Write min, max, and mean values to InfluxDB Cloud
```js
import "influxdata/influxdb/secrets"

cloudToken = secrets.get(key: "INFLUX_CLOUD_API_TOKEN")

data = from(bucket: "example-oss-bucket")
    |> range(start: -30m)
    |> filter(fn: (r) => r._measurement == "example-measurement")

min = data |> aggregateWindow(every: 10m, fn: min) |> map(fn: (r) => ({ r with _field: "{$r._field}_min" }))
max = data |> aggregateWindow(every: 10m, fn: max) |> map(fn: (r) => ({ r with _field: "{$r._field}_max" }))
mean = data |> aggregateWindow(every: 10m, fn: mean) |> map(fn: (r) => ({ r with _field: "{$r._field}_mean" }))

union(tables: [min, max, mean])
    |> to(
        bucket: "example-cloud-bucket",
        host: "https://cloud2.influxdata.com",
        org: "example-org",
        token: cloudToken,
    )
```

## Automate writing data from InfluxDB OSS to InfluxDB Cloud
To automatically and routinely write data from InfluxDB OSS to InfluxDB Cloud,
[Create a task](/influxdb/v2.1/process-data/manage-tasks/create-task/) in your
InfluxDB OSS instance that regularly queries, processes, and writes data to
InfluxDB Cloud.

```js
import "influxdata/influxdb/tasks"

option task = {
    name: "Downsample to InfluxDB Cloud",
    every: 1h,
}

from(bucket: "example-oss-bucket")
    |> range(start: -10m)
    |> filter(fn: (r) => r._measurement == "example-measurement")
    |> aggregateWindow(every: 1m, fn: last)
    |> to(
        bucket: "example-cloud-bucket",
        host: "https://cloud2.influxdata.com",
        org: "example-org",
        token: cloudToken,
    )
```

