---
title: Use the InfluxDB v1 HTTP write API
seotitle: Use the v1 write API
list_title: Use the v1 write API
description: >
  Use the InfluxDB v1 HTTP write API to write data stored in InfluxDB Cloud Serverless.
weight: 301
menu:
  influxdb3_cloud_serverless:
    parent: Write data
    name: Use the v1 HTTP write API
influxdb3/cloud-serverless/tags: [query, influxql, python]
metadata: [InfluxQL]
related:
  - /influxdb3/cloud-serverless/guides/api-compatibility/v1/
  - /influxdb3/cloud-serverless/reference/client-libraries/v1/
list_code_example: |
  ```sh
  curl "https://{{< influxdb/host >}}/write?db=DATABASE_NAME&rp=RETENTION_POLICY&precision=s" \
    --header "Authorization: Token API_TOKEN" \
    --header "Content-type: text/plain; charset=utf-8" \
    --data-binary 'home,room=kitchen temp=72 1463683075'
  ```
---

Use the InfluxDB v1 HTTP API `/write` endpoint and InfluxQL to write data stored in {{< product-name >}}.
The `/write` endpoint provides compatibility for InfluxDB 1.x workloads that you bring to InfluxDB 3.

_The v1 write and query APIs require [mapping databases and retention policies to buckets](#map-v1-databases-and-retention-policies-to-buckets)._

- [Map v1 databases and retention policies to buckets](#map-v1-databases-and-retention-policies-to-buckets)
  - [Autogenerate a bucket and DBRP mapping](#autogenerate-a-bucket-and-dbrp-mapping)
  - [Create a bucket and DBRP mapping](#create-a-bucket-and-dbrp-mapping)
- [Write to the v1 HTTP `/write` endpoint](#write-to-the-v1-http-write-endpoint)
  - [Parameters](#v1-api-write-parameters)
  - [Data](#data)
  - [Authorization](#authorization)
  - [Tools for writing to the v1 API](#tools-for-writing-to-the-v1-api)

## Map v1 databases and retention policies to buckets

The v1 write and query APIs require mapping databases and retention policies to buckets.

InfluxDB can [autogenerate a bucket and DBRP mapping](#autogenerate-a-bucket-and-dbrp-mapping) for a write request or you can [create a bucket and DBRP](#create-a-bucket-and-dbrp-mapping) before writing.

### Autogenerate a bucket and DBRP mapping

To let InfluxDB autogenerate a bucket and an associated DBRP mapping, pass the following parameters when writing data to the v1 `/write` endpoint:

- a [`db=DATABASE_NAME` parameter](#v1-api-write-parameters).
- Optional: an [`rp=RETENTION_POLICY_NAME`](#v1-api-write-parameters) parameter. Default retention policy name is `autogen`.
- a token (such as an  [All-access token](/influxdb3/cloud-serverless/admin/tokens/#all-access-api-token)) that has permission to write DBRPs and buckets.

If no bucket exists with the name `DATABASE_NAME/RETENTION_POLICY_NAME`, InfluxDB creates a bucket and a DBRP before writing the data to the bucket.

To learn more about DBRP mapping, see the [v1 API compatibility guide](#map-v1-databases-and-retention-policies-to-buckets).

### Create a bucket and DBRP mapping

To create a DBRP for a bucket:

1. If it doesn't already exist, [create the bucket](/influxdb3/cloud-serverless/admin/buckets/create-bucket/) that you want to write to.
2. [Find the bucket ID](/influxdb3/cloud-serverless/admin/buckets/view-buckets/) for the bucket that you want to write to.
3. [Create a DBRP](/influxdb3/cloud-serverless/guides/api-compatibility/v1/#create-dbrp-mappings), which maps a database name and retention policy name to the bucket ID from the preceding step.

If the `db=DATABASE_NAME` and `rp=RETENTION_POLICY` parameters in your `/write` request map to an existing DBRP, InfluxDB writes to the mapped bucket.

## Write to the v1 HTTP `/write` endpoint

{{% api-endpoint endpoint="https://{{< influxdb/host >}}/write" method="post" %}}

- [`/write` parameters](#v1-api-write-parameters)
- [Tools for writing to the v1 API](#tools-for-writing-to-the-v1-api)

### v1 API /write parameters

For {{% product-name %}} v1 API `/write` requests, set parameters as listed in the following table:

Parameter              | Allowed in   | Ignored                  | Value
-----------------------|--------------|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`consistency`          | Query string | Ignored                  | N/A
`db` {{% req " \*" %}} | Query string | Honored                  | Database (see how to [map databases and retention policies to buckets](#map-v1-databases-and-retention-policies-to-buckets))
`precision`            | Query string | Honored                  | [Timestamp precision](#timestamp-precision)
`rp`                   | Query string | Honored                  | Retention policy (see how to [map databases and retention policies to buckets](#map-v1-databases-and-retention-policies-to-buckets))
[`Authorization` header or `u` and `p`](#authorization)  | | | [Token](#authorization)

{{% caption %}}{{% req " \*" %}} = {{% req "Required" %}}{{% /caption %}}

#### Timestamp precision

Use one of the following `precision` values in v1 API `/write` requests:

- `ns`: nanoseconds
- `us`: microseconds
- `ms`: milliseconds
- `s`: seconds
- `m`: minutes
- `h`: hours

### Data

In the request body, include the [line protocol](/influxdb3/cloud-serverless/write-data/line-protocol/) data that you want to write to the bucket.

### Authorization

To authorize writes to an existing bucket, include a [token](/influxdb3/cloud-serverless/admin/tokens/) that has write permission to the bucket.
Use [`Token` authentication](/influxdb3/cloud-serverless/guides/api-compatibility/v1/#authenticate-with-a-token-scheme) or v1-compatible [username and password authentication](/influxdb3/cloud-serverless/guides/api-compatibility/v1/#authenticate-with-a-username-and-password-scheme) to include a token in the request.

For InfluxDB to autogenerate the bucket and DBRP, you must use a [token](/influxdb3/cloud-serverless/admin/tokens/), such as an **All-access token**, that has write permissions to buckets and DBRPs.

### Tools for writing to the v1 API

When using the v1 API and associated tooling, pass the DBRP mapping's database name and retention policy name in the request parameters.

The following tools work with the {{% product-name %}} `/write` endpoint:

- [Telegraf](#telegraf)
- [Interactive clients](#interactive-clients)
- [Client libraries](#client-libraries)

#### Telegraf

If you have existing v1 workloads that use Telegraf,
you can use the [InfluxDB v1.x `influxdb` Telegraf output plugin](/telegraf/v1/output-plugins/influxdb/) to write data.

> [!Note]
> See how to [use Telegraf and the v2 API](/influxdb3/cloud-serverless/write-data/use-telegraf/) for new workloads that don't already use the v1 API.

The following table shows `outputs.influxdb` plugin parameters and values for writing to the {{% product-name %}} v1 API:

Parameter                | Ignored                  | Value
-------------------------|--------------------------|---------------------------------------------------------------------------------------------------
`database`               | Honored                  | Bucket name
`retention_policy`       | Honored | [Duration](/influxdb3/cloud-serverless/reference/glossary/#duration)
`username`               | Ignored                  | String or empty
`password`               | Honored                  | [API token](/influxdb3/cloud-serverless/admin/tokens/) with permission to write to the bucket
`content_encoding`       | Honored                  | `gzip` (compressed data) or `identity` (uncompressed)
`skip_database_creation` | Ignored                  | N/A (see how to [create a bucket](/influxdb3/cloud-serverless/admin/buckets/create-bucket/))

To configure the v1.x output plugin for writing to {{% product-name %}}, add the following `outputs.influxdb` configuration in your `telegraf.conf` file:

{{% code-placeholders "API_TOKEN|RETENTION_POLICY" %}}
```toml
[[outputs.influxdb]]
  urls = ["https://{{< influxdb/host >}}"]
  database = "DATABASE_NAME"
  skip_database_creation = true
  retention_policy = "RETENTION_POLICY"
  username = "ignored"
  password = "API_TOKEN"
  content_encoding = "gzip”
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the [database](#map-v1-databases-and-retention-policies-to-buckets)
- {{% code-placeholder-key %}}`RETENTION_POLICY`{{% /code-placeholder-key %}}: the [retention policy](#map-v1-databases-and-retention-policies-to-buckets)
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb3/cloud-serverless/admin/tokens/) with sufficient permissions to the mapped bucket

##### Other Telegraf configuration options

`influx_uint_support`: supported in InfluxDB 3.

For more plugin options, see [`influxdb`](/telegraf/v1/output-plugins/influxdb/) on GitHub.

#### Interactive clients

To test InfluxDB v1 API writes interactively from the command line, use common HTTP clients such as cURL and Postman.

> [!Note]
> For production use cases, use tools such as [client libraries](#client-libraries) that construct line protocol for you and provide batch writing options.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Token Auth](#)
[Basic Auth](#)
[Query String Auth](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
{{% code-placeholders "DATABASE_NAME|API_TOKEN|RETENTION_POLICY" %}}
```sh
curl -i "https://{{< influxdb/host >}}/write?db=DATABASE_NAME&rp=RETENTION_POLICY&precision=s" \
    --header "Authorization: Token API_TOKEN" \
    --header "Content-type: text/plain; charset=utf-8" \
    --data-binary 'home,room=kitchen temp=72 1463683075'
```
{{% /code-placeholders %}}
{{% /code-tab-content %}}
{{% code-tab-content %}}
{{% code-placeholders "DATABASE_NAME|API_TOKEN|RETENTION_POLICY" %}}
```sh
curl -i "https://{{< influxdb/host >}}/write?db=DATABASE_NAME&rp=RETENTION_POLICY&precision=s" \
    -user "ignored":"API_TOKEN" \
    --header "Content-type: text/plain; charset=utf-8" \
    --data-binary 'home,room=kitchen temp=72 1463683075'
```
{{% /code-placeholders %}}
{{% /code-tab-content %}}
{{% code-tab-content %}}
{{% code-placeholders "DATABASE_NAME|API_TOKEN|RETENTION_POLICY" %}}
```sh
curl -i "https://{{< influxdb/host >}}/write?db=DATABASE_NAME&rp=RETENTION_POLICY&precision=s" \
    --header "Content-type: text/plain; charset=utf-8" \
    --data-urlencode "u=ignored" \
    --data-urlencode "p=DATABASE_TOKEN" \
    --data-binary 'home,room=kitchen temp=72 1463683075'
```
{{% /code-placeholders %}}
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the [database](#map-v1-databases-and-retention-policies-to-buckets)
- {{% code-placeholder-key %}}`RETENTION_POLICY`{{% /code-placeholder-key %}}: the [retention policy](#map-v1-databases-and-retention-policies-to-buckets)
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb3/cloud-serverless/admin/tokens/) with sufficient permissions to the mapped bucket

#### v1 influx CLI (not supported)

Don't use the v1 `influx` CLI with {{% product-name %}}.
While it may coincidentally work, it isn't officially supported.

#### Client libraries

Use language-specific [v1 client libraries](/influxdb/v1/tools/api_client_libraries/) and your custom code to write data to InfluxDB.
v1 client libraries send data in [line protocol](/influxdb3/cloud-serverless/reference/syntax/line-protocol/) syntax to the v1 API `/write` endpoint.

The following samples show how to configure **v1** client libraries for writing to {{% product-name %}}:

{{< tabs-wrapper >}}
{{% tabs %}}
[Node.js](#nodejs)
[Python](#python)
{{% /tabs %}}
{{% tab-content %}}
<!-- Start NodeJS -->

Create a v1 API client using the [node-influx](/influxdb/v1/tools/api_client_libraries/#javascriptnodejs) JavaScript client library:

{{% code-placeholders "BUCKET_NAME|API_TOKEN|RETENTION_POLICY" %}}
```js
const Influx = require('influx')

// Instantiate a client for writing to {{% product-name %}} v1 API
const client = new Influx.InfluxDB({
  host: '{{< influxdb/host >}}',
  port: 443,
  protocol: 'https'
  database: 'BUCKET_NAME',
  username: 'ignored',
  password: 'API_TOKEN'
})

// When calling write or query functions, specify the retention policy name in options.
```
{{% /code-placeholders %}}

<!-- End NodeJS -->
{{% /tab-content %}}
{{% tab-content %}}
<!-- Start Python -->

Create a v1 API client using the [influxdb-python](/influxdb/v1/tools/api_client_libraries/#python) Python client library:

{{% code-placeholders "DATABASE_NAME|API_TOKEN|RETENTION_POLICY" %}}
```py
from influxdb import InfluxDBClient

# Instantiate a client for writing to {{% product-name %}} v1 API
client = InfluxDBClient(
  host='{{< influxdb/host >}}',
  ssl=True,
  database='DATABASE_NAME',
  username='',
  password='API_TOKEN'
  headers={'Content-Type': 'text/plain; charset=utf-8'}
  )

# When calling write or query functions, specify the retention policy name in options.
```
{{% /code-placeholders %}}

<!-- End Python -->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the [database](#map-v1-databases-and-retention-policies-to-buckets)
- {{% code-placeholder-key %}}`RETENTION_POLICY`{{% /code-placeholder-key %}}: the [retention policy](#map-v1-databases-and-retention-policies-to-buckets)
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb3/cloud-serverless/admin/tokens/) with sufficient permissions to the specified bucket
