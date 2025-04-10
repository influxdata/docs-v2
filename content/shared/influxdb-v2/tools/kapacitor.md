
[Kapacitor](/kapacitor/v1/) is a data processing framework that makes
it easy to create alerts, run ETL jobs and detect anomalies.
Kapacitor interacts with **InfluxDB Cloud** and **InfluxDB OSS {{< current-version >}}** using the
[InfluxDB 1.x compatibility API](/influxdb/version/reference/api/influxdb-1x/), so
you can continue using Kapacitor without having to migrate libraries of TICKscripts
to InfluxDB tasks.

{{% note %}}
#### Support for stream tasks
InfluxDB Cloud and InfluxDB OSS {{< current-version >}} do not have subscription APIs and
**do not support Kapacitor stream tasks**, but you can continue to use stream
tasks by writing data directly to Kapacitor.
For more information, see [below](#use-kapacitor-stream-tasks).
{{% /note %}}

#### On this page
- [Configure Kapacitor to connect to InfluxDB](#configure-kapacitor-to-connect-to-influxdb)
- [Use Kapacitor batch tasks](#use-kapacitor-batch-tasks)
- [Use Kapacitor stream tasks](#use-kapacitor-stream-tasks)
- [Write back to InfluxDB](#write-back-to-influxdb)

## Configure Kapacitor to connect to InfluxDB
To connect Kapacitor to InfluxDB Cloud or InfluxDB OSS {{< current-version >}}, update the `[[influxdb]]`
section(s) of your [Kapacitor configuration file](/kapacitor/v1/administration/configuration/#kapacitor-configuration-file):

- [Specify your InfluxDB URL](#specify-your-influxdb-url)
- [Provide InfluxDB authentication credentials](#provide-influxdb-authentication-credentials)
- [Disable InfluxDB subscriptions](#disable-influxdb-subscriptions)

### Specify your InfluxDB URL
Provide your InfluxDB URL in the `[[influxdb]].urls` configuration option.
For more information, see [InfluxDB Cloud regions](/influxdb/cloud/reference/regions/)
or [InfluxDB OSS URLs](/influxdb/version/reference/urls/).

```toml
[[influxdb]]
  # ...
  urls = ["http://localhost:8086"]
```

### Provide InfluxDB authentication credentials
InfluxDB Cloud and InfluxDB OSS {{< current-version >}} require authentication.
Provide the following credentials in your `[[influxdb]].username` and `[[influxdb]].password`
configuration options:

- **username:** InfluxDB username
- **password:** InfluxDB [API token](/influxdb/version/admin/tokens/)

```toml
[[influxdb]]
  # ...
  username = "influxdb-username"
  password = "influxdb-token"
```

{{% warn %}}
Kapacitor is subject to InfluxDB token permission restrictions.
To query or write to an InfluxDB bucket, the InfluxDB token must have read and/or
write permissions for the target bucket.
For information about token permissions, see [Create a token](/influxdb/version/admin/tokens/create-token/).
{{% /warn %}}

### Disable InfluxDB subscriptions
InfluxDB Cloud and InfluxDB OSS {{< current-version >}} do not have subscriptions APIs.
Set the `[[influxdb]].disable-subscriptions`to `true` to disable InfluxDB subscriptions.

```toml
[[influxdb]]
  # ...
  disable-subscriptions = true
```

## Use Kapacitor batch tasks
Kapacitor batch tasks use the `query` endpoint of the 1.x compatibility API
and require no change to use with InfluxDB Cloud and InfluxDB OSS.
For information about writing back to InfluxDB in Kapacitor tasks,
see [Write back to InfluxDB](#write-back-to-influxdb) below.

## Use Kapacitor stream tasks
InfluxDB Cloud and OSS {{< current-version >}} do not have subscription APIs and do not support Kapacitor stream tasks directly.
To use Kapacitor stream tasks, write data directly to Kapacitor using the [Kapacitor `write` API](/kapacitor/v1/working/api/#writing-data). We recommend using the [Telegraf InfluxDB output plugin](/telegraf/v1/plugins/#output-influxdb) to write data to both InfluxDB Cloud or OSS and Kapacitor.

##### Write data using the Telegraf InfluxDB output plugin

To write data to both InfluxDB and Kapacitor using the InfluxDB output plugin, complete the following steps:

1. [Install Telegraf](/telegraf/v1/install/).
2. [Create a DBRP mapping](/influxdb/version/query-data/influxql/dbrp/#create-dbrp-mappings). 
3. In the [Telegraf InfluxDB output plugin](/telegraf/v1/plugins/#output-influxdb) configuration file, specify the following options, replacing `database`, `retention_policy`, `username` and `password` to match your DBRP mapping, and set `skip_database_creation` to `true`:

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
  skip_database_creation = true
```

## Write back to InfluxDB
If using the Kapacitor `InfluxDBOut` node to write data to InfluxDB {{< current-version >}},
InfluxDB maps the specified database and retention policy to a corresponding bucket.
You can also manually map database/retention policy combinations (DBRPs) to buckets.
For more information, see [DBRP mapping](/influxdb/version/reference/api/influxdb-1x/dbrp/){{% show-in "v2" %}}.{{% /show-in %}}
{{% show-in "cloud,cloud-serverless" %}}and [Create DBRP mappings](/influxdb/version/query-data/influxql/dbrp/#create-dbrp-mappings).{{% /show-in %}}

The following example TICKscript writes to the `my-db/my-rp` bucket in
InfluxDB Cloud or InfluxDB OSS {{< current-version >}}.

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
