---
title: /write 1.x compatibility API
list_title: /write
description: >
  The `/write` 1.x compatibility endpoint writes data to InfluxDB Cloud and
  InfluxDB OSS 2.x using patterns from the InfluxDB 1.x `/write` API endpoint.
menu:
  influxdb_v2_ref:
    name: /write
    parent: 1.x compatibility
weight: 301
influxdb/v2/tags: [write]
list_code_example: |
  <pre>
  <span class="api post">POST</span> http://localhost:8086/write
  </pre>
related:
  - /influxdb/v2/reference/syntax/line-protocol
---

The `/write` 1.x compatibility endpoint writes data to InfluxDB Cloud and InfluxDB OSS {{< current-version >}}
using patterns from the InfluxDB 1.x `/write` API endpoint.
Use the `POST` request method to write [line protocol](/influxdb/v2/reference/syntax/line-protocol/)
to the `/write` endpoint.

<pre>
<span class="api post">POST</span> http://localhost:8086/write
</pre>

{{% cloud-only %}}

{{% note %}}
If you have an existing bucket that doesn't follow the **database/retention-policy** naming convention,
you **must** [manually create a database and retention policy mapping](/influxdb/v2/query-data/influxql/dbrp/#create-dbrp-mappings)
to write data to that bucket with the `/write` compatibility API.
{{% /note %}}

{{% /cloud-only %}}

## Authentication

{{% oss-only %}}

Use one of the following authentication methods:
* **token authentication**
* **basic authentication with username and password**
* **query string authentication with username and password**

_For more information, see [Authentication](/influxdb/v2/reference/api/influxdb-1x/#authentication)._

{{% /oss-only %}}

{{% cloud-only %}}

{{% api/v1-compat/cloud/authentication %}}

{{% /cloud-only %}}

## Request body
Include your line protocol in the request body.
**Binary encode** the line protocol to prevent unintended formatting.
The examples [below](#write-examples) use the curl `--data-binary` flag to binary
encode the line protocol.

## Query string parameters

{{% oss-only %}}

### u
(Optional) The 1.x **username** to authenticate the request.
_See [query string authentication](/influxdb/v2/reference/api/influxdb-1x/#query-string-authentication)._

### p
(Optional) The 1.x **password** to authenticate the request.
_See [query string authentication](/influxdb/v2/reference/api/influxdb-1x/#query-string-authentication)._

{{% /oss-only %}}

{{% cloud-only %}}

### u
(Optional) The InfluxDB Cloud **username** to authenticate the request.
_See [query string authentication](/influxdb/cloud/reference/api/influxdb-1x/#query-string-authentication)._

### p
(Optional) The InfluxDB Cloud **API token** to authenticate the request.
_See [query string authentication](/influxdb/cloud/reference/api/influxdb-1x/#query-string-authentication)._

{{% /cloud-only %}}

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

{{% oss-only %}}

```sh
curl --request POST http://localhost:8086/write?db=mydb \
  --user "INFLUX_USERNAME:INFLUX_PASSWORD_OR_TOKEN" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000"
```

{{% /oss-only %}}

{{% cloud-only %}}

```sh
curl --request POST https://cloud2.influxdata.com/write?db=mydb \
  --user "exampleuser@influxdata.com:INFLUX_API_TOKEN" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000"
```

{{% /cloud-only %}}

##### Write data using token authentication
```sh
curl --request POST http://localhost:8086/write?db=mydb \
  --header "Authorization: Token INFLUX_API_TOKEN" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000"
```

##### Write data to a non-default retention policy

```sh
curl --request POST http://localhost:8086/write?db=mydb&rp=customrp \
  --header "Authorization: Token INFLUX_API_TOKEN" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000"
```



##### Write multiple lines of line protocol
```sh
curl --request POST http://localhost:8086/write?db=mydb \
  --header "Authorization: Token INFLUX_API_TOKEN" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000
measurement,host=host2 field1=14i,field2=12.7 1577836800000000000
measurement,host=host3 field1=5i,field2=6.8 1577836800000000000"
```

##### Write data with millisecond Unix timestamps
```sh
curl --request POST http://localhost:8086/write?db=mydb&precision=ms \
  --header "Authorization: Token INFLUX_API_TOKEN" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000"
```

##### Use curl to write data from a file
```sh
curl --request POST http://localhost:8086/write?db=mydb \
  --header "Authorization: Token INFLUX_API_TOKEN" \
  --data-binary @path/to/line-protocol.txt
```

{{% oss-only %}}

Replace the following:
- *`INFLUX_USERNAME`*: [InfluxDB 1.x username](/influxdb/v2/reference/api/influxdb-1x/#manage-credentials)
- *`INFLUX_PASSWORD_OR_TOKEN`*: [InfluxDB 1.x password or InfluxDB API token](/influxdb/v2/reference/api/influxdb-1x/#manage-credentials)
- *`INFLUX_API_TOKEN`*: your [InfluxDB API token](/influxdb/v2/reference/glossary/#token)

{{% /oss-only %}}

{{% cloud-only %}}

Replace the following:
- *`exampleuser@influxdata.com`*: the email address that you signed up with
- *`INFLUX_API_TOKEN`*: your [InfluxDB API token](/influxdb/cloud/reference/glossary/#token)

{{% /cloud-only %}}
