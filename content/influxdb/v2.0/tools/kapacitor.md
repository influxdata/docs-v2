---
title: Use Kapacitor with InfluxDB OSS
description: >
  [Kapacitor](/kapacitor/) is a data processing framework that makes it easy to
  create alerts, run ETL (Extract, Transform and Load) jobs and detect anomalies.
  Use Kapacitor with **InfluxDB OSS 2.0**.
menu:
  influxdb_2_0:
    name: Use Kapacitor
    parent: Tools & integrations
weight: 104
related:
  - /{{< latest "kapacitor" >}}/
---

[Kapacitor](/{{< latest "kapacitor" >}}/) is a data processing framework that makes
it easy to create alerts, run ETL jobs and detect anomalies.
Use Kapacitor with **InfluxDB Cloud** and **InfluxDB OSS 2.0** to offload much of
data processing burden to Kapacitor.

Because Kapacitor interacts with InfluxDB Cloud and InfluxDB OSS 2.0 using the
[InfluxDB 1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/),
you can continue using Kapacitor without having to migrate libraries of
TICKscripts to InfluxDB tasks.

#### Important notes to consider
- InfluxDB Cloud and InfluxDB OSS 2.0 do not have subscription APIs and
  **do not support Kapacitor stream tasks**, but you can continue to use stream
  tasks by writing data directly to Kapacitor.
  For more information, see [below](#).

## Configure Kapacitor to connect to InfluxDB
To connect Kapacitor to InfluxDB Cloud or InfluxDB OSS 2.0, update the `[[influxdb]]`
section(s) of your Kapacitor configuration file:

- [Specify your InfluxDB URL](#specify-your-influxdb-url)
- [Provide InfluxDB authentication credentials](#provide-influxdb-authentication-credentials)
- [Disable InfluxDB subcriptions](#disable-influxdb-subscriptions)

### Specify your InfluxDB URL
Provide your InfluxDB URL in the `[[influxdb]].urls` configuration option.
For more information, see [InfluxDB Cloud regions](/influxdb/cloud/reference/regions/)
or [InfluxDB OSS URLs](/influxdb/v2.0/reference/urls/).

```toml
[[influxdb]]
  # ...
  urls = ["http://localhost:8086"]
```

### Provide InfluxDB authentication credentials
InfluxDB Cloud and InfluxDB OSS 2.0 require authentication.
Provide the following credentials in your `[[influxdb]].username` and `[[influxdb]].password`
configuration options:

- **username:** InfluxDB username
- **password:** InfluxDB [authentication token](/influxdb/v2.0/security/tokens/)

```toml
[[influxdb]]
  # ...
  username = "influxdb-username"
  password = "influxdb-token"
```

{{% warn %}}
Kapacitor is subject to InfluxDB token permission restrictions.
Ensure the provided InfluxDB authentication token has the necessary read and write permissions.
{{% /warn %}}

### Disable InfluxDB subscriptions
InfluxDB Cloud and InfluxDB OSS 2.0 to not have subscriptions APIs.
Set the `[[influxdb]].disable-subscriptions`to `false` to disable InfluxDB subscriptions.

```toml
[[influxdb]]
  # ...
  disable-subscriptions = true
```

## Kapacitor batch tasks
Kapacitor Batch-style TICKscripts work with the 1.x read compatible API.

## Use Kapacitor stream tasks
InfluxDB Cloud and OSS 2.0 do not have subsription APIs and do not support Kapacitor stream tasks directly.
To use Kapacitor stream tasks, write data directly to Kapacitor using the [Kapcitior `/write` API](/{{< latest "kapacitor" >}}/working/api/#writing-data).

We recommend using [Telegraf InfluxDB output plugin](/{{< latest "telegraf" >}}/plugins/#influxdb)
to write data to both InfluxDB Cloud or OSS and Kapacitor.

##### Example Telegraf configuration
```toml
# Write to Kapacitor
[[outputs.influxdb]]
  urls = ["http://localhost:9092"]
  database = "example-db"
  retention_policy = "example-rp"

# Write to InfluxDB Cloud or OSS
[[outputs.influxdb]]
  urls = ["http://localhost:8086"]
  database = "example-db"
  retention_policy = "example-rp"
  username = "influxdb-username"
  password = "influxdb-token"
```

## Write back to InfluxDB
The `InfluxDBOut` Node. The following writes to the `my-db/my-rp` bucket in InfluxDB Cloud or InfluxDB 2.0.
    ```js
    batch
      |query('SELECT errors / total AS error_percent from requests')
      // Write the transformed data to InfluxDB
      |influxDBOut()
        .database('my-db')
        .retentionPolicy('my-rp')
        .measurement('errors')
        .tag('kapacitor', 'true')
        .tag('version', '0.2')
    ```
