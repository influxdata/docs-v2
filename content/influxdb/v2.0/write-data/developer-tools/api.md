---
title: InfluxDB API
seotitle: Write data with the InfluxDB API
list_title: Write data with the InfluxDB API
weight: 206
description: >
  Write data to InfluxDB using the InfluxDB API.
menu:
  influxdb_2_0:
    name: InfluxDB API
    parent: Developer tools
---
Write data to InfluxDB using an HTTP request to the InfluxDB API `/write` endpoint.
Use the `POST` request method and include the following in your request:

| Requirement          | Include by                                               |
|:-----------          |:----------                                               |
| Organization         | Use the `org` query parameter in your request URL.       |
| Bucket               | Use the `bucket` query parameter in your request URL.    |
| Precision            | Use the `precision` query parameter in your request URL. |
| Authentication token | Use the `Authorization: Token` header.                   |
| Line protocol        | Pass as plain text in your request body.                 |

#### Example API write request

Below is an example API write request using `curl`.
The URL depends on the version and location of your InfluxDB 2.0 instance _(see [InfluxDB URLs](/influxdb/v2.0/reference/urls/))_.

To compress data when writing to InfluxDB, set the `Content-Encoding` header to `gzip`.
Compressing write requests reduces network bandwidth, but increases server-side load.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Uncompressed](#)
[Compressed](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
curl -XPOST "http://localhost:9999/api/v2/write?org=YOUR_ORG&bucket=YOUR_BUCKET&precision=s" \
  --header "Authorization: Token YOURAUTHTOKEN" \
  --data-raw "
mem,host=host1 used_percent=23.43234543 1556896326
mem,host=host2 used_percent=26.81522361 1556896326
mem,host=host1 used_percent=22.52984738 1556896336
mem,host=host2 used_percent=27.18294630 1556896336
"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
curl -XPOST "http://localhost:9999/api/v2/write?org=YOUR_ORG&bucket=YOUR_BUCKET&precision=s" \
  --header "Authorization: Token YOURAUTHTOKEN" \
  --header "Content-Encoding: gzip" \
  --data-raw "
mem,host=host1 used_percent=23.43234543 1556896326
mem,host=host2 used_percent=26.81522361 1556896326
mem,host=host1 used_percent=22.52984738 1556896336
mem,host=host2 used_percent=27.18294630 1556896336
"
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

_For information about **InfluxDB API response codes**, see
[InfluxDB API Write documentation](/influxdb/v2.0/api/#operation/PostWrite)._
