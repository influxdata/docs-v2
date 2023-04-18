---
title: Use the InfluxDB v2 API with InfluxDB Cloud Dedicated
list_title: Use the InfluxDB v2 API
description: >
  Use InfluxDB v2 API authentication, endpoints, and tools.
  Learn how to use InfluxDB Cloud Dedicated v2 `/api/v2/write` and authentication
  for new and existing workloads.
weight: 1
menu:
  influxdb_cloud_dedicated:
    parent: API primers
    name: v2 API primer
influxdb/cloud-dedicated/tags: [write, line protocol]
---

Use the InfluxDB v2 API for new workloads and existing v2 workloads that you bring to InfluxDB Cloud Dedicated.
The InfluxDB Cloud Dedicated v2 `/api/v2/write` endpoint works with token authentication
and existing InfluxDB 2.x tools and code.
For help finding the best workflow for your situation, [contact the Support Team](link).

  <!-- v2 SAMPLE CODE -->

## Authenticate API requests

  <!--TODO: or the `Authorization: Bearer`(???) scheme -->
  
InfluxDB requires each write request to be authenticated with a
[database token](/influxdb/cloud-dedicated/get-started/setup/#create-a-database-token).
With the InfluxDB v2 API, you can use database tokens in the InfluxDB v2 `Authorization: Token` scheme:

- [Authenticate using the Authorization Token scheme](#authenticate-with-the-token-scheme)

### Authenticate with the Token scheme

Use the `Authorization` header with the `Token` scheme to authenticate v2 API requests.

#### Syntax

```http
Authorization: Token DATABASE_TOKEN
```

#### Example

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
{{% /code-tabs %}}
{{% code-tab-content %}}

The following example shows how to use the **cURL** command line tool
and the InfluxDB Cloud Dedicated v2 API to write line protocol data to a database:

```sh
{{% get-shared-text "api/cloud-dedicated/token-auth-v2-write.sh" %}}
```

{{% /code-tab-content %}}

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the database

## Responses

## Write data

Write data with the v2 API `/api/v2/write` endpoint.

See parameter differences in InfluxDB Cloud Dedicated v2 API and how to configure writes using the following tools:

- [Write using Telegraf](#write-data-using-telegraf)
- [Write using client libraries](#write-data-using-v1-client-libraries)
- [Write using HTTP clients](#write-using-http-clients)

### Write using Telegraf

Use the [InfluxDB v2.x `influxdb_v2` Telegraf output plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb_v2/README.md) to write data.

The following table shows `outputs.influxdb` parameters and values to set for writing
to InfluxDB Cloud Dedicated:

option
status
notes
token
Honored
The database token with write permissions.
organization
Ignored


bucket
Honored
The database name
content_encoding
Honored
This can be set to “gzip” or “identity”
influx_uint_support
n/a
This is a client side option, only mentioned here because it is support by IOx


The following sample shows a minimal `outputs.influxdb_v2` configuration 
for writing to InfluxDB Cloud Dedicated:

```toml
[[outputs.influxdb_v2]]
 urls = ["https://cloud2.influxdata.com"]
 token = "DATABASE_TOKEN"
 organization = ""
 bucket = "DATABASE_NAME"
 content_encoding = "gzip"
 influx_uint_support = false
```

To configure the v2.x output plugin for writing to InfluxDB Cloud Dedicated,
add the following `outputs.influxdb_v2` configuration in your `telegraf.conf` file:

#### Other Telegraf configuration options

`influx_uint_support`: supported in InfluxDB IOx.

For more options that affect Telegraf behavior, see 

option
status
notes
token
Honored
The database token with write permissions.
organization
Ignored


bucket
Honored
The database name
content_encoding
Honored
This can be set to “gzip” or “identity”
influx_uint_support
n/a
This is a client side option, only mentioned here because it is support by IOx



### Write using client libraries

### Write using HTTP clients

### influx CLI not supported

Don't use the `influx` CLI for writing data to {{% cloud-name %}}.
While the `influx` CLI may coincidentally work with {{% cloud-name %}}, it isn't officially supported.

If you need to test writes interactively, see how to [write using HTTP clients](#write-using-http-clients).

## Query data

### Query using Flight SQL

Use Flight SQL clients with gRPC and SQL to query data stored in an InfluxDB Cloud Dedicated database.

### /api/v2/query not supported

The `/api/v2/query` and associated tooling aren't supported in InfluxDB Cloud Dedicated.


