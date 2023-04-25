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
For help finding the best workflow for your situation, [contact Support](mailto:support@influxdata.com).

  <!-- v2 SAMPLE CODE -->

<!-- TOC -->

- [Authenticate API requests](#authenticate-api-requests)
  - [Authenticate with a token](#authenticate-with-a-token)
    - [Syntax](#syntax)
    - [Examples](#examples)
- [Responses](#responses)
  - [Errors](#errors)
- [Write data](#write-data)
  - [Write using Telegraf](#write-using-telegraf)
    - [Other Telegraf configuration options](#other-telegraf-configuration-options)
  - [Write using client libraries](#write-using-client-libraries)
  - [Write using HTTP clients](#write-using-http-clients)
    - [v2 API /api/v2/write parameters](#v2-api-apiv2write-parameters)
    - [Timestamp precision](#timestamp-precision)
    - [Use clients for interactive testing](#use-clients-for-interactive-testing)
  - [influx CLI not supported](#influx-cli-not-supported)
- [Query data](#query-data)
  - [Query using Flight SQL](#query-using-flight-sql)
  - [/api/v2/query not supported](#apiv2query-not-supported)

<!-- /TOC -->

## Authenticate API requests

InfluxDB requires each write request to be authenticated with a
[database token](/influxdb/cloud-dedicated/admin/tokens/).

### Authenticate with a token

Use the `Authorization: Bearer` or the `Authorization: Token` scheme to pass a [database token](/influxdb/cloud-dedicated/admin/tokens/) that has _write_ permission to your database.
In the InfluxDB Cloud Dedicated HTTP API, the schemes are equivalent.
The `Token` scheme is used in the InfluxDB 2.x API.
The [`Bearer` scheme](https://www.rfc-editor.org/rfc/rfc6750#page-14) is more common.
Support for one or the other may vary across InfluxDB API clients.

#### Syntax

```http
Authorization: Bearer DATABASE_TOKEN
```

```http
Authorization: Token DATABASE_TOKEN
```

#### Examples

Use `Bearer` to authenticate a write request:

```sh
{{% get-shared-text "api/cloud-dedicated/bearer-auth-v2-write.sh" %}}
```

Use `Token` to authenticate a write request:

```sh
{{% get-shared-text "api/cloud-dedicated/token-auth-v2-write.sh" %}}
```

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the database

## Responses

InfluxDB Cloud Dedicated API responses use standard HTTP status codes.
InfluxDB Cloud Dedicated API response body messages may differ from InfluxDB Cloud and InfluxDB OSS.
### Errors

```sh
Status code: 400
Reason: Bad Request
HTTP response body: {"code":"invalid","message":"missing org/bucket value"}
```

The request is missing the `org` or `bucket` values.
For `bucket`, provide the database name.
For `org`, provide a non-zero-length string. InfluxDB ignores it, but it can't be empty.

## Write data

Use the InfluxDB Cloud Dedicated v2 API `/api/v2/write` endpoint to write data to a database.
We recommend using the v2 API `/api/v2/write` endpoint
for new and existing workloads.

See how to set parameters and configure the following tools for writing to InfluxDB Cloud Dedicated:

- [Write using Telegraf](#write-using-telegraf)
- [Write using client libraries](#write-using-client-libraries)
- [Write using HTTP clients](#write-using-http-clients)
  - [v2 API /api/v2/write parameters](#v2-api-apiv2write-parameters)
  - [Use clients for interactive testing](#use-clients-for-interactive-testing)

### Write using Telegraf

Use the [InfluxDB v2.x `influxdb_v2` Telegraf output plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb_v2/README.md) to write data.

The following table shows `outputs.influxdb` parameters and values for writing
to InfluxDB Cloud Dedicated:

Parameter                | Ignored                  | Value
-------------------------|--------------------------|--------------------------------------------------------------------------------------------------------------------------------|
`token` | Honored | [Database token](/influxdb/cloud-dedicated/admin/tokens/) with permission to write to the database |
`organization` | Ignored | |
`bucket` | Honored | Database name |
`content_encoding` | Honored | `gzip` (compressed data) or `identity` (uncompressed) |

To configure the v2.x output plugin for writing to InfluxDB Cloud Dedicated,
add the following `outputs.influxdb_v2` configuration in your `telegraf.conf` file:

```toml
[[outputs.influxdb_v2]]
 urls = ["https://cluster-id.influxdb.io"]
 token = "DATABASE_TOKEN"
 organization = ""
 bucket = "DATABASE_NAME"
 content_encoding = "gzip"
 influx_uint_support = false
```

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with permission to write to the database

#### Other Telegraf configuration options

`influx_uint_support`: supported in InfluxDB IOx.

For more plugin options, see [`influxdb_v2`](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb_v2/README.md) on GitHub.

### Write using client libraries

Use language-specific [v2 client libraries](/influxdb/cloud/api-guide/client-libraries/) and your custom code to write data to InfluxDB Cloud Dedicated.
v2 client libraries send data in [line protocol](/influxdb/cloud-iox/reference/syntax/line-protocol/) syntax to the v2 API `/api/v2/write` endpoint.

The following samples show how to configure **v2** client libraries for writing to InfluxDB Cloud Dedicated:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
[Python](#python)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-- Start NodeJS -->

Create a v2 API client using the [`influxdb-client-js`](https://github.com/influxdata/influxdb-client-js) JavaScript client library:

1. Call the `InfluxDB({url, token})` constructor to instantiate an `InfluxDB` client. Provide the InfluxDB **URL** and a [database token](/influxdb/cloud-dedicated/admin/tokens/).

   ```js
   import {InfluxDB, Point} from '@influxdata/influxdb-client'

   const influxDB = new InfluxDB({'https://cluster-id.influxdb.io', DATABASE_TOKEN})
   ```

   The client (`influxDB`) provides the `getWriteAPI(org, bucket, precision, writeOptions)` method that returns a client for writing data to the `/api/v2/write` endpoint.

2. Call the [`InfluxDB.getWriteApi(org, bucket, precision, writeOptions)` method](https://influxdata.github.io/influxdb-client-js/influxdb-client.influxdb.getwriteapi.html) to instantiate a **write client**.
   
   Provide the following parameter values:
   
   - `org`: a non-zero-length string. InfluxDB ignores the value, but it can't be empty.
   - `bucket`: InfluxDB Cloud Dedicated database
   - `precision`: a [timestamp precision](#timestamp-precision) (`ns`, `u`, `ms`, `s`, `m`, `h`)

   ```js
   const writeApi = influxDB.getWriteApi('', DATABASE_NAME, 'ns')
   ```

   For more information about **write client** features in the InfluxDB 2.x JavaScript client library, see [`influxdb-client-js`](https://github.com/influxdata/influxdb-client-js) and the [`WriteAPI` interface](https://influxdata.github.io/influxdb-client-js/influxdb-client.writeapi.html) on GitHub.

   <!-- End NodeJS -->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- Start Python -->

Create a v2 API client using the [influxdb-client-python](https://github.com/influxdata/influxdb-client-python) Python client library:

1. Call the `InfluxDBClient(url, token, org)` constructor to instantiate an `InfluxDBClient`.

  Provide the following parameter values:

  - `url=`: InfluxDB Cloud Dedicated cluster URL
  - `token=`: a [database token](/influxdb/cloud-dedicated/admin/tokens/)
  - `org`: a non-zero-length string. InfluxDB ignores the value, but it can't be empty.

  ```py
  
  influxdb_client = InfluxDBClient(url='https://cluster-id.influxdb.io',
                                  token='DATABASE_TOKEN',
                                  org='placeholder_org')
  ```

2. Call the `InfluxDBClient.write_api(write_options)` method to instantiate a **write client**.

  ```py
      write_api = influxdb_client.write_api(write_options=SYNCHRONOUS)
  ```

 3. To write data, call the `write_api.write()` method.

    Provide the following parameter values:

    - `bucket=`: InfluxDB Cloud Dedicated database
    - `record=`: the point data to write

    The following sample constructs a `Data Point`, calls `write()` to add the point to a line protocol batch,
    and then calls `write_api.close()` to write the batch:

    ```py
      write_api.write(bucket='DATABASE_NAME', record="home,room=kitchen temp=72 1463683075")
      write_api.close()
    ```

  For more information about the Python client library for the InfluxDB v2 API, see [`influxdb-client-python`](https://github.com/influxdata/influxdb-client-python) on GitHub.
<!-- End Python -->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the database

### Write using HTTP clients

Use HTTP clients and your custom code to send write requests to the v2 API `/api/v2/write` endpoint.

{{% api-endpoint endpoint="https://cluster-id.influxdb.io/api/v2/write" method="post"%}}

Include the following in your request:

- A `bucket` query string parameter with the name of the database to write to.
- A request body that contains a string of data in [line protocol](/influxdb/cloud-iox/reference/syntax/line-protocol/) syntax.
- A [database token](/influxdb/cloud-dedicated/admin/tokens/) in a [token authentication scheme](#authenticate-with-a-token).
- Optional [parameters](#v2-api-apiv2write-parameters).

#### v2 API /api/v2/write parameters

Parameter        | Allowed in   | Ignored | Value
-----------------|--------------|---------|-------------------------
org              | Query string | Ignored | Non-zero-length string (ignored, but can't be empty)
orgID            | Query string | Ignored | N/A
bucket {{% req " \*" %}} | Query string | Honored | Database name
precision        | Query string | Honored | [Timestamp precision](#timestamp-precision): `ns`, `u`, `ms`, `s`, `m`, `h` <!-- default? ns? -->
Accept           | Header       | Honored | User-defined
`Authorization`  {{% req " \*" %}} | Header       | Honored | `Token DATABASE_TOKEN`
`Content-Encoding`     | Header       | Honored | `gzip` (compressed data) or `identity` (uncompressed)
Content-Length   | Header       | Honored | User-defined
Content-Type     | Header       | Ignored | N/A (only supports line protocol)
Zap-Trace-Span   | Header       | Ignored |

{{% caption %}}{{% req " \*" %}} = {{% req "Required" %}}{{% /caption %}}

#### Timestamp precision

Use one of the following `precision` values in v2 API `/api/v2/write` requests:

- `ns`: nanoseconds
- `us`: microseconds <!-- @TODO: test that differs from `us` used in v2?? -->
- `ms`: milliseconds
- `s`: seconds
- `m`: minutes
- `h`: hours

#### Use clients for interactive testing

To test interactively, use common HTTP clients such as cURL and Postman to send requests to the v2 API `/api/v2/write` endpoint.

{{% warn %}}
While the `influx` CLI may coincidentally work with InfluxDB Cloud Dedicated, it isn't officially supported.
{{% /warn %}}

The following example shows how to use the **cURL** command line tool and the InfluxDB Cloud Dedicated v2 API to write line protocol data to a database:

```sh
curl --request POST \
"https://cluster-id.influxdb.io/api/v2/write?bucket=DATABASE_NAME&precision=ns" \
  --header "Authorization: Token DATABASE_TOKEN" \
  --header "Content-Type: text/plain; charset=utf-8" \
  --header "Accept: application/json" \
  --data-binary '
    airSensors,sensor_id=TLM0201 temperature=73.97038159354763,humidity=35.23103248356096,co=0.48445310567793615 1630424257000000000
    airSensors,sensor_id=TLM0202 temperature=75.30007505999716,humidity=35.651929918691714,co=0.5141876544505826 1630424257000000000'
```

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the database

### influx CLI not supported

Don't use the `influx` CLI with {{% cloud-name %}}.
While it may coincidentally work, it isn't officially supported.

If you need to test writes interactively, see how to [write using HTTP clients](#write-using-http-clients).

## Query data

Use Flight SQL clients with gRPC and SQL to query data stored in an InfluxDB Cloud Dedicated database.

### Query using Flight SQL

Choose from the following tools to query InfluxDB Cloud Dedicated:

- [Flight SQL plugin]() for [Grafana]()
- [Superset]()
- [`pyinflux3` module](https://github.com/InfluxCommunity/pyinflux3)
- [`flightsql-dbapi`](https://github.com/influxdata/flightsql-dbapi)

See how to [get started querying with SQL](/influxdb/cloud-dedicated/get-started/query/#sql-query-basics)

### /api/v2/query not supported

The `/api/v2/query` and associated tooling aren't supported in InfluxDB Cloud Dedicated. See how to [query using Flight SQL](#query-using-flight-sql).
