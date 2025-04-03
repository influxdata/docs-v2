
To write data from InfluxDB OSS to InfluxDB Cloud, use the Flux
[`to()`](/flux/v0/stdlib/influxdata/influxdb/to/) or
[`experimental.to()`](/flux/v0/stdlib/experimental/to/) functions.
Write data once with a single query execution or use [InfluxDB tasks](/influxdb/version/process-data/)
to [routinely write data to InfluxDB Cloud](#automate-writing-data-from-influxdb-oss-to-influxdb-cloud).

{{% note %}}
#### Replicate writes to InfluxDB OSS to InfluxDB Cloud
To replicate all writes to an InfluxDB OSS instance to an InfluxDB Cloud instance,
use [InfluxDB replication streams](/influxdb/version/write-data/replication/).
{{% /note %}}

> [!Important]
>
> #### InfluxDB Cloud rate limits
> Write requests to InfluxDB Cloud are subject to the rate limits associated with your
> [InfluxDB Cloud pricing plan](/influxdb/cloud/account-management/pricing-plans/).

1.  Query data from InfluxDB OSS.
2.  _(Optional)_ [Filter](/flux/v0/stdlib/universe/filter/) or process data to write to InfluxDB Cloud.
3.  Use `to` or `experimental.to` to write data to InfluxDB Cloud.
    For most use cases, `to()` is the correct function to use, but depending on
    the structure of the data you're writing, `experimental.to` may be required.
    
    **Use the following guidelines**:
    
    - **to()**: Use to write data in field keys to the `_field` column and field values to the `_value` column.

    - **experimental.to()**: Use to write data in column names to corresponding field keys and column values to field values.

    _See [input and output examples for `to()` functions](#input-and-output-data-for-to-functions)._
    
4.  Provide the following parameters to either function:

    - **bucket**: InfluxDB Cloud bucket to write to
    - **host**: InfluxDB Cloud region URL
    - **org**: InfluxDB Cloud organization
    - **token**: InfluxDB Cloud API Token
      
5.  ({{< req "Recommended" >}}) To keep your raw API token out of queries, store
    your InfluxDB Cloud API token as an [InfluxDB secret](/influxdb/version/admin/secrets/)
    in your InfluxDB OSS instance and use [`secrets.get()`](/flux/v0/stdlib/influxdata/influxdb/secrets/get/)
    to retrieve the secret value as shown in the following example
    (select the function you're using to see the correct format):


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

## Input and output data for to() functions

{{< tabs-wrapper >}}
{{% tabs %}}
[to()](#)
[experimental.to()](#)
{{% /tabs %}}
{{% tab-content %}}

- `to()` requires `_time`, `_measurement`, `_field`, and `_value` columns.
- `to()` writes all other columns as tags where the column name is the tag key
  and the column value is the tag value.

#### Input data
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

#### Output line protocol
```
example-m,exampleTag=A temp=80.0,rpm=4023i 1609459200000000000
example-m,exampleTag=A temp=80.3,rpm=4542i 1609459260000000000
example-m,exampleTag=A temp=81.1,rpm=4901i 1609459320000000000
```
{{% /tab-content %}}

{{% tab-content %}}
- `experimental.to()` requires `_time` and `_measurement` columns.
- Columns **in** the [group key](/flux/v0/get-started/data-model/#grouop-key)
  (other than `_measurement`) are parsed as tags where the column name is the
  tag key and the column value is the tag value.
- Columns **not in** the group key (other than `_time_`) are parsed as fields
  where the column name is the field key and the column value is the field value.

#### Input data {id="experimental-input-data"}
{{< flux/group-key "[_measurement, exampleTag]">}}
| _time                | _measurement | exampleTag | temp |  rpm |
| :------------------- | :----------- | :--------: | ---: | ---: |
| 2021-01-01T00:00:00Z | example-m    |     A      | 80.0 | 4023 |
| 2021-01-01T00:01:00Z | example-m    |     A      | 80.3 | 4542 |
| 2021-01-01T00:02:00Z | example-m    |     A      | 81.1 | 4901 |

#### Output line protocol {id="experimental-output-line-protocol"}
```
example-m,exampleTag=A temp=80.0,rpm=4023i 1609459200000000000
example-m,exampleTag=A temp=80.3,rpm=4542i 1609459260000000000
example-m,exampleTag=A temp=81.1,rpm=4901i 1609459320000000000
```
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Examples

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
[create a task](/influxdb/version/process-data/manage-tasks/create-task/) in your
InfluxDB OSS instance that regularly queries, processes, and writes data to
InfluxDB Cloud.

```js
import "influxdata/influxdb/tasks"

option task = {name: "Downsample to InfluxDB Cloud", every: 1h}

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

