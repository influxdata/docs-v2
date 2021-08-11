---
title: /write 1.x compatibility API
list_title: /write
description: >
  The `/write` 1.x compatibilty endpoint writes data to InfluxDB Cloud using patterns from the
  InfluxDB 1.x `/write` API endpoint.
menu:
  influxdb_cloud_ref:
    name: /write
    parent: 1.x compatibility
weight: 301
influxdb/cloud/tags: [write]
products: [cloud]
list_code_example: |
  <pre>
  <span class="api post">POST</span> https://cloud2.influxdata.com/write
  </pre>
related:
  - /influxdb/cloud/reference/syntax/line-protocol
---

The `/write` 1.x compatibility endpoint writes data to InfluxDB Cloud and InfluxDB OSS 2.0
using patterns from the InfluxDB 1.x `/write` API endpoint.
Use the `POST` request method to write [line protocol](/influxdb/cloud/reference/syntax/line-protocol/)
to the `/write` endpoint.

{{< api-endpoint method="post" endpoint="https://cloud2.influxdata.com/write" >}}

{{% note %}}
If you have an existing bucket that doesn't follow the **database/retention-policy** naming convention,
you **must** [manually create a database and retention policy mapping](/influxdb/cloud/query-data/influxql/#map-unmapped-buckets)
to write data to that bucket with the `/write` compatibility API.
{{% /note %}}

## Authentication

{{% api/v1-compat/cloud/authentication %}}

## Request body
Include your line protocol in the request body.
**Binary encode** the line protocol to prevent unintended formatting.
The examples [below](#write-examples) use the curl `--data-binary` flag to binary
encode the line protocol.

## Query string parameters

### u
(Optional) The InfluxDB Cloud **username** to authenticate the request.
_See [query string authentication](/influxdb/cloud/reference/api/influxdb-1x/#query-string-authentication)._

### p
(Optional) The InfluxDB Cloud **API token** to authenticate the request.
_See [query string authentication](/influxdb/cloud/reference/api/influxdb-1x/#query-string-authentication)._

### db
({{< req >}}) The **database** to write data to.
This is mapped to an InfluxDB [bucket](/influxdb/cloud/reference/glossary/#bucket).
_See [Database and retention policy mapping](/influxdb/cloud/reference/api/influxdb-1x/dbrp/)._

### rp
The **retention policy** to write data to.
This is mapped to an InfluxDB [bucket](/influxdb/cloud/reference/glossary/#bucket).
_See [Database and retention policy mapping](/influxdb/cloud/reference/api/influxdb-1x/dbrp/)._

### precision
The precision of [Unix timestamps](/influxdb/cloud/reference/glossary/#unix-timestamp) in the line protocol.
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
```sh
curl --request POST https://cloud2.influxdata.com/write?db=mydb \
  --user "myusername:YourAuthToken" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000"
```

##### Write data using token authentication
```sh
curl --request POST https://cloud2.influxdata.com/write?db=mydb \
  --header "Authorization: Token YourAuthToken" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000"
```

##### Write data to a non-default retention policy
```sh
curl --request POST https://cloud2.influxdata.com/write?db=mydb&rp=customrp \
  --user "myusername:YourAuthToken" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000"
```

##### Write multiple lines of line protocol
```sh
curl --request POST https://cloud2.influxdata.com/write?db=mydb \
  --header "Authorization: Token YourAuthToken" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000
measurement,host=host2 field1=14i,field2=12.7 1577836800000000000
measurement,host=host3 field1=5i,field2=6.8 1577836800000000000"
```

##### Write data with millisecond Unix timestamps
```sh
curl --request POST https://cloud2.influxdata.com/write?db=mydb&precision=ms \
  --header "Authorization: Token YourAuthToken" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000"
```

##### Use curl to write data from a file
```sh
curl --request POST https://cloud2.influxdata.com/write?db=mydb \
  --header "Authorization: Token YourAuthToken" \
  --data-binary @path/to/line-protocol.txt
```
