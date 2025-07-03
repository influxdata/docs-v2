---
title: /write 1.x compatibility API
list_title: /write
description: >
  The `/write` 1.x compatibility endpoint writes data to InfluxDB Cloud and
  InfluxDB OSS 2.x using patterns from the InfluxDB 1.x `/write` API endpoint.
menu:
  influxdb_v2:
    name: /write
    parent: v1 compatibility
weight: 301
influxdb/v2/tags: [write]
list_code_example: |
  <pre>
  <span class="api post">POST</span> http://localhost:8086/write
  </pre>
related:
  - /influxdb/v2/reference/syntax/line-protocol
aliases:
  - /influxdb/v2/reference/api/influxdb-1x/write/
---

The `/write` 1.x compatibility endpoint writes data to InfluxDB Cloud and InfluxDB OSS {{< current-version >}}
using patterns from the InfluxDB 1.x `/write` API endpoint.
Use the `POST` request method to write [line protocol](/influxdb/v2/reference/syntax/line-protocol/)
to the `/write` endpoint.

<pre>
<span class="api post">POST</span> http://localhost:8086/write
</pre>

{{% show-in "cloud,cloud-serverless" %}}

{{% note %}}
If you have an existing bucket that doesn't follow the `database/retention-policy` naming convention,
you _must_ [manually create a database and retention policy mapping](/influxdb/v2/query-data/influxql/dbrp/#create-dbrp-mappings)
to write data to that bucket with the `/write` compatibility API.
{{% /note %}}

{{% /show-in %}}

## Authentication

{{% show-in "v2" %}}

Use one of the following authentication methods:
- **token authentication**
- **basic authentication with username and password**
- **query string authentication with username and password**

_For more information, see [Authentication](/influxdb/v2/reference/api/influxdb-1x/#authentication)._

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

{{% api/v1-compat/cloud/authentication %}}

{{% /show-in %}}

## Request body
Include your line protocol in the request body.
**Binary encode** the line protocol to prevent unintended formatting.
The examples [below](#write-examples) use the curl `--data-binary` flag to binary
encode the line protocol.

## Query string parameters

{{% show-in "v2" %}}

### u
(Optional) The 1.x **username** to authenticate the request.
_See [query string authentication](/influxdb/v2/reference/api/influxdb-1x/#query-string-authentication)._

### p
(Optional) The 1.x **password** to authenticate the request.
_See [query string authentication](/influxdb/v2/reference/api/influxdb-1x/#query-string-authentication)._

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

### u
(Optional) The InfluxDB Cloud **username** to authenticate the request.
_See [query string authentication](/influxdb/cloud/reference/api/influxdb-1x/#query-string-authentication)._

### p
(Optional) The InfluxDB Cloud **API token** to authenticate the request.
_See [query string authentication](/influxdb/cloud/reference/api/influxdb-1x/#query-string-authentication)._

{{% /show-in %}}

### db
({{< req >}}) The **database** to write data to.
This is mapped to an InfluxDB [bucket](/influxdb/v2/reference/glossary/#bucket).
_See [Database and retention policy mapping](/influxdb/v2/reference/api/influxdb-1x/dbrp/)._

### rp
The **retention policy** to write data to.
This is mapped to an InfluxDB [bucket](/influxdb/v2/reference/glossary/#bucket).
_See [Database and retention policy mapping](/influxdb/v2/reference/api/influxdb-1x/dbrp/)._

### precision
The precision of [Unix timestamps](/influxdb/v2/reference/glossary/#unix-timestamp) in the line protocol.
Default is nanosconds (`ns`).
The following precisions are available:

- `ns` - nanoseconds
- `u` or `µ` - microseconds
- `ms` - milliseconds
- `s` - seconds
- `m` - minutes
- `h` - hours

## Write examples

- [Write data using basic authentication](#write-data-using-basic-authentication)
- [Write data to a non-default retention policy](#write-data-to-a-non-default-retention-policy)
- [Write multiple lines of line protocol](#write-multiple-lines-of-line-protocol)
- [Write data with millisecond Unix timestamps](#write-data-with-millisecond-unix-timestamps)
- [Use curl to write data from a file](#use-curl-to-write-data-from-a-file)

##### Write data using basic authentication

<!--test:setup
```sh
service influxdb start && \
influx setup \
  --username USERNAME \
  --token API_TOKEN \
  --org ORG_NAME \
  --bucket BUCKET_NAME \
  --force || true
```
-->

{{% show-in "v2" %}}

{{% code-placeholders "DATABASE_NAME|USERNAME|PASSWORD_OR_TOKEN|API_TOKEN|exampleuser@influxdata.com" %}}
```sh
curl --request POST http://localhost:8086/write?db=DATABASE_NAME \
  --user "USERNAME:PASSWORD_OR_TOKEN" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000"
```
{{% /code-placeholders %}}

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}
{{% code-placeholders "DATABASE_NAME|USERNAME|PASSWORD_OR_TOKEN|API_TOKEN|exampleuser@influxdata.com" %}}
```sh
curl --request POST https://cloud2.influxdata.com/write?db=DATABASE_NAME \
  --user "exampleuser@influxdata.com:API_TOKEN" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000"
```
{{% /code-placeholders %}}

{{% /show-in %}}

##### Write data using token authentication

{{% code-placeholders "DATABASE_NAME|USERNAME|PASSWORD_OR_TOKEN|API_TOKEN|exampleuser@influxdata.com" %}}
```sh
curl --request POST http://localhost:8086/write?db=DATABASE_NAME \
  --header "Authorization: Token API_TOKEN" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000"
```
{{% /code-placeholders %}}

##### Write data to a non-default retention policy

{{% code-placeholders "DATABASE_NAME|USERNAME|PASSWORD_OR_TOKEN|API_TOKEN|exampleuser@influxdata.com" %}}
```sh
curl --request POST "http://localhost:8086/write?db=DATABASE_NAME&rp=RETENTION_POLICY" \
  --header "Authorization: Token API_TOKEN" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000"
```
{{% /code-placeholders %}}

##### Write multiple lines of line protocol

{{% code-placeholders "DATABASE_NAME|USERNAME|PASSWORD_OR_TOKEN|API_TOKEN|exampleuser@influxdata.com" %}}
```sh
curl --request POST http://localhost:8086/write?db=DATABASE_NAME \
  --header "Authorization: Token API_TOKEN" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000
measurement,host=host2 field1=14i,field2=12.7 1577836800000000000
measurement,host=host3 field1=5i,field2=6.8 1577836800000000000"
```
{{% /code-placeholders %}}

##### Write data with millisecond Unix timestamps

{{% code-placeholders "DATABASE_NAME|USERNAME|PASSWORD_OR_TOKEN|API_TOKEN|exampleuser@influxdata.com" %}}
```sh
curl --request POST "http://localhost:8086/write?db=DATABASE_NAME&precision=ms" \
  --header "Authorization: Token API_TOKEN" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000"
```
{{% /code-placeholders %}}

##### Use curl to write data from a file

{{% code-placeholders "DATABASE_NAME|USERNAME|PASSWORD_OR_TOKEN|API_TOKEN|exampleuser@influxdata.com" %}}
```sh
curl --request POST http://localhost:8086/write?db=DATABASE_NAME \
  --header "Authorization: Token API_TOKEN" \
  --data-binary @path/to/line-protocol.txt
```
{{% /code-placeholders %}}

{{% show-in "v2" %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME` and `RETENTION_POLICY`{{% /code-placeholder-key %}}: the [database and retention policy mapping (DBRP)](/influxdb/v2/reference/api/influxdb-1x/dbrp/) for the InfluxDB v2 bucket that you want to write to
- {{% code-placeholder-key %}}`USERNAME`{{% /code-placeholder-key %}}: your [InfluxDB 1.x username](/influxdb/v2/reference/api/influxdb-1x/#manage-credentials)
- {{% code-placeholder-key %}}`PASSWORD_OR_TOKEN`{{% /code-placeholder-key %}}: your [InfluxDB 1.x password or InfluxDB API token](/influxdb/v2/reference/api/influxdb-1x/#manage-credentials)
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: your [InfluxDB API token](/influxdb/v2/admin/tokens/)

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME` and `RETENTION_POLICY`{{% /code-placeholder-key %}}: the [database and retention policy mapping (DBRP)](/influxdb/v2/reference/api/influxdb-1x/dbrp/) for the InfluxDB v2 bucket that you want to write to
- {{% code-placeholder-key %}}}`exampleuser@influxdata.com`{{% /code-placeholder-key %}}: the email address that you signed up with
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: your [InfluxDB API token](/influxdb/v2/admin/tokens/)

{{% /show-in %}}
