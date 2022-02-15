---
title: requests.post() function
description: >
  `requests.post()` makes an HTTP request using the POST request method.
menu:
  flux_0_x_ref:
    name: requests.post
    parent: requests
weight: 401
flux/v0.x/tags: [http, inputs, outputs]
introduced: 0.152.0
---

`requests.post()` makes an HTTP request using the POST request method.

```js
import "experimental/http/requests"

requests.post(
    url: "http://example.com",
    params: ["example-param": ["example-param-value"]],
    headers: ["Example-Header": "example-header-value"],
    body: bytes(v: ""),
    config: requests.defaultConfig,
)
```

`requests.post()` returns a record with the following properties:

- **statusCode**: HTTP status code of the request.
- **body**: Response body. A maximum size of 100MB is read from the response body.
- **headers**: Response headers.

## Parameters

### url {data-type="string"}
URL to send the request to.

{{% note %}}
The URL should not include any query parameters.
Use [`params`](#params) to specify query parameters.
{{% /note %}}

### params {data-type="dict"}
Set of key-value pairs to add to the URL as query parameters.
Query parameters are URL-encoded.
All values for a key are appended to the query.

### headers {data-type="dict"}
Set of key values pairs to include as request headers.

### body {data-type="bytes"}
Data to send with the request.

### config {data-type="record"}
Set of request configuration options.
_See [HTTP configuration option examples](/flux/v0.x/stdlib/experimental/http/requests/#examples)._

## Examples

- [Make a POST request](#make-a-post-request)
- [Make a POST request with authorization](#make-a-post-request-with-authorization)
- [Make a POST request with a JSON body](#make-a-post-request-with-a-json-body)
- [Output HTTP POST response data in a table](#output-http-post-response-data-in-a-table)

### Make a POST request
```js
import "json"
import "experimental/http/requests"

requests.post(url:"http://example.com", body: json.encode(v: {data: {x:1, y: 2, z:3}))
```

### Make a POST request with authorization
```js
import "json"
import "experimental/http/requests"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "TOKEN")

requests.post(
    url: "http://example.com",
    body: json.encode(v: {data: {x: 1, y: 2, z: 3}}),
    headers: ["Authorization": "Bearer ${token}"],
)
```

### Make a POST request with a JSON body
Use [`json.encode()`](/flux/v0.x/stdlib/json/encode/) to encode a Flux record as
a JSON object.

```js
import "experimental/http/requests"
import "json"

requests.post(
    url: "https://goolnk.com/api/v1/shorten",
    body: json.encode(v: {url: "http://www.influxdata.com"}),
    headers: ["Content-Type": "application/json"],
)
```

### Output HTTP POST response data in a table
To quickly inspect HTTP response data, use [`requests.peek()`](/flux/v0.x/stdlib/experimental/http/requests/peek/)
to output HTTP response data in a table.

```js
import "experimental/http/requests"

response = requests.post(url: "http://example.com")

requests.peek(repsonse: response)
```
