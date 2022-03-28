---
title: influxdb.api() function
description: >
  The `influxdb.api()` function submits an HTTP request to the specified InfluxDB
  API path and returns a record containing the HTTP status code, response headers,
  and response body as a byte array.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/influxdb/api/
  - /influxdb/cloud/reference/flux/stdlib/experimental/influxdb/api/
menu:
  flux_0_x_ref:
    name: influxdb.api
    parent: influxdb-exp
weight: 401
---

The `influxdb.api()` function submits an HTTP request to the specified InfluxDB
API path and returns a record containing the HTTP status code, response headers,
and response body as a byte array.

`influxdb.api()` uses the authorization of the specified `token` or, if executed from
the InfluxDB UI, the authorization of the InfluxDB user that invokes the script.
Authorization permissions and limits apply to each request.

```js
import "experimental/influxdb"

influxdb.api(
    method: "get",
    path: "/example",
    host: "http://localhost:8086",
    token: "mySupeR53cre7t0k3n",
    headers: ["header1": "header1Value", "header2": "header2Value"],
    query: ["ex1": "example1", "ex2": "example2"],
    timeout: 30s,
    body: bytes(v: "Example body"),
)
```

{{< expand-wrapper >}}
{{% expand "View response record schema" %}}
```js
{
    statusCode: int,
    headers: dict,
    body: bytes,
}
```
{{% /expand %}}
{{< /expand-wrapper >}}

## Parameters

### method {data-type="string"}
({{< req >}}) HTTP request method.

### path {data-type="string"}
({{< req >}}) InfluxDB API path.

### host {data-type="string"}
InfluxDB host URL
_(Required when executed outside of InfluxDB)_.
Default is `""`.

### token {data-type="string"}
InfluxDB [API token](/{{< latest "influxdb" >}}/security/tokens/)
_(Required when executed outside of InfluxDB)_.
Default is `""`.

### headers {data-type="dict"}
HTTP request headers.

### query {data-type="dict"}
URL query parameters.

### timeout {data-type="duration"}
HTTP request timeout.
Default is `30s`.

### body {data-type="bytes"}
HTTP request body as [bytes](/flux/v0.x/stdlib/universe/bytes/).

## Examples

##### Retrieve the health of an InfluxDB OSS instance
{{< keep-url >}}
```js
import "experimental/influxdb"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUX_TOKEN")

response = influxdb.api(method: "get", path: "/health", host: "http://localhost:8086", token: token)

string(v: response.body)
// Returns something similar to:
// {
//   "name":"influxdb",
//   "message":"ready for queries and writes",
//   "status":"pass",
//   "checks":[],
//   "version": "dev",
//   "commit": "000xX0xx0X"
// }
```

##### Create a bucket through the InfluxDB API
```js
import "experimental/influxdb"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUX_TOKEN")

influxdb.api(
    method: "post",
    path: "/api/v2/buckets",
    host: "http://localhost:8086",
    token: token,
    body: bytes(
        v: "{
          \"name\": \"example-bucket\",
          \"description\": \"This is an example bucket.\",
          \"orgID\": \"x000X0x0xx0X00x0\",
          \"retentionRules\": []
        }",
    ),
)
```
