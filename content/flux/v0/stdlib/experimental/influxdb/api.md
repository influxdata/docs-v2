---
title: influxdb.api() function
description: >
  `influxdb.api()` submits an HTTP request to the specified InfluxDB API path and returns a
  record containing the HTTP status code, response headers, and the response body.
menu:
  flux_v0_ref:
    name: influxdb.api
    parent: experimental/influxdb
    identifier: experimental/influxdb/api
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/influxdb/influxdb.flux#L66-L75

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`influxdb.api()` submits an HTTP request to the specified InfluxDB API path and returns a
record containing the HTTP status code, response headers, and the response body.

**Note**: `influxdb.api()` uses the authorization of the specified `token` or, if executed
from the InfluxDB UI, the authorization of the InfluxDB user that invokes the script.
Authorization permissions and limits apply to each request.

## Response format
`influxdb.api()` returns a record with the following properties:

- **statusCode**: HTTP status code returned by the GET request (int).
- **headers**: HTTP response headers (dict).
- **body**: HTTP response body (bytes).

##### Function type signature

```js
(
    method: string,
    path: string,
    ?body: bytes,
    ?headers: [string:string],
    ?host: string,
    ?query: [string:string],
    ?timeout: duration,
    ?token: string,
) => {statusCode: int, headers: [string:string], body: bytes}
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### method
({{< req >}})
HTTP request method.



### path
({{< req >}})
InfluxDB API path.



### host

InfluxDB host URL _(Required when executed outside of InfluxDB)_.
Default is `""`.



### token

[InfluxDB API token](/influxdb/cloud/security/tokens/)
_(Required when executed outside of InfluxDB)_.
Default is `""`.



### headers

HTTP request headers.



### query

URL query parameters.



### timeout

HTTP request timeout. Default is `30s`.



### body

HTTP request body as bytes.




## Examples

- [Retrieve the health of an InfluxDB OSS instance](#retrieve-the-health-of-an-influxdb-oss-instance)
- [Create a bucket through the InfluxDB Cloud API](#create-a-bucket-through-the-influxdb-cloud-api)

### Retrieve the health of an InfluxDB OSS instance

```js
import "experimental/influxdb"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUX_TOKEN")

response = influxdb.api(method: "get", path: "/health", host: "http://localhost:8086", token: token)

string(v: response.body)

```


### Create a bucket through the InfluxDB Cloud API

```js
import "experimental/influxdb"
import "json"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUX_TOKEN")

influxdb.api(
    method: "post",
    path: "/api/v2/buckets",
    host: "https://us-west-2-1.aws.cloud2.influxdata.com",
    token: token,
    body:
        json.encode(
            v: {
                name: "example-bucket",
                description: "This is an example bucket.",
                orgID: "x000X0x0xx0X00x0",
                retentionRules: [],
            },
        ),
)

```

