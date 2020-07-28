---
title: /write 1.x compatibility API
list_title: /write
description: >
  The `/write` 1.x compatibilty endpoint writes data to InfluxDB 2.0 using patterns from the
  InfluxDB 1.x `/write` API endpoint.
menu:
  v2_0_ref:
    name: /write
    parent: 1.x compatibility
weight: 301
aliases:
  - /v2.0/reference/api/influxdb-1x/write/
v2.0/tags: [write]
products: [cloud]
list_code_example: |
  <pre>
  <span class="api post">POST</span> https://cloud2.influxdata.com/write
  </pre>
related:
  - /v2.0/reference/syntax/line-protocol
---

The `/write` 1.x compatibilty endpoint writes data to InfluxDB 2.0 using patterns from the
InfluxDB 1.x `/write` API endpoint.
Use the `POST` request method to write [line protocol](/v2.0/reference/syntax/line-protocol/)
to the `/write` endpoint.

<pre>
<span class="api post">POST</span> https://cloud2.influxdata.com/write
</pre>

## Authentication
Use **basic authentication** or **token authentication**.
_For more information, see [Authentication](/v2.0/reference/api/influxdb-1x/#authentication)._

## Request body
Include your line protocol in the request body.
**Binary encode** the line protocol to prevent unintended formatting.
The examples [below](#write-examples) use the curl `--data-binary` flag to binary
encode the line protocol.

## Query string parameters

### db
<span class="req">Required</span> – The **database** to write data to.
This is mapped to an InfluxDB 2.0 [bucket](/v2.0/reference/glossary/#bucket).
_See [Database and retention policy mapping](/v2.0/reference/api/influxdb-1x/dbrp/)._

### rp
The **retention policy** to write data to.
This is mapped to an InfluxDB 2.0 [bucket](/v2.0/reference/glossary/#bucket).
_See [Database and retention policy mapping](/v2.0/reference/api/influxdb-1x/dbrp/)._

### precision
The precision of [Unix timestamps](/v2.0/reference/glossary/#unix-timestamp) in the line protocol.
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
curl -XPOST https://cloud2.influxdata.com/write?db=mydb \
  -H "Authorization: Basic username:YourAuthToken" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000"
```

##### Write data to a non-default retention policy
```sh
curl -XPOST https://cloud2.influxdata.com/write?db=mydb&rp=customrp \
  -H "Authorization: Basic username:YourAuthToken" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000"
```

##### Write multiple lines of line protocol
```sh
curl -XPOST https://cloud2.influxdata.com/write?db=mydb \
  -H "Authorization: Token YourAuthToken" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000000000
measurement,host=host2 field1=14i,field2=12.7 1577836800000000000
measurement,host=host3 field1=5i,field2=6.8 1577836800000000000"
```

##### Write data with millisecond Unix timestamps
```sh
curl -XPOST https://cloud2.influxdata.com/write?db=mydb&precision=ms \
  -H "Authorization: Token YourAuthToken" \
  --data-binary "measurement,host=host1 field1=2i,field2=2.0 1577836800000"
```

##### Use curl to write data from a file
```sh
curl -XPOST https://cloud2.influxdata.com/write?db=mydb \
  -H "Authorization: Token YourAuthToken" \
  --data-binary @path/to/line-protocol.txt
```
