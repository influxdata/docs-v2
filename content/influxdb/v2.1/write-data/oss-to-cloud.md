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
    
    

    Provide the following parameters to either function:

    - **bucket**: InfluxDB Cloud bucket to write to
    - **host**: InfluxDB Cloud region URL
    - **org**: InfluxDB Cloud organization
    - **token**: InfluxDB Cloud API Token
      
      {{% note %}}
({{< req "Recommended" >}})
Store your InfluxDB Cloud API token as an [InfluxDB secret](/influxdb/v2.1/security/secrets/)
in your InfluxDB OSS instance to prevent having to hard-code your API token in queries.
      {{% /note %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[to()](#)
[experimental.to()](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
import "secrets"

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
import "secrets"

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
#### InfluxDB Cloud rate limits
All write requests to InfluxDB Cloud, including those from InfluxDB OSS, are
subject to the rate limits associated with your
[InfluxDB Cloud pricing plan](/influxdb/cloud/account-management/pricing-plans/).
{{% /cloud %}}

##### When to use to()
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

##### When to use experimental.to()
Use `experimental.to()` to write data with 

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

## Automate writing data from InfluxDB OSS to InfluxDB Cloud
- Create a task that regularly writes from OSS to Cloud

## Selective write data
- Filter, remap, restructure