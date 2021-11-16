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

- Use `to` or `experimental.to`
  - Use `experimental.to` for data with fields that have been pivoted into columns.
    For more information

  - Provide the following parameters to the to function
    - **bucket**: InfluxDB Cloud bucket to write to
    - **host**: InfluxDB Cloud region URL
    - **org**: InfluxDB Cloud organization
    - **token**: InfluxDB Cloud API Token (store as a secret to prevent hard-coding sensitive tokens)

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

## Automated writing
- Create a task that regularly writes from OSS to Cloud

## Selective write data
- Filter, remap, restructure