---
title: Write data with the InfluxDB API
weight: 206
description: >
  Use the `/write` endpoint of the InfluxDB API to write data to InfluxDB.
menu:
  influxdb_cloud:
    parent: Developer tools
    name: Write API
---
Write data to InfluxDB using an HTTP request to the InfluxDB API `/write` endpoint.
Use the `POST` request method and include the following in your request:

| Requirement          | Include by                                               |
|:-----------          |:----------                                               |
| Organization         | Use the `org` query parameter in your request URL.       |
| Bucket               | Use the `bucket` query parameter in your request URL.    |
| Precision            | Use the `precision` query parameter in your request URL. |
| API token | Use the `Authorization: Token YOUR_API_TOKEN` header.                   |
| Line protocol        | Pass as plain text in your request body.                 |

#### Send a write request 

The URL in the examples depends on your [InfluxDB Cloud region](/influxdb/cloud/reference/regions/).

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
{{< get-shared-text "api/v2.0/write/write.sh" >}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
{{< get-shared-text "api/v2.0/write/write.sh" >}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% note %}}
##### Use gzip compression with the InfluxDB API

When using the InfluxDB API `/write` endpoint to write data, compress the data with `gzip` and set the `Content-Encoding`
header to `gzip`.
Compression reduces network bandwidth, but increases server-side load.

```sh
{{% get-shared-text "api/v2.0/write/write-compress.sh" %}}
```
{{% /note %}}

_For information about **InfluxDB API response codes**, see
[InfluxDB API Write documentation](/influxdb/cloud/api/#operation/PostWrite)._
