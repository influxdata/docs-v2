---
title: requests.post() function
description: >
  `requests.post()` makes an HTTP request using the POST request method.
menu:
  flux_0_x_ref:
    name: requests.post
    parent: requests
weight: 401
flux/v0.x/tags: [http, inputs]
introduced: 0.152.0
---

`requests.post()` makes an HTTP request using the POST request method.

```js
import "experimental/http/requests"

requests.post(
    url: "http://example.com",
    params: [:],
    headers: [:],
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

### Output HTTP response data in a table
```js
import "array"
import "dict"
import "experimental/http/requests"

resp = requests.post(url: "http://example.com")

array.from(
    rows: [
        {
            body: string(v: resp.body),
            statusCode: resp.statusCode,
            date: dict.get(dict: resp.headers, key: "Date", default: ""),
        },
    ],
)
```
